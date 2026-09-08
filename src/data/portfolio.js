export const personalInfo = {
  name: "Akash Kasture",
  title: "Software Engineer | Trader",
  tagline: "Software Engineer · Trader · FinTech Enthusiast",
  description:
    "Backend Engineer with 2+ years of experience designing high-throughput distributed microservices. Built event-driven systems processing 15K+ daily messages at 99.95% uptime, automated $50M+/month transaction workflows with zero errors — and an active options trader passionate about market analytics.",
  email: "akashkasture4884@gmail.com",
  github: "https://github.com/akashkasture",
  linkedin: "https://linkedin.com/in/akashkasture",
  location: "Pune, India",
  available: true,
  // A real file in /public, not a request form. This was a mailto asking
  // the visitor to email and wait, which is a toll booth in front of the
  // one artifact a recruiter actually came for.
  resumeUrl: "/Akash_Kasture_Resume.pdf",
  currentlyLearning: ["Rust", "Kubernetes Operators", "Apache Flink", "Algorithmic Trading"],
  funFacts: [
    "Debugged a production issue at 3 AM with just logs and intuition",
    "Optimized complex SQL — reduced report generation from minutes to seconds",
    "Engineered Kafka pipelines: 15K+ msgs/day across 5K+ endpoints at 99.95% uptime",
    "Engineered a $50M+/month transaction engine with zero errors — 30% STP gain",
  ],
  hobbies: [
    { icon: "TrendingUp", label: "BankNifty Options", color: "#10b981", desc: "F&O trader · Greeks & momentum" },
    { icon: "BarChart2", label: "Stock Market", color: "#f59e0b", desc: "Equity research & screening" },
    { icon: "Activity", label: "Technical Analysis", color: "#6366f1", desc: "Chart patterns & price action" },
    { icon: "Terminal", label: "Late Night Coding", color: "#06b6d4", desc: "Best bugs found after midnight" },
  ],
};

export const skills = [
  {
    category: "Backend",
    icon: "Server",
    color: "#6366f1",
    items: [
      { name: "Java", level: 95 },
      { name: "Spring Boot", level: 92 },
      { name: "Microservices", level: 90 },
      { name: "REST APIs", level: 95 },
      { name: "Multithreading", level: 82 },
    ],
  },
  {
    category: "Databases",
    icon: "Database",
    color: "#06b6d4",
    items: [
      { name: "Oracle SQL", level: 85 },
      { name: "PL/SQL", level: 78 },
      { name: "PostgreSQL", level: 88 },
      { name: "MySQL", level: 80 },
      { name: "Redis", level: 85 },
    ],
  },
  {
    category: "Messaging",
    icon: "Radio",
    color: "#a855f7",
    items: [
      { name: "Apache Kafka", level: 88 },
      { name: "IBM MQ", level: 72 },
      { name: "RabbitMQ", level: 70 },
      { name: "WebSocket", level: 75 },
    ],
  },
  {
    category: "DevOps",
    icon: "Layers",
    color: "#10b981",
    items: [
      { name: "Docker", level: 88 },
      { name: "AWS", level: 78 },
      { name: "Kubernetes", level: 72 },
      { name: "Jenkins / CI-CD", level: 82 },
    ],
  },
  {
    category: "System Design",
    icon: "Network",
    color: "#0ea5e9",
    items: [
      { name: "Distributed Systems", level: 85 },
      { name: "Event-Driven Arch", level: 88 },
      { name: "CQRS / Event Sourcing", level: 75 },
      { name: "Saga Pattern", level: 72 },
    ],
  },
  {
    category: "Trading & Finance",
    icon: "TrendingUp",
    color: "#f59e0b",
    items: [
      { name: "Market Analytics", level: 82 },
      { name: "Algorithmic Trading", level: 72 },
      { name: "Risk Monitoring", level: 78 },
      { name: "Portfolio Tracking", level: 80 },
      { name: "Trading Analytics", level: 75 },
    ],
  },
];

export const techBadges = [
  "Java", "Spring Boot", "Apache Kafka", "Redis", "Docker",
  "Kubernetes", "Oracle SQL", "PL/SQL", "PostgreSQL", "MongoDB", "AWS",
  "Microservices", "REST API", "IBM MQ", "Spring AI", "Hibernate",
  "JUnit", "Mockito", "React", "System Design",
];

/* Case studies carry three of their five fields.

   `problem`, `architecture` and `challenges` are analysis of the design
   each project describes — what the shape of it costs, what it
   guarantees, and where it breaks. A sliding window on Redis sorted sets
   really does need ZREMRANGEBYSCORE, ZCARD and ZADD in one atomic
   script, and really does grow per key without a TTL. Those are
   properties of the design, so they can be stated without claiming
   anything about who wrote it or what happened next.

   `contribution` and `results` are deliberately absent. They are
   biography — what one person did, and what came of it — and neither can
   be derived from a description. Written speculatively they would be
   sentences to defend in an interview rather than evidence in one, so
   they stay empty until the answers in docs/case-studies.md exist. The
   inspector renders whichever fields are present and omits the rest.

   `metrics` is what the card shows under "At a glance", and every value
   is a fact about how the thing is built — the algorithm chosen, the
   store it sits on, what happens when a step fails. It used to carry
   figures like "50K msg/min", "<1ms overhead" and "90%+ coverage",
   which read as measurements and were never measured. A design fact is
   just as specific and is true by construction. */
export const projects = [
  {
    id: 1,
    title: "ChatStream — AI Conversational Platform",
    description:
      "Real-time AI chat platform with code generation, debugging assistance, and contextual Q&A. Kafka-based message backbone (producer → topic partitioning → consumer → WebSocket push) decouples ingestion from delivery. Redis-backed session management with TTL heartbeats.",
    tech: ["Spring Boot", "WebSocket", "Kafka", "Redis", "PostgreSQL", "Spring AI", "Docker", "AWS EC2"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "AI / Backend",
        problem:
      "A chat UI that calls a model synchronously ties the browser connection to generation latency. A slow response is a hung request, a crash mid-generation loses the turn outright, and the only way to shed load is to start dropping users.",
    architecture:
      "Messages are produced to a Kafka topic partitioned so that one conversation stays on one partition and therefore stays ordered. A consumer group does the model call and pushes the reply to the browser over WebSocket, so ingestion and delivery scale independently and a restart resumes from the log rather than from nothing. Redis holds session state under a TTL that heartbeats refresh, so a client that disappears expires instead of leaking.",
    challenges:
      "Ordering is guaranteed per partition, not per topic, so the partition key has to be the conversation and nothing else. A consumer group rebalance mid-generation drops the in-flight reply unless it is re-driven from the log. A WebSocket push is at-most-once from the socket outward, so the client needs to be able to re-fetch on reconnect rather than trusting delivery. And the session TTL has to outlive the longest generation, or a slow answer expires the session it is answering into.",
metrics: { transport: "WebSocket push", backbone: "Kafka topics", sessions: "Redis TTL" },
    featured: true,
  },
  {
    id: 2,
    title: "Multi-LLM AI Platform with RAG",
    description:
      "Multi-tenant LLM orchestration platform routing across GPT-4, Claude, and Gemini via Spring AI. Implements RAG with pgvector embeddings for grounded answers. Redis-backed prompt caching cuts API spend. Streaming via Spring WebFlux SSE for low time-to-first-token.",
    tech: ["Spring AI", "GPT-4", "Claude", "Gemini", "Spring WebFlux", "pgvector", "Redis", "Kafka", "Kubernetes"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "AI / Backend",
        problem:
      "One provider is one outage and one pricing model. And a raw model answers from its training data, which is the wrong source the moment the question is about documents it has never seen.",
    architecture:
      "Spring AI puts the three providers behind one interface, so routing between them is a policy decision rather than a rewrite. Retrieval runs nearest-neighbour search over pgvector embeddings and puts the retrieved passages into the prompt, which grounds the answer in real documents. Redis caches prompt against completion so a repeated question is not billed twice. WebFlux streams over SSE, so time-to-first-token stops being time-to-whole-answer.",
    challenges:
      "A common interface across three providers is only as wide as the narrowest of them — context limits, tool-calling shapes and streaming formats all differ. The prompt cache has to be keyed on the model as well as the text, because the same prompt routed to a different provider is a different answer. Answer quality is bounded by chunking long before it is bounded by the model. And embeddings go stale the moment a source document changes, so the index needs an invalidation path rather than a one-off build.",
metrics: { llms: "3 providers", rag: "pgvector", stream: "SSE / WebFlux" },
    featured: true,
  },
  {
    id: 3,
    title: "BankNifty Options Screener",
    description:
      "Real-time F&O screening dashboard for BankNifty options — fetches live OI data, calculates PCR, max pain, and IV percentile. Streams data via WebSocket with Redis caching for sub-100ms updates.",
    tech: ["Spring Boot", "WebSocket", "Redis", "React", "Recharts", "PostgreSQL"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "FinTech",
        problem:
      "An option chain is only useful in aggregate. Put-call ratio, max pain and IV percentile are all derived figures, and deriving them by hand on each refresh is slower than the move being watched for.",
    architecture:
      "One poller pulls the live chain and computes the aggregates server-side, so every connected client reads one computation instead of each browser repeating the same arithmetic. Redis holds the current snapshot and WebSocket pushes changes, so the page is updated rather than polling.",
    challenges:
      "The figures are only as fresh as the poll, and the poll is rate-limited by whoever supplies the chain. Max pain and put-call ratio are only comparable within a single expiry, so the aggregation has to be keyed on it. IV percentile is the awkward one: a percentile needs a history window, so the store cannot only hold the current snapshot. And the whole thing has to idle outside market hours instead of hammering a source that has nothing new to say.",
metrics: { signals: "PCR · Max pain · IV", source: "Live open interest", transport: "WebSocket" },
    featured: true,
  },
  {
    id: 4,
    title: "Distributed Cache Library",
    description:
      "Spring Boot starter library implementing cache-aside, write-through, and write-behind patterns on top of Redis. Automatic TTL management, cache warming, and metrics via Micrometer.",
    tech: ["Java", "Spring Boot", "Redis", "Micrometer", "Maven"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Backend",
        problem:
      "Every service reimplements cache-aside slightly differently, and each one gets invalidation subtly wrong in its own way.",
    architecture:
      "A Spring Boot starter, so it arrives as a dependency rather than as copied code. The three write strategies — aside, write-through and write-behind — are chosen per cache instead of assumed globally. TTL handling and warm-up belong to the library. Micrometer counters report hit and miss rates, so cache behaviour is observed rather than believed.",
    challenges:
      "Write-behind acknowledges a write before it is durable, so a crash between the acknowledgement and the flush loses it — the library has to be explicit that this mode trades durability for latency rather than presenting the three strategies as interchangeable. Invalidation is domain knowledge the library does not have and cannot infer. And warming a cache at startup competes for the very database capacity the cache exists to protect.",
metrics: { patterns: "Aside · Through · Behind", store: "Redis", instrument: "Micrometer" },
    featured: false,
  },
  {
    id: 5,
    title: "API Rate Limiter — Redis Sliding Window",
    description:
      "Production-ready rate-limiting library using Redis sorted sets with sliding window algorithm. Supports per-user, per-endpoint, and global rate limits with configurable burst allowances.",
    tech: ["Java", "Spring Boot", "Redis", "Spring Security", "Docker"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Backend",
        problem:
      "A fixed-window counter lets a caller spend a full quota at the end of one window and another full quota at the start of the next — twice the intended rate, straddling the boundary.",
    architecture:
      "One Redis sorted set per key, holding request timestamps as scores. Each call drops the entries older than the window with ZREMRANGEBYSCORE, counts what is left with ZCARD, and records the new one with ZADD — a window that genuinely slides rather than resetting. The sequence runs as a single Lua script so it stays atomic under concurrency, and each key carries the window as its TTL so idle keys expire instead of accumulating.",
    challenges:
      "The sorted set holds one entry per request in the window, so memory grows with the rate rather than staying constant the way a counter does — the TTL is load-bearing, not housekeeping. Scores come from the caller's clock, so skew between application instances shifts the window. Running the three commands separately is a race, which is why they are one script. And Redis becomes a dependency on the request path: whether a Redis outage fails open or closed is a policy decision the library has to surface rather than decide.",
metrics: { algorithm: "Sliding window", store: "Redis sorted sets", scope: "User · Endpoint · Global" },
    featured: false,
  },
  {
    id: 6,
    title: "Kafka Event Streaming Pipeline",
    description:
      "End-to-end streaming pipeline for financial transactions — producer with custom partitioner by account ID, exactly-once delivery, consumer groups with dead-letter queues, and real-time Grafana dashboards.",
    tech: ["Apache Kafka", "Spring Batch", "PostgreSQL", "Grafana", "Docker", "Kubernetes"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Backend",
        problem:
      "Financial events must not be reordered within an account, must not be lost, and must not be applied twice. Those three constraints together are what make a transaction pipeline harder than a queue.",
    architecture:
      "A custom partitioner keys on account ID, so every event for one account lands on one partition and stays ordered there. An idempotent producer and transactional writes give exactly-once semantics. The consumer group scales up to the partition count. A message that keeps failing goes to a dead-letter topic rather than blocking its partition behind it, and consumer lag is the number the dashboards watch.",
    challenges:
      "Partitioning by account buys ordering and costs balance: one unusually busy account makes a hot partition that the other consumers cannot help with. Exactly-once holds within Kafka and to a transactional sink — it says nothing about a downstream that is a plain REST call, which still needs idempotency of its own. A dead-letter topic without a replay path is a graveyard rather than a recovery mechanism. And the partition count is effectively permanent, since raising it changes which partition an existing key hashes to.",
metrics: { partitioning: "By account ID", delivery: "Exactly-once", failure: "Dead-letter queue" },
    featured: false,
  },
  {
    id: 7,
    title: "Spring Boot Microservices Starter",
    description:
      "Opinionated microservices chassis — service discovery (Eureka), circuit breaker (Resilience4j), distributed tracing (Zipkin), centralized config (Spring Cloud Config), and API gateway out of the box.",
    tech: ["Spring Cloud", "Eureka", "Resilience4j", "Zipkin", "Kubernetes"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Architecture",
        problem:
      "Every new service spends its first week re-adding the same four things — discovery, external config, tracing and circuit breakers — and each team's version drifts a little further from the last.",
    architecture:
      "A chassis rather than a template. Services register with Eureka on startup so callers resolve by name instead of by address. Configuration lives in Spring Cloud Config, outside the image, so the same artifact runs in every environment. Resilience4j supplies circuit breakers and bulkheads so one failing dependency does not cascade. Zipkin spans propagate across calls, which is the only way a request stays followable once it crosses a process boundary. The gateway is the single entry point.",
    challenges:
      "A chassis is a shared dependency, so its upgrade cadence becomes every service's upgrade cadence — the thing that saves a week at the start can cost one later. Eureka's registry is eventually consistent, so a caller can and will hold a stale instance for a few seconds. Circuit breaker thresholds cannot be defaulted meaningfully, because the right value depends on the dependency being called. And tracing context has to be propagated across every asynchronous boundary by hand, or the trace breaks precisely where the interesting work happens.",
metrics: { discovery: "Eureka", tracing: "Zipkin", resilience: "Resilience4j" },
    featured: false,
  },
  {
    id: 8,
    title: "SQL Query Optimizer Tool",
    description:
      "CLI utility to analyze SQL execution plans, detect full-table scans, suggest composite indexes, and identify N+1 query patterns in Hibernate-generated SQL. Supports Oracle and PostgreSQL.",
    tech: ["Java", "Oracle SQL", "JDBC", "Spring Shell", "Maven"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Backend",
        problem:
      "Hibernate hides the SQL it generates. A full table scan or an N+1 lookup does not look wrong in the Java, so it surfaces as slowness in production long after the code was reviewed.",
    architecture:
      "A Spring Shell CLI that takes a query or a captured statement log, pulls the real execution plan from Oracle or Postgres, and reports on what it finds — full scans, columns that would benefit from a composite index, and the repeated single-row-lookup shape that means an N+1. It reads plans rather than inferring from the query text, which is the difference between advice and a guess.",
    challenges:
      "A plan is a snapshot against the current statistics and data volume, so advice derived from a development database can be actively wrong against production. Every suggested index is a write cost paid on every insert, which the tool can see nothing of. Detecting an N+1 from a statement log needs the request boundary, since the signal is repetition within one unit of work rather than repetition overall. And the two databases describe their plans differently enough that the analysis has to be written twice.",
metrics: { analysis: "Execution plans", detect: "N+1 patterns", suggest: "Indexes" },
    featured: false,
  },
  {
    id: 9,
    title: "Event Sourcing CQRS Framework",
    description:
      "Lightweight event sourcing + CQRS framework for Java. Aggregate root lifecycle management, event store with PostgreSQL, projections, and replay support. Zero-dependency core.",
    tech: ["Java", "PostgreSQL", "Spring Boot", "CQRS", "Event Sourcing"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Architecture",
        problem:
      "A row that is overwritten keeps the value and loses the reason. For anything auditable, the history is the asset and the current state is only a convenience derived from it.",
    architecture:
      "Aggregates emit events; the store appends them to PostgreSQL with a version per aggregate for optimistic concurrency. Current state is a left fold of the stream. Projections build read models off the write path, which is the whole point of the CQRS split, and replay rebuilds any projection from the log — so a reporting bug is fixed by rebuilding rather than by migrating.",
    challenges:
      "Events are permanent, so changing their shape is upcasting rather than migration, and the old versions have to stay readable forever. Projections are eventually consistent by construction, which means read-your-own-writes needs handling rather than assuming. Replay time grows with the log, so snapshots stop being an optimisation and become a requirement. And optimistic concurrency converts contention into retries, which moves the problem to the caller rather than removing it.",
metrics: { pattern: "CQRS + ES", store: "PostgreSQL", replay: "Supported" },
    featured: false,
  },
  {
    id: 10,
    title: "DevOps CI/CD Pipeline Templates",
    description:
      "Battle-tested GitHub Actions and Jenkins pipeline templates for Spring Boot microservices — build, test, Docker push, Kubernetes deploy, smoke test, and automatic rollback on failure.",
    tech: ["GitHub Actions", "Jenkins", "Docker", "Kubernetes", "Helm", "AWS ECR"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "DevOps",
        problem:
      "Pipeline configuration gets copied between repositories and then edited, so after a handful of services no two pipelines do quite the same things in quite the same order.",
    architecture:
      "One reusable workflow rather than ten copies — build, test behind a coverage gate, image to ECR, Helm release to Kubernetes, smoke test against the deployed service, and a rollback to the previous release when that smoke test fails. The smoke test is what makes the rollback meaningful; without it a bad deploy is still green.",
    challenges:
      "A reusable workflow is a shared dependency, so a change to it lands everywhere at once — which is the point and also the risk. The smoke test has to be meaningful enough to catch a broken release and fast enough that nobody is tempted to skip it. Rollback assumes the previous release is still deployable, which stops being true the moment a schema migration has run against the database. And a coverage gate is only a gate until the first urgent release, so where the override lives matters more than the threshold does.",
metrics: { runners: "Actions · Jenkins", deploy: "Helm → Kubernetes", rollback: "On failed smoke test" },
    featured: false,
  },
];

export const experience = [
  {
    id: 1,
    role: "Software Engineer",
    company: "Newgen Software Technology",
    period: "Jul 2024 — Present",
    type: "full-time",
    description:
      "Designing and shipping high-throughput distributed microservices for enterprise financial platforms. Spans event-driven messaging, SQL performance tuning, rule-engine-driven business automation, and CI/CD-driven delivery.",
    tech: ["Spring Boot", "Microservices", "Oracle SQL", "Kafka", "IBM MQ", "Redis", "Docker"],
    achievements: [
      "Engineered Spring Boot microservices processing 15K+ daily messages across 5K+ endpoints — 99.95% uptime, 30% reliability improvement",
      "Designed automated transaction engine processing $50M+/month with zero errors — 30% straight-through processing gain",
      "Tuned complex SQL on a financial reporting module — consolidated interdependent views into a performance-tuned modular architecture",
      "Rule-engine-driven validations: 40% efficiency gains, 50% fewer mismatches, 65% less manual intervention",
    ],
  },
  {
    id: 2,
    role: "Software Engineering Intern",
    company: "Newgen Software Technology",
    period: "Jan 2024 — Jun 2024",
    type: "internship",
    description:
      "6-month internship in the enterprise platform division — hands-on with production Spring Boot services, Oracle SQL, and enterprise messaging systems from day one.",
    tech: ["Spring Boot", "Oracle SQL", "REST APIs", "Java", "IBM MQ"],
    achievements: [
      "Contributed to production microservices for enterprise financial platforms within the first month",
      "Wrote PL/SQL procedures for batch processing and automated data workflows",
      "Built and deployed 2 internal utilities reducing manual data validation effort by 30%",
      "Converted to full-time offer based on performance and production impact",
    ],
  },
];

export const timeline = [
  {
    year: "2020",
    title: "B.Tech Begins",
    description: "Started Electronics & Telecommunication at PCCOE Pune — first lines of Java, backend curiosity ignited",
    icon: "Code",
    color: "#6366f1",
  },
  {
    year: "2022",
    title: "Backend Deep Dive",
    description: "Fell in love with Spring Boot and REST APIs — built first production-ready microservice during internship prep",
    icon: "Server",
    color: "#06b6d4",
  },
  {
    year: "2023",
    title: "Kafka & Distributed Systems",
    description: "Designed first event-driven pipeline with Apache Kafka — real-time data at scale, CQRS, and saga patterns",
    icon: "GitBranch",
    color: "#8b5cf6",
  },
  {
    year: "Jan 2024",
    title: "Internship at Newgen",
    description: "6-month internship — production Spring Boot, Oracle SQL, IBM MQ in an enterprise platform environment from day one",
    icon: "GitBranch",
    color: "#f59e0b",
  },
  {
    year: "Jul 2024",
    title: "Full-Time Software Engineer",
    description: "Converted to full-time SE at Newgen — shipped microservices handling 15K+ messages/day in enterprise financial platforms",
    icon: "Server",
    color: "#10b981",
  },
  {
    year: "2024",
    title: "Production at Scale",
    description: "Built $50M+/month automated transaction engine with zero errors — 15K+ msgs/day, 99.95% uptime across enterprise financial platforms",
    icon: "TrendingUp",
    color: "#ec4899",
  },
  {
    year: "2025",
    title: "AI + Trading Convergence",
    description: "Building AI-integrated distributed systems, LLM orchestration, RAG pipelines, and algorithmic trading tools",
    icon: "TrendingUp",
    color: "#6366f1",
  },
  {
    year: "2026+",
    title: "Next Chapter",
    description: "Targeting founding engineer / senior SE roles at AI-first fintech startups — or launching my own algorithmic trading product.",
    icon: "Code",
    color: "#a855f7",
    locked: true,
  },
];

