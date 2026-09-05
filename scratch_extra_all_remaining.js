const fs = require('fs');

function makeQ(id, question, options, correctIndex = 0, explanation = '') {
  return {
    id,
    question,
    options,
    correctIndex,
    explanation: explanation || `Option ${String.fromCharCode(65 + correctIndex)} provides the accurate verified solution.`
  };
}

// 4. AI/ML Engineer (IDs 451 - 500)
const extraAIML = [];
const aiMlQuestions = [
  ["In PyTorch, what is the difference between `model.eval()` and `torch.no_grad()`?", "model.eval() switches layers like Dropout and BatchNorm to evaluation behavior; torch.no_grad() disables autograd gradient calculation graph construction to save memory", "They are completely interchangeable", "torch.no_grad() deletes the model weights from GPU memory", "model.eval() converts the model to ONNX format"],
  ["What is the fundamental mechanism of LoRA (Low-Rank Adaptation) in LLM fine-tuning?", "Freezes pretrained model weights and injects trainable low-rank decomposition rank matrices (A and B) into attention layers, reducing trainable parameters by up to 99%", "Prunes 50% of the attention heads permanently", "Quantizes all weights to 1-bit integers", "Converts language models into convolutional networks"],
  ["In deep learning optimization, what does AdamW improve over traditional Adam?", "Decouples weight decay regularization from gradient updates, applying L2 penalty directly to parameters rather than confounding it with moving gradient moments", "Runs twice as fast on CPU hardware", "Eliminates the need for learning rate schedulers", "Automatically chooses the batch size"],
  ["What causes 'Vanishing Gradients' in deep feedforward neural networks and how is it mitigated?", "Repeated multiplication of small derivatives (e.g. sigmoid/tanh) across many layers causing gradients to approach zero; mitigated via ReLU/GELU activations, Residual Connections (ResNets), and LayerNorm", "Too many training epochs causing GPU overheating", "Using too large a batch size", "Having negative numbers in input datasets"],
  ["In Transformer architecture, how is Multi-Head Self-Attention computed?", "Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V, computed across h independent linear projection heads in parallel", "By convolving 3x3 filters across token embedding matrices", "Using recurrent LSTM hidden state transitions", "By multiplying weights by random noise"],
  ["What is the 'FlashAttention' algorithm in modern transformer engineering?", "An IO-aware exact attention algorithm that tiles computation to fit into fast GPU SRAM, eliminating slow GPU High Bandwidth Memory (HBM) read/writes for O(N) memory and 3-5x speedup", "An image compression format for computer vision", "A Python compiler for PyTorch models", "A method for converting models to FP8"],
  ["In evaluating binary classification models with severe class imbalance (e.g. 1% positive), which metric is preferred over ROC-AUC?", "Precision-Recall Area Under Curve (PR-AUC / Average Precision), because it does not include true negatives in its calculation and focuses on the minority positive class", "Accuracy score", "Mean Squared Error (MSE)", "Mean Absolute Percentage Error (MAPE)"],
  ["What is the purpose of 'Layer Normalization' (LayerNorm) compared to 'Batch Normalization' in Transformers?", "LayerNorm normalizes across the feature/channel dimension for each individual token independent of batch size; BatchNorm normalizes across the batch dimension", "LayerNorm is only for image pixels while BatchNorm is for text", "LayerNorm requires a batch size of at least 128", "BatchNorm runs in WebAssembly while LayerNorm runs on GPU"],
  ["What is 'Cross-Entropy Loss' measuring in multi-class classification?", "The divergence between the predicted probability distribution and the true one-hot encoded ground truth distribution: -sum(y_i * log(p_i))", "The mean squared distance between coordinates", "The percentage of misclassified samples", "The variance of the model parameter weights"],
  ["In training large models, what is 'Mixed Precision Training' (AMP - Automatic Mixed Precision)?", "Executes forward/backward passes in fast 16-bit (FP16 or BF16) precision while maintaining a master copy of weights in 32-bit (FP32) to save VRAM and boost tensor core speed without loss of precision", "Training on a mixture of images and text", "Combining CPU and GPU threads simultaneously", "Using both supervised and unsupervised datasets in one epoch"]
];

for (let i = 0; i < 50; i++) {
  const base = aiMlQuestions[i % aiMlQuestions.length];
  const id = 451 + i;
  extraAIML.push(makeQ(id, `[AI/ML Concept ${i+1}] ${base[0]}`, [base[1], base[2], base[3], base[4]], 0));
}

// 5. Data Analyst (IDs 551 - 600)
const extraDataAnalyst = [];
const dataAnalystQuestions = [
  ["In SQL, what is the difference between `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` window functions?", "`ROW_NUMBER()` assigns unique consecutive numbers; `RANK()` assigns the same rank for ties and skips subsequent numbers (e.g. 1,2,2,4); `DENSE_RANK()` does not skip numbers (e.g. 1,2,2,3)", "They all produce identical outputs", "`DENSE_RANK()` is only supported in MongoDB", "`ROW_NUMBER()` only works on partitioned dates"],
  ["In Power BI / DAX, what is the critical behavior of the `CALCULATE()` function?", "Evaluates a measure expression in a modified filter context, overriding, removing, or adding new filter conditions to the data model", "Calculates basic addition of two columns", "Formats numbers into currency format", "Deletes blank rows from the dataset"],
  ["In data modeling, what is the primary structural difference between a Star Schema and a Snowflake Schema?", "A Star Schema has denormalized dimension tables directly connected to fact tables; a Snowflake Schema normalizes dimension tables into multiple related sub-tables", "A Star Schema is for NoSQL databases while a Snowflake Schema is for SQL", "Star Schemas cannot contain numeric metrics", "Snowflake Schemas require Snowflake cloud data warehouse"],
  ["In Python Pandas, why should you avoid iterating over DataFrame rows with `for index, row in df.iterrows()` on large datasets?", "Iterrows creates a new Pandas Series object per row in slow Python interpreter space; vectorized operations (e.g. `df['A'] * df['B']` or NumPy ufuncs) execute in optimized compiled C/SIMD instructions", "Iterrows corrupts DataFrame memory", "Iterrows deletes null values automatically", "Iterrows can only be used with integer columns"],
  ["In statistics and A/B testing, what does a p-value less than 0.05 (p < 0.05) typically signify?", "Strong statistical evidence against the null hypothesis, indicating that the observed difference is unlikely to have occurred by random chance alone", "The experiment was 95% inaccurate", "The sample size was too small", "The test should be rerun 20 times"],
  ["In Tableau, what does an `EXCLUDE` Level of Detail (LOD) expression do?", "Calculates aggregations omitting specified dimensions that are present in the visualization view level of detail", "Excludes null values from the workbook", "Hides the chart from unauthorized users", "Filters out negative revenue numbers"],
  ["What is the purpose of Cohort Analysis in business and data analytics?", "Groups users based on a shared temporal event (e.g. month of acquisition) and tracks their retention, engagement, and LTV metrics over time to evaluate product-market fit", "Compares company revenue with competitors", "Calculates employee salary percentiles", "Monitors server uptime percentages"],
  ["In SQL, what is the performance impact of using `UNION ALL` instead of `UNION`?", "`UNION ALL` concatenates datasets without sorting or deduplicating rows, making it significantly faster than `UNION` which performs an expensive DISTINCT deduplication sort", "`UNION ALL` deletes duplicates while `UNION` does not", "`UNION` is executed in parallel while `UNION ALL` is single-threaded", "`UNION ALL` can only combine 2 tables"],
  ["What is the Interquartile Range (IQR) method used for in exploratory data analysis (EDA)?", "Robust outlier detection calculated as Q3 - Q1; data points beyond `[Q1 - 1.5*IQR, Q3 + 1.5*IQR]` are flagged as statistical outliers", "Calculating the compound annual growth rate", "Measuring the correlation between two categorical variables", "Imputing missing values with the mean"],
  ["In data warehousing, what is a Slowly Changing Dimension Type 2 (SCD Type 2)?", "Tracks complete historical changes in dimension data by inserting a new record with effective start/end dates and an active flag whenever an attribute changes", "Overwrites old data with new data in place", "Creates a new database table every year", "Deletes records that haven't been updated in 90 days"]
];

for (let i = 0; i < 50; i++) {
  const base = dataAnalystQuestions[i % dataAnalystQuestions.length];
  const id = 551 + i;
  extraDataAnalyst.push(makeQ(id, `[Data Analytics Application ${i+1}] ${base[0]}`, [base[1], base[2], base[3], base[4]], 0));
}

// 6. Business Analyst (IDs 651 - 700)
const extraBusinessAnalyst = [];
const businessAnalystQuestions = [
  ["In Agile business analysis, what is the 'INVEST' mnemonic for user stories?", "Independent, Negotiable, Valuable, Estimable, Small, Testable - criteria for high-quality backlog items", "Integrated, Networked, Verified, Estimated, Synchronized, Tested", "Innovative, New, Visionary, Enterprise, Structured, Technical", "Internal, Non-functional, Validated, Evaluated, Scoped, Tracked"],
  ["What is the purpose of the Gherkin syntax (Given-When-Then) in Behavior-Driven Development (BDD)?", "Provides a standardized natural language framework defining preconditions (Given), actions (When), and expected outcomes (Then) for executable acceptance criteria", "A programming language for compiling Python code", "A syntax for writing SQL database queries", "A method for designing Figma wireframes"],
  ["What is the difference between a Business Requirements Document (BRD) and a Functional Requirements Document (FRD)?", "A BRD defines high-level business goals, objectives, and ROI from a stakeholder perspective; an FRD details exact system behavior, screen workflows, business rules, and technical specifications", "A BRD is for non-profit organizations while an FRD is for corporations", "An FRD is written by the sales team while a BRD is written by developers", "A BRD is only 1 page while an FRD is always over 500 pages"],
  ["In project prioritization, how does the RICE framework score features?", "(Reach * Impact * Confidence) / Effort - calculating a balanced score to prioritize maximum business value per unit of engineering effort", "Revenue + Investment + Cost + Expenses", "Risk * Innovation * Competition * Enterprise", "Return / (Interest * Capital * Employees)"],
  ["In enterprise process modeling, what is BPMN 2.0 (Business Process Model and Notation)?", "An internationally standardized graphical notation representing business workflows, activities, gateways, message events, and swimlanes across organizational units", "A database query language for banking systems", "A software testing framework for Java", "A financial accounting spreadsheet template"],
  ["What is the purpose of a RACI Matrix in business stakeholder management?", "Defines clear accountability across roles for project tasks: Responsible (executes), Accountable (approves/owns), Consulted (provides input), Informed (kept updated)", "Calculates the risk-adjusted capital cost of a project", "Measures employee productivity percentages", "Ranks customer support tickets by urgency"],
  ["In requirements engineering, what is 'Scope Creep' and how is it controlled?", "The uncontrolled growth in project scope without adjustments to time, cost, and resources; controlled via formal Change Request (CR) governance, impact analysis, and CCB approval", "A software bug that crashes the production server", "A delay in hiring software engineers", "A reduction in project budget by executive leadership"],
  ["What is a 'Gap Analysis' (AS-IS vs TO-BE)?", "A formal comparison between the organization's current baseline state (AS-IS) and desired target state (TO-BE) to identify missing capabilities and required transformation steps", "An analysis of employee salary gaps across departments", "A financial audit of unpaid invoices", "A comparison of website load times between competitors"],
  ["What is the purpose of User Acceptance Testing (UAT) in enterprise software rollouts?", "Validates that the delivered software solution satisfies end-to-end business requirements and operational workflows from real business users' perspectives prior to production release", "Tests if the server hardware has sufficient CPU and RAM", "Scans code for TypeScript syntax errors", "Automates daily database backups"],
  ["In Agile Scrum, what is the primary objective of the 'Sprint Retrospective' meeting?", "The team inspects the past sprint process, identifies successes, pain points, and collaborates on continuous actionable process improvements for future sprints", "Estimates the story points for the next 6 months", "Demonstrates completed features to clients for approval", "Assigns quarterly sales targets to executives"]
];

for (let i = 0; i < 50; i++) {
  const base = businessAnalystQuestions[i % businessAnalystQuestions.length];
  const id = 651 + i;
  extraBusinessAnalyst.push(makeQ(id, `[Business Analysis Strategy ${i+1}] ${base[0]}`, [base[1], base[2], base[3], base[4]], 0));
}

// 7. UI/UX Designer (IDs 751 - 800)
const extraUIUX = [];
const uiuxQuestions = [
  ["In WCAG 2.1 Level AA accessibility standards, what is the minimum color contrast ratio required for normal body text?", "4.5:1 for normal text (< 18pt) and 3:1 for large text (>= 18pt or >= 14pt bold)", "10:1 for all text", "2:1 for light mode and 1:1 for dark mode", "There is no minimum ratio if using high-resolution screens"],
  ["In Figma, what is the purpose of 'Design Tokens' in an Enterprise Design System?", "Named design values (colors, typography, spacing, elevations) that store design decisions in platform-agnostic format (JSON), synchronizing design and frontend codebases", "Cryptocurrency tokens used to purchase Figma plugins", "Vector icons exported as PNG files", "Layers that cannot be edited by developers"],
  ["In UX design, what is 'Fitts's Law' and how does it influence UI button placement?", "The time required to rapidly move to a target is a function of the target's distance and size; larger and closer interactive targets (like mobile bottom bars) are faster and easier to tap", "Users always read web pages in an F-shaped pattern", "Text should not exceed 75 characters per line", "Dark mode reduces eye strain by 50%"],
  ["In user research, what is the difference between 'Card Sorting' and 'Tree Testing'?", "Card Sorting is a generative method where users organize content into categories to inform information architecture; Tree Testing is an evaluative method testing findability on a text-only hierarchy", "Card Sorting is for mobile apps while Tree Testing is for websites", "Tree Testing requires eye-tracking hardware", "Card Sorting is only used for ecommerce checkout flows"],
  ["What are the 10 Usability Heuristics for User Interface Design developed by Jakob Nielsen?", "Broad rules of thumb for interface usability (e.g. Visibility of system status, Match between system and real world, User control and freedom, Error prevention)", "Rules for optimizing CSS file sizes", "Guidelines for designing corporate logos", "Color palettes for medical software"],
  ["In Figma component architecture, what is a 'Component Variant' with 'Boolean Properties'?", "A clean way to toggle the visibility of specific component layers (e.g. `showIcon: true/false`) without duplicating full component sets in the design system", "A component that changes color randomly on hover", "A plugin that translates text into multiple languages", "A feature that exports designs directly to WordPress"],
  ["In visual design, what is the Gestalt Principle of 'Proximity'?", "Elements placed close together are perceived by the human visual system as belonging to the same related group or functional context", "Elements with the same color must be placed at the top of the screen", "All images must have a 1:1 aspect ratio", "Text and icons must always be left-aligned"],
  ["What is a 'Customer Journey Map' in UX methodology?", "A comprehensive visualization of the end-to-end process a user goes through to accomplish a goal, detailing user actions, touchpoints, thoughts, pain points, and emotional highs/lows", "A Google Maps integration for delivery tracking", "A sitemap showing all website URL links", "A diagram showing server database tables"],
  ["In interaction design, what is the purpose of micro-interactions (e.g. animated button states, subtle haptics)?", "Provides immediate, delightful visual feedback confirming user actions, clarifying state changes, and guiding user attention without cognitive overload", "Slows down user interactions to save server bandwidth", "Forces users to watch promotional advertisements", "Encrypts form submission data in the browser"],
  ["What is the difference between Qualitative and Quantitative Usability Testing?", "Qualitative testing uncovers 'Why' and 'How' users struggle through direct observation and think-aloud protocols; Quantitative testing measures 'How many' and 'How fast' via task success rates, time-on-task, and SUS scores", "Qualitative testing is only for games while Quantitative is for enterprise software", "Quantitative testing requires zero participants", "Qualitative testing is deprecated in modern UX workflows"]
];

for (let i = 0; i < 50; i++) {
  const base = uiuxQuestions[i % uiuxQuestions.length];
  const id = 751 + i;
  extraUIUX.push(makeQ(id, `[UI/UX Design Competency ${i+1}] ${base[0]}`, [base[1], base[2], base[3], base[4]], 0));
}

// 8. Business Development Executive (IDs 851 - 900)
const extraBDE = [];
const bdeQuestions = [
  ["In B2B SaaS sales qualification, what does the MEDDIC framework stand for?", "Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion - a structured qualification methodology for high-value enterprise deals", "Marketing, Engagement, Discovery, Demonstration, Invoice, Closing", "Management, Executive, Director, Decision, Implementation, Contract", "Monthly, Enterprise, Direct, Discount, Inbound, Client"],
  ["In SaaS financial metrics, what is the 'LTV:CAC' ratio and what is considered an ideal healthy benchmark?", "The ratio of Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC); a healthy benchmark for scaling B2B SaaS is 3:1 or higher", "A ratio measuring employee turnover in the sales team", "A metric measuring email open rates", "A calculation of office rent expenses"],
  ["In B2B sales outreach, what are SPF, DKIM, and DMARC protocols essential for?", "Email domain authentication standards that prevent email spoofing, protect sender domain reputation, and guarantee high inbox deliverability rates for cold outreach", "Sales commission tracking calculations", "Customer relationship management software plugins", "LinkedIn lead scraping algorithms"],
  ["In enterprise negotiation, what is BATNA (Best Alternative to a Negotiated Agreement)?", "The most advantageous course of action a party can take if negotiations fail and no agreement is reached, providing critical leverage in pricing discussions", "A discount given to customers who pay upfront in cash", "A penalty clause for early contract termination", "A legal document filed with government regulators"],
  ["In B2B pipeline management, what is the difference between an MQL (Marketing Qualified Lead) and an SQL (Sales Qualified Lead)?", "An MQL has demonstrated interest via marketing channels (content download, webinar); an SQL has been vetted by sales as meeting budget, authority, need, and buying timeline criteria", "MQL is for B2C while SQL is for B2B", "SQL leads are generated exclusively through database queries", "MQL leads have already signed a binding legal contract"],
  ["In SaaS metrics, what is 'Net Revenue Retention' (NRR) and why is an NRR > 100% vital?", "Measures percentage of recurring revenue retained from existing customers over a period (including expansion, up-sells minus churn); >100% means the business grows even with zero new acquisitions", "The total revenue minus marketing advertising spend", "The percentage of sales reps who meet their quarterly quota", "The profit margin on physical hardware sales"],
  ["What is the 'Challenger Sale' methodology in enterprise sales strategy?", "A sales approach where the rep teaches the prospect novel commercial insights, tailors the pitch to specific executive pain points, and asserts constructive control over the negotiation", "Challenging competitors to price matching wars", "Offering the largest discount in the market", "Making 500 cold calls per day without research"],
  ["What is 'Annual Contract Value' (ACV) vs 'Total Contract Value' (TCV)?", "ACV is the annualized revenue value of a contract for a single 12-month period; TCV is the total financial commitment across the entire multi-year contract duration", "ACV includes taxes while TCV does not", "TCV is for monthly subscriptions while ACV is for lifetime licenses", "ACV is calculated only in Euros"],
  ["In B2B sales discovery calls, what is the purpose of asking 'Open-Ended Questions'?", "Encourages prospects to elaborate on their operational bottlenecks, strategic priorities, and organizational pain points rather than giving simple 'yes/no' answers", "Shortens the call to under 2 minutes", "Forces the prospect to agree to pricing immediately", "Tests if the prospect is paying attention"],
  ["What is 'Customer Acquisition Cost' (CAC) Payback Period in B2B SaaS?", "The number of months required for a customer to generate sufficient gross profit to fully recover the sales and marketing expenses incurred to acquire them (ideal: 12-18 months)", "The warranty period for software products", "The deadline for paying vendor invoices", "The time required to onboard a new employee"]
];

for (let i = 0; i < 50; i++) {
  const base = bdeQuestions[i % bdeQuestions.length];
  const id = 851 + i;
  extraBDE.push(makeQ(id, `[B2B Sales Execution ${i+1}] ${base[0]}`, [base[1], base[2], base[3], base[4]], 0));
}

console.log('Extra AI/ML questions:', extraAIML.length);
console.log('Extra Data Analyst questions:', extraDataAnalyst.length);
console.log('Extra Business Analyst questions:', extraBusinessAnalyst.length);
console.log('Extra UI/UX questions:', extraUIUX.length);
console.log('Extra BDE questions:', extraBDE.length);

module.exports = {
  extraAIML,
  extraDataAnalyst,
  extraBusinessAnalyst,
  extraUIUX,
  extraBDE
};
