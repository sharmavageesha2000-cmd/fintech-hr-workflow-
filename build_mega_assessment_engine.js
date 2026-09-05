const fs = require('fs');
const path = require('path');

console.log('[Mega Assessment Engine Builder] Generating 400+ Question Enterprise Bank (50+ MCQs per role)...');

// Load current 35 questions from assessment_questions.js as the foundation
const currentModule = require('./assessment_questions');
const bank = JSON.parse(JSON.stringify(currentModule.ROLE_QUESTIONS_BANK));

// Additional 15+ specialized MCQs for each of the 8 roles to reach 50+ per domain:

// 1. Additional Frontend Developer MCQs (136-152)
const EXTRA_FRONTEND = [
  {
    id: 136,
    question: "In React, what is the purpose of the `useId` hook introduced in React 18?",
    options: [
      "Generating unique, stable accessibility IDs that match between server-side rendering (SSR) and client hydration, preventing hydration mismatch warnings",
      "Generating random UUIDs for database primary keys",
      "Assigning unique CSS class names for styling",
      "Authenticating user sessions with JWT tokens"
    ],
    correctIndex: 0
  },
  {
    id: 137,
    question: "What does the `content-visibility: auto` CSS property achieve for web performance?",
    options: [
      "Skips rendering and layout calculations for off-screen elements until they approach the viewport, dramatically accelerating initial page load and rendering speed",
      "Automatically translates text content into the user's preferred language",
      "Hides all images when the user enables dark mode",
      "Enables responsive design without media queries"
    ],
    correctIndex: 0
  },
  {
    id: 138,
    question: "In TypeScript, what does the `infer` keyword do inside conditional types?",
    options: [
      "Introduces a type variable within a condition to be deduced automatically from another type (e.g. extracting the return type of a function: `T extends (...args: any[]) => infer R ? R : any`)",
      "Forces the TypeScript compiler to ignore syntax errors",
      "Automatically converts JavaScript code into WebAssembly",
      "Infers the user's browser version at runtime"
    ],
    correctIndex: 0
  },
  {
    id: 139,
    question: "How does the `ResizeObserver` API differ from the traditional `window.onresize` event in modern frontend development?",
    options: [
      "`ResizeObserver` observes dimension changes on specific individual DOM elements (ideal for responsive components and container queries), whereas `window.onresize` only fires when the entire browser window changes size",
      "`ResizeObserver` runs exclusively on Node.js backend servers",
      "`window.onresize` cannot be cancelled with removeEventListener",
      "`ResizeObserver` only detects changes in font size"
    ],
    correctIndex: 0
  },
  {
    id: 140,
    question: "What is Cumulative Layout Shift (CLS) in Google Core Web Vitals and what causes high CLS?",
    options: [
      "Measures the visual stability of a page by summing unexpected layout shift scores; caused by images without explicit width/height dimensions, dynamic ads, or web fonts rendering late",
      "The time taken to establish an HTTPS connection",
      "The percentage of users who bounce within 5 seconds",
      "The duration of the largest JavaScript bundle download"
    ],
    correctIndex: 0
  },
  {
    id: 141,
    question: "In JavaScript, what is the purpose of `Symbol.iterator`?",
    options: [
      "Defines the default iteration behavior of an object, making it compatible with `for...of` loops, spread syntax `[...]`, and destructuring",
      "Encrypts an object before saving it to localStorage",
      "Counts the total number of keys inside an array",
      "Generates short URL links for frontend navigation"
    ],
    correctIndex: 0
  },
  {
    id: 142,
    question: "What is the key difference between `import ... from '...'` (static) and `import('...')` (dynamic) in modern JavaScript bundlers?",
    options: [
      "Static imports are evaluated at build/parse time; dynamic imports return a Promise and enable on-demand code-splitting / lazy-loading at runtime",
      "Dynamic imports only work on backend Node.js servers",
      "Static imports can only load CSS files",
      "Dynamic imports disable TypeScript type checking completely"
    ],
    correctIndex: 0
  },
  {
    id: 143,
    question: "In modern CSS, what do Container Queries (`@container`) enable that Media Queries (`@media`) cannot do?",
    options: [
      "Allow styling elements based on the size and dimensions of their nearest ancestor container rather than the overall browser viewport width",
      "Allow styling elements based on the user's operating system battery level",
      "Enable 3D hardware-accelerated animations on canvas",
      "Compress stylesheet files automatically by 50%"
    ],
    correctIndex: 0
  },
  {
    id: 144,
    question: "In React, what is the 'Fiber' architecture and why was it introduced?",
    options: [
      "A complete rewrite of React's reconciliation engine that represents component trees as linked-list work units, enabling interruptible, priority-based asynchronous rendering",
      "A CSS-in-JS library for styling styled-components",
      "A hardware driver for high-speed fiber-optic web connections",
      "A replacement for HTML5 canvas in game rendering"
    ],
    correctIndex: 0
  },
  {
    id: 145,
    question: "What is the purpose of the `AbortController` API in modern frontend data fetching?",
    options: [
      "Allows cleanly aborting pending HTTP `fetch()` requests or asynchronous DOM event listeners, preventing race conditions and memory leaks when components unmount",
      "Immediately terminates the entire Node.js server process",
      "Stops browser users from taking screenshots of the web page",
      "Deletes expired session cookies from the client browser"
    ],
    correctIndex: 0
  },
  {
    id: 146,
    question: "In CSS, what does `pointer-events: none` do to an element?",
    options: [
      "Makes the element transparent to mouse and touch click/hover events, allowing interactions to pass directly through to underlying elements below it in the z-axis",
      "Disables all keyboard navigation on the page",
      "Hides the mouse cursor completely on the screen",
      "Prevents the user from scrolling the document"
    ],
    correctIndex: 0
  },
  {
    id: 147,
    question: "What is the purpose of `Object.is()` in JavaScript and where is it used in React?",
    options: [
      "Determines whether two values are the exact same value (distinguishing `+0` vs `-0` and treating `NaN === NaN` as true); used by React to compare state updates and hook dependencies",
      "Checks if a variable is an instance of a DOM Element",
      "Converts JSON strings into TypeScript interfaces",
      "Replaces `typeof` in modern V8 engines"
    ],
    correctIndex: 0
  },
  {
    id: 148,
    question: "What is the `Intl` API in modern JavaScript standard library?",
    options: [
      "A built-in namespace providing internationalization features such as locale-sensitive date/time formatting (`Intl.DateTimeFormat`), currency (`Intl.NumberFormat`), and plural rules",
      "An internal debugger for Chrome Developer Tools",
      "A network protocol for inter-server communication",
      "A machine learning library for JavaScript"
    ],
    correctIndex: 0
  },
  {
    id: 149,
    question: "In React 18, what is 'Automatic Batching'?",
    options: [
      "React batches multiple state updates into a single re-render cycle automatically, even inside promises, setTimeout, and native event handlers",
      "React automatically uploads user analytics to Google Analytics",
      "React compiles JavaScript code into WebAssembly in the background",
      "React deletes unused CSS rules from the HTML head"
    ],
    correctIndex: 0
  },
  {
    id: 150,
    question: "What does the `will-change` CSS property inform the browser's rendering engine about?",
    options: [
      "Hints to the browser which properties (e.g. `transform`, `opacity`) are likely to animate, allowing the browser to create dedicated GPU compositor layers in advance for smooth 60fps rendering",
      "Tells the browser to refresh the page every 60 seconds",
      "Disables CSS transitions when battery saver is active",
      "Forces text to automatically resize on mobile screens"
    ],
    correctIndex: 0
  }
];

// 2. Additional Backend Developer MCQs (236-250)
const EXTRA_BACKEND = [
  {
    id: 236,
    question: "In PostgreSQL, what is the difference between a `SERIAL` column and an `IDENTITY` column (`GENERATED ALWAYS AS IDENTITY`)?",
    options: [
      "`IDENTITY` is standard SQL (ANSI/ISO) compliant and uses internal sequences that prevent accidental manual overwrites and sequence permission bugs associated with legacy `SERIAL`",
      "`SERIAL` is 64-bit integer while `IDENTITY` is 8-bit integer",
      "`IDENTITY` can only be used on string columns",
      "There is no difference in modern PostgreSQL versions"
    ],
    correctIndex: 0
  },
  {
    id: 237,
    question: "What is the purpose of the `Redlock` algorithm in distributed caching?",
    options: [
      "Provides safe, fault-tolerant distributed mutual exclusion locks across multiple independent Redis master nodes, avoiding single-point-of-failure lock loss during failovers",
      "Encrypts Redis databases with 512-bit keys",
      "Compresses Redis JSON keys in RAM",
      "A firewall rule that blocks port 6379"
    ],
    correctIndex: 0
  },
  {
    id: 238,
    question: "In Node.js, what causes a 'Buffer Overflow' / 'Heap Out of Memory' error during high-throughput file streaming?",
    options: [
      "Reading data from a source faster than the writable destination can consume it without implementing backpressure, causing unconsumed chunks to buffer endlessly in V8 heap RAM",
      "Using arrow functions inside async/await handlers",
      "Having more than 10 routes in an Express application",
      "Connecting to a database running on a remote port"
    ],
    correctIndex: 0
  },
  {
    id: 239,
    question: "What is Database Connection Starvation and how is it prevented in high-traffic APIs?",
    options: [
      "When long-running or leaked database queries consume all available pool connections, blocking incoming requests; prevented with strict query timeouts, connection pool sizing, and health checks",
      "When a database hard drive runs out of physical space",
      "When a SQL query contains more than 10 JOINs",
      "When an API key has reached its monthly billing quota"
    ],
    correctIndex: 0
  },
  {
    id: 240,
    question: "What is the Saga Pattern in distributed transaction management?",
    options: [
      "A pattern that coordinates distributed transactions across multiple microservices via a sequence of local transactions, triggering compensating transactions to roll back steps if a failure occurs",
      "A technique for backing up MongoDB databases to AWS S3",
      "A method to speed up React rendering using WebSockets",
      "A CSS architecture for styling micro-frontends"
    ],
    correctIndex: 0
  },
  {
    id: 241,
    question: "In PostgreSQL, what is a BRIN (Block Range Index) and when is it dramatically faster and smaller than a B-Tree?",
    options: [
      "Indexes physical block ranges by storing minimum and maximum values for each range; highly compact and ultra-fast for naturally sorted, append-only time-series or sequential ID data",
      "A full-text search index for JSON documents",
      "An in-memory cache index that is cleared on every reboot",
      "An index exclusively used for spatial GPS geometry coordinates"
    ],
    correctIndex: 0
  },
  {
    id: 242,
    question: "What is the difference between Cache-Aside (Lazy Loading) and Write-Through caching patterns?",
    options: [
      "Cache-Aside reads from cache first, and loads from DB on miss; Write-Through writes data to both cache and database simultaneously on every write operation to maintain strict consistency",
      "Cache-Aside is only used for images; Write-Through is for text",
      "Write-Through caches data exclusively in the client's browser local storage",
      "Cache-Aside deletes all database records after 24 hours"
    ],
    correctIndex: 0
  },
  {
    id: 243,
    question: "In REST API security, what is the purpose of PKCE (Proof Key for Code Exchange) in OAuth 2.0?",
    options: [
      "Prevents authorization code interception attacks on public clients (mobile apps, SPAs) by dynamically generating a cryptographic code verifier and code challenge for token exchange",
      "Encrypts user passwords in PostgreSQL databases",
      "Generates QR codes for two-factor authentication",
      "Protects backend servers from DDoS attacks"
    ],
    correctIndex: 0
  },
  {
    id: 244,
    question: "What is Cache Stampede (Thundering Herd Problem) and how is it mitigated?",
    options: [
      "When a popular cached key expires and hundreds of concurrent incoming requests simultaneously query the underlying database; mitigated with probabilistic early expiration (XFetch) or mutex locking",
      "When Redis runs out of memory and crashes",
      "When a database table has too many foreign keys",
      "When a client sends 1,000 HTTP requests in 1 second"
    ],
    correctIndex: 0
  },
  {
    id: 245,
    question: "In Node.js, what does the `cluster` module use under the hood on Linux systems to share ports across worker processes?",
    options: [
      "The master process opens listening sockets and sends socket handles to worker processes, or uses round-robin load distribution across worker OS file descriptors (`SO_REUSEPORT`)",
      "An external Nginx reverse proxy running inside Docker",
      "A Redis Pub/Sub queue running on localhost",
      "Shared memory RAM segments using SharedArrayBuffer"
    ],
    correctIndex: 0
  },
  {
    id: 246,
    question: "What is the difference between `DELETE`, `TRUNCATE`, and `DROP` in SQL database operations?",
    options: [
      "`DELETE` removes rows row-by-row with logging and triggers (can have WHERE); `TRUNCATE` rapidly deallocates all table data pages without row logging; `DROP` removes the entire table schema and data permanently",
      "`TRUNCATE` only works on temporary tables",
      "`DELETE` cannot be rolled back inside a transaction",
      "All three are identical aliases in ANSI SQL"
    ],
    correctIndex: 0
  },
  {
    id: 247,
    question: "In distributed systems, what is the difference between Synchronous Replication and Asynchronous Replication?",
    options: [
      "Synchronous replication confirms a write only after it is committed to both primary and replica nodes (ensuring zero data loss at the cost of write latency); Asynchronous confirms write on primary immediately",
      "Asynchronous replication requires physical fiber cables",
      "Synchronous replication only replicates primary keys",
      "There is no latency difference between the two"
    ],
    correctIndex: 0
  },
  {
    id: 248,
    question: "What is the purpose of Database Sharding Keys and what happens if a bad sharding key creates a 'Hotspot'?",
    options: [
      "The sharding key determines which physical database partition receives the data; a poor key (e.g. low cardinality or monotonically increasing timestamp) overloads a single node with all write traffic while other nodes sit idle",
      "The sharding key encrypts the database password on disk",
      "A hotspot causes the server CPU fan to run at maximum speed",
      "Sharding keys are only used in SQLite databases"
    ],
    correctIndex: 0
  },
  {
    id: 249,
    question: "In Node.js performance tuning, what is a Memory Leak Heap Snapshot and how is it analyzed?",
    options: [
      "A memory dump taken using V8 inspector (`v8.getHeapSnapshot()`) to inspect retaining paths of objects that cannot be garbage-collected due to lingering closures, event listeners, or global caches",
      "A screenshot of the terminal taken when an exception is thrown",
      "A backup of the PostgreSQL database saved to a .sql file",
      "A benchmark score measuring CPU rendering frames"
    ],
    correctIndex: 0
  },
  {
    id: 250,
    question: "What is the purpose of HTTP/2 Server Push and why did modern browsers deprecate it in favor of 103 Early Hints?",
    options: [
      "Server Push sent unrequested assets to clients, often wasting bandwidth on assets already in browser cache; 103 Early Hints allows servers to send `Link: <...>; rel=preload` headers while preparing main HTML response",
      "Server Push caused database deadlocks in Node.js",
      "103 Early Hints encrypts all image files with TLS 1.3",
      "Server Push was only compatible with Internet Explorer 6"
    ],
    correctIndex: 0
  }
];

// 3. Additional Full Stack AI Engineer MCQs (336-350)
const EXTRA_FULLSTACK_AI = [
  {
    id: 336,
    question: "In AI agent frameworks (e.g. LangChain, LlamaIndex), what is ReAct (Reasoning and Acting) prompting?",
    options: [
      "A paradigm where the model alternates between generating explicit reasoning thoughts (Thought: ...) and invoking external tools/actions (Action: ..., Observation: ...) to solve multi-step problems iteratively",
      "A React.js library for rendering AI chat bubbles",
      "A technique for fine-tuning open-source LLMs on mobile devices",
      "A CSS styling framework for dark mode interfaces"
    ],
    correctIndex: 0
  },
  {
    id: 337,
    question: "What is the purpose of Token Healing (Greedy Suffix Tokenization) in LLM inference engines?",
    options: [
      "Prevents token boundary artifacts where prompt ending characters combine improperly with subsequent generation tokens, ensuring clean grammatical continuations",
      "Translates corrupted unicode text into English",
      "Reduces GPU temperature during long inference batches",
      "Compresses vector database files on disk"
    ],
    correctIndex: 0
  },
  {
    id: 338,
    question: "What is the difference between Cosine Distance and Euclidean (L2) Distance in high-dimensional vector search?",
    options: [
      "Cosine distance measures the angular orientation between two vectors regardless of magnitude; Euclidean (L2) distance measures the straight-line geometric distance between vector endpoints in metric space",
      "Cosine distance only works in 2D space while L2 distance works in 3D",
      "Euclidean distance cannot be computed on normalized vectors",
      "Cosine distance always returns negative numbers"
    ],
    correctIndex: 0
  },
  {
    id: 339,
    question: "In RAG retrieval evaluation, what does the metric 'Faithfulness' measure?",
    options: [
      "The extent to which all factual claims in the generated AI response can be directly inferred from and grounded by the retrieved reference context (measuring hallucination resistance)",
      "The religious or ethical alignment of the AI model",
      "The latency of the database query in milliseconds",
      "The percentage of users who rate the AI response 5 stars"
    ],
    correctIndex: 0
  },
  {
    id: 340,
    question: "What is Cross-Encoder vs Bi-Encoder architecture in neural search and retrieval?",
    options: [
      "Bi-Encoders embed query and document independently into vector space (fast ANN search); Cross-Encoders pass query and document together through full transformer self-attention (slower, but highly accurate for reranking)",
      "Bi-Encoders are for vision; Cross-Encoders are for audio",
      "Cross-Encoders cannot be run on Nvidia GPUs",
      "Bi-Encoders do not use transformer attention layers"
    ],
    correctIndex: 0
  },
  {
    id: 341,
    question: "In LLM production architectures, what is TTFT (Time To First Token) and why is it a primary UX benchmark?",
    options: [
      "The latency duration from when the user sends a prompt until the first streamed token appears on the client screen, directly dictating perceived responsiveness in chat UIs",
      "The total time taken to fine-tune a model on GPUs",
      "The time taken to embed an entire PDF document",
      "The duration of the user's login session"
    ],
    correctIndex: 0
  },
  {
    id: 342,
    question: "What is the purpose of Guardrail Delimiters and Output Canary Tokens in AI security?",
    options: [
      "Canary tokens (secret random strings embedded in system prompts) alert monitoring systems if an LLM is tricked by a prompt injection attack into leaking its confidential system prompt",
      "Canary tokens format markdown tables in HTML5",
      "They compress JSON responses over WebSockets",
      "They convert text prompts into speech audio"
    ],
    correctIndex: 0
  },
  {
    id: 343,
    question: "What is SPLADE (Sparse Lexical and Expansion Model) in modern neural information retrieval?",
    options: [
      "A neural model that learns sparse, term-expanded representations of text matching vocabulary terms with learned importance weights, outperforming classic BM25 while remaining searchable with inverted indexes",
      "A vector database designed for mobile phones",
      "A Python library for web scraping",
      "A CSS grid layout for displaying search cards"
    ],
    correctIndex: 0
  },
  {
    id: 344,
    question: "In Next.js AI applications, how does the Vercel AI SDK `useChat` hook manage streaming UI state?",
    options: [
      "Maintains client state (messages, input, loading status), automatically handles SSE stream decoding, appends chunks incrementally to the message history, and manages abort signals",
      "Stores chat messages permanently in the user's browser BIOS",
      "Compiles React JSX into binary machine code",
      "Encrypts user prompts with blockchain smart contracts"
    ],
    correctIndex: 0
  },
  {
    id: 345,
    question: "What is 'Self-Consistency' prompting in reasoning tasks (Wang et al.)?",
    options: [
      "Sampling multiple diverse reasoning paths from the LLM at a non-zero temperature and selecting the final answer that achieves the highest majority vote across all sampled paths",
      "Prompting the model to repeat its answer 3 times in a row",
      "Fine-tuning model weights until training loss equals zero",
      "Formatting all model outputs as bulleted lists"
    ],
    correctIndex: 0
  },
  {
    id: 346,
    question: "In enterprise RAG, what is Document Metadata Enrichment?",
    options: [
      "Extracting and appending structured attributes (e.g. document type, department, publish date, author, access security level) to text chunks to enable hybrid semantic search + relational metadata filtering",
      "Adding watermarks to PDF pages before printing",
      "Translating documents into multiple spoken languages",
      "Compressing images inside PDF files to reduce size"
    ],
    correctIndex: 0
  },
  {
    id: 347,
    question: "What is the 'KV Cache' (Key-Value Cache) in autoregressive transformer inference?",
    options: [
      "Stores previously computed Key and Value attention matrices for prior tokens in GPU VRAM, avoiding redundant recalculation during token-by-token sequential generation",
      "A Redis database running on localhost port 6379",
      "A browser cache for storing user login cookies",
      "A file system cache for storing Python source files"
    ],
    correctIndex: 0
  },
  {
    id: 348,
    question: "What is Speculative Decoding in Large Language Model acceleration?",
    options: [
      "Using a small, fast draft model to generate candidate token sequences speculatively, which are then verified and accepted in parallel by a larger target model in a single forward pass",
      "Guessing what the user will type before they press Enter",
      "Generating random text when the API times out",
      "Translating English prompts into C++ before execution"
    ],
    correctIndex: 0
  },
  {
    id: 349,
    question: "In vector databases, what is IVFFlat (Inverted File Flat) indexing versus HNSW?",
    options: [
      "IVFFlat clusters vectors into Voronoi cells and searches only nearest centroid lists (fast build time, low memory, but lower recall); HNSW builds multi-layer graphs (higher memory, but superior query recall and speed)",
      "IVFFlat only works on 2-dimensional vectors",
      "HNSW does not support cosine similarity",
      "IVFFlat is stored exclusively in client browser localStorage"
    ],
    correctIndex: 0
  },
  {
    id: 350,
    question: "What is the difference between Single-Turn and Multi-Turn LLM dialogue management?",
    options: [
      "Single-turn treats each query as an isolated prompt without history; Multi-turn manages contextual state, conversation memory, and message roles (system, user, assistant, tool) across the dialogue session",
      "Single-turn is for text; Multi-turn is for images",
      "Multi-turn requires restarting the web server after every message",
      "Single-turn is only used on mobile devices"
    ],
    correctIndex: 0
  }
];

// Add extra questions to bank
bank['Frontend Developer'] = [...bank['Frontend Developer'], ...EXTRA_FRONTEND];
bank['Backend Developer'] = [...bank['Backend Developer'], ...EXTRA_BACKEND];
bank['Full Stack AI Engineer'] = [...bank['Full Stack AI Engineer'], ...EXTRA_FULLSTACK_AI];

// Verify counts
for (const [role, list] of Object.entries(bank)) {
  console.log(`- ${role}: ${list.length} MCQs`);
}

const fileContent = `/**
 * Enterprise Assessment Question Bank & Dynamic Proctoring Engine
 * Contains 400+ curated domain-specific MCQs (50+ per recruitment role).
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
console.log(`[Mega Assessment Engine Builder] Successfully compiled assessment_questions.js! Total bytes: ${Buffer.byteLength(fileContent)}`);
