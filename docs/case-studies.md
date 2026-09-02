# Case studies — facts needed

The five case-study fields (`problem`, `architecture`, `contribution`,
`challenges`, `results`) are already wired: `src/trace/data/trace.js:293`
reads them off each project and `src/trace/ui/Inspector.jsx:218` renders
them. Every project currently shows "No write-up yet."

**How to use this file:** for each project, answer the three questions.
Then tell me and I'll write the five fields into `src/data/portfolio.js`.

The **Problem** and **Architecture** drafts below are mine. They are
derived *only* from the one-line description already in `portfolio.js` —
no new claims, no numbers. Correct them or strike them; they are a
starting point, not a fait accompli.

The three questions are blank because they are biography. I can reason
about a design from its description; I cannot know what you built or
what happened next.

> **Answer honestly on Q1.** "No — I never built this" is the most
> useful answer in this file, not the worst one. Four projects a hiring
> manager can interrogate beat ten they can't. Nothing here has a repo
> behind it, and an interviewer *will* ask you to walk through the
> exactly-once delivery.

---

## 1. ChatStream — AI Conversational Platform
`Spring Boot · WebSocket · Kafka · Redis · PostgreSQL · Spring AI · Docker · AWS EC2`

**Q1. Did you build this?** yes / partly / no →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** (deployed? used by anyone? abandoned? what you learned) →

*Draft — Problem:* A chat UI that calls a model synchronously ties the
browser's connection to generation latency. A slow response is a hung
request, a crash mid-generation loses the turn, and load can only be
shed by dropping users.

*Draft — Architecture:* Messages are produced to a Kafka topic
partitioned so one conversation stays ordered on one partition. A
consumer group does the model call and pushes the reply to the browser
over WebSocket, so ingestion and delivery scale separately and a restart
resumes from the log. Redis holds session state under a TTL refreshed by
heartbeat, so a client that disappears expires rather than leaking.

---

## 2. Multi-LLM AI Platform with RAG
`Spring AI · GPT-4 · Claude · Gemini · WebFlux · pgvector · Redis · Kafka · Kubernetes`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** →

*Draft — Problem:* One provider is one outage and one pricing model. And
a raw model answers from training data, which is the wrong source when
the question is about documents it has never seen.

*Draft — Architecture:* Spring AI puts the three providers behind one
interface, so routing between them is a policy decision rather than a
rewrite. Retrieval runs nearest-neighbour over pgvector embeddings and
puts the retrieved passages in the prompt, grounding the answer in real
documents. Redis caches prompt→completion so a repeated question is not
re-billed. WebFlux SSE streams tokens, so time-to-first-token is not
time-to-whole-answer.

---

## 3. BankNifty Options Screener
`Spring Boot · WebSocket · Redis · React · Recharts · PostgreSQL`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** (do you actually trade off it?) →

*Draft — Problem:* An option chain is only useful in aggregate. PCR, max
pain and IV percentile are all derived figures, and deriving them by
hand each refresh is slower than the move you are trying to catch.

*Draft — Architecture:* One poller pulls the live chain and computes the
aggregates server-side, so every connected client reads one computation
instead of each browser repeating it. Redis holds the current snapshot;
WebSocket pushes changes rather than having the page poll.

---

## 4. Distributed Cache Library
`Java · Spring Boot · Redis · Micrometer · Maven`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** (used in any real service? published to a registry?) →

*Draft — Problem:* Every service reimplements cache-aside slightly
differently, and each one gets invalidation subtly wrong in its own way.

*Draft — Architecture:* A Spring Boot starter, so it arrives as a
dependency rather than as copied code. The three write strategies —
aside, write-through, write-behind — are chosen per cache instead of
assumed. TTL and warming belong to the library. Micrometer counters
report hit and miss rates, so cache behaviour is observed rather than
believed.

---

## 5. API Rate Limiter — Redis Sliding Window
`Java · Spring Boot · Redis · Spring Security · Docker`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** →

*Draft — Problem:* A fixed-window counter lets a caller spend a full
quota at the end of one window and another at the start of the next —
double the intended rate, across the boundary.

*Draft — Architecture:* One Redis sorted set per key, holding request
timestamps as scores. Each call drops entries older than the window
(`ZREMRANGEBYSCORE`), counts what is left (`ZCARD`), and records the new
one (`ZADD`) — a window that genuinely slides rather than resetting. The
sequence runs as one Lua script so it stays atomic under concurrency,
and each key carries the window as its TTL so idle keys expire instead
of accumulating.

---

## 6. Kafka Event Streaming Pipeline
`Apache Kafka · Spring Batch · PostgreSQL · Grafana · Docker · Kubernetes`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** →

*Draft — Problem:* Financial events must not be reordered within an
account, must not be lost, and must not be applied twice. Those three
constraints are what make a transaction pipeline harder than a queue.

*Draft — Architecture:* A custom partitioner keys on account ID, so
every event for one account lands on one partition and stays ordered
there. An idempotent producer and transactional writes give
exactly-once. The consumer group scales with the partition count. A
message that keeps failing goes to a dead-letter topic rather than
blocking its partition behind it, and consumer lag is the number Grafana
watches.

---

## 7. Spring Boot Microservices Starter
`Spring Cloud · Eureka · Resilience4j · Zipkin · Kubernetes`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** →

*Draft — Problem:* Every new service spends its first week re-adding the
same four things — discovery, external config, tracing, circuit breakers
— and each team's version drifts from the last.

*Draft — Architecture:* A chassis rather than a template. Services
register with Eureka on startup, so callers resolve by name instead of
by address. Config lives in Spring Cloud Config, outside the image.
Resilience4j supplies circuit breakers and bulkheads so one failing
dependency doesn't cascade. Zipkin spans propagate across calls, which
is the only way a request is followable once it crosses a process
boundary. The gateway is the single entry point.

---

## 8. SQL Query Optimizer Tool
`Java · Oracle SQL · JDBC · Spring Shell · Maven`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** (this one sounds closest to your Newgen SQL work — is it the same thing?) →

*Draft — Problem:* Hibernate hides the SQL it generates. A full table
scan or an N+1 lookup does not look wrong in the Java; it surfaces as
slowness in production, long after review.

*Draft — Architecture:* A Spring Shell CLI that takes a query or a
captured statement log, pulls the real execution plan from Oracle or
Postgres, and reports on it — full scans, columns that would benefit
from a composite index, and the repeated single-row-lookup shape that
means an N+1. It reads plans rather than guessing from the query text,
which is the difference between advice and a heuristic.

---

## 9. Event Sourcing CQRS Framework
`Java · PostgreSQL · Spring Boot · CQRS · Event Sourcing`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** →

*Draft — Problem:* A row that is overwritten keeps the value and loses
the reason. For anything auditable, the history is the asset and the
current state is just a convenience.

*Draft — Architecture:* Aggregates emit events; the store appends them
to PostgreSQL with a version per aggregate for optimistic concurrency.
Current state is a left-fold of the stream. Projections build read
models separately from the write path, which is the whole point of the
CQRS split, and replay rebuilds any projection from the log — so a
reporting bug is fixed by rebuilding, not by migrating.

---

## 10. DevOps CI/CD Pipeline Templates
`GitHub Actions · Jenkins · Docker · Kubernetes · Helm · AWS ECR`

**Q1. Did you build this?** →
**Q2. What did *you* personally write?** →
**Q3. What came of it?** →

*Draft — Problem:* Pipeline config is copied between repositories and
then edited, so after a few services no two pipelines do the same
things in the same order.

*Draft — Architecture:* One reusable workflow rather than ten copies —
build, test behind a coverage gate, image to ECR, Helm release to
Kubernetes, smoke test against the deployed service, and a rollback to
the previous release when that smoke test fails. The smoke test is the
part that makes the rollback meaningful; without it a bad deploy is
still green.

---

## Also worth their own entries

Three projects with actual repositories behind them, and none of them
are in `projects` today:

- **`upi-buddy`** — *"Full-stack upi application with ai integrated —
  15+ Spring Boot microservices + React + Kafka + Redis + AI."* This is
  the largest thing you have on GitHub and it is not on your portfolio.
- **`social-media-graphql`** — *"social media platform using graphql
  instead of traditional rest calls for every service call."* The
  GraphQL-over-REST decision is a real architectural argument worth
  making.
- **`ak-portfolio`** — this site. I can write all five fields for it
  from the codebase with nothing to verify: the trace metaphor, Jaeger's
  critical-path walk and its tiling invariant, one instanced draw call
  for the span field, the two texture tiers. Say the word.

**Q. Add these three as projects?** →
