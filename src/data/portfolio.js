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
  resumeUrl: "mailto:akashkasture4884@gmail.com?subject=Resume%20Request",
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

/* `metrics` is what the card shows under "At a glance", and every value
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

