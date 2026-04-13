#!/usr/bin/env python3
"""
MASS Managed Agents — Deploy / Update / Test

Usage:
  python deploy.py deploy     # create all agents, patch orchestrator callable_agents
  python deploy.py status     # list deployed agents and their IDs
  python deploy.py update     # update existing agents (idempotent re-deploy)
  python deploy.py delete     # delete all MASS agents from the workspace
  python deploy.py test       # run a smoke-test scan against a local sample target
  python deploy.py ids        # print agent IDs in shell-export format

Requires:
  ANTHROPIC_API_KEY env var
  pip install anthropic pyyaml

The script writes discovered agent IDs to agent_ids.json after deploy.
On subsequent runs (update), it reads that file to PATCH existing agents.
"""

import json
import os
import sys
import time
from pathlib import Path
from typing import Any

import httpx
import yaml

API_BASE = "https://api.anthropic.com/v1"
BETA_HEADER = "managed-agents-2026-04-01"
IDS_FILE = Path(__file__).parent / "agent_ids.json"

# Deploy order matters: workers first, then orchestrator (needs their IDs)
DEPLOY_ORDER = [
    "02-static-analysis.yaml",
    "03-redteam.yaml",
    "04-mcp-security.yaml",
    "05-security-judge.yaml",
    "06-remediation-judge.yaml",
    "07-evidence-judge.yaml",
    "01-orchestrator.yaml",  # last — patches callable_agents with real IDs
]

# Slug → file mapping for lookup
SLUG_MAP = {
    "mass-static-analysis": "02-static-analysis.yaml",
    "mass-redteam": "03-redteam.yaml",
    "mass-mcp-security": "04-mcp-security.yaml",
    "mass-security-judge": "05-security-judge.yaml",
    "mass-remediation-judge": "06-remediation-judge.yaml",
    "mass-evidence-judge": "07-evidence-judge.yaml",
    "mass-orchestrator": "01-orchestrator.yaml",
}


def _api_key() -> str:
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        print("ERROR: ANTHROPIC_API_KEY not set")
        sys.exit(1)
    return key


def _headers() -> dict:
    return {
        "x-api-key": _api_key(),
        "anthropic-version": "2023-06-01",
        "anthropic-beta": BETA_HEADER,
        "content-type": "application/json",
    }


def _load_yaml(path: Path) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def _yaml_to_api_body(spec: dict, known_ids: dict[str, str]) -> dict:
    """Convert YAML spec to Agents API request body."""
    body: dict[str, Any] = {
        "name": spec["name"],
        "description": spec.get("description", "").strip(),
        "model": spec["model"],
        "system_prompt": spec.get("system", "").strip(),
    }

    # Tools
    tools = []
    for t in spec.get("tools", []):
        if isinstance(t, dict) and t.get("type") == "agent_toolset_20260401":
            tools.append({"type": "agent_toolset_20260401"})
    if tools:
        body["tools"] = tools

    # callable_agents — substitute real IDs
    callable_agents = []
    for ca in spec.get("callable_agents", []):
        name = ca.get("name", "")
        agent_id = ca.get("agent_id", "FILL_IN_AFTER_CREATE")
        # Look up real ID from known_ids
        real_id = known_ids.get(name) or known_ids.get(_slug(name))
        if real_id:
            agent_id = real_id
        if agent_id != "FILL_IN_AFTER_CREATE":
            callable_agents.append({"agent_id": agent_id})
        else:
            print(f"  WARNING: no ID found for callable agent '{name}' — skipping")
    if callable_agents:
        body["callable_agents"] = callable_agents

    # MCP servers
    if spec.get("mcp_servers"):
        body["mcp_servers"] = spec["mcp_servers"]

    return body


def _slug(name: str) -> str:
    """Convert display name to slug: 'MASS Red Team' → 'mass-redteam'"""
    return name.lower().replace(" ", "-").replace("_", "-")


def _load_ids() -> dict[str, str]:
    if IDS_FILE.exists():
        return json.loads(IDS_FILE.read_text())
    return {}


def _save_ids(ids: dict[str, str]) -> None:
    IDS_FILE.write_text(json.dumps(ids, indent=2))
    print(f"  Saved agent IDs → {IDS_FILE}")


def _create_agent(client: httpx.Client, body: dict) -> dict:
    r = client.post(f"{API_BASE}/agents", json=body)
    r.raise_for_status()
    return r.json()


def _update_agent(client: httpx.Client, agent_id: str, body: dict) -> dict:
    r = client.put(f"{API_BASE}/agents/{agent_id}", json=body)
    r.raise_for_status()
    return r.json()


def _list_agents(client: httpx.Client) -> list[dict]:
    agents = []
    after = None
    while True:
        params = {"limit": 100}
        if after:
            params["after_id"] = after
        r = client.get(f"{API_BASE}/agents", params=params)
        r.raise_for_status()
        data = r.json()
        agents.extend(data.get("data", []))
        if not data.get("has_more"):
            break
        after = agents[-1]["id"]
    return agents


def _delete_agent(client: httpx.Client, agent_id: str) -> None:
    r = client.delete(f"{API_BASE}/agents/{agent_id}")
    r.raise_for_status()


def cmd_deploy(yaml_dir: Path) -> None:
    """Create all agents. Workers first, orchestrator last with real IDs."""
    client = httpx.Client(headers=_headers(), timeout=30)
    known_ids = _load_ids()

    print(f"\nDeploying {len(DEPLOY_ORDER)} MASS agents...\n")

    for filename in DEPLOY_ORDER:
        path = yaml_dir / filename
        if not path.exists():
            print(f"  SKIP {filename} (not found)")
            continue

        spec = _load_yaml(path)
        name = spec["name"]
        slug = _slug(name)

        # Skip if already exists (use update instead)
        if slug in known_ids:
            print(f"  EXISTS {name} ({known_ids[slug]}) — run 'update' to refresh")
            continue

        body = _yaml_to_api_body(spec, known_ids)
        print(f"  Creating {name}...", end=" ", flush=True)

        try:
            result = _create_agent(client, body)
            agent_id = result["id"]
            known_ids[slug] = agent_id
            # Also index by display name variants
            known_ids[name] = agent_id
            _save_ids(known_ids)
            print(f"OK  {agent_id}")
        except httpx.HTTPStatusError as e:
            print(f"FAILED\n    {e.response.status_code}: {e.response.text}")
            sys.exit(1)

        time.sleep(0.5)  # gentle rate limiting

    print("\nDeploy complete.")
    cmd_status(yaml_dir)


def cmd_update(yaml_dir: Path) -> None:
    """Re-upload all agent specs (idempotent). Creates if missing."""
    client = httpx.Client(headers=_headers(), timeout=30)
    known_ids = _load_ids()

    if not known_ids:
        print("No agent_ids.json found — running deploy instead.")
        cmd_deploy(yaml_dir)
        return

    print(f"\nUpdating {len(DEPLOY_ORDER)} MASS agents...\n")

    for filename in DEPLOY_ORDER:
        path = yaml_dir / filename
        if not path.exists():
            print(f"  SKIP {filename} (not found)")
            continue

        spec = _load_yaml(path)
        name = spec["name"]
        slug = _slug(name)
        body = _yaml_to_api_body(spec, known_ids)

        if slug in known_ids:
            agent_id = known_ids[slug]
            print(f"  Updating {name} ({agent_id})...", end=" ", flush=True)
            try:
                _update_agent(client, agent_id, body)
                print("OK")
            except httpx.HTTPStatusError as e:
                print(f"FAILED\n    {e.response.status_code}: {e.response.text}")
        else:
            print(f"  Creating {name}...", end=" ", flush=True)
            try:
                result = _create_agent(client, body)
                agent_id = result["id"]
                known_ids[slug] = agent_id
                known_ids[name] = agent_id
                _save_ids(known_ids)
                print(f"OK  {agent_id}")
            except httpx.HTTPStatusError as e:
                print(f"FAILED\n    {e.response.status_code}: {e.response.text}")

        time.sleep(0.3)

    print("\nUpdate complete.")


def cmd_status(yaml_dir: Path) -> None:
    """List all agents in workspace, highlighting MASS agents."""
    client = httpx.Client(headers=_headers(), timeout=30)
    known_ids = _load_ids()
    # Invert: id → slug
    id_to_slug = {v: k for k, v in known_ids.items() if k.startswith("mass-")}

    print("\nWorkspace agents:")
    try:
        agents = _list_agents(client)
    except httpx.HTTPStatusError as e:
        print(f"  ERROR: {e.response.status_code}: {e.response.text}")
        return

    for agent in agents:
        marker = " ←" if agent["id"] in id_to_slug else ""
        print(f"  {agent['id']}  {agent['name']}{marker}")

    print(f"\n{len(agents)} total agents ({len(id_to_slug)} MASS agents tracked)")
    if known_ids:
        print("\nTracked IDs (agent_ids.json):")
        for slug, aid in sorted(known_ids.items()):
            if slug.startswith("mass-"):
                print(f"  {slug:<35} {aid}")


def cmd_ids(_yaml_dir: Path) -> None:
    """Print agent IDs as shell exports for scripting."""
    known_ids = _load_ids()
    if not known_ids:
        print("No agent_ids.json — run 'deploy' first")
        return
    for slug, aid in sorted(known_ids.items()):
        if slug.startswith("mass-"):
            env_name = slug.upper().replace("-", "_") + "_ID"
            print(f'export {env_name}="{aid}"')


def cmd_delete(_yaml_dir: Path) -> None:
    """Delete all tracked MASS agents from the workspace."""
    known_ids = _load_ids()
    if not known_ids:
        print("Nothing to delete (no agent_ids.json)")
        return

    slugs = [k for k in known_ids if k.startswith("mass-")]
    if not slugs:
        print("No mass-* entries in agent_ids.json")
        return

    confirm = input(f"Delete {len(slugs)} MASS agents? [y/N] ").strip().lower()
    if confirm != "y":
        print("Aborted.")
        return

    client = httpx.Client(headers=_headers(), timeout=30)
    for slug in slugs:
        agent_id = known_ids[slug]
        print(f"  Deleting {slug} ({agent_id})...", end=" ", flush=True)
        try:
            _delete_agent(client, agent_id)
            print("OK")
        except httpx.HTTPStatusError as e:
            print(f"FAILED  {e.response.status_code}")

    IDS_FILE.unlink(missing_ok=True)
    print("\nAll MASS agents deleted. agent_ids.json removed.")


def cmd_test(yaml_dir: Path) -> None:
    """
    Run a smoke-test scan session using the deployed orchestrator.
    Points at the MASS 2.0 repo itself as the scan target.
    """
    known_ids = _load_ids()
    orchestrator_slug = "mass-orchestrator"
    orch_id = known_ids.get(orchestrator_slug) or known_ids.get("MASS Security Orchestrator")

    if not orch_id:
        print("Orchestrator not deployed yet — run 'deploy' first")
        return

    # Use the MASS repo itself as a scan target (meta!)
    scan_target = str(Path(__file__).parent.parent)
    print(f"\nSmoke-test scan")
    print(f"  Orchestrator: {orch_id}")
    print(f"  Target:       {scan_target}")
    print()

    payload = {
        "agent_id": orch_id,
        "max_turns": 40,
        "messages": [
            {
                "role": "user",
                "content": (
                    f"Scan this AI deployment for security vulnerabilities.\n\n"
                    f"deployment_path: {scan_target}\n\n"
                    "Run the full MASS DAG: discovery, static analysis, MCP security, "
                    "red team (if warranted), compliance, learned patterns, tribunal verdict, "
                    "policy generation, and final report."
                ),
            }
        ],
    }

    client = httpx.Client(headers=_headers(), timeout=300)
    print("Starting session (this will take a few minutes)...\n")

    try:
        r = client.post(f"{API_BASE}/agents/sessions", json=payload)
        r.raise_for_status()
        session = r.json()
    except httpx.HTTPStatusError as e:
        print(f"ERROR starting session: {e.response.status_code}: {e.response.text}")
        return

    session_id = session.get("id", "unknown")
    print(f"Session: {session_id}")

    # Stream or poll for completion
    if "output" in session:
        # Synchronous response
        _print_session_output(session)
    else:
        # Poll
        _poll_session(client, session_id)


def _poll_session(client: httpx.Client, session_id: str, poll_interval: int = 5) -> None:
    print("Polling for completion...", flush=True)
    while True:
        time.sleep(poll_interval)
        try:
            r = client.get(f"{API_BASE}/agents/sessions/{session_id}")
            r.raise_for_status()
            session = r.json()
        except httpx.HTTPStatusError as e:
            print(f"Poll error: {e.response.status_code}")
            continue

        status = session.get("status", "unknown")
        print(f"  [{status}]", end="\r", flush=True)

        if status in ("completed", "failed", "error"):
            print()
            _print_session_output(session)
            break


def _print_session_output(session: dict) -> None:
    status = session.get("status", "unknown")
    print(f"\nSession status: {status}")

    messages = session.get("output", session.get("messages", []))
    for msg in messages:
        if msg.get("role") == "assistant":
            content = msg.get("content", "")
            if isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        print(block["text"])
            else:
                print(content)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"
    yaml_dir = Path(__file__).parent

    commands = {
        "deploy": cmd_deploy,
        "update": cmd_update,
        "status": cmd_status,
        "delete": cmd_delete,
        "test": cmd_test,
        "ids": cmd_ids,
    }

    if cmd not in commands:
        print(__doc__)
        sys.exit(0 if cmd == "help" else 1)

    commands[cmd](yaml_dir)
