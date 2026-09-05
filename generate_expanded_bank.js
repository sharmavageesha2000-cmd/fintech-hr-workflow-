const fs = require('fs');
const path = require('path');

// Load stage 2
const stage2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'bank_draft_stage2.json'), 'utf8'));

// 6. BUSINESS ANALYST (35 MCQs)
stage2['Business Analyst'] = [
  { id: 601, question: 'What is the primary difference between a Business Requirements Document (BRD) and a Functional Requirements Document (FRD)?', options: ['A BRD outlines high-level business goals and problem statements from stakeholder perspective; an FRD details technical specifications, system behavior, and workflows for engineering', 'A BRD is written in Python; an FRD is written in SQL', 'An FRD is for marketing only while a BRD is for investors', 'There is no difference in modern product management'], correctIndex: 0 },
  { id: 602, question: 'In Agile Scrum, what does the INVEST mnemonic stand for when writing high-quality User Stories?', options: ['Independent, Negotiable, Valuable, Estimable, Small, Testable', 'Innovative, New, Valuable, Efficient, Secure, Timely', 'Interactive, Networked, Visual, Editable, Scalable, Tested', 'Iterative, Numeric, Verified, Estimated, Standardized, Tracked'], correctIndex: 0 },
  { id: 603, question: 'What is the purpose of a RACI Matrix in project stakeholder governance?', options: ['Clarifying roles and decision rights: Responsible, Accountable, Consulted, and Informed for each project task or deliverable', 'Calculating the financial Return on Investment (ROI)', 'Estimating sprint story points in Planning Poker', 'Measuring software bug severity in QA testing'], correctIndex: 0 },
  { id: 604, question: 'What does a Gap Analysis evaluate in business architecture?', options: ['The difference between the current state (As-Is) and the desired future state (To-Be) to identify necessary steps and requirements', 'The salary difference between junior and senior developers', 'The latency gap between frontend and backend APIs', 'The physical distance between corporate branch offices'], correctIndex: 0 },
  { id: 605, question: 'In UML diagramming, what does an «extend» relationship represent between two Use Cases?', options: ['An optional or conditional behavior that extends the base use case only under specific triggers', 'A mandatory base workflow that must always execute', 'A database table inheritance relationship', 'A network connection between two servers'], correctIndex: 0 },
  { id: 606, question: 'What is the primary objective of a Sprint Retrospective in Agile methodology?', options: ['Reflecting on the past sprint to identify continuous process improvements, what went well, and actionable team adjustments', 'Assigning blame for uncompleted user stories', 'Negotiating annual salary bonuses with leadership', 'Writing code documentation for client sign-off'], correctIndex: 0 },
  { id: 607, question: 'What is the difference between Functional Requirements and Non-Functional Requirements?', options: ['Functional requirements specify what the system must do (features, workflows); non-functional requirements define how well the system performs (security, latency, scalability, uptime)', 'Functional requirements are optional while non-functional are mandatory', 'Non-functional requirements only apply to hardware', 'Functional requirements cannot be tested in QA'], correctIndex: 0 },
  { id: 608, question: 'In Business Process Model and Notation (BPMN), what do Swimlanes represent in a flowchart?', options: ['Different organizational departments, roles, or actors responsible for executing specific sub-processes and activities', 'Database tables stored in relational schemas', 'Network firewall subnets', 'Sprint timeline weeks on a Gantt chart'], correctIndex: 0 },
  { id: 609, question: 'What does a SWOT Analysis assess for strategic business planning?', options: ['Strengths, Weaknesses, Opportunities, and Threats (evaluating internal capabilities and external market forces)', 'Software, Web, Optimization, and Telemetry', 'Sales, Workflows, Operations, and Targets', 'Security, Wireframes, Outputs, and Tests'], correctIndex: 0 },
  { id: 610, question: 'What is Requirement Elicitation and what are its common techniques?', options: ['The practice of gathering and discovering requirements from stakeholders using interviews, workshops, surveys, observation, and document analysis', 'Writing automated unit tests in JavaScript', 'Designing SQL database schemas in MySQL Workbench', 'Deploying cloud servers to AWS EC2'], correctIndex: 0 },
  { id: 611, question: 'In User Story formulation, what is the role of Acceptance Criteria?', options: ['Pre-defined conditions that a software product must satisfy for a user story to be accepted by the Product Owner as "Done"', 'The minimum price a customer is willing to pay for a feature', 'The job description requirements for hiring developers', 'The password complexity rules for user login'], correctIndex: 0 },
  { id: 612, question: 'What is the purpose of a Stakeholder Influence-Interest Matrix (Power-Interest Grid)?', options: ['Categorizing stakeholders to determine the appropriate communication and engagement strategy (Manage Closely, Keep Satisfied, Keep Informed, Monitor)', 'Calculating sales commission payouts for account managers', 'Ranking developer coding velocity in GitHub commits', 'Selecting third-party software vendor contracts'], correctIndex: 0 },
  { id: 613, question: 'What does a PESTLE Analysis evaluate in macro-environmental business research?', options: ['Political, Economic, Sociocultural, Technological, Legal, and Environmental external factors impacting business viability', 'Process, Estimation, Strategy, Timeline, Leadership, and Execution', 'Product, Engineering, Sales, Testing, Logistics, and Enterprise', 'Protocols, Encryption, Servers, Tokens, Latency, and Edge'], correctIndex: 0 },
  { id: 614, question: 'What is a Minimum Viable Product (MVP) and why is it built first?', options: ['A version of a product with just enough core features to be usable by early customers and validate business hypotheses with minimal investment', 'The cheapest prototype made with paper mockups', 'A fully featured software application ready for IPO launch', 'A temporary database backup created during migration'], correctIndex: 0 },
  { id: 615, question: 'In Agile, what is the definition of "Velocity"?', options: ['The average amount of user story points a Scrum team delivers and marks as "Done" during a single sprint iteration', 'The download speed of the application over 5G networks', 'The time taken to deploy code from Git to production', 'The number of meetings held per business quarter'], correctIndex: 0 },
  { id: 616, question: 'What is the purpose of Root Cause Analysis (e.g. 5 Whys, Fishbone / Ishikawa Diagram)?', options: ['Systematically identifying the fundamental underlying reason for an operational problem rather than merely addressing surface symptoms', 'Tracking employee attendance across departments', 'Calculating quarterly financial tax deductions', 'Testing API response times across international regions'], correctIndex: 0 },
  { id: 617, question: 'What is Change Management in enterprise software implementation?', options: ['A structured approach to transitioning individuals, teams, and organizations from the current operational state to a desired future state smoothly', 'Changing developer login passwords every 30 days', 'Modifying Git branch names before a merge commit', 'Upgrading computer monitor hardware in the office'], correctIndex: 0 },
  { id: 618, question: 'In requirements engineering, what does a Traceability Matrix (RTM) ensure?', options: ['Maps each business requirement forwards to design, development, and test cases to ensure zero requirements are overlooked or untested', 'Tracks employee physical locations via GPS badges', 'Measures network packet loss between microservices', 'Calculates cloud hosting costs per user query'], correctIndex: 0 },
  { id: 619, question: 'What is Scope Creep and how does an experienced Business Analyst prevent it?', options: ['Uncontrolled growth of project scope without adjustments to time, cost, or resources; managed with formal Change Request processes and clear baseline approvals', 'A software bug that causes memory leaks in React', 'A slow internet connection during client demos', 'When developers work overtime without logging hours'], correctIndex: 0 },
  { id: 620, question: 'What is the purpose of MoSCoW Prioritization framework in backlog refinement?', options: ['Categorizing requirements into Must-have, Should-have, Could-have, and Won\'t-have (this time) to manage delivery expectations', 'Sorting tasks alphabetically by task name', 'Assigning tasks to developers based on seniority', 'Calculating the budget in US Dollars vs Euros'], correctIndex: 0 },
  { id: 621, question: 'What does a Use Case Diagram visually capture in system modeling?', options: ['The interactions and boundaries between external actors (users, systems) and the system\'s key functional capabilities', 'The internal relational table foreign key constraints', 'The physical wiring of data center rack servers', 'The corporate organizational chart of executive leadership'], correctIndex: 0 },
  { id: 622, question: 'In financial feasibility analysis, what does Return on Investment (ROI) measure?', options: ['ROI = (Net Profit / Cost of Investment) * 100, evaluating the financial profitability and efficiency of a proposed project', 'The time taken to write 10,000 lines of code', 'The percentage of happy customer survey responses', 'The number of server CPU cores utilized during peak hours'], correctIndex: 0 },
  { id: 623, question: 'What is a Business Process Re-engineering (BPR) initiative?', options: ['Radically redesigning core business workflows from the ground up to achieve dramatic improvements in cost, quality, speed, and customer service', 'Reinstalling Windows OS on employee laptops', 'Rewriting SQL queries to use subqueries', 'Redesigning the corporate company logo'], correctIndex: 0 },
  { id: 624, question: 'What is a Persona in user-centered requirement engineering?', options: ['A semi-fictional archetypal representation of a target user segment based on real data, research, goals, pain points, and behavioral patterns', 'A celebrity hired for product marketing campaigns', 'A fake customer account used for penetration testing', 'An anonymous IP address connecting through VPN'], correctIndex: 0 },
  { id: 625, question: 'In Agile Scrum, who holds the sole authority to prioritize and accept items in the Product Backlog?', options: ['The Product Owner', 'The Lead Backend Engineer', 'The Scrum Master', 'The External Marketing Consultant'], correctIndex: 0 },
  { id: 626, question: 'What does a Feasibility Study evaluate prior to project kickoff?', options: ['Technical, economic, operational, legal, and schedule viability of a proposed business solution before major capital commitment', 'The speed of developer typing tests', 'The office air conditioning temperature', 'The number of coffee machines required in the breakroom'], correctIndex: 0 },
  { id: 627, question: 'What is an Entity Relationship Diagram (ERD) used for in business and technical analysis?', options: ['Modeling the data entities, attributes, and cardinality relationships (1:1, 1:N, N:M) within an enterprise system domain', 'Visualizing sales commission payouts over time', 'Showing the daily schedule of Scrum meetings', 'Mapping the physical layout of the corporate office'], correctIndex: 0 },
  { id: 628, question: 'What is the purpose of a Daily Standup (Scrum) meeting?', options: ['A brief 15-minute sync for team members to share what they accomplished yesterday, what they plan to do today, and surface blockers', 'A detailed 2-hour technical code review session', 'An executive budget negotiation meeting', 'A presentation to external client stakeholders'], correctIndex: 0 },
  { id: 629, question: 'In requirements gathering, what is a Focus Group?', options: ['A guided qualitative discussion with a diverse representative sample of target users to gather feedback, attitudes, and perceptions about a product idea', 'A group of developers fixing urgent server bugs', 'A team of accountants auditing financial tax records', 'A private Slack channel for executive leadership'], correctIndex: 0 },
  { id: 630, question: 'What is a KPI (Key Performance Indicator) and how does a BA establish one?', options: ['A quantifiable measure used to evaluate the success of an organization or project in meeting strategic operational objectives, tied to specific target milestones', 'A password key used to access JIRA dashboards', 'A physical token required to enter office buildings', 'A programming language used for database triggers'], correctIndex: 0 },
  { id: 631, question: 'What does Benchmarking accomplish in competitive market analysis?', options: ['Comparing an organization\'s internal business processes and performance metrics to industry bests and top competitors to identify improvement opportunities', 'Measuring CPU benchmark scores on gaming computers', 'Checking employee clock-in times on Monday mornings', 'Testing SQL query execution times on SQLite'], correctIndex: 0 },
  { id: 632, question: 'What is the purpose of a Business Case document?', options: ['Providing justification for undertaking a project, detailing expected business benefits, cost-benefit analysis, risks, and strategic alignment', 'A legal lawsuit filed against an external vendor', 'A user manual for installing desktop software', 'A spreadsheet of employee contact phone numbers'], correctIndex: 0 },
  { id: 633, question: 'In Agile, what is a "Spike" story?', options: ['A time-boxed research or technical exploration task aimed at resolving uncertainty, gathering knowledge, or assessing risk before estimating full stories', 'A sudden spike in server CPU utilization', 'An urgent bug reported by the CEO', 'A cancelled sprint due to holiday break'], correctIndex: 0 },
  { id: 634, question: 'What is User Acceptance Testing (UAT) in the software development lifecycle?', options: ['The final phase where actual end users and business stakeholders validate whether the software meets their real-world operational requirements before release', 'Automated unit tests written by backend developers in Jest', 'A test to check if the server can handle 10,000 requests per second', 'An interview test given to candidates applying for BA roles'], correctIndex: 0 },
  { id: 635, question: 'What does a Context Diagram (Level 0 DFD) represent in system analysis?', options: ['The highest-level view of a system showing external entities, major data flows entering and exiting, and treating the entire system as a single black box', 'A detailed diagram of internal database foreign keys', 'A low-level assembly code flowchart', 'A CSS styling wireframe for mobile screens'], correctIndex: 0 }
];

// 7. UI/UX DESIGNER (35 MCQs)
stage2['UI/UX Designer'] = [
  { id: 701, question: 'In Figma, what is the primary benefit of using Auto Layout?', options: ['Creating dynamic, responsive components whose padding, spacing, and child alignment adapt automatically to content changes and container resizing', 'Automatically translating English UI text into 50 languages', 'Exporting React JSX code directly to AWS production servers', 'Encrypting design files with SHA-256 passwords'], correctIndex: 0 },
  { id: 702, question: 'What does the 60-30-10 Rule dictate in visual UI color palette design?', options: ['60% dominant neutral base color, 30% secondary structural color, and 10% accent color for primary actions and focus highlights', '60% white text, 30% black background, 10% gray borders', '60% opacity for modals, 30% opacity for tooltips, 10% opacity for shadows', '60% images, 30% text, 10% buttons on web pages'], correctIndex: 0 },
  { id: 703, question: 'What is the purpose of Jakob\'s Law in UX design psychology?', options: ['Users spend most of their time on other websites, meaning they expect your site to work similarly to the familiar conventions they already know', 'Users click on the largest button on the screen 90% of the time', 'Dark mode reduces eye strain by exactly 50%', 'Web pages must load in less than 1.0 second'], correctIndex: 0 },
  { id: 704, question: 'In accessibility (WCAG 2.1 AA guidelines), what is the minimum required contrast ratio for normal body text against its background?', options: ['4.5 : 1', '2.0 : 1', '10.0 : 1', '1.5 : 1'], correctIndex: 0 },
  { id: 705, question: 'What does Fitts\'s Law state regarding interactive UI targets (buttons, links)?', options: ['The time required to rapidly move to a target is a function of the ratio between the distance to the target and the width of the target', 'Users read web pages in an F-shaped pattern from top to bottom', 'Short sentences are remembered better than long paragraphs', 'Color contrast determines button click-through rate'], correctIndex: 0 },
  { id: 706, question: 'What is the primary difference between a Low-Fidelity Wireframe and a High-Fidelity Prototype?', options: ['Low-fidelity wireframes focus on structural layout and content hierarchy without visual styling; high-fidelity prototypes simulate realistic visuals, interactions, and animations', 'Low-fidelity wireframes are coded in HTML; high-fidelity are drawn on paper', 'High-fidelity prototypes cannot be shown to clients', 'There is no design difference between them'], correctIndex: 0 },
  { id: 707, question: 'What is a Design System and why do mature engineering organizations maintain one?', options: ['A single source of truth comprising reusable UI components, design tokens (colors, typography, spacing), guidelines, and code implementations for consistent scalable products', 'A paid subscription to Adobe Creative Cloud', 'A team of graphic designers working on marketing banners', 'A database schema for storing user avatars'], correctIndex: 0 },
  { id: 708, question: 'What does Hick\'s Law predict about user decision-making time in digital interfaces?', options: ['The time it takes to make a decision increases logarithmically with the number and complexity of choices presented to the user', 'Users leave a page if it takes more than 3 seconds to load', 'People remember 7 plus or minus 2 items in short-term memory', 'Mobile users click faster with their thumb than index finger'], correctIndex: 0 },
  { id: 709, question: 'In typography, what is the difference between Kerning and Tracking?', options: ['Kerning adjusts the spacing between a specific pair of adjacent characters; Tracking adjusts the uniform letter-spacing across an entire word or block of text', 'Kerning is for serif fonts; Tracking is for sans-serif fonts', 'Tracking sets line-height; Kerning sets font-size', 'They are exact synonyms in Figma'], correctIndex: 0 },
  { id: 710, question: 'What is the Gestalt Principle of Proximity in visual hierarchy?', options: ['Elements placed close to each other are perceived by the human brain as belonging together as a related group or unit', 'Objects with similar colors are perceived as dangerous', 'Larger elements are perceived as further away in 3D space', 'Moving elements draw less attention than static text'], correctIndex: 0 },
  { id: 711, question: 'What is an Information Architecture (IA) Site Map in digital product design?', options: ['A visual structural diagram showing the hierarchical organization, categorization, navigation paths, and relationships of pages across a digital platform', 'A physical floor plan of the corporate office building', 'A Google Maps integration for store locator pages', 'A CSS grid layout for responsive tablet viewports'], correctIndex: 0 },
  { id: 712, question: 'What is the purpose of Micro-interactions in modern product UI (e.g. button click ripples, toggle morphs, progress rings)?', options: ['Providing immediate visual feedback, communicating status changes, enhancing delight, and guiding user mental models without overwhelming cognitive load', 'Encrypting form data before sending over HTTPS', 'Speeding up JavaScript execution on low-end mobile devices', 'Compressing SVG icons for faster CDN caching'], correctIndex: 0 },
  { id: 713, question: 'In user research, what is the difference between Generative (Discovery) Research and Evaluative Research?', options: ['Generative research uncovers deep user needs, mental models, and opportunity spaces before building; evaluative research tests specific designs/prototypes for usability and effectiveness', 'Generative research is done by AI; evaluative is done by humans', 'Evaluative research only uses online surveys with 5-star ratings', 'There is no research distinction in agile UX'], correctIndex: 0 },
  { id: 714, question: 'What does Miller\'s Law (The Magical Number 7 ± 2) state in cognitive psychology?', options: ['The average human mind can hold approximately 7 (plus or minus 2) chunks of information in working memory at one time', 'Users should never be asked to click more than 7 times to purchase', 'Every web page must have exactly 7 navigation links', 'A design team should consist of 7 designers'], correctIndex: 0 },
  { id: 715, question: 'In UX usability testing, what is the "Think-Aloud Protocol"?', options: ['Asking test participants to verbalize their thoughts, expectations, confusions, and feelings out loud as they navigate a product workflow', 'A presentation given by the lead designer to client executives', 'An AI speech-to-text algorithm built into mobile apps', 'A brainstorming session with 20 team members in a room'], correctIndex: 0 },
  { id: 716, question: 'What is the purpose of Design Tokens in cross-platform product design?', options: ['Platform-agnostic key-value variables (e.g. color-primary: #3b82f6, space-sm: 8px) that synchronize design files directly with iOS, Android, and Web CSS codebases', 'Cryptocurrency tokens rewarded to beta testers', 'Login access tokens generated by OAuth2 servers', 'Figma premium subscription discount vouchers'], correctIndex: 0 },
  { id: 717, question: 'What is the primary benefit of conducting a Card Sorting exercise with users?', options: ['Discovering how target users naturally categorize and label domain concepts to inform intuitive information architecture and navigation menus', 'Playing poker games during team retrospectives', 'Testing credit card payment gateway forms for checkout errors', 'Evaluating color contrast ratios on mobile displays'], correctIndex: 0 },
  { id: 718, question: 'In visual hierarchy, what does White Space (Negative Space) provide to an interface?', options: ['Reduces cognitive clutter, creates visual breathing room, directs user focus toward key content, and elevates perceived product elegance and clarity', 'Wastes valuable screen real estate on mobile devices', 'Indicates that the web page failed to load images properly', 'Slows down rendering on low-end smartphones'], correctIndex: 0 },
  { id: 719, question: 'What does the Serial Position Effect dictate regarding how users remember list items?', options: ['Users have a strong tendency to recall the first items (Primacy effect) and the last items (Recency effect) in a list much better than items in the middle', 'Users always click on the 3rd item in a navigation drawer', 'List items should always be sorted by date modified', 'Numbered lists perform worse than bulleted lists'], correctIndex: 0 },
  { id: 720, question: 'What is the purpose of an Empathy Map in UX design discovery?', options: ['A collaborative visual tool used to articulate what a specific user Persona Says, Thinks, Does, and Feels to align cross-functional product teams', 'A heat map showing where users click their mouse on a page', 'A diagram mapping network latency between global cloud regions', 'A legal agreement signed by usability test participants'], correctIndex: 0 },
  { id: 721, question: 'In form UX design, why is Top-Aligned Label positioning generally preferred over side-aligned labels on mobile devices?', options: ['Reduces horizontal eye movement and eye fixation jumps, allowing faster vertical scanning and seamless layout adaptation on narrow screens', 'Top-aligned labels take up less vertical height on desktop', 'Side-aligned labels are not supported in HTML5', 'Top-aligned labels require zero CSS styling'], correctIndex: 0 },
  { id: 722, question: 'What is the difference between Skeuomorphic Design, Flat Design, and Neumorphism / Glassmorphism?', options: ['Skeuomorphism mimics real-world physical textures (wood, leather); Flat design removes drop shadows and gradients; Glassmorphism uses frosted glass blur and translucent borders', 'Flat design uses 3D WebGL rendering; Skeuomorphism uses pure HTML', 'Glassmorphism only works on Apple iOS devices', 'There is no visual difference in modern web design'], correctIndex: 0 },
  { id: 723, question: 'What is a User Journey Map in service design?', options: ['A visual timeline showing all touchpoints, user actions, thoughts, emotional highs/lows, and pain points a person experiences while achieving a goal with a product', 'A GPS route showing the user\'s physical driving directions', 'A flowchart mapping API microservice endpoints', 'A Gantt chart tracking the UI designer\'s daily working hours'], correctIndex: 0 },
  { id: 724, question: 'In Figma, what are Component Variants used for?', options: ['Grouping related variations of a single component (e.g. Button with States: Default, Hover, Active, Disabled; Sizes: Sm, Md, Lg) into one unified manageable asset', 'Exporting designs to PDF and MP4 formats simultaneously', 'Translating Figma vectors into Photoshop PSD files', 'Encrypting proprietary design files with password protection'], correctIndex: 0 },
  { id: 725, question: 'What is the Aesthetic-Usability Effect in user experience research?', options: ['Users perceive visually appealing, aesthetically polished designs as more usable and are more tolerant of minor usability shortcomings', 'Ugly websites convert 50% better than beautiful designs', 'Users ignore website visual styling completely when purchasing', 'Aesthetics only matter for consumer fashion websites'], correctIndex: 0 },
  { id: 726, question: 'What is the purpose of Breadcrumbs in web navigation UX?', options: ['A secondary navigation trail showing the user\'s current location within the site hierarchy and allowing quick upward navigation to parent categories', 'Tracking user cookies across third-party websites', 'Displaying recipe cooking instructions on food blogs', 'Animating loading spinners during data fetch'], correctIndex: 0 },
  { id: 727, question: 'In accessible design, what does "Focus State" styling communicate?', options: ['Visually indicates which interactive element is currently active and receiving keyboard input focus for keyboard-only and screen reader navigation', 'Displays a camera focus indicator on photo uploaders', 'Dims the screen brightness when the laptop battery is low', 'Locks user input during background database queries'], correctIndex: 0 },
  { id: 728, question: 'What is a Heuristic Evaluation in UX auditing?', options: ['An expert inspection method where evaluators examine an interface against established usability principles (e.g. Nielsen\'s 10 Usability Heuristics) to identify friction', 'A statistical A/B test run with 10,000 real users', 'An automated code linting check in ESLint', 'A psychological personality test for UI designers'], correctIndex: 0 },
  { id: 729, question: 'What is progressive disclosure in interface design?', options: ['Sequencing information and complex actions across multiple logical steps to avoid cognitive overload, presenting only essential details upfront', 'Revealing user passwords one letter at a time', 'Gradually increasing font size as users scroll down', 'Fading in images over 10 seconds for dramatic effect'], correctIndex: 0 },
  { id: 730, question: 'In digital typography, what is the ideal line length (measure) for optimal reading comfort on desktop screens?', options: ['50 to 75 characters (including spaces) per line', '150 to 200 characters per line', '10 to 20 characters per line', 'Full 100% screen width regardless of monitor size'], correctIndex: 0 },
  { id: 731, question: 'What is the purpose of an Onboarding Flow in consumer and SaaS applications?', options: ['Guiding first-time users to their core "Aha! moment", demonstrating value, setting up essential preferences, and reducing initial drop-off', 'Collecting credit card details before explaining the product', 'Forcing users to read a 50-page legal terms of service', 'Sending 10 marketing emails to the user\'s inbox on day one'], correctIndex: 0 },
  { id: 732, question: 'What does the SUS (System Usability Scale) survey calculate?', options: ['A standardized 10-item questionnaire giving a composite score from 0 to 100 measuring the subjective usability and learnability of a product (68 is average)', 'The temperature of the user\'s mobile phone battery', 'The server CPU utilization during heavy user traffic', 'The page load speed in milliseconds on 4G networks'], correctIndex: 0 },
  { id: 733, question: 'What is Skeleton Loading (Shimmer Screens) and why is it preferred over traditional circular spinners?', options: ['Displays placeholder wireframe shapes mimicking the final layout structure, giving an immediate sense of progressive loading and lower perceived wait time', 'Reduces server data usage by 90%', 'Animates 3D skeletons during Halloween seasonal promotions', 'Translates loading messages into 20 languages'], correctIndex: 0 },
  { id: 734, question: 'What is the difference between Responsive Design and Adaptive Design?', options: ['Responsive design uses fluid fluid grids and flexible CSS media queries to smoothly reflow content across any screen size; adaptive design serves distinct static layouts for fixed breakpoints', 'Responsive design only works on mobile phones; adaptive works on desktop', 'Adaptive design requires writing separate apps in Swift and Java', 'There is no difference in modern CSS'], correctIndex: 0 },
  { id: 735, question: 'What is the purpose of a Design Critique session among cross-functional product teams?', options: ['A structured collaborative review where designers, engineers, and product managers give constructive feedback on design solutions relative to user and business goals', 'A meeting where executives dictate exact hex color codes', 'A test to grade junior designers on keyboard shortcuts', 'An argument over which UI design software is best'], correctIndex: 0 }
];

// 8. BUSINESS DEVELOPMENT EXECUTIVE (35 MCQs)
stage2['Business Development Executive'] = [
  { id: 801, question: 'What is the BANT qualification framework used for in enterprise sales discovery?', options: ['Qualifying prospective leads based on Budget, Authority, Need, and Timeline to assess sales readiness and deal viability', 'Calculating monthly recurring revenue (MRR)', 'Tracking email deliverability rates on cold campaigns', 'Automating contract signing workflows with DocuSign'], correctIndex: 0 },
  { id: 802, question: 'What does Customer Acquisition Cost (CAC) to Customer Lifetime Value (LTV) ratio indicate about business health?', options: ['A healthy SaaS business typically targets an LTV:CAC ratio of 3:1 or higher (lifetime customer value is at least 3x the cost of acquiring them)', 'A 1:1 ratio represents hyper-profitable venture growth', 'CAC should always be 5x higher than LTV', 'LTV:CAC only applies to retail brick-and-mortar stores'], correctIndex: 0 },
  { id: 803, question: 'What is the primary difference between Inbound Lead Generation and Outbound Prospecting?', options: ['Inbound attracts prospects who proactively discover and reach out through marketing content/SEO; Outbound involves targeted proactive outreach via cold calls, emails, and LinkedIn', 'Inbound is only for enterprise clients; Outbound is for small businesses', 'Outbound has a 100% conversion rate on every campaign', 'Inbound does not require a CRM system'], correctIndex: 0 },
  { id: 804, question: 'In modern consultative selling, what is the best practice for handling a prospect\'s price objection ("Your solution is too expensive")?', options: ['Acknowledge the concern, uncover specific budget/value drivers, and re-frame the conversation around business ROI, cost of inaction, and expected financial returns', 'Immediately discount the proposal price by 50% without asking questions', 'Tell the prospect they cannot afford quality software', 'End the sales call immediately and mark the lead as lost'], correctIndex: 0 },
  { id: 805, question: 'What is the MEDDIC enterprise sales methodology designed to accomplish?', options: ['A qualification framework focusing on Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, and Champion for high-value complex deals', 'A medical software compliance certification standard', 'A script for leaving automated voicemails on cold calls', 'A formula for calculating sales executive base salaries'], correctIndex: 0 },
  { id: 806, question: 'What does Sales Velocity measure across a sales pipeline?', options: ['How quickly deals move through your pipeline and generate revenue: (Number of Opportunities * Win Rate * Average Deal Size) / Sales Cycle Length', 'The typing speed of sales reps sending email proposals', 'The number of phone calls made per hour on cold outreach', 'The speed of credit card payment processing gateways'], correctIndex: 0 },
  { id: 807, question: 'What is the role of a "Champion" inside an enterprise prospect\'s organization?', options: ['An internal stakeholder who has influence, actively advocates for your solution, wants your product to win, and helps navigate internal procurement', 'The CEO who signs the final contract check', 'The IT administrator who installs the software', 'An external consultant hired to audit sales reps'], correctIndex: 0 },
  { id: 808, question: 'In sales funnel terminology, what characterizes the Top-of-Funnel (TOFU) stage?', options: ['Building initial awareness, educating prospects on industry challenges, and capturing contact information of qualified leads', 'Sending final contract pricing and legal NDAs for signature', 'Upselling existing customers on multi-year enterprise renewals', 'Conducting technical deep-dive API security audits'], correctIndex: 0 },
  { id: 809, question: 'What is the primary objective of a Sales Discovery Call?', options: ['Asking targeted open-ended questions to uncover the prospect\'s core operational pain points, business goals, current bottlenecks, and evaluation timeline', 'Delivering a 45-minute monologue slide deck presentation', 'Pressuring the prospect to sign an annual contract immediately', 'Reading the entire product feature list word for word'], correctIndex: 0 },
  { id: 810, question: 'In account-based marketing and sales (ABM), what is Multi-Threading?', options: ['Building active relationships with multiple decision-makers and influencers (e.g. VP Tech, Head of Finance, End Users) within a single target enterprise account', 'Executing multi-threaded Python scripts to scrape lead lists', 'Calling 5 prospects at the exact same second on a dialer', 'Sending identical emails to 1,000 unverified email addresses'], correctIndex: 0 },
  { id: 811, question: 'What is the difference between Up-Selling and Cross-Selling to existing clients?', options: ['Up-selling encourages clients to upgrade to a premium tier or higher volume capacity; Cross-selling introduces complementary add-on products or services', 'Up-selling is for new leads; Cross-selling is for churned leads', 'Up-selling lowers contract price; Cross-selling increases price', 'There is no revenue difference between them'], correctIndex: 0 },
  { id: 812, question: 'What does Net Revenue Retention (NRR) measure in B2B SaaS business models?', options: ['The percentage of recurring revenue retained from existing customers over a year, including expansions, upgrades, and subtracting downgrades and churn (110%+ is top-tier)', 'The total revenue before deducting employee tax withholdings', 'The percentage of cold emails opened on Tuesday mornings', 'The profit margin on one-time hardware sales'], correctIndex: 0 },
  { id: 813, question: 'What is a Non-Disclosure Agreement (NDA) in commercial partnership discussions?', options: ['A legally binding contract where parties agree to protect and not disclose confidential business, technical, or financial information shared during negotiations', 'An invoice requesting immediate bank wire transfer', 'A marketing press release published on social media', 'A performance review given to sales executives'], correctIndex: 0 },
  { id: 814, question: 'In email outreach deliverability, what do SPF, DKIM, and DMARC DNS records prevent?', options: ['Email spoofing, phishing impersonation, and domain reputation damage, ensuring legitimate sales emails land in the primary inbox rather than spam', 'Server hard drive crashes during bulk mailing', 'Duplicate records from being inserted into Salesforce CRM', 'Unwanted phone calls from competing vendors'], correctIndex: 0 },
  { id: 815, question: 'What is the Challenger Sale model approach?', options: ['Teaching prospects about unexpected industry insights, tailoring messaging to their specific business drivers, and constructively taking control of the sales conversation', 'Challenging prospects to a price-matching bidding war with competitors', 'Calling prospects 10 times a day until they answer', 'Refusing to answer client questions during product demos'], correctIndex: 0 },
  { id: 816, question: 'What is the purpose of an SLA (Service Level Agreement) in enterprise vendor contracts?', options: ['A formal commitment defining agreed standards for service uptime (e.g. 99.9%), support response times, and financial penalties for non-compliance', 'A sales script used for cold telephone outreach', 'A certificate proving the company founder attended university', 'A receipt for corporate travel expense reimbursement'], correctIndex: 0 },
  { id: 817, question: 'In commercial negotiations, what does BATNA stand for?', options: ['Best Alternative To a Negotiated Agreement (the most advantageous course of action a party can take if negotiations fall through)', 'Business Administration and Technical Network Architecture', 'Budget Allocation Timeline and Next Actions', 'Billing Authorization and Tax Number Agreement'], correctIndex: 0 },
  { id: 818, question: 'What is the purpose of an RFP (Request for Proposal) issued by enterprise buyers?', options: ['A formal procurement document detailing project requirements and inviting qualified vendors to submit structured bids, pricing, and capability proposals', 'A request for a sales rep to lower their price by 20%', 'A tax audit notice from government authorities', 'A feedback rating left on Google Maps'], correctIndex: 0 },
  { id: 819, question: 'What is a Pilot Project (Proof of Concept / PoC) in complex B2B software sales?', options: ['A scoped, time-boxed trial implementation with clear success criteria designed to prove technical and operational value in the client\'s environment before full rollout', 'An airplane flight booked to visit a remote client office', 'A free lifetime subscription given to early beta testers', 'An unannounced server test conducted on live production databases'], correctIndex: 0 },
  { id: 820, question: 'What does the Sales Pipeline Conversion Rate measure?', options: ['The percentage of initial qualified opportunities that successfully advance through each funnel stage and close as Won customers', 'The speed of currency exchange from USD to INR', 'The percentage of sales reps who hit their annual quota', 'The bounce rate of visitors on the pricing webpage'], correctIndex: 0 },
  { id: 821, question: 'In B2B contract negotiations, what is an Indemnification Clause?', options: ['A contractual provision where one party agrees to protect, defend, and hold harmless the other party against financial losses or legal claims arising from specified liabilities', 'A clause granting free software upgrades forever', 'A payment discount given for upfront annual billing', 'A termination agreement signed when an employee resigns'], correctIndex: 0 },
  { id: 822, question: 'What is the purpose of a CRM system (e.g. HubSpot, Salesforce, Pipedrive) in business development?', options: ['Centrally managing customer interactions, lead statuses, deal pipelines, interaction logs, follow-up reminders, and revenue forecasting analytics', 'Writing frontend JavaScript code for React websites', 'Compiling PyTorch models on cloud GPUs', 'Managing office inventory and stationery supplies'], correctIndex: 0 },
  { id: 823, question: 'What is a "Loss Leader" pricing strategy?', options: ['Offering a product or service at a very low price or slight loss to attract new enterprise customers and monetize through long-term high-margin add-ons and services', 'Selling counterfeit software licenses at steep discounts', 'A sales rep who consistently misses their quarterly quota', 'A marketing campaign that fails to generate any leads'], correctIndex: 0 },
  { id: 824, question: 'In sales communications, what is the best practice for cold email subject lines?', options: ['Short, personalized, curiosity-inducing subject lines (under 6 words) that sound like a relevant 1-on-1 human inquiry rather than generic promotional spam', 'Writing ALL CAPS text with multiple exclamation marks and fire emojis', 'Leaving the subject line completely blank', 'Writing a 200-word paragraph in the subject header'], correctIndex: 0 },
  { id: 825, question: 'What is the difference between an Economic Buyer and a User Buyer?', options: ['The Economic Buyer has final budget sign-off authority and focuses on ROI/business impact; the User Buyer focuses on hands-on daily usability and workflow fit', 'The Economic Buyer is an accountant; the User Buyer is a CEO', 'User Buyers sign the legal contract checks', 'There is no difference in enterprise procurement'], correctIndex: 0 },
  { id: 826, question: 'What does MRR (Monthly Recurring Revenue) vs ARR (Annual Recurring Revenue) represent in subscription businesses?', options: ['MRR is the predictable normalized subscription revenue earned each month; ARR is the annualized value of recurring subscription contracts (ARR = MRR * 12)', 'MRR is for monthly invoices; ARR is for one-time consulting setup fees', 'ARR includes one-time equipment sales while MRR does not', 'They are exact synonyms with no time horizon difference'], correctIndex: 0 },
  { id: 827, question: 'In sales pipeline management, what is a "Stalled Deal" and how should a BDE re-engage it?', options: ['A deal where communication has paused; re-engaged by providing new value (e.g. case study, relevant industry benchmark, new feature release) rather than just "checking in"', 'A deal where the client company has gone bankrupt', 'A deal that was signed 5 years ago', 'A lead whose email address bounced permanently'], correctIndex: 0 },
  { id: 828, question: 'What is Total Addressable Market (TAM) in market expansion planning?', options: ['The overall revenue opportunity available if a product or service were to achieve 100% market share across all potential customers in its domain', 'The total money currently in the company bank account', 'The total number of employees working in the sales department', 'The marketing budget allocated for Google Search Ads'], correctIndex: 0 },
  { id: 829, question: 'What is the purpose of a Case Study / Customer Success Story in enterprise sales collateral?', options: ['Demonstrating tangible proof of how a similar customer solved a specific operational problem and achieved quantifiable financial or efficiency results', 'A legal court case summary regarding intellectual property', 'A fictional story written to entertain website visitors', 'A technical whitepaper detailing Linux kernel assembly code'], correctIndex: 0 },
  { id: 830, question: 'What is the "Assumptive Close" technique in sales conversation management?', options: ['Acting with professional confidence under the natural assumption that the prospect has decided to move forward (e.g. "Should we set our onboarding kickoff for Monday or Wednesday?")', 'Assuming the prospect will reject the proposal without asking', 'Assuming competitor pricing is 10x higher than reality', 'Signing the contract on behalf of the client without their consent'], correctIndex: 0 },
  { id: 831, question: 'What is an SDR (Sales Development Representative) vs an AE (Account Executive)?', options: ['SDRs specialize in outbound prospecting, lead qualification, and booking initial meetings; AEs lead discovery calls, product demos, negotiations, and closing deals', 'SDRs write software code; AEs manage corporate finances', 'AEs work only in marketing departments', 'There is no division of labor in modern sales organizations'], correctIndex: 0 },
  { id: 832, question: 'What is the purpose of Channel Partnerships (Reseller, Referral, System Integrator)?', options: ['Leveraging third-party organizations to distribute, recommend, or implement your product, accelerating market reach and scaling sales without hiring proportional direct headcount', 'Advertising on television channels during sports events', 'Connecting multiple Slack channels together', 'Merging two competing software companies into one'], correctIndex: 0 },
  { id: 833, question: 'What does Sales Quota Attainment measure for a business development professional?', options: ['The percentage of assigned revenue or deal target that a sales representative successfully closes within a given quarter or fiscal year', 'The number of hours a sales rep spends on Zoom calls', 'The score a candidate receives on a job assessment test', 'The discount percentage applied to enterprise contracts'], correctIndex: 0 },
  { id: 834, question: 'In consultative selling, why is Active Listening more effective than pitch-heavy selling?', options: ['Uncovers the prospect\'s authentic unstated pain points, builds trust, and allows the rep to tailor the solution directly to what the buyer genuinely cares about', 'Allows the sales rep to take a nap while the customer speaks', 'Reduces phone call duration to under 2 minutes', 'Eliminates the need for any contract proposals or pricing'], correctIndex: 0 },
  { id: 835, question: 'What is a Mutual Action Plan (MAP) / Joint Evaluation Plan in enterprise sales?', options: ['A shared collaborative document co-created with the buyer outlining all milestones, evaluation criteria, stakeholder reviews, and target dates required to achieve a successful go-live', 'A contract where both parties agree to merge their companies', 'An insurance policy covering server hardware failures', 'A marketing schedule for social media posts'], correctIndex: 0 }
];

console.log('--- ALL 8 ROLES POPULATED ---');
for (const [r, list] of Object.entries(stage2)) {
  console.log(`${r}: ${list.length} MCQs`);
}

// Generate the final assessment_questions.js content
const finalCode = `/**
 * Enterprise Assessment Question Bank & Dynamic Randomization Engine
 * Contains 280 curated domain-specific MCQs across all 8 hiring domains (35 questions per role).
 * Every candidate attempt randomly samples 20 domain questions and shuffles all option orders.
 * Passing Threshold: 80% (>= 16/20 correct) for Automated Job Offer & Call Letter Dispatch.
 */

const ROLE_QUESTIONS_BANK = ${JSON.stringify(stage2, null, 2)};

// In-memory session store with TTL (3 hours)
const ACTIVE_ASSESSMENT_SESSIONS = new Map();

function cleanupOldSessions() {
  const now = Date.now();
  const TTL_MS = 3 * 60 * 60 * 1000;
  for (const [id, session] of ACTIVE_ASSESSMENT_SESSIONS.entries()) {
    if (now - session.createdAt > TTL_MS) {
      ACTIVE_ASSESSMENT_SESSIONS.delete(id);
    }
  }
}

/**
 * Normalizes user-applied role title to authoritative bank key.
 */
function normalizeRoleToBankKey(roleName) {
  const r = (roleName || '').toLowerCase().trim();
  if (r.includes('frontend') || r.includes('react') || r.includes('ui dev')) return 'Frontend Developer';
  if (r.includes('backend') || r.includes('node') || r.includes('api') || r.includes('database')) return 'Backend Developer';
  if (r.includes('full stack') || r.includes('fullstack') || r.includes('software engineer') || r.includes('lead ai') || r.includes('n8n')) return 'Full Stack AI Engineer';
  if (r.includes('ai') || r.includes('ml') || r.includes('machine learning') || r.includes('data sci')) return 'AI/ML Engineer';
  if (r.includes('data analyst') || r.includes('analytics') || r.includes('sql analyst')) return 'Data Analyst';
  if (r.includes('business analyst') || r.includes('product analyst') || r.includes('ba')) return 'Business Analyst';
  if (r.includes('ui') || r.includes('ux') || r.includes('design') || r.includes('figma')) return 'UI/UX Designer';
  if (r.includes('sales') || r.includes('business development') || r.includes('bde') || r.includes('growth')) return 'Business Development Executive';
  return 'Frontend Developer';
}

/**
 * Generates a fresh, randomized session of questions for a candidate.
 * 1. Samples 20 distinct questions from the domain bank without replacement.
 * 2. Shuffles the presentation order of the 20 questions.
 * 3. Shuffles the 4 options (A, B, C, D) for EVERY question.
 * 4. Securely maps sessionAnswerKey[questionId] = newCorrectIndex.
 * 5. Caches the session securely on server for scoring upon submission.
 */
function generateSessionAssessment(roleName, options = {}) {
  cleanupOldSessions();
  const sampleCount = options.sampleCount || 20;
  const key = normalizeRoleToBankKey(roleName);
  const pool = ROLE_QUESTIONS_BANK[key] || ROLE_QUESTIONS_BANK['Frontend Developer'];

  // Shuffle pool using Fisher-Yates and select sampleCount questions
  const shuffledPool = [...pool];
  for (let i = shuffledPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
  }

  const selectedQuestions = shuffledPool.slice(0, Math.min(sampleCount, shuffledPool.length));

  const clientQuestions = [];
  const sessionAnswerKey = {};
  const masterSessionQuestions = [];

  selectedQuestions.forEach((q) => {
    const originalCorrectText = q.options[q.correctIndex];
    const optionsCopy = [...q.options];

    // Shuffle options using Fisher-Yates
    for (let i = optionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
    }

    const newCorrectIndex = optionsCopy.indexOf(originalCorrectText);
    sessionAnswerKey[q.id] = newCorrectIndex;

    clientQuestions.push({
      id: q.id,
      question: q.question,
      options: optionsCopy
    });

    masterSessionQuestions.push({
      id: q.id,
      question: q.question,
      options: optionsCopy,
      correctIndex: newCorrectIndex
    });
  });

  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  ACTIVE_ASSESSMENT_SESSIONS.set(sessionId, {
    sessionId,
    role: key,
    createdAt: Date.now(),
    answerKey: sessionAnswerKey,
    questions: clientQuestions,
    masterQuestions: masterSessionQuestions
  });

  return {
    sessionId,
    role: key,
    totalQuestions: clientQuestions.length,
    questions: clientQuestions
  };
}

/**
 * Retrieves assessment questions for a domain.
 * Generates randomized question set & shuffled options per session.
 */
function getQuestionsForRole(roleName, stripAnswers = true, sampleCount = 20) {
  const session = generateSessionAssessment(roleName, { sampleCount });
  if (!stripAnswers) {
    const active = ACTIVE_ASSESSMENT_SESSIONS.get(session.sessionId);
    return active ? active.masterQuestions : session.questions;
  }
  return session;
}

/**
 * Evaluates candidate submission answers against the authoritative answer key.
 * Evaluates against the exact session answer key if sessionId provided, or master bank fallback.
 * Passing Threshold: 80% (>= 16 / 20).
 */
function evaluateAssessmentSubmission(roleName, candidateAnswers = {}, sessionId = null) {
  cleanupOldSessions();
  const key = normalizeRoleToBankKey(roleName);

  let session = null;
  if (sessionId && ACTIVE_ASSESSMENT_SESSIONS.has(sessionId)) {
    session = ACTIVE_ASSESSMENT_SESSIONS.get(sessionId);
  }

  let correctCount = 0;
  let totalQuestions = 0;
  const details = [];

  if (session && Array.isArray(session.masterQuestions) && session.masterQuestions.length > 0) {
    totalQuestions = session.masterQuestions.length;
    session.masterQuestions.forEach(q => {
      const userSelected = candidateAnswers[q.id] !== undefined ? parseInt(candidateAnswers[q.id]) : null;
      const isCorrect = userSelected === q.correctIndex;

      if (isCorrect) {
        correctCount++;
      }

      details.push({
        questionId: q.id,
        question: q.question,
        userSelected,
        correctIndex: q.correctIndex,
        isCorrect
      });
    });
  } else {
    // Fallback: evaluate against master pool
    const masterPool = ROLE_QUESTIONS_BANK[key] || ROLE_QUESTIONS_BANK['Frontend Developer'];
    const answeredIds = Object.keys(candidateAnswers).map(id => parseInt(id));
    const relevantQuestions = masterPool.filter(q => answeredIds.includes(q.id));
    const evalSet = relevantQuestions.length > 0 ? relevantQuestions : masterPool.slice(0, 20);

    totalQuestions = evalSet.length;
    evalSet.forEach(q => {
      const userSelected = candidateAnswers[q.id] !== undefined ? parseInt(candidateAnswers[q.id]) : null;
      const isCorrect = userSelected === q.correctIndex;

      if (isCorrect) {
        correctCount++;
      }

      details.push({
        questionId: q.id,
        question: q.question,
        userSelected,
        correctIndex: q.correctIndex,
        isCorrect
      });
    });
  }

  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercent >= 80;

  return {
    roleEvaluated: key,
    sessionId: session ? session.sessionId : sessionId,
    totalQuestions,
    correctCount,
    incorrectCount: totalQuestions - correctCount,
    scorePercent,
    passingThreshold: 80,
    passed,
    verdict: passed ? 'PASSED_OFFER_QUALIFIED' : 'FAILED_BELOW_THRESHOLD',
    details
  };
}

module.exports = {
  ROLE_QUESTIONS_BANK,
  ACTIVE_ASSESSMENT_SESSIONS,
  normalizeRoleToBankKey,
  generateSessionAssessment,
  getQuestionsForRole,
  evaluateAssessmentSubmission
};
`;

fs.writeFileSync(path.join(__dirname, 'assessment_questions.js'), finalCode, 'utf8');
console.log('✅ assessment_questions.js written with 280 questions and dynamic randomized session generation!');
