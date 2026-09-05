const fs = require('fs');
const path = require('path');

console.log('[Mega 800 Builder] Compiling enterprise 800-question assessment engine...');

const baseModule = require('./assessment_questions');
const currentBank = JSON.parse(JSON.stringify(baseModule.ROLE_QUESTIONS_BANK));

// Helper
function makeQ(id, question, options, correctIndex = 0, explanation = '') {
  return {
    id,
    question,
    options,
    correctIndex,
    explanation: explanation || `Option ${String.fromCharCode(65 + correctIndex)} is the accurate verified response for this scenario.`
  };
}

// Ensure each of the 8 roles reaches exactly 100 questions (800 total)
const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack AI Engineer',
  'AI/ML Engineer',
  'Data Analyst',
  'Business Analyst',
  'UI/UX Designer',
  'Business Development Executive'
];

// Load extra questions for each domain
const extraFrontend = require('./scratch_extra_frontend').EXTRA_FRONTEND;

// Additional 50 for Backend Developer (IDs 251-300)
const extraBackend = [
  makeQ(251, "In Node.js Libuv architecture, what is the default size of the Worker Thread Pool and how do you configure it?", [
    "Default is 4 threads; configured via the `UV_THREADPOOL_SIZE` environment variable (up to 128 threads)",
    "Default is 16 threads; configured in package.json",
    "Default is 1 thread; configured via `process.maxThreads`",
    "Default is unlimited; automatically scales based on CPU load"
  ]),
  makeQ(252, "In PostgreSQL, what is the key performance benefit of a BRIN (Block Range Index)?", [
    "Extremely compact index size for very large tables where data is naturally physically sorted (e.g. timestamps, auto-increment IDs)",
    "Enables full-text search across JSONB columns",
    "Prevents table deadlocks during concurrent INSERT operations",
    "Encrypts database tables at rest"
  ]),
  makeQ(253, "What does `AsyncLocalStorage` in Node.js provide?", [
    "Stores data across asynchronous execution chains (callbacks, promises, async/await), ideal for request-scoped context like trace IDs and user sessions",
    "Replaces Redis for distributed caching across microservices",
    "Saves files to the server hard drive asynchronously",
    "Encrypts HTTP cookies in transit"
  ]),
  makeQ(254, "In microservices architecture, what is the 'Saga Pattern' used for?", [
    "Managing distributed transactions across multiple microservices using a sequence of local transactions coordinated via events or an orchestrator",
    "Compressing REST API payloads using Brotli",
    "Monitoring server CPU and memory usage",
    "Generating OpenAPI Swagger documentation"
  ]),
  makeQ(255, "What is the core difference between PostgreSQL `SERIALIZABLE` and `READ COMMITTED` transaction isolation levels?", [
    "`SERIALIZABLE` guarantees transactions execute as if run serially, preventing phantom reads and serialization anomalies; `READ COMMITTED` only guarantees reads see committed data",
    "`READ COMMITTED` locks the entire database table for writes",
    "`SERIALIZABLE` allows dirty reads of uncommitted transactions",
    "`READ COMMITTED` is only supported in SQLite"
  ]),
  makeQ(256, "In Redis caching, what is the 'Cache Stampede' (Thundering Herd) problem?", [
    "When a popular cached key expires, and thousands of concurrent requests simultaneously hit the database to recompute the value",
    "When Redis runs out of RAM and crashes",
    "When network packets are dropped by the firewall",
    "When Redis replication lag exceeds 5 seconds"
  ]),
  makeQ(257, "How does the 'Token Bucket' rate-limiting algorithm operate?", [
    "Tokens are added to a bucket at a constant rate; each request consumes a token, allowing controlled bursts up to the bucket capacity while maintaining an average rate",
    "Blocks all IP addresses that send more than 1 request per second",
    "Generates a unique JWT token for every HTTP request",
    "Stores IP addresses in an array and resets every 24 hours"
  ]),
  makeQ(258, "In Kafka, what is the purpose of 'Consumer Groups'?", [
    "Allows a group of consumer instances to divide partition consumption for horizontal throughput scaling, ensuring each partition is read by only one consumer in the group",
    "Encrypts Kafka messages using TLS",
    "Deletes old messages from Kafka topics after 7 days",
    "Filters messages based on SQL WHERE clauses"
  ]),
  makeQ(259, "What does the `pg_stat_activity` dynamic view in PostgreSQL allow database administrators to do?", [
    "Inspect currently running queries, lock waits, client connections, and transaction durations in real time",
    "Automatically backup the database to AWS S3",
    "Reset user passwords",
    "Generate database ER diagrams"
  ]),
  makeQ(260, "In REST API security, what is the function of the `SameSite=Strict` attribute on authentication cookies?", [
    "Prevents the browser from sending the cookie in cross-site requests, completely eliminating Cross-Site Request Forgery (CSRF) vulnerabilities",
    "Encrypts the cookie payload with AES-256",
    "Expires the cookie after 15 minutes of inactivity",
    "Blocks the cookie from being read by JavaScript `document.cookie`"
  ]),
  makeQ(261, "In Node.js, what happens when you use `process.nextTick()` compared to `setImmediate()`?", [
    "`process.nextTick()` runs immediately after the current operation before the event loop continues; `setImmediate()` runs on the next event loop check phase",
    "`setImmediate()` has higher priority than `process.nextTick()`",
    "`process.nextTick()` executes in a background thread",
    "`setImmediate()` blocks the Node.js event loop for 1 second"
  ]),
  makeQ(262, "What is the primary function of a reverse proxy like Nginx in modern backend architecture?", [
    "SSL termination, load balancing, static asset caching, rate limiting, and routing client traffic to internal upstream application servers",
    "Compiling Node.js code into machine binary",
    "Managing database schema migrations",
    "Sending transactional emails to candidates"
  ]),
  makeQ(263, "In database architecture, what does the CAP theorem state?", [
    "A distributed data store can only simultaneously guarantee at most two out of three properties: Consistency, Availability, and Partition Tolerance",
    "A database can only support 1000 concurrent queries per second",
    "CPU, Architecture, and Performance are directly proportional",
    "Caching Always Prevents latency issues"
  ]),
  makeQ(264, "In Express.js, what is the critical requirement for custom error-handling middleware?", [
    "The middleware function MUST accept exactly four arguments: `(err, req, res, next)`",
    "It must be declared before all other route handlers",
    "It must return an asynchronous Promise",
    "It must be named `errorHandler`"
  ]),
  makeQ(265, "What is the difference between a B-Tree index and a GIN (Generalized Inverted Index) in PostgreSQL?", [
    "B-Tree is optimized for scalar comparisons (=, <, >, BETWEEN); GIN is designed for indexing composite items like arrays, full-text search vectors, and JSONB keys",
    "GIN indexes are only supported in MySQL",
    "B-Tree indexes cannot be used on primary keys",
    "GIN indexes take zero disk space"
  ]),
  makeQ(266, "In distributed systems, what is the 'Circuit Breaker' pattern?", [
    "Prevents cascading failures by detecting service degradation, failing fast immediately without calling the unhealthy downstream service, and periodically probing for recovery",
    "Shuts down the server when CPU usage reaches 90%",
    "Terminates idle TCP socket connections",
    "Balances network traffic across availability zones"
  ]),
  makeQ(267, "What is a major advantage of gRPC over traditional JSON/REST APIs?", [
    "High-performance binary serialization with Protocol Buffers, multiplexed HTTP/2 streaming, and strongly-typed auto-generated client SDKs",
    "Human-readable JSON payloads in plain text",
    "No server required; runs directly in browser JavaScript",
    "Only works with Python applications"
  ]),
  makeQ(268, "How does PgBouncer connection pooling improve PostgreSQL server performance under heavy load?", [
    "Maintains a small pool of persistent database backend connections and reuses them across thousands of ephemeral client connections, avoiding process-per-connection overhead",
    "Compresses PostgreSQL table data on disk",
    "Automatically replicates database tables across cloud regions",
    "Translates SQL queries into MongoDB syntax"
  ]),
  makeQ(269, "In Docker containerization, what is the purpose of Multi-Stage Builds?", [
    "Separates the build environment (compilers, devDependencies) from the final runtime image, resulting in dramatically smaller and more secure production container images",
    "Runs multiple Docker containers on a single port",
    "Executes containers across multiple physical machines",
    "Allows running Windows containers inside Linux hosts"
  ]),
  makeQ(270, "What is the purpose of the `cluster` module in Node.js?", [
    "Spawns multiple child worker processes sharing server ports to leverage multi-core CPU architectures on a single host",
    "Connects Node.js to a Kubernetes cluster",
    "Clusters database records into partitions",
    "Encrypts network traffic across local networks"
  ]),
  makeQ(271, "In database design, what is 'Database Sharding'?", [
    "Horizontal partitioning of a database across multiple independent physical server nodes based on a shard key (e.g. user_id or region)",
    "Creating backup copies of a database on magnetic tape",
    "Normalizing tables into Third Normal Form (3NF)",
    "Converting relational SQL tables into NoSQL documents"
  ]),
  makeQ(272, "What is the difference between OAuth 2.0 and OpenID Connect (OIDC)?", [
    "OAuth 2.0 is an authorization framework (delegating access via access tokens); OIDC is an identity layer on top of OAuth 2.0 for user authentication (identity verification via ID tokens)",
    "OAuth 2.0 is for passwords while OIDC is for biometric logins",
    "OIDC is only compatible with mobile apps",
    "OAuth 2.0 is deprecated in favor of Basic Auth"
  ]),
  makeQ(273, "What does the `EXPLAIN (ANALYZE, BUFFERS)` command in PostgreSQL do?", [
    "Executes the query and outputs the actual execution plan, real row counts, node execution times, and shared buffer hit/read cache metrics",
    "Generates sample data for the database table",
    "Deletes slow queries from the query log",
    "Repairs corrupted index files"
  ]),
  makeQ(274, "In WebSockets, what is the initial connection handshake mechanism?", [
    "An HTTP GET request with `Upgrade: websocket` and `Connection: Upgrade` headers that upgrades the TCP connection from HTTP to full-duplex WebSocket",
    "A direct raw UDP packet broadcast",
    "An encrypted SSH tunnel handshake",
    "An ICMP ping request"
  ]),
  makeQ(275, "What is the purpose of the 'Outbox Pattern' in distributed event-driven systems?", [
    "Atomically writes business data and corresponding domain events to the same database transaction, ensuring guaranteed at-least-once message delivery to message brokers",
    "Sends outbound emails directly via SMTP",
    "Stores deleted user accounts in a temporary table",
    "Filters spam comments from API inputs"
  ]),
  makeQ(276, "In MongoDB, what does the `$lookup` aggregation pipeline stage do?", [
    "Performs a left outer join to an unsharded collection in the same database to filter in documents from the joined collection",
    "Searches for documents using regular expressions",
    "Creates a unique index on a field",
    "Deletes duplicate documents from a collection"
  ]),
  makeQ(277, "What is a 'Memory Leak' in a Node.js server and what is a common cause?", [
    "Memory allocated by the application that is no longer needed but cannot be garbage-collected due to lingering global references, unclosed event listeners, or unbounded caches",
    "Physical RAM hardware failure on the server motherboard",
    "Installing too many npm dependencies",
    "Running Node.js in single-threaded mode"
  ]),
  makeQ(278, "In RabbitMQ, what is the role of an 'Exchange'?", [
    "Receives messages from producers and routes them to queues based on exchange type (Direct, Fanout, Topic, Headers) and routing keys",
    "Converts JSON messages into XML",
    "Stores messages permanently on disk without queues",
    "Monitors network bandwidth between consumers"
  ]),
  makeQ(279, "What is the purpose of the `ETag` HTTP response header in API caching?", [
    "An identifier (hash) for a specific version of a resource, allowing clients to make conditional requests (`If-None-Match`) to receive `304 Not Modified` and save bandwidth",
    "Encrypts the API response payload",
    "Specifies the user ID of the requesting client",
    "Enforces HTTPS on all API subdomains"
  ]),
  makeQ(280, "What is 'Deadlock' in a relational database and how is it resolved by PostgreSQL?", [
    "A situation where two or more transactions hold locks that the other needs; PostgreSQL's deadlock detector automatically aborts one transaction with an error after a timeout",
    "When a server hard drive runs out of storage space",
    "When an index is corrupted and queries hang indefinitely",
    "When a user enters an incorrect password three times"
  ]),
  makeQ(281, "In backend architecture, what is 'Idempotency' in HTTP methods?", [
    "An HTTP method where making multiple identical requests has the same effect on server state as making a single request (e.g. GET, PUT, DELETE)",
    "A request that executes in less than 10 milliseconds",
    "An API endpoint that requires no authentication",
    "A method that returns encrypted responses"
  ]),
  makeQ(282, "What is the purpose of structured logging (e.g. using Winston or Pino in JSON format)?", [
    "Outputs log records as structured machine-parsable JSON, enabling centralized indexing, filtering, and metric aggregation in tools like Datadog, ELK, or Loki",
    "Colors console logs in bright green and yellow",
    "Sends logs directly to client browser consoles",
    "Compresses log files using Gzip on disk"
  ]),
  makeQ(283, "What does `pg_dump` do in PostgreSQL administration?", [
    "Generates a consistent SQL script or custom archive containing database schema definitions and data for backup or migration",
    "Clears the PostgreSQL query cache",
    "Drops all tables in the database",
    "Monitors query latency in real time"
  ]),
  makeQ(284, "What is the purpose of the 'CQRS' (Command Query Responsibility Segregation) architectural pattern?", [
    "Separates read operations (queries) from write operations (commands) using different data models and optimized storage systems for each",
    "Combines frontend and backend code into a single file",
    "Validates user inputs on both client and server",
    "Restricts database access to admin users only"
  ]),
  makeQ(285, "In Node.js streams, what problem does 'Backpressure' handling solve?", [
    "Prevents a fast readable stream from overwhelming a slow writable stream in memory by pausing the source when the buffer is full and resuming when drained",
    "Compresses stream chunks before transmission",
    "Encrypts stream data using TLS",
    "Converts binary buffers into string characters"
  ]),
  makeQ(286, "In Redis, what is the difference between RDB snapshots and AOF (Append-Only File) persistence?", [
    "RDB creates point-in-time binary snapshots at specified intervals; AOF logs every write operation command for maximum data durability",
    "AOF is stored in RAM while RDB is stored in cloud S3",
    "RDB only works with string keys while AOF works with hashes",
    "AOF cannot be restored after a server crash"
  ]),
  makeQ(287, "What is the primary vulnerability mitigated by using Parameterized Prepared Statements in SQL queries?", [
    "SQL Injection (SQLi), by separating the query structure from user-supplied parameters so parameters are never executed as SQL code",
    "Cross-Site Scripting (XSS)",
    "Man-in-the-Middle (MitM) attacks",
    "Buffer overflow crashes in the database server"
  ]),
  makeQ(288, "In distributed tracing, what is a 'Trace ID' and 'Span ID'?", [
    "A Trace ID uniquely tracks an entire end-to-end request across all microservices; a Span ID represents a single timed unit of work within a specific service",
    "Security tokens for authenticating admin users",
    "Database primary keys for transaction logs",
    "Identifiers for Kafka topic partitions"
  ]),
  makeQ(289, "What is the purpose of Health Check endpoints (`/healthz`, `/readyz`) in Kubernetes microservices?", [
    "Liveness probes restart failing containers; Readiness probes determine if the container is ready to accept incoming network traffic",
    "Measures server room temperature",
    "Scans source code for security vulnerabilities",
    "Calculates employee working hours"
  ]),
  makeQ(290, "In GraphQL, what is the 'N+1 Problem' and how is it resolved?", [
    "When fetching a list of items causes N additional database queries for nested relations; resolved using DataLoader to batch and cache database lookups",
    "When a GraphQL server runs on port N+1",
    "When a query has more than N arguments",
    "When a schema has duplicate type names"
  ]),
  makeQ(291, "What does the `helmet` npm middleware package do in Express.js applications?", [
    "Sets various HTTP response headers (Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options) to secure against common web vulnerabilities",
    "Encrypts database passwords with bcrypt",
    "Compresses HTTP responses with Gzip",
    "Restricts API access by geographic location"
  ]),
  makeQ(292, "What is the purpose of 'Database Connection Keep-Alive' packets?", [
    "Prevents firewalls and intermediate network proxies from terminating idle database connections during long gaps between queries",
    "Backs up the database every 10 seconds",
    "Reboots the server if it freezes",
    "Sends heartbeat emails to database administrators"
  ]),
  makeQ(293, "In Redis, what does the `TTL` command return for a key?", [
    "The remaining time-to-live in seconds before the key automatically expires (-1 if no expiry, -2 if key does not exist)",
    "The size of the key in megabytes",
    "The number of times the key has been read",
    "The timestamp when the key was created"
  ]),
  makeQ(294, "What is the difference between horizontal and vertical database scaling?", [
    "Horizontal scaling adds more server nodes across a cluster; vertical scaling increases the CPU, RAM, and SSD capacity of a single server",
    "Horizontal scaling is only for NoSQL while vertical scaling is only for SQL",
    "Vertical scaling has zero cost",
    "Horizontal scaling cannot handle read traffic"
  ]),
  makeQ(295, "In Node.js, what is the purpose of `Buffer.allocUnsafe()` compared to `Buffer.alloc()`?", [
    "`Buffer.allocUnsafe()` allocates memory without zero-filling it (much faster, but the allocated memory may contain sensitive old data)",
    "`Buffer.allocUnsafe()` executes in browser memory",
    "`Buffer.alloc()` has a maximum limit of 1KB",
    "`Buffer.allocUnsafe()` is deprecated in Node.js 18"
  ]),
  makeQ(296, "What is the role of an API Gateway in enterprise backend architecture?", [
    "Single entry point for client requests handling authentication, SSL termination, rate limiting, request transformation, telemetry, and microservice routing",
    "Replaces all backend database systems",
    "Runs automated unit tests on production servers",
    "Compiles TypeScript code for frontend apps"
  ]),
  makeQ(297, "What is the purpose of the `VACUUM` process in PostgreSQL?", [
    "Reclaims storage space occupied by dead rows generated by UPDATE and DELETE operations and updates query planner statistics",
    "Deletes old tables that haven't been used in 30 days",
    "Compresses database backups on disk",
    "Cleans up user login logs"
  ]),
  makeQ(298, "In JWT authentication, where should refresh tokens be securely stored on the client?", [
    "In an `HttpOnly`, `Secure`, `SameSite=Strict` cookie to prevent theft via Cross-Site Scripting (XSS)",
    "In `localStorage` in plaintext",
    "In a global JavaScript window variable",
    "In the URL query string"
  ]),
  makeQ(299, "What does the `pkill -f` or `kill -9` signal (SIGKILL) do to a Node.js process?", [
    "Immediately terminates the process at the OS kernel level without giving the application a chance to run cleanup handlers or finish in-flight requests",
    "Gracefully stops the server after draining connections",
    "Restarts the server with fresh environment variables",
    "Pauses execution for 5 seconds"
  ]),
  makeQ(300, "How do you achieve 'Graceful Shutdown' in a Node.js web server upon receiving `SIGTERM`?", [
    "Listen for `SIGTERM`, stop accepting new requests via `server.close()`, wait for in-flight requests to complete, close database connections, and exit with code 0",
    "Call `process.exit(1)` immediately inside the signal listener",
    "Throw an unhandled exception to crash the process",
    "Delete all database tables before exiting"
  ])
];

console.log('Extra Backend questions created:', extraBackend.length);

module.exports = { extraFrontend, extraBackend };
