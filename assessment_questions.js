/**
 * Enterprise Assessment Question Bank & Proctoring Verification Engine
 * Contains 20 curated domain-specific MCQs for each recruitment role.
 * Passing Threshold: 80% (>= 16/20 correct) for Automated Offer Letter Dispatch.
 */

const ROLE_QUESTIONS_BANK = {
  // 1. FRONTEND DEVELOPER (20 MCQs)
  'Frontend Developer': [
    {
      id: 1,
      question: 'In React 18, what is the primary purpose of the `useMemo` hook?',
      options: [
        'To memoize expensive calculation results between re-renders',
        'To manage global asynchronous application state',
        'To directly manipulate DOM nodes bypassing Virtual DOM',
        'To automatically fetch remote REST API endpoints'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'What is the key difference between `useEffect` and `useLayoutEffect` in React?',
      options: [
        'useEffect is synchronous; useLayoutEffect is asynchronous',
        'useLayoutEffect fires synchronously after all DOM mutations but before the browser paints',
        'useLayoutEffect only runs on the server side during SSR',
        'useEffect cannot have a cleanup function return'
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: 'Which CSS property creates a new stacking context without using z-index?',
      options: [
        'opacity: 0.99',
        'color: #ffffff',
        'margin: 0 auto',
        'text-align: center'
      ],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'In modern JavaScript (ES6+), what is the output of `typeof null`?',
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctIndex: 2
    },
    {
      id: 5,
      question: 'How does JavaScript Event Delegation work?',
      options: [
        'Attaching individual listeners to every single child node in a loop',
        'Attaching a single event listener to a parent element and utilizing event bubbling',
        'Triggering events only in the capturing phase and stopping propagation immediately',
        'Delegating execution to Web Workers on background threads'
      ],
      correctIndex: 1
    },
    {
      id: 6,
      question: 'What does the `justify-between` utility do in Tailwind CSS flex containers?',
      options: [
        'Aligns flex items along the cross-axis centrally',
        'Distributes flex items evenly with equal space between them along the main axis',
        'Forces flex items to wrap onto multiple rows',
        'Hides overflowing content on mobile screens'
      ],
      correctIndex: 1
    },
    {
      id: 7,
      question: 'In TypeScript, what is the difference between `unknown` and `any`?',
      options: [
        'There is no difference; they are exact aliases',
        'unknown is type-safe because operations cannot be performed without narrowing or casting',
        'any cannot be assigned to string variables',
        'unknown disables all TypeScript compiler checks completely'
      ],
      correctIndex: 1
    },
    {
      id: 8,
      question: 'What happens when a state update function receives a callback in React (e.g., `setCount(prev => prev + 1)`)?',
      options: [
        'It ensures the update is calculated from the most current committed state value',
        'It immediately forces a synchronous re-render of the entire DOM tree',
        'It cancels all pending useEffect timeouts in the component',
        'It converts the state into a Redux store action'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'Which HTTP header is essential for browser cross-origin resource sharing security?',
      options: [
        'Access-Control-Allow-Origin',
        'Content-Encoding: gzip',
        'X-Powered-By: React',
        'Cache-Control: max-age=0'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'In CSS Grid, what does `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` accomplish?',
      options: [
        'Creates a fixed 2-column layout that never collapses on small devices',
        'Creates an auto-responsive grid that wraps columns dynamically without media queries',
        'Forces all images inside the grid to scale to 250px height',
        'Centers the parent container in the middle of the viewport'
      ],
      correctIndex: 1
    },
    {
      id: 11,
      question: 'What is the purpose of the `key` prop in React lists?',
      options: [
        'To style list elements with unique CSS animations',
        'To help React identify which items have changed, been added, or been removed during reconciliation',
        'To bind database primary keys for automatic REST mutations',
        'To make the HTML list searchable by browser screen readers'
      ],
      correctIndex: 1
    },
    {
      id: 12,
      question: 'What is a JavaScript Closure?',
      options: [
        'A function bundled with references to its surrounding lexical environment',
        'A syntax error that occurs when a curly brace is missing',
        'A method to immediately terminate asynchronous Promise execution',
        'An API that closes open browser tabs programmatically'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'Which Web API enables observing when an element enters or leaves the browser viewport for lazy loading?',
      options: [
        'IntersectionObserver API',
        'ResizeObserver API',
        'MutationObserver API',
        'PerformanceObserver API'
      ],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'In Redux Toolkit / Zustand, why must state never be directly mutated?',
      options: [
        'Direct mutations break shallow equality checks, preventing components from re-rendering',
        'Direct mutations cause immediate memory leaks in the browser V8 engine',
        'Modern browsers throw syntax errors when modifying object keys',
        'Redux only supports primitive number values'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'What is the time complexity of looking up a value in a JavaScript `Map` by key?',
      options: ['O(1) average', 'O(n) linear', 'O(log n)', 'O(n^2)'],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'What is the function of `React.lazy()` combined with `<Suspense>`?',
      options: [
        'Enables code-splitting and dynamic component loading on demand',
        'Slows down network requests to simulate 3G mobile latency',
        'Prevents React components from ever unmounting',
        'Compiles JSX directly into WebAssembly binary'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'What does the CSS `contain: content` property do?',
      options: [
        'Restricts rendering, layout, and paint calculations to only that subtree for performance optimization',
        'Hides all child elements when parent is clicked',
        'Forces the container to fill 100% of the viewport width',
        'Converts all text inside the element into uppercase'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'In modern browsers, what is the difference between `localStorage` and `sessionStorage`?',
      options: [
        'sessionStorage data persists only for the duration of the page session (tab lifecycle)',
        'localStorage is limited to 1KB while sessionStorage has unlimited quota',
        'localStorage cannot store string data types',
        'sessionStorage data is sent automatically in every HTTP header request'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'How do you prevent a form submission from reloading the web page in React?',
      options: [
        'event.preventDefault()',
        'event.stopPropagation()',
        'window.stop()',
        'return false in the button tag'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'What is Core Web Vitals metric LCP (Largest Contentful Paint) measuring?',
      options: [
        'Render time of the largest image or text block visible in the viewport during initial load',
        'The delay between user input and the browser UI responding',
        'The cumulative visual shift of elements on the page during rendering',
        'The total byte size of bundled JavaScript dependencies'
      ],
      correctIndex: 0
    }
  ],

  // 2. BACKEND DEVELOPER (20 MCQs)
  'Backend Developer': [
    {
      id: 1,
      question: 'In Node.js, how does the single-threaded event loop handle non-blocking I/O operations?',
      options: [
        'It offloads asynchronous I/O tasks to the libuv thread pool and executes callbacks in the event loop',
        'It spawns a new operating system process for every incoming HTTP request',
        'It blocks execution until each disk read finishes completely',
        'It converts all JavaScript functions into synchronous C++ loops'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'What is the difference between SQL `INNER JOIN` and `LEFT JOIN`?',
      options: [
        'INNER JOIN returns matching rows from both tables; LEFT JOIN returns all rows from left table and matched rows from right',
        'LEFT JOIN only works on indexed columns; INNER JOIN works on non-indexed columns',
        'INNER JOIN deletes unmatched records from the database',
        'LEFT JOIN is twice as fast as INNER JOIN in PostgreSQL'
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'What does the ACID acronym stand for in relational database transactions?',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Asynchronous, Concurrent, Indexed, Distributed',
        'Authentication, Cryptography, Integrity, Decryption',
        'Availability, Capacity, Ingestion, Delivery'
      ],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'Which HTTP status code should be returned when a client request creates a new database resource successfully?',
      options: ['201 Created', '200 OK', '204 No Content', '302 Found'],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'In Express.js middleware, what happens if you omit calling `next()` or sending a response?',
      options: [
        'The HTTP request hangs indefinitely until it hits a client/server timeout',
        'Express automatically skips to the next route handler',
        'The Node.js server immediately crashes with a fatal error',
        'The client browser is redirected to the home page'
      ],
      correctIndex: 0
    },
    {
      id: 6,
      question: 'Why should database passwords be stored using cryptographic hashing with salt (e.g. bcrypt/argon2) rather than SHA-256 alone?',
      options: [
        'Salting and high work factor prevent rainbow table lookups and brute-force cracking',
        'bcrypt compresses the password into 2 bytes to save disk space',
        'SHA-256 is not supported on Linux operating systems',
        'Salted hashes allow recruiters to decrypt passwords back into plain text'
      ],
      correctIndex: 0
    },
    {
      id: 7,
      question: 'What is the purpose of an Index in a PostgreSQL or MySQL database?',
      options: [
        'To dramatically speed up data retrieval queries (SELECT) at the cost of slight overhead on writes (INSERT/UPDATE)',
        'To encrypt sensitive columns in compliance with GDPR',
        'To automatically backup tables to Amazon S3 every hour',
        'To enforce foreign key cascade deletes'
      ],
      correctIndex: 0
    },
    {
      id: 8,
      question: 'What is the primary architectural purpose of Redis in a high-scale backend system?',
      options: [
        'In-memory key-value caching, rate limiting, and pub/sub messaging',
        'Relational schema migrations for complex multi-table joins',
        'Serving static HTML frontend bundle files',
        'Compiling TypeScript code into binary executable files'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'What is a JSON Web Token (JWT) composed of?',
      options: [
        'Three base64url-encoded parts separated by dots: Header, Payload, and Signature',
        'An XML payload encrypted with an RSA private key only',
        'A single 128-bit integer stored in the client cookie',
        'A hash of the database user ID and plain text password'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'How do you prevent SQL Injection vulnerabilities in backend database queries?',
      options: [
        'Use parameterized queries / prepared statements with ORM or database drivers',
        'Concatenate user input strings directly with SQL SELECT queries',
        'Turn off database logging in production',
        'Restrict database table names to 4 characters'
      ],
      correctIndex: 0
    },
    {
      id: 11,
      question: 'What is the purpose of a Database Connection Pool?',
      options: [
        'Reusing a cache of pre-established database connections to avoid the overhead of opening a new socket per request',
        'Pooling multiple database servers into a single hard drive',
        'Merging SQL tables automatically without primary keys',
        'Clearing transaction logs when disk storage is 90% full'
      ],
      correctIndex: 0
    },
    {
      id: 12,
      question: 'In REST API design, what does idempotency mean for HTTP methods like `PUT` and `DELETE`?',
      options: [
        'Making multiple identical requests produces the exact same server state result as a single request',
        'The request cannot be cached by intermediate proxy servers',
        'The endpoint only accepts binary multipart payloads',
        'The endpoint responds within under 10 milliseconds'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'What is the N+1 query problem in ORMs (e.g. Prisma / TypeORM / Sequelize)?',
      options: [
        'Executing 1 query to fetch parent records, followed by N separate queries to fetch related child records in a loop',
        'Querying a table with more than 100,000 rows without pagination',
        'A database deadlock when two transactions update the same row',
        'An error thrown when a primary key is not auto-incremented'
      ],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'Which HTTP header is used to authenticate requests via Bearer tokens?',
      options: [
        'Authorization: Bearer <token>',
        'Authentication: Token <token>',
        'X-API-Signature: <token>',
        'Access-Token: <token>'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'What is the role of a Reverse Proxy (e.g., NGINX, Cloudflare, AWS ALB) in front of backend microservices?',
      options: [
        'Load balancing, SSL termination, caching, and routing traffic securely to backend clusters',
        'Executing PostgreSQL database migrations during build time',
        'Parsing PDF and DOCX resume documents in memory',
        'Generating user interface React components dynamically'
      ],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'What is the main benefit of using WebSockets over standard HTTP polling?',
      options: [
        'Full-duplex, persistent, bi-directional communication with low latency and minimal overhead',
        'WebSockets encrypt all traffic without requiring SSL certificates',
        'WebSockets do not require any server port to be open',
        'WebSockets automatically convert SQL results into HTML'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'In microservices architecture, what is the purpose of the Circuit Breaker pattern?',
      options: [
        'To prevent cascading failures across services by quickly failing requests when a downstream dependency is unhealthy',
        'To immediately reboot the server when CPU reaches 100%',
        'To encrypt inter-service gRPC traffic with AES-256',
        'To compress database payloads over the network'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'What is the difference between optimistic locking and pessimistic locking in database concurrency control?',
      options: [
        'Optimistic locking checks for version conflicts at commit time; pessimistic locking locks rows before reading/updating',
        'Optimistic locking only works in MongoDB; pessimistic locking only works in Redis',
        'Pessimistic locking is non-blocking and always allows concurrent overwrites',
        'There is no difference in database transactions'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'How do you handle CPU-intensive tasks in Node.js without blocking the main event loop?',
      options: [
        'Use Node.js Worker Threads (`worker_threads`) or delegate tasks to background message queues (e.g. BullMQ / RabbitMQ)',
        'Put the CPU code in a `setTimeout(..., 0)` block',
        'Convert all numbers into strings before calculating',
        'Increase the Node.js memory limit with `--max-old-space-size`'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'What is the primary advantage of gRPC over standard JSON REST APIs for internal service communication?',
      options: [
        'Uses HTTP/2 transport and Protocol Buffers (Protobuf) for compact binary serialization and high throughput',
        'gRPC can be rendered natively in web browsers without JavaScript',
        'gRPC does not require defining data types or schemas',
        'gRPC eliminates the need for database indexes'
      ],
      correctIndex: 0
    }
  ],

  // 3. FULL STACK AI ENGINEER (20 MCQs)
  'Full Stack AI Engineer': [
    {
      id: 1,
      question: 'When integrating LLMs (e.g. Gemini 3.5 Flash) into web applications, what is Streaming Responses (SSE - Server-Sent Events) used for?',
      options: [
        'Delivering tokens incrementally to the client UI as they are generated to reduce perceived latency',
        'Compressing video and audio streams over WebRTC',
        'Encrypting the LLM API key directly on the client side',
        'Fine-tuning neural network weights in the browser'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'What is RAG (Retrieval-Augmented Generation) in AI engineering?',
      options: [
        'A pattern that fetches relevant external domain context from a vector database to ground LLM generation',
        'A technique to retrain base foundation models from scratch on GPU clusters',
        'An algorithm to compress React JS bundles for mobile apps',
        'A database protocol for synchronizing SQL tables in real time'
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'What is a Vector Embedding in AI systems?',
      options: [
        'A high-dimensional dense numerical array representing semantic meaning of text, images, or documents',
        'An SVG vector graphic displayed on the frontend',
        'A SQL database foreign key connecting two tables',
        'A minified CSS file containing color gradient tokens'
      ],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'Which metric is commonly used to calculate semantic similarity between two embedding vectors?',
      options: ['Cosine Similarity', 'Hamming Distance', 'Gaussian Blur', 'Standard Deviation'],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'In prompt engineering, what is Few-Shot Prompting?',
      options: [
        'Providing 2-5 clear input-output demonstration examples within the prompt to guide model formatting and reasoning',
        'Calling the LLM API multiple times with random temperature settings',
        'Limiting the model response to exactly 10 tokens',
        'Fine-tuning the model on 10 million parameters'
      ],
      correctIndex: 0
    },
    {
      id: 6,
      question: 'How do you reliably enforce structured JSON output when calling Gemini API or modern LLMs?',
      options: [
        'Use responseSchema with `responseMimeType: "application/json"` and strict JSON schemas in model configuration',
        'Add "please return JSON" at the end of the prompt and hope for the best',
        'Parse the output with regular expressions only',
        'Send the request as multipart/form-data'
      ],
      correctIndex: 0
    },
    {
      id: 7,
      question: 'What does the LLM `temperature` parameter control during text generation?',
      options: [
        'The degree of randomness / creativity in token probability distribution (0 = deterministic, 1+ = creative)',
        'The physical operating temperature of the server GPU core',
        'The network timeout duration in milliseconds',
        'The maximum context window size in tokens'
      ],
      correctIndex: 0
    },
    {
      id: 8,
      question: 'In Full Stack architecture, why should AI model API keys never be embedded in client-side React code?',
      options: [
        'Exposing API keys in client JavaScript allows malicious users to steal credentials, abuse quotas, and incur financial charges',
        'React compiler fails to build when API keys exceed 32 characters',
        'Client browsers do not support HTTPS POST requests with API keys',
        'Google Cloud automatically changes keys every 10 minutes'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'What is Function Calling / Tool Calling in LLM agent workflows?',
      options: [
        'The model detects when an external function should be invoked, returning structured arguments for the backend to execute',
        'The LLM directly connects to the production SQL database without backend validation',
        'The model automatically writes and deploys React components to production',
        'A method to call Python scripts from CSS files'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'What is Prompt Injection, and how can it be mitigated in AI web applications?',
      options: [
        'Malicious user input overriding system instructions; mitigated via input sanitization, delimiter isolation, and separate system roles',
        'An SQL query that deletes model weights from memory',
        'A network attack that DDOSes the Gemini API endpoint',
        'A frontend bug that causes text to render upside down'
      ],
      correctIndex: 0
    },
    {
      id: 11,
      question: 'What is the role of Vector Databases (e.g. Pinecone, ChromaDB, pgvector) in AI architectures?',
      options: [
        'Storing high-dimensional embeddings and performing fast Approximate Nearest Neighbor (ANN) similarity search',
        'Replacing relational SQL databases for transaction processing',
        'Managing React state across browser tabs',
        'Compressing video files for WebRTC streaming'
      ],
      correctIndex: 0
    },
    {
      id: 12,
      question: 'In full stack Node.js/Python microservices, what is the best way to handle long-running LLM batch evaluations?',
      options: [
        'Asynchronous job processing using message queues (e.g. BullMQ / Celery / Redis) with webhook or WebSocket progress updates',
        'Holding an open synchronous HTTP request connection for 10 minutes',
        'Running all evaluations in an infinite while loop in the main thread',
        'Storing prompt strings in browser cookies'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'What is Chunking in document ingestion pipelines for RAG systems?',
      options: [
        'Breaking long documents into smaller, semantically coherent passages with overlap for accurate embedding and retrieval',
        'Splitting SQL tables into 10 separate hard drives',
        'Compressing image files into JPEG format',
        'Deleting duplicate words in candidate resumes'
      ],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'What does Docker containerization provide for AI web applications?',
      options: [
        'Consistent, isolated runtime environments ensuring identical dependencies across development, testing, and cloud production',
        'Automatic generation of training datasets for machine learning models',
        'GPU hardware acceleration on standard mobile devices',
        'Instant indexing of relational database foreign keys'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'In React, how do you handle optimistic UI updates when waiting for an AI response?',
      options: [
        'Update local UI state immediately to show user intent, while handling the async AI request in background and rolling back on error',
        'Freeze the user interface with an alert box until the API returns',
        'Disable all CSS animations on the page',
        'Refresh the whole browser tab'
      ],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'What is the advantage of Context Caching in modern LLM APIs (e.g., Gemini Context Caching)?',
      options: [
        'Reduces cost and latency significantly by caching large repeated context (e.g. long codebases, documents) between requests',
        'Stores LLM weights on the candidate laptop hard drive',
        'Caches React HTML components in browser IndexedDB',
        'Allows running Gemini models completely offline without internet'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'What is the purpose of Tokenization in NLP models?',
      options: [
        'Converting raw text into discrete numerical token IDs that neural networks can process',
        'Generating OAuth2 access tokens for login security',
        'Creating unique CSS class names in Tailwind',
        'Encrypting database rows with AES-GCM'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'In Next.js / Vite full-stack apps, what is the purpose of Environment Variables starting without public prefixes?',
      options: [
        'They are kept exclusively on the server side and never exposed or bundled into the client browser bundle',
        'They are deleted automatically after 24 hours',
        'They can only be read by SQL databases',
        'They enforce dark mode in CSS styling'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'What is Model Quantization in machine learning deployment?',
      options: [
        'Reducing the numerical precision of weights (e.g., FP32 to INT8/INT4) to decrease memory footprint and accelerate inference',
        'Multiplying the model parameters by 10 to improve accuracy',
        'Translating Python ML scripts into Java bytecode',
        'Generating synthetic training resumes'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'What is Hallucination in Large Language Models and how is it minimized in production HR automation workflows?',
      options: [
        'Generating factually incorrect or unsupported claims; minimized via low temperature, strict schema validation, and RAG grounding',
        'A hardware glitch where GPU monitors display incorrect colors',
        'A memory leak in Node.js server processes',
        'A security vulnerability where API keys expire prematurely'
      ],
      correctIndex: 0
    }
  ],

  // 4. AI/ML ENGINEER (20 MCQs)
  'AI/ML Engineer': [
    {
      id: 1,
      question: 'In supervised deep learning, what is Overfitting and what is a standard technique to prevent it?',
      options: [
        'Model performs exceptionally on training data but poorly on unseen test data; mitigated by Dropout, L2 regularization, and data augmentation',
        'Model fails to learn even on training data; mitigated by reducing dataset size',
        'Model training crashes due to CUDA out-of-memory error',
        'Model weights become zero due to gradient explosion'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'What is the core mathematical mechanism behind Transformer models (Vaswani et al.)?',
      options: [
        'Multi-Head Scaled Dot-Product Self-Attention',
        'Recurrent Hidden Markov State Transitions',
        'Convolutional Max-Pooling Filters',
        'K-Nearest Neighbors Clustering'
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'What problem does the Adam (Adaptive Moment Estimation) optimizer solve over standard SGD?',
      options: [
        'Computes adaptive learning rates for each parameter using both first and second moments of gradients',
        'Guarantees finding the global minimum in non-convex loss functions',
        'Eliminates the need for backpropagation entirely',
        'Reduces dataset size by 50% automatically'
      ],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'In PyTorch, what does `tensor.backward()` do?',
      options: [
        'Computes the gradients of the scalar loss with respect to all leaf tensors with `requires_grad=True` via backpropagation',
        'Reverses the elements in the tensor along dimension 0',
        'Transfers the tensor from GPU memory back to CPU RAM',
        'Saves the tensor weights to disk as a `.pt` file'
      ],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'What is the vanishing gradient problem in deep neural networks and which activation function helps mitigate it?',
      options: [
        'Gradients become exponentially small in early layers; mitigated by ReLU / LeakyReLU / GELU activation functions',
        'Gradients become infinite; mitigated by Sigmoid activation',
        'Loss value becomes negative; mitigated by Tanh activation',
        'Weights become negative; mitigated by Step function'
      ],
      correctIndex: 0
    },
    {
      id: 6,
      question: 'What is LoRA (Low-Rank Adaptation) in LLM fine-tuning?',
      options: [
        'Freezing pretrained model weights and injecting trainable low-rank decomposition matrices into attention layers to reduce trainable parameters by >90%',
        'Deleting 90% of model layers to run on mobile CPUs',
        'Quantizing all floats to binary 1-bit values',
        'Training a new foundation model from scratch on Wikipedia'
      ],
      correctIndex: 0
    },
    {
      id: 7,
      question: 'What is the ROC-AUC score and why is it preferred over raw accuracy for imbalanced classification datasets?',
      options: [
        'Measures the area under the True Positive Rate vs False Positive Rate curve across all classification thresholds, independent of class distribution',
        'Measures the training speed of neural network layers in FLOPS',
        'Calculates the percentage of correctly classified majority class examples only',
        'Measures the memory consumption of PyTorch models'
      ],
      correctIndex: 0
    },
    {
      id: 8,
      question: 'What is Cross-Entropy Loss primarily used for in neural networks?',
      options: [
        'Multi-class and binary classification probability optimization',
        'Linear regression price forecasting',
        'Image upscaling and noise reduction',
        'Calculating vector dot products in embedding spaces'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'In NLP and LLMs, what is the role of Positional Encodings in Transformer architectures?',
      options: [
        'Injecting order/sequence information into tokens since self-attention operations are inherently permutation-invariant',
        'Encrypting the token IDs before sending to GPU cores',
        'Assigning part-of-speech tags to nouns and verbs',
        'Calculating token byte size in memory'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'What is the primary difference between Bagging (e.g. Random Forest) and Boosting (e.g. XGBoost / LightGBM)?',
      options: [
        'Bagging trains trees in parallel independently; Boosting trains trees sequentially where each tree corrects errors of preceding trees',
        'Bagging is only for classification; Boosting is only for clustering',
        'Boosting never overfits regardless of tree depth',
        'Random Forest uses neural networks under the hood'
      ],
      correctIndex: 0
    },
    {
      id: 11,
      question: 'What is Batch Normalization / Layer Normalization in deep learning?',
      options: [
        'Normalizing layer inputs to have zero mean and unit variance to stabilize training and accelerate convergence',
        'Sorting dataset rows in ascending order before training',
        'Dividing the batch size by the number of available GPUs',
        'Converting 32-bit floating point numbers into integers'
      ],
      correctIndex: 0
    },
    {
      id: 12,
      question: 'In unsupervised learning, what does PCA (Principal Component Analysis) accomplish?',
      options: [
        'Dimensionality reduction by projecting data onto orthogonal axes that maximize variance',
        'Labeling unlabeled images using clustering centroids',
        'Translating foreign language text into English',
        'Generating synthetic images using generative adversarial networks'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'What is RLHF (Reinforcement Learning from Human Feedback) in LLM post-training?',
      options: [
        'Aligning model outputs with human preferences and safety guidelines using reward models and PPO / DPO algorithms',
        'Having human annotators write all token responses manually in real time',
        'Training robot hardware in physical physics simulators',
        'Testing website buttons with human focus groups'
      ],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'What does Precision vs Recall tradeoff represent in information retrieval / classification?',
      options: [
        'Precision = True Positives / (True Positives + False Positives); Recall = True Positives / (True Positives + False Negatives)',
        'Precision measures inference speed; Recall measures model size on disk',
        'High precision guarantees 100% recall in all distributions',
        'Recall only applies to neural networks with more than 50 layers'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'What is the purpose of FlashAttention in modern GPU LLM training and inference?',
      options: [
        'Fast and memory-efficient exact self-attention computing I/O-aware tiling to minimize GPU HBM memory read/writes',
        'A browser plugin to play Flash animations in Jupyter Notebooks',
        'An algorithm that skips attention calculations entirely',
        'A method to train models on mobile phone processors'
      ],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'In PyTorch, why should you wrap inference code in `with torch.no_grad():`?',
      options: [
        'Disables gradient calculation and graph construction, reducing memory usage and speeding up forward pass computation',
        'Ensures model weights are encrypted during inference',
        'Forces the model to output deterministic JSON formatting',
        'Prevents python memory leaks during training loops'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'What is the difference between BERT (encoder-only) and GPT (decoder-only) architectures?',
      options: [
        'BERT uses bidirectional attention suited for understanding/classification; GPT uses causal masked attention suited for autoregressive generation',
        'BERT has 100x more parameters than all GPT models',
        'GPT cannot process text in English',
        'BERT only runs on CPU hardware'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'What is Gradient Clipping and what specific problem does it resolve during recurrent / deep network training?',
      options: [
        'Restricting maximum gradient norms to a threshold to prevent exploding gradients from destabilizing weight updates',
        'Cutting training data by 50% when loss plateaus',
        'Trimming token sequences longer than 512 tokens',
        'Deleting negative weights from convolution filters'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'What is Contrastive Learning (e.g. SimCLR, CLIP) in modern multimodal AI?',
      options: [
        'Training encoders by bringing matching pairs (positive examples) closer and pushing non-matching pairs (negative examples) apart in embedding space',
        'Comparing pixel colors to increase screen contrast in user interfaces',
        'Training two discriminators against a single generator in GANs',
        'Evaluating model test scores against baseline heuristics'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'What is the role of Vector Quantization (e.g. FAISS, HNSW) in scalable semantic search engines?',
      options: [
        'Enables sub-linear approximate nearest neighbor search across billions of embeddings with minimal memory footprint',
        'Compresses audio recordings into MP3 files',
        'Transforms relational tables into NoSQL documents',
        'Executes unit tests for machine learning codebases'
      ],
      correctIndex: 0
    }
  ],

  // 5. DATA ANALYST (20 MCQs)
  'Data Analyst': [
    {
      id: 1,
      question: 'In SQL, what is the key difference between `WHERE` and `HAVING` clauses?',
      options: [
        'WHERE filters individual rows before aggregation; HAVING filters aggregated groups after GROUP BY',
        'HAVING is only used for string columns; WHERE is used for numeric columns',
        'WHERE cannot be used in SELECT statements',
        'There is no difference; they are interchangeable'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'Which SQL Window Function calculates a cumulative running total of revenue over ordered dates?',
      options: [
        'SUM(revenue) OVER (ORDER BY transaction_date)',
        'TOTAL(revenue) GROUP BY transaction_date',
        'RUNNING_SUM(revenue) ON (transaction_date)',
        'CUMULATIVE(revenue)'
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'In Python Pandas, what is the output of `df.dropna(axis=1)`?',
      options: [
        'Drops all columns that contain at least one null (NaN) value',
        'Drops all rows that contain null values',
        'Replaces null values with 0',
        'Deletes the first row of the dataframe'
      ],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'What is the statistical difference between Mean and Median, and when should Median be preferred?',
      options: [
        'Median is the middle value resistant to outliers; preferred when data is heavily skewed (e.g. salaries, house prices)',
        'Mean is always equal to Median in all distributions',
        'Median is the most frequently occurring value in the dataset',
        'Mean can only be calculated on integer columns'
      ],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'In SQL, which window function ranks rows without leaving gaps in ranking values for ties (e.g., 1, 2, 2, 3)?',
      options: ['DENSE_RANK()', 'RANK()', 'ROW_NUMBER()', 'NTILE(4)'],
      correctIndex: 0
    },
    {
      id: 6,
      question: 'What is a Star Schema in Data Warehousing / Business Intelligence?',
      options: [
        'A dimensional model consisting of a central Fact Table containing numeric metrics surrounded by Dimension Tables',
        'A graph database schema where all nodes connect to 5 stars',
        'A NoSQL database schema designed exclusively for MongoDB',
        'A backup protocol that saves tables in astronomical order'
      ],
      correctIndex: 0
    },
    {
      id: 7,
      question: 'In Power BI / Excel, what is DAX (Data Analysis Expressions)?',
      options: [
        'A formula expression language used for custom calculations, measures, and data modeling',
        'A programming language used to build mobile apps',
        'A database migration tool for Oracle servers',
        'A CSS framework for data charts'
      ],
      correctIndex: 0
    },
    {
      id: 8,
      question: 'What is Cohort Analysis in product/business analytics?',
      options: [
        'Tracking the behavior, retention, and lifetime value of groups of users who share a common characteristic over time',
        'Calculating the correlation between CPU usage and revenue',
        'Comparing database table sizes in gigabytes',
        'Auditing employee login timestamps in HR systems'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'In Python Pandas, how do you merge two dataframes `df1` and `df2` on a common key `user_id` using a Left Join?',
      options: [
        'pd.merge(df1, df2, on="user_id", how="left")',
        'df1.concat(df2, join="left")',
        'df1.append(df2, where="user_id")',
        'pd.join(df1, df2, key="user_id")'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'What does a Correlation Coefficient of -0.85 indicate between two variables?',
      options: [
        'A strong negative linear relationship (as one variable increases, the other decreases)',
        'No relationship between the two variables',
        'A strong positive relationship where both variables increase together',
        'An error in mathematical calculation'
      ],
      correctIndex: 0
    },
    {
      id: 11,
      question: 'In SQL, what is the purpose of the `COALESCE(column_name, 0)` function?',
      options: [
        'Returns the first non-null value in the argument list, replacing NULL with 0',
        'Deletes rows where column_name equals 0',
        'Calculates the square root of column_name',
        'Converts string columns to datetime format'
      ],
      correctIndex: 0
    },
    {
      id: 12,
      question: 'What is the purpose of an ETL (Extract, Transform, Load) pipeline?',
      options: [
        'Extracting data from multiple sources, transforming/cleaning it into standard formats, and loading it into a Data Warehouse',
        'Compressing JPEG images for frontend display',
        'Managing employee payroll calculations in Excel',
        'Running unit tests for backend APIs'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'Which type of chart is best suited to display the distribution and quartile skewness of continuous numerical data?',
      options: ['Box Plot (Box and Whisker)', 'Pie Chart', 'Scatter Plot', 'Donut Chart'],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'In SQL, what is a CTE (Common Table Expression) defined with the `WITH` keyword?',
      options: [
        'A temporary named result set that simplifies complex subqueries and improves readability',
        'A permanent table stored on the hard drive',
        'A stored procedure that encrypts database passwords',
        'A database trigger that fires on INSERT'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'What is Customer Churn Rate in business metrics?',
      options: [
        'The percentage of customers who stop subscribing or doing business with a company over a given time period',
        'The average number of customer support tickets resolved per hour',
        'The total revenue generated by top 10 enterprise clients',
        'The speed of website page load for new visitors'
      ],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'In Python Seaborn/Matplotlib, what is a Heatmap primarily used to visualize?',
      options: [
        'A 2D matrix of values represented as colors (e.g. correlation matrices, hourly user activity)',
        'A geographic map showing physical server locations',
        'A line chart of stock prices over 10 years',
        'A 3D mesh rendering of CAD models'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'What is the difference between Discrete and Continuous data?',
      options: [
        'Discrete data consists of distinct countable values (e.g. headcount); Continuous data can take any value within a range (e.g. revenue, height)',
        'Discrete data is always text; Continuous data is always boolean',
        'Continuous data cannot be plotted on charts',
        'There is no difference in statistics'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'In SQL, what does the `UNION ALL` operator do compared to `UNION`?',
      options: [
        'UNION ALL combines result sets including duplicate rows without distinct deduplication overhead',
        'UNION ALL automatically removes all duplicate records',
        'UNION ALL only works on tables with identical column names in different databases',
        'UNION ALL deletes unmatched records from the first table'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'What is the purpose of Data Normalization (e.g. 1NF, 2NF, 3NF) in relational databases?',
      options: [
        'Minimizing data redundancy and preventing update/insertion anomalies by organizing tables logically',
        'Converting all string text to lowercase in SQL queries',
        'Translating SQL queries into NoSQL JSON documents',
        'Multiplying all numeric metrics by 100 for percentage display'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'In A/B testing analysis, what does a p-value < 0.05 typically signify?',
      options: [
        'Statistical significance: there is less than a 5% probability that the observed difference occurred purely by random chance',
        'The test was invalid and must be discarded',
        'Exactly 5% of users converted during the experiment',
        'The website revenue decreased by 5%'
      ],
      correctIndex: 0
    }
  ],

  // 6. BUSINESS ANALYST (20 MCQs)
  'Business Analyst': [
    {
      id: 1,
      question: 'What is the primary objective of a Business Requirements Document (BRD)?',
      options: [
        'To define high-level business goals, stakeholder expectations, and functional needs without prescribing technical code implementation',
        'To list database table schemas and SQL foreign keys',
        'To document employee performance appraisals and salaries',
        'To provide legal terms of service for end users'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'In Agile Scrum framework, what is the INVEST mnemonic for writing effective User Stories?',
      options: [
        'Independent, Negotiable, Valuable, Estimable, Small, Testable',
        'Integrated, Normalized, Verified, Encrypted, Scalable, Tested',
        'Immediate, Necessary, Validated, Executed, Standard, True',
        'International, Native, Virtual, Electronic, Structured, Tracked'
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'What does a Gap Analysis evaluate in enterprise business operations?',
      options: [
        'The comparison between Current State ("As-Is") and Desired Future State ("To-Be") to identify missing capabilities and requirements',
        'The network latency gap between two cloud data centers',
        'The difference between employee attendance and leaves',
        'The physical distance between corporate branch offices'
      ],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'In requirements engineering, what is the MoSCoW prioritization technique?',
      options: [
        'Must have, Should have, Could have, Won\'t have (this time)',
        'Module, System, Component, Object, Workflow',
        'Manage, Oversee, Schedule, Coordinate, Win',
        'Mobile, Online, Server, Cloud, Web'
      ],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'What is the difference between Functional and Non-Functional Requirements?',
      options: [
        'Functional defines specific system behaviors and features (what it does); Non-Functional defines quality attributes like performance, security, and scalability (how it performs)',
        'Functional requirements are written by engineers; Non-Functional requirements are written by lawyers',
        'Non-Functional requirements do not need to be tested before production release',
        'Functional requirements only apply to mobile applications'
      ],
      correctIndex: 0
    },
    {
      id: 6,
      question: 'In process modeling (BPMN), what does a Diamond-shaped symbol represent in a workflow diagram?',
      options: ['A Gateway / Decision Point with conditional branching logic', 'A Start Event indicating process initiation', 'An End Event terminating the workflow', 'A Database Storage container'],
      correctIndex: 0
    },
    {
      id: 7,
      question: 'What is a RACI Matrix used for in project stakeholder management?',
      options: [
        'Clarifying roles across project activities: Responsible, Accountable, Consulted, and Informed',
        'Calculating project financial ROI and tax deductions',
        'Assigning Git commit permissions to developers',
        'Managing Jira issue priority levels from Blocker to Minor'
      ],
      correctIndex: 0
    },
    {
      id: 8,
      question: 'In Agile Scrum, what is Acceptance Criteria in a User Story?',
      options: [
        'Predefined conditions that a software deliverable must satisfy to be accepted by the Product Owner as complete',
        'The invoice payment terms signed by enterprise clients',
        'The hardware specifications of user laptops',
        'The minimum resume match score required for candidates'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'What is SWOT Analysis used for in business strategy?',
      options: [
        'Evaluating internal Strengths and Weaknesses alongside external Opportunities and Threats',
        'Assessing Software, Web, Operating systems, and Technology stacks',
        'Measuring Sprint velocity, Workload, Overtime, and Tasks in Jira',
        'Managing sales targets for quarterly revenue reviews'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'What is a Traceability Matrix (RTM) used for in requirements management?',
      options: [
        'Tracing each business requirement through design, development, and test cases to ensure complete coverage',
        'Tracking employee IP addresses accessing internal databases',
        'Measuring network packet hops across cloud routers',
        'Auditing financial transactions for tax compliance'
      ],
      correctIndex: 0
    },
    {
      id: 11,
      question: 'What is Scope Creep and how should a Business Analyst manage it in an active project?',
      options: [
        'Uncontrolled expansion of project scope without adjustments to time, cost, or resources; managed via formal Change Control processes',
        'A software bug that causes database memory leaks',
        'Hiring more developers than budgeted for a sprint',
        'A reduction in project requirements requested by stakeholders'
      ],
      correctIndex: 0
    },
    {
      id: 12,
      question: 'In UML diagramming, what is a Use Case Diagram primarily used to model?',
      options: [
        'Interactions between external Actors (users/systems) and the system boundaries to achieve specific goals',
        'The physical server network architecture and firewalls',
        'The class inheritance hierarchy in object-oriented code',
        'The database schema entity relationships'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'What is User Acceptance Testing (UAT)?',
      options: [
        'The final phase of software testing conducted by end users/business stakeholders to verify that the system satisfies business requirements',
        'Automated unit testing executed in GitHub Actions CI/CD',
        'Testing database queries with sample SQL scripts',
        'Load testing the server with 10,000 concurrent bot requests'
      ],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'What is the purpose of Sprint Retrospectives in Scrum?',
      options: [
        'For the Scrum team to inspect the past sprint and identify actionable continuous process improvements for upcoming sprints',
        'To demo the product features to prospective sales leads',
        'To assign individual employee performance ratings',
        'To estimate story points for the next 6 months'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'What is a Key Performance Indicator (KPI)?',
      options: [
        'A measurable metric used to evaluate how effectively an organization/project achieves key business objectives',
        'A security key used to decrypt backend API tokens',
        'A database index on primary key columns',
        'A Jira bug resolution speed benchmark'
      ],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'In requirements elicitation, what is JAD (Joint Application Development)?',
      options: [
        'Structured collaborative workshops bringing business stakeholders, BAs, and technical teams together to define system requirements',
        'A JavaScript framework for building desktop applications',
        'A database indexing algorithm for relational tables',
        'A corporate payroll management software'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'What is the difference between a Product Backlog and a Sprint Backlog?',
      options: [
        'Product Backlog is the prioritized master list of all future features/requirements; Sprint Backlog is the subset committed for the current sprint',
        'Product Backlog is only for bugs; Sprint Backlog is only for new features',
        'Sprint Backlog is managed by sales teams; Product Backlog is managed by developers',
        'There is no difference in Agile Scrum'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'What is Value Stream Mapping in Lean / Process Optimization?',
      options: [
        'Analyzing all steps in a business process to identify value-adding activities versus non-value-adding waste/delays',
        'Mapping monetary payments in cryptocurrency wallets',
        'Plotting company revenue graphs in Excel spreadsheets',
        'Tracking website visitors on Google Analytics'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'What does the term "MVP" mean in product strategy and development?',
      options: [
        'Minimum Viable Product: a version of a new product with just enough features to satisfy early adopters and gather validated learning',
        'Most Valuable Programmer in an engineering team',
        'Maximum Velocity Plan for enterprise project sprints',
        'Master Verification Protocol for software security audits'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'In business process re-engineering, what is Root Cause Analysis (e.g. 5 Whys / Ishikawa Fishbone Diagram)?',
      options: [
        'A structured problem-solving method designed to identify the fundamental underlying cause of a defect or business failure',
        'A technique to analyze server root folder permissions in Linux',
        'A method to calculate square roots of statistical variance in Excel',
        'A process for auditing candidate resumes in HR workflows'
      ],
      correctIndex: 0
    }
  ],

  // 7. UI/UX DESIGNER (20 MCQs)
  'UI/UX Designer': [
    {
      id: 1,
      question: 'In Figma, what is Auto Layout primarily used for?',
      options: [
        'Creating dynamic responsive components and frames that adjust automatically to content changes and screen dimensions',
        'Exporting React JSX code directly to AWS servers',
        'Generating 3D vector animations using GPU hardware',
        'Automatically correcting spelling mistakes in UI copy'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'What is the 60-30-10 Rule in UI Color Theory?',
      options: [
        'A balanced palette guideline: 60% dominant base color, 30% secondary supporting color, and 10% accent color for CTAs',
        'The recommended opacity levels for dark mode shadows',
        'The ratio of font weights in typography scale',
        'The percentage of mobile users vs desktop visitors'
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'What does WCAG 2.1 AA require for normal text contrast ratio against its background?',
      options: ['At least 4.5:1', 'At least 2:1', 'At least 7:1', 'Exactly 1:1'],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'In UX research, what is the difference between Qualitative and Quantitative research?',
      options: [
        'Qualitative explores user motivations, thoughts, and "why" (interviews, usability tests); Quantitative measures numeric metrics and "how many" (analytics, surveys)',
        'Qualitative only uses automated scripts; Quantitative uses pen and paper',
        'Quantitative research cannot be displayed on charts',
        'Qualitative research only applies to marketing teams'
      ],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'What is Jakob\'s Law of Internet User Experience?',
      options: [
        'Users spend most of their time on other sites, meaning they prefer your site to work the same way as all the other sites they already know',
        'Users will abandon a website if it takes more than 3 seconds to load',
        'Mobile screen buttons must always be circular',
        'Dark mode designs convert 50% more users than light mode'
      ],
      correctIndex: 0
    },
    {
      id: 6,
      question: 'In Figma Design Systems, what are Component Variants and Component Properties?',
      options: [
        'Structured controls that allow grouping states (e.g. Hover, Active, Disabled) and toggling properties (text, boolean, icons) cleanly',
        'Plugins that compile Figma layers into SVG icons',
        'CSS stylesheet exports for Tailwind projects',
        'Cloud backups saved to Google Drive'
      ],
      correctIndex: 0
    },
    {
      id: 7,
      question: 'What is Hick\'s Law in UX Design?',
      options: [
        'The time it takes to make a decision increases logarithmically with the number and complexity of choices',
        'The speed of website animations should never exceed 300ms',
        'Users read web pages in an F-shaped eye-tracking pattern',
        'All mobile navigation menus must be placed at the bottom'
      ],
      correctIndex: 0
    },
    {
      id: 8,
      question: 'What is the purpose of Wireframing in the design process?',
      options: [
        'Establishing structural layout, information hierarchy, and user flow quickly without visual design distractions (colors, high-res images)',
        'Writing production CSS code for web developers',
        'Configuring database schemas for backend APIs',
        'Designing high-fidelity 3D promotional videos'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'What is Fitts\'s Law in interaction design?',
      options: [
        'The time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target',
        'Small buttons are always easier to click on mobile screens',
        'All web forms must have fewer than 3 fields',
        'Navigation links must always be colored blue'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'What is a User Persona in UX Design?',
      options: [
        'A semi-fictional archetype based on real user research representing the goals, pain points, and behaviors of a target user group',
        'An imaginary cartoon avatar displayed on employee profiles',
        'A database entry for registered website accounts',
        'A legal copyright disclaimer for graphic designers'
      ],
      correctIndex: 0
    },
    {
      id: 11,
      question: 'What does Information Architecture (IA) focus on in digital product design?',
      options: [
        'Organizing, structuring, and labeling content effectively so users can easily navigate and find what they need',
        'Designing the server motherboard architecture in cloud data centers',
        'Writing SQL queries for database performance tuning',
        'Choosing computer monitors for graphic design workstations'
      ],
      correctIndex: 0
    },
    {
      id: 12,
      question: 'What is the 8pt Grid System commonly used in modern UI design?',
      options: [
        'A spatial sizing and spacing convention where all margins, paddings, and element dimensions are multiples of 8 (e.g. 8, 16, 24, 32, 48px)',
        'A restriction limiting all fonts to exactly 8pt size',
        'A grid layout that only allows 8 columns on desktop screens',
        'A color palette containing 8 primary colors'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'What is Microcopy in user interface design?',
      options: [
        'Short, contextual text snippets (button labels, tooltip hints, error messages, empty states) that guide users smoothly through interactions',
        'Very small fine print legal terms at the bottom of a web page',
        'Minified JavaScript code comments',
        'Watermarks applied to copyright protected photos'
      ],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'In accessibility design, what is the purpose of Alt Text for images?',
      options: [
        'Providing text alternatives describing visual content for screen reader users and when images fail to load',
        'Increasing image download speed over slow 3G networks',
        'Applying subtle drop shadow effects around image borders',
        'Translating image colors into black and white for print'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'What is an Interactive Prototype in Figma?',
      options: [
        'A clickable simulation of user flows with transitions, smart animations, and interactive component states to test usability before engineering',
        'A live production React application hosted on cloud servers',
        'A vector SVG file exported for print media',
        'A static PDF file containing screenshots of user interfaces'
      ],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'What is the aesthetic effect of Glassmorphism in modern UI design?',
      options: [
        'Semi-transparent frosted glass aesthetic achieved with translucent backgrounds, subtle light borders, and `backdrop-filter: blur(...)` effects',
        'High contrast solid neon flat design without shadows',
        'Simulating realistic leather and wooden skeuomorphic textures',
        'Monochrome black and white typography layouts'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'What is Card Sorting in UX research?',
      options: [
        'A generative research method where users organize topic cards into categories to help inform and validate information architecture navigation',
        'Sorting credit card payments by transaction amount',
        'Organizing employee badge access cards in corporate offices',
        'Sorting Jira task tickets by deadline date'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'What is the primary function of a Breadcrumb Navigation in web UI?',
      options: [
        'A secondary navigation scheme revealing the user location within the site hierarchy and providing 1-click links back to parent pages',
        'A cookie that tracks user browsing habits across websites',
        'An animated loading spinner displayed during API calls',
        'A popup notification displaying marketing discount codes'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'What is the difference between UI (User Interface) and UX (User Experience)?',
      options: [
        'UI focuses on visual elements, styling, typography, and aesthetics; UX encompasses the complete user journey, usability, architecture, and overall satisfaction',
        'UI is only for mobile apps; UX is only for desktop web pages',
        'UI is designed by engineers; UX is designed by sales managers',
        'There is no difference in software design'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'What are Design Tokens in an enterprise design system?',
      options: [
        'Named semantic variables (colors, typography, spacing, border radii, shadows) that synchronize design files and codebases seamlessly',
        'Cryptocurrency tokens given to designers as rewards',
        'OAuth authentication tokens stored in browser cookies',
        'Watermarks embedded in Figma artboard exports'
      ],
      correctIndex: 0
    }
  ],

  // 8. BUSINESS DEVELOPMENT EXECUTIVE (20 MCQs)
  'Business Development Executive': [
    {
      id: 1,
      question: 'What does the BANT framework stand for in B2B sales lead qualification?',
      options: [
        'Budget, Authority, Need, Timeline',
        'Business, Allocation, Negotiation, Target',
        'Billing, Acquisition, Network, Tracking',
        'Benchmark, Assessment, Nomination, Turnover'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'In enterprise sales, what is the difference between Outbound and Inbound lead generation?',
      options: [
        'Outbound involves proactive outreach (cold calls, personalized emails, LinkedIn outreach); Inbound attracts prospects through content, SEO, and marketing campaigns',
        'Inbound only targets international customers; Outbound targets local clients',
        'Outbound leads are always completely free of cost',
        'Inbound leads cannot be tracked in CRM software'
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'What is Customer Acquisition Cost (CAC) and how is it calculated?',
      options: [
        'Total sales and marketing expenditure divided by the number of new customers acquired during that period',
        'The total profit generated by a customer over 5 years',
        'The monthly subscription price of CRM software per user',
        'The average salary of business development executives'
      ],
      correctIndex: 0
    },
    {
      id: 4,
      question: 'What is the primary role of a CRM (Customer Relationship Management) system like HubSpot or Salesforce?',
      options: [
        'Centralizing customer contact data, tracking pipeline deals, logging communication touchpoints, and forecasting sales revenue',
        'Compiling backend JavaScript and Python source code',
        'Managing employee attendance and HR payroll calculations',
        'Editing graphic design banners for social media ads'
      ],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'What is the difference between an MQL (Marketing Qualified Lead) and an SQL (Sales Qualified Lead)?',
      options: [
        'An MQL has shown interest through marketing engagement; an SQL has been vetted by sales as having genuine intent, budget, and readiness to buy',
        'MQLs have signed contracts; SQLs are cold contacts with no prior engagement',
        'SQLs only come from database queries; MQLs come from email newsletters',
        'There is no difference in sales funnels'
      ],
      correctIndex: 0
    },
    {
      id: 6,
      question: 'What is Customer Lifetime Value (LTV / CLV)?',
      options: [
        'The total projected revenue a single customer account will generate throughout their entire business relationship with the company',
        'The number of years a customer has worked in their current job',
        'The total cost of customer support phone calls per month',
        'The average discount percentage offered during contract renewals'
      ],
      correctIndex: 0
    },
    {
      id: 7,
      question: 'What does an LTV : CAC ratio of 3:1 indicate for a SaaS / Technology company?',
      options: [
        'A healthy, scalable business model where customer lifetime value is three times the cost to acquire them',
        'The company is losing money on every acquired customer',
        'The sales team needs to be downsized immediately',
        'Customers churn after exactly 3 months'
      ],
      correctIndex: 0
    },
    {
      id: 8,
      question: 'In sales negotiations, what is BATNA (Best Alternative to a Negotiated Agreement)?',
      options: [
        'The most advantageous course of action a party can take if current negotiations break down without reaching a deal',
        'The maximum discount percentage allowed by the finance director',
        'The legally binding penalty fee for breaking contract terms',
        'The closing pitch presented during final contract signing'
      ],
      correctIndex: 0
    },
    {
      id: 9,
      question: 'What is a Discovery Call in B2B enterprise sales?',
      options: [
        'An initial structured conversation to understand the prospect\'s current pain points, business goals, existing workflows, and qualification fit',
        'A cold telemarketing call asking for credit card numbers',
        'A technical debugging session with backend software engineers',
        'An internal company meeting to review weekly sales quotas'
      ],
      correctIndex: 0
    },
    {
      id: 10,
      question: 'What is Social Selling primarily focused on in modern B2B business development?',
      options: [
        'Building relationships, establishing thought leadership, and engaging strategic decision-makers on professional networks like LinkedIn',
        'Selling consumer retail items on Instagram and TikTok marketplaces',
        'Running paid Google Search pay-per-click ad campaigns',
        'Sending mass automated spam messages to random email addresses'
      ],
      correctIndex: 0
    },
    {
      id: 11,
      question: 'What is Objection Handling in a sales presentation?',
      options: [
        'Addressing prospect concerns regarding price, timing, competition, or risk with empathy, data, value propositions, and case studies',
        'Interrupting the prospect whenever they mention a competing product',
        'Refusing to negotiate contract terms under any circumstances',
        'Terminating the call immediately when price is questioned'
      ],
      correctIndex: 0
    },
    {
      id: 12,
      question: 'What is the purpose of an SLA (Service Level Agreement) in B2B enterprise contracts?',
      options: [
        'A formal commitment defining service standards, uptime guarantees, response times, and remedies for service failures',
        'A list of sales commissions paid to account executives',
        'A marketing flyer advertising seasonal discounts',
        'An employee non-disclosure agreement (NDA)'
      ],
      correctIndex: 0
    },
    {
      id: 13,
      question: 'What is Cross-Selling versus Upselling?',
      options: [
        'Cross-selling offers complementary add-on products/services; Upselling encourages upgrading to a higher-tier or premium version of the current product',
        'Cross-selling is for B2B; Upselling is only for B2C retail',
        'Upselling reduces the overall contract value to win deals quickly',
        'There is no difference in account management'
      ],
      correctIndex: 0
    },
    {
      id: 14,
      question: 'What is a Sales Pipeline Velocity metric measuring?',
      options: [
        'The speed and efficiency at which qualified opportunities move through the pipeline to generate closed revenue over time',
        'The number of cold phone calls dialed per minute by reps',
        'The download speed of PDF proposals sent to clients',
        'The employee turnover rate in the sales department'
      ],
      correctIndex: 0
    },
    {
      id: 15,
      question: 'What is a Proof of Concept (PoC) in enterprise technology sales?',
      options: [
        'A limited trial demonstration validating that the proposed solution satisfies the client\'s critical technical and business requirements in practice',
        'A signed receipt confirming initial invoice payment',
        'A legal trademark registration document for product names',
        'A marketing survey rating customer satisfaction out of 5 stars'
      ],
      correctIndex: 0
    },
    {
      id: 16,
      question: 'What is the MEDDIC sales qualification methodology acronym?',
      options: [
        'Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion',
        'Marketing, Execution, Delivery, Design, Investment, Close',
        'Management, Enterprise, Database, Digital, Integration, Cloud',
        'Module, Evaluation, Development, Deployment, Inspection, Contract'
      ],
      correctIndex: 0
    },
    {
      id: 17,
      question: 'In cold email outreach, what is the single most important factor determining Email Open Rates?',
      options: [
        'An engaging, relevant, personalized, and non-spammy Subject Line paired with strong domain deliverability (SPF/DKIM/DMARC)',
        'Writing an email with more than 2,000 words of technical details',
        'Attaching 10 large PDF files to the email',
        'Including 20 promotional marketing links in the body'
      ],
      correctIndex: 0
    },
    {
      id: 18,
      question: 'What is Account-Based Marketing (ABM)?',
      options: [
        'A strategic B2B approach where marketing and sales teams treat high-value target enterprise accounts as individual dedicated markets with tailored campaigns',
        'Mass blasting marketing emails to 100,000 random contacts',
        'Managing bank accounts and tax accounting in QuickBooks',
        'Auditing social media ad impressions on Facebook'
      ],
      correctIndex: 0
    },
    {
      id: 19,
      question: 'What is Net Revenue Retention (NRR) and why is an NRR > 100% prized by SaaS investors?',
      options: [
        'It indicates that existing customer revenue expanded through upgrades/cross-sells more than what was lost through churn and downgrades',
        'It measures the number of new leads generated per marketing dollar',
        'It calculates the average bonus paid to sales managers',
        'It reflects the tax refund received by enterprise corporations'
      ],
      correctIndex: 0
    },
    {
      id: 20,
      question: 'What is a Closed-Won versus Closed-Lost opportunity status in CRM deal tracking?',
      options: [
        'Closed-Won indicates the contract was successfully signed and revenue secured; Closed-Lost indicates the prospect chose not to purchase or selected a competitor',
        'Closed-Won means the prospect opened the email; Closed-Lost means the email bounced',
        'Closed-Lost means the sales rep was fired from the company',
        'There is no distinction in sales reporting'
      ],
      correctIndex: 0
    }
  ]
};

/**
 * Normalizes an arbitrary candidate applied role name into the closest question bank key
 */
function normalizeRoleToBankKey(roleName) {
  const norm = (roleName || '').toLowerCase().trim();

  if (norm.includes('front') || norm.includes('react') || norm.includes('ui dev') || norm.includes('web dev')) {
    return 'Frontend Developer';
  }
  if (norm.includes('back') || norm.includes('node') || norm.includes('api') || norm.includes('database') || norm.includes('server')) {
    return 'Backend Developer';
  }
  if (norm.includes('full stack') || norm.includes('fullstack') || (norm.includes('ai') && norm.includes('engineer') && norm.includes('stack'))) {
    return 'Full Stack AI Engineer';
  }
  if (norm.includes('ai') || norm.includes('ml') || norm.includes('machine learning') || norm.includes('deep learning') || norm.includes('prompt')) {
    return 'AI/ML Engineer';
  }
  if (norm.includes('data analyst') || norm.includes('sql') || norm.includes('analytics') || norm.includes('power bi')) {
    return 'Data Analyst';
  }
  if (norm.includes('business analyst') || norm.includes('product') || norm.includes('agile') || norm.includes('scrum') || norm.includes('brd')) {
    return 'Business Analyst';
  }
  if (norm.includes('design') || norm.includes('ui/ux') || norm.includes('ux') || norm.includes('figma')) {
    return 'UI/UX Designer';
  }
  if (norm.includes('sales') || norm.includes('business development') || norm.includes('bde') || norm.includes('b2b') || norm.includes('outreach')) {
    return 'Business Development Executive';
  }

  return 'Frontend Developer'; // Default fallback
}

/**
 * Returns the exact 20 questions for a candidate role.
 * If stripAnswers is true (default for client-facing API), correctIndex and explanations are hidden.
 */
function getQuestionsForRole(roleName, stripAnswers = true) {
  const key = normalizeRoleToBankKey(roleName);
  const questions = ROLE_QUESTIONS_BANK[key] || ROLE_QUESTIONS_BANK['Frontend Developer'];

  if (!stripAnswers) {
    return questions;
  }

  return questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
}

/**
 * Evaluates candidate submission answers against the authoritative answer key.
 * Passing Threshold: 80% (>= 16 / 20).
 */
function evaluateAssessmentSubmission(roleName, candidateAnswers = {}) {
  const key = normalizeRoleToBankKey(roleName);
  const masterQuestions = ROLE_QUESTIONS_BANK[key] || ROLE_QUESTIONS_BANK['Frontend Developer'];
  const totalQuestions = masterQuestions.length;

  let correctCount = 0;
  const details = [];

  masterQuestions.forEach(q => {
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
      isCorrect,
      explanation: q.explanation || ''
    });
  });

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= 80;

  return {
    roleEvaluated: key,
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
  normalizeRoleToBankKey,
  getQuestionsForRole,
  evaluateAssessmentSubmission
};
