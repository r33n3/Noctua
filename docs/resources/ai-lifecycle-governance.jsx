import { useState } from "react";

const stages = [
  {
    id: "stage0",
    label: "STAGE 0",
    title: "Design, Scoping & Experimentation",
    color: "#1a1a2e",
    accent: "#e94560",
    isExtension: true,
    gloeNote: "Extends GLOE — not in AWS framework",
    skills: ["/think", "/spec", "/worktree"],
    activities: [
      "Use case ideation & intake",
      "Rapid prototyping in isolated worktrees",
      "Model benchmarking & comparison",
      "Tool & approach experimentation",
      "Fail fast — kill or proceed",
    ],
    governance: {
      pearl: "Project scoping state — no active governance yet",
      aiuc1: "Compliance frameworks identified (not evaluated)",
      gate: "Lightweight guardrails only",
      defense: "AI Gateway (basic): PII scanning, cost limits, identity, no prod access",
    },
    gateOut: {
      name: "USE CASE CONTRACT",
      desc: "Evidence-based declaration of models, tools, agents, data, compliance requirements",
      color: "#e94560",
    },
  },
  {
    id: "stage1",
    label: "STAGE 1",
    title: "Development (PoC & Build)",
    color: "#16213e",
    accent: "#0f3460",
    isExtension: false,
    gloeNote: "Aligns with GLOE Stage 1: Development",
    skills: ["/think", "/spec", "/worktree", "/retro"],
    activities: [
      "Build to use case contract",
      "Context engineering & prompt lifecycle",
      "Model selection (per contract)",
      "MCP server development",
      "Evaluation loops & quality testing",
      "Deviations → quick approval update",
    ],
    governance: {
      pearl: "Active governance — developer MCP profile, findings generate",
      aiuc1: "Domains B (Security) & E (Accountability) — foundational controls",
      gate: "Role gates, API auth, input validation",
      defense: "Layers 1–2: Soft controls + Application controls",
    },
    gateOut: {
      name: "PeaRL GATE 1: Dev → Preprod",
      desc: "Contract fulfilled? Findings resolved? CI/CD security validation passed? Reviewer approved?",
      color: "#0f3460",
    },
  },
  {
    id: "stage2",
    label: "STAGE 2",
    title: "Preproduction (Validation & Hardening)",
    color: "#1a1a2e",
    accent: "#533483",
    isExtension: false,
    gloeNote: "Aligns with GLOE Stage 2: Preproduction",
    skills: ["/spec", "/retro"],
    activities: [
      "Contract locked — no deviations",
      "Adversarial testing (red team)",
      "Guardrail validation",
      "Multi-layered testing framework",
      "AI gateway hardened",
      "Deep observability & tracing",
      "CI/CD pipeline security gates",
    ],
    governance: {
      pearl: "Reviewer oversight — all exceptions must be decided",
      aiuc1: "Domains A, B, D full depth + C, F validation",
      gate: "PreToolUse hooks, behavioral monitoring (AGP-01–05)",
      defense: "Layers 2–3: Application + Execution environment controls",
    },
    gateOut: {
      name: "PeaRL GATE 2: Preprod → Prod",
      desc: "All AIUC-1 domains validated? Red team passed? Behavioral monitoring active? Guardrails held?",
      color: "#533483",
    },
  },
  {
    id: "stage3",
    label: "STAGE 3",
    title: "Production (Deploy & Monitor)",
    color: "#16213e",
    accent: "#2b6777",
    isExtension: false,
    gloeNote: "Aligns with GLOE Stage 3: Production",
    skills: [],
    activities: [
      "Deploy governed system",
      "Continuous monitoring & drift detection",
      "Feedback loops & improvement cycles",
      "Shadow testing for updates",
      "Cost tracking & optimization",
      "Periodic governance reassessment",
      "Incident response procedures",
    ],
    governance: {
      pearl: "JWT-only auth — no local-mode flags, architectural isolation",
      aiuc1: "All 6 domains at full depth — continuous compliance",
      gate: "Full AI gateway: rate limiting, content moderation, anomaly alerting",
      defense: "Layers 3–4: Execution environment + Infrastructure controls",
    },
    gateOut: null,
  },
];

const registries = [
  { name: "Model Registry", desc: "Approved models, versions, cost profiles, data classification clearance", icon: "◆" },
  { name: "MCP/Tool Registry", desc: "Available tool servers, capabilities, access scopes, owners", icon: "◇" },
  { name: "Agent Registry", desc: "Existing agents, autonomy levels, capabilities, governance status", icon: "△" },
  { name: "Skill/Prompt Registry", desc: "Validated prompts, skills, eval scores, context cost", icon: "○" },
];

export default function GLOEExtension() {
  const [activeStage, setActiveStage] = useState("stage0");
  const [showLayer, setShowLayer] = useState("all");

  const active = stages.find((s) => s.id === activeStage);

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'SF Mono', 'Fira Code', monospace",
      background: "#0a0a0f",
      color: "#e0e0e0",
      minHeight: "100vh",
      padding: "24px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32, borderBottom: "1px solid #333", paddingBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 4 }}>
          Extending AWS Prescriptive Guidance
        </div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          margin: 0,
          background: "linear-gradient(90deg, #e94560, #533483, #2b6777)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          AI Lifecycle Governance Framework
        </h1>
        <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
          GLOE + PeaRL + AIUC-1 + Engineering Assessment Stack
        </div>
      </div>

      {/* Layer filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "activities", "governance", "defense", "registries"].map((l) => (
          <button
            key={l}
            onClick={() => setShowLayer(l)}
            style={{
              background: showLayer === l ? "#e94560" : "#1a1a2e",
              color: showLayer === l ? "#fff" : "#888",
              border: "1px solid #333",
              padding: "4px 12px",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Stage timeline */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, overflow: "auto" }}>
        {stages.map((stage, i) => (
          <div key={stage.id} style={{ display: "flex", alignItems: "stretch", flex: 1, minWidth: 140 }}>
            <button
              onClick={() => setActiveStage(stage.id)}
              style={{
                flex: 1,
                background: activeStage === stage.id ? stage.accent : "#111118",
                border: activeStage === stage.id ? `2px solid ${stage.accent}` : "1px solid #222",
                borderBottom: activeStage === stage.id ? `3px solid ${stage.accent}` : "1px solid #222",
                padding: "10px 8px",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                transition: "all 0.2s",
              }}
            >
              {stage.isExtension && (
                <div style={{
                  position: "absolute",
                  top: 2,
                  right: 4,
                  fontSize: 7,
                  color: "#e94560",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}>
                  EXTENSION
                </div>
              )}
              <div style={{ fontSize: 9, letterSpacing: 2, color: activeStage === stage.id ? "#fff" : "#666" }}>
                {stage.label}
              </div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: activeStage === stage.id ? "#fff" : "#aaa",
                marginTop: 4,
                lineHeight: 1.3,
              }}>
                {stage.title}
              </div>
            </button>
            {stage.gateOut && (
              <div style={{
                width: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0a0a0f",
                position: "relative",
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  border: `2px solid ${stage.gateOut.color}`,
                  transform: "rotate(45deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#0a0a0f",
                }}>
                  <span style={{ transform: "rotate(-45deg)", fontSize: 9, color: stage.gateOut.color }}>⬥</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active stage detail */}
      {active && (
        <div style={{
          border: `1px solid ${active.accent}`,
          background: active.color,
          padding: 20,
          marginBottom: 20,
        }}>
          {/* Stage header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{active.title}</div>
              <div style={{
                fontSize: 10,
                color: active.isExtension ? "#e94560" : "#6c6",
                marginTop: 4,
                letterSpacing: 1,
              }}>
                {active.isExtension ? "⬥ " : "✓ "}{active.gloeNote}
              </div>
            </div>
            {active.skills.length > 0 && (
              <div style={{ display: "flex", gap: 6 }}>
                {active.skills.map((s) => (
                  <span key={s} style={{
                    background: "#222",
                    border: "1px solid #444",
                    padding: "2px 8px",
                    fontSize: 10,
                    color: "#e94560",
                    fontWeight: 600,
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Activities */}
            {(showLayer === "all" || showLayer === "activities") && (
              <div style={{ background: "#0a0a12", padding: 14, border: "1px solid #222" }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 10 }}>
                  Key Activities
                </div>
                {active.activities.map((a, i) => (
                  <div key={i} style={{ fontSize: 11, color: "#ccc", marginBottom: 6, paddingLeft: 12, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: active.accent }}>›</span>
                    {a}
                  </div>
                ))}
              </div>
            )}

            {/* Governance */}
            {(showLayer === "all" || showLayer === "governance") && (
              <div style={{ background: "#0a0a12", padding: 14, border: "1px solid #222" }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 10 }}>
                  Governance Controls
                </div>
                {Object.entries(active.governance).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
                      {key === "pearl" ? "PeaRL" : key === "aiuc1" ? "AIUC-1" : key === "gate" ? "Gate Controls" : "Defense Layer"}
                    </div>
                    <div style={{ fontSize: 11, color: "#ccc", marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Defense layer visual */}
          {(showLayer === "all" || showLayer === "defense") && (
            <div style={{ marginTop: 16, background: "#0a0a12", padding: 14, border: "1px solid #222" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 10 }}>
                Defense in Depth — Active Layers
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { name: "L1: Soft Controls", desc: "CLAUDE.md, prompts, docs", active: ["stage0", "stage1", "stage2", "stage3"] },
                  { name: "L2: Application", desc: "Role gates, 403s, auth", active: ["stage1", "stage2", "stage3"] },
                  { name: "L3: Exec Environment", desc: "PreToolUse hooks, AGP", active: ["stage2", "stage3"] },
                  { name: "L4: Infrastructure", desc: "chmod, containers, Vault", active: ["stage3"] },
                ].map((layer, i) => {
                  const isActive = layer.active.includes(activeStage);
                  return (
                    <div key={i} style={{
                      flex: 1,
                      padding: "8px 6px",
                      background: isActive ? `${active.accent}22` : "#111",
                      border: isActive ? `1px solid ${active.accent}` : "1px solid #1a1a1a",
                      textAlign: "center",
                      opacity: isActive ? 1 : 0.3,
                      transition: "all 0.3s",
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: isActive ? active.accent : "#444" }}>{layer.name}</div>
                      <div style={{ fontSize: 8, color: "#666", marginTop: 4 }}>{layer.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gate out */}
          {active.gateOut && (
            <div style={{
              marginTop: 16,
              padding: 12,
              border: `1px dashed ${active.gateOut.color}`,
              background: `${active.gateOut.color}11`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: active.gateOut.color, letterSpacing: 1 }}>
                ⬥ GATE: {active.gateOut.name}
              </div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{active.gateOut.desc}</div>
            </div>
          )}
        </div>
      )}

      {/* Registries */}
      {(showLayer === "all" || showLayer === "registries") && (
        <div style={{
          border: "1px solid #222",
          background: "#111118",
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 12 }}>
            Registries — Persistent Across All Stages
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {registries.map((r) => (
              <div key={r.name} style={{ padding: 10, background: "#0a0a12", border: "1px solid #222" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e94560" }}>
                  {r.icon} {r.name}
                </div>
                <div style={{ fontSize: 10, color: "#777", marginTop: 4, lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flow summary */}
      <div style={{
        border: "1px solid #222",
        background: "#111118",
        padding: 16,
      }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 12 }}>
          Lifecycle Flow
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, fontSize: 10, overflow: "auto" }}>
          {[
            { text: "Ideation", sub: "/think /spec", bg: "#e94560" },
            { text: "→", sub: "", bg: "transparent" },
            { text: "Prototype", sub: "/worktree", bg: "#e94560" },
            { text: "→", sub: "", bg: "transparent" },
            { text: "Viable?", sub: "fail fast", bg: "#e94560" },
            { text: "→", sub: "", bg: "transparent" },
            { text: "Contract", sub: "use case", bg: "#e94560", border: true },
            { text: "⬥", sub: "", bg: "transparent" },
            { text: "Dev", sub: "build to contract", bg: "#0f3460" },
            { text: "⬥", sub: "", bg: "transparent" },
            { text: "Preprod", sub: "validate", bg: "#533483" },
            { text: "⬥", sub: "", bg: "transparent" },
            { text: "Prod", sub: "monitor", bg: "#2b6777" },
          ].map((item, i) => (
            item.text === "→" || item.text === "⬥" ? (
              <span key={i} style={{ color: "#444", fontSize: 14, padding: "0 4px" }}>{item.text}</span>
            ) : (
              <div key={i} style={{
                background: item.bg,
                padding: "6px 10px",
                textAlign: "center",
                border: item.border ? "2px solid #fff" : "none",
                minWidth: 70,
              }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 10 }}>{item.text}</div>
                {item.sub && <div style={{ fontSize: 8, color: "#ccc", marginTop: 2 }}>{item.sub}</div>}
              </div>
            )
          ))}
        </div>
        <div style={{ fontSize: 9, color: "#555", marginTop: 10, textAlign: "center" }}>
          ⬥ = PeaRL governance gate  |  Stage 0 (red) extends GLOE  |  Stages 1–3 align with AWS GLOE framework
        </div>
      </div>
    </div>
  );
}
