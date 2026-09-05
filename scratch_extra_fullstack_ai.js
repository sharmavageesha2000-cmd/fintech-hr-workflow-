const fs = require('fs');
const path = require('path');

function makeQ(id, question, options, correctIndex = 0, explanation = '') {
  return {
    id,
    question,
    options,
    correctIndex,
    explanation: explanation || `Option ${String.fromCharCode(65 + correctIndex)} provides the verified industry solution for this scenario.`
  };
}

// 3. Extra 50 Full Stack AI Engineer (IDs 351 - 400)
const extraFullStackAI = [
  makeQ(351, "In Retrieval-Augmented Generation (RAG), what is 'Hypothetical Document Embeddings' (HyDE)?", [
    "Using an LLM to generate a hypothetical answer document first, embedding that hypothetical document, and using its vector to retrieve real relevant context documents",
    "Encrypting vector database embeddings using AES-256",
    "Generating synthetic training datasets for image diffusion models",
    "Running embeddings on client mobile devices using WebAssembly"
  ]),
  makeQ(352, "What is the primary advantage of 'Context Window Compression' (e.g. LLMLingua) before passing context to an LLM?", [
    "Reduces prompt token count by 30-70% while preserving semantic fidelity, lowering LLM API latency and inference costs",
    "Translates prompt text into binary assembly language",
    "Encrypts user prompts in transit",
    "Increases the model's parameter count automatically"
  ]),
  makeQ(353, "In LangChain / LlamaIndex, what is the role of a 'Re-ranker' model (e.g. Cohere Rerank, BGE-Reranker)?", [
    "Takes the top-K retrieved vector search candidates and applies a cross-encoder model to re-score them based on exact query relevance before prompt injection",
    "Sorts database records by creation timestamp",
    "Deletes duplicate documents from the vector database",
    "Converts vector embeddings into PDF documents"
  ]),
  makeQ(354, "How does Server-Sent Events (SSE) enable real-time token streaming in FastAPI / Next.js AI apps?", [
    "Maintains a persistent unidirectional HTTP connection from server to client with `text/event-stream` MIME type, streaming tokens chunk-by-chunk as the LLM generates them",
    "Uses WebRTC peer-to-peer audio channels",
    "Polls the backend REST API every 100 milliseconds",
    "Downloads full MP4 video files"
  ]),
  makeQ(355, "What is 'Semantic Chunking' in vector data indexing compared to fixed-size character chunking?", [
    "Splits text based on semantic boundaries (measuring cosine distance between consecutive sentence embeddings) rather than arbitrary character/token counts",
    "Chunks text into exactly 256 characters regardless of words",
    "Removes all punctuation from documents",
    "Compresses chunks using Gzip before saving"
  ]),
  makeQ(356, "In LangChain, what is the difference between an Agent and a Chain?", [
    "A Chain executes a deterministic, hardcoded sequence of steps; an Agent uses an LLM as a reasoning engine to dynamically decide which tools to call and in what order",
    "Chains only work with Python while Agents only work with TypeScript",
    "Agents cannot make API calls",
    "Chains run in background threads while Agents run in the UI"
  ]),
  makeQ(357, "What is the function of the 'Temperature' parameter in LLM API calls?", [
    "Controls the randomness of token generation: 0.0 makes outputs deterministic and focused; higher values (e.g. 0.8) increase creativity and variability",
    "Measures the temperature of the GPU hardware in Celsius",
    "Sets the maximum time limit for API responses in seconds",
    "Controls the font size of the generated response"
  ]),
  makeQ(358, "In vector search, what does 'HNSW' (Hierarchical Navigable Small World) provide?", [
    "A graph-based approximate nearest neighbor (ANN) indexing algorithm offering logarithmic search complexity and high recall speed for multi-dimensional vectors",
    "A relational database normalization technique",
    "An encryption algorithm for storing passwords",
    "A protocol for training neural networks on multi-GPU clusters"
  ]),
  makeQ(359, "What is 'Prompt Injection' and how do you protect against it in production AI applications?", [
    "An attack where untrusted user input overrides the system prompt instructions; mitigated via delimiter isolation, input sanitization, Guardrails (e.g. NeMo), and dedicated classifier models",
    "A method for accelerating LLM inference speed",
    "Injecting CSS styles into React components",
    "An automated unit testing framework for LLMs"
  ]),
  makeQ(360, "In Gemini API / OpenAI API, what does 'Function Calling / Tool Use' allow the LLM to do?", [
    "Outputs structured JSON arguments matching a developer-provided schema, allowing your code to execute external tools (e.g. database queries, weather APIs) and feed results back to the model",
    "Executes arbitrary Python code directly inside the Google data center without authorization",
    "Modifies the weights of the foundational model in real time",
    "Bypasses token billing limits"
  ]),
  makeQ(361, "What does the 'Top-P' (Nucleus Sampling) parameter do in language models?", [
    "Restricts token selection to the smallest set of tokens whose cumulative probability exceeds the threshold P, balancing diversity while cutting off the low-probability tail",
    "Selects only the top P percentage of training dataset records",
    "Limits memory usage to P gigabytes",
    "Sets the learning rate of the optimizer"
  ]),
  makeQ(362, "In vector databases like Pinecone or Qdrant, what is 'Metadata Filtering'?", [
    "Filters search results by scalar metadata attributes (e.g. `user_id == '123' AND role == 'admin'`) alongside vector similarity calculation",
    "Deletes old vectors from disk after 30 days",
    "Compresses vector embeddings using PCA",
    "Translates metadata fields into English"
  ]),
  makeQ(363, "What is 'Self-Querying' in modern RAG architectures?", [
    "An LLM parses a natural language query into both a semantic search query string AND a structured metadata filter before querying the vector store",
    "An LLM answering queries without consulting external data",
    "A recursive loop where an LLM calls itself indefinitely",
    "A method for evaluating model accuracy using self-consistency"
  ]),
  makeQ(364, "In building production LLM apps, what is the purpose of 'Guardrails' (e.g. Llama Guard, NeMo Guardrails)?", [
    "Programmable safety layers that validate inputs and outputs against toxicity, PII leaks, hallucination thresholds, and topic deviations before reaching users",
    "Firewalls that block DDoS attacks on web servers",
    "Unit test suites for TypeScript code",
    "CSS layouts that prevent UI elements from overflowing"
  ]),
  makeQ(365, "What is the difference between Dense Retrieval and Sparse Retrieval (BM25)?", [
    "Dense retrieval uses deep neural embeddings to capture semantic intent; Sparse retrieval matches exact keywords and term frequencies (BM25/TF-IDF)",
    "Dense retrieval is only for images while Sparse is for text",
    "Sparse retrieval requires a GPU while Dense runs on CPU",
    "Dense retrieval has zero memory footprint"
  ]),
  makeQ(366, "What is 'Hybrid Search' in vector databases?", [
    "Combines dense semantic vector search with sparse keyword matching (BM25) using Reciprocal Rank Fusion (RRF) for superior retrieval accuracy",
    "Searching both local disk and Google Search simultaneously",
    "Running queries in both SQL and MongoDB",
    "Searching across both English and Spanish text"
  ]),
  makeQ(367, "In LLM evaluation, what is the 'RAGAS' framework used for?", [
    "Evaluating RAG pipelines across key metrics: Faithfulness, Answer Relevance, Context Precision, and Context Recall without human ground truth labels",
    "Compressing LLM weights using 4-bit quantization",
    "Deploying FastAPI servers to AWS Lambda",
    "Generating synthetic training images"
  ]),
  makeQ(368, "What is 'Multi-Query Expansion' in RAG pipelines?", [
    "Using an LLM to generate multiple distinct variations/perspectives of a user question, retrieving documents for each, and deduplicating results to overcome phrasing bias",
    "Querying multiple relational databases in parallel",
    "Expanding SQL queries with wildcard asterisks",
    "Splitting database transactions across multiple shards"
  ]),
  makeQ(369, "In FastAPI, what is the advantage of using `AsyncSession` with SQLAlchemy 2.0 for AI backend services?", [
    "Non-blocking asynchronous database I/O, allowing the FastAPI server to handle thousands of concurrent LLM streaming requests without exhausting thread pools",
    "Automatically generates vector embeddings for all database rows",
    "Converts relational tables into JSON files on disk",
    "Encrypts database queries with SSL"
  ]),
  makeQ(370, "What is 'Chain of Thought' (CoT) prompting?", [
    "Instructing the LLM to 'think step by step' and articulate its intermediate reasoning before providing the final answer, significantly improving complex problem-solving accuracy",
    "Chaining multiple API endpoints in a workflow",
    "Passing user messages through a series of microservices",
    "Running multiple LLMs in parallel on different threads"
  ]),
  makeQ(371, "In vector similarity calculation, what is the difference between Cosine Similarity and Dot Product?", [
    "Cosine similarity normalizes vectors to unit length measuring the angle between them; Dot product also accounts for vector magnitude",
    "Dot product only works with 2D vectors",
    "Cosine similarity is only used for image search",
    "Dot product produces values between -1 and 1 only"
  ]),
  makeQ(372, "What is 'Parent Document Retrieval' in RAG systems?", [
    "Indexing small chunk embeddings for accurate semantic search, but returning the larger parent document / surrounding context to the LLM for richer generation context",
    "Querying a parent database server from a child replica",
    "Inheriting database schemas from a base class",
    "Retrieving documents created before a specific parent timestamp"
  ]),
  makeQ(373, "What is the purpose of 'Few-Shot Prompting'?", [
    "Providing a few high-quality input-output demonstration examples inside the prompt to guide the LLM on the desired format, tone, and reasoning style",
    "Limiting API requests to a maximum of 3 per user",
    "Training a model with only 5 epochs",
    "Executing an LLM query across 3 separate GPU nodes"
  ]),
  makeQ(374, "In building conversational AI apps, what is 'Conversational Memory Window' (e.g. `ConversationBufferWindowMemory`)?", [
    "Maintains a rolling list of only the most recent N interactions (e.g. last 5 turns) to prevent prompt token bloat while keeping recent conversation context",
    "Saves entire chat logs to a local SQLite database",
    "Stores user audio recordings in browser cache",
    "Limits user messages to 100 characters each"
  ]),
  makeQ(375, "What is 'Model Quantization' (e.g. GGUF, AWQ, GPTQ 4-bit) in AI engineering?", [
    "Compressing model weights from FP32/FP16 precision down to 4-bit or 8-bit integers, drastically reducing GPU VRAM requirements and accelerating inference speed with minimal loss in quality",
    "Quantifying the financial cost of running an LLM API",
    "Counting the number of training tokens in a dataset",
    "Dividing neural network layers into equal chunks"
  ]),
  makeQ(376, "What is the 'ReAct' (Reasoning + Acting) prompting framework?", [
    "A paradigm where an LLM interleaves reasoning traces ('Thought'), action execution ('Action' / tool calls), and environment feedback ('Observation') to solve multi-step problems",
    "Building React.js user interfaces with AI code generators",
    "A reactive state management library for Python",
    "Handling user click reactions on web pages"
  ]),
  makeQ(377, "In vector embeddings, what is 'Embedding Dimensionality' (e.g. 1536 for OpenAI, 768 for Gemini)?", [
    "The length of the dense floating-point numerical vector representing the semantic features of the input text",
    "The maximum number of words allowed in a document",
    "The number of database tables in a vector database",
    "The screen resolution required to display vector visualizations"
  ]),
  makeQ(378, "How do you mitigate 'Hallucination' in production RAG enterprise systems?", [
    "Grounding generation strictly in retrieved reference documents, setting low temperature (0.0), adding strict 'Answer only using provided context' system prompts, and citation verification",
    "Increasing the model temperature to 1.5",
    "Removing system prompts entirely",
    "Using smaller embedding vector dimensions"
  ]),
  makeQ(379, "What is the role of 'Pydantic' in FastAPI and AI structured outputs?", [
    "Enforces runtime data validation, type hints, serialization, and JSON Schema generation for API request/response payloads and LLM tool outputs",
    "Manages database connection pools for PostgreSQL",
    "Compiles Python code into C++ binaries",
    "Renders HTML templates on the server"
  ]),
  makeQ(380, "What is 'GraphRAG' in modern enterprise retrieval architectures?", [
    "Extracting a Knowledge Graph (entities, relationships, claims) from text and combining graph traversal with vector search for comprehensive thematic synthesis across large corpora",
    "Plotting vector search latency on a 2D line graph",
    "Using GraphQL instead of REST APIs for retrieval",
    "Rendering 3D graph diagrams in WebGL"
  ]),
  makeQ(381, "In LangChain / AI Agents, what is 'Tool Output Reflection'?", [
    "The agent evaluates the tool execution result against its objective, self-correcting its query if the tool returned an error or unhelpful data before generating the final response",
    "Reflecting UI components in dark mode",
    "Mirroring database records across cloud regions",
    "Caching tool outputs in Redis"
  ]),
  makeQ(382, "What is 'Fine-Tuning' vs 'RAG' and when should you choose RAG?", [
    "Fine-tuning adapts model behavior/style/domain syntax; RAG dynamically injects factual, real-time, private, or frequently updating enterprise knowledge without retraining costs",
    "Fine-tuning is always free while RAG requires training supercomputers",
    "RAG modifies the neural network weights while Fine-Tuning does not",
    "Fine-tuning is only for computer vision while RAG is for text"
  ]),
  makeQ(383, "What does the `tiktoken` library do in AI engineering?", [
    "Fast BPE (Byte Pair Encoding) tokenizer for calculating exact token counts and chunking text to prevent exceeding LLM context window limits",
    "Monitors user typing speed in chat UIs",
    "Authenticates JWT tokens in Node.js",
    "Measures network latency in milliseconds"
  ]),
  makeQ(384, "In deploying AI web applications, what is the advantage of using 'Edge Functions' (e.g. Cloudflare Workers, Vercel Edge)?", [
    "Executes lightweight LLM proxy requests, token streaming, and authentication at distributed edge data centers closest to the end user with sub-10ms cold start times",
    "Runs full 70B parameter LLM models inside client browsers",
    "Replaces all cloud database systems",
    "Bypasses SSL encryption for speed"
  ]),
  makeQ(385, "What is 'Context Window' in Large Language Models?", [
    "The maximum total number of tokens (input prompt + output generation + system instructions) that the model can process in a single inference call",
    "The browser window size required to run the chat UI",
    "The number of simultaneous users supported by the server",
    "The time window during which API calls are free"
  ]),
  makeQ(386, "In LangChain, what is an 'Output Parser' (e.g. `PydanticOutputParser`, `JsonOutputParser`)?", [
    "Takes the raw text output from an LLM and parses/validates it into structured data formats (JSON, Pydantic objects, lists), retrying if format violations occur",
    "Compresses LLM output into ZIP files",
    "Translates LLM text into spoken audio",
    "Formats HTML tags for browser rendering"
  ]),
  makeQ(387, "What is 'Sentence Window Retrieval' in RAG pipelines?", [
    "Embedding single sentences for precise semantic matching, but expanding the retrieved context window to include preceding and following sentences before LLM prompt injection",
    "Splitting paragraphs into exactly 10 words",
    "Highlighting search terms in yellow on the UI",
    "Displaying chat messages in a popup window"
  ]),
  makeQ(388, "In building Full Stack AI apps, what is the role of Vector Similarity Metrics like 'Euclidean Distance' (L2)?", [
    "Measures the straight-line geometric distance between two points in multi-dimensional space; smaller values indicate closer semantic similarity",
    "Calculates the geographical distance between server data centers",
    "Measures the word count difference between documents",
    "Calculates the file size difference on disk"
  ]),
  makeQ(389, "What is 'Corrective RAG' (CRAG)?", [
    "A self-evaluating RAG framework where a retrieval evaluator model grades retrieved documents, falling back to web search if retrieved internal documents are irrelevant or insufficient",
    "Automatically correcting spelling errors in user prompts",
    "Deleting corrupted records from a database",
    "A Python compiler for vector search algorithms"
  ]),
  makeQ(390, "In AI API cost optimization, what is 'Semantic Caching' (e.g. GPTCache)?", [
    "Stores prior LLM queries and responses in a vector store; if a new query has high semantic similarity (e.g. >0.95) to a cached query, returns the cached answer instantly without calling the LLM",
    "Compressing user prompt strings with Gzip",
    "Caching static images on a CDN",
    "Storing user session tokens in cookies"
  ]),
  makeQ(391, "What is 'Self-RAG' in modern LLM architectures?", [
    "A framework where the model dynamically generates self-reflection tokens (`[Retrieve]`, `[IsRel]`, `[IsSup]`) to decide when to retrieve context, evaluate relevance, and verify factual support",
    "Training a personal LLM from scratch on a laptop",
    "Running RAG pipelines on an offline server",
    "An automated unit test runner for Python"
  ]),
  makeQ(392, "In FastAPI, how do you handle asynchronous WebSocket connections for bi-directional voice/text streaming?", [
    "Using `@app.websocket('/ws')` with `async def websocket_endpoint(websocket: WebSocket)` and `await websocket.receive_text()` / `await websocket.send_text()`",
    "Using standard HTTP GET endpoints with short polling",
    "Writing to a local text file on disk",
    "Using jQuery AJAX requests in a loop"
  ]),
  makeQ(393, "What is 'Multi-Modal AI' in modern full-stack development?", [
    "Models capable of processing, understanding, and generating across multiple data modalities simultaneously (text, images, audio, video, PDF documents)",
    "Running applications on multiple monitors",
    "Supporting multiple language translations in UI",
    "An app that works on both iOS and Android"
  ]),
  makeQ(394, "What is 'DSPy' in modern AI engineering?", [
    "A framework for programmatically composing and optimizing LLM prompts and pipelines through algorithmic compiler optimization rather than manual prompt tweaking",
    "A Python library for audio signal processing",
    "A deployment server for Docker containers",
    "A database query optimization tool for MySQL"
  ]),
  makeQ(395, "In vector search systems, what causes 'Vector Drift' over time?", [
    "When new data embedded with updated models or evolving language semantics is mixed with older vector representations in the same index without re-indexing",
    "Physical hardware vibration in server racks",
    "Network packets shifting during transmission",
    "Changes in the client browser screen resolution"
  ]),
  makeQ(396, "What is the purpose of 'Streaming Responses' (`ReadableStream` / SSE) in AI user interfaces?", [
    "Improves perceived latency (Time to First Token) from 8-15 seconds down to under 500ms by rendering words progressively as they are generated by the model",
    "Reduces the cost of the LLM API call",
    "Encrypts the generated output text",
    "Prevents mobile browsers from going to sleep"
  ]),
  makeQ(397, "What is the function of the `System Prompt` in Large Language Models?", [
    "Provides high-priority persistent guidelines defining the model's persona, operational boundaries, formatting requirements, and anti-hallucination guardrails",
    "Configures the Linux operating system on the server",
    "Installs required Python packages",
    "Sets the user's password in the database"
  ]),
  makeQ(398, "In AI evaluation, what is 'LLM-as-a-Judge'?", [
    "Using a powerful frontier model (e.g. Gemini 1.5 Pro / GPT-4) guided by a rigorous rubric to evaluate the quality, accuracy, and adherence of candidate model responses",
    "Automated legal software for courtrooms",
    "A tool that detects copyrighted code",
    "A Python linter for PEP8 compliance"
  ]),
  makeQ(399, "What is 'Context Injection' in AI application development?", [
    "Dynamically injecting retrieved documents, user profile attributes, or conversation history into the LLM prompt template prior to sending the inference request",
    "A security vulnerability in SQL databases",
    "Injecting CSS styles into a React component",
    "Passing environment variables to a Docker container"
  ]),
  makeQ(400, "What is the complete end-to-end architecture of an Enterprise Full Stack AI Application?", [
    "React frontend $\\rightarrow$ FastAPI streaming gateway $\\rightarrow$ LangChain/LlamaIndex orchestrator $\\rightarrow$ Hybrid Vector Search (Pinecone/PostgreSQL pgvector) $\\rightarrow$ Gemini/LLM inference $\\rightarrow$ Evaluation & telemetry",
    "Single HTML file connected directly to a SQL database without backend",
    "Static WordPress website with an iframe",
    "Python desktop script using Tkinter"
  ])
];

console.log('Extra Full Stack AI questions created:', extraFullStackAI.length);

module.exports = { extraFullStackAI };
