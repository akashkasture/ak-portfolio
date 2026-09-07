# Case studies — what is still missing

`problem`, `architecture` and `challenges` are **written and shipped** for
all ten projects — they live in `src/data/portfolio.js` and render in the
inspector. They are analysis of each design, so they needed no facts from
you: a sliding window on Redis sorted sets really does grow per key
without a TTL whether or not anyone ever wrote it.

`contribution` and `results` are still empty, and they are the two that
cannot be derived. They are biography — what *you* did, and what came of
it. Written speculatively they become sentences to defend in an
interview rather than evidence in one.

**Two questions per project.** A line each is enough; I will write them
up. Answer inline after the arrow.

> **Q1 matters most, and "no — I never built this" is the most useful
> answer in this file.** None of these ten has a repository behind it.
> Four projects a hiring manager can interrogate beat ten they cannot,
> and the failure mode is not a thin portfolio — it is being asked to
> walk through exactly-once delivery in a pipeline you did not write.

---

## 1. ChatStream — AI Conversational Platform

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** →

---

## 2. Multi-LLM AI Platform with RAG

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** →

---

## 3. BankNifty Options Screener

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** (do you actually trade off it?) →

---

## 4. Distributed Cache Library

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** (used in any real service? published anywhere?) →

---

## 5. API Rate Limiter — Redis Sliding Window

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** →

---

## 6. Kafka Event Streaming Pipeline

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** →

---

## 7. Spring Boot Microservices Starter

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** →

---

## 8. SQL Query Optimizer Tool

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** (this is the closest one to your Newgen SQL work — is it the same thing?) →

---

## 9. Event Sourcing CQRS Framework

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** →

---

## 10. DevOps CI/CD Pipeline Templates

**Q1. Did you build this?** yes / partly / no →

**Q2. What did *you* personally write, and what came of it?** →

---

## Three repositories that are not on the portfolio at all

- **`upi-buddy`** — *"Full-stack upi application with ai integrated — 15+
  Spring Boot microservices + React + Kafka + Redis + AI."* The largest
  thing on your GitHub, and it is not listed.
- **`social-media-graphql`** — *"social media platform using graphql
  instead of traditional rest calls for every service call."* The
  GraphQL-over-REST decision is a real architectural argument.
- **`ak-portfolio`** — this site. I can write all five fields for it from
  the codebase with nothing to verify: the trace metaphor, Jaeger's
  critical-path walk and its tiling invariant, one instanced draw call
  for the span field, the two texture tiers.

**Q. Add these three as projects?** →
