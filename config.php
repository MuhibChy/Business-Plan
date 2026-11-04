<?php
/**
 * Configuration & Storage Engine
 * Auto-detects available storage (SQLite, JSON, MySQL) for zero-configuration XAMPP execution.
 */

// Error reporting for production resilience
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Paths
define('APP_DIR', __DIR__);
define('DATA_DIR', APP_DIR . DIRECTORY_SEPARATOR . 'data');
define('DATA_FILE', DATA_DIR . DIRECTORY_SEPARATOR . 'business_plan_data.json');
define('DB_FILE', DATA_DIR . DIRECTORY_SEPARATOR . 'business_plan.sqlite');

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    @mkdir(DATA_DIR, 0777, true);
}

/**
 * Default Seed Data for the 30-Day IT Business Plan
 */
function getDefaultPlanData() {
    return [
        'metadata' => [
            'company_name' => 'Apex Cloud & Software Solutions',
            'founder_name' => 'Founder & Managing Director',
            'industry' => 'IT Services & Digital Transformation',
            'target_niche' => 'Cloud Migration, DevOps & Custom Web/Mobile Engineering',
            'created_at' => date('Y-m-d H:i:s'),
            'version' => '1.0.0'
        ],
        'financials' => [
            'initial_capital' => 15000,
            'monthly_burn_rate' => 3500,
            'hourly_rate' => 95,
            'avg_project_size' => 12500,
            'target_mrr' => 25000,
            'target_deals_m1' => 2,
            'months_runway' => 6
        ],
        'days' => [
            // WEEK 1: FOUNDATION, NICHE & SERVICE ARCHITECTURE
            [
                'day' => 1,
                'phase' => 'Phase 1: Foundation & Niche Strategy',
                'phase_number' => 1,
                'title' => 'Entity Structuring, Mission & Core IT Specialization',
                'description' => 'Establish company legal structure, operating agreements, and define high-margin core competencies.',
                'deliverables' => 'Registered business entity or DBA, operating agreement draft, mission & USP document.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '1_1', 'text' => 'Determine legal entity structure (LLC / Pvt Ltd / Corp) and tax categorization.', 'done' => false],
                    ['id' => '1_2', 'text' => 'Define the IT Service Specialization: Cloud Infrastructure, Web Engineering, or AI Agents.', 'done' => false],
                    ['id' => '1_3', 'text' => 'Draft the Core Value Proposition (e.g. "We reduce cloud bills by 40% in 30 days").', 'done' => false],
                    ['id' => '1_4', 'text' => 'Open a dedicated business bank account and set initial working capital reserve.', 'done' => false]
                ]
            ],
            [
                'day' => 2,
                'phase' => 'Phase 1: Foundation & Niche Strategy',
                'phase_number' => 1,
                'title' => 'Competitive Intelligence & Ideal Customer Profile (ICP)',
                'description' => 'Analyze top 5 regional and global competitors, identify their pricing gaps, and pinpoint high-value target buyers.',
                'deliverables' => 'Competitive analysis matrix, ICP documentation, 3 detailed buyer personas.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '2_1', 'text' => 'Audit 5 competitor agencies on Clutch, Upwork, and LinkedIn.', 'done' => false],
                    ['id' => '2_2', 'text' => 'Identify competitor weaknesses (e.g. slow response, high hidden fees, outdated tech).', 'done' => false],
                    ['id' => '2_3', 'text' => 'Define Ideal Customer Profile: B2B companies with $2M-$20M ARR needing tech upgrades.', 'done' => false],
                    ['id' => '2_4', 'text' => 'Map out the key pain points of CTOs, Product VPs, and Startup Founders.', 'done' => false]
                ]
            ],
            [
                'day' => 3,
                'phase' => 'Phase 1: Foundation & Niche Strategy',
                'phase_number' => 1,
                'title' => 'Service Catalog Architecture & Tiered Pricing Matrix',
                'description' => 'Package services into fixed-scope productized offers and recurring monthly retainer agreements.',
                'deliverables' => 'Published 3-tier Service Catalog (Starter, Growth, Enterprise) with deliverable breakdowns.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '3_1', 'text' => 'Define Tier 1: Sprint 0 Technical Audit & Architecture Review ($2,500 fixed).', 'done' => false],
                    ['id' => '3_2', 'text' => 'Define Tier 2: Dedicated Full-Stack Engineering Team ($9,500/month retainer).', 'done' => false],
                    ['id' => '3_3', 'text' => 'Define Tier 3: Enterprise Cloud & Security Modernization ($25,000+ custom).', 'done' => false],
                    ['id' => '3_4', 'text' => 'Establish pricing floor: Minimum acceptable project fee $5,000.', 'done' => false]
                ]
            ],
            [
                'day' => 4,
                'phase' => 'Phase 1: Foundation & Niche Strategy',
                'phase_number' => 1,
                'title' => 'Legal Shields: MSA, SOW, Mutual NDA & IP Assignment',
                'description' => 'Secure watertight contracts to ensure 100% upfront milestone payments and complete IP protection.',
                'deliverables' => 'Master Services Agreement (MSA) template, SOW template, Mutual NDA, Subcontractor IP Agreement.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '4_1', 'text' => 'Draft Master Services Agreement with clear payment terms (50% upfront, 50% milestone).', 'done' => false],
                    ['id' => '4_2', 'text' => 'Create Statement of Work (SOW) template with scope containment clauses.', 'done' => false],
                    ['id' => '4_3', 'text' => 'Prepare 2-way Mutual NDA for prospect discovery conversations.', 'done' => false],
                    ['id' => '4_4', 'text' => 'Ensure contractor agreements clearly assign all IP to your agency upon payment.', 'done' => false]
                ]
            ],
            [
                'day' => 5,
                'phase' => 'Phase 1: Foundation & Niche Strategy',
                'phase_number' => 1,
                'title' => 'Enterprise Tech Stack, Cloud Tenant & Internal Tooling',
                'description' => 'Provision production cloud accounts, version control organizations, and team collaboration tooling.',
                'deliverables' => 'Configured AWS/GCP tenant, GitHub Organization with branch protection, Slack/Discord workspace.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '5_1', 'text' => 'Provision AWS or Google Cloud Organization with IAM MFA enforcement.', 'done' => false],
                    ['id' => '5_2', 'text' => 'Set up GitHub / GitLab Organization with standardized repository templates.', 'done' => false],
                    ['id' => '5_3', 'text' => 'Configure Slack / Discord with dedicated #sales, #dev, #announcements channels.', 'done' => false],
                    ['id' => '5_4', 'text' => 'Set up Google Workspace / Microsoft 365 for professional team emails.', 'done' => false]
                ]
            ],
            [
                'day' => 6,
                'phase' => 'Phase 1: Foundation & Niche Strategy',
                'phase_number' => 1,
                'title' => 'Brand Identity, High-Trust Domain & Corporate Digital Assets',
                'description' => 'Finalize brand guidelines, typography, vector logos, and verify domain authentication (SPF, DKIM, DMARC).',
                'deliverables' => 'Vector logo kit, brand style guide, configured SPF/DKIM/DMARC DNS records.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '6_1', 'text' => 'Design clean, tech-oriented vector logo and favicon.', 'done' => false],
                    ['id' => '6_2', 'text' => 'Acquire prime .com or .tech/.io domain.', 'done' => false],
                    ['id' => '6_3', 'text' => 'Configure SPF, DKIM, and DMARC records to ensure 99%+ email deliverability.', 'done' => false],
                    ['id' => '6_4', 'text' => 'Create email signatures for founders and technical leads.', 'done' => false]
                ]
            ],
            [
                'day' => 7,
                'phase' => 'Phase 1: Foundation & Niche Strategy',
                'phase_number' => 1,
                'title' => 'Week 1 Executive Milestone Review & Gate Sign-off',
                'description' => 'Review legal, infrastructure, and pricing readiness before proceeding to asset buildout.',
                'deliverables' => 'Week 1 Sign-Off Report, verified readiness scores, risk register updated.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '7_1', 'text' => 'Conduct end-to-end check of bank, legal documents, and cloud accounts.', 'done' => false],
                    ['id' => '7_2', 'text' => 'Validate Service Catalog with at least 2 external technical advisors.', 'done' => false],
                    ['id' => '7_3', 'text' => 'Confirm all initial capital reserves are deployed in business checking account.', 'done' => false],
                    ['id' => '7_4', 'text' => 'Execute Week 1 Go/No-Go Gate formal approval.', 'done' => false]
                ]
            ],

            // WEEK 2: INFRASTRUCTURE, TOOLING & ASSET READINESS
            [
                'day' => 8,
                'phase' => 'Phase 2: Assets & Pipeline Infrastructure',
                'phase_number' => 2,
                'title' => 'High-Conversion Agency Landing Page & Interactive Portfolio',
                'description' => 'Deploy lightning-fast website highlighting case studies, service offerings, and instant calendar booking.',
                'deliverables' => 'Live responsive agency website with Cal.com/Calendly booking embed and SSL certification.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '8_1', 'text' => 'Deploy responsive landing page with clear hero headline and primary CTA.', 'done' => false],
                    ['id' => '8_2', 'text' => 'Include 3 detailed case studies / proof of technical execution.', 'done' => false],
                    ['id' => '8_3', 'text' => 'Integrate booking link (Calendly or Cal.com) for 30-minute discovery calls.', 'done' => false],
                    ['id' => '8_4', 'text' => 'Verify mobile responsiveness, PageSpeed 90+, and A-grade SSL certificate.', 'done' => false]
                ]
            ],
            [
                'day' => 9,
                'phase' => 'Phase 2: Assets & Pipeline Infrastructure',
                'phase_number' => 2,
                'title' => 'CRM Pipeline Configuration & Deal Stage Automation',
                'description' => 'Implement CRM pipeline to track deals from cold prospect through closed-won and onboarding.',
                'deliverables' => 'Configured CRM with 6 deal stages, automated email notifications, and deal value tracking.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '9_1', 'text' => 'Configure stages: New Lead -> Qualified -> Discovery -> Proposal Sent -> Won -> Lost.', 'done' => false],
                    ['id' => '9_2', 'text' => 'Create custom fields: Tech Stack, Budget, Expected Timeline, Decision Maker.', 'done' => false],
                    ['id' => '9_3', 'text' => 'Set up automated Slack notification upon new calendar booking.', 'done' => false],
                    ['id' => '9_4', 'text' => 'Test test-lead injection and pipeline card movement.', 'done' => false]
                ]
            ],
            [
                'day' => 10,
                'phase' => 'Phase 2: Assets & Pipeline Infrastructure',
                'phase_number' => 2,
                'title' => 'Billing, Global Payment Gateways & Automated Invoicing',
                'description' => 'Integrate multi-currency payment collection (Stripe, Wire, ACH) and automated invoice generation.',
                'deliverables' => 'Verified Stripe merchant account, ACH payment instructions, branded invoice template.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '10_1', 'text' => 'Configure Stripe / Wise Business for credit cards and international wire transfers.', 'done' => false],
                    ['id' => '10_2', 'text' => 'Enable ACH debit for large enterprise payments to eliminate 3% card fees.', 'done' => false],
                    ['id' => '10_3', 'text' => 'Design professional PDF invoice template with payment terms (Net 15 / Due on Receipt).', 'done' => false],
                    ['id' => '10_4', 'text' => 'Perform a $1 live test transaction to confirm merchant payout pipeline.', 'done' => false]
                ]
            ],
            [
                'day' => 11,
                'phase' => 'Phase 2: Assets & Pipeline Infrastructure',
                'phase_number' => 2,
                'title' => 'Multi-Channel Prospecting Engine & Lead Scrape Pipeline',
                'description' => 'Set up verified B2B data extraction via Apollo, LinkedIn Sales Navigator, and GitHub tech scrapers.',
                'deliverables' => 'List of 500 validated IT decision-maker emails, verified phone numbers, and company profiles.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '11_1', 'text' => 'Target CTOs, Heads of Engineering, and Directors of IT in funded series A/B companies.', 'done' => false],
                    ['id' => '11_2', 'text' => 'Verify email deliverability using ZeroBounce or NeverBounce (<1% bounce rate).', 'done' => false],
                    ['id' => '11_3', 'text' => 'Segment list by primary tech stack (e.g. Node/React, Python/FastAPI, AWS/Kubernetes).', 'done' => false],
                    ['id' => '11_4', 'text' => 'Import verified contacts into outreach management sequences.', 'done' => false]
                ]
            ],
            [
                'day' => 12,
                'phase' => 'Phase 2: Assets & Pipeline Infrastructure',
                'phase_number' => 2,
                'title' => 'Client Onboarding Portal & Agile Delivery Framework',
                'description' => 'Build a streamlined onboarding questionnaire, Jira/Linear sprint board, and shared Google Drive vault.',
                'deliverables' => 'Client Intake Form, Sprint Template in Jira/Linear, Shared Client Portal checklist.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '12_1', 'text' => 'Build Client Technical Intake Form (credentials, architecture diagrams, access keys).', 'done' => false],
                    ['id' => '12_2', 'text' => 'Create Standardized Sprint 1 Board with backlog, in-progress, review, done columns.', 'done' => false],
                    ['id' => '12_3', 'text' => 'Set up automated welcoming email with next steps and kickoff calendar link.', 'done' => false],
                    ['id' => '12_4', 'text' => 'Document client escalation paths and SLAs (Service Level Agreements).', 'done' => false]
                ]
            ],
            [
                'day' => 13,
                'phase' => 'Phase 2: Assets & Pipeline Infrastructure',
                'phase_number' => 2,
                'title' => 'Code Quality Gates, Security Standards & CI/CD Pipelines',
                'description' => 'Establish GitHub Actions pipelines, automated linting, SonarQube static analysis, and secrets scanning.',
                'deliverables' => 'Reusable CI/CD pipeline template, Dependabot configuration, baseline security checklist.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '13_1', 'text' => 'Create GitHub Actions CI template with automated unit test runner and linter.', 'done' => false],
                    ['id' => '13_2', 'text' => 'Enable automated secret scanning and vulnerability alerts via Dependabot.', 'done' => false],
                    ['id' => '13_3', 'text' => 'Enforce branch protection rules: 2 approvals required for main branch merges.', 'done' => false],
                    ['id' => '13_4', 'text' => 'Draft Agency Security Whitepaper to assure enterprise clients during due diligence.', 'done' => false]
                ]
            ],
            [
                'day' => 14,
                'phase' => 'Phase 2: Assets & Pipeline Infrastructure',
                'phase_number' => 2,
                'title' => 'Week 2 Operational Readiness Audit & Asset Lock',
                'description' => 'Perform thorough end-to-end dry run of lead capture, calendar booking, invoice generation, and CI/CD.',
                'deliverables' => 'Operational audit report, all systems green, ready for outbound market launch.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '14_1', 'text' => 'Test form submission on landing page -> leads in CRM -> Slack ping.', 'done' => false],
                    ['id' => '14_2', 'text' => 'Test invoice generation and payment checkout flow.', 'done' => false],
                    ['id' => '14_3', 'text' => 'Ensure all email warmups have completed (domain reputation > 95%).', 'done' => false],
                    ['id' => '14_4', 'text' => 'Execute Week 2 Sign-Off and greenlight the Sales Blitz.', 'done' => false]
                ]
            ],

            // WEEK 3: CLIENT ACQUISITION & SALES BLITZ
            [
                'day' => 15,
                'phase' => 'Phase 3: Sales Blitz & Client Acquisition',
                'phase_number' => 3,
                'title' => 'Cold Outreach Campaign Launch: 100 Hyper-Targeted Leads',
                'description' => 'Launch individualized 3-step outreach campaign targeting tech leaders with specific pain-point audits.',
                'deliverables' => '100 personalized outreach messages dispatched, real-time open and reply monitoring active.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '15_1', 'text' => 'Send Sequence 1 to 50 CTOs focusing on Cloud Cost Optimization.', 'done' => false],
                    ['id' => '15_2', 'text' => 'Send Sequence 2 to 50 Product VPs focusing on Sprint Velocity & Staff Augmentation.', 'done' => false],
                    ['id' => '15_3', 'text' => 'Personalize first line with recent company funding or tech stack observation.', 'done' => false],
                    ['id' => '15_4', 'text' => 'Log all outreach in CRM and schedule Day 18 follow-up triggers.', 'done' => false]
                ]
            ],
            [
                'day' => 16,
                'phase' => 'Phase 3: Sales Blitz & Client Acquisition',
                'phase_number' => 3,
                'title' => 'Freelance Agency Platforms & Enterprise Bidding Channels',
                'description' => 'Optimize Upwork Agency profile, Clutch listing, and apply to 5 high-value RFP opportunities ($10k+).',
                'deliverables' => 'Top-rated agency profile badge, 5 customized high-tier proposals submitted.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '16_1', 'text' => 'Submit 5 tailored proposals on Upwork for enterprise web/cloud contracts.', 'done' => false],
                    ['id' => '16_2', 'text' => 'Publish verified agency profile on Clutch.co and GoodFirms.', 'done' => false],
                    ['id' => '16_3', 'text' => 'Attach relevant code repo samples and Loom video walkthroughs in bids.', 'done' => false],
                    ['id' => '16_4', 'text' => 'Maintain 100% response time for any inbound inquiries.', 'done' => false]
                ]
            ],
            [
                'day' => 17,
                'phase' => 'Phase 3: Sales Blitz & Client Acquisition',
                'phase_number' => 3,
                'title' => 'LinkedIn Social Selling & Technical Thought Leadership',
                'description' => 'Publish breakdown of a recent tech case study and engage with 40 target prospect posts.',
                'deliverables' => '1 high-impact technical teardown article, 40 personalized connection requests sent.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '17_1', 'text' => 'Post breakdown: "How to fix a slow database query that cost $4,000/mo on AWS".', 'done' => false],
                    ['id' => '17_2', 'text' => 'Send 40 connection requests with personalized notes referencing their tech stack.', 'done' => false],
                    ['id' => '17_3', 'text' => 'Engage with top comments on engineering manager and founder feeds.', 'done' => false],
                    ['id' => '17_4', 'text' => 'Capture warm inbound profile viewers and message them within 2 hours.', 'done' => false]
                ]
            ],
            [
                'day' => 18,
                'phase' => 'Phase 3: Sales Blitz & Client Acquisition',
                'phase_number' => 3,
                'title' => 'Discovery Call Execution & Technical Diagnostic Framework',
                'description' => 'Conduct scheduled discovery calls using consultative diagnosis rather than aggressive pitching.',
                'deliverables' => 'Completed discovery diagnostic worksheets for all active prospects, meeting recordings logged.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '18_1', 'text' => 'Execute discovery calls following 4-step framework: Goal -> Pain -> Impact -> Timeline.', 'done' => false],
                    ['id' => '18_2', 'text' => 'Uncover budget limits and exact decision-making authority.', 'done' => false],
                    ['id' => '18_3', 'text' => 'Offer paid Sprint 0 / Architecture Audit ($2,500) as zero-risk trial step.', 'done' => false],
                    ['id' => '18_4', 'text' => 'Send summary email within 1 hour of call with agreed next steps.', 'done' => false]
                ]
            ],
            [
                'day' => 19,
                'phase' => 'Phase 3: Sales Blitz & Client Acquisition',
                'phase_number' => 3,
                'title' => 'High-Impact Technical Proposal & Solution Architecture Decks',
                'description' => 'Draft customized technical solutions with architecture diagrams, deliverable schedules, and ROI calculations.',
                'deliverables' => '2 completed enterprise proposals with architecture blueprints and clear pricing options.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '19_1', 'text' => 'Draft Proposal 1 with Cloud Architecture Diagram and 3-milestone timeline.', 'done' => false],
                    ['id' => '19_2', 'text' => 'Draft Proposal 2 with dedicated developer team allocation model.', 'done' => false],
                    ['id' => '19_3', 'text' => 'Provide 3 pricing tiers (Good / Better / Best) to anchor high-value option.', 'done' => false],
                    ['id' => '19_4', 'text' => 'Set proposal expiration date (7 days) to create natural decision urgency.', 'done' => false]
                ]
            ],
            [
                'day' => 20,
                'phase' => 'Phase 3: Sales Blitz & Client Acquisition',
                'phase_number' => 3,
                'title' => 'Proposal Review Presentation, Objection Handling & Closing',
                'description' => 'Present proposals live via Zoom/Meet, answer security and SLA questions, and secure verbal agreement.',
                'deliverables' => 'Closed verbal contract, signed NDA, contracts sent for digital signature via DocuSign/HelloSign.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '20_1', 'text' => 'Deliver live proposal walkthrough focusing on business outcomes and ROI.', 'done' => false],
                    ['id' => '20_2', 'text' => 'Overcome objection: "Your rate is higher than offshore devs" with senior QA & IP guarantees.', 'done' => false],
                    ['id' => '20_3', 'text' => 'Obtain verbal acceptance and immediate authorization to send MSA/SOW.', 'done' => false],
                    ['id' => '20_4', 'text' => 'Dispatch contracts for digital signature via DocuSign or PandaDoc.', 'done' => false]
                ]
            ],
            [
                'day' => 21,
                'phase' => 'Phase 3: Sales Blitz & Client Acquisition',
                'phase_number' => 3,
                'title' => 'Week 3 Pipeline Audit, Conversion Metrics & Optimization',
                'description' => 'Analyze reply rates, call conversions, and proposal win-rate; double down on highest ROI channel.',
                'deliverables' => 'Sales pipeline conversion report, win/loss post-mortem, updated sequence copy.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '21_1', 'text' => 'Calculate Outbound Metrics: 100 sent -> 12 replies -> 4 calls -> 2 proposals.', 'done' => false],
                    ['id' => '21_2', 'text' => 'Refine subject lines and call-to-action based on highest performing emails.', 'done' => false],
                    ['id' => '21_3', 'text' => 'Confirm first client deposit wire is scheduled or processed.', 'done' => false],
                    ['id' => '21_4', 'text' => 'Sign off on Week 3 Sales Blitz milestones.', 'done' => false]
                ]
            ],

            // WEEK 4: DELIVERY, TEAM SCALING & REVENUE OPERATIONS
            [
                'day' => 22,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'First Client Kickoff, Sprint 0 Execution & Deposit Clearance',
                'description' => 'Receive 50% upfront deposit, initiate Sprint 0, and hold structured kickoff meeting with client team.',
                'deliverables' => 'Cleared deposit in business bank account, signed MSA/SOW, Sprint 0 backlog initialized.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '22_1', 'text' => 'Verify initial invoice payment (e.g. $6,250 deposit) has cleared.', 'done' => false],
                    ['id' => '22_2', 'text' => 'Host 45-minute Technical Kickoff Meeting with client stakeholders.', 'done' => false],
                    ['id' => '22_3', 'text' => 'Receive repository and cloud environment access credentials securely.', 'done' => false],
                    ['id' => '22_4', 'text' => 'Create private Slack connect channel for daily async standups.', 'done' => false]
                ]
            ],
            [
                'day' => 23,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Senior Developer Sourcing & Technical Talent Bench',
                'description' => 'Build a vetted talent bench of top 5% senior contractors ready for instant staffing on upcoming projects.',
                'deliverables' => 'Pre-screened talent bench of 3 senior engineers (Frontend, Backend, DevOps) with rates locked.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '23_1', 'text' => 'Interview 5 senior software contractors with verified GitHub repositories.', 'done' => false],
                    ['id' => '23_2', 'text' => 'Conduct 45-minute live code pairing session to test problem-solving quality.', 'done' => false],
                    ['id' => '23_3', 'text' => 'Execute Contractor Master Agreements and IP Assignment clauses.', 'done' => false],
                    ['id' => '23_4', 'text' => 'Lock gross profit margin target at 45%-60% per engineering hour.', 'done' => false]
                ]
            ],
            [
                'day' => 24,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Standard Operating Procedures (SOPs) & Code Review Guidelines',
                'description' => 'Codify delivery SOPs for code review, PR templates, automated testing, and zero-downtime releases.',
                'deliverables' => 'Published Agency Engineering Playbook with 8 core technical SOPs.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '24_1', 'text' => 'Write SOP 1: Git Branching & Semantic Versioning guidelines.', 'done' => false],
                    ['id' => '24_2', 'text' => 'Write SOP 2: Mandatory PR Checklist and peer review standards.', 'done' => false],
                    ['id' => '24_3', 'text' => 'Write SOP 3: Staging Environment QA and Client Acceptance Sign-off.', 'done' => false],
                    ['id' => '24_4', 'text' => 'Write SOP 4: Production Rollback and Emergency Incident Playbook.', 'done' => false]
                ]
            ],
            [
                'day' => 25,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Financial Operations, Profit & Loss (P&L) Model & Runway Audit',
                'description' => 'Establish monthly financial reporting, gross margin tracking, tax savings allocation, and runway models.',
                'deliverables' => 'Automated P&L spreadsheet, tax reserve account (25% allocation), updated cash flow forecast.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '25_1', 'text' => 'Set up automated Profit & Loss dashboard tracking revenue, COGS, and overhead.', 'done' => false],
                    ['id' => '25_2', 'text' => 'Automatically transfer 25% of gross revenue into separate Tax Reserve account.', 'done' => false],
                    ['id' => '25_3', 'text' => 'Calculate Customer Acquisition Cost (CAC) and Lifetime Value (LTV) projections.', 'done' => false],
                    ['id' => '25_4', 'text' => 'Verify runway exceeds 6 months under base-case scenario.', 'done' => false]
                ]
            ],
            [
                'day' => 26,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Client Retention, Upsell Architecture & Monthly Retainer Conversion',
                'description' => 'Pitch ongoing maintenance, DevOps monitoring, and feature retainers before project completion.',
                'deliverables' => 'Monthly Retainer SOW pitch deck, recurring maintenance SLA agreement.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '26_1', 'text' => 'Audit client infrastructure for post-launch monitoring and patching needs.', 'done' => false],
                    ['id' => '26_2', 'text' => 'Present Monthly Maintenance & Support Tier ($1,950 - $4,500/month).', 'done' => false],
                    ['id' => '26_3', 'text' => 'Establish formal Client Referral Incentive (10% commission on referred contracts).', 'done' => false],
                    ['id' => '26_4', 'text' => 'Secure client commitment for monthly retainer contract upon launch.', 'done' => false]
                ]
            ],
            [
                'day' => 27,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Content Marketing Engine, Case Study Publishing & SEO Moat',
                'description' => 'Package project delivery into an anonymized case study showcasing measurable business impact.',
                'deliverables' => '1 published in-depth case study, SEO keyword plan for agency services, testimonial quote.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '27_1', 'text' => 'Write case study: "How We Migrated a Legacy Monolith to Microservices in 4 Weeks".', 'done' => false],
                    ['id' => '27_2', 'text' => 'Collect video or written testimonial from the primary client champion.', 'done' => false],
                    ['id' => '27_3', 'text' => 'Publish case study to website portfolio, Medium, and LinkedIn article.', 'done' => false],
                    ['id' => '27_4', 'text' => 'Optimize local Google Business profile and B2B directory listings.', 'done' => false]
                ]
            ],
            [
                'day' => 28,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Operational Automation: Invoicing, CRM & Sprint Reporting',
                'description' => 'Connect Zapier/Make webhooks to automate lead routing, contract dispatch, and weekly status emails.',
                'deliverables' => '3 active automation workflows: Lead Notification, Contract Signing Trigger, Weekly Progress Report.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '28_1', 'text' => 'Automate: When proposal signed -> create Jira project -> ping Slack #delivery.', 'done' => false],
                    ['id' => '28_2', 'text' => 'Automate: Weekly automated email report with completed sprint tickets.', 'done' => false],
                    ['id' => '28_3', 'text' => 'Automate: Invoicing reminder for milestone 2 payment 3 days prior to due date.', 'done' => false],
                    ['id' => '28_4', 'text' => 'Eliminate manual administrative overhead to save 10+ hours per week.', 'done' => false]
                ]
            ],
            [
                'day' => 29,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Comprehensive 30-Day Audit, Financial Close & KPIs',
                'description' => 'Audit all 30 days of execution, compare final financial performance against targets, and close books.',
                'deliverables' => 'Month 1 Financial Statement, 30-Day Completion Scorecard, KPI audit report.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '29_1', 'text' => 'Audit all 30 daily milestones and calculate overall execution rate.', 'done' => false],
                    ['id' => '29_2', 'text' => 'Reconcile all bank statements, invoices received, and contractor disbursements.', 'done' => false],
                    ['id' => '29_3', 'text' => 'Assess key metrics: Net Profit Margin (target > 35%), Client CSAT (target > 9/10).', 'done' => false],
                    ['id' => '29_4', 'text' => 'Publish Executive 30-Day Business Review for founders and stakeholders.', 'done' => false]
                ]
            ],
            [
                'day' => 30,
                'phase' => 'Phase 4: Delivery, Scaling & Operations',
                'phase_number' => 4,
                'title' => 'Month 2–12 Scale Blueprint: Path to $50,000+/Month IT Agency',
                'description' => 'Establish growth OKRs for quarters 2 through 4, hiring plan for full-time engineers, and enterprise expansion.',
                'deliverables' => 'Annual Strategic Growth Blueprint, hiring roadmap, 12-month financial model.',
                'completed' => false,
                'notes' => '',
                'checklist' => [
                    ['id' => '30_1', 'text' => 'Define Quarter 2 Goal: 4 active retainer clients generating $38,000 MRR.', 'done' => false],
                    ['id' => '30_2', 'text' => 'Plan first full-time hire: Lead Full-Stack Architect / Project Manager.', 'done' => false],
                    ['id' => '30_3', 'text' => 'Design proprietary software accelerator / reusable boilerplate to cut dev time 50%.', 'done' => false],
                    ['id' => '30_4', 'text' => 'Formally graduate from 30-Day Launch to Scale-Up Stage!', 'done' => false]
                ]
            ]
        ],
        'leads' => [
            [
                'id' => 'lead_1',
                'company' => 'FinTech Nexus Inc.',
                'contact_name' => 'Sarah Jenkins, VP of Engineering',
                'email' => 'sarah.j@fintechnexus.io',
                'service' => 'Cloud Migration & SOC2 Compliance',
                'value' => 18500,
                'stage' => 'Proposal Sent',
                'probability' => 75,
                'expected_close' => date('Y-m-d', strtotime('+7 days')),
                'notes' => 'Looking to migrate 14 microservices from Heroku to AWS EKS with Terraform.'
            ],
            [
                'id' => 'lead_2',
                'company' => 'BioHealth Diagnostics',
                'contact_name' => 'Dr. Marcus Vance, Founder & CEO',
                'email' => 'mvance@biohealthdiag.com',
                'service' => 'HIPAA-Compliant Patient Portal & API',
                'value' => 24000,
                'stage' => 'Discovery',
                'probability' => 50,
                'expected_close' => date('Y-m-d', strtotime('+14 days')),
                'notes' => 'Requires React/Next.js frontend with Python FastAPI backend and encrypted PostgreSQL.'
            ],
            [
                'id' => 'lead_3',
                'company' => 'LogistiCore Solutions',
                'contact_name' => 'David Morales, Director of IT',
                'email' => 'dmorales@logisticore.net',
                'service' => 'Dedicated Full-Stack Engineering Team',
                'value' => 9500,
                'stage' => 'Qualified',
                'probability' => 40,
                'expected_close' => date('Y-m-d', strtotime('+21 days')),
                'notes' => 'Monthly retainer for 2 full-stack engineers to build internal warehouse logistics dashboard.'
            ]
        ],
        'swot' => [
            'strengths' => [
                'Deep expertise in modern cloud architectures (AWS/GCP, Kubernetes, Serverless).',
                'Agile, lean delivery model enabling rapid turnaround times vs bureaucratic agencies.',
                'High-converting consultative discovery and proposal framework.',
                'Zero technical debt: modern, automated CI/CD and security posture from Day 1.'
            ],
            'weaknesses' => [
                'New brand identity with limited published public case studies.',
                'Small initial core team requiring careful capacity management.',
                'Reliance on contractor bench for sudden multi-project spikes.'
            ],
            'opportunities' => [
                'Massive market demand for AI integration into traditional enterprise software.',
                'Companies seeking to slash inflated cloud bills with automated FinOps.',
                'High-margin recurring monthly maintenance and DevOps retainers.'
            ],
            'threats' => [
                'Macroeconomic tech budget scrutiny requiring clear ROI justification.',
                'Competition from low-cost offshore software sweatshops.',
                'Rapidly evolving AI tooling shifting traditional software development rates.'
            ]
        ]
    ];
}

/**
 * Storage Helper Class: Auto-loads and persists JSON or SQLite
 */
class BusinessPlanStorage {
    private static $cachedData = null;

    public static function load() {
        if (self::$cachedData !== null) {
            return self::$cachedData;
        }

        if (file_exists(DATA_FILE)) {
            $json = @file_get_contents(DATA_FILE);
            if ($json) {
                $decoded = json_decode($json, true);
                if (is_array($decoded) && isset($decoded['days'])) {
                    self::$cachedData = $decoded;
                    return self::$cachedData;
                }
            }
        }

        // Initialize default seed data
        $defaultData = getDefaultPlanData();
        self::save($defaultData);
        self::$cachedData = $defaultData;
        return self::$cachedData;
    }

    public static function save($data) {
        self::$cachedData = $data;
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return @file_put_contents(DATA_FILE, $json) !== false;
    }

    public static function reset() {
        $defaultData = getDefaultPlanData();
        self::save($defaultData);
        return $defaultData;
    }
}
