# AERAS – Academic Exception & Risk Automation System

AERAS is a **Salesforce-native service automation prototype** that governs academic exceptions as **risk-aware service cases**, instead of ad-hoc emails, forms, or informal approvals.

Universities handle large volumes of academic exceptions (attendance shortages, late submissions, medical leaves, exam conflicts). These are typically processed manually, resulting in inconsistent decisions, delayed responses, grievance risk, and weak auditability.

AERAS demonstrates how **Service Automation principles**—risk scoring, SLA tracking, escalation signaling, and governance logging—can be applied to academic exception handling.

---

## What Problem This Project Addresses

Most academic systems:

* Record requests
* Enforce static rules
* Rely on human follow-up

They **do not**:

* Prioritize exceptions by institutional risk
* Enforce decision timelines
* Maintain structured governance logs
* Provide visibility into decision accountability

AERAS addresses this gap by treating every academic exception as a **service case with risk and accountability**.

---

## What This System Does

### 1. Exception-as-a-Service Case

Academic exceptions are modeled as structured cases with:

* Status lifecycle
* Assigned decision authority
* SLA deadline
* Risk indicators

This ensures exceptions are tracked, visible, and time-bound.

---

### 2. Automated Institutional Risk Scoring

Each case is automatically evaluated using a deterministic risk model based on:

* Policy deviation severity
* Historical exception patterns
* Grievance probability
* Time sensitivity

The system computes:

* A normalized risk score (0–100)
* A qualitative risk level (minimal → critical)
* A dominant risk category (legal, compliance, operational, reputational)

This allows reviewers to **prioritize cases that carry higher institutional exposure**.

---

### 3. SLA Monitoring and Escalation Signaling

Each case includes:

* A defined decision SLA
* Real-time SLA status (on track / warning / breached)

When deadlines approach or are missed, the system:

* Flags the case
* Signals escalation
* Records the escalation as a governance event

This prevents silent delays and reduces grievance risk.

---

### 4. Governance Logging and Audit Trail

All significant actions—status changes, escalations, updates—automatically generate structured governance log entries capturing:

* Action taken
* Actor
* Timestamp
* Contextual details

This creates a consistent, reviewable decision trail to support transparency and audits.

---

### 5. Salesforce Integration

Salesforce is used as a **service governance platform**, not just a database.

The system integrates with Salesforce to:

* Create and update custom academic exception records
* Persist governance log entries
* Track SLA-related fields
* Expose case and audit data to the UI

Integration is handled via Salesforce REST APIs.

---

## What Is Automated vs What Is Human-Driven

### Automated

* Risk score calculation
* Risk categorization
* SLA time tracking
* Escalation signaling
* Governance log creation
* Case prioritization for reviewers

### Human-Driven

* Academic judgment
* Final approval or rejection
* Policy interpretation

AERAS **does not automate academic decisions**.
It automates **everything around the decision** to ensure consistency, timeliness, and accountability.

---

## Architecture Overview

### Core Components

* **aeras-engine.ts**
  Domain logic for:

  * Risk scoring
  * Risk categorization
  * SLA calculations
  * Labels and governance types

* **salesforce.ts**
  Salesforce integration layer for:

  * Authentication
  * Record creation and updates
  * Governance log persistence

* **UI Components (React / TypeScript)**
  Visualize:

  * Risk levels
  * SLA countdowns
  * Case status
  * Governance timelines

---

## Design Intent and Scope

This project is a **governance-oriented service automation prototype**.

It demonstrates:

* How academic exceptions can be managed as risk-aware service cases
* How Salesforce Service Automation concepts apply beyond customer support
* How deterministic risk logic and SLA visibility improve institutional control

It is **not** a production-ready enforcement system and intentionally avoids auto-decision logic.

---

## Key Limitations (By Design)

* Business rules and risk calculations are client-side for demonstration
* Governance immutability is conceptual and not server-enforced
* OAuth and authentication are simplified for demo purposes
* Risk scoring thresholds are heuristic, not statistically trained

These trade-offs were made to focus on **architecture, clarity, and hackathon feasibility**.

---

## Why This Fits the Service Automation Track

AERAS applies Service Automation to an academic domain by:

* Treating exceptions as service cases
* Enforcing decision timelines
* Automating prioritization and escalation
* Maintaining structured audit trails

This shifts exception handling from reactive, informal processes to **governed service operations**.

---

## One-Line Summary

> AERAS turns academic exceptions into risk-aware, SLA-tracked service cases with governance visibility, helping institutions manage exceptions consistently instead of reactively.

---