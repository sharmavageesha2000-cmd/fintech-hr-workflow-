/**
 * Enterprise Assessment Question Bank & Dynamic Proctoring Engine
 * Contains 35 curated domain-specific MCQs for each recruitment role (280 total).
 * 
 * Dynamic Features:
 * 1. Sampling: On each test session, randomly samples N (default 20) questions from the 35 pool without replacement.
 * 2. Question Shuffling: Shuffles the presentation order of the sampled questions.
 * 3. Option Shuffling: Fisher-Yates randomizes all 4 options per question and updates correctIndex.
 * 4. Session Answer Keys: Server caches session state in ACTIVE_ASSESSMENT_SESSIONS for secure, accurate grading.
 * 5. Threshold: >= 80% (>= 16/20 correct) triggers automated Official Job Offer & Call Letter dispatch.
 */

const ROLE_QUESTIONS_BANK = {
  "Frontend Developer": [
    {
      "id": 101,
      "question": "In React 18+, what is the primary purpose of the `useTransition` hook?",
      "options": [
        "To mark state updates as non-urgent transitions so the UI remains responsive to immediate user input",
        "To animate CSS transitions between page route changes",
        "To create WebGL transitions for 3D graphic rendering",
        "To trigger synchronous blocking DOM rendering"
      ],
      "correctIndex": 0
    },
    {
      "id": 102,
      "question": "What is the key execution difference between `useEffect` and `useLayoutEffect` in React?",
      "options": [
        "useLayoutEffect runs synchronously after DOM mutations but before the browser paints; useEffect runs asynchronously after paint",
        "useLayoutEffect runs on the Node.js server during SSR; useEffect runs in the browser",
        "useEffect blocks browser painting while useLayoutEffect never blocks",
        "useLayoutEffect cannot return a cleanup function"
      ],
      "correctIndex": 0
    },
    {
      "id": 103,
      "question": "Which CSS property combination creates a new Stacking Context without setting `z-index`?",
      "options": [
        "opacity: 0.95 or transform: translate(0, 0)",
        "color: #1e293b",
        "margin: 0 auto",
        "font-weight: 700"
      ],
      "correctIndex": 0
    },
    {
      "id": 104,
      "question": "In JavaScript (ES6+), what is the output of `typeof null` and why?",
      "options": [
        "'object' (a legacy historical bug in the initial JS implementation)",
        "'null' (a dedicated primitive type in V8)",
        "'undefined' (because null has no prototype)",
        "'boolean' (because null evaluates to false in conditionals)"
      ],
      "correctIndex": 0
    },
    {
      "id": 105,
      "question": "How does JavaScript Event Delegation work in high-performance web applications?",
      "options": [
        "Attaching a single event listener to a common ancestor element and leveraging event bubbling to inspect event.target",
        "Creating a separate event listener for every child node using a forEach loop",
        "Running event handlers in background Web Worker threads",
        "Preventing event propagation in the capturing phase on every click"
      ],
      "correctIndex": 0
    },
    {
      "id": 106,
      "question": "In Tailwind CSS, what is the exact function of the `justify-between` flex utility?",
      "options": [
        "Sets justify-content: space-between, distributing items with maximum equal spacing between them",
        "Centers items vertically along the cross axis",
        "Forces flex children to wrap onto two equal columns",
        "Hides overflowing child elements on mobile viewport widths"
      ],
      "correctIndex": 0
    },
    {
      "id": 107,
      "question": "In TypeScript, what is the fundamental safety difference between `unknown` and `any`?",
      "options": [
        "unknown is type-safe requiring type narrowing/checking before use; any disables all compiler type checks",
        "any is only for primitive types while unknown is only for object types",
        "unknown cannot be assigned from any other type",
        "There is no difference in TypeScript compiler strict mode"
      ],
      "correctIndex": 0
    },
    {
      "id": 108,
      "question": "What is the crucial advantage of functional state updates in React (e.g. `setCount(prev => prev + 1)`)?",
      "options": [
        "Ensures the update computes reliably against the latest committed state value during batched renders",
        "Bypasses the Virtual DOM and writes directly to innerHTML",
        "Converts the state into a Redux action automatically",
        "Forces an immediate synchronous garbage collection cycle"
      ],
      "correctIndex": 0
    },
    {
      "id": 109,
      "question": "Which HTTP header is required on API servers to allow cross-origin requests from specific frontend origins?",
      "options": [
        "Access-Control-Allow-Origin",
        "Content-Security-Policy-Origin",
        "Strict-Transport-Security",
        "X-Frame-Options"
      ],
      "correctIndex": 0
    },
    {
      "id": 110,
      "question": "What is the core benefit of React Server Components (RSC) compared to traditional client-side rendering?",
      "options": [
        "Zero client-side bundle size for server dependencies and direct access to backend data sources during rendering",
        "They allow browser window events (like onClick) to run directly on the server without hydration",
        "They replace CSS with server-generated SVG bitmaps",
        "They eliminate the need for any HTML parsing in the browser"
      ],
      "correctIndex": 0
    },
    {
      "id": 111,
      "question": "In JavaScript, what is the difference between a Microtask (e.g. Promise.then) and a Macrotask (e.g. setTimeout)?",
      "options": [
        "The microtask queue is drained completely after the current task before the event loop processes the next macrotask or renders",
        "Macrotasks have higher priority and always preempt microtasks",
        "Microtasks execute in parallel on multi-core threads while macrotasks are single-threaded",
        "setTimeout(fn, 0) is placed at the front of the microtask queue"
      ],
      "correctIndex": 0
    },
    {
      "id": 112,
      "question": "What does the Core Web Vital metric 'INP' (Interaction to Next Paint) measure?",
      "options": [
        "The overall responsiveness of a page by measuring the latency of all user interactions (clicks, taps, key presses) throughout the session",
        "The time taken to download the largest image on the screen",
        "The time taken to establish a TLS handshake with the server",
        "The number of layout shift pixels during initial page load"
      ],
      "correctIndex": 0
    },
    {
      "id": 113,
      "question": "What is the difference between JavaScript `WeakMap` and standard `Map`?",
      "options": [
        "WeakMap keys must be objects and are held weakly, allowing them to be garbage-collected if no other references exist",
        "WeakMap allows primitive values as keys while Map does not",
        "Map does not support iteration or size checks",
        "WeakMap values are automatically encrypted in localStorage"
      ],
      "correctIndex": 0
    },
    {
      "id": 114,
      "question": "In CSS Grid, what does `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` accomplish?",
      "options": [
        "Creates a responsive column layout that automatically fills available space and wraps columns when below 250px without media queries",
        "Fixes the container to strictly 4 columns of 250px each",
        "Forces grid items to stack vertically on all devices",
        "Limits the maximum page width to 1000px"
      ],
      "correctIndex": 0
    },
    {
      "id": 115,
      "question": "Why should you never mutate state directly in React (e.g. `state.items.push(newItem)`)?",
      "options": [
        "React relies on reference equality (`Object.is`) to detect state changes and determine when re-renders are required",
        "Direct mutation causes immediate browser memory segmentation faults",
        "React automatically throws a compile-time Babel syntax error on mutation",
        "Direct mutation converts all object properties into string types"
      ],
      "correctIndex": 0
    },
    {
      "id": 116,
      "question": "What does the `useCallback` hook memoize in React?",
      "options": [
        "The function instance reference itself between re-renders unless specified dependencies change",
        "The return value of an expensive mathematical computation",
        "The DOM node element retrieved from document.querySelector",
        "The entire JSX tree rendered by child components"
      ],
      "correctIndex": 0
    },
    {
      "id": 117,
      "question": "In TypeScript, what does the `Partial<T>` utility type produce?",
      "options": [
        "A type with all properties of T set to optional (`?`)",
        "A type with all properties of T set to readonly",
        "A type containing only the first property of T",
        "A type that excludes null and undefined from T"
      ],
      "correctIndex": 0
    },
    {
      "id": 118,
      "question": "What is CSS Reflow (Layout) and why is it more computationally expensive than Repaint?",
      "options": [
        "Reflow recalculates the geometric positions and dimensions of elements in the render tree, often triggering cascading re-calculations across parents and siblings",
        "Reflow only updates pixel colors on GPU layers",
        "Reflow occurs only when external fonts fail to load",
        "Reflow is executed on the backend Node.js server"
      ],
      "correctIndex": 0
    },
    {
      "id": 119,
      "question": "What is the purpose of the HTML5 `rel=\"noopener noreferrer\"` attribute on external `<a>` links?",
      "options": [
        "Prevents the newly opened tab from accessing `window.opener` (preventing tabnabbing attacks) and suppresses referrer headers",
        "Forces the link to download the target URL as a PDF file",
        "Improves SEO ranking by disabling Google Analytics tracking",
        "Enables smooth scrolling animations to external anchor targets"
      ],
      "correctIndex": 0
    },
    {
      "id": 120,
      "question": "In modern frontend architecture, what is 'Hydration' in SSR frameworks like Next.js?",
      "options": [
        "The process where client-side JavaScript attaches event listeners and state management to server-rendered static HTML markup",
        "Cleaning up dangling memory leaks when a single page application unmounts",
        "Prefetching image assets into the browser disk cache",
        "Minifying CSS files before deploying to CDN edge networks"
      ],
      "correctIndex": 0
    },
    {
      "id": 121,
      "question": "How does the JavaScript `Proxy` object work and what is a common use case?",
      "options": [
        "Enables intercepting and customizing fundamental operations (property lookup, assignment, enumeration) on a target object, used in reactivity systems like Vue 3",
        "Creates an encrypted VPN tunnel for HTTP requests",
        "Bypasses CORS restrictions in production browsers",
        "Compresses JSON payloads before sending over WebSocket"
      ],
      "correctIndex": 0
    },
    {
      "id": 122,
      "question": "What is the primary benefit of CSS Subgrid (`grid-template-columns: subgrid`)?",
      "options": [
        "Allows a nested grid child to inherit and align directly with the track definition of its parent grid container",
        "Generates 3D isometric perspectives in CSS",
        "Converts CSS Flexbox into an SVG vector table",
        "Automatically applies dark mode contrast adjustments"
      ],
      "correctIndex": 0
    },
    {
      "id": 123,
      "question": "In Web Performance, what does Largest Contentful Paint (LCP) measure?",
      "options": [
        "The render time of the largest image or text block visible within the initial viewport from when the page first starts loading",
        "The total size of the downloaded JavaScript bundles in megabytes",
        "The time taken to parse the stylesheet rules in the `<head>`",
        "The duration of the longest executing JavaScript task on the main thread"
      ],
      "correctIndex": 0
    },
    {
      "id": 124,
      "question": "What happens when you pass an empty dependency array `[]` to React's `useEffect`?",
      "options": [
        "The effect runs exactly once after the initial mount, and its cleanup function runs when the component unmounts",
        "The effect runs on every single state update and render cycle",
        "The effect never executes under any circumstance",
        "React throws a missing dependency warning and halts rendering"
      ],
      "correctIndex": 0
    },
    {
      "id": 125,
      "question": "In modern JavaScript, what is the difference between `Object.freeze()` and `Object.seal()`?",
      "options": [
        "Object.freeze prevents adding, deleting, and modifying existing properties; Object.seal prevents adding/deleting but allows modifying existing writable properties",
        "Object.seal prevents prototype changes while Object.freeze only works on arrays",
        "Object.freeze creates a deep clone while Object.seal creates a shallow clone",
        "Both are identical aliases introduced in ES2020"
      ],
      "correctIndex": 0
    },
    {
      "id": 126,
      "question": "What is the purpose of Service Workers in Progressive Web Apps (PWAs)?",
      "options": [
        "Acting as a programmable network proxy running in a background thread to intercept requests, enable offline caching, and handle push notifications",
        "Managing database transactions directly inside PostgreSQL",
        "Compressing server HTML templates before transmission",
        "Rendering 60fps canvas animations on the GPU"
      ],
      "correctIndex": 0
    },
    {
      "id": 127,
      "question": "In TypeScript, what does the `keyof` operator return?",
      "options": [
        "A union type of all known public property names (keys) of a given type",
        "An array of string values at runtime",
        "The total count of keys present in an object",
        "A boolean indicating if a property exists in the interface"
      ],
      "correctIndex": 0
    },
    {
      "id": 128,
      "question": "What is Debouncing in frontend event handling?",
      "options": [
        "Postponing the execution of a function until a specified idle time has elapsed since the last time the event was triggered",
        "Executing a function immediately and blocking all subsequent calls permanently",
        "Limiting function execution to a fixed rate of once every N milliseconds regardless of event frequency",
        "Splitting an array into equal-sized chunks for rendering"
      ],
      "correctIndex": 0
    },
    {
      "id": 129,
      "question": "What is Throttling in frontend event handling?",
      "options": [
        "Ensuring a function is executed at most once within a specified continuous time window, ideal for scroll and resize listeners",
        "Delaying execution until 5 seconds after user stops typing",
        "Preventing event bubbling to parent DOM elements",
        "Cancelling pending fetch requests if a new request starts"
      ],
      "correctIndex": 0
    },
    {
      "id": 130,
      "question": "In CSS, what is the difference between `display: none` and `visibility: hidden`?",
      "options": [
        "display: none removes the element from the document layout flow entirely; visibility: hidden hides the element visually while preserving its layout space and geometry",
        "visibility: hidden removes the element from the DOM tree",
        "display: none disables screen reader accessibility while visibility: hidden does not",
        "There is no visual or layout difference in modern browsers"
      ],
      "correctIndex": 0
    },
    {
      "id": 131,
      "question": "What is the Virtual DOM in React and why does React use it?",
      "options": [
        "A lightweight in-memory JavaScript representation of the real DOM used to compute efficient diffs (reconciliation) before applying batched updates to the real DOM",
        "A browser API built into Chrome for sandboxed iframe execution",
        "A server-side cache for storing SQL query results in Node.js",
        "A binary format that replaces HTML over HTTP/2"
      ],
      "correctIndex": 0
    },
    {
      "id": 132,
      "question": "What is the purpose of React `Suspense` when used with lazy components or data fetching?",
      "options": [
        "Specifies a fallback UI (e.g. skeleton or spinner) to display declaratively while asynchronous child components or resources are loading",
        "Pauses all JavaScript execution across the entire browser window",
        "Prevents the component from ever rendering if an error occurs",
        "Forces the component to render exclusively on the server"
      ],
      "correctIndex": 0
    },
    {
      "id": 133,
      "question": "In JavaScript, what is a Closure and when is it created?",
      "options": [
        "The combination of a function bundled together with references to its lexical environment, created every time a function is created at function definition time",
        "An anonymous arrow function that has no return value",
        "A method to close an open database or WebSocket connection",
        "A syntax error caused by unclosed parentheses in code"
      ],
      "correctIndex": 0
    },
    {
      "id": 134,
      "question": "In CSS, what is the specificity weight order from highest to lowest?",
      "options": [
        "Inline styles > ID selectors > Class/Attribute/Pseudo-class selectors > Element/Pseudo-element selectors",
        "ID selectors > Inline styles > Element selectors > Class selectors",
        "Class selectors > ID selectors > Element selectors > Inline styles",
        "Element selectors > Class selectors > ID selectors > Inline styles"
      ],
      "correctIndex": 0
    },
    {
      "id": 135,
      "question": "What does the `prefers-reduced-motion` CSS media feature allow developers to do?",
      "options": [
        "Detect if the user has requested the operating system to minimize non-essential animations and transitions, and adjust styling for accessibility",
        "Boost video playback framerates to 120Hz on high refresh displays",
        "Disable all CSS styling when battery saver mode is active",
        "Reduce image file sizes over slow 3G cellular connections"
      ],
      "correctIndex": 0
    }
  ],
  "Backend Developer": [
    {
      "id": 201,
      "question": "In the Node.js libuv Event Loop, in which phase are `setImmediate()` callbacks executed?",
      "options": [
        "The Check phase (immediately following the Poll phase)",
        "The Timers phase (before setTimeout callbacks)",
        "The Close callbacks phase",
        "The Microtask queue phase before any I/O"
      ],
      "correctIndex": 0
    },
    {
      "id": 202,
      "question": "What is the fundamental difference between the Node.js `Cluster` module and `Worker Threads`?",
      "options": [
        "Cluster forks separate OS processes with isolated memory spaces sharing server ports; Worker Threads share memory in a single process via SharedArrayBuffer",
        "Worker Threads are only for HTTP routing; Cluster is only for math calculations",
        "Cluster runs on the GPU; Worker Threads run on the CPU",
        "Worker Threads cannot communicate via message passing"
      ],
      "correctIndex": 0
    },
    {
      "id": 203,
      "question": "What is Stream Backpressure in Node.js I/O handling?",
      "options": [
        "A flow-control mechanism where a fast data producer pauses reading when the slow consumer's write buffer reaches its highWaterMark limit",
        "A database deadlock caused by uncommitted transactions",
        "An HTTP 504 Gateway Timeout error on reverse proxies",
        "A CPU overload caused by recursive synchronous functions"
      ],
      "correctIndex": 0
    },
    {
      "id": 204,
      "question": "In PostgreSQL, what is the difference between a B-Tree index and a GIN (Generalized Inverted Index)?",
      "options": [
        "B-Tree is optimized for scalar range and equality queries (<, =, >); GIN is optimized for composite multi-value types like JSONB, arrays, and full-text search",
        "GIN indexes only work on primary key UUID columns",
        "B-Tree indexes can only store string values up to 10 characters",
        "GIN indexes are stored exclusively in RAM and lost on server restart"
      ],
      "correctIndex": 0
    },
    {
      "id": 205,
      "question": "What is a 'Dirty Read' in database transaction isolation levels?",
      "options": [
        "A transaction reads uncommitted data written by a concurrent uncommitted transaction that might later roll back",
        "Reading corrupted disk sectors due to power failure",
        "A query that does not utilize an index scan",
        "Reading expired cache keys from Redis"
      ],
      "correctIndex": 0
    },
    {
      "id": 206,
      "question": "What is the 'N+1 Query Problem' in ORM data fetching and how is it resolved?",
      "options": [
        "Executing 1 initial query to fetch N parent records, then N separate queries for their children; resolved using Eager Loading (JOINs or batch fetching)",
        "An infinite recursive SQL query that exhausts server RAM",
        "A database table with N columns plus 1 primary key",
        "A hashing collision in a distributed database cluster"
      ],
      "correctIndex": 0
    },
    {
      "id": 207,
      "question": "Why should JWT access tokens be signed with asymmetric algorithms (e.g. RS256) instead of symmetric (HS256) in microservices?",
      "options": [
        "Auth servers sign tokens with a private key; downstream microservices verify tokens with a public key without needing or risking the private secret",
        "RS256 tokens are 90% smaller in byte payload size",
        "HS256 cannot store expiration timestamps in the payload",
        "RS256 encrypts the entire token payload so clients cannot decode base64"
      ],
      "correctIndex": 0
    },
    {
      "id": 208,
      "question": "What is the primary function of an Idempotency Key in payment and REST APIs?",
      "options": [
        "Ensures that repeating the exact same HTTP POST request (e.g. due to network timeout or retry) executes the transaction only once without duplicate side-effects",
        "Encrypts credit card numbers in transit over TLS",
        "Generates short URL slugs for database records",
        "Authenticates developer API keys against rate limits"
      ],
      "correctIndex": 0
    },
    {
      "id": 209,
      "question": "In Redis, what is the difference between the `LRU` (Least Recently Used) and `LFU` (Least Frequently Used) eviction policies?",
      "options": [
        "LRU evicts keys that have not been accessed for the longest time; LFU evicts keys with the lowest total access frequency counter",
        "LRU is only for string keys while LFU is only for hash sets",
        "LFU permanently deletes the entire database when memory is full",
        "LRU stores keys on disk while LFU stores keys in memory"
      ],
      "correctIndex": 0
    },
    {
      "id": 210,
      "question": "What is the difference between horizontal Database Partitioning and Sharding?",
      "options": [
        "Partitioning splits a large table into smaller physical chunks within a single database instance; Sharding distributes partitions across multiple independent server instances",
        "Sharding is only for NoSQL databases while partitioning is only for MySQL",
        "Partitioning requires deleting historical records older than 1 year",
        "Sharding converts relational tables into flat CSV files"
      ],
      "correctIndex": 0
    },
    {
      "id": 211,
      "question": "In microservices architecture, what is the Circuit Breaker pattern designed to prevent?",
      "options": [
        "Cascading systemic failures across dependent services by temporarily failing fast when a remote downstream service is unhealthy or unresponsive",
        "Unauthorized access by IP addresses outside corporate subnets",
        "Syntax errors in Node.js asynchronous callback chains",
        "Exceeding maximum JSON request body size limits"
      ],
      "correctIndex": 0
    },
    {
      "id": 212,
      "question": "How do Parameterized Queries (Prepared Statements) prevent SQL Injection attacks?",
      "options": [
        "The database engine pre-compiles the SQL query structure separately from user parameters, treating all user input strictly as literal data rather than executable code",
        "They convert all SQL strings into base64 before saving to disk",
        "They strip all vowels and quotation marks from user input",
        "They execute user queries inside an isolated Docker sandbox"
      ],
      "correctIndex": 0
    },
    {
      "id": 213,
      "question": "What is the difference between Message Queues (e.g. RabbitMQ) and Distributed Event Logs (e.g. Apache Kafka)?",
      "options": [
        "RabbitMQ acknowledges and deletes messages once consumed by a worker; Kafka retains immutable append-only event logs allowing multiple independent consumers to replay events",
        "RabbitMQ only supports binary protobuf while Kafka only supports plain text",
        "Kafka does not support multi-partition topic scaling",
        "RabbitMQ requires all messages to be processed synchronously on port 80"
      ],
      "correctIndex": 0
    },
    {
      "id": 214,
      "question": "What is the difference between Token Bucket and Leaky Bucket rate limiting algorithms?",
      "options": [
        "Token Bucket allows temporary traffic bursts up to bucket capacity while maintaining average rate; Leaky Bucket processes requests at a strictly constant smooth outflow rate",
        "Token Bucket requires OAuth 2.0 while Leaky Bucket is for API keys",
        "Leaky Bucket drops all requests that arrive on weekends",
        "Token Bucket is implemented entirely on client-side frontend"
      ],
      "correctIndex": 0
    },
    {
      "id": 215,
      "question": "In Node.js Express, what signature must an error-handling middleware function have?",
      "options": [
        "Exactly 4 parameters: `(err, req, res, next)`",
        "2 parameters: `(req, res)` with an async try/catch",
        "3 parameters: `(req, res, next)` returning a Promise",
        "1 parameter: `(error)` attached to process.on"
      ],
      "correctIndex": 0
    },
    {
      "id": 216,
      "question": "What is the purpose of database Connection Pooling?",
      "options": [
        "Maintains a cache of pre-established database connections that can be reused across requests, avoiding the heavy latency and overhead of opening/closing TCP handshakes",
        "Encrypts all database columns with AES-256",
        "Automatically migrates MySQL data to MongoDB",
        "Runs backup SQL dumps every 10 minutes"
      ],
      "correctIndex": 0
    },
    {
      "id": 217,
      "question": "What does ACID stand for in relational database management systems?",
      "options": [
        "Atomicity, Consistency, Isolation, Durability",
        "Asynchronous, Concurrent, Indexed, Distributed",
        "Authentication, Caching, Integrity, Deployment",
        "Availability, Consistency, In-memory, Delivery"
      ],
      "correctIndex": 0
    },
    {
      "id": 218,
      "question": "In gRPC communication, what is the primary serialization format used instead of JSON?",
      "options": [
        "Protocol Buffers (Protobuf) providing strongly-typed compact binary serialization",
        "YAML formatted strings",
        "XML SOAP envelopes",
        "BSON document streams"
      ],
      "correctIndex": 0
    },
    {
      "id": 219,
      "question": "What is the primary advantage of HTTP/2 Multiplexing over HTTP/1.1 pipelining?",
      "options": [
        "Allows interleaving multiple bidirectional request and response streams concurrently over a single TCP connection without Head-of-Line blocking at the application layer",
        "Eliminates the need for SSL/TLS certificates",
        "Forces all API responses to be formatted in WebP format",
        "Allows servers to reboot without disconnecting active users"
      ],
      "correctIndex": 0
    },
    {
      "id": 220,
      "question": "In Node.js, what is the purpose of `process.nextTick()` compared to `setImmediate()`?",
      "options": [
        "`process.nextTick()` fires immediately after the current operation finishes before the event loop advances to any other phase or macrotasks",
        "`process.nextTick()` waits for all active timers to expire",
        "`setImmediate()` runs synchronously blocking the main thread",
        "Both are identical aliases in modern V8 engines"
      ],
      "correctIndex": 0
    },
    {
      "id": 221,
      "question": "What is Change Data Capture (CDC) in data engineering and backend systems?",
      "options": [
        "A software pattern that monitors and captures row-level inserts, updates, and deletes from a database transaction log (e.g. Debezium with Postgres WAL) and streams them to event buses",
        "A Git hook that prevents developers from committing passwords",
        "An automated unit test that verifies CSS color changes",
        "A browser cache invalidation header for REST endpoints"
      ],
      "correctIndex": 0
    },
    {
      "id": 222,
      "question": "In REST API design, what makes an HTTP method 'Idempotent' according to RFC specifications?",
      "options": [
        "Making multiple identical requests has the same intended effect on server state as making a single request (e.g. GET, PUT, DELETE)",
        "The endpoint returns HTTP 200 within under 50 milliseconds",
        "The request body must be encrypted with RSA public keys",
        "The response headers must contain a Content-Length greater than zero"
      ],
      "correctIndex": 0
    },
    {
      "id": 223,
      "question": "What is the purpose of a Write-Ahead Log (WAL) in database engines?",
      "options": [
        "Ensures durability and atomicity by recording database changes to persistent disk storage before those changes are applied to in-memory data pages",
        "Logs developer debugging console.log statements to AWS CloudWatch",
        "Stores user passwords before hashing them with bcrypt",
        "Compiles SQL stored procedures into machine code"
      ],
      "correctIndex": 0
    },
    {
      "id": 224,
      "question": "What is Database Deadlock and how do modern RDBMS handle it?",
      "options": [
        "A situation where two or more transactions hold locks on resources each other needs; detected by cycle-detection algorithms in wait-for graphs, which abort and roll back one transaction",
        "When the database server hard drive runs out of physical disk space",
        "When all connections in a connection pool are closed by administrator",
        "A bug in SQL syntax that causes the parser to loop indefinitely"
      ],
      "correctIndex": 0
    },
    {
      "id": 225,
      "question": "In Redis, what is the time complexity of looking up a key by name using `GET`?",
      "options": [
        "O(1) constant average time",
        "O(N) linear time where N is total keys in the database",
        "O(log N) logarithmic binary search time",
        "O(N^2) quadratic search time"
      ],
      "correctIndex": 0
    },
    {
      "id": 226,
      "question": "What is the difference between Optimistic Concurrency Control and Pessimistic Concurrency Control in database systems?",
      "options": [
        "Optimistic allows transactions to proceed without locking and checks for version conflicts on commit; Pessimistic locks rows upfront (e.g. SELECT FOR UPDATE) to prevent concurrent writes",
        "Optimistic only works on read-only databases; Pessimistic is for write-only tables",
        "Pessimistic concurrency never allows transactions to roll back",
        "Optimistic concurrency requires running transactions on separate physical servers"
      ],
      "correctIndex": 0
    },
    {
      "id": 227,
      "question": "What is the purpose of the `Content-Security-Policy` (CSP) response header?",
      "options": [
        "Restricts the origins and resources (scripts, styles, images, frames) that the browser is permitted to load and execute for the given page, mitigating XSS and data injection",
        "Forces all backend database queries to use TLS 1.3 encryption",
        "Compresses API JSON payloads using Gzip or Brotli",
        "Sets the session cookie expiration time in the client browser"
      ],
      "correctIndex": 0
    },
    {
      "id": 228,
      "question": "In Docker containerization for Node.js backends, why is it critical to handle `SIGTERM` and `SIGINT` signals?",
      "options": [
        "Allows the application to perform graceful shutdown (closing DB connections, finishing in-flight HTTP requests) before the container engine forcefully kills the process with SIGKILL",
        "Prevents Docker from deleting the source code image layer",
        "Enables live hot-reloading in production Kubernetes clusters",
        "Automatically updates npm dependencies when the container starts"
      ],
      "correctIndex": 0
    },
    {
      "id": 229,
      "question": "What is CQRS (Command Query Responsibility Segregation) architecture?",
      "options": [
        "Separating read (query) operations and write (command) models into distinct data structures and services to optimize throughput, scalability, and security independently",
        "Using two separate React components for forms and tables",
        "Encrypting SQL queries before sending them to PostgreSQL",
        "A CSS methodology for writing scalable BEM classes"
      ],
      "correctIndex": 0
    },
    {
      "id": 230,
      "question": "In cryptography for password storage, why is `bcrypt` or `Argon2` preferred over `SHA-256`?",
      "options": [
        "They are intentionally computationally expensive and incorporate salted key-stretching with configurable work factors (and memory hardness in Argon2) to defeat GPU/ASIC brute-force attacks",
        "SHA-256 can be reversed by any basic JavaScript function",
        "bcrypt produces shorter 8-character string outputs",
        "Argon2 does not require CPU processing power"
      ],
      "correctIndex": 0
    },
    {
      "id": 231,
      "question": "What is the role of a Reverse Proxy (e.g. Nginx, Envoy, Traefik) in production backend deployments?",
      "options": [
        "Terminates SSL/TLS, balances load across backend instances, caches static responses, and shields application servers from direct public exposure",
        "Translates SQL queries into MongoDB aggregation pipelines",
        "Directly compiles TypeScript files to native x86 machine binaries",
        "Serves as the primary ACID relational database"
      ],
      "correctIndex": 0
    },
    {
      "id": 232,
      "question": "What is Event Sourcing in distributed data systems?",
      "options": [
        "Storing state changes as an immutable chronological sequence of events rather than merely overwriting the current state in a database row",
        "Listening to DOM click events in a client browser window",
        "Triggering automated email notifications when an exception occurs",
        "A technique for downloading CSV files from Google Drive"
      ],
      "correctIndex": 0
    },
    {
      "id": 233,
      "question": "What is the CAP Theorem in distributed data stores?",
      "options": [
        "A distributed data system can simultaneously guarantee at most two out of three properties: Consistency, Availability, and Partition Tolerance",
        "Cache, Application, and Persistence must always run on separate CPU sockets",
        "Client requests must be Authenticated, Processed, and Confirmed within 100ms",
        "Code, Architecture, and Performance scale in linear proportion"
      ],
      "correctIndex": 0
    },
    {
      "id": 234,
      "question": "What is the purpose of Database Index Cardinality?",
      "options": [
        "Measures the uniqueness of values in a column; high-cardinality columns (e.g. user_id, email) make highly selective and efficient B-Tree indexes",
        "The physical storage size of an index in gigabytes",
        "The number of concurrent queries executing against a table",
        "The font style used in database schema documentation"
      ],
      "correctIndex": 0
    },
    {
      "id": 235,
      "question": "In Node.js streams, what is the difference between `Readable`, `Writable`, `Duplex`, and `Transform` streams?",
      "options": [
        "Readable provides data to consume; Writable receives data; Duplex implements both independently (e.g. TCP socket); Transform is a Duplex stream where output is computed from input (e.g. zlib compression)",
        "Readable is for files; Writable is for databases; Duplex is for WebSockets; Transform is for React JSX",
        "Transform streams can only be used on Windows operating systems",
        "There is no difference in modern Node.js fetch APIs"
      ],
      "correctIndex": 0
    }
  ],
  "Full Stack AI Engineer": [
    {
      "id": 301,
      "question": "In Retrieval-Augmented Generation (RAG) pipelines, what is the primary purpose of Document Chunking?",
      "options": [
        "Breaking large documents into semantically coherent segments that fit within embedding models and LLM context windows while preserving contextual precision",
        "Encrypting proprietary company PDFs into 256-bit hash strings",
        "Converting English text into SQL table schemas automatically",
        "Compressing JPEG images inside PDF reports"
      ],
      "correctIndex": 0
    },
    {
      "id": 302,
      "question": "What is the mathematical difference between Cosine Similarity and Dot Product for normalized vector embeddings?",
      "options": [
        "When embedding vectors are L2-normalized (length = 1), cosine similarity and dot product are mathematically identical, but dot product computes faster without division",
        "Cosine similarity measures vector magnitude while dot product measures angular distance",
        "Dot product produces values between -1 and 1 while cosine similarity produces integers between 0 and 100",
        "Cosine similarity only works on 2-dimensional vectors"
      ],
      "correctIndex": 0
    },
    {
      "id": 303,
      "question": "In AI web applications, how is token streaming typically implemented between Node.js / Next.js backend and the frontend?",
      "options": [
        "Using Server-Sent Events (SSE) or readable chunked HTTP streams (`Transfer-Encoding: chunked`) to stream generated tokens to the UI as they arrive from the model",
        "Polling a REST endpoint every 10ms with setInterval",
        "Sending email attachments with partial text snippets",
        "Rendering server-side PNG images of the generated text"
      ],
      "correctIndex": 0
    },
    {
      "id": 304,
      "question": "In Vector Databases (e.g. Pinecone, pgvector, Milvus), what is an HNSW (Hierarchical Navigable Small World) index?",
      "options": [
        "A graph-based approximate nearest neighbor (ANN) search index that provides logarithmic query scaling and high recall across high-dimensional vectors",
        "A relational foreign key constraint for PostgreSQL JSONB columns",
        "A hashing algorithm used to store salted user passwords",
        "A neural network architecture that replaces transformer attention layers"
      ],
      "correctIndex": 0
    },
    {
      "id": 305,
      "question": "What is Prompt Injection and how can full-stack AI engineers defend against indirect prompt injection?",
      "options": [
        "Malicious user or external document input that hijacks LLM instructions; defended by separating system instructions from untrusted data, delimiter framing, input sanitization, and output guardrails",
        "A SQL injection that deletes vector database partitions",
        "A technique to speed up OpenAI API response latency",
        "A CSS styling injection that breaks dark mode themes"
      ],
      "correctIndex": 0
    },
    {
      "id": 306,
      "question": "What is the purpose of a Reranker (e.g. Cohere Rerank, BGE-Reranker) in advanced RAG pipelines?",
      "options": [
        "Scores the deep semantic relevance of retrieved text chunks against the user query using a cross-encoder model to re-order the top-k results before sending to the LLM",
        "Sorts SQL database records alphabetically by author name",
        "Re-indexes vector databases on disk every night",
        "Translates user prompts into multiple spoken languages"
      ],
      "correctIndex": 0
    },
    {
      "id": 307,
      "question": "How does LLM Function Calling (Tool Calling) work under the hood?",
      "options": [
        "The client provides JSON schema descriptions of tools; the LLM outputs a structured JSON object with function name and arguments; the client code executes the function and returns results back to the LLM",
        "The LLM executes arbitrary bash terminal commands directly inside the AI provider's data center",
        "The LLM generates JavaScript code and runs eval() in the user's browser without permission",
        "The client compiles the LLM into a WebAssembly binary"
      ],
      "correctIndex": 0
    },
    {
      "id": 308,
      "question": "What is Semantic Caching and how does it reduce AI inference latency and API costs?",
      "options": [
        "Storing previous prompt embeddings in a vector cache (e.g. Redis / GPTCache) and returning cached completions when a new query has high semantic similarity to a prior query",
        "Caching static CSS and JS files on Cloudflare CDN edge nodes",
        "Saving user browser cookies in local storage for 30 days",
        "Pre-generating 1,000 random AI responses on server boot"
      ],
      "correctIndex": 0
    },
    {
      "id": 309,
      "question": "In LLM generation parameters, what is the effect of setting `temperature: 0.0`?",
      "options": [
        "Makes model output deterministic and greedy, always selecting the highest-probability token at each step",
        "Disables all grammar and spell-checking filters",
        "Forces the model to generate random creative fiction",
        "Cuts API cost by exactly 50%"
      ],
      "correctIndex": 0
    },
    {
      "id": 310,
      "question": "What is the 'Lost in the Middle' phenomenon observed in long-context Large Language Models?",
      "options": [
        "LLMs retrieve and reason over information placed at the very beginning or end of extensive context prompts with much higher accuracy than information located in the middle",
        "When an API request times out at exactly 50% completion",
        "When a user closes their browser window during token streaming",
        "When a vector database drops middle chunks during index rebuilds"
      ],
      "correctIndex": 0
    },
    {
      "id": 311,
      "question": "What is LoRA (Low-Rank Adaptation) in parameter-efficient fine-tuning (PEFT)?",
      "options": [
        "Freezes pretrained base model weights and injects trainable low-rank rank-decomposition matrices into transformer attention layers, dramatically reducing memory and compute requirements",
        "A vector database index optimized for 2-bit quantization",
        "A frontend React hook for managing WebSockets",
        "A method to convert Python PyTorch models into HTML tables"
      ],
      "correctIndex": 0
    },
    {
      "id": 312,
      "question": "In full-stack AI development, what is the role of an Evaluation Framework like Ragas or TruLens?",
      "options": [
        "Automates quantifying RAG performance metrics such as Faithfulness, Answer Relevance, Context Precision, and Context Recall",
        "Measures frontend CSS rendering speed in Lighthouse",
        "Calculates sales commission payouts for marketing teams",
        "Runs automated unit tests on PostgreSQL stored procedures"
      ],
      "correctIndex": 0
    },
    {
      "id": 313,
      "question": "What is the difference between HyDE (Hypothetical Document Embeddings) and standard query embedding in RAG?",
      "options": [
        "HyDE prompts an LLM to generate a hypothetical answer first, embeds that answer, and uses its vector to search the vector database for real documents with similar semantic structure",
        "HyDE encrypts embeddings before saving them to disk",
        "HyDE replaces vector databases with relational SQL queries",
        "HyDE translates all documents into Spanish before indexing"
      ],
      "correctIndex": 0
    },
    {
      "id": 314,
      "question": "What is the purpose of Parent-Child Chunking (Hierarchical Chunking) in advanced retrieval pipelines?",
      "options": [
        "Indexes small child chunks for precise semantic search vector matching, but passes the larger parent chunk context to the LLM for rich generation context",
        "Splits CSS styling between parent divs and child spans",
        "Organizes database tables into primary-foreign key hierarchies",
        "Runs AI inference on two different servers concurrently"
      ],
      "correctIndex": 0
    },
    {
      "id": 315,
      "question": "What is the purpose of the `System Prompt` in modern chat completion APIs?",
      "options": [
        "Establishes the foundational persona, behavioral guardrails, instructions, output formatting rules, and operational boundaries for the LLM before user dialogue begins",
        "Authenticates the API secret key with the cloud server",
        "Configures the operating system kernel parameters",
        "Sets the browser window width and height"
      ],
      "correctIndex": 0
    },
    {
      "id": 316,
      "question": "In multi-agent systems (e.g. LangGraph, CrewAI), what is an Agentic Loop?",
      "options": [
        "A stateful execution cycle where an AI agent observes environment state, decides an action/tool call, executes it, inspects the tool response, and iterates until a goal condition is met",
        "An infinite while(true) loop that locks the Node.js event loop",
        "A recurring cron job that sends marketing newsletters",
        "A CSS animation loop that spins a loading wheel"
      ],
      "correctIndex": 0
    },
    {
      "id": 317,
      "question": "What is Structured Output generation (e.g. JSON Mode, Pydantic / Zod schema enforcement) in LLM APIs?",
      "options": [
        "Constraining token sampling probabilities using context-free grammars so the LLM output is guaranteed to strictly adhere to a valid JSON schema definition",
        "Formatting API responses as CSV spreadsheets",
        "Exporting database tables to XML files",
        "Converting markdown headers into HTML5 tags"
      ],
      "correctIndex": 0
    },
    {
      "id": 318,
      "question": "What is Context Window in Large Language Models?",
      "options": [
        "The maximum total number of tokens (prompt + output) that a model can process in a single forward inference pass",
        "The physical dimension of the browser viewport in pixels",
        "The number of database connections open in PostgreSQL",
        "The duration of an HTTP session cookie before expiration"
      ],
      "correctIndex": 0
    },
    {
      "id": 319,
      "question": "In AI architectures, what is Guardrailing (e.g. NeMo Guardrails, Llama Guard)?",
      "options": [
        "A safety layer of automated classifiers and rules that screens user inputs and LLM outputs for harmful, toxic, off-topic, or PII data before delivery",
        "A firewall that blocks port 80 traffic",
        "A physical lock on server rack doors in data centers",
        "A TypeScript interface that prevents null pointer exceptions"
      ],
      "correctIndex": 0
    },
    {
      "id": 320,
      "question": "What is the difference between Zero-Shot, Few-Shot, and Chain-of-Thought prompting?",
      "options": [
        "Zero-Shot provides no examples; Few-Shot provides exemplar input-output pairs; Chain-of-Thought guides the model to reason step-by-step before producing final answers",
        "Zero-Shot is for images; Few-Shot is for audio; Chain-of-Thought is for text",
        "Few-Shot requires fine-tuning model weights on GPU clusters",
        "Chain-of-Thought disables model attention layers"
      ],
      "correctIndex": 0
    },
    {
      "id": 321,
      "question": "Why are Asynchronous Background Job Queues (e.g. BullMQ, Celery) vital for AI document ingestion pipelines?",
      "options": [
        "Document parsing, OCR, chunking, and embedding generation take seconds or minutes, and background workers prevent blocking synchronous HTTP request/response lifecycles",
        "They allow vector databases to run on client mobile devices",
        "They reduce LLM token pricing by 80%",
        "They convert PDF files into binary executable code"
      ],
      "correctIndex": 0
    },
    {
      "id": 322,
      "question": "What is Quantization (e.g. GGUF, AWQ, GPTQ, INT4) in open-source LLM deployment?",
      "options": [
        "Reducing the numerical precision of model weights (e.g. from 16-bit float to 4-bit integer) to drastically lower VRAM consumption and boost inference speed with minimal accuracy loss",
        "Splitting an AI model across 100 different web browsers",
        "Encrypting AI weights with AES-GCM",
        "Translating Python model code into Rust"
      ],
      "correctIndex": 0
    },
    {
      "id": 323,
      "question": "What is Self-Querying in Vector Retrieval?",
      "options": [
        "Using an LLM to parse a natural language user query into semantic vector search text PLUS structured metadata filters (e.g. year > 2024, category = 'finance')",
        "A database query that joins a table to itself",
        "A recursive JavaScript function that searches an array",
        "An automated test that checks if the server is healthy"
      ],
      "correctIndex": 0
    },
    {
      "id": 324,
      "question": "What is the purpose of Contextual Compression in RAG pipelines?",
      "options": [
        "Extracting only the specific sentences or spans from retrieved documents that are directly relevant to the user query before passing them to the LLM, reducing token consumption",
        "Zipping PDF files into .tar.gz archives on disk",
        "Compressing server HTTP headers with Brotli",
        "Resizing PNG images to 100x100 resolution"
      ],
      "correctIndex": 0
    },
    {
      "id": 325,
      "question": "What is an Embedding Dimensionality (e.g. 1536 for text-embedding-3-small, 3072 for text-embedding-3-large)?",
      "options": [
        "The length of the dense floating-point numerical vector output by the embedding model, representing semantic features of the text in vector space",
        "The maximum character count allowed in a prompt",
        "The number of GPU compute cores utilized during training",
        "The number of languages supported by the model"
      ],
      "correctIndex": 0
    },
    {
      "id": 326,
      "question": "In RAG systems, what is 'Hallucination' and what is a primary mitigation strategy?",
      "options": [
        "When an LLM generates factually false or ungrounded assertions not supported by reference context; mitigated by strict context grounding, citations, and low temperature",
        "When a GPU overheats and throws CUDA runtime errors",
        "When a client browser drops WebSocket frames",
        "When a database query returns an empty result set"
      ],
      "correctIndex": 0
    },
    {
      "id": 327,
      "question": "What is the function of BM25 in Hybrid Search systems?",
      "options": [
        "A probabilistic lexical keyword search algorithm combined with dense vector semantic search to ensure exact keyword matches (names, IDs, codes) are not missed",
        "A deep neural network for generating realistic voice synthesis",
        "A database encryption protocol for credit cards",
        "A CSS library for styling data tables"
      ],
      "correctIndex": 0
    },
    {
      "id": 328,
      "question": "In Next.js App Router, how do Server Actions interact with AI streaming endpoints?",
      "options": [
        "They can return asynchronous readable streams (e.g. AI SDK `createDataStreamResponse`) that client components consume progressively without traditional REST boilerplate",
        "They convert client React state into server PostgreSQL tables",
        "They disable all client-side JavaScript execution",
        "They compile client JSX into server WebAssembly binaries"
      ],
      "correctIndex": 0
    },
    {
      "id": 329,
      "question": "What is Top-P (Nucleus Sampling) in generative AI token selection?",
      "options": [
        "Samples tokens from the smallest subset of candidates whose cumulative probability mass exceeds threshold P, filtering out low-probability long-tail tokens",
        "Picks strictly the top P tokens sorted alphabetically",
        "Limits prompt length to P total words",
        "Multiplies model generation speed by factor P"
      ],
      "correctIndex": 0
    },
    {
      "id": 330,
      "question": "What is the purpose of Prompt Delimiters (e.g. `\"\"\"`, `<context>`, `###`) in AI prompt engineering?",
      "options": [
        "Explicitly separates system instructions, contextual source data, and user input, helping the model avoid ambiguity and mitigating prompt injection confusion",
        "Minifies the prompt text to reduce HTTP transmission time",
        "Translates user prompts into binary machine code",
        "Formats prompt text as bold in HTML"
      ],
      "correctIndex": 0
    },
    {
      "id": 331,
      "question": "What is GraphRAG and when is it superior to standard naive vector RAG?",
      "options": [
        "Combines Knowledge Graphs with vector retrieval to extract and reason over complex multi-hop entity relationships and global thematic summaries across entire corpora",
        "Renders 3D interactive charts on frontend canvases",
        "Compresses database tables into PNG graphic files",
        "Runs vector searches exclusively on mobile devices"
      ],
      "correctIndex": 0
    },
    {
      "id": 332,
      "question": "What is the primary role of LangSmith or Phoenix Arize in production LLM applications?",
      "options": [
        "Providing full observability, tracing LLM execution chains, monitoring latency, debugging agent tool calls, and logging token usage across environments",
        "Generating automated CSS color palettes for UI design",
        "Compiling Python code into C++ libraries",
        "Managing Git merge conflicts automatically"
      ],
      "correctIndex": 0
    },
    {
      "id": 333,
      "question": "What is the difference between Dense Retrieval and Sparse Retrieval?",
      "options": [
        "Dense retrieval uses neural continuous vector embeddings (capturing semantics); Sparse retrieval uses high-dimensional term-frequency vectors like BM25/SPLADE (capturing exact keywords)",
        "Dense retrieval is for images; Sparse retrieval is for audio",
        "Sparse retrieval is only stored in browser local storage",
        "Dense retrieval cannot be searched with cosine similarity"
      ],
      "correctIndex": 0
    },
    {
      "id": 334,
      "question": "What is In-Context Learning (ICL) in Large Language Models?",
      "options": [
        "The ability of an LLM to adapt and perform novel tasks conditioned on examples and instructions provided inside the prompt without modifying model weights",
        "Fine-tuning model weights on a cluster of H100 GPUs",
        "Storing conversation history in a PostgreSQL database",
        "Training a neural network from scratch on Wikipedia"
      ],
      "correctIndex": 0
    },
    {
      "id": 335,
      "question": "Why is Rate Limiting and Token Budgeting essential in full-stack AI user interfaces?",
      "options": [
        "Prevents API quota exhaustion, mitigates malicious or runaway billing costs, and protects upstream LLM provider rate limits from denial-of-service spikes",
        "Prevents users from typing more than 10 words per second",
        "Disables dark mode when battery is low",
        "Forces users to solve CAPTCHAs before every button click"
      ],
      "correctIndex": 0
    }
  ],
  "AI/ML Engineer": [
    {
      "id": 401,
      "question": "In Transformer neural networks, what is the computational complexity of the standard Scaled Dot-Product Self-Attention mechanism with sequence length N?",
      "options": [
        "O(N^2) quadratic with respect to sequence length",
        "O(N) strictly linear",
        "O(N log N) logarithmic",
        "O(1) constant time"
      ],
      "correctIndex": 0
    },
    {
      "id": 402,
      "question": "What is the fundamental difference between the Adam and AdamW optimizers?",
      "options": [
        "AdamW decouples L2 Weight Decay from the moving gradient momentum updates, correctly regularizing weights in models with adaptive learning rates",
        "AdamW is only used for computer vision CNNs",
        "Adam does not use moving average first momentum",
        "AdamW cannot be run on Nvidia CUDA GPUs"
      ],
      "correctIndex": 0
    },
    {
      "id": 403,
      "question": "How does Rotary Position Embedding (RoPE) encode token positions in modern LLMs (e.g. LLaMA, Mistral)?",
      "options": [
        "Applies a rotational transformation matrix to Query and Key vectors in the complex plane, naturally incorporating relative positional distance via inner products",
        "Adds fixed sinusoidal absolute scalar values to the input token embeddings",
        "Appends a sequence counter integer (1, 2, 3...) to the input string",
        "Disables attention for all tokens beyond position 512"
      ],
      "correctIndex": 0
    },
    {
      "id": 404,
      "question": "What problem does FlashAttention solve during transformer training and inference?",
      "options": [
        "Overcomes GPU memory bandwidth bottlenecks by fusing attention operations and computing exact softmax via tiling without materializing large intermediate N x N attention matrices in HBM",
        "Quantizes model weights to 1-bit integers",
        "Replaces backpropagation with evolutionary algorithms",
        "Converts Python PyTorch code into C++ machine code"
      ],
      "correctIndex": 0
    },
    {
      "id": 405,
      "question": "What is the Bias-Variance Tradeoff in machine learning?",
      "options": [
        "High bias leads to underfitting (model too simple); high variance leads to overfitting (model learns training noise); total error is the sum of bias^2, variance, and irreducible error",
        "Bias is training speed; Variance is inference memory usage",
        "High variance guarantees 100% accuracy on unseen test data",
        "Bias only occurs when dataset has fewer than 100 rows"
      ],
      "correctIndex": 0
    },
    {
      "id": 406,
      "question": "What is the difference between L1 Regularization (Lasso) and L2 Regularization (Ridge)?",
      "options": [
        "L1 adds the absolute sum of weights to the loss, driving non-essential coefficients to exact zero (feature selection); L2 adds squared weights, shrinking weights smoothly toward zero",
        "L1 is only for classification; L2 is only for regression",
        "L2 regularization causes severe model underfitting in 100% of cases",
        "L1 regularization requires training on GPU clusters"
      ],
      "correctIndex": 0
    },
    {
      "id": 407,
      "question": "When evaluating a classification model on an imbalanced dataset (e.g. 99% negative, 1% positive), why is Accuracy a misleading metric?",
      "options": [
        "A trivial model that predicts negative 100% of the time achieves 99% accuracy while having 0% Recall on the critical positive class; Precision-Recall AUC or F1-Score is required",
        "Accuracy cannot be calculated on datasets with more than 2 classes",
        "Accuracy always returns negative values on imbalanced data",
        "Accuracy requires all dataset features to be normalized"
      ],
      "correctIndex": 0
    },
    {
      "id": 408,
      "question": "What is the Vanishing Gradient Problem in deep neural networks and how is it mitigated?",
      "options": [
        "Gradients become exponentially small during backpropagation through many layers (especially with Sigmoid/Tanh activations); mitigated with Residual Connections, ReLU/GELU, and normalization layers",
        "When training data is accidentally deleted from disk",
        "When learning rate is set too high causing loss to explode to NaN",
        "When the GPU runs out of VRAM memory during batch allocation"
      ],
      "correctIndex": 0
    },
    {
      "id": 409,
      "question": "What is the difference between BERT (encoder-only) and GPT (decoder-only) architectures?",
      "options": [
        "BERT uses bidirectional self-attention to see full context on both sides (ideal for classification/extraction); GPT uses causal masked self-attention to generate tokens autoregressively from left to right",
        "BERT has no attention layers while GPT has attention layers",
        "GPT can only process single-word inputs",
        "BERT was built for audio processing while GPT was built for vision"
      ],
      "correctIndex": 0
    },
    {
      "id": 410,
      "question": "What is DPO (Direct Preference Optimization) compared to traditional RLHF in LLM alignment?",
      "options": [
        "DPO optimizes policy model weights directly on human preference pairs using an exact closed-form loss function, eliminating the need to train a separate reward model and run complex PPO reinforcement learning",
        "DPO requires human annotators to write raw C++ code",
        "DPO increases training compute costs by 10x over PPO",
        "DPO is only used for computer vision image generation"
      ],
      "correctIndex": 0
    },
    {
      "id": 411,
      "question": "In Machine Learning Operations (MLOps), what is the difference between Data Drift and Concept Drift?",
      "options": [
        "Data Drift is a shift in input feature distribution P(X); Concept Drift is a shift in the statistical relationship between inputs and targets P(Y|X)",
        "Data Drift only happens on weekends; Concept Drift happens on weekdays",
        "Concept Drift means the database server has crashed",
        "Data Drift means the model code has a syntax error"
      ],
      "correctIndex": 0
    },
    {
      "id": 412,
      "question": "What is the difference between Bagging (e.g. Random Forest) and Boosting (e.g. XGBoost, LightGBM)?",
      "options": [
        "Bagging trains multiple independent trees in parallel and averages their predictions to reduce variance; Boosting trains trees sequentially where each tree corrects errors of prior trees to reduce bias",
        "Bagging is for neural networks; Boosting is for linear regression",
        "Boosting cannot handle tabular data with missing values",
        "Bagging requires gradient descent backpropagation"
      ],
      "correctIndex": 0
    },
    {
      "id": 413,
      "question": "What is Cross-Entropy Loss mathematically measuring during classification training?",
      "options": [
        "The information-theoretic divergence between the predicted probability distribution and the true one-hot ground-truth distribution: -sum(y_true * log(y_pred))",
        "The Euclidean distance between two 3D points",
        "The percentage of missing values in the input dataset",
        "The time taken to complete one forward pass in milliseconds"
      ],
      "correctIndex": 0
    },
    {
      "id": 414,
      "question": "What is Dropout in deep learning training?",
      "options": [
        "A regularization technique that randomly deactivates a fraction of neurons with probability p during training forward passes to prevent co-adaptation of features",
        "Dropping rows with missing values from the training CSV file",
        "Disconnecting slow worker nodes from a distributed training cluster",
        "Halting model training when validation loss stops improving"
      ],
      "correctIndex": 0
    },
    {
      "id": 415,
      "question": "What is Batch Normalization versus Layer Normalization in deep architectures?",
      "options": [
        "Batch Normalization normalizes activations across the batch dimension (effective in CNNs); Layer Normalization normalizes across feature/channel dimensions for each sample independently (essential in Transformers/RNNs)",
        "Batch Normalization is only applied to output labels",
        "Layer Normalization requires batch size to be at least 1024",
        "There is no mathematical difference between the two"
      ],
      "correctIndex": 0
    },
    {
      "id": 416,
      "question": "In evaluation metrics, what is the Precision-Recall Tradeoff?",
      "options": [
        "Increasing decision threshold increases Precision (fewer false positives) but lowers Recall (more false negatives); decreasing threshold increases Recall at the expense of Precision",
        "Precision and Recall are always mathematically equal in all models",
        "Higher precision always results in higher model training speed",
        "Recall cannot be calculated if True Negatives exceed 1000"
      ],
      "correctIndex": 0
    },
    {
      "id": 417,
      "question": "What is the purpose of Learning Rate Warmup in training deep transformer models?",
      "options": [
        "Gradually increases learning rate from 0 to target value during initial steps to stabilize optimization when gradients and adaptive second moments are unstable",
        "Heats up GPU physical hardware before training begins",
        "Pre-loads training images into RAM memory",
        "Ensures the model does not exceed memory limits"
      ],
      "correctIndex": 0
    },
    {
      "id": 418,
      "question": "What is Knowledge Distillation in model compression?",
      "options": [
        "Training a smaller compact 'student' model to mimic the soft probability outputs (dark knowledge) of a large, high-capacity 'teacher' model or ensemble",
        "Extracting text from PDF files using OCR models",
        "Converting Python code into documentation markdown",
        "Removing duplicate rows from a training database"
      ],
      "correctIndex": 0
    },
    {
      "id": 419,
      "question": "What is Gradient Clipping during deep neural network training?",
      "options": [
        "Capping gradient norm to a maximum threshold if it exceeds a specified limit, preventing exploding gradients from causing numerical overflow and NaN weights",
        "Deleting gradients of zero-value weights",
        "Stopping model training after 10 epochs",
        "Truncating input strings to 512 characters"
      ],
      "correctIndex": 0
    },
    {
      "id": 420,
      "question": "What is ROC-AUC (Receiver Operating Characteristic - Area Under Curve)?",
      "options": [
        "Measures classification performance across all possible classification thresholds by plotting True Positive Rate against False Positive Rate; 1.0 represents perfect discrimination",
        "The total area of the training dataset in megabytes",
        "The training duration of a convolutional neural network",
        "The percentage of positive labels in a dataset"
      ],
      "correctIndex": 0
    },
    {
      "id": 421,
      "question": "In modern neural network architectures, why is GELU (Gaussian Error Linear Unit) preferred over traditional ReLU?",
      "options": [
        "GELU weights inputs by their value rather than gating strictly by their sign, providing smooth non-zero gradients for small negative values and avoiding 'dying neuron' states",
        "GELU requires zero mathematical multiplication operations",
        "GELU converts floating point numbers into integers",
        "GELU can only be used on 1D linear layers"
      ],
      "correctIndex": 0
    },
    {
      "id": 422,
      "question": "What is the purpose of K-Fold Cross-Validation?",
      "options": [
        "Splits dataset into K equal subsets, training K models where each fold serves as validation once; provides a robust estimate of generalized model performance and reduces sample bias",
        "Multiplies model training speed by factor K",
        "Splits model weights across K separate GPUs",
        "Removes K outlier rows from the training set"
      ],
      "correctIndex": 0
    },
    {
      "id": 423,
      "question": "What is Model Pruning in deep learning deployment?",
      "options": [
        "Removing non-critical weights or entire attention heads/channels whose magnitudes are close to zero, reducing model storage and compute latency while retaining accuracy",
        "Deleting unlabelled rows from the database",
        "Stopping training when the loss reaches zero",
        "Compressing PNG images before inference"
      ],
      "correctIndex": 0
    },
    {
      "id": 424,
      "question": "What is ONNX (Open Neural Network Exchange) and why is it used?",
      "options": [
        "An open interoperable format for representing machine learning models, allowing models trained in PyTorch/TensorFlow to run on optimized runtimes (ONNX Runtime, TensorRT) across hardware",
        "A Python library for web scraping",
        "A database query language for vector search",
        "A cloud hosting provider for Django apps"
      ],
      "correctIndex": 0
    },
    {
      "id": 425,
      "question": "What is the difference between Supervised, Unsupervised, and Self-Supervised learning?",
      "options": [
        "Supervised learns from explicit human-labeled pairs (X, Y); Unsupervised finds latent patterns without labels; Self-Supervised automatically generates pseudo-labels from raw data (e.g. masked token prediction)",
        "Supervised is only for text; Unsupervised is only for images",
        "Self-Supervised learning does not require any training data",
        "Unsupervised models cannot be evaluated with mathematical metrics"
      ],
      "correctIndex": 0
    },
    {
      "id": 426,
      "question": "What is an Autoencoder neural network and what is its latent space?",
      "options": [
        "An architecture with an encoder that compresses input data into a lower-dimensional latent bottleneck representation, and a decoder that reconstructs the original input from this representation",
        "A script that automatically writes Python unit tests",
        "A database that auto-indexes incoming JSON documents",
        "A hardware controller that regulates GPU fan speeds"
      ],
      "correctIndex": 0
    },
    {
      "id": 427,
      "question": "In Machine Learning, what is the Curse of Dimensionality?",
      "options": [
        "As feature dimensions increase, data points become exponentially sparse in geometric space, distance metrics (e.g. Euclidean) lose discriminative power, and risk of overfitting spikes",
        "When a dataset contains more than 1,000,000 rows",
        "When training code takes longer than 24 hours to finish",
        "When a neural network has more than 10 hidden layers"
      ],
      "correctIndex": 0
    },
    {
      "id": 428,
      "question": "What is Word2Vec (Skip-gram vs CBOW) and what breakthrough did it establish?",
      "options": [
        "Learned continuous dense vector representations of words where words sharing semantic contexts map to proximate vector coordinates (Skip-gram predicts context from target; CBOW predicts target from context)",
        "A word processor software built for Windows 95",
        "An algorithm that converts text into binary ASCII codes",
        "A spelling checker tool for Microsoft Word"
      ],
      "correctIndex": 0
    },
    {
      "id": 429,
      "question": "What is the purpose of Triton Inference Server in enterprise AI deployments?",
      "options": [
        "An open-source server that optimizes high-throughput concurrent inference across multi-GPU/CPU clusters, supporting dynamic batching, model pipelining, and multiple framework backends",
        "A tool for creating frontend Figma design mockups",
        "A relational database that replaces PostgreSQL",
        "An email client for sending job interview offers"
      ],
      "correctIndex": 0
    },
    {
      "id": 430,
      "question": "What is the primary role of MLflow or Weights & Biases (W&B) in ML engineering?",
      "options": [
        "Experiment tracking, logging hyperparameters, tracking loss curves, versioning model artifacts, and managing model registry lifecycles",
        "Hosting frontend web applications on CDN servers",
        "Running automated lint checks on TypeScript code",
        "Generating automated PDF invoices for customers"
      ],
      "correctIndex": 0
    },
    {
      "id": 431,
      "question": "What is Early Stopping during machine learning model training?",
      "options": [
        "Monitoring validation set loss and halting training when validation performance deteriorates for a specified number of consecutive epochs (patience), preventing overfitting",
        "Pressing Ctrl+C in the terminal",
        "Shutting down the server when CPU reaches 90%",
        "Terminating model training after exactly 1 epoch"
      ],
      "correctIndex": 0
    },
    {
      "id": 432,
      "question": "What is the purpose of Data Augmentation in training vision and NLP models?",
      "options": [
        "Artificially expanding dataset diversity through label-preserving transformations (e.g. rotations, crops, synonym swaps, back-translation) to boost generalization and robustness",
        "Generating fake synthetic data to inflate company metrics",
        "Compressing dataset file size on disk",
        "Translating database schemas into SQL scripts"
      ],
      "correctIndex": 0
    },
    {
      "id": 433,
      "question": "What is Confusion Matrix in classification analysis?",
      "options": [
        "A table layout showing True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN), enabling granular diagnostic evaluation beyond raw accuracy",
        "A memory fragmentation error in C++ code",
        "A flowchart showing complex business processes",
        "An encrypted table of user password hashes"
      ],
      "correctIndex": 0
    },
    {
      "id": 434,
      "question": "What is the difference between Covariate Shift and Prior Probability Shift?",
      "options": [
        "Covariate Shift is a change in input distribution P(X) while P(Y|X) remains constant; Prior Probability Shift is a change in target label distribution P(Y) while P(X|Y) remains constant",
        "Covariate Shift only affects regression; Prior Probability Shift only affects clustering",
        "There is no mathematical distinction in statistics",
        "Prior Probability Shift requires retraining from scratch with 0 data"
      ],
      "correctIndex": 0
    },
    {
      "id": 435,
      "question": "In NLP, what is Byte-Pair Encoding (BPE) tokenization?",
      "options": [
        "A subword tokenization algorithm that iteratively merges the most frequent pairs of consecutive characters/bytes into vocabulary tokens, effectively handling rare/unknown words without huge vocabularies",
        "A method to encrypt text messages with RSA keys",
        "A file compression utility for ZIP archives",
        "A tool that checks English grammar errors in resumes"
      ],
      "correctIndex": 0
    }
  ],
  "Data Analyst": [
    {
      "id": 501,
      "question": "In SQL window functions, what is the exact difference between `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` when evaluating tied values?",
      "options": [
        "ROW_NUMBER assigns unique sequential integers (1,2,3,4); RANK leaves gaps after ties (1,2,2,4); DENSE_RANK assigns consecutive ranks without gaps (1,2,2,3)",
        "DENSE_RANK only works on integer columns while RANK works on strings",
        "ROW_NUMBER leaves gaps after ties while RANK does not",
        "There is no difference in PostgreSQL or MySQL 8.0"
      ],
      "correctIndex": 0
    },
    {
      "id": 502,
      "question": "What is a Common Table Expression (CTE) in SQL and what is its key advantage over deeply nested subqueries?",
      "options": [
        "A temporary named result set defined using the `WITH` clause that improves query readability, modularity, and enables recursive hierarchical queries",
        "A permanent table stored on disk that automatically creates primary keys",
        "A database trigger that runs whenever a row is inserted",
        "A method to export SQL results directly to Excel spreadsheets"
      ],
      "correctIndex": 0
    },
    {
      "id": 503,
      "question": "In statistics and hypothesis testing, what does a p-value represent?",
      "options": [
        "The probability of obtaining test results at least as extreme as the observed results, assuming that the null hypothesis is true",
        "The probability that the alternative hypothesis is 100% correct",
        "The percentage of missing data points in the sample",
        "The statistical power of the sample size"
      ],
      "correctIndex": 0
    },
    {
      "id": 504,
      "question": "What is Simpson's Paradox in data analysis?",
      "options": [
        "A statistical phenomenon where a clear trend or correlation appears in several distinct sub-groups of data, but disappears or reverses when the groups are combined into an aggregate",
        "When a SQL query returns duplicate rows due to a cross join",
        "When a PowerBI dashboard crashes due to out-of-memory errors",
        "When sample size is too small to compute a t-test"
      ],
      "correctIndex": 0
    },
    {
      "id": 505,
      "question": "What does the Central Limit Theorem state?",
      "options": [
        "The sampling distribution of the sample mean approaches a normal distribution as sample size N becomes sufficiently large (typically N >= 30), regardless of the population's underlying distribution",
        "All business metrics eventually decay to zero over time",
        "Median and mean are always identical in every dataset",
        "Standard deviation equals the square root of sample size"
      ],
      "correctIndex": 0
    },
    {
      "id": 506,
      "question": "In data warehouse dimensional modeling, what is the architectural difference between a Star Schema and a Snowflake Schema?",
      "options": [
        "Star Schema has denormalized dimension tables directly connected to a central fact table; Snowflake Schema normalizes dimension tables into sub-dimensions (saving space but requiring more JOINs)",
        "Star Schema is only for NoSQL; Snowflake Schema is for MySQL",
        "Snowflake Schema cannot contain numeric metric columns",
        "Star Schema stores data in encrypted JSON format on disk"
      ],
      "correctIndex": 0
    },
    {
      "id": 507,
      "question": "In cohort analysis for SaaS businesses, what is 'Retention Rate' and how is it calculated?",
      "options": [
        "The percentage of users from a specific signup cohort who remain actively engaged or subscribed at a given subsequent time period N: (Active Users in Period N / Total Cohort Size) * 100",
        "The percentage of employees who receive annual salary increases",
        "The speed at which customer support tickets are closed",
        "The ratio of website visits to marketing ad impressions"
      ],
      "correctIndex": 0
    },
    {
      "id": 508,
      "question": "What is RFM Segmentation in customer analytics?",
      "options": [
        "Recency (how recently a customer purchased), Frequency (how often they purchase), and Monetary (how much money they spend) scoring to segment customers into value tiers",
        "Revenue, Forecasting, and Marketing budget allocation formulas",
        "Rate, Fixed-cost, and Margin financial calculations",
        "Relational File Management database architecture"
      ],
      "correctIndex": 0
    },
    {
      "id": 509,
      "question": "In A/B testing, what is Statistical Power (1 - beta) and why is it crucial?",
      "options": [
        "The probability of correctly detecting a true real-world effect or difference when one actually exists (rejecting a false null hypothesis, avoiding Type II error)",
        "The speed at which the A/B test web page loads on mobile",
        "The total number of visitors participating in the experiment",
        "The confidence interval width of the revenue metric"
      ],
      "correctIndex": 0
    },
    {
      "id": 510,
      "question": "In SQL, what is the execution order of clauses in a standard query?",
      "options": [
        "FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT/OFFSET",
        "SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY",
        "WHERE -> FROM -> SELECT -> GROUP BY -> ORDER BY -> HAVING",
        "LIMIT -> SELECT -> FROM -> WHERE -> ORDER BY"
      ],
      "correctIndex": 0
    },
    {
      "id": 511,
      "question": "What is the difference between `WHERE` and `HAVING` clauses in SQL?",
      "options": [
        "WHERE filters individual rows before any aggregation takes place; HAVING filters aggregated groups after the GROUP BY calculation",
        "HAVING can only be used on string columns; WHERE is for numbers",
        "WHERE can only be used once per database session",
        "There is no functional difference in ANSI SQL standards"
      ],
      "correctIndex": 0
    },
    {
      "id": 512,
      "question": "What is Customer Lifetime Value (CLV / LTV) and what is its core financial formula?",
      "options": [
        "LTV = (Average Order Value * Purchase Frequency) * Customer Lifespan, or (Average Revenue Per User / Churn Rate) * Gross Margin",
        "LTV = Total Company Revenue / Total Employees",
        "LTV = Customer Acquisition Cost * 100",
        "LTV = Monthly Website Traffic / Bounce Rate"
      ],
      "correctIndex": 0
    },
    {
      "id": 513,
      "question": "In statistics, what is the difference between Type I Error (Alpha) and Type II Error (Beta)?",
      "options": [
        "Type I error is a False Positive (rejecting a true null hypothesis); Type II error is a False Negative (failing to reject a false null hypothesis)",
        "Type I error is calculation error; Type II error is hardware failure",
        "Type I error happens in regression; Type II error happens in clustering",
        "Type II error means the sample size is equal to zero"
      ],
      "correctIndex": 0
    },
    {
      "id": 514,
      "question": "In DAX (Power BI / Analysis Services), what is the fundamental difference between a Calculated Column and a Measure?",
      "options": [
        "Calculated Columns compute row-by-row during data refresh and consume RAM storage in the model; Measures calculate dynamically at query time based on visual filter context",
        "Measures are only stored in Excel files; Calculated columns are in SQL",
        "Calculated columns cannot use mathematical functions",
        "Measures cannot be used in visual charts"
      ],
      "correctIndex": 0
    },
    {
      "id": 515,
      "question": "What does the `EXPLAIN` or `EXPLAIN ANALYZE` command in SQL reveal to a data analyst?",
      "options": [
        "The execution query plan chosen by the query optimizer, including index scans, sequential table scans, join algorithms (hash vs nested loop), row estimates, and actual runtimes",
        "The English documentation for table columns",
        "The list of users who have read access to the database",
        "The password of the database administrator"
      ],
      "correctIndex": 0
    },
    {
      "id": 516,
      "question": "What is a Funnel Analysis and what does a high drop-off rate between step 2 and step 3 indicate?",
      "options": [
        "A method tracking conversion progression through sequential user steps; high drop-off identifies friction, usability hurdles, or technical bugs at that specific transition point",
        "An accounting method for calculating yearly tax write-offs",
        "A technique for cleaning corrupt CSV files in Python",
        "A database indexing strategy for high-concurrency writes"
      ],
      "correctIndex": 0
    },
    {
      "id": 517,
      "question": "What is the IQR (Interquartile Range) method used for in exploratory data analysis?",
      "options": [
        "Identifying outliers: IQR = Q3 - Q1; values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR are flagged as statistical outliers",
        "Calculating the compound annual growth rate (CAGR) of sales",
        "Interpolating missing timestamp values in time-series data",
        "Sorting database records alphabetically by customer country"
      ],
      "correctIndex": 0
    },
    {
      "id": 518,
      "question": "In SQL, what is the difference between `UNION` and `UNION ALL`?",
      "options": [
        "UNION combines result sets and performs an expensive distinct sort to eliminate duplicate rows; UNION ALL combines sets directly preserving all duplicates (faster)",
        "UNION ALL only works on numerical columns",
        "UNION can only join two tables while UNION ALL can join 100 tables",
        "UNION deletes the underlying tables from the database disk"
      ],
      "correctIndex": 0
    },
    {
      "id": 519,
      "question": "What is Correlation vs Causation and what statistical principle demonstrates this difference?",
      "options": [
        "Correlation measures statistical association between two variables, but does not prove one causes the other (due to potential confounding lurking variables or reverse causality)",
        "Correlation always guarantees causation in sample sizes > 1000",
        "Causation can only be proven using linear regression slopes",
        "There is no distinction in modern econometric research"
      ],
      "correctIndex": 0
    },
    {
      "id": 520,
      "question": "In time-series analytics, what is Seasonality versus Trend?",
      "options": [
        "Trend represents the long-term continuous upward or downward trajectory over years; Seasonality represents predictable, recurring cyclical patterns repeating at fixed intervals (e.g. weekly/monthly)",
        "Seasonality is only observed in agricultural commodities",
        "Trend only measures inflation in macroeconomic indicators",
        "Both are identical terms for random white noise"
      ],
      "correctIndex": 0
    },
    {
      "id": 521,
      "question": "What is a Slowly Changing Dimension (SCD Type 2) in enterprise data warehouses?",
      "options": [
        "Tracks full historical dimension changes by inserting a new record with updated values and managing validity date ranges (`start_date`, `end_date`, `is_current_flag`)",
        "Overwrites the existing record in-place without preserving history",
        "Deletes old customer records when they cancel their account",
        "A database table that only updates once per decade"
      ],
      "correctIndex": 0
    },
    {
      "id": 522,
      "question": "What is the difference between `COALESCE()` and `NULLIF()` in SQL data transformations?",
      "options": [
        "`COALESCE(val1, val2, ...)` returns the first non-null expression in the list; `NULLIF(val1, val2)` returns NULL if both expressions are equal, otherwise returns val1",
        "COALESCE deletes null rows from the table permanently",
        "NULLIF converts all negative numbers to positive integers",
        "Both functions are obsolete in modern ANSI SQL"
      ],
      "correctIndex": 0
    },
    {
      "id": 523,
      "question": "What is the Net Promoter Score (NPS) and how is it mathematically calculated?",
      "options": [
        "NPS = % Promoters (scores 9-10) minus % Detractors (scores 0-6), measuring customer loyalty and satisfaction on a scale from -100 to +100",
        "NPS = Total Website Visitors / Total Converted Leads",
        "NPS = Net Revenue minus Cost of Goods Sold",
        "NPS = Average Customer Age * Total Purchases"
      ],
      "correctIndex": 0
    },
    {
      "id": 524,
      "question": "What is a Self-Join in SQL and what is a classic real-world use case?",
      "options": [
        "Joining a table to itself using aliases, commonly used to query hierarchical data such as finding an employee's manager in an `employees (id, manager_id)` table",
        "Joining two completely unrelated tables without a foreign key",
        "A join that deletes duplicate primary keys",
        "A query that copies table data into a temporary CSV file"
      ],
      "correctIndex": 0
    },
    {
      "id": 525,
      "question": "In statistics, what is Standard Deviation versus Variance?",
      "options": [
        "Variance is the average of squared differences from the mean; Standard Deviation is the square root of variance, expressed in the same physical units as the original data",
        "Standard Deviation is always larger than variance in all samples",
        "Variance can only be calculated on normal distributions",
        "Standard Deviation is only used for coin toss probability"
      ],
      "correctIndex": 0
    },
    {
      "id": 526,
      "question": "What does the `LEAD()` and `LAG()` window functions allow an analyst to do in SQL?",
      "options": [
        "Access data from subsequent rows (`LEAD`) or preceding rows (`LAG`) within the same partition without writing self-joins, ideal for calculating period-over-period growth",
        "Slow down query execution to prevent database CPU spikes",
        "Automatically convert string columns into datetime formats",
        "Export data to Google Sheets via API triggers"
      ],
      "correctIndex": 0
    },
    {
      "id": 527,
      "question": "What is Customer Churn Rate and how is it calculated for a monthly billing period?",
      "options": [
        "Churn Rate = (Customers Lost During Month / Customers at Start of Month) * 100",
        "Churn Rate = Total Monthly Revenue / Total New Signups",
        "Churn Rate = Average Customer Support Ticket Response Time",
        "Churn Rate = Number of Marketing Emails Bounced"
      ],
      "correctIndex": 0
    },
    {
      "id": 528,
      "question": "In data modeling, what is the difference between Fact Tables and Dimension Tables?",
      "options": [
        "Fact Tables store quantitative numerical measurements, metrics, and foreign keys (e.g. sales amount, quantity); Dimension Tables contain descriptive contextual attributes (e.g. customer name, store location)",
        "Dimension Tables store transactions; Fact Tables store employee names",
        "Fact Tables are only kept in memory; Dimension Tables are on disk",
        "There is no distinction in relational database architecture"
      ],
      "correctIndex": 0
    },
    {
      "id": 529,
      "question": "What is Data Granularity (Grain) in business intelligence?",
      "options": [
        "The exact level of detail or depth represented by a single row in a table (e.g. one transaction per invoice line item vs one row per daily store summary)",
        "The physical speed of hard drive read/write sectors",
        "The font size used in executive dashboard presentations",
        "The number of decimal places stored in currency columns"
      ],
      "correctIndex": 0
    },
    {
      "id": 530,
      "question": "In Python data analytics with Pandas, what is the difference between `df.loc[]` and `df.iloc[]`?",
      "options": [
        "`df.loc[]` accesses data by label/index name and boolean conditions; `df.iloc[]` accesses data strictly by integer positional index (0, 1, 2...)",
        "`df.iloc[]` is only used for SQL queries",
        "`df.loc[]` modifies data on disk while `df.iloc[]` creates temporary copies",
        "Both are identical aliases in modern Pandas versions"
      ],
      "correctIndex": 0
    },
    {
      "id": 531,
      "question": "What is the purpose of Data Normalization (1NF, 2NF, 3NF) in operational database design?",
      "options": [
        "Minimizes data redundancy, prevents insertion/update/deletion anomalies, and ensures data integrity by decomposing tables into structured logical relations",
        "Speeds up analytical aggregations by denormalizing all columns into one table",
        "Translates database table column names into uppercase",
        "Encrypts data rows before transmitting over the network"
      ],
      "correctIndex": 0
    },
    {
      "id": 532,
      "question": "What is Mean Absolute Error (MAE) versus Root Mean Squared Error (RMSE) in regression evaluation?",
      "options": [
        "MAE treats all error magnitudes linearly; RMSE squares errors before averaging and taking square root, penalizing large outlier errors much more severely",
        "MAE is for classification; RMSE is for regression",
        "RMSE can only produce positive integers between 0 and 10",
        "MAE always returns negative values on financial datasets"
      ],
      "correctIndex": 0
    },
    {
      "id": 533,
      "question": "What is the difference between an Inner Join, Left Outer Join, Full Outer Join, and Cross Join?",
      "options": [
        "Inner returns matching rows in both; Left returns all left rows plus matching right; Full returns all rows from both; Cross returns Cartesian product (all combinations)",
        "Left Join deletes non-matching rows from the left table on disk",
        "Cross Join can only join tables with identical column names",
        "Full Outer Join is not supported by any relational database engine"
      ],
      "correctIndex": 0
    },
    {
      "id": 534,
      "question": "In marketing analytics, what is Attribution Modeling (e.g. First-Touch, Last-Touch, Linear, Time-Decay)?",
      "options": [
        "A framework for assigning credit or financial value to various customer touchpoints and marketing channels along the buyer journey leading to a conversion",
        "Attributing server crashes to specific software engineers",
        "Calculating employee annual tax withholdings",
        "Tracking GPS coordinates of mobile delivery trucks"
      ],
      "correctIndex": 0
    },
    {
      "id": 535,
      "question": "What is the purpose of a Pareto Chart (80/20 Rule) in diagnostic business analysis?",
      "options": [
        "A combination bar and line chart displaying individual values in descending order with a cumulative percentage line, highlighting that ~80% of problems or revenue stem from ~20% of causes/customers",
        "A 3D pie chart showing weekly employee attendance",
        "A scatter plot used to identify GPU thermal bottlenecks",
        "A flowchart mapping corporate organizational hierarchies"
      ],
      "correctIndex": 0
    }
  ],
  "Business Analyst": [
    {
      "id": 601,
      "question": "What is the primary difference between a Business Requirements Document (BRD) and a Functional Requirements Document (FRD)?",
      "options": [
        "A BRD outlines high-level business objectives, problem statements, and scope from stakeholder perspective; an FRD details granular technical specifications, system behavior, and workflows for engineering",
        "A BRD is written in Python; an FRD is written in SQL",
        "An FRD is for marketing only while a BRD is for investors",
        "There is no difference in modern product management"
      ],
      "correctIndex": 0
    },
    {
      "id": 602,
      "question": "In Agile Scrum, what does the INVEST mnemonic stand for when writing high-quality User Stories?",
      "options": [
        "Independent, Negotiable, Valuable, Estimable, Small, Testable",
        "Innovative, New, Valuable, Efficient, Secure, Timely",
        "Interactive, Networked, Visual, Editable, Scalable, Tested",
        "Iterative, Numeric, Verified, Estimated, Standardized, Tracked"
      ],
      "correctIndex": 0
    },
    {
      "id": 603,
      "question": "What is the purpose of a RACI Matrix in project stakeholder governance?",
      "options": [
        "Clarifying roles and decision rights: Responsible, Accountable, Consulted, and Informed for each project deliverable and milestone",
        "Calculating financial Return on Investment (ROI)",
        "Estimating sprint story points in Planning Poker",
        "Measuring software bug severity in QA testing"
      ],
      "correctIndex": 0
    },
    {
      "id": 604,
      "question": "What does a Gap Analysis evaluate in enterprise business architecture?",
      "options": [
        "The difference between the current operational state (As-Is) and the desired future target state (To-Be) to identify required capabilities and steps",
        "The salary difference between junior and senior developers",
        "The latency gap between frontend and backend APIs",
        "The physical distance between corporate branch offices"
      ],
      "correctIndex": 0
    },
    {
      "id": 605,
      "question": "In UML Use Case diagramming, what does an «extend» relationship represent between two use cases?",
      "options": [
        "An optional or conditional behavior that extends the base use case only under specific extension point triggers",
        "A mandatory base workflow that must always execute unconditionally",
        "A database table foreign key relationship",
        "A network connection between two servers"
      ],
      "correctIndex": 0
    },
    {
      "id": 606,
      "question": "What is the primary objective of a Sprint Retrospective in Agile methodology?",
      "options": [
        "Reflecting on the past sprint to identify continuous process improvements, what went well, what could be improved, and actionable team commitments",
        "Assigning blame for uncompleted user stories to junior developers",
        "Negotiating annual salary bonuses with leadership",
        "Writing technical code documentation for client sign-off"
      ],
      "correctIndex": 0
    },
    {
      "id": 607,
      "question": "What is the fundamental difference between Functional Requirements and Non-Functional Requirements (NFRs)?",
      "options": [
        "Functional requirements specify what features and behaviors the system must perform; Non-functional requirements specify quality criteria (performance, latency, security, scalability, uptime)",
        "Functional requirements are optional while non-functional are mandatory",
        "Non-functional requirements only apply to physical hardware",
        "Functional requirements cannot be tested by QA engineers"
      ],
      "correctIndex": 0
    },
    {
      "id": 608,
      "question": "In Business Process Model and Notation (BPMN), what do Swimlanes represent in a workflow diagram?",
      "options": [
        "Different organizational departments, roles, or actors responsible for executing specific sub-processes and activities",
        "Database tables stored in relational schemas",
        "Network firewall subnets and IP ranges",
        "Sprint timeline weeks on a Gantt chart"
      ],
      "correctIndex": 0
    },
    {
      "id": 609,
      "question": "What does a SWOT Analysis evaluate for strategic business planning?",
      "options": [
        "Strengths, Weaknesses, Opportunities, and Threats (evaluating internal organizational capabilities and external market dynamics)",
        "Software, Web, Optimization, and Telemetry",
        "Sales, Workflows, Operations, and Targets",
        "Security, Wireframes, Outputs, and Tests"
      ],
      "correctIndex": 0
    },
    {
      "id": 610,
      "question": "What is Requirement Elicitation and what are its standard enterprise techniques?",
      "options": [
        "The practice of discovering, gathering, and researching requirements from stakeholders using interviews, focus workshops, surveys, observation, and document analysis",
        "Writing automated unit tests in JavaScript",
        "Designing SQL database schemas in MySQL Workbench",
        "Deploying cloud servers to AWS EC2"
      ],
      "correctIndex": 0
    },
    {
      "id": 611,
      "question": "In User Story formulation, what is the role of Acceptance Criteria (Definition of Done)?",
      "options": [
        "Pre-defined testable conditions that a software feature must satisfy for a user story to be accepted by the Product Owner as complete and deployable",
        "The minimum price a customer is willing to pay for a feature",
        "The job description requirements for hiring developers",
        "The password complexity rules for user login"
      ],
      "correctIndex": 0
    },
    {
      "id": 612,
      "question": "What is the purpose of a Stakeholder Power-Interest Grid (Influence-Interest Matrix)?",
      "options": [
        "Categorizing stakeholders to determine the appropriate communication strategy (Manage Closely, Keep Satisfied, Keep Informed, Monitor)",
        "Calculating sales commission payouts for account managers",
        "Ranking developer coding velocity in GitHub commits",
        "Selecting third-party software vendor contracts"
      ],
      "correctIndex": 0
    },
    {
      "id": 613,
      "question": "What does a PESTLE Analysis assess in macro-environmental market research?",
      "options": [
        "Political, Economic, Sociocultural, Technological, Legal, and Environmental external factors impacting business viability",
        "Process, Estimation, Strategy, Timeline, Leadership, and Execution",
        "Product, Engineering, Sales, Testing, Logistics, and Enterprise",
        "Protocols, Encryption, Servers, Tokens, Latency, and Edge"
      ],
      "correctIndex": 0
    },
    {
      "id": 614,
      "question": "What is a Minimum Viable Product (MVP) and why is it prioritized first?",
      "options": [
        "A version of a new product with just enough core features to be usable by early adopters and validate core business hypotheses with minimal capital risk",
        "The cheapest prototype made with paper wireframe mockups",
        "A fully featured software application ready for public IPO launch",
        "A temporary database backup created during server migration"
      ],
      "correctIndex": 0
    },
    {
      "id": 615,
      "question": "In Agile Scrum, what is the definition of Team Velocity?",
      "options": [
        "The average amount of user story points a Scrum team delivers and marks as 'Done' during a single sprint iteration",
        "The download speed of the application over 5G cellular networks",
        "The time taken to deploy code from Git to production",
        "The number of client meetings held per business quarter"
      ],
      "correctIndex": 0
    },
    {
      "id": 616,
      "question": "What is the purpose of Root Cause Analysis (e.g. 5 Whys, Ishikawa / Fishbone Diagram)?",
      "options": [
        "Systematically identifying the fundamental underlying reason for an operational failure or business defect rather than merely addressing surface symptoms",
        "Tracking employee daily office attendance",
        "Calculating quarterly financial tax deductions",
        "Testing API response times across international regions"
      ],
      "correctIndex": 0
    },
    {
      "id": 617,
      "question": "What is Change Management in enterprise software implementation?",
      "options": [
        "A structured methodology for transitioning individuals, teams, and organizations from the current operational state to a desired future state smoothly with high adoption",
        "Changing developer login passwords every 30 days",
        "Modifying Git branch names before a merge commit",
        "Upgrading computer monitor hardware in the office"
      ],
      "correctIndex": 0
    },
    {
      "id": 618,
      "question": "In requirements management, what does a Requirements Traceability Matrix (RTM) ensure?",
      "options": [
        "Bi-directional mapping of each business requirement forward to design specifications, development tasks, and test cases to ensure zero requirements are missed or untested",
        "Tracking employee physical locations via GPS security badges",
        "Measuring network packet loss between microservices",
        "Calculating cloud hosting costs per database query"
      ],
      "correctIndex": 0
    },
    {
      "id": 619,
      "question": "What is Scope Creep and how does an experienced Business Analyst prevent it?",
      "options": [
        "Uncontrolled growth of project scope without adjustments to time, budget, or resources; managed through formal Change Request evaluation and baseline approval processes",
        "A software bug that causes memory leaks in React",
        "A slow internet connection during client demos",
        "When developers work overtime without logging hours"
      ],
      "correctIndex": 0
    },
    {
      "id": 620,
      "question": "What is the purpose of MoSCoW Prioritization framework in backlog refinement?",
      "options": [
        "Categorizing requirements into Must-have, Should-have, Could-have, and Won't-have (this time) to align stakeholder expectations with delivery capacity",
        "Sorting backlog tasks alphabetically by task name",
        "Assigning tasks to developers based on seniority",
        "Calculating the budget in US Dollars versus Euros"
      ],
      "correctIndex": 0
    },
    {
      "id": 621,
      "question": "What does a UML Use Case Diagram visually capture in system modeling?",
      "options": [
        "The interactions and system boundaries between external actors (users, third-party systems) and the system's key functional capabilities",
        "The internal relational database foreign key constraints",
        "The physical wiring of data center server racks",
        "The corporate organizational chart of executive leadership"
      ],
      "correctIndex": 0
    },
    {
      "id": 622,
      "question": "In financial feasibility analysis, what does Return on Investment (ROI) measure?",
      "options": [
        "ROI = ((Net Financial Gain - Cost of Investment) / Cost of Investment) * 100, evaluating the financial profitability and efficiency of a proposed project",
        "The time taken to write 10,000 lines of code",
        "The percentage of happy customer survey responses",
        "The number of server CPU cores utilized during peak hours"
      ],
      "correctIndex": 0
    },
    {
      "id": 623,
      "question": "What is a Business Process Re-engineering (BPR) initiative?",
      "options": [
        "Radically redesigning core enterprise workflows and business processes from the ground up to achieve dramatic improvements in cost, quality, speed, and service",
        "Reinstalling Windows operating system on employee laptops",
        "Rewriting SQL queries to use subqueries",
        "Redesigning the corporate company logo"
      ],
      "correctIndex": 0
    },
    {
      "id": 624,
      "question": "What is a User Persona in human-centered requirements engineering?",
      "options": [
        "A research-grounded, semi-fictional archetypal representation of a target user segment detailing their goals, pain points, behaviors, and technical comfort",
        "A celebrity hired for product marketing video campaigns",
        "A fake customer account created for QA penetration testing",
        "An anonymous IP address connecting through a proxy"
      ],
      "correctIndex": 0
    },
    {
      "id": 625,
      "question": "In Agile Scrum, who holds the sole ultimate authority to prioritize items in the Product Backlog?",
      "options": [
        "The Product Owner",
        "The Lead Backend Engineer",
        "The Scrum Master",
        "The External Marketing Consultant"
      ],
      "correctIndex": 0
    },
    {
      "id": 626,
      "question": "What does a Feasibility Study evaluate prior to project kickoff?",
      "options": [
        "Technical, economic, operational, legal, and schedule viability (TELOS framework) of a proposed business solution before major capital commitment",
        "The speed of developer typing tests",
        "The office air conditioning temperature",
        "The number of coffee machines required in the breakroom"
      ],
      "correctIndex": 0
    },
    {
      "id": 627,
      "question": "What is an Entity Relationship Diagram (ERD) used for in business analysis?",
      "options": [
        "Modeling business data entities, their attributes, and cardinality relationships (1:1, 1:N, N:M) to structure requirements for engineering",
        "Visualizing sales commission payouts over time",
        "Showing the daily schedule of Scrum meetings",
        "Mapping the physical floor plan of the corporate office"
      ],
      "correctIndex": 0
    },
    {
      "id": 628,
      "question": "What is the primary purpose of a Daily Standup (Scrum) meeting?",
      "options": [
        "A brief 15-minute synchronization where team members share what they accomplished, what they plan to do today, and identify any active blockers",
        "A detailed 2-hour technical architecture code review",
        "An executive budget and contract negotiation meeting",
        "A presentation of completed features to external clients"
      ],
      "correctIndex": 0
    },
    {
      "id": 629,
      "question": "In stakeholder requirements gathering, what is a Focus Group?",
      "options": [
        "A guided qualitative discussion with a curated group of target users/stakeholders to gather attitudes, feedback, and reactions to product concepts",
        "A group of developers fixing urgent production server bugs",
        "A team of accountants auditing corporate tax records",
        "A private Slack channel for company founders"
      ],
      "correctIndex": 0
    },
    {
      "id": 630,
      "question": "What is a KPI (Key Performance Indicator) and how does a BA establish one?",
      "options": [
        "A quantifiable metric used to measure progress toward specific strategic organizational goals, structured with baseline values, targets, and time horizons",
        "A password key used to access JIRA dashboards",
        "A physical security badge required to enter office buildings",
        "A programming language used for database triggers"
      ],
      "correctIndex": 0
    },
    {
      "id": 631,
      "question": "What does Benchmarking accomplish in competitive strategy analysis?",
      "options": [
        "Comparing an organization's internal business processes and performance metrics against industry best practices and leading competitors to identify performance gaps",
        "Measuring CPU benchmark scores on gaming computers",
        "Checking employee clock-in times on Monday mornings",
        "Testing SQL query execution times on local SQLite"
      ],
      "correctIndex": 0
    },
    {
      "id": 632,
      "question": "What is the purpose of a Business Case document?",
      "options": [
        "Providing formal justification for undertaking a project, detailing expected strategic benefits, financial cost-benefit analysis, risk assessment, and alternatives",
        "A legal lawsuit filed against an external software vendor",
        "A technical user manual for installing desktop drivers",
        "A spreadsheet of employee personal emergency contact phone numbers"
      ],
      "correctIndex": 0
    },
    {
      "id": 633,
      "question": "In Agile Scrum, what is a 'Spike' story?",
      "options": [
        "A time-boxed research or technical exploration task aimed at resolving uncertainty, gathering knowledge, or assessing architectural risk before estimation",
        "A sudden spike in server CPU utilization during peak hours",
        "An urgent critical bug reported directly by the CEO",
        "A cancelled sprint due to unexpected national holidays"
      ],
      "correctIndex": 0
    },
    {
      "id": 634,
      "question": "What is User Acceptance Testing (UAT) in the software development lifecycle?",
      "options": [
        "The final validation phase where actual end users and business stakeholders verify that the software meets real-world business requirements before production launch",
        "Automated unit tests written by backend developers in Jest",
        "A load test to check if the server handles 10,000 requests per second",
        "An interview screening test given to candidates applying for BA roles"
      ],
      "correctIndex": 0
    },
    {
      "id": 635,
      "question": "What does a Context Diagram (Level 0 Data Flow Diagram) depict in system analysis?",
      "options": [
        "The highest-level conceptual view showing external entities (actors, systems), data inputs/outputs, and representing the entire proposed system as a single central process",
        "A detailed diagram of internal database foreign keys and indexes",
        "A low-level assembly code flowchart",
        "A CSS styling wireframe for mobile application screens"
      ],
      "correctIndex": 0
    }
  ],
  "UI/UX Designer": [
    {
      "id": 701,
      "question": "In Figma, what is the primary benefit of using Auto Layout on UI components?",
      "options": [
        "Creating dynamic responsive components whose padding, gap spacing, and child alignment adapt automatically to content changes and container resizing",
        "Automatically translating English UI text into 50 languages",
        "Exporting React JSX code directly to AWS production servers",
        "Encrypting design files with SHA-256 passwords"
      ],
      "correctIndex": 0
    },
    {
      "id": 702,
      "question": "What does the 60-30-10 Rule dictate in visual UI color palette design?",
      "options": [
        "60% dominant neutral background color, 30% secondary structural color (cards/containers), and 10% accent color for primary call-to-actions and key focus areas",
        "60% white text, 30% black background, 10% gray borders",
        "60% opacity for modals, 30% opacity for tooltips, 10% opacity for shadows",
        "60% images, 30% text, 10% buttons on web pages"
      ],
      "correctIndex": 0
    },
    {
      "id": 703,
      "question": "What is the core principle of Jakob's Law in user experience psychology?",
      "options": [
        "Users spend most of their time on other websites, meaning they expect your site to work similarly to familiar design conventions they already know",
        "Users click on the largest button on the screen 90% of the time",
        "Dark mode reduces eye strain by exactly 50%",
        "Web pages must load in less than 1.0 second"
      ],
      "correctIndex": 0
    },
    {
      "id": 704,
      "question": "What is Fitts's Law in interactive design and how does it influence UI button placement?",
      "options": [
        "The time required to rapidly move to a target area is a function of the ratio between distance to target and width of target; making primary buttons large and easily accessible reduces interaction friction",
        "Every web page must feature at least 5 clickable buttons",
        "Users read web pages from bottom to top in Asian markets",
        "Font size must be twice the icon size on mobile screens"
      ],
      "correctIndex": 0
    },
    {
      "id": 705,
      "question": "According to WCAG 2.1 AA accessibility guidelines, what is the minimum required color contrast ratio for normal body text against its background?",
      "options": [
        "4.5:1 for normal text (and 3:1 for large text >= 18pt or 14pt bold)",
        "2:1 for all text types",
        "10:1 strictly for all typography",
        "7:1 only for mobile screens"
      ],
      "correctIndex": 0
    },
    {
      "id": 706,
      "question": "What is Hick's Law in UX decision-making and navigation design?",
      "options": [
        "The time it takes to make a decision increases logarithmically with the number and complexity of choices presented; reducing choices streamlines user action",
        "Users never scroll past the initial hero banner",
        "Mobile apps should never have more than 3 screens",
        "Designers should always use serif typography for headers"
      ],
      "correctIndex": 0
    },
    {
      "id": 707,
      "question": "What is the 8pt Spatial Grid System and why is it an industry standard in digital product design?",
      "options": [
        "Using increments of 8px (8, 16, 24, 32, 48...) for all sizing, padding, and margins ensures visual rhythm, clean visual hierarchy, and scales seamlessly across diverse device display densities",
        "Limits website layouts to strictly 8 columns total",
        "Restricts design teams to 8 total colors in their UI palette",
        "Requires all buttons to have 8px border radius"
      ],
      "correctIndex": 0
    },
    {
      "id": 708,
      "question": "What is the difference between an Affordance and a Signifier in interaction design (Don Norman)?",
      "options": [
        "An Affordance is the actual possible physical/digital action of an object (e.g. a button can be clicked); a Signifier is the perceptible signal indicating where/how that action should take place (e.g. drop shadow, label)",
        "An Affordance is the price of an app; a Signifier is the app icon",
        "Signifiers are only used in physical hardware design",
        "There is no conceptual difference in UX theory"
      ],
      "correctIndex": 0
    },
    {
      "id": 709,
      "question": "In Figma, what are Component Variants and Component Properties?",
      "options": [
        "Variants allow grouping multiple variations of a component (e.g. primary, secondary, disabled, hover) into a single master component set with configurable properties (boolean, text, instance swap)",
        "A plugin that automatically writes React unit tests",
        "A cloud hosting feature that deploys static websites",
        "An export setting for generating animated GIF files"
      ],
      "correctIndex": 0
    },
    {
      "id": 710,
      "question": "What is the Five-Stage Design Thinking framework established by Stanford d.school?",
      "options": [
        "Empathize -> Define -> Ideate -> Prototype -> Test",
        "Wireframe -> Code -> Deploy -> Market -> Sell",
        "Plan -> Estimate -> Build -> QA -> Release",
        "Research -> Interview -> Design -> Animate -> Deliver"
      ],
      "correctIndex": 0
    },
    {
      "id": 711,
      "question": "What is Progressive Disclosure in UI design and what problem does it solve?",
      "options": [
        "An interaction pattern that presents only essential information upfront and reveals advanced details or controls only upon user request, reducing initial cognitive overload",
        "Loading images progressively from low to high resolution over slow networks",
        "Disclosing user personal information to marketing advertisers",
        "Gradually increasing subscription prices over time"
      ],
      "correctIndex": 0
    },
    {
      "id": 712,
      "question": "What is Miller's Law (The Magical Number Seven, Plus or Minus Two) in cognitive psychology?",
      "options": [
        "The average human working memory can hold approximately 7 (+/- 2) chunks of information at any given time, underscoring the need to chunk complex UI information",
        "Web pages must load in under 7 seconds",
        "Navigation bars should never exceed 2 menu items",
        "Users will abandon a form if it contains more than 7 words"
      ],
      "correctIndex": 0
    },
    {
      "id": 713,
      "question": "What is an Empathy Map in UX user research and what are its four quadrants?",
      "options": [
        "A collaborative visualization tool that captures user perspective across four quadrants: Says, Thinks, Does, and Feels",
        "A chart showing company financial quarterly revenue",
        "A diagram mapping server response latencies across continents",
        "A wireframe showing mobile navigation drawer animations"
      ],
      "correctIndex": 0
    },
    {
      "id": 714,
      "question": "In UX research, what is the difference between Open Card Sorting and Closed Card Sorting?",
      "options": [
        "Open Card Sorting allows participants to sort topics into categories and create their own category names (generative IA); Closed Card Sorting provides pre-defined categories for participants to sort into (evaluative IA)",
        "Open Card Sorting is done online; Closed Card Sorting is on paper",
        "Closed Card Sorting is only used for credit card checkout flows",
        "Open Card Sorting does not involve real users"
      ],
      "correctIndex": 0
    },
    {
      "id": 715,
      "question": "What is the primary difference between a Low-Fidelity Wireframe and a High-Fidelity Prototype?",
      "options": [
        "Low-fidelity wireframes focus on structural layout, content hierarchy, and workflow without visual styling; high-fidelity prototypes incorporate rich branding, realistic typography, animations, and interactive transitions",
        "Low-fidelity wireframes are written in HTML; high-fidelity in Figma",
        "High-fidelity prototypes can never be tested with users",
        "Low-fidelity wireframes are only drawn by developers"
      ],
      "correctIndex": 0
    },
    {
      "id": 716,
      "question": "What are Design Tokens in a scalable Design System?",
      "options": [
        "Platform-agnostic semantic key-value pairs (storing colors, spacing, typography, shadows) that synchronize design files in Figma with production CSS/codebases seamlessly",
        "Cryptocurrency tokens rewarded to top UI designers",
        "Password tokens used to log into Figma enterprise accounts",
        "Temporary cookie identifiers stored in user browsers"
      ],
      "correctIndex": 0
    },
    {
      "id": 717,
      "question": "What is Nielsen's Heuristic 'Visibility of System Status' in interaction design?",
      "options": [
        "The system should always keep users informed about what is going on, through appropriate feedback within reasonable time (e.g. loading spinners, progress bars, success toasts)",
        "Displaying the server CPU load on the customer homepage",
        "Showing the company's stock price in the footer",
        "Making all background images 100% transparent"
      ],
      "correctIndex": 0
    },
    {
      "id": 718,
      "question": "What is the Gestalt Principle of Proximity in visual UI hierarchy?",
      "options": [
        "Elements placed close together are perceived by the human brain as belonging to the same related conceptual group or functional context",
        "Larger objects are always perceived as more expensive",
        "Items with the same color are assumed to be clickable",
        "Diagonal lines create a sense of futuristic technology"
      ],
      "correctIndex": 0
    },
    {
      "id": 719,
      "question": "What is a Customer Journey Map (CJM) in service and UX design?",
      "options": [
        "A comprehensive visual narrative mapping a user's end-to-end timeline through stages, touchpoints, thoughts, emotions, pain points, and opportunities across an experience",
        "A Google Maps widget showing store branch driving directions",
        "A flowchart of server database replication topologies",
        "A spreadsheet calculating monthly advertising spend"
      ],
      "correctIndex": 0
    },
    {
      "id": 720,
      "question": "What is the 'Doherty Threshold' in computer-human interaction?",
      "options": [
        "Productivity and user engagement soar when a computer and its users interact at a pace that ensures neither has to wait more than 400 milliseconds for visual feedback",
        "Users leave an application if it takes more than 10 clicks to buy",
        "The maximum number of fonts allowed in a design system is 2",
        "Screen brightness should automatically dim by 50% at night"
      ],
      "correctIndex": 0
    },
    {
      "id": 721,
      "question": "In mobile UX, what is the 'Thumb Zone' (Steven Hoober)?",
      "options": [
        "The natural area of a smartphone screen that can be easily and comfortably reached with one thumb without shifting hand grip; critical for bottom navigation and primary action placement",
        "A biometric fingerprint scanner on the side of modern phones",
        "The top 10% of the screen where status icons are placed",
        "A gesture that zooms in on product catalog photos"
      ],
      "correctIndex": 0
    },
    {
      "id": 722,
      "question": "What is the difference between Qualitative Usability Testing and Quantitative Usability Testing?",
      "options": [
        "Qualitative focuses on direct observations, feelings, user reasoning, and 'why' users struggle; Quantitative measures numerical benchmarks ('how many', task completion time, success rates, SUS scores)",
        "Qualitative is for mobile; Quantitative is for desktop",
        "Quantitative testing never involves real human participants",
        "Qualitative testing requires running A/B tests with 100,000 users"
      ],
      "correctIndex": 0
    },
    {
      "id": 723,
      "question": "What is the System Usability Scale (SUS) and what score indicates above-average usability?",
      "options": [
        "A standard 10-item questionnaire measuring usability perception on a 0-100 scale; an average SUS benchmark score is 68 (scores >= 80 indicate high excellence)",
        "A scale measuring server uptime from 0% to 100%",
        "A hardware test measuring monitor pixel density",
        "A tool that checks JavaScript bundle size"
      ],
      "correctIndex": 0
    },
    {
      "id": 724,
      "question": "What is Atomic Design methodology (Brad Frost) in UI design systems?",
      "options": [
        "A modular design framework breaking interfaces into a five-level hierarchy: Atoms -> Molecules -> Organisms -> Templates -> Pages",
        "A chemical engineering design tool for laboratory equipment",
        "Designing UI interfaces using nuclear physics algorithms",
        "A coding pattern for writing CSS within JavaScript files"
      ],
      "correctIndex": 0
    },
    {
      "id": 725,
      "question": "What is Nielsen's Heuristic 'Error Prevention' in form and transaction design?",
      "options": [
        "Designing interfaces to eliminate error-prone conditions or presenting users with confirmations and constraints before they commit critical actions (e.g. destructive deletion modals, auto-complete)",
        "Disabling all user form inputs permanently",
        "Hiding error messages so users remain calm",
        "Automatically fixing database bugs on the server"
      ],
      "correctIndex": 0
    },
    {
      "id": 726,
      "question": "In visual UI design, what is Skeuomorphism versus Flat Design versus Neumorphism?",
      "options": [
        "Skeuomorphism mimics real-world textures/bevels; Flat Design strips all 3D illusions for minimalism; Neumorphism uses soft dual drop-shadows on monochromatic backgrounds to create embossed/debossed plastic effects",
        "Flat design is for mobile; Skeuomorphism is for smart watches; Neumorphism is for VR headsets",
        "Skeuomorphism was invented in 2024 by Google",
        "Flat design requires all buttons to have 3D bevels"
      ],
      "correctIndex": 0
    },
    {
      "id": 727,
      "question": "What is the Peak-End Rule in psychological user experience (Kahneman)?",
      "options": [
        "People judge an experience largely based on how they felt at its most intense emotional point (the peak) and at its conclusion (the end), rather than the total average of every moment",
        "The top of a web page is always read more than the bottom",
        "Users abandon apps when their battery falls below 10%",
        "Web applications receive peak traffic at 11:59 PM"
      ],
      "correctIndex": 0
    },
    {
      "id": 728,
      "question": "What is the primary role of Micro-Interactions in digital product design (Dan Saffer)?",
      "options": [
        "Small, single-purpose visual/haptic feedback loops (e.g. toggles, like animations, pull-to-refresh) that provide delight, clarify system status, and enhance tactile user engagement",
        "Short 5-second video advertisements on social media",
        "Small text footnotes placed in website footers",
        "Background API calls that fetch small JSON objects"
      ],
      "correctIndex": 0
    },
    {
      "id": 729,
      "question": "What is Dark Pattern (Deceptive Design) in UX and why should it be avoided?",
      "options": [
        "User interface tricks designed to manipulate or deceive users into taking unintended actions (e.g. hidden recurring subscriptions, disguised ads, roach motels), which damage user trust and violate regulations",
        "Using dark mode styling on banking applications",
        "Designing UI wireframes using black marker pens",
        "A CSS styling bug that causes background colors to turn black"
      ],
      "correctIndex": 0
    },
    {
      "id": 730,
      "question": "What is the purpose of ARIA (Accessible Rich Internet Applications) attributes in UI design and frontend development?",
      "options": [
        "Supplying semantic labels, roles, and live states (e.g. `aria-expanded`, `aria-label`) to assistive technologies (screen readers) when native HTML elements are insufficient",
        "Generating automated 3D graphic animations",
        "Encrypting form data before sending to server",
        "Speeding up web page load times on 4G networks"
      ],
      "correctIndex": 0
    },
    {
      "id": 731,
      "question": "What is the difference between Skeuomorphic shadows and Elevation Shadows in Material Design?",
      "options": [
        "Material Elevation shadows use standardized z-axis ambient and key-light drop shadows to convey depth and physical elevation hierarchy on a clean virtual plane",
        "Elevation shadows only appear on iPhone displays",
        "Material Design does not use any shadows",
        "Skeuomorphic shadows require WebGL 3D rendering"
      ],
      "correctIndex": 0
    },
    {
      "id": 732,
      "question": "What is the Zeigarnik Effect and how is it utilized in onboarding progress indicators?",
      "options": [
        "People remember uncompleted or interrupted tasks better than completed ones; visual progress bars (e.g. 'Profile 75% Complete') motivate users to finish onboarding workflows",
        "Users forget passwords after 7 days of inactivity",
        "Red buttons cause feelings of urgency in shopping checkouts",
        "Users read website text in a strict Z-pattern"
      ],
      "correctIndex": 0
    },
    {
      "id": 733,
      "question": "What is the difference between Usability and Utility in product design?",
      "options": [
        "Utility is whether the product provides the features and capabilities users need to accomplish their goals; Usability is how easy, intuitive, and pleasant those features are to use",
        "Utility is for backend servers; Usability is for frontend UI",
        "Usability measures database speed; Utility measures network bandwidth",
        "There is no distinction in design terminology"
      ],
      "correctIndex": 0
    },
    {
      "id": 734,
      "question": "In typographic UI design, what is the recommended optimal line length for readable body text paragraphs?",
      "options": [
        "45 to 75 characters per line (including spaces) to prevent reader eye fatigue during line transitions",
        "10 to 20 characters per line",
        "150 to 200 characters per line",
        "Strictly 5 words per line on all devices"
      ],
      "correctIndex": 0
    },
    {
      "id": 735,
      "question": "What is Guerrilla Usability Testing?",
      "options": [
        "A fast, low-cost qualitative research technique where designers take a prototype into public spaces (e.g. coffee shops, offices) and ask passersby for brief 5-10 minute feedback",
        "Automated testing performed by artificial intelligence bots",
        "Security penetration testing against malicious hackers",
        "Testing software without the developers knowing"
      ],
      "correctIndex": 0
    }
  ],
  "Business Development Executive": [
    {
      "id": 801,
      "question": "In enterprise B2B sales, what does the BANT qualification framework stand for?",
      "options": [
        "Budget, Authority, Need, Timeline",
        "Brand, Audience, Network, Target",
        "Business, Action, Negotiation, Term",
        "Billing, Acquisition, Net-worth, Traction"
      ],
      "correctIndex": 0
    },
    {
      "id": 802,
      "question": "What does MEDDIC stand for in enterprise SaaS deal qualification?",
      "options": [
        "Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion",
        "Marketing, Engagement, Demand, Deliverable, Income, Contract",
        "Management, Evaluation, Development, Discovery, Investment, Customer",
        "Monthly, Enterprise, Digital, Direct, Inbound, Closing"
      ],
      "correctIndex": 0
    },
    {
      "id": 803,
      "question": "What is Customer Acquisition Cost (CAC) and what is its standard formula?",
      "options": [
        "CAC = Total Sales and Marketing Expenses in a Period / Total New Customers Acquired in that Period",
        "CAC = Total Company Revenue / Total Current Customers",
        "CAC = Average Contract Value * Gross Margin",
        "CAC = Monthly Recurring Revenue * 12"
      ],
      "correctIndex": 0
    },
    {
      "id": 804,
      "question": "What is the ideal LTV:CAC ratio for a healthy, high-growth SaaS enterprise business?",
      "options": [
        "3:1 or higher (meaning lifetime gross profit generated is at least 3x the cost to acquire the customer)",
        "1:1 (breaking even on customer acquisition)",
        "0.5:1 (spending twice as much to acquire customers)",
        "100:1 (which is typical for all seed-stage startups)"
      ],
      "correctIndex": 0
    },
    {
      "id": 805,
      "question": "What is the difference between Inbound and Outbound sales prospecting?",
      "options": [
        "Inbound attracts prospects who proactively engage with marketing content/forms; Outbound involves sales reps proactively identifying, researching, and contacting targeted cold leads",
        "Inbound is only conducted via postal mail; Outbound is via telephone",
        "Outbound requires zero market research before calling",
        "Inbound never requires a product demonstration"
      ],
      "correctIndex": 0
    },
    {
      "id": 806,
      "question": "In consultative selling, what is the primary purpose of the 'Discovery Call'?",
      "options": [
        "Uncovering the prospect's strategic business challenges, operational pain points, workflows, financial impact, and decision process before pitching solutions",
        "Delivering a 60-minute feature-heavy PowerPoint monologue",
        "Demanding an immediate credit card payment on the first minute",
        "Asking the prospect for their social media passwords"
      ],
      "correctIndex": 0
    },
    {
      "id": 807,
      "question": "What is Net Revenue Retention (NRR) and why is an NRR > 100% prized by enterprise SaaS investors?",
      "options": [
        "Measures revenue retained from existing customers over a period including expansion/upsells minus churn/downgrades; > 100% means the business grows even without acquiring new customers",
        "The percentage of marketing emails opened by prospective leads",
        "The tax refund received by enterprise corporations annually",
        "The average sales bonus commission paid to top BDE reps"
      ],
      "correctIndex": 0
    },
    {
      "id": 808,
      "question": "What is an Internal Champion in enterprise B2B sales?",
      "options": [
        "An influential stakeholder within the prospect's organization who personally benefits from your solution, has access to decision-makers, and actively advocates for your deal internally",
        "The top-performing sales representative of the quarter",
        "An external paid consultant who writes negative reviews",
        "A software algorithm that sends cold emails automatically"
      ],
      "correctIndex": 0
    },
    {
      "id": 809,
      "question": "What is Value-Based Selling compared to Feature-Based Selling?",
      "options": [
        "Value-Based Selling quantifies and links the solution directly to the prospect's business ROI, cost savings, and strategic revenue goals; Feature-Based merely lists technical specifications",
        "Value-Based Selling means offering a 90% discount on every deal",
        "Feature-Based Selling is only used for selling real estate",
        "There is no difference in modern sales methodology"
      ],
      "correctIndex": 0
    },
    {
      "id": 810,
      "question": "How should an experienced BDE handle a prospect's objection: 'Your product is too expensive compared to Competitor X'?",
      "options": [
        "Acknowledge and validate the concern, reframe conversation around total cost of ownership (TCO) and ROI differences, and demonstrate specific high-value business capabilities competitor lacks",
        "Immediately cut the price by 50% without asking questions",
        "Argue aggressively that Competitor X is a terrible company",
        "Hang up the phone and mark the deal as Closed-Lost"
      ],
      "correctIndex": 0
    },
    {
      "id": 811,
      "question": "What is Account-Based Marketing (ABM) in enterprise B2B growth?",
      "options": [
        "A highly coordinated strategy where sales and marketing treat specific high-value target accounts as individual markets, delivering customized outreach and bespoke content to buying committees",
        "Sending 100,000 generic promotional blast emails to random contacts",
        "Auditing accounting and tax ledgers in QuickBooks",
        "Purchasing social media ad impressions on Facebook"
      ],
      "correctIndex": 0
    },
    {
      "id": 812,
      "question": "In cold email deliverability and outreach, what do SPF, DKIM, and DMARC DNS records prevent?",
      "options": [
        "Email spoofing, domain impersonation, and phishing, ensuring high inbox deliverability rates and protecting domain sender reputation",
        "Slow internet loading speeds on company landing pages",
        "SQL injection attacks on the CRM database",
        "Recipients from forwarding company emails to competitors"
      ],
      "correctIndex": 0
    },
    {
      "id": 813,
      "question": "What is Sales Pipeline Velocity and what are its four key variables?",
      "options": [
        "Velocity = (Number of Qualified Opportunities * Average Deal Size * Win Rate %) / Average Sales Cycle Length (Days)",
        "Velocity = Total Phone Calls Made / Total Days in Quarter",
        "Velocity = Total Revenue / Total Number of Sales Reps",
        "Velocity = Number of Marketing Emails Sent * Open Rate"
      ],
      "correctIndex": 0
    },
    {
      "id": 814,
      "question": "What is an Economic Buyer in enterprise sales qualification?",
      "options": [
        "The individual with the formal fiduciary authority to release budget and approve commercial funds for the purchase, regardless of who manages the evaluation",
        "A junior intern who tests free trial accounts",
        "An external academic economist who forecasts GDP growth",
        "The accountant who prints monthly bank statements"
      ],
      "correctIndex": 0
    },
    {
      "id": 815,
      "question": "What is a Master Services Agreement (MSA) versus a Statement of Work (SOW)?",
      "options": [
        "An MSA establishes overarching legal terms, liabilities, IP rights, and indemnities; an SOW defines specific project deliverables, timelines, milestones, and payment schedules under that MSA",
        "An SOW is for marketing only while an MSA is for sales only",
        "An MSA is signed by developers while an SOW is signed by clients",
        "There is no legal distinction between the two documents"
      ],
      "correctIndex": 0
    },
    {
      "id": 816,
      "question": "In B2B sales negotiations, what is 'Concession Trading'?",
      "options": [
        "Never giving away a price discount or commercial term without securing an equal value trade-off in return (e.g. longer contract term, upfront annual payment, case study rights)",
        "Giving all client requests for free to close deals quickly",
        "Refusing to speak with clients until they sign the contract",
        "Trading company stock options with external vendors"
      ],
      "correctIndex": 0
    },
    {
      "id": 817,
      "question": "What is the difference between Annual Recurring Revenue (ARR) and Total Contract Value (TCV)?",
      "options": [
        "ARR represents the annualized recurring subscription value of a contract; TCV represents the full cumulative value of the multi-year contract including one-time implementation and onboarding fees",
        "ARR only measures monthly billing; TCV measures yearly billing",
        "TCV does not include customer subscription fees",
        "ARR can only be calculated on one-time professional service gigs"
      ],
      "correctIndex": 0
    },
    {
      "id": 818,
      "question": "What is a Service Level Agreement (SLA) in commercial software enterprise contracts?",
      "options": [
        "A legally binding commitment defining guaranteed performance benchmarks (e.g. 99.9% uptime, maximum ticket response times) and financial remedies/credits if breached",
        "A resume summary of the lead software engineer",
        "A marketing brochure showcasing customer testimonials",
        "An invoice sent for initial software trial setup"
      ],
      "correctIndex": 0
    },
    {
      "id": 819,
      "question": "What is the primary role of a CRM system (e.g. Salesforce, HubSpot) in pipeline management?",
      "options": [
        "Centralizing customer interactions, tracking deal stage progression, forecasting revenue, managing follow-up tasks, and maintaining authoritative pipeline governance",
        "Hosting frontend web applications on cloud servers",
        "Designing UI mockups and prototypes in Figma",
        "Running automated unit tests on backend databases"
      ],
      "correctIndex": 0
    },
    {
      "id": 820,
      "question": "What is a Request for Proposal (RFP) in institutional enterprise procurement?",
      "options": [
        "A formal structured document issued by enterprise buyers inviting qualified vendors to bid and submit detailed proposals outlining technical capabilities, pricing, and compliance",
        "A request by an employee to take annual vacation leave",
        "An automated alert when a server runs out of disk space",
        "A receipt sent to customers after online credit card payment"
      ],
      "correctIndex": 0
    },
    {
      "id": 821,
      "question": "In cold calling and outbound prospecting, what is the 'Pattern Interrupt' technique?",
      "options": [
        "Saying or doing something unexpected in the opening 5 seconds (e.g. 'I know you weren't expecting my call...') to break the prospect's automatic defensive telemarketing rejection reflex",
        "Hanging up the phone after 1 ring to make the prospect curious",
        "Playing loud rock music in the background during the call",
        "Speaking in a robotic monotone voice to simulate AI"
      ],
      "correctIndex": 0
    },
    {
      "id": 822,
      "question": "What is CAC Payback Period and why do finance teams monitor it closely?",
      "options": [
        "The number of months required for a customer's gross profit contribution to fully recover the sales and marketing capital invested to acquire them (target: < 12 months)",
        "The time taken to print annual financial tax reports",
        "The duration of an employee's initial probation period",
        "The number of days an invoice can remain unpaid before penalty"
      ],
      "correctIndex": 0
    },
    {
      "id": 823,
      "question": "What is a Mutual Action Plan (MAP) in enterprise B2B sales cycles?",
      "options": [
        "A shared, collaborative project timeline established between vendor and prospect outlining milestones, stakeholder responsibilities, and evaluation dates required to reach successful go-live",
        "A non-disclosure agreement signed before sharing passwords",
        "A marketing plan for running joint Facebook ad campaigns",
        "A corporate legal settlement between competing firms"
      ],
      "correctIndex": 0
    },
    {
      "id": 824,
      "question": "In sales qualification, what is the 'SPIN Selling' methodology (Neil Rackham)?",
      "options": [
        "Situation, Problem, Implication, Need-Payoff questioning sequence that guides prospects to articulate the acute cost of inaction and the high value of resolving their problem",
        "Speed, Price, Innovation, Negotiation closing techniques",
        "Social, Public, Inbound, Network lead generation",
        "Sales, Pitch, Invoice, Net-revenue pipeline tracking"
      ],
      "correctIndex": 0
    },
    {
      "id": 825,
      "question": "What is an ICP (Ideal Customer Profile) and how does it differ from a Buyer Persona?",
      "options": [
        "An ICP defines the ideal organizational account (company size, industry, revenue, tech stack); a Buyer Persona defines the specific individual human decision-maker within that account (title, goals, pain points)",
        "An ICP is for marketing; a Buyer Persona is for engineering",
        "An ICP cannot include company revenue data",
        "Both are identical terms in enterprise sales terminology"
      ],
      "correctIndex": 0
    },
    {
      "id": 826,
      "question": "What is a 'Proof of Concept' (PoC) or Pilot in enterprise deal execution?",
      "options": [
        "A time-boxed, scoped evaluation where the vendor deploys the software with defined success criteria to prove measurable business value before committing to a full enterprise rollout",
        "A signed legal confession of software copyright infringement",
        "A printed receipt proving payment of sales tax",
        "A marketing video demonstrating imaginary future features"
      ],
      "correctIndex": 0
    },
    {
      "id": 827,
      "question": "In SaaS contract negotiations, why do buyers request an 'Opt-Out for Cause' clause?",
      "options": [
        "Allows the customer to terminate the contract and receive a prorated refund if the software suffers persistent material breaches or fails to meet contractual SLA uptime standards",
        "Allows the customer to cancel whenever they find a cheaper alternative",
        "Enables the buyer to resell the software to third parties",
        "Forces the vendor to hire the customer's engineering staff"
      ],
      "correctIndex": 0
    },
    {
      "id": 828,
      "question": "What is the role of a Business Development Representative (BDR/SDR) versus an Account Executive (AE)?",
      "options": [
        "BDRs/SDRs focus on top-of-funnel lead generation, prospecting, and qualifying initial meetings; AEs conduct discovery, lead demonstrations, negotiate commercial terms, and close deals",
        "BDRs write code; AEs manage corporate marketing budgets",
        "AEs only work on customer support helpdesks",
        "BDRs have sole authority to sign enterprise legal contracts"
      ],
      "correctIndex": 0
    },
    {
      "id": 829,
      "question": "What is Gross Margin in software business models and why is ~80% typical for pure SaaS?",
      "options": [
        "Gross Margin = ((Revenue - Cost of Goods Sold) / Revenue) * 100; high in SaaS because incremental software delivery (cloud hosting, third-party APIs) costs very little per user",
        "Gross Margin is the salary paid to executive management",
        "Gross Margin measures the physical size of server hardware",
        "Gross Margin is always negative in profitable corporations"
      ],
      "correctIndex": 0
    },
    {
      "id": 830,
      "question": "What is 'Pipeline Hygiene' and why is it essential for accurate sales forecasting?",
      "options": [
        "Regularly reviewing and updating CRM deals to remove stalled zombie opportunities, verify accurate close dates, and ensure deal values reflect realistic probabilities",
        "Sanitizing office computer keyboards every morning",
        "Deleting all contacts who did not reply within 1 hour",
        "Automating bulk email blasts to outdated lead lists"
      ],
      "correctIndex": 0
    },
    {
      "id": 831,
      "question": "In enterprise sales strategy, what is 'Land and Expand'?",
      "options": [
        "Closing an initial low-friction deal with a small team or single department (Land), delivering massive value, and subsequently upselling across other business units and enterprise tiers (Expand)",
        "Purchasing commercial real estate land for corporate data centers",
        "Launching physical retail stores in foreign countries",
        "Merging two competing software corporations together"
      ],
      "correctIndex": 0
    },
    {
      "id": 832,
      "question": "What is a 'Negative Reversal' in Sandler Sales methodology?",
      "options": [
        "Tactfully leaning in the opposite direction of the prospect's hesitation (e.g. 'It sounds like this might not be the right fit for your team right now...') prompting them to defend their interest",
        "Reversing a credit card charge on a customer account",
        "Cancelling an ongoing sales contract without notice",
        "Admitting that your software product has severe security flaws"
      ],
      "correctIndex": 0
    },
    {
      "id": 833,
      "question": "What is Total Addressable Market (TAM) versus Serviceable Obtainable Market (SOM)?",
      "options": [
        "TAM is the total market demand for a product category worldwide; SOM is the specific, realistic portion of that market that the company can realistically capture in the short term",
        "TAM is for small startups; SOM is for Fortune 500 enterprises",
        "SOM measures the total number of employees in a company",
        "TAM can only be calculated in US Dollars"
      ],
      "correctIndex": 0
    },
    {
      "id": 834,
      "question": "What is the purpose of an Executive Summary in a commercial proposal?",
      "options": [
        "A concise 1-page high-level synthesis tailored for C-suite decision-makers that outlines the business challenge, proposed solution, financial impact, and strategic ROI",
        "A detailed list of all software source code repositories",
        "A table showing hourly developer salaries",
        "A copy of the company's certificate of incorporation"
      ],
      "correctIndex": 0
    },
    {
      "id": 835,
      "question": "What is 'Churn Prevention' and why is post-sale customer onboarding critical for long-term LTV?",
      "options": [
        "Proactively ensuring customers achieve fast Time-to-Value (TTV) during initial implementation, driving deep feature adoption and eliminating early dissatisfaction that causes cancellation",
        "Locking customer credit cards so they cannot cancel subscriptions",
        "Sending marketing emails every 10 minutes to inactive users",
        "Disabling customer support phone numbers"
      ],
      "correctIndex": 0
    }
  ]
};

// In-memory active session cache with 3-hour TTL
const ACTIVE_ASSESSMENT_SESSIONS = new Map();
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
 * Randomly samples 'sampleCount' (default 20) questions from the role's 35 pool,
 * shuffles the question order, and Fisher-Yates shuffles the 4 options for each question.
 */
function generateSessionAssessment(roleName, options = {}) {
  cleanupExpiredSessions();

  const key = normalizeRoleToBankKey(roleName);
  const pool = ROLE_QUESTIONS_BANK[key] || ROLE_QUESTIONS_BANK['Frontend Developer'];
  const sampleCount = Math.min(options.sampleCount || 20, pool.length);

  // 1. Fisher-Yates sample without replacement
  const shuffledPool = shuffleArray(pool);
  const sampled = shuffledPool.slice(0, sampleCount);

  // 2. Further randomize question presentation order
  const presentationQuestions = shuffleArray(sampled);

  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const answerKey = {};
  const masterQuestions = [];
  const clientQuestions = [];

  // 3. For each question, shuffle options and compute new correct index
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
  normalizeRoleToBankKey,
  generateSessionAssessment,
  getQuestionsForRole,
  evaluateAssessmentSubmission
};
