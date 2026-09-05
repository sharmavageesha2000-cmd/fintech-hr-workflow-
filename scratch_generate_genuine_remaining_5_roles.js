// Comprehensive Bank of 50 Genuine Domain Questions for the remaining 5 roles:
// 1. AI/ML Engineer (IDs 451 - 500)
// 2. Data Analyst (IDs 551 - 600)
// 3. Business Analyst (IDs 651 - 700)
// 4. UI/UX Designer (IDs 751 - 800)
// 5. Business Development Executive (IDs 851 - 900)

function makeQ(id, question, options, correctIndex = 0, explanation = '') {
  return {
    id,
    question,
    options,
    correctIndex,
    explanation: explanation || `Option ${String.fromCharCode(65 + correctIndex)} is the accurate verified response for this scenario.`
  };
}

// ==========================================
// 1. AI/ML ENGINEER (50 Extra Questions: 451 - 500)
// ==========================================
const extraAIML = [
  makeQ(451, "In PyTorch, what is the exact execution difference between `model.eval()` and `torch.no_grad()`?", [
    "`model.eval()` switches layers like Dropout and BatchNorm to evaluation behavior; `torch.no_grad()` disables autograd gradient calculation graph construction to save memory",
    "`model.eval()` deletes all weights from GPU memory; `torch.no_grad()` frees CPU RAM",
    "`model.eval()` and `torch.no_grad()` are identical aliases",
    "`torch.no_grad()` automatically converts weights to FP16"
  ]),
  makeQ(452, "What is the mathematical mechanism behind LoRA (Low-Rank Adaptation) in LLM parameter-efficient fine-tuning?", [
    "Decomposes weight updates Delta W into two low-rank matrices A and B (Delta W = B * A) where rank r << d, freezing base weights and training only <1% parameters",
    "Quantizes all neural network weights to 1-bit binary representations",
    "Prunes 50% of the attention heads permanently across all layers",
    "Converts Transformer attention layers into Convolutional filters"
  ]),
  makeQ(453, "In deep learning optimization, how does AdamW resolve the weight decay limitation of classical Adam?", [
    "Decouples L2 weight decay regularization directly from moving gradient moments, preventing large weight decay steps on parameters with small historical gradients",
    "Multiplies the learning rate by batch size automatically",
    "Eliminates the need for first-order momentum tracking",
    "Runs twice as fast on CPU threads"
  ]),
  makeQ(454, "Why does the Transformer architecture use Rotary Position Embedding (RoPE) over absolute sinusoidal positional embeddings?", [
    "Encodes relative positional distance between query and key tokens naturally via a complex rotation matrix, providing superior length extrapolation for long context windows",
    "Reduces the vocabulary size by 50%",
    "Replaces the Softmax operation with linear sigmoid activation",
    "Forces all token vectors to have zero variance"
  ]),
  makeQ(455, "What is the computational benefit of FlashAttention-2 over standard attention computation?", [
    "Tiles matrix multiplication across fast on-chip GPU SRAM, avoiding redundant reads/writes to slow High-Bandwidth Memory (HBM) for 2-4x speedup and O(N) memory complexity",
    "Approximates attention matrices using random Fourier projections",
    "Replaces backpropagation with evolutionary genetic algorithms",
    "Runs attention computation entirely in system RAM"
  ]),
  makeQ(456, "In evaluating binary classifiers on severe class-imbalanced datasets (e.g. 0.5% fraud rate), which metric provides the most actionable assessment?", [
    "Precision-Recall AUC (PR-AUC / Average Precision) because it focuses on positive class performance without being inflated by overwhelming True Negatives",
    "Accuracy score",
    "Mean Squared Error (MSE)",
    "R-squared coefficient"
  ]),
  makeQ(457, "What is the primary role of Layer Normalization (LayerNorm) compared to Batch Normalization in NLP Transformer models?", [
    "Normalizes activations across the feature/hidden dimension for each token independently of batch size and sequence length",
    "Normalizes activations across the entire mini-batch dimension",
    "Requires a fixed batch size of 64 or 128",
    "Can only be calculated during model compilation"
  ]),
  makeQ(458, "What does the temperature parameter control during autoregressive language model token sampling?", [
    "Scales the logit values before applying Softmax (lower temperature sharpens the distribution towards highest probability tokens; higher temperature flattens distribution for randomness)",
    "Controls the GPU thermal clock frequency",
    "Sets the learning rate decay schedule during training",
    "Adjusts the maximum sequence context length"
  ]),
  makeQ(459, "In reinforcement learning from human feedback (RLHF), what is the purpose of Direct Preference Optimization (DPO)?", [
    "Optimizes the policy model directly on human preference pairs (chosen vs rejected) using an implicit reward formulation without needing a separate reward model or PPO training loop",
    "Replaces supervised fine-tuning completely",
    "Generates synthetic training datasets using Monte Carlo tree search",
    "Prunes inactive neurons from the neural network"
  ]),
  makeQ(460, "What is the primary function of Grouped-Query Attention (GQA) used in LLaMA-2/3 models?", [
    "Shares Key and Value projection heads across groups of Query heads, dramatically reducing KV-cache memory bandwidth overhead during inference while maintaining quality",
    "Computes attention across multiple GPU nodes simultaneously",
    "Eliminates Feed-Forward networks from the Transformer",
    "Applies dropout to self-attention weights during inference"
  ]),
  makeQ(461, "In computer vision, what is the core architectural innovation of Vision Transformers (ViT)?", [
    "Splits images into fixed-size non-overlapping patches, linearly embeds each patch into a token vector, and processes them with standard Transformer encoder blocks",
    "Uses recursive pooling layers without any convolutions",
    "Converts 2D images into 1D audio spectrograms",
    "Applies optical character recognition before feature extraction"
  ]),
  makeQ(462, "What is 'Catastrophic Forgetting' in continual neural network learning and how is it mitigated?", [
    "When a model trained on a new task drastically degrades performance on previously learned tasks; mitigated via Experience Replay, EWC (Elastic Weight Consolidation), or LoRA adapters",
    "When GPU VRAM is completely filled causing CUDA out of memory errors",
    "When weights become NaN due to gradient explosion",
    "When model inference latency exceeds 1000ms"
  ]),
  makeQ(463, "In distributed deep learning, what is the core difference between DDP (Distributed Data Parallel) and FSDP (Fully Sharded Data Parallel)?", [
    "DDP replicates the entire model across all GPUs and synchronizes gradients; FSDP shards model parameters, gradients, and optimizer states across GPUs, enabling training of massive models",
    "DDP is for CPUs only while FSDP is for TPUs",
    "FSDP does not support backpropagation",
    "DDP cannot be used with PyTorch"
  ]),
  makeQ(464, "What is the purpose of the 'KV Cache' during LLM autoregressive inference?", [
    "Stores precomputed Key and Value projection vectors of previous tokens so they don't need to be recomputed for every newly generated token, reducing generation time from O(N^2) to O(N)",
    "Caches generated text responses in Redis",
    "Stores model weights in compressed INT4 format on disk",
    "Maintains user session cookies in memory"
  ]),
  makeQ(465, "What is 'Gradient Clipping' and why is it used during deep network training?", [
    "Caps the norm or value of gradients when they exceed a threshold, preventing exploding gradients from destabilizing weight updates",
    "Prunes zero-weight gradients to increase training speed",
    "Rounds gradient floats to integer numbers",
    "Converts backward gradients into forward activations"
  ]),
  makeQ(466, "In diffusion models (e.g. Stable Diffusion), what is the role of the U-Net architecture?", [
    "Predicts and subtracts the noise added to the latent representation at each timestep of the reverse diffusion process",
    "Encodes text prompts into 512-dimensional vectors",
    "Compresses high-resolution images into JPEG format",
    "Upscales 2D images to 3D voxel grids"
  ]),
  makeQ(467, "What is the key advantage of BFloat16 (Brain Floating Point) over standard FP16 in deep learning?", [
    "Maintains the same 8-bit exponent dynamic range as FP32 (preventing underflow/overflow) while using only 16 bits total",
    "Provides 64-bit double precision accuracy in 16-bit space",
    "Eliminates the need for matrix multiplication",
    "Executes natively on ARM microcontrollers without FPUs"
  ]),
  makeQ(468, "What is 'Speculative Decoding' in LLM inference acceleration?", [
    "Uses a small, fast draft model to generate candidate tokens quickly, which are then verified in parallel in a single forward pass by the large target model",
    "Guesses the next user prompt before they finish typing",
    "Quantizes the model weights dynamically during runtime",
    "Translates English tokens into Chinese tokens before processing"
  ]),
  makeQ(469, "In object detection, what is the role of 'Non-Maximum Suppression' (NMS)?", [
    "Eliminates redundant overlapping bounding boxes for the same object by retaining only the highest confidence box and suppressing boxes with IoU exceeding a threshold",
    "Normalizes pixel intensities across bounding boxes",
    "Increases model inference resolution",
    "Converts bounding box coordinates from float to integer"
  ]),
  makeQ(470, "What does the 'Perplexity' metric measure in language modeling?", [
    "The exponential of cross-entropy loss, quantifying how uncertain or surprised the model is when predicting the next token in a test corpus",
    "The number of tokens generated per second",
    "The percentage of hallucinated facts in generated text",
    "The compression ratio of token embeddings"
  ]),
  makeQ(471, "What is 'Focal Loss' and why is it used in object detection (e.g. RetinaNet)?", [
    "Adds a modulating factor `(1 - p_t)^gamma` to standard cross-entropy loss to down-weight easy examples and focus training on hard negative examples",
    "Calculates loss based on focal length of camera lenses",
    "Penalizes bounding boxes that are too large",
    "Forces gradients to zero for all background pixels"
  ]),
  makeQ(472, "In model quantization, what is the difference between Post-Training Quantization (PTQ) and Quantization-Aware Training (QAT)?", [
    "PTQ quantizes weights after training without retraining; QAT simulates quantization rounding errors during the forward/backward passes of training for higher accuracy preservation",
    "PTQ is only for vision models while QAT is for speech models",
    "QAT can only be executed on quantum computers",
    "PTQ requires retraining all model parameters from scratch"
  ]),
  makeQ(473, "What is the difference between Cross-Attention and Self-Attention in encoder-decoder models?", [
    "Self-Attention computes attention between tokens within the same sequence; Cross-Attention computes queries from the decoder and keys/values from the encoder output",
    "Self-Attention is for text while Cross-Attention is for images",
    "Cross-Attention disables the Softmax operation",
    "Self-Attention has O(1) time complexity"
  ]),
  makeQ(474, "In time series forecasting, what does 'Stationarity' mean?", [
    "A property of time series data where statistical properties (mean, variance, autocorrelation) remain constant over time",
    "When a model stops training after 10 epochs",
    "When data has missing timestamps",
    "When time series values are strictly positive integers"
  ]),
  makeQ(475, "What is the primary role of the Reparameterization Trick in Variational Autoencoders (VAEs)?", [
    "Expresses the latent variable as `z = mu + sigma * epsilon` (where epsilon ~ N(0,1)) so that gradients can backpropagate through stochastic latent sampling",
    "Converts continuous variables into discrete tokens",
    "Removes encoder weights during inference",
    "Prevents overfitting by shuffling dataset labels"
  ]),
  makeQ(476, "What is 'Contrastive Learning' (e.g. SimCLR, CLIP)?", [
    "Trains models to map semantically similar (positive) pairs close together in embedding space while pushing dissimilar (negative) pairs far apart",
    "Adjusts monitor contrast settings for computer vision datasets",
    "Compares model predictions against random noise",
    "Trains two competing neural networks in a minimax game"
  ]),
  makeQ(477, "In PyTorch, what does `torch.cuda.amp.autocast()` do?", [
    "Automatically selects appropriate floating-point precision (FP16 or FP32) for individual operations during forward passes to accelerate execution and save memory",
    "Casts GPU CUDA cores into CPU threads",
    "Converts all tensors to 8-bit integers",
    "Deletes unused model layers automatically"
  ]),
  makeQ(478, "What is the 'Curse of Dimensionality' in machine learning algorithms?", [
    "As the number of features/dimensions increases, the volume of feature space grows exponentially, making data points sparse and distance metrics (like Euclidean) less meaningful",
    "When model training time exceeds 24 hours",
    "When a dataset contains more than 1 million rows",
    "When a neural network has more than 100 layers"
  ]),
  makeQ(479, "In clustering, what does the 'Silhouette Score' evaluate?", [
    "Measures how similar an object is to its own cluster (cohesion) compared to other clusters (separation), ranging from -1 to +1",
    "Counts the number of outlier points in a dataset",
    "Measures the training time of K-Means algorithm",
    "Calculates the total variance across all dataset features"
  ]),
  makeQ(480, "What is the purpose of Cosine Annealing Learning Rate scheduling?", [
    "Decreases learning rate following a cosine curve towards a minimum value, allowing large initial steps followed by fine-grained convergence near local minima",
    "Keeps learning rate strictly constant across all epochs",
    "Increases learning rate exponentially to escape saddle points",
    "Multiplies learning rate by 2 whenever loss increases"
  ]),
  makeQ(481, "What is 'Data Drift' (Covariate Shift) in machine learning production monitoring?", [
    "A shift in the distribution of input features `P(X)` between training and production inference while the underlying relationship `P(Y|X)` remains unchanged",
    "When the database runs out of disk storage",
    "When API response latency exceeds 500ms",
    "When ground truth labels change meaning over time"
  ]),
  makeQ(482, "In ensemble learning, what is the core conceptual difference between Bagging and Boosting?", [
    "Bagging trains multiple independent base models in parallel on bootstrap samples to reduce variance; Boosting trains sequential models where each corrects errors of the predecessor to reduce bias",
    "Bagging is for regression while Boosting is for classification",
    "Boosting requires neural networks while Bagging only uses decision trees",
    "Bagging creates deep trees while Boosting creates no trees"
  ]),
  makeQ(483, "What does the Gini Impurity metric quantify in Decision Trees?", [
    "The probability that a randomly chosen element from a node would be incorrectly labeled if it were randomly labeled according to the distribution of labels in the subset",
    "The maximum depth of a decision tree branch",
    "The correlation between two continuous features",
    "The ratio of true positives to false negatives"
  ]),
  makeQ(484, "In natural language processing, what is 'Subword Tokenization' (e.g. Byte-Pair Encoding / WordPiece)?", [
    "Iteratively merges frequent character sequences to represent rare words as combinations of common subword units, avoiding out-of-vocabulary (OOV) tokens with a compact vocabulary",
    "Converts text into phonetic audio waveforms",
    "Splits text strictly on white spaces and punctuation",
    "Replaces all uppercase letters with lowercase equivalents"
  ]),
  makeQ(485, "What is 'Early Stopping' in neural network training?", [
    "Monitors validation metric (e.g. loss) and stops training when performance ceases improving for N consecutive epochs (patience), restoring the best checkpoint to prevent overfitting",
    "Interrupting training manually by terminating the terminal process",
    "Stopping training after exactly 5 epochs regardless of loss",
    "Freezing model weights after 1000 batches"
  ]),
  makeQ(486, "What is 'Knowledge Distillation' in deep learning?", [
    "Transferring knowledge from a large, complex teacher model to a smaller, lightweight student model by training the student to match the soft probability distribution of the teacher",
    "Extracting text from PDF research papers using OCR",
    "Pruning low-magnitude weights from a neural network",
    "Fine-tuning a model on synthetic user questions"
  ]),
  makeQ(487, "In PyTorch, why must you call `optimizer.zero_grad()` before `loss.backward()`?", [
    "PyTorch accumulates gradients by default on subsequent backward passes; calling `zero_grad()` clears previous batch gradients so they don't combine",
    "It resets all model parameter weights to zero",
    "It clears GPU VRAM cache completely",
    "It disables autograd graph tracking for the next step"
  ]),
  makeQ(488, "What is 'Concept Drift' in production ML systems?", [
    "A change in the statistical relationship between input features and target labels `P(Y|X)` over time, requiring model retraining or adaptation",
    "When new features are added to the SQL database schema",
    "When input data contains missing or null values",
    "When the ML server CPU utilization reaches 100%"
  ]),
  makeQ(489, "What is the primary role of Activation Functions (e.g. GELU, Swish, ReLU) in neural networks?", [
    "Introduces non-linearity into the network, enabling it to learn and approximate complex non-linear mappings beyond simple linear matrix multiplications",
    "Normalizes parameter weights between 0 and 1",
    "Accelerates GPU memory read speeds",
    "Calculates cross-entropy loss during backpropagation"
  ]),
  makeQ(490, "What is the purpose of 'Label Smoothing' regularization in classification?", [
    "Replaces hard one-hot target vectors (e.g. [1, 0, 0]) with smoothed probabilities (e.g. [0.9, 0.05, 0.05]), preventing the model from becoming overconfident in its predictions",
    "Removes duplicate rows from the training dataset",
    "Sorts class labels alphabetically",
    "Converts multi-class problems into multiple binary problems"
  ]),
  makeQ(491, "In model interpretability, what do SHAP (SHapley Additive exPlanations) values represent?", [
    "Fair allocation of each feature's contribution to a specific model prediction based on cooperative game theory Shapley values across all possible feature subsets",
    "The execution latency of individual neural network layers",
    "The correlation coefficient between input features and target labels",
    "The rank order of hyperparameter search trials"
  ]),
  makeQ(492, "What is the purpose of Triton Inference Server in enterprise MLOps?", [
    "Provides high-performance, concurrent model serving across multiple frameworks (PyTorch, TensorRT, ONNX, vLLM) with dynamic batching, model pipelining, and GPU metrics",
    "Trains deep learning models on Kubernetes clusters",
    "Labels raw image and text datasets automatically",
    "Compiles Python code into WebAssembly binaries"
  ]),
  makeQ(493, "What is the 'Dead ReLU' problem and how is it resolved?", [
    "When neurons output zero for all inputs and gradients become permanently zero (inactivating the neuron); resolved via LeakyReLU, ELU, GELU, or careful weight initialization (He/Kaiming)",
    "When GPU threads stall due to memory lock contention",
    "When learning rate decays to zero after 1 epoch",
    "When cross-entropy loss becomes infinite (Inf)"
  ]),
  makeQ(494, "In graph neural networks (GNNs), what is the core mechanism of 'Message Passing'?", [
    "Iteratively aggregates feature representations from neighboring nodes along edges, combining them with the node's own state via learnable neural network functions",
    "Sending HTTP REST requests between microservices",
    "Transferring tensor gradients between GPU devices",
    "Logging debug messages to centralized monitoring systems"
  ]),
  makeQ(495, "What is 'Data Augmentation' and why is it essential in deep learning?", [
    "Applies domain-preserving transformations (e.g. rotations, crops, mixup, synonym replacement) to training samples, increasing effective dataset diversity and reducing overfitting",
    "Increases the resolution of images using bicubic interpolation",
    "Synthetically adds random noise to model parameter weights",
    "Duplicates identical dataset rows 10 times"
  ]),
  makeQ(496, "What is the mathematical definition of 'Precision' in binary classification?", [
    "True Positives / (True Positives + False Positives) — the proportion of positive identifications that were actually correct",
    "True Positives / (True Positives + False Negatives)",
    "(True Positives + True Negatives) / Total Samples",
    "False Positives / (False Positives + True Negatives)"
  ]),
  makeQ(497, "What is the mathematical definition of 'Recall' (Sensitivity) in binary classification?", [
    "True Positives / (True Positives + False Negatives) — the proportion of actual positives that were identified correctly",
    "True Positives / (True Positives + False Positives)",
    "True Negatives / (True Negatives + False Positives)",
    "(True Positives + True Negatives) / Total Samples"
  ]),
  makeQ(498, "What does the 'F1-Score' represent?", [
    "The harmonic mean of Precision and Recall: `2 * (Precision * Recall) / (Precision + Recall)`, balancing false positives and false negatives",
    "The arithmetic mean of accuracy and specificity",
    "The geometric mean of true positive rate and false positive rate",
    "The ratio of training loss to validation loss"
  ]),
  makeQ(499, "What is 'Cross-Validation' (e.g. K-Fold) and why is it used?", [
    "Splits dataset into K equal subsets, training on K-1 folds and evaluating on the remaining fold iteratively to obtain an unbiased estimate of model generalization variance",
    "Validates model weights against external API servers",
    "Trains models across two different operating systems",
    "Compares Python models against R models"
  ]),
  makeQ(500, "What is the difference between Supervised, Unsupervised, and Self-Supervised Learning?", [
    "Supervised uses labeled data `(X, Y)`; Unsupervised finds patterns in unlabeled data `X`; Self-Supervised generates pseudo-labels from the data itself (e.g. masked language modeling or next token prediction)",
    "Supervised requires GPUs while Unsupervised runs on CPUs",
    "Unsupervised learning never uses loss functions",
    "Self-Supervised learning requires human annotators for every epoch"
  ])
];

// ==========================================
// 2. DATA ANALYST (50 Extra Questions: 551 - 600)
// ==========================================
const extraDataAnalyst = [
  makeQ(551, "In SQL, what is the critical behavioral difference between `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` window functions?", [
    "`ROW_NUMBER()` assigns strictly unique sequential integers; `RANK()` assigns identical ranks to ties and skips subsequent numbers (e.g. 1, 2, 2, 4); `DENSE_RANK()` assigns identical ranks to ties without skipping (e.g. 1, 2, 2, 3)",
    "They all produce identical outputs in modern SQL engines",
    "`DENSE_RANK()` can only be used with date columns",
    "`ROW_NUMBER()` only works with partition sizes under 100 rows"
  ]),
  makeQ(552, "In Power BI / DAX, what is the exact function and evaluation context of `CALCULATE()`?", [
    "Evaluates an expression in a modified filter context, allowing developers to override, clear (via `ALL`), or inject new filter criteria into data model relationships",
    "Performs simple addition of two integer columns",
    "Calculates the row count of a physical table",
    "Formats numeric values into currency strings"
  ]),
  makeQ(553, "In data modeling, what is the primary difference between a Star Schema and a Snowflake Schema?", [
    "A Star Schema features completely denormalized dimension tables directly linked to fact tables; a Snowflake Schema normalizes dimensions into multiple related sub-tables to reduce data redundancy",
    "A Star Schema is for NoSQL databases while Snowflake Schema is only for SQL databases",
    "Star Schemas cannot support numeric metrics",
    "Snowflake Schemas require Snowflake cloud data warehouse software"
  ]),
  makeQ(554, "In Python Pandas, why is vectorization (e.g. `df['A'] * df['B']`) dramatically faster than iterating with `for index, row in df.iterrows()`?", [
    "Vectorized operations execute in optimized compiled C/SIMD instructions with contiguous memory buffers, avoiding per-row Python interpreter object instantiation and type overhead",
    "Iterrows modifies DataFrame index keys on every loop",
    "Vectorization runs asynchronously in background Web Workers",
    "Iterrows deletes NaN values automatically"
  ]),
  makeQ(555, "In Tableau, what is a Level of Detail (LOD) `FIXED` expression?", [
    "Computes an aggregation using the specified dimensions in the formula, completely independent of whatever dimensions are present in the current worksheet visualization view",
    "Locks the chart axis to fixed minimum and maximum values",
    "Fixes the data source connection to live mode",
    "Exports the dashboard to a static PDF document"
  ]),
  makeQ(556, "What is the business definition and formula for Customer Acquisition Cost (CAC)?", [
    "Total Sales and Marketing Expenses in a given period divided by the Total Number of New Customers Acquired in that same period",
    "Total Revenue divided by Total Active Customers",
    "Customer Lifetime Value (LTV) multiplied by Churn Rate",
    "Average Order Value (AOV) minus Product Return Rate"
  ]),
  makeQ(557, "In A/B testing, what does a p-value of 0.03 indicate when testing at a significance level of alpha = 0.05?", [
    "There is a 3% probability of observing the test results (or more extreme) under the null hypothesis; since p < 0.05, we reject the null hypothesis and conclude the variant has a statistically significant effect",
    "The variant is guaranteed to increase revenue by 3%",
    "The test is inconclusive and must run for 3 more months",
    "97% of website visitors prefer the control version"
  ]),
  makeQ(558, "In relational databases, what does the `COALESCE(col1, col2, 'Default')` function return?", [
    "Returns the first non-NULL expression among its arguments from left to right",
    "Concatenates all non-null strings with commas",
    "Calculates the average of numeric column values",
    "Converts string dates to ISO-8601 timestamps"
  ]),
  makeQ(559, "What is the difference between a Type 1 and Type 2 Slowly Changing Dimension (SCD) in enterprise data warehousing?", [
    "Type 1 overwrites old attribute values losing history; Type 2 creates a new row with effective start/end dates and current flag to preserve complete historical audit trail",
    "Type 1 is for numeric dimensions while Type 2 is for text dimensions",
    "Type 2 deletes old tables and recreates them daily",
    "Type 1 is only supported in transactional OLTP databases"
  ]),
  makeQ(560, "In Python Pandas, what is the difference between `.loc[]` and `.iloc[]`?", [
    "`.loc[]` accesses rows and columns by label/name or boolean conditions; `.iloc[]` accesses data strictly by 0-based integer position",
    "`.loc[]` is for series while `.iloc[]` is for DataFrames",
    "`.iloc[]` can only select one row at a time",
    "There is no difference in modern Pandas 2.0"
  ]),
  makeQ(561, "In statistical analysis, what is the 'Interquartile Range' (IQR) and how is it used in anomaly detection?", [
    "IQR is the distance between the 75th percentile (Q3) and 25th percentile (Q1); outliers are commonly identified as values falling below `Q1 - 1.5*IQR` or above `Q3 + 1.5*IQR`",
    "The difference between the maximum and minimum values in a dataset",
    "The square root of dataset variance",
    "The ratio of mean to median values"
  ]),
  makeQ(562, "In SQL, what is the execution difference between `WHERE` and `HAVING` clauses?", [
    "`WHERE` filters individual rows before any grouping occurs; `HAVING` filters grouped summary records after the `GROUP BY` aggregation has computed",
    "`HAVING` executes faster than `WHERE` in all queries",
    "`WHERE` can only be used with `SELECT *`",
    "`HAVING` can only filter numeric column values"
  ]),
  makeQ(563, "In cohort analysis, what does a 'Retention Matrix' illustrate?", [
    "The percentage of users from a specific acquisition cohort who continue to return and perform active events across subsequent time periods (Day 1, Day 7, Month 1, etc.)",
    "The total compensation paid to employees per department",
    "The memory consumption of database queries over time",
    "The list of churned customers sorted by contract size"
  ]),
  makeQ(564, "What is the difference between an Inner Join and a Full Outer Join in SQL?", [
    "Inner Join returns only rows with matching keys in both tables; Full Outer Join returns all rows from both tables, filling with NULL where matches do not exist",
    "Inner Join returns all rows from the left table only",
    "Full Outer Join removes duplicate rows automatically",
    "Inner Join can only join on primary key columns"
  ]),
  makeQ(565, "In data visualization, why is a Scatter Plot preferred over a Bar Chart for analyzing two continuous variables?", [
    "Displays individual data points along Cartesian coordinates, revealing correlation, clusters, non-linear trends, and outlier distributions between two continuous dimensions",
    "Scatter plots require less memory to render",
    "Bar charts cannot display more than 5 categories",
    "Scatter plots automatically compute Pearson correlation coefficients"
  ]),
  makeQ(566, "What is 'Simpson's Paradox' in statistical data analysis?", [
    "A phenomenon where a trend or relationship appears in several different subgroups of data but reverses or disappears when the groups are combined",
    "When sample size is too small to calculate standard deviation",
    "When a survey has a 100% response rate",
    "When correlation implies direct physical causation"
  ]),
  makeQ(567, "In Power BI, what does the `RELATED()` DAX function do?", [
    "Follows an existing many-to-one relationship to fetch a corresponding column value from another table into the current row context",
    "Calculates the correlation coefficient between two tables",
    "Links two disconnected tables using fuzzy text matching",
    "Filters the dashboard based on user role permissions"
  ]),
  makeQ(568, "In SQL, what is a Common Table Expression (CTE) defined with the `WITH` keyword?", [
    "A temporary named result set that exists only within the execution scope of a single SQL statement, improving query readability and enabling recursive queries",
    "A permanent database table stored on physical disk",
    "A stored procedure that accepts parameters",
    "An index created on foreign key columns"
  ]),
  makeQ(569, "What is Customer Lifetime Value (LTV) and how is it simply estimated for subscription businesses?", [
    "`(Average Revenue Per User * Gross Margin %) / Monthly Churn Rate` — estimating total net profit generated from a customer relationship over its lifespan",
    "Total revenue in the last 12 months divided by 12",
    "Average order price multiplied by total website visitors",
    "Total sales minus total operating expenses"
  ]),
  makeQ(570, "In Python, how do you handle missing (NaN) values in a Pandas DataFrame when imputing numeric columns with skewed distributions?", [
    "Impute missing values using the Median (e.g. `df['col'].fillna(df['col'].median())`) because the median is robust to extreme outliers compared to the mean",
    "Replace all NaNs with the maximum column value",
    "Fill with 0 without checking distribution shape",
    "Delete all rows containing any NaN values unconditionally"
  ]),
  makeQ(571, "What does the `GROUPING SETS` operator in SQL allow you to achieve in a single query?", [
    "Defines multiple group-by aggregations (subtotals at different dimension levels) in one query without having to write multiple `UNION ALL` statements",
    "Groups rows by alphabetical order",
    "Creates temporary physical tables for each unique value",
    "Splits large tables into equal horizontal partitions"
  ]),
  makeQ(572, "In business analytics, what is 'Net Promoter Score' (NPS) and how is it computed?", [
    "Percentage of Promoters (score 9-10) minus Percentage of Detractors (score 0-6), ignoring Passives (score 7-8), yielding a score between -100 and +100",
    "Average star rating multiplied by total reviews",
    "Number of positive customer support tickets divided by total tickets",
    "Percentage of customers who renew their annual contract"
  ]),
  makeQ(573, "What is the difference between Pearson and Spearman correlation coefficients?", [
    "Pearson measures linear relationships between continuous variables; Spearman measures monotonic relationships based on ranked values, making it robust to non-linear associations and outliers",
    "Pearson is for categorical data while Spearman is for numeric data",
    "Spearman correlation values range from 0 to +100",
    "Pearson correlation cannot handle negative numbers"
  ]),
  makeQ(574, "In SQL, what does the `LEAD()` and `LAG()` window functions do?", [
    "`LAG()` accesses data from previous rows at a specified offset without a self-join; `LEAD()` accesses data from subsequent rows, useful for calculating period-over-period growth",
    "`LAG()` delays query execution by N seconds; `LEAD()` speeds up execution",
    "`LEAD()` calculates cumulative sums while `LAG()` calculates moving averages",
    "They are only supported in MySQL 5.7"
  ]),
  makeQ(575, "What is an 'Executive Summary Dashboard' best practice regarding cognitive load and metric hierarchy?", [
    "Display top-line North Star KPIs (Revenue, Growth, Active Users) in high-contrast scorecards at top, followed by trend charts, with filters and granular drill-downs accessible below",
    "Place 50 pie charts with 3D gradients on the main page",
    "Use 15 distinct fonts and bright neon backgrounds",
    "Display all raw transaction table rows on the initial landing screen"
  ]),
  makeQ(576, "In SQL Server / PostgreSQL, what is the purpose of an Indexed / Materialized View compared to a standard View?", [
    "A Materialized View physically stores the precomputed query results on disk and updates on refresh, providing blazing fast reads for complex aggregations at the cost of storage/write overhead",
    "A standard View creates physical tables while Materialized Views do not",
    "Materialized Views can only be queried by database administrators",
    "Standard Views store data permanently in RAM cache"
  ]),
  makeQ(577, "In Python, which visualization library is best suited for interactive web-based exploratory charts with tooltips and zoom capabilities?", [
    "Plotly / Altair",
    "Matplotlib (static backend)",
    "Pillow",
    "NumPy"
  ]),
  makeQ(578, "What does 'Data Normalization' (e.g. Min-Max Scaling vs Z-Score Standardization) achieve before clustering?", [
    "Scales all features to a common comparable range so that features with large numerical magnitudes (e.g. Salary in $100k) do not dominate Euclidean distance calculations over smaller features (e.g. Age in 30s)",
    "Removes duplicate records from the database",
    "Converts continuous variables into categorical labels",
    "Encodes text columns into UTF-8 characters"
  ]),
  makeQ(579, "What is 'Churn Rate' and how is Monthly Logo Churn calculated?", [
    "Number of Customers Lost during the Month divided by Total Customers at the Start of that Month",
    "Total Monthly Recurring Revenue (MRR) divided by Total Customers",
    "Customer Acquisition Cost divided by Average Order Value",
    "Number of new customer signups per day"
  ]),
  makeQ(580, "In SQL, what does `UNION` do compared to `UNION ALL`?", [
    "`UNION` combines result sets and removes duplicate rows (requires sorting/hashing); `UNION ALL` combines result sets preserving all duplicate rows, making it significantly faster",
    "`UNION` only works with integer columns",
    "`UNION ALL` can only combine tables from different databases",
    "`UNION` executes asynchronously while `UNION ALL` is blocking"
  ]),
  makeQ(581, "In Power BI, what is the difference between a Calculated Column and a Measure?", [
    "A Calculated Column computes row-by-row during data refresh and consumes RAM storage; a Measure computes dynamically on the fly based on current filter context when visualized",
    "Measures are saved to disk while Calculated Columns are temporary",
    "Calculated Columns can only contain text data",
    "Measures cannot be used in card visualizations"
  ]),
  makeQ(582, "What is an ETL pipeline vs an ELT pipeline in modern cloud data warehousing (e.g. BigQuery, Snowflake)?", [
    "ETL transforms data on a separate compute server before loading; ELT loads raw data directly into the scalable cloud data warehouse first, leveraging the warehouse's MPP engine for transformations (via dbt/SQL)",
    "ETL is only for spreadsheets while ELT is for images",
    "ELT cannot handle JSON data",
    "ETL is fully automated while ELT is manual"
  ]),
  makeQ(583, "In statistics, what is the 'Central Limit Theorem'?", [
    "The sampling distribution of the sample mean approaches a normal distribution as sample size increases (typically N >= 30), regardless of the shape of the underlying population distribution",
    "All real-world datasets have a standard deviation of 1.0",
    "The median is always equal to the mean in large datasets",
    "Outliers disappear as dataset size exceeds 10,000 rows"
  ]),
  makeQ(584, "In SQL, what is the purpose of `CROSS JOIN` (Cartesian Product)?", [
    "Combines every single row from the first table with every single row from the second table (output rows = N * M), useful for generating master date/category dimension combinations",
    "Joins tables on identical primary keys only",
    "Deletes non-matching rows from both tables",
    "Sorts table columns alphabetically"
  ]),
  makeQ(585, "What is the primary risk of using a 3D Pie Chart with many slices in a business report?", [
    "Perspective distortion exaggerates the visual size of front slices relative to back slices, and human vision struggles to compare 2D angles/areas accurately compared to linear bar lengths",
    "3D charts consume 10x more GPU memory",
    "Pie charts cannot display percentages",
    "3D charts are not supported in Microsoft Excel"
  ]),
  makeQ(586, "In SQL, how do you prevent SQL Injection vulnerabilities in dynamic reporting applications?", [
    "Use Parameterized Queries / Prepared Statements where query structure and user inputs are sent separately to the database engine",
    "Concatenate user input strings directly into SQL statements",
    "Escape single quotes using regex string replace on the frontend",
    "Grant administrative root privileges to all database user connections"
  ]),
  makeQ(587, "What is 'Conversion Rate' and how is it calculated for an e-commerce checkout funnel?", [
    "(Total Completed Purchases / Total Unique Visitors or Sessions) * 100",
    "Total Cart Additions divided by Total Purchases",
    "Average Order Value divided by Total Marketing Spend",
    "Number of product views per visitor"
  ]),
  makeQ(588, "In Python Pandas, what does `df.pivot_table(index='Region', columns='Year', values='Sales', aggfunc='sum')` do?", [
    "Reshapes DataFrame from long format to wide matrix format, aggregating 'Sales' sum grouped by 'Region' as rows and 'Year' as columns",
    "Sorts DataFrame in descending order by Sales",
    "Deletes all rows where Region is duplicated",
    "Converts DataFrame into a JSON string"
  ]),
  makeQ(589, "In statistical hypothesis testing, what is a 'Type I Error' vs 'Type II Error'?", [
    "Type I Error is a False Positive (rejecting a true null hypothesis); Type II Error is a False Negative (failing to reject a false null hypothesis)",
    "Type I Error is a calculation error; Type II Error is a data entry error",
    "Type I Error is when p-value is 0.0; Type II Error is when p-value is 1.0",
    "Type I Error occurs in training data; Type II Error occurs in production data"
  ]),
  makeQ(590, "What is 'Data Lineage' and why is it critical in enterprise analytics governance?", [
    "The complete lifecycle tracking of data origin, transformations, pipeline dependencies, and downstream consumption across systems, ensuring auditability and impact analysis",
    "The chronological age of database servers",
    "The hierarchical reporting structure of data analysts",
    "The physical storage location of hard disk drives"
  ]),
  makeQ(591, "In SQL, what is the difference between `TRUNCATE TABLE` and `DELETE FROM`?", [
    "`TRUNCATE TABLE` is a DDL command that deallocates data pages (very fast, resets auto-increment keys, minimal logging); `DELETE FROM` is DML that deletes rows one-by-one and can be filtered with `WHERE`",
    "`TRUNCATE` can only delete 100 rows at a time",
    "`DELETE FROM` permanently deletes the table schema definition",
    "`TRUNCATE` requires rebuilding the database from backup"
  ]),
  makeQ(592, "In business financial analysis, what does 'Gross Margin %' represent?", [
    "`((Total Revenue - Cost of Goods Sold) / Total Revenue) * 100` — the percentage of revenue retained after incurring direct costs of producing goods/services",
    "Net Profit after all taxes and operating expenses divided by Revenue",
    "Total sales growth rate year-over-year",
    "Employee payroll divided by total operational budget"
  ]),
  makeQ(593, "What is the purpose of an 'Upsert' (e.g. `MERGE` or `INSERT ... ON CONFLICT DO UPDATE`) in SQL?", [
    "Inserts a new record if the unique key does not exist; updates the existing record if a key collision occurs, ensuring idempotent data pipeline syncs",
    "Converts lowercase text into uppercase text",
    "Compresses table rows to save disk space",
    "Exports table data to Google Cloud Storage"
  ]),
  makeQ(594, "In Python, which function quickly reveals summary statistics (count, mean, std, min, 25%, 50%, 75%, max) for all numeric columns in a DataFrame?", [
    "`df.describe()`",
    "`df.info()`",
    "`df.head()`",
    "`df.shape`"
  ]),
  makeQ(595, "What is 'Data Granularity' in reporting?", [
    "The level of detail represented by a single row of data (e.g. transaction-level, hourly aggregate, daily store summary, or monthly regional rollup)",
    "The font size used in dashboard tables",
    "The compression ratio of Parquet files",
    "The color depth of chart visual elements"
  ]),
  makeQ(596, "In SQL, what is the purpose of `CASE WHEN ... THEN ... ELSE ... END`?", [
    "Provides conditional if-then-else logic within queries to evaluate expressions and return specific values or categorize data dynamically",
    "Executes multiple queries in parallel",
    "Creates a switch between primary and replica databases",
    "Handles database connection timeout exceptions"
  ]),
  makeQ(597, "What is a 'Heatmap' visualization particularly effective at revealing?", [
    "Patterns, concentrations, and correlations across a two-dimensional grid of categories/time-slots using color intensity gradients (e.g. user activity by day of week and hour of day)",
    "Exact financial transactions to 4 decimal places",
    "Network topology routes between microservices",
    "Hierarchical folder directory trees"
  ]),
  makeQ(598, "In statistical analysis, what is the 'Confidence Interval' (e.g. 95% CI) around an estimated metric?", [
    "A range of plausible values calculated from sample data that is expected to contain the true population parameter in 95% of repeated random samples",
    "The percentage of team members confident in the analysis",
    "The probability that a bug exists in the SQL query",
    "The time required to complete statistical testing"
  ]),
  makeQ(599, "What does 'SaaS Quick Ratio' measure?", [
    "`(New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)` — evaluating a SaaS business's ability to grow revenue relative to revenue lost to churn",
    "Current Assets divided by Current Liabilities",
    "Total sales pipeline value divided by monthly sales target",
    "Customer Support response time in minutes"
  ]),
  makeQ(600, "In modern data stacks, what is the role of `dbt` (Data Build Tool)?", [
    "Transforms raw data inside the data warehouse using modular SQL `SELECT` statements, managing dependency DAGs, automated data testing, version control, and documentation",
    "Extracts data from Facebook Ads APIs into Postgres",
    "Visualizes executive dashboards in mobile browsers",
    "Manages user login authentication for BI tools"
  ])
];

// ==========================================
// 3. BUSINESS ANALYST (50 Extra Questions: 651 - 700)
// ==========================================
const extraBusinessAnalyst = [
  makeQ(651, "In requirements engineering, what is the difference between a Business Requirements Document (BRD) and a Functional Requirements Document (FRD)?", [
    "A BRD describes high-level business goals, objectives, and stakeholder expectations ('What the business needs'); an FRD defines specific technical system behaviors, workflows, inputs/outputs, and edge cases ('How the software behaves')",
    "A BRD is written by software developers while an FRD is written by sales teams",
    "An FRD is only created after the project is deployed to production",
    "A BRD cannot contain flowcharts or diagrams"
  ]),
  makeQ(652, "What are the INVEST criteria for writing high-quality User Stories in Agile Scrum?", [
    "Independent, Negotiable, Valuable, Estimable, Small, Testable",
    "Integrated, Networked, Verified, Evaluated, Structured, Tracked",
    "Immediate, Numeric, Verified, Scalable, Timely",
    "Iterative, Normative, Visual, Experiential, Systematic, Targetable"
  ]),
  makeQ(653, "In Business Process Model and Notation (BPMN 2.0), what is the difference between a 'Pool' and a 'Lane'?", [
    "A Pool represents an independent participant or business entity (e.g. Company vs Customer); a Lane partitions a Pool into specific internal organizational roles or departments (e.g. Finance vs Sales)",
    "A Pool is for database queries while a Lane is for UI screens",
    "A Lane represents asynchronous API callbacks",
    "Pools can only contain decision gateways"
  ]),
  makeQ(654, "What is a 'RACI Matrix' and how does it prevent organizational ambiguity during project execution?", [
    "Clarifies stakeholder roles for each task: Responsible (doer), Accountable (ultimate decision-maker), Consulted (provides input), Informed (kept updated)",
    "Calculates Return on Asset Capital Investment",
    "Tracks team velocity in Agile sprint retrospectives",
    "Measures customer satisfaction after product launch"
  ]),
  makeQ(655, "What is the primary objective of a 'Gap Analysis' in enterprise business transformation?", [
    "Compares the current operational state ('As-Is') against the desired future state ('To-Be') to identify missing capabilities, technical roadblocks, and required change initiatives",
    "Calculates budget variance at the end of each fiscal quarter",
    "Evaluates the speed of database network connections",
    "Ranks competitors based on annual gross revenue"
  ]),
  makeQ(656, "In root cause analysis, how does the '5 Whys' technique uncover underlying systemic issues?", [
    "Iteratively asks 'Why did this occur?' 5 consecutive times, moving past superficial symptoms to identify the core process failure or design flaw",
    "Conducts 5 separate interviews with 5 different managers",
    "Surveys 500 customers to collect statistical feedback",
    "Limits bug investigation time to 5 minutes"
  ]),
  makeQ(657, "What is the purpose of an 'Ishikawa' (Fishbone / Cause-and-Effect) Diagram?", [
    "Categorizes potential contributing causes of a specific problem into structured categories (e.g. People, Process, Technology, Environment, Measurement) for visual root cause analysis",
    "Maps database entity-relationship tables",
    "Displays team sprint velocity over 6 iterations",
    "Tracks financial cash flow forecasting"
  ]),
  makeQ(658, "In financial project evaluation, what does Net Present Value (NPV) measure?", [
    "The sum of all future cash inflows discounted back to present value using a specified discount rate, minus the initial investment; positive NPV indicates a financially viable project",
    "Total gross revenue before tax deductions",
    "The time required to recover initial project costs",
    "The annual depreciation rate of software licenses"
  ]),
  makeQ(659, "What is the difference between Scrum and Kanban methodologies in Agile project delivery?", [
    "Scrum organizes work into fixed-length timeboxed Sprints (e.g. 2 weeks) with defined roles and ceremonies; Kanban focuses on continuous delivery and limiting Work-In-Progress (WIP) on a flexible board",
    "Kanban is only for software bugs while Scrum is for new features",
    "Scrum does not allow user stories or backlog items",
    "Kanban requires daily 1-hour status meetings"
  ]),
  makeQ(660, "How should Acceptance Criteria be structured using the BDD (Behavior-Driven Development) Gherkin syntax?", [
    "`Scenario: [Title]` \n`Given [initial context/precondition]` \n`When [user action or event occurs]` \n`Then [expected observable outcome/result]`",
    "`If [user clicks] -> Then [database updates]`",
    "`Feature: [Name] -> Target: [Completion Date]`",
    "`User Story: [I want] -> Requirement: [100% test coverage]`"
  ]),
  makeQ(661, "What is the purpose of a SWOT Analysis in strategic business planning?", [
    "Evaluates internal Strengths and Weaknesses alongside external Opportunities and Threats to guide strategic decision-making and risk mitigation",
    "Tracks software bug severity levels from Low to Critical",
    "Calculates employee turnover rates by department",
    "Measures web application load times across different browsers"
  ]),
  makeQ(662, "What is a PESTLE Analysis and when is it conducted?", [
    "Framework analyzing macro-environmental external factors: Political, Economic, Social, Technological, Legal, and Environmental, used when evaluating market entry or major strategic initiatives",
    "Framework for evaluating database performance metrics",
    "A sprint estimation technique using planning poker",
    "A code review checklist for backend engineers"
  ]),
  makeQ(663, "In Requirements Management, what is the MoSCoW prioritization technique?", [
    "Categorizes requirements into Must have (non-negotiable MVP), Should have (important but not critical), Could have (desirable if time permits), Won't have (deferred to future phases)",
    "Sorts features by alphabetical development order",
    "Assigns requirements based on developer seniority",
    "Prioritizes tasks by estimated financial cost"
  ]),
  makeQ(664, "What is 'Scope Creep' and how does a Business Analyst effectively control it?", [
    "Uncontrolled expansion of project scope without adjustments to time, budget, or resources; controlled via formal Change Control Procedures, impact assessments, and clear baseline sign-offs",
    "When developers write code faster than planned",
    "When project meetings run over scheduled time limits",
    "When database storage requirements grow unexpectedly"
  ]),
  makeQ(665, "What is a 'Use Case Diagram' in UML modeling and what are its primary elements?", [
    "Visual representation of system interactions with external entities, composed of Actors (users/systems), Use Cases (system goals/actions), System Boundary, and Relationships (Include, Extend, Generalization)",
    "Flowchart showing internal CPU execution cycles",
    "Diagram showing database schema foreign key links",
    "Table listing software license renewal dates"
  ]),
  makeQ(666, "What is the difference between `<<include>>` and `<<extend>>` relationships in UML Use Cases?", [
    "`<<include>>` represents mandatory core functionality that is always executed as part of the base use case; `<<extend>>` represents optional or conditional behavior triggered only under specific extension points",
    "`<<extend>>` is mandatory while `<<include>>` is optional",
    "`<<include>>` can only link actors to databases",
    "There is no difference in UML 2.5 standards"
  ]),
  makeQ(667, "In Agile, what is a 'User Story Mapping' session and what is its primary outcome?", [
    "A collaborative workshop that arranges user stories along a horizontal backbone (customer journey steps) and vertical priority axis (releases/sprints) to plan holistic product roadmaps and viable MVPs",
    "A technical meeting where database schemas are designed",
    "An annual review where employee salaries are evaluated",
    "A test session where QA engineers execute automated scripts"
  ]),
  makeQ(668, "What is a 'Stakeholder Matrix' (Power vs Interest Grid) used for?", [
    "Classifies stakeholders based on their level of power/influence and interest, determining communication strategies: Manage Closely (High/High), Keep Satisfied (High/Low), Keep Informed (Low/High), Monitor (Low/Low)",
    "Calculates bonuses for senior executive leadership",
    "Tracks developer pull request approval counts",
    "Maps network firewall rules for cloud infrastructure"
  ]),
  makeQ(669, "What is the 'ADKAR' model in enterprise Change Management?", [
    "A goal-oriented change framework: Awareness of need for change, Desire to participate, Knowledge of how to change, Ability to implement skills, Reinforcement to sustain change",
    "An architectural framework for designing microservices",
    "A financial accounting standard for reporting revenue",
    "A software testing methodology for API endpoints"
  ]),
  makeQ(670, "What is the purpose of a 'Requirements Traceability Matrix' (RTM)?", [
    "A grid mapping high-level business requirements to functional specifications, architecture design components, test cases, and release deliverables to ensure full coverage and zero gaps",
    "A diagram tracking CPU memory allocations during runtime",
    "A financial spreadsheet tracking vendor invoice payments",
    "A list of software bugs sorted by discovery date"
  ]),
  makeQ(671, "What does 'Minimum Viable Product' (MVP) mean in product development?", [
    "The earliest version of a new product with just enough core features to solve key customer problems and gather validated learning with minimal development effort",
    "A prototype containing no functional code",
    "A fully completed enterprise software suite with all roadmap features",
    "A free trial version with limited 7-day access"
  ]),
  makeQ(672, "In business process modeling, what is the difference between 'As-Is' and 'To-Be' process mapping?", [
    "'As-Is' documents the current operational reality and pain points; 'To-Be' designs the future optimized workflow incorporating automation, waste reduction, and technology enhancements",
    "'As-Is' is for hardware while 'To-Be' is for software",
    "'To-Be' is written by external auditors only",
    "'As-Is' cannot contain decision branch points"
  ]),
  makeQ(673, "What is a 'Non-Functional Requirement' (NFR) and which of the following is a classic example?", [
    "Specifies quality attributes, operational constraints, and performance criteria rather than specific user features; Example: 'The system must authenticate users within 300ms under 5,000 concurrent requests'",
    "'The user can click a button to download invoices as PDF'",
    "'The application must send a welcome email after signup'",
    "'The admin can reset passwords from the user table'"
  ]),
  makeQ(674, "In business analytics, what does 'ROI' (Return on Investment) calculate?", [
    "`((Net Financial Benefit from Project - Project Total Cost) / Project Total Cost) * 100`",
    "Total project duration in months divided by team headcount",
    "Annual software subscription fee divided by active users",
    "Gross revenue minus corporate tax rate"
  ]),
  makeQ(675, "What is a 'Business Case' and what core sections must it contain before project approval?", [
    "A formal proposal justifying resource investment, containing Executive Summary, Problem Statement, Strategic Alignment, Cost-Benefit Analysis, Alternative Options, Risk Assessment, and Implementation Roadmap",
    "A list of software bugs found during QA testing",
    "A collection of user interview audio recordings",
    "A technical user manual for client onboarding"
  ]),
  makeQ(676, "What is 'Sprint Velocity' in Agile Scrum?", [
    "The average number of Story Points completed and accepted as 'Done' by the development team within a single sprint iteration, used for future capacity planning",
    "The physical typing speed of software engineers",
    "The time taken to deploy code to production servers",
    "The number of customer support tickets resolved per day"
  ]),
  makeQ(677, "In stakeholder management, how should a Business Analyst handle conflicting requirements from two senior department heads?", [
    "Facilitate a structured alignment workshop, mapping both requirements against organizational strategic goals, financial ROI, and feasibility to reach data-driven consensus with clear escalation protocols",
    "Pick the requirement from the executive with higher seniority without telling the other",
    "Implement both conflicting requirements simultaneously in the same codebase",
    "Ignore both requirements until the next fiscal year"
  ]),
  makeQ(678, "What is the purpose of an 'Impact Analysis' before implementing a change request?", [
    "Evaluates the potential consequences, ripple effects, technical risks, cost increases, and schedule adjustments across all connected systems and business units",
    "Calculates the load testing limits of production servers",
    "Conducts background checks on newly hired developers",
    "Measures customer website click rates"
  ]),
  makeQ(679, "What is 'Value Stream Mapping' (VSM) in Lean business analysis?", [
    "A flowchart methodology that illustrates every step in producing and delivering a product/service, distinguishing Value-Added time from Non-Value-Added waste (delays, handoffs)",
    "A diagram showing real-time stock market fluctuations",
    "A database query optimization technique",
    "A tool for creating website wireframes"
  ]),
  makeQ(680, "What is a 'Product Backlog Refinement' (Grooming) session in Scrum?", [
    "A recurring ceremony where the Product Owner, BA, and Scrum Team review upcoming user stories, clarify acceptance criteria, split large epics, and re-estimate story points",
    "An annual employee performance review meeting",
    "A coding session where developers fix production bugs",
    "A meeting where stakeholders approve the annual budget"
  ]),
  makeQ(681, "What is 'Porter's Five Forces' framework used to assess?", [
    "Industry competitive intensity and market attractiveness: Threat of New Entrants, Bargaining Power of Buyers, Bargaining Power of Suppliers, Threat of Substitutes, and Industry Rivalry",
    "The 5 main software modules in an ERP system",
    "The 5 leadership styles of executive managers",
    "The 5 phases of the waterfall software development lifecycle"
  ]),
  makeQ(682, "What is the 'Definition of Done' (DoD) in Agile delivery?", [
    "A formal shared checklist of criteria (e.g. code reviewed, unit tests passing, QA approved, acceptance criteria met, documentation updated) required before a user story is marked complete",
    "The time when developers clock out at the end of the day",
    "The date when a client signs the annual contract",
    "When a user story is moved into the sprint backlog"
  ]),
  makeQ(683, "What is 'Customer Journey Mapping' and what key components does it capture?", [
    "Visual representation of the end-to-end customer experience across touchpoints, capturing User Goals, Actions, Pain Points, Emotional States, and Opportunity Areas for improvement",
    "GPS tracking of field sales delivery vehicles",
    "A list of website IP addresses visited by users",
    "A network routing diagram for cloud data centers"
  ]),
  makeQ(684, "What is the difference between Functional and Non-Functional testing?", [
    "Functional testing verifies that software features operate according to defined business requirements (e.g. login, payment); Non-Functional testing evaluates performance, security, scalability, and usability",
    "Functional testing is automated while Non-Functional is always manual",
    "Non-Functional testing is only conducted after release",
    "Functional testing does not require test cases"
  ]),
  makeQ(685, "What is a 'Feasibility Study' in business analysis and what are its standard dimensions (TELOS)?", [
    "An assessment of project viability evaluating Technical, Economic (financial), Legal, Operational, and Schedule feasibility before committing budget and resources",
    "A financial audit of previous fiscal year expenditures",
    "A usability test conducted with 5 external users",
    "A benchmark of competitor software response times"
  ]),
  makeQ(686, "In financial modeling, what does 'Break-Even Analysis' determine?", [
    "The exact sales volume / revenue level at which Total Revenue equals Total Costs (Fixed Costs + Variable Costs), resulting in zero net profit or loss",
    "The date when a company runs out of cash reserves",
    "The maximum discount a sales representative can offer",
    "The total compensation budget for all employees"
  ]),
  makeQ(687, "What is an 'Entity-Relationship Diagram' (ERD) and why does a Business Analyst use it?", [
    "A structural data model illustrating business entities (e.g. Customer, Order, Product), their attributes, and cardinality relationships (1:1, 1:N, N:M) to ensure data requirements are unambiguous",
    "A chart showing organizational company hierarchy",
    "A diagram showing network firewall connections",
    "A visual wireframe of a mobile application"
  ]),
  makeQ(688, "What is 'Context Diagram' (Data Flow Diagram - Level 0)?", [
    "A high-level diagram representing the entire system as a single central process, showing external entities (users, external systems) and incoming/outgoing data flows across the boundary",
    "A low-level diagram showing SQL table indices",
    "A UI mockup of the dashboard navigation menu",
    "A flowchart of server CPU instruction execution"
  ]),
  makeQ(689, "In requirements elicitation, what is the 'Observation' (Job Shadowing) technique best suited for?", [
    "Understanding real-world day-to-day workflows, undocumented workarounds, and user frustrations that stakeholders often forget to mention in formal interviews",
    "Calculating exact financial ROI projections",
    "Negotiating software vendor contract pricing",
    "Reviewing backend database source code"
  ]),
  makeQ(690, "What is a 'Business Rules Engine' (BRE) and why are business rules externalized from application code?", [
    "Software system that executes business decision logic (e.g. loan approval eligibility, discount thresholds) independently, allowing business analysts to update rules without redeploying code",
    "A database indexing tool that speeds up search queries",
    "A project management tool for tracking sprint tasks",
    "A load balancer for routing HTTP web traffic"
  ]),
  makeQ(691, "What is 'Benchmarking' in competitive business analysis?", [
    "Comparing an organization's business processes, KPIs, and performance metrics against industry best practices and leading peer organizations to identify improvement opportunities",
    "Measuring the maximum read/write speed of hard drives",
    "Testing how many users can access a website simultaneously",
    "Calculating annual employee tax deductions"
  ]),
  makeQ(692, "What is a 'Risk Register' and what key attributes must be logged for each project risk?", [
    "A structured log capturing Risk Description, Category, Probability (Likelihood), Impact Severity, Risk Score (P x I), Mitigation Strategy, Contingency Plan, and Risk Owner",
    "A list of software passwords and encryption keys",
    "A record of all financial transactions over $10,000",
    "A daily log of team meeting attendance"
  ]),
  makeQ(693, "In project management, what is the 'Triple Constraint' (Project Management Triangle)?", [
    "Scope, Time (Schedule), and Cost (Budget) — changes to one constraint inevitably impact the other two, with Quality as the central balancing factor",
    "Frontend, Backend, and Database technologies",
    "Sales, Marketing, and Operations departments",
    "CEO, CTO, and CFO executive roles"
  ]),
  makeQ(694, "What is the purpose of an 'Epic' in Agile Scrum backlog hierarchy?", [
    "A large body of work that cannot be completed in a single sprint and must be broken down into multiple smaller user stories across several sprints",
    "A critical production bug that requires immediate hotfix",
    "An annual company-wide strategic presentation",
    "A single task assigned to one developer"
  ]),
  makeQ(695, "What is 'Card Sorting' and when is it employed by Business Analysts and UX teams?", [
    "A user research method where participants organize feature labels or content topics into logical categories, used to design intuitive information architectures and navigation menus",
    "A method for estimating story points using playing cards",
    "A financial audit technique for verifying credit card statements",
    "A technique for shuffling database table records"
  ]),
  makeQ(696, "What is 'JAD' (Joint Application Development) workshop?", [
    "An intensive structured facilitation session bringing together business stakeholders, subject matter experts, BAs, and technical architects to rapidly define and agree on system requirements",
    "A Java programming competition for software engineers",
    "An annual vendor contract negotiation meeting",
    "A daily 15-minute standing scrum status update"
  ]),
  makeQ(697, "In Agile product management, what is a 'Spike' story?", [
    "A time-boxed research or technical exploration task aimed at gathering information, resolving unknowns, or validating feasibility before estimating upcoming user stories",
    "A sudden surge in web application user traffic",
    "A critical security vulnerability found in production",
    "A user story that was canceled mid-sprint"
  ]),
  makeQ(698, "What does 'SLA' (Service Level Agreement) vs 'OLA' (Operational Level Agreement) define?", [
    "An SLA defines external performance and uptime commitments agreed between service provider and customer; an OLA defines internal commitments between internal teams to support the SLA",
    "An SLA is for hardware while an OLA is for software",
    "An OLA is a legal contract signed with government regulators",
    "An SLA cannot specify response time thresholds"
  ]),
  makeQ(699, "What is the purpose of a 'Retrospective' ceremony at the end of each Agile sprint?", [
    "Enables the Scrum team to inspect their process, evaluate what went well and what could be improved, and define concrete action items for continuous team improvement",
    "Presents a live product demo to external clients",
    "Conducts individual salary reviews for developers",
    "Calculates corporate quarterly profit margins"
  ]),
  makeQ(700, "What is the fundamental core responsibility of a Business Analyst throughout the software delivery lifecycle?", [
    "Acting as the bridge between business stakeholders and technical engineering teams, translating strategic business objectives into unambiguous, validated, and testable functional solutions",
    "Writing production backend code and executing SQL migrations",
    "Managing physical office facilities and IT hardware inventory",
    "Selling software licenses directly to enterprise corporate clients"
  ])
];

// ==========================================
// 4. UI/UX DESIGNER (50 Extra Questions: 751 - 800)
// ==========================================
const extraUIUX = [
  makeQ(751, "In Design Systems, what is the core structural concept of Brad Frost's 'Atomic Design' methodology?", [
    "Organizes UI components hierarchically into 5 distinct stages: Atoms (basic tags/colors), Molecules (simple combinations), Organisms (complex UI sections), Templates (layout structures), and Pages (concrete populated instances)",
    "Renders UI layouts using 3D nuclear particle physics simulations",
    "Requires every component to be written in WebAssembly",
    "Replaces CSS styles with inline SVG vector elements"
  ]),
  makeQ(752, "In Figma, what is the primary benefit of using 'Auto Layout' combined with 'Component Variants'?", [
    "Enables responsive UI components that automatically adjust padding, spacing, and resizing behavior across viewports, while consolidating multiple interactive states (hover, active, disabled) into single clean assets",
    "Exports designs directly to native iOS Swift code without developers",
    "Generates realistic 3D photorealistic renderings in WebGL",
    "Locks all layers permanently to prevent editing"
  ]),
  makeQ(753, "According to Jakob Nielsen's 10 Usability Heuristics, what does 'Visibility of System Status' dictate?", [
    "The system should always keep users informed about what is going on, through appropriate and timely feedback within reasonable time (e.g. progress bars, loading spinners, state indicators)",
    "All software source code must be public and open-source",
    "The application should never hide the browser navigation bar",
    "Every UI screen must display real-time CPU memory usage"
  ]),
  makeQ(754, "What is 'Fitts's Law' in interaction design and how does it inform mobile UI ergonomics?", [
    "The time required to rapidly move to a target area is a function of the target distance and target size; interactive elements (CTAs) should be larger and placed close to natural thumb reach zones",
    "Users will leave a website if it takes more than 3 seconds to load",
    "Interfaces should not use more than 3 distinct font weights",
    "Designers must always use dark mode background themes"
  ]),
  makeQ(755, "According to 'Hick's Law', what happens to user decision time as the number of choices increases?", [
    "Decision time increases logarithmically with the number and complexity of choices; reducing options or categorizing choices accelerates user decision-making and reduces cognitive fatigue",
    "Decision time decreases because users have more options",
    "Decision time remains strictly constant regardless of choice count",
    "Users will always select the first option on the list"
  ]),
  makeQ(756, "In WCAG 2.2 accessibility standards, what is the minimum required color contrast ratio for normal text at Level AA?", [
    "4.5:1 for normal body text (under 18pt / 24px regular), and 3.0:1 for large text (18pt+ or 14pt bold)",
    "2.0:1 for all text elements",
    "10.0:1 for light themes and 1.5:1 for dark themes",
    "7.0:1 for all text elements regardless of size"
  ]),
  makeQ(757, "What is the '60-30-10 Rule' in UI visual color balancing?", [
    "60% dominant neutral background color, 30% secondary structural/surface color, and 10% accent color reserved for key interactive CTAs and focus elements",
    "60% text content, 30% photography, 10% white space",
    "60px margin, 30px padding, 10px border-radius across all cards",
    "60% mobile traffic, 30% desktop traffic, 10% tablet traffic"
  ]),
  makeQ(758, "In UX Research, what is the difference between Qualitative and Quantitative research methods?", [
    "Qualitative research explores 'Why' and 'How' through contextual user interviews and observations (open-ended insights); Quantitative research measures 'How many' and 'How much' through metrics, surveys, and analytics",
    "Qualitative research only uses surveys while Quantitative uses interviews",
    "Quantitative research is conducted exclusively before product design begins",
    "Qualitative research requires at least 1,000 participants"
  ]),
  makeQ(759, "What is 'Cognitive Load Theory' in UX design and how do designers minimize 'Extraneous Cognitive Load'?", [
    "The total mental effort required to process information; minimized by eliminating visual clutter, maintaining consistent navigation paradigms, and utilizing recognizable UI design patterns",
    "The time taken by the browser rendering engine to parse CSS files",
    "The maximum number of tabs a user can keep open in Chrome",
    "The memory consumption of animated GIF files"
  ]),
  makeQ(760, "What is the Gestalt Principle of 'Proximity' in UI layout design?", [
    "Visual elements placed close to each other are perceived as belonging together or sharing a common function compared to elements placed farther apart",
    "Objects of the same color are always perceived as interactive buttons",
    "Users read UI screens strictly from bottom-left to top-right",
    "All cards must have identical drop shadow blurs"
  ]),
  makeQ(761, "In Information Architecture, what is the difference between 'Broad and Shallow' vs 'Deep and Narrow' navigation hierarchies?", [
    "Broad & Shallow offers many top-level categories with few sub-levels (fast scanning, fewer clicks); Deep & Narrow offers few top-level items but many nested sub-menus (requires multiple clicks to reach content)",
    "Deep & Narrow is for mobile apps while Broad & Shallow is for smartwatches",
    "Broad & Shallow navigation cannot be used with search bars",
    "Deep & Narrow navigation eliminates the need for breadcrumbs"
  ]),
  makeQ(762, "What is a 'Design Token' in modern cross-platform design systems (e.g. Style Dictionary, Figma Tokens)?", [
    "A platform-agnostic key-value pair storing atomic design decisions (colors, typography, spacing, elevations) that compiles automatically into CSS variables, iOS Swift, and Android XML",
    "A cryptocurrency token used to purchase Figma software plugins",
    "A digital certificate validating user login sessions",
    "A unique SVG icon identifier in font awesome"
  ]),
  makeQ(763, "In typography hierarchy, what is a 'Modular Type Scale' (e.g. Major Third 1.25, Perfect Fourth 1.333)?", [
    "A systematic mathematical ratio used to generate harmonious, proportional font sizes across headings (H1, H2, H3), body text, and captions from a base font size",
    "A fixed set of 12 random font pixel sizes chosen by intuition",
    "A rule requiring all headings to use Comic Sans font",
    "A CSS property that forces text to wrap into three equal columns"
  ]),
  makeQ(764, "What is 'Heuristic Evaluation' in UX methodology and how does it differ from User Testing?", [
    "An expert usability audit where UX specialists evaluate an interface against established usability principles (e.g. Nielsen's heuristics); User Testing observes actual end-users performing real tasks",
    "Heuristic evaluation requires 50 real customers",
    "User testing is only performed by backend developers",
    "Heuristic evaluation evaluates backend SQL query performance"
  ]),
  makeQ(765, "What is the 'Miller's Law' (7 +/- 2) and how does it relate to UI chunking?", [
    "The average human working memory can hold approximately 7 (plus or minus 2) items at a time; chunking complex data (e.g. phone numbers, multi-step forms) into smaller groups enhances recall",
    "Web pages must have exactly 7 navigation links in the header",
    "Form inputs should never exceed 7 characters",
    "A user will click a maximum of 7 times before closing a website"
  ]),
  makeQ(766, "What is an 'Affordance' vs a 'Signifier' in Don Norman's Design of Everyday Things?", [
    "An Affordance is the actual possible physical/digital action an object allows (e.g. a button can be clicked); a Signifier is the perceptible signal indicating where/how that action occurs (e.g. button styling, label)",
    "An Affordance is a software bug while a Signifier is an error popup",
    "A Signifier is for mobile screens while an Affordance is for print",
    "They are identical terms with no distinction"
  ]),
  makeQ(767, "In responsive web design, what is the difference between 'Fluid Layouts' and 'Adaptive Layouts'?", [
    "Fluid layouts scale continuously and proportionally across any screen width using percentages/flexbox/grid; Adaptive layouts snap to specific predefined device breakpoints using media queries",
    "Fluid layouts are only for mobile while Adaptive layouts are for TV",
    "Adaptive layouts do not use CSS code",
    "Fluid layouts cannot display images"
  ]),
  makeQ(768, "What is the Gestalt Principle of 'Common Region'?", [
    "Elements enclosed within the same clearly defined visual boundary (such as a card container or background fill) are perceived as belonging to a unified functional group",
    "All buttons in a region must be colored green",
    "Users perceive text in their native language faster",
    "Interactive elements must always be circular"
  ]),
  makeQ(769, "In form UX design, why are 'Single-Column Forms' consistently superior to multi-column forms for standard mobile/web inputs?", [
    "Maintains a clear, predictable downward visual scan path (Z-pattern avoided), reducing visual hesitation, missed fields, and form completion drop-off rates",
    "Single-column forms take up 100% of browser memory",
    "Multi-column forms cannot be submitted over HTTPS",
    "Single-column forms disable field validation checks"
  ]),
  makeQ(770, "What is 'Progressive Disclosure' in user interface design?", [
    "Sequencing information and complex actions across multiple steps, showing users only the essentials initially and revealing advanced options upon request to prevent information overload",
    "Displaying all advanced settings on the first screen immediately",
    "Progressively blurring screen contents when user is idle",
    "Loading page images using low-resolution placeholders"
  ]),
  makeQ(771, "In micro-interaction design, what are the four structural stages defined by Dan Saffer?", [
    "Trigger (initiates interaction) -> Rules (determines what happens) -> Feedback (lets user know what happened) -> Loops & Modes (meta-rules/state persistence)",
    "Design -> Prototype -> Test -> Deploy",
    "Click -> Wait -> Reload -> Error",
    "Input -> Database -> Compute -> Output"
  ]),
  makeQ(772, "What is the 'Serial Position Effect' (Primacy and Recency Effect) in UI navigation?", [
    "Users have a propensity to remember best the first item (Primacy) and the last item (Recency) in a list or navigation bar, making the edges ideal for critical actions (e.g. Home and CTA)",
    "Users only look at items in the exact dead center of the screen",
    "Serial numbers should be placed at the top-left of every card",
    "Alphabetical sorting is the only valid way to display menus"
  ]),
  makeQ(773, "What is a 'System Usability Scale' (SUS) score and what does a score of 80 indicate?", [
    "A 10-item Likert scale questionnaire measuring perceived system usability; a score of 80 is well above the industry benchmark average (68) and indicates Excellent/A-grade usability",
    "Indicates that 80% of software unit tests passed",
    "Indicates the application consumes 80MB of RAM",
    "Indicates the software is 80% complete"
  ]),
  makeQ(774, "In UX writing, what is 'Microcopy' and where does it have the highest measurable impact on conversion?", [
    "Short, purposeful snippets of text on buttons, form placeholder hints, error state recovery messages, and security reassurances directly guiding user action and reducing friction",
    "Legal terms of service documents in footer links",
    "5,000-word corporate blog articles",
    "Internal code comments written by frontend developers"
  ]),
  makeQ(775, "What is an 'Empathy Map' in UX persona development?", [
    "A collaborative visualization mapping what a specific user archetype Says, Thinks, Does, and Feels (along with Pains and Gains) to synthesize qualitative research insights",
    "A chart displaying user heart rates during usability tests",
    "A geographical map showing where website visitors live",
    "A network routing diagram for user web traffic"
  ]),
  makeQ(776, "What is the Gestalt Principle of 'Closure'?", [
    "The human visual brain automatically fills in missing parts of an incomplete shape or icon to perceive a complete, recognizable object (e.g. loading icon, dotted outlines)",
    "When a user closes the browser window after completing a purchase",
    "Modal dialogs must have an 'X' button in the top right corner",
    "All form fields must be closed with a semicolon"
  ]),
  makeQ(777, "In accessibility, what is the purpose of the `aria-label` attribute on an icon button (e.g. `<button aria-label=\"Close modal\"><svg>...</svg></button>`)?", [
    "Provides an accessible text alternative for screen readers so visually impaired users know the exact functional purpose of an icon that has no visible text node",
    "Changes the color of the SVG icon to blue",
    "Prevents users from clicking the button multiple times",
    "Animates the icon when hovered"
  ]),
  makeQ(778, "What is 'A/B Testing' (Split Testing) in product optimization and how is statistical significance determined?", [
    "Comparing two versions of a webpage/app (A vs B) against live user traffic to measure conversion differences, requiring adequate sample size and p-value < 0.05 to confirm real impact",
    "Showing design mockups to 2 internal company managers",
    "Testing an application on both Android and iOS devices",
    "Running automated unit tests in development and production"
  ]),
  makeQ(779, "In mobile design, what is the 'Thumb Zone' mapped by Steven Hoober?", [
    "The natural physical arc reachable by a user's thumb when holding a mobile smartphone with one hand; easy zone is bottom-center, while hard-to-reach zone is top-left/top-right",
    "The fingerprint sensor area on the back of Android phones",
    "The area reserved exclusively for keyboard typing",
    "The notification tray at the top of the mobile screen"
  ]),
  makeQ(780, "What is a 'Zero State' (Empty State) in UI design and what should it contain?", [
    "The screen state when no user data exists yet (e.g. new account, empty cart, 0 search results); should provide friendly educational illustration, concise explanation, and a clear CTA to get started",
    "A blank white screen with no elements",
    "An error 404 page stating server failure",
    "A screen that automatically logs out the user"
  ]),
  makeQ(781, "What is the difference between 'Skeuomorphism', 'Flat Design', and 'Neumorphism'?", [
    "Skeuomorphism mimics realistic physical textures/shadows; Flat Design uses minimalist 2D colors and clean typography; Neumorphism uses soft, subtle dual inner/outer shadows to create extruded soft-plastic surfaces",
    "Flat design cannot be used on mobile devices",
    "Skeuomorphism was invented for dark mode themes",
    "Neumorphism eliminates all drop shadows"
  ]),
  makeQ(782, "In typography, what is 'Leading' (Line-Height) and what is the optimal ratio for body readability?", [
    "The vertical space between lines of text; optimal body text leading is typically 140% to 160% (1.4 - 1.6x) of the font size for effortless horizontal reading rhythm",
    "The horizontal space between individual character pairs (Kerning)",
    "The size of the first capital letter in a paragraph",
    "The boldness weight of heading typography"
  ]),
  makeQ(783, "What is the 'Doherty Threshold' in human-computer interaction?", [
    "Productivity and user engagement soar when a computer and user interact at a pace where system response time is under 400 milliseconds (0.4s)",
    "A web page should not contain more than 400 lines of CSS",
    "Users will not scroll past 400 pixels on mobile viewports",
    "A design prototype must be completed within 400 hours"
  ]),
  makeQ(784, "In navigation design, what is the purpose of 'Breadcrumbs'?", [
    "A secondary navigation aid showing the user's current location within a hierarchical website structure, enabling one-click traversal back to parent category levels",
    "Temporary cache files stored in the user's browser",
    "Visual indicators showing battery level on mobile devices",
    "A technique for highlighting search keywords in text"
  ]),
  makeQ(785, "What is the 'Kano Model' in product feature prioritization?", [
    "Classifies product features based on customer emotional satisfaction: Must-Be (Basic expectations), Performance (More is better), Delighters/Attractive (Unexpected wow-factors), and Indifferent",
    "Calculates the financial development cost of mobile apps",
    "Tracks the daily active user count across platforms",
    "A framework for evaluating color contrast ratios"
  ]),
  makeQ(786, "In UI interaction, what is 'Skeleton Loading' (Content Placeholders) and why is it superior to spinning loaders?", [
    "Displays animated gray wireframe approximations of content layouts while data loads, reducing perceived wait time and preventing abrupt layout shifts (CLS) when content renders",
    "Freezes the user screen until all images are 100% downloaded",
    "Reduces the bandwidth consumption of backend REST APIs",
    "Displays dark mode themes automatically on low battery"
  ]),
  makeQ(787, "What is 'Card Sorting' (Open vs Closed) in Information Architecture testing?", [
    "In Open Card Sorting, participants create their own category names for cards; in Closed Card Sorting, participants sort cards into predetermined, fixed category buckets",
    "Open is for digital designs while Closed is for print designs",
    "Closed sorting can only be performed by developers",
    "Open sorting requires participants to sign an NDA"
  ]),
  makeQ(788, "In visual design, what does 'Visual Hierarchy' achieve?", [
    "Guides the viewer's eye through the layout in a deliberate order of importance using size contrast, color weight, typography scale, white space, and positional alignment",
    "Ensures all UI elements are exactly the same size",
    "Places all images at the very bottom of the page",
    "Eliminates all text below the fold"
  ]),
  makeQ(789, "What is the 'Halo Effect' in user perception of interface design?", [
    "The cognitive bias where users perceive aesthetically pleasing, beautiful visual designs as more usable, trustworthy, and functional, even when minor usability flaws exist",
    "A glowing circular drop shadow around interactive buttons",
    "When a user gets confused by modal dialog popups",
    "The feeling of eye fatigue after using screens in the dark"
  ]),
  makeQ(790, "What is a 'Tree Testing' study in Information Architecture research?", [
    "A quantitative usability test that evaluates how easily users can find items in a simplified, text-only tree structure without visual design distractions, validating category labels",
    "Testing website performance on solar-powered servers",
    "Visualizing CSS component dependency trees",
    "A design sprint held outdoors in nature"
  ]),
  makeQ(791, "In UI components, what is the difference between a 'Modal Dialog' and a 'Toast Notification'?", [
    "A Modal is an intrusive overlay that interrupts workflow, requires immediate user action, and disables background interaction; a Toast is a temporary, non-blocking notification that auto-dismisses",
    "A Toast can only display error messages",
    "A Modal cannot contain buttons",
    "Modals are only supported on desktop browsers"
  ]),
  makeQ(792, "What is the 'Zeigarnik Effect' and how is it leveraged in gamified UI onboarding?", [
    "People remember uncompleted or interrupted tasks better than completed ones; visual progress bars (e.g. 'Profile 75% Complete') motivate users to finish remaining setup tasks",
    "Users forget passwords after 24 hours of inactivity",
    "Animated buttons receive 50% fewer clicks",
    "Users prefer reading text in all-capital letters"
  ]),
  makeQ(793, "In accessibility, what is 'Focus Management' during keyboard navigation (Tab key)?", [
    "Ensuring interactive elements have a clear, visible focus indicator (ring/outline), maintain a logical reading order (DOM sequence), and trap focus inside active modal dialogs",
    "Hiding the mouse cursor when user starts typing",
    "Centering the web page automatically in the viewport",
    "Disabling keyboard shortcuts on mobile devices"
  ]),
  makeQ(794, "What is the difference between a 'Wireframe', a 'Mockup', and a 'Prototype'?", [
    "Wireframe = low-fidelity skeletal layout focusing on structure; Mockup = high-fidelity static visual design showcasing colors/typography; Prototype = interactive, clickable simulation demonstrating flows",
    "A Mockup contains real backend production code",
    "A Wireframe is only created after the product is deployed",
    "A Prototype cannot be tested with real users"
  ]),
  makeQ(795, "What is 'Dark UX' (Deceptive / Dark Patterns) and which of the following is a classic example?", [
    "User interfaces designed to trick users into doing things they might not otherwise do; Example: 'Confirmshaming' (emotional guilt-tripping text on decline buttons like 'No thanks, I hate saving money')",
    "Designing websites using black background dark themes",
    "Disabling website cookies when requested by users",
    "Using high contrast typography for accessibility"
  ]),
  makeQ(796, "In mobile app navigation, when is a 'Bottom Navigation Bar' preferred over a 'Hamburger Menu'?", [
    "For top-level core destinations (3 to 5 items) that users switch between frequently, providing immediate visual visibility and effortless one-thumb reachability without hidden clicks",
    "When an app has more than 20 navigation categories",
    "When designing for desktop widescreen monitors",
    "When an app has no interactive buttons"
  ]),
  makeQ(797, "What is 'Contextual Inquiry' in field user research?", [
    "A research method where the researcher observes and interviews users in their actual natural working environment while they perform real daily tasks",
    "Sending an automated email survey to 10,000 users",
    "Analyzing website server error logs in Datadog",
    "Conducting an online focus group in a conference room"
  ]),
  makeQ(798, "What does 'Affordance' refer to in touch screen mobile UI design?", [
    "Visual cues (such as drop shadows, bevels, pill shapes, or card elevations) that signal an element is physically interactive and tappable by finger touch",
    "The battery consumption of screen brightness",
    "The price of downloading a mobile application from App Store",
    "The resolution pixel density of Retina displays"
  ]),
  makeQ(799, "What is 'Card Sorting' (Hybrid) methodology?", [
    "A user research method combining open and closed sorting, where users sort cards into established predefined categories but are also allowed to create new custom categories if needed",
    "Shuffling cards randomly between physical and digital formats",
    "Sorting credit cards by reward point percentage",
    "A game played during design sprint retrospectives"
  ]),
  makeQ(800, "What is the primary ultimate goal of user-centered UI/UX design in enterprise software?", [
    "To create intuitive, accessible, and delightful digital experiences that solve real user problems with minimal cognitive friction while driving sustainable business outcomes",
    "To write complex CSS animations that impress other designers",
    "To make every web application look identical to Apple iOS",
    "To eliminate the need for software engineering teams"
  ])
];

// ==========================================
// 5. BUSINESS DEVELOPMENT EXECUTIVE (50 Extra Questions: 851 - 900)
// ==========================================
const extraBDE = [
  makeQ(851, "In B2B enterprise sales qualification, what does the 'BANT' framework stand for?", [
    "Budget (financial capacity), Authority (decision-making power), Need (business pain point), Timeline (purchase timeframe)",
    "Brand, Awareness, Network, Target",
    "Business, Analytics, Negotiation, Terms",
    "Billing, Automation, Net Revenue, Tracking"
  ]),
  makeQ(852, "What is the 'MEDDIC' enterprise sales qualification methodology and what does the 'E' stand for?", [
    "Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion; 'Economic Buyer' is the individual with ultimate profit-and-loss authority to release funds",
    "Enterprise Value, Executive Sponsor, Earnings Per Share",
    "Email Campaign, Engagement Rate, Evaluation Period",
    "Escalation Protocol, Employee Headcount, Expansion Rate"
  ]),
  makeQ(853, "In outbound B2B prospecting, what is an optimal 'Cold Email Outreach Cadence' strategy?", [
    "Multi-touch, multi-channel sequence (Email, LinkedIn touch, Phone call) spaced across 12-18 business days with personalized value propositions, case studies, and concise friction-free CTAs",
    "Sending 5 identical cold emails every day to the CEO",
    "Sending a single 2,000-word email with 15 PDF attachments",
    "Cold calling prospects at midnight on weekends"
  ]),
  makeQ(854, "What is 'SPIN Selling' and what are the 4 questioning stages?", [
    "Situation questions (context) -> Problem questions (dissatisfaction) -> Implication questions (consequences of inaction) -> Need-Payoff questions (value of solution)",
    "Sales, Pipeline, Incentives, Negotiation",
    "Search, Prospect, Interview, Network",
    "Source, Pitch, Invoice, Nurture"
  ]),
  makeQ(855, "In enterprise sales pipeline management, what is 'Sales Velocity' and its formula?", [
    "`(Number of Opportunities * Average Deal Size ($) * Win Rate (%)) / Sales Cycle Length (Days)` — measuring how much revenue moves through the pipeline per unit of time",
    "Total Cold Calls Made multiplied by Total Emails Sent",
    "Monthly Revenue divided by Number of Sales Representatives",
    "Total Marketing Budget divided by Customer Acquisition Cost"
  ]),
  makeQ(856, "When handling the common prospect objection 'Your price is too high', what is the most effective consultative response?", [
    "Acknowledge their budget concern, explore the specific financial impact and cost of their current unresolved problem, and demonstrate measurable ROI and payback timeline of the solution",
    "Immediately offer a 50% discount without asking questions",
    "Argue with the prospect that their company has plenty of money",
    "Hang up the call and delete the prospect from the CRM"
  ]),
  makeQ(857, "What is an 'Ideal Customer Profile' (ICP) in B2B business development?", [
    "A detailed definition of the specific type of company (industry, revenue, employee size, tech stack, geography, pain points) that gains the highest value from your product and generates the highest LTV",
    "A list of celebrity influencers who endorse software products",
    "A resume profile of an experienced sales executive",
    "A customer who purchases once and never contacts support"
  ]),
  makeQ(858, "What is 'Account-Based Marketing' (ABM) in high-value enterprise sales?", [
    "A strategic B2B approach where sales and marketing teams coordinate highly personalized, bespoke campaigns targeting a specific list of high-value key accounts rather than broad generic lead casting",
    "Automating social media posts to 1 million followers",
    "Sending cold text messages to personal cell phones",
    "Running TV commercials during national sporting events"
  ]),
  makeQ(859, "In contract negotiations, what does 'BATNA' stand for?", [
    "Best Alternative To a Negotiated Agreement — the most advantageous course of action a party can take if negotiations fail and no deal is reached",
    "Business Asset Total Net Allocation",
    "Budget Approval Timeline and Network Access",
    "Bilateral Agreement Terms and Notice of Action"
  ]),
  makeQ(860, "What is the 'Zone of Possible Agreement' (ZOPA) in deal negotiations?", [
    "The overlapping price range between the buyer's maximum willingness to pay (reservation price) and the seller's minimum acceptable price where an agreement can be mutually beneficial",
    "The geographical region where sales tax is zero",
    "The time zone where the prospect's headquarters is located",
    "The conference room where negotiations take place"
  ]),
  makeQ(861, "What is the difference between an Inbound Lead and an Outbound Lead?", [
    "Inbound leads initiate contact by discovering your content, website, or trial (higher intent, faster conversion); Outbound leads are identified and proactively prospected by sales teams (targeted, scalable)",
    "Inbound leads never convert into paying customers",
    "Outbound leads are generated exclusively by social media ads",
    "Inbound leads require cold calling at least 10 times"
  ]),
  makeQ(862, "In SaaS sales, what is 'Annual Contract Value' (ACV) vs 'Total Contract Value' (TCV)?", [
    "ACV measures the normalized annual revenue generated by a contract; TCV measures the total cumulative value of the entire contract duration including multi-year commitments and onboarding fees",
    "ACV is for monthly subscriptions while TCV is for free trials",
    "TCV excludes software licensing fees",
    "ACV is only calculated after the contract expires"
  ]),
  makeQ(863, "What is a 'Sales Champion' in enterprise deal navigation?", [
    "An internal advocate within the prospect organization who has personal access to the Economic Buyer, actively promotes your solution, and helps navigate internal political roadblocks",
    "The sales representative who won the annual quota award",
    "An external marketing consultant hired to review proposals",
    "A competitor who publicly praises your software"
  ]),
  makeQ(864, "When a prospect says 'We are currently happy with our existing vendor', how should a top BDE respond?", [
    "Acknowledge the existing relationship positively, ask about any specific gaps or roadmap features their vendor struggles with, and offer a low-friction value comparison or case study benchmark",
    "Tell the prospect that their current vendor is terrible and going bankrupt",
    "Offer to pay off their contract with the existing vendor",
    "Immediately close the lead and mark as lost"
  ]),
  makeQ(865, "What is 'Pipeline Coverage Ratio' in quarterly revenue forecasting?", [
    "Total value of active qualified pipeline opportunities divided by the sales quota target; a healthy ratio is typically 3x to 4x coverage to account for normal deal slippage and win rates",
    "Total sales team salaries divided by quarterly revenue",
    "Number of closed deals divided by total website visitors",
    "Marketing ad spend divided by total cold emails sent"
  ]),
  makeQ(866, "What is the purpose of a 'Discovery Call' in consultative sales?", [
    "An interactive diagnostic conversation aimed at uncovering the prospect's business goals, current workflow bottlenecks, financial implications, and qualification fit before pitching product features",
    "A 45-minute lecture where the sales rep reads all product slide decks",
    "A technical screen where the prospect takes a coding test",
    "A legal meeting where contract terms are signed"
  ]),
  makeQ(867, "In outbound email copywriting, why should email subject lines be concise, lowercase, and conversational (e.g. 'quick question regarding hiring')?", [
    "Mimics authentic internal peer-to-peer emails, achieving higher open rates and avoiding automated spam/promotions tab classification compared to hype-filled salesy headlines",
    "Caps-lock subject lines generate 100% reply rates",
    "Spam filters only look at email attachment file sizes",
    "Corporate executives only read emails with emojis in the subject"
  ]),
  makeQ(868, "What is 'Customer Acquisition Cost Payback Period' and what is a healthy SaaS benchmark?", [
    "The number of months required for a customer to generate enough gross margin to pay back the CAC incurred to acquire them; healthy benchmark is 12 months or less",
    "The time taken to close a sales deal from first cold call",
    "The duration of a customer's annual contract",
    "The time taken for a customer support ticket to be resolved"
  ]),
  makeQ(869, "What is the 'Challenger Sale' model approach in B2B sales?", [
    "Sales reps teach prospects new perspectives on their business problems, tailor communication to specific stakeholder value drivers, and assertively take control of the commercial conversation",
    "Reps aggressively argue with prospects on pricing",
    "Reps offer lowest possible prices to undercut all competitors",
    "Reps wait passively for prospects to submit RFPs"
  ]),
  makeQ(870, "In CRM management (e.g. HubSpot, Salesforce), what does 'Lead Status: MQL vs SQL' signify?", [
    "MQL (Marketing Qualified Lead) has engaged with marketing content (downloaded whitepaper, attended webinar); SQL (Sales Qualified Lead) has been vetted by sales and has verified budget, need, and buying intent",
    "MQL is a paying customer while SQL is a churned customer",
    "SQL can only be contacted via SMS text message",
    "MQL requires immediate legal contract drafting"
  ]),
  makeQ(871, "What is a 'Value Proposition' and how is it clearly structured?", [
    "A clear statement explaining how your product solves customer problems, delivers specific quantifiable benefits (time saved, revenue generated, costs reduced), and differentiates from alternatives",
    "A list of 50 technical software feature bullet points",
    "The corporate mission statement of the company founders",
    "The hourly consulting rate of senior software engineers"
  ]),
  makeQ(872, "In SaaS metrics, what does 'Net Revenue Retention' (NRR) measure and why is >100% ideal?", [
    "`((Starting ARR + Expansion - Contraction - Churn) / Starting ARR) * 100` — an NRR > 100% (e.g. 115%) means the business grows revenue from existing customers alone without acquiring new logos",
    "Total revenue minus marketing expenditures",
    "The percentage of sales reps who achieved their quota",
    "The average discount percentage across all closed deals"
  ]),
  makeQ(873, "What is the 'Feel, Felt, Found' objection handling technique?", [
    "Empathize with the prospect ('I understand why you feel that way'), normalize the concern ('Other CTOs we work with felt the same initially'), and share the resolution ('What they found after deploying was...')",
    "A technique for negotiating lower vendor software prices",
    "A method for cold calling prospects on LinkedIn",
    "A protocol for handling software customer refund requests"
  ]),
  makeQ(874, "What is a 'Proof of Concept' (POC) / Pilot and what is critical for its success?", [
    "A time-boxed trial deployment evaluating specific agreed-upon success criteria (KPIs) with clear commitment: if success metrics are met, the commercial contract automatically executes",
    "A free unlimited license given to prospects indefinitely",
    "A marketing demo with pre-recorded video footage",
    "An unpaid consulting engagement with no defined end date"
  ]),
  makeQ(875, "What does 'Gatekeeper' mean in B2B cold calling and how do you navigate past them professionally?", [
    "An administrative assistant, receptionist, or coordinator who screens incoming calls; navigate by being polite, transparent, professional, and mentioning relevant context or peer referrals",
    "A firewall setting that blocks outbound marketing emails",
    "A legal contract clause preventing software resale",
    "A security guard at corporate office buildings"
  ]),
  makeQ(876, "In B2B sales cycles, what is an 'RFP' (Request for Proposal)?", [
    "A formal document issued by an enterprise buyer detailing project requirements and inviting qualified vendors to submit competitive bids, technical architectures, and pricing proposals",
    "A receipt for paid software subscription renewals",
    "A legal cease-and-desist letter sent to competitors",
    "A performance review document for sales executives"
  ]),
  makeQ(877, "What is 'Social Selling' on platforms like LinkedIn and how should it be executed?", [
    "Building professional credibility by sharing valuable industry insights, engaging with prospect content thoughtfully, and starting relationship-first conversations before pitching",
    "Sending 100 automated spam connection requests daily with generic sales pitches",
    "Liking every single post made by company employees",
    "Posting non-work personal vacation photos daily"
  ]),
  makeQ(878, "What is 'Expansion Revenue' (Upselling vs Cross-Selling)?", [
    "Upselling upgrades a customer to a higher-tier plan or more user seats; Cross-Selling sells complementary secondary products or add-on modules to an existing customer base",
    "Acquiring new customers in different international countries",
    "Increasing marketing ad spend across Google Ads",
    "Selling company office furniture to reduce operational expenses"
  ]),
  makeQ(879, "In cold email outreach, what is 'Email Deliverability' and how is it protected?", [
    "The ability of emails to reach the recipient's primary inbox rather than spam folders; protected via proper SPF, DKIM, DMARC records, domain warmup, clean email lists, and low bounce rates (<2%)",
    "The speed of internet service provider fiber cables",
    "The font style chosen for email body text",
    "The number of emojis included in email attachments"
  ]),
  makeQ(880, "When a prospect says 'Send me some information and follow up in 6 months', what is the root cause and best response?", [
    "The prospect sees no urgent pain or immediate priority; qualify gently by asking what strategic initiative will change in 6 months, offering a 2-minute insight to see if immediate discussion is justified",
    "Immediately schedule a calendar invite for 6 months later without asking questions",
    "Send a 100-page generic brochure and never contact them again",
    "Argue with the prospect that they are making a mistake"
  ]),
  makeQ(881, "What is a 'Buying Committee' in enterprise B2B sales?", [
    "A group of 6 to 10 stakeholders from different departments (IT, Finance, Legal, Security, End-Users, Executive) involved in evaluating and approving high-value enterprise software purchases",
    "A group of customers who test beta software features",
    "A board of directors approving quarterly dividend payouts",
    "A sales team responsible for writing cold email scripts"
  ]),
  makeQ(882, "In contract negotiation, why is 'Trading Concessions' essential rather than giving unilateral discounts?", [
    "Preserves value and negotiation power: whenever giving a price concession, always ask for something in return (e.g. multi-year commitment, upfront annual payment, case study rights, faster signing date)",
    "Forces the prospect to pay double if they delay signing",
    "Ensures all negotiations are completed in under 5 minutes",
    "Eliminates the need for legal team contract reviews"
  ]),
  makeQ(883, "What does 'Sales Qualified Opportunity' (SQO) mean?", [
    "A vetted deal where the prospect has confirmed pain, verified budget, decision maker involvement, and an agreed timeline with an active upcoming demo or proposal presentation",
    "A contact who downloaded an ebook from your website",
    "An unverified email address found on LinkedIn",
    "A cold call that ended in voicemail"
  ]),
  makeQ(884, "What is 'Churn Prevention' and what is the leading indicator of impending customer churn?", [
    "Proactive measures to retain accounts; leading indicators include sharp declines in daily active product logins, unengaged executive sponsors, and unresolved critical support tickets",
    "Sending holiday greeting cards to company founders",
    "Increasing annual software subscription prices by 20%",
    "Disabling customer support chat widgets"
  ]),
  makeQ(885, "What is a 'Mutual Action Plan' (MAP) / Joint Evaluation Plan in enterprise sales?", [
    "A shared collaborative timeline document co-created with the prospect outlining key milestones, stakeholder responsibilities, security reviews, legal approvals, and target go-live dates",
    "A legal nondisclosure agreement signed before sales calls",
    "A commission structure document for sales representatives",
    "A marketing editorial calendar for social media posts"
  ]),
  makeQ(886, "In SDR / BDE prospecting, what is 'Account Tiering' (Tier 1, Tier 2, Tier 3)?", [
    "Categorizing target accounts by strategic value: Tier 1 receives bespoke 1-to-1 hyper-personalized outreach; Tier 2 receives segmented persona outreach; Tier 3 receives scaled programmatic outreach",
    "Sorting prospects by their alphabetical company name",
    "Ranking sales representatives by quarterly closed revenue",
    "Pricing software packages based on customer credit scores"
  ]),
  makeQ(887, "What is a 'Cold Call Hook' and what should occur in the first 15 seconds of a phone conversation?", [
    "Acknowledge the interruption professionally, state the reason for the call concisely, reference a relevant industry peer or pain point, and ask for permission to have a brief 2-minute conversation",
    "Launch into a 10-minute uninterrupted product pitch",
    "Pretend to be an old personal friend of the executive",
    "Ask for the prospect's credit card number immediately"
  ]),
  makeQ(888, "What does 'LTV to CAC Ratio' signify and what is considered an elite benchmark for venture-backed SaaS?", [
    "Compares Customer Lifetime Value to Customer Acquisition Cost; a 3:1 ratio is healthy, while 4:1 to 5:1 indicates outstanding capital efficiency and scalable go-to-market engine",
    "1:1 is the ideal ratio for all software companies",
    "Measures the ratio of sales reps to software engineers",
    "Calculates total company debt relative to cash reserves"
  ]),
  makeQ(889, "In consultative selling, what is an 'Implication Question'?", [
    "A question exploring the negative consequences, operational costs, or downstream business risks of leaving a problem unresolved (e.g. 'If your team continues losing 10 hours/week on manual data entry, how does that impact your Q4 product launch?')",
    "Asking what the prospect's office address is",
    "Asking what company logo color they prefer",
    "Asking if they have a company credit card"
  ]),
  makeQ(890, "What is 'Lead Routing' in automated CRM systems?", [
    "Rules-based distribution of incoming leads to sales reps based on criteria such as territory geography, company size, industry domain, or round-robin availability",
    "Deleting leads that do not open emails within 1 hour",
    "Routing customer support calls to overseas call centers",
    "Exporting CRM contact lists to CSV spreadsheets"
  ]),
  makeQ(891, "What is an 'Executive Briefing' in enterprise sales?", [
    "A high-level strategic alignment meeting bringing together C-level executives from both buyer and seller organizations to discuss long-term partnership vision and strategic value",
    "A 5-minute daily standing meeting for sales reps",
    "A performance review meeting with HR recruiters",
    "A technical training session for junior developers"
  ]),
  makeQ(892, "When a prospect states 'We don't have budget for this right now', what is the best diagnostic follow-up?", [
    "Gently ask how budget is typically allocated for high-ROI initiatives, and whether the cost of their current problem outweighs the cost of solving it in the upcoming budget cycle",
    "Insist that they must borrow money to purchase immediately",
    "Tell the prospect that your software is free for 5 years",
    "End the conversation immediately without responding"
  ]),
  makeQ(893, "What is a 'Case Study' in sales enablement and what is the proven structural formula?", [
    "Challenge (the customer's specific problem) -> Solution (how your product was deployed) -> Results (quantifiable metrics: 'reduced latency by 45%, saved $200k annually')",
    "A 50-page theoretical academic whitepaper",
    "A list of customer email addresses and phone numbers",
    "A collection of positive Twitter screenshot reviews"
  ]),
  makeQ(894, "What is 'Pipeline Hygiene' in sales operations?", [
    "Regularly updating deal stages, removing stale/unresponsive opportunities, ensuring accurate close dates, and maintaining clean contact data to preserve forecast accuracy",
    "Washing hands before picking up the sales phone",
    "Deleting all closed-won deals from the CRM database",
    "Resetting sales quotas to zero every month"
  ]),
  makeQ(895, "What is a 'Call-to-Action' (CTA) in cold email and why is a 'Low-Friction CTA' (e.g. 'Open to learning more?') superior to 'Can we book 30 minutes on your calendar?'", [
    "Reduces psychological friction and commitment anxiety, inviting a simple conversation interest rather than demanding valuable calendar time from busy executives",
    "Demanding 60 minutes creates higher urgency",
    "Low-friction CTAs are only used for consumer e-commerce",
    "Executives ignore emails that do not contain Calendly links"
  ]),
  makeQ(896, "What is 'Buyer Persona' vs 'Ideal Customer Profile'?", [
    "ICP defines the target organization/company (industry, size, revenue); Buyer Persona defines the specific individual decision-maker (job title, goals, KPIs, pain points, communication style)",
    "Buyer Persona is for B2B while ICP is only for B2C",
    "They are identical terms with no distinction",
    "ICP is created by developers while Buyer Persona is created by HR"
  ]),
  makeQ(897, "What is 'Channel Sales' vs 'Direct Sales'?", [
    "Direct Sales sells directly to end customers through an internal sales team; Channel Sales sells through third-party partners (resellers, MSPs, system integrators, distributors)",
    "Channel sales only sells hardware equipment",
    "Direct sales does not require contracts",
    "Channel sales is illegal in enterprise software"
  ]),
  makeQ(898, "In objection handling, what is 'Pre-empting Objections'?", [
    "Proactively addressing predictable concerns (e.g. implementation time, data security, change management) during the presentation before the prospect even brings them up",
    "Refusing to answer questions during a sales demo",
    "Forcing prospects to sign contracts before seeing the software",
    "Interrupting the prospect whenever they start speaking"
  ]),
  makeQ(899, "What is a 'Tier 1 Multi-Threading Strategy' in enterprise accounts?", [
    "Building simultaneous relationships with multiple key stakeholders across departments (Economic Buyer, Technical Champion, End-User, Security Officer) so a deal doesn't collapse if one contact leaves",
    "Using multiple computer monitors during cold calls",
    "Sending 10 cold emails simultaneously to the same person",
    "Opening multiple browser tabs during a product demo"
  ]),
  makeQ(900, "What is the ultimate core mission of an exceptional Business Development Executive (BDE)?", [
    "To identify, qualify, and initiate meaningful commercial relationships with target organizations, guiding prospects through value discovery and creating predictable, high-margin revenue pipeline",
    "To send millions of unverified spam emails to random people",
    "To write technical software documentation and fix bugs",
    "To manage company office supplies and hardware equipment"
  ])
];

console.log('Extra AIML count:', extraAIML.length);
console.log('Extra DataAnalyst count:', extraDataAnalyst.length);
console.log('Extra BusinessAnalyst count:', extraBusinessAnalyst.length);
console.log('Extra UIUX count:', extraUIUX.length);
console.log('Extra BDE count:', extraBDE.length);

module.exports = {
  extraAIML,
  extraDataAnalyst,
  extraBusinessAnalyst,
  extraUIUX,
  extraBDE
};
