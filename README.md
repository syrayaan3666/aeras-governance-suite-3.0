# AERAS – Academic Exception & Risk Automation System

AERAS is a **Salesforce-powered governance platform** that transforms how universities manage academic exceptions by enforcing **risk scoring, SLA accountability, and auditable decision trails**.

This project was built as a **Service Automation** solution for a Salesforce hackathon.

---

## 🚨 The Problem

Universities process thousands of academic exceptions every semester:

* Attendance shortages
* Medical leaves
* Exam conflicts
* Late submissions
* Faculty discretion cases

Today, these are handled through:

* Emails and Google Forms
* Ad-hoc approvals
* No SLA enforcement
* No audit trail
* No consistency across departments

### The Real Risk

The real problem is **not operational** — it is **governance risk**:

* Student grievances (“Why was my request denied?”)
* Allegations of bias
* Accreditation audits
* Legal exposure
* Reputational damage

Traditional SIS/LMS platforms **record outcomes** but do **not govern discretionary decisions**.

---

## ✅ The Solution: AERAS

**AERAS (Academic Exception & Risk Automation System)** introduces a governance layer on top of academic exception handling.

It turns every exception into a **Salesforce case-like workflow** with:

* Risk scoring
* SLA deadlines
* Escalation paths
* Immutable governance logs

---

## 🧠 Key Features

### 📁 Academic Exception Case Management

* Centralized handling of all academic exceptions
* Clear lifecycle states (New, In Review, Escalated, Resolved)

### ⚠️ Institutional Risk Scoring

* Each exception is evaluated for institutional risk
* Helps administrators prioritize sensitive cases

### ⏱️ SLA Monitoring

* SLA deadlines tracked per exception
* Visual indicators for overdue and high-risk cases

### 🔼 Automated Escalation

* High-risk or SLA-breached cases can be escalated
* Prevents silent delays and faculty overload

### 📜 Governance & Audit Logs

* Every action (approve, deny, escalate) creates an immutable governance record
* Tracks:

  * Previous status
  * New status
  * Action taken
  * Actor
  * Timestamp

This enables **defensible decision-making** during audits or disputes.

---

## 🏗️ Technical Architecture

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Framer Motion

### Backend / Platform

* Salesforce REST API
* OAuth authentication
* Custom Salesforce Objects
* SOQL-based data access

---

## 📦 Salesforce Data Model

### Custom Objects

#### 1. Academic Exception

**API Name:** `Academic_Exception_c__c`

Used to store and manage exception cases.

Key fields:

* `ExceptionType_c__c` (Attendance, Medical, Exam, Academic, Other)
* `Status_c__c` (New, In Review, Escalated, Resolved)
* `Institutional_Risk_Score_c__c`
* `SLA_Deadline_c__c`
* `Grievance_Probability_c__c`
* `Is_System_Initiated_c__c`

---

#### 2. Governance Log

**API Name:** `Governance_Log__c`

Stores immutable audit records for every action taken.

Key fields:

* `Action_Type_c__c`
* `Case_c__c` (Lookup → Academic_Exception_c__c)
* `Previous_Status_c__c`
* `New_Status_c__c`
* `Actor_c__c`

---

## 🔄 End-to-End Flow

1. An academic exception is created
2. Risk score and SLA deadline are applied
3. Administrators review the case
4. Actions (Approve / Deny / Escalate) update the case status
5. Every action creates a **Governance Log** entry
6. Dashboards update in real time

---

## 🧪 Demo Highlights

* Live Salesforce data (no mocks)
* Real SLA breach detection
* Real escalation logic
* Real audit records visible in Salesforce
* End-to-end traceability from UI to Salesforce

---

## 🚀 Why Salesforce?

AERAS uses Salesforce **not as a database**, but as a **governance engine**.

Salesforce provides:

* Native SLA tracking
* Case lifecycle enforcement
* Role-based security
* Auditability
* Compliance readiness

These capabilities are critical for **institutional risk management**, not just automation.

---

## 🎯 Impact

AERAS helps institutions:

* Reduce bias in discretionary decisions
* Prevent SLA violations
* Improve transparency
* Defend decisions during audits
* Reduce faculty administrative burden
* Increase student trust

---

## 🏁 Hackathon Track Fit

**Track:** Service Automation

AERAS automates:

* Academic exception workflows
* Risk-based prioritization
* SLA enforcement
* Governance logging

It directly addresses **real-world institutional service challenges**.

---

## 📌 Status

* Salesforce integration complete
* All API names validated
* Restricted picklists enforced
* Governance logging operational
* Demo-ready and production-aligned

---

## 👤 Author

Built by **Syed Rayaan**
Salesforce Hackathon Project

---
