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

export const projects = [
  {
    id: 1,
    title: "ChatStream — AI Conversational Platform",
    description:
      "Real-time AI chat platform with code generation, debugging assistance, and contextual Q&A. Kafka-based message backbone (producer → topic partitioning → consumer → WebSocket push) decouples ingestion from delivery. Redis-backed session management with TTL heartbeats.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    tech: ["Spring Boot", "WebSocket", "Kafka", "Redis", "PostgreSQL", "Spring AI", "Docker", "AWS EC2"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "AI / Backend",
    metrics: { sessions: "Multi", latency: "Real-time", deploy: "AWS EC2" },
    featured: true,
  },
  {
    id: 2,
    title: "Multi-LLM AI Platform with RAG",
    description:
      "Multi-tenant LLM orchestration platform routing across GPT-4, Claude, and Gemini via Spring AI. Implements RAG with pgvector embeddings for grounded answers. Redis-backed prompt caching cuts API spend. Streaming via Spring WebFlux SSE for low time-to-first-token.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    tech: ["Spring Boot", "WebSocket", "Redis", "React", "Recharts", "PostgreSQL"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "FinTech",
    metrics: { latency: "<100ms", data: "Live OI", streams: "WebSocket" },
    featured: true,
  },
  {
    id: 4,
    title: "Distributed Cache Library",
    description:
      "Spring Boot starter library implementing cache-aside, write-through, and write-behind patterns on top of Redis. Automatic TTL management, cache warming, and metrics via Micrometer.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    tech: ["Java", "Spring Boot", "Redis", "Micrometer", "Maven"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Backend",
    metrics: { cache: "3 patterns", latency: "<5ms", coverage: "90%+" },
    featured: false,
  },
  {
    id: 5,
    title: "API Rate Limiter — Redis Sliding Window",
    description:
      "Production-ready rate-limiting library using Redis sorted sets with sliding window algorithm. Supports per-user, per-endpoint, and global rate limits with configurable burst allowances.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tech: ["Java", "Spring Boot", "Redis", "Spring Security", "Docker"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Backend",
    metrics: { algo: "Sliding Window", overhead: "<1ms", limits: "Per-user" },
    featured: false,
  },
  {
    id: 6,
    title: "Kafka Event Streaming Pipeline",
    description:
      "End-to-end streaming pipeline for financial transactions — producer with custom partitioner by account ID, exactly-once delivery, consumer groups with dead-letter queues, and real-time Grafana dashboards.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tech: ["Apache Kafka", "Spring Batch", "PostgreSQL", "Grafana", "Docker", "Kubernetes"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Backend",
    metrics: { throughput: "50K msg/min", delivery: "Exactly-once", dlq: "Auto-retry" },
    featured: false,
  },
  {
    id: 7,
    title: "Spring Boot Microservices Starter",
    description:
      "Opinionated microservices chassis — service discovery (Eureka), circuit breaker (Resilience4j), distributed tracing (Zipkin), centralized config (Spring Cloud Config), and API gateway out of the box.",
    image: "https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=800&q=80",
    tech: ["Spring Cloud", "Eureka", "Resilience4j", "Zipkin", "Kubernetes"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "Architecture",
    metrics: { services: "Plug & play", tracing: "Zipkin", resilience: "Resilience4j" },
    featured: false,
  },
  {
    id: 8,
    title: "SQL Query Optimizer Tool",
    description:
      "CLI utility to analyze SQL execution plans, detect full-table scans, suggest composite indexes, and identify N+1 query patterns in Hibernate-generated SQL. Supports Oracle and PostgreSQL.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tech: ["GitHub Actions", "Jenkins", "Docker", "Kubernetes", "Helm", "AWS ECR"],
    github: "https://github.com/akashkasture",
    live: "https://github.com/akashkasture",
    category: "DevOps",
    metrics: { deploy: "Zero-downtime", rollback: "Auto", coverage: "Gate enforced" },
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
      "Rule-engine validations cut 50% mismatches — measurable production impact",
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

export const blogPosts = [
  {
    title: "Kafka at Scale: 15K+ Messages/Day in Production",
    excerpt: "Deep dive into partitioning strategies, consumer groups, exactly-once semantics, and dead-letter queues in a real enterprise environment.",
    date: "Apr 2025",
    readTime: "8 min read",
    tags: ["Kafka", "Architecture", "Java"],
    color: "#6366f1",
  },
  {
    title: "SQL Optimization: From Minutes to Milliseconds",
    excerpt: "How I consolidated multiple interdependent views into a modular, performance-tuned architecture on a real-time financial reporting module.",
    date: "Mar 2025",
    readTime: "6 min read",
    tags: ["Oracle", "Performance", "SQL"],
    color: "#06b6d4",
  },
  {
    title: "RAG Architecture with pgvector & Spring AI",
    excerpt: "Building a retrieval-augmented generation pipeline — document ingestion, chunking, embedding with pgvector, and grounding LLM answers in user data.",
    date: "Feb 2025",
    readTime: "10 min read",
    tags: ["Spring AI", "RAG", "LLM"],
    color: "#8b5cf6",
  },
];
