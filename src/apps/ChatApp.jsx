import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Info } from 'lucide-react';
import { IconChat } from '../os/icons';
import { trackEvent } from '../utils/analytics';

/* AK Chat is a UI demo of ChatStream's real interface — it does not call a
   live AI backend. Every answer below is drawn directly from ChatStream's
   actual architecture (see src/data/portfolio.js, project id 1) so the demo
   stays honest about what the project does instead of simulating intelligence
   it doesn't have. */

const TOPICS = [
  {
    q: 'How does ChatStream deliver messages in real time?',
    a: "Messages flow through a Kafka backbone: producer → topic partitioning → consumer → WebSocket push. That decouples ingestion from delivery, so the chat surface stays responsive even as load on the consumer side grows.",
  },
  {
    q: 'How are chat sessions managed?',
    a: 'Session state is Redis-backed with TTL heartbeats, which is what lets ChatStream support multiple concurrent sessions per user without pinning them to one server instance.',
  },
  {
    q: 'What does ChatStream actually help with?',
    a: 'Per its real feature set, it handles code generation, debugging assistance, and contextual Q&A — the AI layer runs on Spring AI, sitting on top of a Spring Boot service layer.',
  },
  {
    q: "What's the storage and deploy setup?",
    a: 'PostgreSQL is the system of record, Redis handles ephemeral session state, everything ships in Docker containers, and it deploys to AWS EC2.',
  },
  {
    q: 'What is the full tech stack?',
    a: 'Spring Boot, WebSocket, Kafka, Redis, PostgreSQL, Spring AI, Docker, AWS EC2 — full list in the Projects app if you want tech-chip form.',
  },
];

const KEYWORD_MAP = [
  { keys: ['storage', 'database', 'postgres', 'deploy', 'docker', 'aws', 'ec2', 'infra'], topic: 3 },
  { keys: ['session', 'redis', 'ttl', 'heartbeat'], topic: 1 },
  { keys: ['kafka', 'realtime', 'real-time', 'real time', 'message', 'websocket'], topic: 0 },
  { keys: ['help with', 'feature', 'capab', 'code gen', 'debugging', 'q&a', 'contextual', 'spring ai'], topic: 2 },
  { keys: ['stack', 'tech', 'built with', 'language'], topic: 4 },
];

function matchTopic(text) {
  const lower = text.toLowerCase();
  for (const { keys, topic } of KEYWORD_MAP) {
    if (keys.some((k) => lower.includes(k))) return TOPICS[topic];
  }
  return null;
}

function initialMessages() {
  return [
    {
      id: 'boot',
      role: 'assistant',
      text: "This is a UI demo of ChatStream's interface, not a live AI backend. Pick a question below, or type your own — I'll match it to something real about how ChatStream is actually built.",
    },
  ];
}

export default function ChatApp() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const idCounter = useRef(0);
  const nextId = (prefix) => `${prefix}-${idCounter.current++}`;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg = { id: nextId('u'), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setTyping(true);
    trackEvent('ak_chat_demo_send', { text: trimmed });

    const matched = matchTopic(trimmed);
    const reply = matched
      ? matched.a
      : "I don't have a scripted answer for that in this demo — try one of the suggested questions below to see how ChatStream describes its own architecture.";

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId('a'), role: 'assistant', text: reply }]);
      setTyping(false);
    }, 650 + Math.min(400, reply.length * 2));
  };

  return (
    <div className="@container flex flex-col h-full">
      {/* Demo disclosure banner */}
      <div
        className="flex items-center gap-2 px-4 py-2 flex-shrink-0 text-[11px]"
        style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid var(--surface-border)', color: 'var(--text-3)' }}
      >
        <Info size={12} className="flex-shrink-0" style={{ color: '#818cf8' }} />
        <span>UI demo of the ChatStream project's interface — scripted responses, not a live AI backend.</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
              style={{ justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div
                className="max-w-[85%] @md:max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                style={
                  m.role === 'user'
                    ? { background: 'var(--os-accent)', color: '#fff', borderBottomRightRadius: 4 }
                    : { background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-2)', borderBottomLeftRadius: 4 }
                }
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="rounded-2xl px-3.5 py-2.5 flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderBottomLeftRadius: 4 }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--text-4)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="flex flex-wrap gap-1.5 px-4 pb-2.5 flex-shrink-0">
        {TOPICS.map((t) => (
          <button
            key={t.q}
            onClick={() => send(t.q)}
            disabled={typing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-3)', border: '1px solid var(--surface-border)' }}
          >
            <IconChat size={11} />
            {t.q}
          </button>
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(draft); }}
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid var(--surface-border)' }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about ChatStream's architecture…"
          className="flex-1 bg-transparent outline-none text-sm px-3 py-2 rounded-xl"
          style={{ color: 'var(--text-1)', background: 'rgba(255,255,255,0.05)' }}
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={!draft.trim() || typing}
          aria-label="Send"
          className="p-2.5 rounded-xl text-white transition-opacity disabled:opacity-40"
          style={{ background: 'var(--os-accent)' }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
