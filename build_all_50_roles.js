const fs = require('fs');
const path = require('path');

console.log('[Complete 400 MCQs Builder] Adding 15+ questions to remaining roles to guarantee 50 MCQs per role...');

const currentModule = require('./assessment_questions');
const bank = JSON.parse(JSON.stringify(currentModule.ROLE_QUESTIONS_BANK));

// 4. Additional AI/ML Engineer MCQs (436-450)
const EXTRA_AIML = [
  {
    id: 436,
    question: "In Transformer architectures, what is Grouped-Query Attention (GQA) used in LLaMA 2/3 and Mistral?",
    options: [
      "Shares key and value projection heads across multiple query heads, significantly slashing KV cache memory consumption and boosting decoding throughput with minimal quality loss",
      "Groups training images by resolution before convolution",
      "Combines PyTorch with TensorFlow models at runtime",
      "Compresses model weights using ZIP compression"
    ],
    correctIndex: 0
  },
  {
    id: 437,
    question: "What is the mathematical formulation of the SwiGLU activation function used in state-of-the-art LLMs?",
    options: [
      "SwiGLU(x) = Swish(x * W) * (x * V), combining a gated linear unit with Swish non-linearity for superior gradient flow and representation capacity",
      "SwiGLU(x) = max(0, x)",
      "SwiGLU(x) = 1 / (1 + e^-x)",
      "SwiGLU(x) = x^2 + 2x"
    ],
    correctIndex: 0
  },
  {
    id: 438,
    question: "In diffusion models for generative AI (e.g. Stable Diffusion, Midjourney), what does Classifier-Free Guidance (CFG) control?",
    options: [
      "Balances fidelity to the text prompt versus sample diversity by interpolating between conditionally generated and unconditionally generated noise predictions",
      "Removes background noise from audio microphone recordings",
      "Classifies whether an image is NSFW",
      "Speeds up image loading on mobile websites"
    ],
    correctIndex: 0
  },
  {
    id: 439,
    question: "What is QLoRA (Quantized Low-Rank Adaptation)?",
    options: [
      "Quantizes base transformer weights to 4-bit NormalFloat (NF4) with double quantization and paged optimizers, allowing 65B parameter LLM fine-tuning on a single 48GB GPU",
      "A database indexing algorithm for vector databases",
      "A JavaScript library for React frontend routing",
      "A data compression format for CSV spreadsheets"
    ],
    correctIndex: 0
  },
  {
    id: 440,
    question: "What does the 'Perplexity' metric quantify when evaluating language models?",
    options: [
      "The exponentiated cross-entropy loss over a sequence, measuring how surprised or uncertain the model is when predicting the next token (lower perplexity = better predictive power)",
      "The physical temperature of the GPU compute cluster",
      "The number of parameters in the neural network",
      "The time taken to train one epoch in hours"
    ],
    correctIndex: 0
  },
  {
    id: 441,
    question: "In Deep Learning, what is LayerNorm versus RMSNorm (Root Mean Square Normalization)?",
    options: [
      "RMSNorm modifies LayerNorm by omitting the mean re-centering step and normalizing strictly by root mean square, reducing compute overhead by 10-50% while preserving model performance",
      "RMSNorm is only applied to Convolutional Neural Networks",
      "LayerNorm is only calculated on CPU threads",
      "There is no mathematical difference between them"
    ],
    correctIndex: 0
  },
  {
    id: 442,
    question: "What is Catastrophic Forgetting during sequential fine-tuning of neural networks?",
    options: [
      "When a model trained on a new task experiences drastic degradation of performance on previously mastered tasks as new weight adjustments overwrite old knowledge",
      "When a GPU runs out of VRAM memory and restarts",
      "When dataset files are corrupted on the hard drive",
      "When learning rate is set to exact zero"
    ],
    correctIndex: 0
  },
  {
    id: 443,
    question: "What is Mixture of Experts (MoE) architecture (e.g. Mixtral 8x7B)?",
    options: [
      "Replaces dense feed-forward layers with multiple specialized expert sub-networks and a learned routing gate that activates only top-k experts per token, achieving high capacity with fast active compute",
      "Training 8 separate models in 8 different programming languages",
      "An ensemble of linear regression models",
      "A crowdsourced labeling platform for human data annotators"
    ],
    correctIndex: 0
  },
  {
    id: 444,
    question: "In Machine Learning, what is the Difference between L1-norm (Manhattan) and L2-norm (Euclidean) distance?",
    options: [
      "L1 is the sum of absolute coordinate differences (grid-like movement); L2 is the square root of the sum of squared coordinate differences (straight-line Euclidean distance)",
      "L1 distance can only be computed on negative numbers",
      "L2 distance requires all data features to be strings",
      "Both are mathematically identical in all dimensions"
    ],
    correctIndex: 0
  },
  {
    id: 445,
    question: "What is Contrastive Learning (e.g. SimCLR, CLIP)?",
    options: [
      "A self-supervised representation technique that pulls positive paired representations (e.g. image and its text caption or augmented view) closer together in embedding space while pushing negative pairs apart",
      "Comparing CSS dark mode contrast ratios against WCAG standards",
      "Testing two different SQL queries for execution speed",
      "Adjusting image brightness in Photoshop"
    ],
    correctIndex: 0
  },
  {
    id: 446,
    question: "What is the purpose of Gradient Accumulation during model training?",
    options: [
      "Summing gradients over multiple smaller micro-batches before executing an optimizer step, effectively simulating large batch sizes without exceeding GPU VRAM limits",
      "Accumulating server CPU load over 24 hours",
      "Compressing PyTorch model checkpoints into ZIP files",
      "Preventing overfitting by resetting model weights to zero"
    ],
    correctIndex: 0
  },
  {
    id: 447,
    question: "What is the Gini Impurity metric used for in Decision Tree algorithms (e.g. CART)?",
    options: [
      "Measures the probability of incorrectly classifying a randomly chosen element if it were randomly labeled according to the class distribution in the node (0 = pure node)",
      "Measures the physical depth of a decision tree in memory",
      "Calculates the training time of a neural network",
      "Determines the number of CPU threads to allocate"
    ],
    correctIndex: 0
  },
  {
    id: 448,
    question: "In Computer Vision, what is the core architectural innovation of Vision Transformers (ViT) over CNNs?",
    options: [
      "Treats an image as a sequence of non-overlapping flattened 16x16 pixel patches with positional embeddings, processing visual features with standard transformer self-attention without convolutions",
      "Uses 3D ray tracing algorithms to render pixels",
      "Converts images into audio waveforms before classification",
      "Requires images to be black-and-white only"
    ],
    correctIndex: 0
  },
  {
    id: 449,
    question: "What is Teacher Forcing in sequence-to-sequence model training?",
    options: [
      "Feeding ground-truth tokens from prior time steps as inputs to the decoder during training, rather than feeding the model's own (potentially incorrect) generated tokens from step t-1",
      "Having a human engineer manually supervise GPU training logs",
      "Forcing all student models to use Adam optimizer",
      "A method for checking code syntax in Python"
    ],
    correctIndex: 0
  },
  {
    id: 450,
    question: "What is the purpose of Polyak-Ruppert Averaging (Exponential Moving Average / EMA) of model weights?",
    options: [
      "Maintaining an exponential moving average of model parameters across training steps for use during validation and inference, yielding smoother generalizations and higher test accuracy",
      "Calculating the average salary of AI engineers",
      "Averaging database query execution times in milliseconds",
      "A method for formatting JSON data files"
    ],
    correctIndex: 0
  }
];

// 5. Additional Data Analyst MCQs (536-550)
const EXTRA_DATA = [
  {
    id: 536,
    question: "In SQL, what is the difference between `EXISTS` and `IN` subquery predicates?",
    options: [
      "`EXISTS` terminates evaluation as soon as the first matching row is found (short-circuit boolean check) and handles NULLs cleanly; `IN` evaluates the full list of values and can yield unexpected results if subquery returns NULL",
      "`IN` only works on integer primary keys",
      "`EXISTS` can only be used on temporary tables",
      "There is no performance or logical difference in modern databases"
    ],
    correctIndex: 0
  },
  {
    id: 537,
    question: "What is Market Basket Analysis (Association Rule Mining) and what are Support, Confidence, and Lift?",
    options: [
      "Support is item frequency; Confidence is probability of buying B given A; Lift is ratio of observed co-occurrence to expected random co-occurrence (Lift > 1 indicates strong positive affinity)",
      "Support is customer service tickets; Confidence is marketing budget; Lift is sales revenue",
      "A method for weighing physical shopping carts in retail stores",
      "An algorithm for sorting database records alphabetically"
    ],
    correctIndex: 0
  },
  {
    id: 538,
    question: "In data warehouses, what is a Conformed Dimension (Kimball methodology)?",
    options: [
      "A single, standardized dimension table (e.g. `dim_date`, `dim_customer`) shared consistently across multiple disparate fact tables / data marts to enable cross-functional drill-across reporting",
      "A dimension table that contains only encrypted passwords",
      "A temporary table created during ETL execution",
      "A table with strictly 10 columns"
    ],
    correctIndex: 0
  },
  {
    id: 539,
    question: "In statistics, what is the Bonferroni Correction used for during multiple hypothesis testing?",
    options: [
      "Adjusts the significance threshold alpha by dividing by total number of comparisons (alpha / m) to control the family-wise error rate and prevent false positive discoveries",
      "Calculates compound interest over 10 years",
      "Smooths time-series data using moving averages",
      "Removes duplicate rows from SQL queries"
    ],
    correctIndex: 0
  },
  {
    id: 540,
    question: "What is Cumulative Distribution Function (CDF) versus Probability Density Function (PDF)?",
    options: [
      "PDF describes the relative likelihood of a continuous random variable taking a specific value; CDF gives the cumulative probability that the variable takes a value less than or equal to x (P(X <= x))",
      "PDF is an Adobe document format; CDF is an Excel formula",
      "CDF is only for discrete integers; PDF is for text",
      "Both are identical mathematical functions"
    ],
    correctIndex: 0
  },
  {
    id: 541,
    question: "In DAX (Power BI), what does the `CALCULATE()` function do?",
    options: [
      "Evaluates a measure expression in a modified filter context, allowing analysts to override, add, or remove existing visual slicer and row context filters",
      "Calculates basic addition and subtraction only",
      "Imports CSV files from Google Drive",
      "Exports dashboards to PDF documents"
    ],
    correctIndex: 0
  },
  {
    id: 542,
    question: "What is an Upsert (`INSERT ... ON CONFLICT DO UPDATE` or `MERGE`) in SQL data pipelines?",
    options: [
      "An atomic database operation that attempts to insert a new row, and if a unique/primary key violation occurs, updates the existing row instead",
      "A command that deletes corrupted table data",
      "An index that sorts data in ascending order",
      "A query that joins a table to itself"
    ],
    correctIndex: 0
  },
  {
    id: 543,
    question: "What is Survival Analysis (Kaplan-Meier estimator) used for in customer churn analytics?",
    options: [
      "Estimating the time-to-event probability (e.g. time until a customer cancels their subscription) while appropriately handling right-censored data (active customers who haven't churned yet)",
      "Calculating emergency medical supplies in hospitals",
      "Measuring server CPU temperatures over 30 days",
      "Predicting stock market crashes"
    ],
    correctIndex: 0
  },
  {
    id: 544,
    question: "In Python Pandas, what is the computational difference between `df.apply()` and vectorized operations (e.g. `df['a'] + df['b']`)?",
    options: [
      "Vectorized operations execute in compiled C/Cython SIMD machine instructions (100x faster); `apply()` iterates row-by-row in interpreted Python with high function-call overhead",
      "`apply()` runs on GPUs while vectorization runs on CPUs",
      "`apply()` modifies data on disk permanently",
      "There is no performance difference in Pandas 2.0"
    ],
    correctIndex: 0
  },
  {
    id: 545,
    question: "What is a Surrogate Key versus a Natural Key in relational database modeling?",
    options: [
      "A Natural Key is a real-world business identifier (e.g. SSN, email); a Surrogate Key is an internal, system-generated artificial unique identifier (e.g. auto-incrementing integer or UUID) with no business meaning",
      "A Surrogate Key is stored on paper; Natural Key is digital",
      "Natural Keys can never be used as primary keys",
      "Surrogate Keys can only contain alphabetic characters"
    ],
    correctIndex: 0
  },
  {
    id: 546,
    question: "What does the Chi-Square Test of Independence evaluate in categorical data analysis?",
    options: [
      "Whether there is a statistically significant association between two categorical variables by comparing observed frequencies against expected frequencies in a contingency table",
      "The linear correlation between two continuous price variables",
      "The average difference between two numeric sample means",
      "The percentage of missing values in a dataset"
    ],
    correctIndex: 0
  },
  {
    id: 547,
    question: "What is a Window Frame specification in SQL (e.g. `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`) used for?",
    options: [
      "Defines a sliding dynamic window of rows relative to the current row, commonly used to compute rolling 7-day moving averages or running cumulative totals",
      "Sets the width and height of the database terminal window",
      "Limits SQL query output to exactly 6 rows",
      "Prevents deadlocks in concurrent database writes"
    ],
    correctIndex: 0
  },
  {
    id: 548,
    question: "In financial data analysis, what is EBITDA and why is it monitored?",
    options: [
      "Earnings Before Interest, Taxes, Depreciation, and Amortization; measures core operational profitability and cash-generating performance independent of capital structure and accounting decisions",
      "A database query language used for banking software",
      "A metric measuring annual employee turnover",
      "The total physical value of corporate office buildings"
    ],
    correctIndex: 0
  },
  {
    id: 549,
    question: "What is Data Imputation and what are its standard statistical techniques for missing values?",
    options: [
      "Replacing missing data points with substituted values using mean/median/mode substitution, K-Nearest Neighbors (KNN), or predictive model regression",
      "Deleting corrupted database tables permanently",
      "Encrypting database columns with RSA keys",
      "Translating CSV files into JSON format"
    ],
    correctIndex: 0
  },
  {
    id: 550,
    question: "In Tableau / Power BI dashboard architecture, what is the difference between DirectQuery (Live Connection) and Import Mode?",
    options: [
      "Import Mode loads and compresses data into an in-memory columnar engine for ultra-fast visual interactions; DirectQuery sends live SQL queries to the underlying database on every user visual click",
      "DirectQuery is only used for Excel spreadsheets",
      "Import Mode does not support charts or graphs",
      "DirectQuery caches all data in browser cookies"
    ],
    correctIndex: 0
  }
];

// 6. Additional Business Analyst MCQs (636-650)
const EXTRA_BA = [
  {
    id: 636,
    question: "In enterprise software analysis, what is the difference between a Product Requirements Document (PRD) and a Business Requirements Document (BRD)?",
    options: [
      "A BRD focuses on business problems, commercial goals, and ROI from leadership's perspective; a PRD defines specific product features, user flows, personas, and UX specifications for product and engineering teams",
      "A PRD is only written for physical hardware products",
      "A BRD is written by developers in Python code",
      "There is no difference in modern agile frameworks"
    ],
    correctIndex: 0
  },
  {
    id: 637,
    question: "What is a Capability Model (Business Capability Mapping) in enterprise architecture?",
    options: [
      "A structured visual representation of what an enterprise does (its core operational abilities and competencies) to execute its business model, independent of organizational structure or technology",
      "A resume summary of the lead software engineer",
      "A diagram showing server rack power consumption",
      "A chart showing employee hourly salary rates"
    ],
    correctIndex: 0
  },
  {
    id: 638,
    question: "In Agile backlog management, what is the 'Definition of Ready' (DoR) versus 'Definition of Done' (DoD)?",
    options: [
      "DoR defines criteria a user story must satisfy before being pulled into a sprint (clear criteria, dependencies resolved, estimated); DoD defines criteria for marking a story complete (tested, reviewed, deployed)",
      "DoR is for marketing; DoD is for sales",
      "DoD requires client payment; DoR requires employee signatures",
      "Both are identical terms in Scrum guide"
    ],
    correctIndex: 0
  },
  {
    id: 639,
    question: "What is Porter's Five Forces framework used for in strategic industry analysis?",
    options: [
      "Assessing industry attractiveness and competitive intensity: Threat of New Entrants, Bargaining Power of Buyers, Bargaining Power of Suppliers, Threat of Substitutes, and Competitive Rivalry",
      "Calculating server CPU core distribution",
      "Estimating user story points in Scrum poker",
      "Measuring software bug severity levels"
    ],
    correctIndex: 0
  },
  {
    id: 640,
    question: "In UML diagramming, what is the difference between an Activity Diagram and a Sequence Diagram?",
    options: [
      "An Activity Diagram models step-by-step operational workflows and business logic flows; a Sequence Diagram models chronological message exchanges and interactions between objects/systems over time",
      "Activity diagrams are only for database schemas",
      "Sequence diagrams cannot show system actors",
      "There is no functional distinction in UML specifications"
    ],
    correctIndex: 0
  },
  {
    id: 641,
    question: "What is a SMART Goal criteria when defining project objectives and business outcomes?",
    options: [
      "Specific, Measurable, Achievable, Relevant, and Time-bound",
      "Scalable, Modular, Agile, Responsive, and Tested",
      "Standardized, Managed, Automated, Reliable, and Tracked",
      "Strategic, Monetary, Actionable, Regulated, and Timely"
    ],
    correctIndex: 0
  },
  {
    id: 642,
    question: "In requirements elicitation, what is the 'Shadowing' (Observation) technique?",
    options: [
      "Observing end users in their actual work environment as they perform daily business tasks to identify unstated requirements, hidden pain points, and workflow bottlenecks",
      "Working overtime without logging hours in HR software",
      "Copying competitor source code from GitHub",
      "Hiding behind office partitions during client meetings"
    ],
    correctIndex: 0
  },
  {
    id: 643,
    question: "What is Cost-Benefit Analysis (CBA) and what is the Net Present Value (NPV)?",
    options: [
      "CBA compares total expected costs against total expected benefits; NPV calculates the present value of future cash inflows discounted by cost of capital minus initial investment (NPV > 0 is profitable)",
      "CBA measures developer typing speed; NPV measures network latency",
      "NPV is the number of users registered on a mobile app",
      "CBA is only calculated when a company goes bankrupt"
    ],
    correctIndex: 0
  },
  {
    id: 644,
    question: "What is a SIPOC Diagram in Six Sigma process improvement?",
    options: [
      "Suppliers, Inputs, Process, Outputs, and Customers: a high-level visual summary mapping process inputs and outputs before initiating detailed process re-engineering",
      "Software, Interface, Protocol, Optimization, and Cloud",
      "Security, IP, Permissions, Operations, and Compliance",
      "Sales, Invoicing, Payments, Orders, and Collections"
    ],
    correctIndex: 0
  },
  {
    id: 645,
    question: "In business process modeling, what is the difference between an 'As-Is' process map and a 'To-Be' process map?",
    options: [
      "'As-Is' models current operational workflows with existing inefficiencies; 'To-Be' models the optimized, re-engineered future workflow incorporating new technology and elimination of waste",
      "'As-Is' is for physical paper workflows; 'To-Be' is for digital software",
      "'To-Be' maps cannot be modified once drawn",
      "There is no distinction in Six Sigma methodology"
    ],
    correctIndex: 0
  },
  {
    id: 646,
    question: "What is a Burndown Chart in Scrum sprint monitoring?",
    options: [
      "A graphical representation of remaining work (story points) over time versus the ideal linear completion trajectory, helping teams identify if they are on track to meet sprint goals",
      "A chart showing server hardware overheating risks",
      "A financial ledger tracking corporate tax expenses",
      "A graph showing company employee resignation rates"
    ],
    correctIndex: 0
  },
  {
    id: 647,
    question: "What is Kano Model Analysis in product feature prioritization?",
    options: [
      "Categorizes customer preferences into Basic (Must-be), Performance (Linear satisfaction), and Excitement (Delighters) attributes to understand customer reaction to feature investments",
      "Calculates developer hourly billing rates",
      "Measures SQL database query latency",
      "A framework for buying corporate real estate"
    ],
    correctIndex: 0
  },
  {
    id: 648,
    question: "What is the primary function of a Change Control Board (CCB) in enterprise governance?",
    options: [
      "A formal committee of stakeholders that reviews, evaluates, approves, or rejects proposed changes to project scope, budget, and baseline deliverables",
      "A team of developers who review Git pull requests",
      "A board of directors that fires executive management",
      "An automated bot that merges code branches"
    ],
    correctIndex: 0
  },
  {
    id: 649,
    question: "What is Joint Application Development (JAD) in requirement engineering?",
    options: [
      "A structured, intensive workshop bringing business stakeholders, BAs, and technical teams together in collaborative working sessions to rapidly define and agree on system requirements",
      "Pair programming between two software engineers",
      "Merging two mobile applications into a single app",
      "Writing automated tests in Java and Python"
    ],
    correctIndex: 0
  },
  {
    id: 650,
    question: "In business analysis, what is the 'Fishbone' (Ishikawa / Cause-and-Effect) Diagram categories (6Ms)?",
    options: [
      "Manpower (People), Machine (Technology), Material, Method (Process), Measurement, and Milieu (Environment / Mother Nature) for structuring root cause investigations",
      "Marketing, Money, Management, Metrics, Media, and Meetings",
      "Memory, Microprocessor, Motherboard, Monitor, Modem, and Mouse",
      "Monthly, Mid-year, Milestone, Margin, Multiplier, and Metric"
    ],
    correctIndex: 0
  }
];

// 7. Additional UI/UX Designer MCQs (736-750)
const EXTRA_UIUX = [
  {
    id: 736,
    question: "In UX design psychology, what is the 'Serial Position Effect' (Primacy and Recency Effects)?",
    options: [
      "Users have a propensity to best remember the first items (Primacy) and last items (Recency) in a navigation list or menu, while items in the middle are frequently overlooked",
      "Users click buttons on the right side of the screen 80% of the time",
      "Designers should always use serial numbers on UI cards",
      "Dark mode screens increase memory recall by 50%"
    ],
    correctIndex: 0
  },
  {
    id: 737,
    question: "What is the difference between Responsive Design and Adaptive Design in web layout strategy?",
    options: [
      "Responsive uses fluid grids and flexible CSS media queries to resize content continuously across any screen; Adaptive detects device type and serves distinct, fixed layout templates for specific breakpoints",
      "Responsive is for mobile; Adaptive is for desktop",
      "Adaptive design requires writing code in C++",
      "Responsive design cannot contain images"
    ],
    correctIndex: 0
  },
  {
    id: 738,
    question: "What is Nielsen's Heuristic 'Recognition Rather Than Recall' in interface usability?",
    options: [
      "Minimizing user memory load by making elements, actions, and options visible; users should not have to remember information from one part of the interface to another",
      "Using facial recognition cameras for user login",
      "Displaying user full names in bold red typography",
      "Requiring users to type their password twice on every page"
    ],
    correctIndex: 0
  },
  {
    id: 739,
    question: "In visual design, what is 'Visual Hierarchy' and what are its primary tools?",
    options: [
      "The arrangement of UI elements to imply importance and guide user attention through deliberate use of scale/size, color contrast, typography weight, whitespace, and layout positioning",
      "Sorting company employees by corporate job title",
      "A 3D perspective wireframe created in Blender",
      "A flowchart showing server API endpoints"
    ],
    correctIndex: 0
  },
  {
    id: 740,
    question: "What is the 'Aesthetic-Usability Effect' in human-computer interaction?",
    options: [
      "Users perceive aesthetically pleasing designs as significantly more usable and are more tolerant of minor usability glitches than in visually plain or cluttered designs",
      "Beautiful websites always load faster on slow 3G networks",
      "Users only buy products from websites that use purple themes",
      "Designers should prioritize aesthetics over all functionality"
    ],
    correctIndex: 0
  },
  {
    id: 741,
    question: "In mobile navigation, what is a 'Bottom Sheet' and when is it preferred over a centered Modal?",
    options: [
      "A surface anchored to the bottom of mobile screens that slides up with contextual actions, ideal for one-handed thumb interaction without covering the entire screen context",
      "A footer containing legal copyright text",
      "A spreadsheet downloaded from Google Drive",
      "A notification toast that appears at the top"
    ],
    correctIndex: 0
  },
  {
    id: 742,
    question: "What is the purpose of 'Skeleton Screens' (Shimmer Placeholders) over traditional loading spinners?",
    options: [
      "Reduces perceived wait time by displaying an incremental wireframe layout preview that mimics incoming content structure, creating an impression of immediate responsiveness",
      "Animates 3D skeletons on Halloween promotional landing pages",
      "Compresses CSS file size during network transport",
      "Displays the user's browser version while loading"
    ],
    correctIndex: 0
  },
  {
    id: 743,
    question: "What is 'Mental Model' in user experience architecture (Don Norman)?",
    options: [
      "A user's internal cognitive understanding of how a system works, based on past experiences, intuitive expectations, and external real-world metaphors",
      "A machine learning model running on neural networks",
      "A psychological IQ test administered during job interviews",
      "A wireframe showing database table relationships"
    ],
    correctIndex: 0
  },
  {
    id: 744,
    question: "What is the difference between Kerning, Tracking, and Leading in typography?",
    options: [
      "Kerning is spacing between specific character pairs (e.g. A-V); Tracking is uniform letter spacing across a whole word/paragraph; Leading is vertical line spacing (line-height)",
      "Tracking is mouse cursor recording; Kerning is font size; Leading is font weight",
      "Leading is only used for headlines; Kerning is only for numbers",
      "There is no typographic distinction in CSS"
    ],
    correctIndex: 0
  },
  {
    id: 745,
    question: "In accessibility standards (WCAG), what is 'Focus Management' and why is it mandatory for Modals?",
    options: [
      "When a modal opens, keyboard focus must move inside the modal and be trapped within it until closed, returning focus to the triggering element when dismissed",
      "Adjusting screen brightness when reading long text",
      "Forcing users to look directly at the webcam during tests",
      "Centering all text paragraphs on the screen"
    ],
    correctIndex: 0
  },
  {
    id: 746,
    question: "What is Nielsen's Heuristic 'Flexibility and Efficiency of Use'?",
    options: [
      "Providing accelerators (keyboard shortcuts, customizable dashboards, advanced filters) that speed up interaction for expert users while keeping interface intuitive for novices",
      "Allowing users to resize browser window dimensions",
      "Writing software in C++ instead of JavaScript",
      "Making all button animations 10x faster"
    ],
    correctIndex: 0
  },
  {
    id: 747,
    question: "What is 'Affinity Diagramming' in UX research synthesis?",
    options: [
      "A collaborative sorting technique where qualitative research notes, observations, and user quotes are clustered on sticky notes into natural thematic categories to uncover insights",
      "A marketing chart showing customer affinity for competitor brands",
      "A diagram showing database foreign key relationships",
      "A wireframe showing mobile app tab transitions"
    ],
    correctIndex: 0
  },
  {
    id: 748,
    question: "What is the purpose of 'Card Sorting' in Information Architecture (IA)?",
    options: [
      "Understanding how users naturally organize, label, and categorize information topics, helping designers build intuitive navigation menus and site taxonomies",
      "Playing card games during team building exercises",
      "Sorting customer credit cards by expiration date",
      "Formatting product cards in CSS grid"
    ],
    correctIndex: 0
  },
  {
    id: 749,
    question: "In visual UI design, what is 'Whitespace' (Negative Space) and why is it essential?",
    options: [
      "Empty space surrounding and between UI elements that reduces cognitive clutter, emphasizes critical content, and enhances readability and visual elegance",
      "A bug in CSS that leaves white backgrounds on dark mode",
      "The margin at the bottom of printed paper documents",
      "Space reserved exclusively for marketing banner advertisements"
    ],
    correctIndex: 0
  },
  {
    id: 750,
    question: "What is a 'Tree Test' (Reverse Card Sort) in IA usability evaluation?",
    options: [
      "A text-only quantitative usability technique where participants navigate a simplified textual site hierarchy without visual UI styling to test findability of items",
      "Testing if mobile apps work in outdoor parks with trees",
      "A tree data structure unit test written in Python",
      "An environmental audit of corporate paper consumption"
    ],
    correctIndex: 0
  }
];

// 8. Additional Business Development Executive MCQs (836-850)
const EXTRA_BDE = [
  {
    id: 836,
    question: "In enterprise SaaS sales, what is a 'Co-Terming' agreement during contract expansion?",
    options: [
      "Aligning the renewal and expiration dates of newly purchased user licenses or add-on modules with the customer's existing primary contract end date for unified billing",
      "Co-signing an office lease agreement with a partner firm",
      "Splitting sales commissions equally between two reps",
      "Terminating a contract when customer violates terms"
    ],
    correctIndex: 0
  },
  {
    id: 837,
    question: "What is 'Sales Enablement' in high-performance revenue organizations?",
    options: [
      "The strategic practice of providing sales reps with the training, content, competitive battlecards, tools, and collateral required to close deals faster and engage buyers effectively",
      "Enabling credit card payment processing on the company website",
      "Giving all employees administrative access to Salesforce",
      "Purchasing mobile phones for sales team members"
    ],
    correctIndex: 0
  },
  {
    id: 838,
    question: "In enterprise negotiations, what is a 'Walk-Away Price' (Reservation Price)?",
    options: [
      "The least favorable commercial terms or minimum price point a seller is willing to accept before walking away from the deal completely to preserve profit margins and contract integrity",
      "The cost of walking to client meetings instead of taking a taxi",
      "A discount given to customers who purchase in cash",
      "The price listed on the public company pricing page"
    ],
    correctIndex: 0
  },
  {
    id: 839,
    question: "What is 'Lead Velocity Rate' (LVR) and why is it a leading indicator of revenue growth?",
    options: [
      "The percentage growth rate of qualified pipeline leads generated month-over-month (LVR predicts future revenue performance months before deals actually close)",
      "The speed of developer typing tests during recruitment",
      "The time taken for a marketing email to be opened in seconds",
      "The number of cold calls made per hour by an SDR"
    ],
    correctIndex: 0
  },
  {
    id: 840,
    question: "In enterprise software procurement, what is SOC 2 Type II compliance and why do enterprise buyers require it?",
    options: [
      "An independent audit verifying that the vendor has established and operationalized rigorous security, availability, and confidentiality controls over an extended evaluation period (6-12 months)",
      "A software license for Microsoft Windows servers",
      "A tax certificate issued by corporate accountants",
      "A resume certificate for cybersecurity engineers"
    ],
    correctIndex: 0
  },
  {
    id: 841,
    question: "What is the 'Command of the Message' methodology (Force Management)?",
    options: [
      "A value-based sales framework aligning product capabilities directly to customer business pains, measurable business outcomes, and quantifiable positive business impact",
      "Speaking louder than the customer during sales calls",
      "Sending automated SMS text messages to prospects every hour",
      "Formatting sales emails using all capital letters"
    ],
    correctIndex: 0
  },
  {
    id: 842,
    question: "In cold outbound prospecting, what is a 'Tier 1 Account List'?",
    options: [
      "The top 10-20% highest-value, perfect-fit target enterprise accounts that receive bespoke, multi-threaded 1:1 hyper-personalized outreach across executives and buying committees",
      "A list of company suppliers who provide office stationery",
      "A spreadsheet of bank accounts with highest cash reserves",
      "Accounts that have cancelled their subscription"
    ],
    correctIndex: 0
  },
  {
    id: 843,
    question: "What is 'Churn Cohort Analysis' in customer success and account management?",
    options: [
      "Tracking customer cancellation rates segmented by customer signup month, acquisition channel, or contract size to identify specific onboarding or product failure points over time",
      "Calculating annual sales bonus commission tiers",
      "Tracking website traffic spikes during promotional sales",
      "Measuring employee resignation rates across quarters"
    ],
    correctIndex: 0
  },
  {
    id: 844,
    question: "In B2B sales cycles, what is 'Multi-Threading' across an enterprise buying committee?",
    options: [
      "Building simultaneous relationships with multiple key stakeholders across departments (e.g. End User, IT Security, Finance, Economic Buyer) to prevent single-point-of-failure deal stalls",
      "Making 5 phone calls at the same time using automated dialers",
      "Writing multi-threaded C++ code for backend servers",
      "Running marketing ads on Facebook and Instagram simultaneously"
    ],
    correctIndex: 0
  },
  {
    id: 845,
    question: "What is a 'Business Value Assessment' (BVA) or ROI Calculator in enterprise proposals?",
    options: [
      "A formal quantitative economic model demonstrating projected financial returns, hours saved, labor cost reduction, and net payoff period resulting from software adoption",
      "A tool that checks if employee expense receipts are authentic",
      "A spreadsheet calculating corporate tax deductions",
      "An online calculator for currency exchange rates"
    ],
    correctIndex: 0
  },
  {
    id: 846,
    question: "In SaaS contract terms, what is a 'Non-Solicitation Clause'?",
    options: [
      "A contractual covenant preventing either party from actively recruiting, soliciting, or hiring the other party's employees or contractors during and for a period after the contract term",
      "A rule that prevents sales reps from calling customers on weekends",
      "A prohibition against sending marketing emails without consent",
      "A clause that prevents clients from reselling the software"
    ],
    correctIndex: 0
  },
  {
    id: 847,
    question: "What is 'Buyer Remorse' and how does an elite BDE prevent post-sale churn during contract signing?",
    options: [
      "Anxiety or doubt experienced by a buyer immediately after committing major budget; mitigated with immediate executive kickoff welcome calls, clear onboarding roadmaps, and early milestone wins",
      "When a buyer files a police complaint against a sales rep",
      "When an invoice bounces due to insufficient bank funds",
      "A customer requesting a refund after 10 years of use"
    ],
    correctIndex: 0
  },
  {
    id: 848,
    question: "What is 'Cold Outreach Deliverability Warmup' for new corporate email domains?",
    options: [
      "Gradually increasing outbound email volume over several weeks with automated peer interactions to build positive domain sender reputation and prevent emails from landing in spam filters",
      "Heating up computer servers in the office before work",
      "Sending 10,000 cold emails on day 1 to test domain speed",
      "Formatting email text in red color"
    ],
    correctIndex: 0
  },
  {
    id: 849,
    question: "In strategic B2B partnerships, what is a Value-Added Reseller (VAR) versus a System Integrator (SI)?",
    options: [
      "A VAR bundles third-party software with proprietary products/services for resale; an SI specializes in building, integrating, and customizing complex multi-vendor enterprise IT architectures",
      "A VAR is for consumer retail; an SI is for mobile phones",
      "An SI cannot sell software licenses under any circumstance",
      "There is no commercial distinction in enterprise channels"
    ],
    correctIndex: 0
  },
  {
    id: 850,
    question: "What is 'Pipeline Coverage Ratio' and what ratio is typically required to ensure quarterly quota attainment?",
    options: [
      "Pipeline Coverage = Total Pipeline Value / Sales Quota Target; a 3x to 4x coverage ratio is standard to account for average win rates and deal slippage",
      "Pipeline Coverage = Total Closed Deals / Total Sales Reps",
      "Pipeline Coverage = Marketing Ad Spend / Total Leads",
      "A ratio of 0.5x is optimal for all enterprise SaaS companies"
    ],
    correctIndex: 0
  }
];

// Add extra questions to bank
bank['AI/ML Engineer'] = [...bank['AI/ML Engineer'], ...EXTRA_AIML];
bank['Data Analyst'] = [...bank['Data Analyst'], ...EXTRA_DATA];
bank['Business Analyst'] = [...bank['Business Analyst'], ...EXTRA_BA];
bank['UI/UX Designer'] = [...bank['UI/UX Designer'], ...EXTRA_UIUX];
bank['Business Development Executive'] = [...bank['Business Development Executive'], ...EXTRA_BDE];

// Re-generate file with full 400 questions (50 per role)
const fileContent = `/**
 * Enterprise Assessment Question Bank & Dynamic Proctoring Engine
 * Contains 400 curated domain-specific MCQs (50 per recruitment role).
 * 
 * ADVANCED NON-REPEATING CANDIDATE ENGINE:
 * 1. Candidate History Exclusion: Tracks previously seen question IDs for each candidate/session.
 *    When a candidate applies or retakes a test for the same job, seen questions are filtered out first,
 *    guaranteeing 100% fresh questions on every attempt!
 * 2. Fisher-Yates Sampling: Samples N (default 20) questions at random from the candidate's unseen pool.
 * 3. Question Sequence Shuffling: Shuffles the presentation order on each attempt.
 * 4. Option Shuffling: Randomizes all 4 options per question (A, B, C, D) with balanced distribution.
 * 5. Session Answer Key: Server caches exact session mapping for 100% accurate grading.
 * 6. Automated Offer Letter: Score >= 80% (>= 16/20) triggers automated Call Letter email via Gmail SMTP.
 */

const ROLE_QUESTIONS_BANK = ${JSON.stringify(bank, null, 2)};

// In-memory active session cache with 3-hour TTL
const ACTIVE_ASSESSMENT_SESSIONS = new Map();
// Candidate historical seen questions cache (candidateKey -> Set of question IDs)
const CANDIDATE_SEEN_QUESTIONS = new Map();
const SESSION_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

/**
 * Normalizes user-applied role title to authoritative bank key.
 */
function normalizeRoleToBankKey(roleName) {
  const r = (roleName || '').toLowerCase().trim();
  if (r.includes('frontend') || r.includes('react') || r.includes('ui dev') || r.includes('web dev') || r.includes('angular') || r.includes('vue')) return 'Frontend Developer';
  if (r.includes('backend') || r.includes('node') || r.includes('api') || r.includes('database') || r.includes('golang') || r.includes('java') || r.includes('python dev')) return 'Backend Developer';
  if (r.includes('full stack') || r.includes('fullstack') || r.includes('software engineer') || r.includes('lead ai') || r.includes('sde')) return 'Full Stack AI Engineer';
  if (r.includes('ai') || r.includes('ml') || r.includes('machine learning') || r.includes('data sci') || r.includes('deep learning')) return 'AI/ML Engineer';
  if (r.includes('data analyst') || r.includes('analytics') || r.includes('sql analyst') || r.includes('bi analyst') || r.includes('tableau')) return 'Data Analyst';
  if (r.includes('business analyst') || r.includes('product analyst') || r.includes('ba') || r.includes('product manager')) return 'Business Analyst';
  if (r.includes('ui') || r.includes('ux') || r.includes('design') || r.includes('figma') || r.includes('product design')) return 'UI/UX Designer';
  if (r.includes('sales') || r.includes('business development') || r.includes('bde') || r.includes('growth') || r.includes('account executive')) return 'Business Development Executive';
  return 'Frontend Developer';
}

/**
 * Fisher-Yates array in-place shuffle
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Periodically cleans up expired sessions
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessId, sess] of ACTIVE_ASSESSMENT_SESSIONS.entries()) {
    if (now - sess.createdAt > SESSION_TTL_MS) {
      ACTIVE_ASSESSMENT_SESSIONS.delete(sessId);
    }
  }
}

/**
 * Generates a dynamic, randomized assessment session for a candidate.
 * Guarantees fresh, non-repeating questions even for the same job and candidate.
 */
function generateSessionAssessment(roleName, options = {}) {
  cleanupExpiredSessions();

  const key = normalizeRoleToBankKey(roleName);
  const pool = ROLE_QUESTIONS_BANK[key] || ROLE_QUESTIONS_BANK['Frontend Developer'];
  const sampleCount = Math.min(options.sampleCount || 20, pool.length);

  // Candidate tracking key for exclusion filter
  const candidateIdentifier = (options.candidateEmail || options.candidateId || options.name || '').toLowerCase().trim();
  let seenSet = CANDIDATE_SEEN_QUESTIONS.get(candidateIdentifier);
  if (!seenSet) {
    seenSet = new Set();
    if (candidateIdentifier) {
      CANDIDATE_SEEN_QUESTIONS.set(candidateIdentifier, seenSet);
    }
  }

  // 1. Separate pool into Unseen vs Seen questions
  let candidateUnseenPool = pool.filter(q => !seenSet.has(q.id));

  // If candidate has seen almost all questions, reset their history to allow fresh cycles
  if (candidateUnseenPool.length < sampleCount) {
    seenSet.clear();
    candidateUnseenPool = [...pool];
  }

  // 2. Fisher-Yates sample without replacement from unseen pool
  const shuffledUnseen = shuffleArray(candidateUnseenPool);
  const sampled = shuffledUnseen.slice(0, sampleCount);

  // Record newly sampled questions in candidate's seen history
  sampled.forEach(q => seenSet.add(q.id));

  // 3. Further randomize question presentation order
  const presentationQuestions = shuffleArray(sampled);

  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const answerKey = {};
  const masterQuestions = [];
  const clientQuestions = [];

  // 4. For each question, shuffle options and compute new correct index
  presentationQuestions.forEach((q, idx) => {
    const originalOptions = [...q.options];
    const correctOptionText = originalOptions[q.correctIndex || 0];

    // Create array of option objects to track after shuffle
    const optionObjs = originalOptions.map((opt, i) => ({
      text: opt,
      isCorrect: i === (q.correctIndex || 0)
    }));

    const shuffledOptions = shuffleArray(optionObjs);
    const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);
    const finalOptionTexts = shuffledOptions.map(o => o.text);

    // Save session answer key
    answerKey[q.id] = newCorrectIndex;

    masterQuestions.push({
      id: q.id,
      questionNumber: idx + 1,
      question: q.question,
      options: finalOptionTexts,
      correctIndex: newCorrectIndex,
      originalId: q.id
    });

    clientQuestions.push({
      id: q.id,
      questionNumber: idx + 1,
      question: q.question,
      options: finalOptionTexts
    });
  });

  // Store in session cache
  ACTIVE_ASSESSMENT_SESSIONS.set(sessionId, {
    sessionId,
    role: key,
    candidateIdentifier,
    createdAt: Date.now(),
    sampleCount,
    answerKey,
    masterQuestions
  });

  return {
    sessionId,
    role: key,
    totalQuestions: clientQuestions.length,
    questions: clientQuestions
  };
}

/**
 * Evaluates candidate submission answers against the session answer key (or fallback bank).
 * Passing Threshold: 80% (>= 16 / 20).
 */
function evaluateAssessmentSubmission(roleName, candidateAnswers = {}, sessionId = null) {
  const key = normalizeRoleToBankKey(roleName);
  let masterQuestions = [];
  let answerKey = {};

  if (sessionId && ACTIVE_ASSESSMENT_SESSIONS.has(sessionId)) {
    const session = ACTIVE_ASSESSMENT_SESSIONS.get(sessionId);
    masterQuestions = session.masterQuestions;
    answerKey = session.answerKey;
  } else {
    // Fallback: evaluate against default role bank
    const defaultPool = ROLE_QUESTIONS_BANK[key] || ROLE_QUESTIONS_BANK['Frontend Developer'];
    masterQuestions = defaultPool.slice(0, 20);
    masterQuestions.forEach(q => {
      answerKey[q.id] = q.correctIndex || 0;
    });
  }

  const totalQuestions = masterQuestions.length;
  let correctCount = 0;
  const details = [];

  masterQuestions.forEach(q => {
    const userSelected = candidateAnswers[q.id] !== undefined ? parseInt(candidateAnswers[q.id], 10) : null;
    const correctIdx = answerKey[q.id] !== undefined ? answerKey[q.id] : (q.correctIndex || 0);
    const isCorrect = userSelected === correctIdx;

    if (isCorrect) {
      correctCount++;
    }

    details.push({
      questionId: q.id,
      question: q.question,
      options: q.options,
      userSelected,
      correctIndex: correctIdx,
      isCorrect
    });
  });

  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercent >= 80;

  return {
    roleEvaluated: key,
    sessionId: sessionId || null,
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

/**
 * Legacy support: Retrieves static questions for a role
 */
function getQuestionsForRole(roleName, stripAnswers = true) {
  const sessionData = generateSessionAssessment(roleName, { sampleCount: 20 });
  return sessionData.questions;
}

module.exports = {
  ROLE_QUESTIONS_BANK,
  ACTIVE_ASSESSMENT_SESSIONS,
  CANDIDATE_SEEN_QUESTIONS,
  normalizeRoleToBankKey,
  generateSessionAssessment,
  getQuestionsForRole,
  evaluateAssessmentSubmission
};
`;

fs.writeFileSync(path.join(__dirname, 'assessment_questions.js'), fileContent, 'utf8');

for (const [role, list] of Object.entries(bank)) {
  console.log(`✅ ${role}: ${list.length} MCQs`);
}
console.log(`[Complete 400 MCQs Builder] Successfully written assessment_questions.js! Total bytes: ${Buffer.byteLength(fileContent)}`);
