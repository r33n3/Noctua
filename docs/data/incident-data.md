# Meridian Financial Incident Report
**Date:** March 3, 2026 | **Time:** 02:34 EST | **ID:** MF-2026-0342

---

## SIEM Alert

```
ALERT [CRITICAL] DLP-9341 — Anomalous data exfiltration pattern detected
Timestamp : 2026-03-03T02:34:17Z
Source IP  : 203.45.12.89
Dest IP    : 10.18.4.55 (prod-dw-01.meridian.local)
Account    : jchen@meridian.local
Auth Method: SAML SSO + MFA (TOTP)
Action     : BULK_DOWNLOAD
Files      : 47 CSV files
Volume     : 2.31 GB
Duration   : 8 min 34 sec
Alert Rule : >500MB download outside business hours from non-standard geo
```

---

## Account Profile — John Chen

| Field               | Value                                      |
|---------------------|--------------------------------------------|
| Name                | John Chen                                  |
| Title               | Vice President, Strategic Finance          |
| Department          | Finance                                    |
| Employee ID         | EMP-00841                                  |
| Start Date          | 2019-06-12                                 |
| Access Level        | Tier 2 — Financial Data (read-only DW)     |
| MFA Enrolled        | Yes — TOTP (Google Authenticator)          |
| Normal Work Hours   | Mon–Fri, 08:30–18:30 EST                  |
| Normal Location     | New York, NY (home) / Boston, MA (office)  |
| Last Password Reset | 2026-01-15                                 |
| HR Status           | Active — Performance review pending        |

---

## Network Indicators

| Field             | Value                          |
|-------------------|--------------------------------|
| Source IP         | 203.45.12.89                   |
| IP Geo            | Singapore (SG)                 |
| IP ASN            | AS63949 — Linode/Akamai (VPS)  |
| Reverse DNS       | static.203.45.12.89.clients.your-server.de |
| Prior activity    | No prior logins from this IP   |
| VPN detected      | No corporate VPN active        |
| Tor exit node     | No                             |
| Known bad IP      | Not in threat intel feeds      |
| User's typical IP | 72.84.xx.xx (Comcast, New York) |

---

## Authentication Log — Last 14 Days

```
DATE (EST)          IP ADDRESS       GEO           MFA    RESULT
------------------------------------------------------------------
2026-02-18 09:12    72.84.193.21     New York, US   YES    SUCCESS
2026-02-19 08:54    72.84.193.21     New York, US   YES    SUCCESS
2026-02-20 10:03    72.84.193.21     New York, US   YES    SUCCESS
2026-02-24 08:41    72.84.193.21     New York, US   YES    SUCCESS
2026-02-25 09:28    72.84.193.21     New York, US   YES    SUCCESS
2026-02-26 08:59    172.16.0.1       Boston, MA     YES    SUCCESS  [office]
2026-02-27 09:17    72.84.193.21     New York, US   YES    SUCCESS
2026-03-02 09:05    72.84.193.21     New York, US   YES    SUCCESS
2026-03-02 17:44    72.84.193.21     New York, US   YES    LOGOUT
2026-03-03 02:34    203.45.12.89     Singapore      YES    SUCCESS  << ALERT
```

---

## Data Warehouse Access — Session Detail (2026-03-03 02:34 EST)

**Database:** `prod-dw-01` — Financial Data Warehouse
**Schema accessed:** `finance.reporting`

| Time (EST)  | Query / Action                                           | Rows    | Size     |
|-------------|----------------------------------------------------------|---------|----------|
| 02:34:22    | SELECT * FROM revenue_quarterly WHERE year >= 2022       | 284,901 | 187 MB   |
| 02:35:01    | SELECT * FROM client_portfolio_balances                  | 512,043 | 441 MB   |
| 02:35:49    | SELECT * FROM transaction_history WHERE date >= '2024-01'| 1.2M    | 890 MB   |
| 02:36:28    | SELECT * FROM fx_exposure_positions                      | 48,203  | 38 MB    |
| 02:37:14    | SELECT * FROM loan_covenant_tracking                     | 19,847  | 22 MB    |
| 02:38:33    | SELECT * FROM regulatory_reporting_q4_2025               | 103,218 | 291 MB   |
| 02:40:44    | SELECT * FROM mergers_pipeline_confidential              | 8,441   | 89 MB    |
| 02:42:51    | Session terminated (idle timeout)                        | —       | —        |

**Total downloaded:** 47 CSV files, 2.31 GB
**Highest sensitivity table:** `mergers_pipeline_confidential` — contains non-public M&A targets

---

## Files Downloaded — Summary

```
File pattern                                  Count   Total Size
--------------------------------------------------------------
revenue_quarterly_20[22-25]_q[1-4].csv         16    187 MB
client_portfolio_balances_snapshot_*.csv        12    441 MB
transaction_history_2024*.csv                    9    890 MB
fx_exposure_*.csv                                4     38 MB
loan_covenant_tracking_*.csv                     2     22 MB
regulatory_report_q4_2025_*.csv                  3    291 MB
mna_pipeline_confidential_*.csv                  1     89 MB (!)
--------------------------------------------------------------
TOTAL                                           47    2.31 GB
```

---

## Contextual Intelligence

**HR Note (not yet shared with security team):**
John Chen's manager filed a confidential HR note on 2026-02-28 indicating Chen has been underperforming on Q4 deliverables and that a Performance Improvement Plan (PIP) discussion is scheduled for 2026-03-05.

**Badge / Physical Access:**
Chen's badge shows he did NOT badge into any Meridian office on 2026-03-03. His home address is listed as Brooklyn, NY (UTC-5).

**Email / Endpoint:**
No company email sent or received from Chen's account between 2026-03-02 17:44 (logout) and 2026-03-03 04:00.
His laptop (WIN-JCHEN-001) shows no local activity during the window — no keyboard, no mouse, no network traffic from the corporate endpoint.

**Prior DW Access Pattern:**
Chen typically queries 2–5 tables per session, averaging 50–200 MB/session. His largest prior single session was 340 MB on 2025-12-31 (year-end reporting).

**Peer Comparison:**
No other VP-level Finance employee has downloaded >500 MB in a single session in the past 12 months.

---

## Known Unknowns

- Where is John Chen physically right now?
- Has Chen's personal device (mobile TOTP app) been compromised?
- Was Chen coerced or is this voluntary?
- Has any data been transmitted externally from 203.45.12.89?
- Are there other sessions from this IP against other Meridian accounts?
- Has Chen been in contact with competitors, journalists, or regulatory bodies?

---

## Initial Disposition

**Incident Severity:** P1 — Critical
**Data Classification:** Confidential / Regulated (client financial data, NPI, non-public M&A)
**Potential Regulations:** SEC Regulation S-P, GLBA, SOX
**Assigned Analyst:** [Your name]
**30-Minute Deadline:** Preliminary assessment to CISO by 03:05 EST

---

*Use this file as your input for the Week 1 CCT analysis exercise.*
*Reference ID: MF-2026-0342*
