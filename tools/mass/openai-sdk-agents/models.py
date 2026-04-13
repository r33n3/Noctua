"""Shared Pydantic models for MASS OpenAI SDK agents."""

from typing import Optional
from pydantic import BaseModel


# ── Finding schema (matches MASS canonical format) ──────────────────────────

class Evidence(BaseModel):
    type: str
    file: Optional[str] = None
    line: Optional[int] = None
    server: Optional[str] = None
    attack: Optional[str] = None
    response: Optional[str] = None
    detail: str

class Remediation(BaseModel):
    steps: list[str]

class Finding(BaseModel):
    id: str
    title: str
    severity: str          # critical|high|medium|low|info
    category: str
    source: str            # static_analysis|redteam|mcp_security|learned_patterns
    description: str
    evidence: list[Evidence]
    remediation: Remediation
    confidence: float


# ── Agent output schemas ─────────────────────────────────────────────────────

class StaticAnalysisOutput(BaseModel):
    findings: list[Finding]

class RedTeamOutput(BaseModel):
    findings: list[Finding]
    sessions_completed: int
    turns_used: int
    attacks_attempted: list[str]

class McpSecurityOutput(BaseModel):
    findings: list[Finding]
    servers_analyzed: list[str]
    tools_analyzed: int

class JudgeOutput(BaseModel):
    recommendation: str        # approve|approve_with_constraints|hold|reject
    confidence: float
    rationale: str
    concerns: list[str]
    evidence_sufficiency: str  # sufficient|partial|insufficient


# ── Scan input ───────────────────────────────────────────────────────────────

class ScanInput(BaseModel):
    deployment_path: str
    api_url: Optional[str] = None
