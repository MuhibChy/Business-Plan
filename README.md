# 🚀 30-Day IT Support & Services Business Launch Planner

An interactive, responsive single-page application and execution platform designed to take an IT Support, Managed Services Provider (MSP), or Cloud Consulting agency from Day 1 inception to Day 30 revenue-generating scale.

- **GitHub Repository**: [https://github.com/MuhibChy/Business-Plan](https://github.com/MuhibChy/Business-Plan)
- **Live Online Application (GitHub Pages)**: [https://muhibchy.github.io/Business-Plan/](https://muhibchy.github.io/Business-Plan/)
- **Localhost URL (XAMPP)**: `http://localhost/IT Business Plan 30 days/`

---

## 🌟 Key Application Features

### 1. Interactive 30-Day Launch Roadmap (4 Strategic Phases)
* **Phase 1: Foundation & Niche Strategy (Days 1–7)**
  - Legal entity structuring, business banking, mission, and unique value proposition.
  - Competitor audit, Ideal Customer Profile (ICP), and 3-tier service packaging (Starter Audit, Monthly Retainer, Enterprise Cloud).
  - Legal shields: Master Services Agreement (MSA), Statement of Work (SOW), and Mutual NDA templates.
  - Production cloud infrastructure (AWS/GCP), GitHub organization, and team communication setup.
  - Week 1 Executive Milestone Gate.
* **Phase 2: Assets & Pipeline Infrastructure (Days 8–14)**
  - Agency landing page, interactive portfolio, and automated booking calendar integration.
  - 6-stage sales CRM pipeline configuration and automated lead alerts.
  - Stripe / Wire payment setup, ACH debit, and automated invoice generation.
  - B2B prospecting data scrape pipeline (CTOs, Heads of IT).
  - Client technical intake portal and CI/CD code quality gates with automated testing.
  - Week 2 Operational Readiness Audit.
* **Phase 3: Sales Blitz & Client Acquisition (Days 15–21)**
  - Targeted cold outreach blitz to 100 verified IT decision-makers.
  - Upwork Agency profile, Clutch listing optimization, and high-tier RFP proposal submissions.
  - LinkedIn technical thought-leadership teardowns and connection blitz.
  - Consultative discovery calls using a 4-step diagnostic framework.
  - High-impact proposals with 3-tier pricing options and live objection handling.
  - Week 3 Sales Pipeline Review & Conversion Optimization.
* **Phase 4: Delivery, Scaling & Operations (Days 22–30)**
  - First client kickoff, deposit clearance, and Sprint 0 delivery.
  - Senior developer & IT technician talent bench with rates locked for 45%–60% margins.
  - Engineering SOPs (Git branching, PR reviews, release playbooks).
  - Financial operations, P&L dashboard, and tax reserve allocations (25%).
  - Client retention, upselling, and recurring monthly maintenance contracts.
  - Comprehensive 30-Day Execution Audit and Month 2–12 Scale Blueprint ($50,000+/mo).

### 2. Live Financial Modeler & Projections Engine
* Interactive inputs for starting capital, monthly burn rate, target billable hourly rate, average project size, and MRR targets.
* Automatic calculations for **Runway** (in months), **Break-Even Billable Hours**, and **Month 1 Net Profit**.
* **12-Month Strategic Growth Forecast Table** projecting retainer count, custom project revenue, and MRR.

### 3. Sales CRM & Prospect Pipeline
* Real-time lead tracking across all sales stages: *New Lead*, *Qualified*, *Discovery*, *Proposal Sent*, *Closed Won*, and *Closed Lost*.
* Automatic aggregation of **Total Pipeline Value** and **Probability-Weighted Value**.
* Full interactive modal for adding, updating, and removing prospects.

### 4. Legal Document & Contract Generator
* Instant generation of standardized, enforceable agreements:
  - **Master Services Agreement (MSA)**
  - **Statement of Work (SOW)**
  - **Mutual Non-Disclosure Agreement (NDA)**
* Live preview with dynamic client entity name, project fee, and effective date injection, plus one-click clipboard copying.

### 5. SWOT & Risk Mitigation Matrix
* In-depth strategic positioning analysis covering internal Strengths & Weaknesses, plus external Opportunities & Threats.

### 6. Automated Testing & Verification Suite
* **In-Browser Diagnostic Suite**: Accessible directly in the UI under the "System Diagnostics & Tests" tab.
* **Standalone Backend Test Runner**: Accessible at `tests.php` when running in a PHP environment.

---

## 💾 Data Persistence & Storage Architecture

* **Online (GitHub Pages)**:
  - Powered by **HTML5 Browser LocalStorage** (`IT_SUPPORT_BUSINESS_PLAN_30_DAYS`).
  - All checklist items, status updates, daily notes, financial numbers, and CRM prospects are saved instantly to your local browser storage.
  - **Export JSON**: One-click download of your entire plan data for backups or migration.
  - **Import JSON**: Instant restoration of your saved business plan onto any computer or browser.
  - *Note: Browser local storage is device and browser-specific; use the Export/Import feature to transfer your plan between devices.*
* **Localhost (XAMPP / PHP)**:
  - Supports dual storage: both client-side storage and backend flat-file JSON persistence via `api.php` and `config.php`.

---

## 🌐 Deployment to GitHub & GitHub Pages

### Automatic Deployment (GitHub Actions)
The repository includes `.github/workflows/deploy.yml` which deploys automatically on every push to the `main` branch.

### Manual GitHub Pages Settings (One-time Setup)
1. In your GitHub repository: [https://github.com/MuhibChy/Business-Plan](https://github.com/MuhibChy/Business-Plan)
2. Go to **Settings** &rarr; **Pages** (under Code and automation).
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (recommended) or deploy from **Deploy from a branch** (Branch: `main`, Folder: `/ (root)`).
4. Save the configuration. Within 1–2 minutes, your website will be live at:
   ```text
   https://muhibchy.github.io/Business-Plan/
   ```

---

## 🖥️ Local Execution Options

### Option A: Static Browser Access (Zero Installation)
Double-click `index.html` or open it directly in Chrome, Edge, Firefox, or Safari. Everything runs client-side.

### Option B: XAMPP Localhost (Full PHP & API Stack)
1. Ensure the folder is placed in:
   `C:\xampp\htdocs\IT Business Plan 30 days`
2. Start **Apache** from the XAMPP Control Panel.
3. Open:
   `http://localhost/IT Business Plan 30 days/`
