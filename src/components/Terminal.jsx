import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = {
  help: {
    output: [
      { t: 'dim',   v: '  ┌─────────────────────────────────────────────┐' },
      { t: 'head',  v: '  │        akash.dev — available commands        │' },
      { t: 'dim',   v: '  ├──────────────────┬──────────────────────────┤' },
      { t: 'label', v: '  │  whoami / about  │  experience  │  skills   │' },
      { t: 'label', v: '  │  projects        │  trading     │  market   │' },
      { t: 'label', v: '  │  pnl             │  portfolio   │  stats    │' },
      { t: 'label', v: '  │  resume          │  github      │  linkedin │' },
      { t: 'label', v: '  │  certifications  │  clear       │  coffee   │' },
      { t: 'dim',   v: '  └─────────────────────────────────────────────┘' },
      { t: 'muted', v: '  Tip: use ↑↓ arrow keys for history · Tab to autocomplete' },
    ],
  },
  whoami: {
    output: [
      { t: 'cyan',  v: '  ╔══════════════════════════════════════════╗' },
      { t: 'cyan',  v: '  ║         AKASH KASTURE — PROFILE          ║' },
      { t: 'cyan',  v: '  ╚══════════════════════════════════════════╝' },
      { t: 'white', v: '  Role       →  Software Engineer | Trader' },
      { t: 'white', v: '  Company    →  Newgen Software Technology' },
      { t: 'white', v: '  Location   →  Pune, India' },
      { t: 'white', v: '  Focus      →  Distributed Systems · Fintech · AI' },
      { t: 'green', v: '  Status     →  ● Open to opportunities' },
    ],
  },
  about: {
    output: [
      { t: 'head',  v: '  ABOUT AKASH' },
      { t: 'white', v: '  Backend Engineer with 2+ years at Newgen Software.' },
      { t: 'white', v: '  Specializing in high-throughput distributed systems,' },
      { t: 'white', v: '  event-driven microservices, and fintech platforms.' },
      { t: 'muted', v: '' },
      { t: 'white', v: '  Also an active F&O trader — BankNifty options,' },
      { t: 'white', v: '  technical analysis, and market analytics.' },
      { t: 'muted', v: '' },
      { t: 'cyan',  v: '  Engineering systems by day. Reading charts by night.' },
    ],
  },
  skills: {
    output: [
      { t: 'head',  v: '  TECHNICAL SKILLS' },
      { t: 'green', v: '  ▸ Backend      Java · Spring Boot · Microservices · REST' },
      { t: 'indigo',v: '  ▸ Messaging    Apache Kafka · IBM MQ · WebSocket · RabbitMQ' },
      { t: 'purple',v: '  ▸ Databases    Oracle SQL · PL/SQL · PostgreSQL · Redis · MongoDB' },
      { t: 'yellow',v: '  ▸ DevOps       Docker · Kubernetes · AWS · Jenkins / CI-CD' },
      { t: 'pink',  v: '  ▸ Architecture Distributed Systems · Event-Driven · CQRS · Saga' },
      { t: 'green', v: '  ▸ Trading      Market Analytics · Algorithmic Trading · Risk Mgmt' },
    ],
  },
  projects: {
    output: [
      { t: 'head',  v: '  FEATURED PROJECTS (10+)' },
      { t: 'cyan',  v: '  [1]  ChatStream           → AI platform · Kafka · WebSocket · Spring AI' },
      { t: 'cyan',  v: '  [2]  Multi-LLM RAG        → GPT-4/Claude/Gemini · pgvector · WebFlux' },
      { t: 'green', v: '  [3]  BankNifty Screener   → Live F&O OI · PCR · Max Pain · Redis' },
      { t: 'white', v: '  [4]  Distributed Cache    → Cache-aside · Write-through · Micrometer' },
      { t: 'white', v: '  [5]  Rate Limiter         → Redis sliding window · Spring Security' },
      { t: 'white', v: '  [6]  Kafka Pipeline       → 50K msg/min · Exactly-once · DLQ' },
      { t: 'white', v: '  [7]  Microservices Starter→ Eureka · Resilience4j · Zipkin' },
      { t: 'muted', v: '  ... and 3 more on GitHub → github.com/akashkasture' },
    ],
  },
  experience: {
    output: [
      { t: 'head',  v: '  WORK EXPERIENCE' },
      { t: 'cyan',  v: '  ● Software Engineer — Newgen Software Technology' },
      { t: 'muted', v: '    Jul 2024 → Present  ·  Full-Time' },
      { t: 'white', v: '    ✓ 15K+ daily messages · 99.95% uptime · 30% reliability ↑' },
      { t: 'white', v: '    ✓ $50M+/month transaction engine · zero errors' },
      { t: 'white', v: '    ✓ SQL optimization · 40% efficiency gains' },
      { t: 'muted', v: '' },
      { t: 'yellow',v: '  ◎ Software Engineering Intern — Newgen' },
      { t: 'muted', v: '    Jan 2024 → Jun 2024  ·  6-month internship → PPO' },
      { t: 'white', v: '    ✓ Production microservices · Oracle SQL · IBM MQ' },
      { t: 'white', v: '    ✓ 30% reduction in manual validation effort' },
    ],
  },
  trading: {
    output: [
      { t: 'head',  v: '  TRADING PROFILE' },
      { t: 'green', v: '  Instrument  →  BankNifty Options (F&O)' },
      { t: 'green', v: '  Style       →  Intraday + Positional' },
      { t: 'white', v: '  Strategy    →  Options buying · Greeks · Momentum' },
      { t: 'white', v: '  Analysis    →  Technical · Price action · OI analysis' },
      { t: 'cyan',  v: '  Watchlist   →  NIFTY50 · BANKNIFTY · SENSEX · FINNIFTY' },
      { t: 'muted', v: '' },
      { t: 'muted', v: '  "Markets are just distributed systems with latency." — AK' },
    ],
  },
  market: {
    output: [
      { t: 'head',  v: '  LIVE MARKET SNAPSHOT  [simulated]' },
      { t: 'dim',   v: '  ┌─────────────────────────────────────────┐' },
      { t: 'green', v: '  │  NIFTY 50    22,450.50   ▲ +1.2%       │' },
      { t: 'green', v: '  │  BANK NIFTY  48,120.75   ▲ +0.8%       │' },
      { t: 'green', v: '  │  SENSEX      74,119.60   ▲ +1.1%       │' },
      { t: 'red',   v: '  │  NASDAQ      17,855.20   ▼ -0.3%       │' },
      { t: 'green', v: '  │  S&P 500      5,247.60   ▲ +0.5%       │' },
      { t: 'dim',   v: '  └─────────────────────────────────────────┘' },
      { t: 'muted', v: '  [Simulated values — for demo purposes only]' },
    ],
  },
  pnl: {
    output: [
      { t: 'head',  v: '  P&L SUMMARY  [simulated]' },
      { t: 'green', v: '  Today        →  ▲ +2.4%   ₹ 3,840' },
      { t: 'green', v: '  This Week    →  ▲ +7.1%   ₹ 11,360' },
      { t: 'green', v: '  This Month   →  ▲ +18.3%  ₹ 29,280' },
      { t: 'muted', v: '' },
      { t: 'white', v: '  Best Trade   →  BANKNIFTY CE  +127%' },
      { t: 'white', v: '  Win Rate     →  68%' },
      { t: 'white', v: '  Risk/Reward  →  1 : 2.4' },
      { t: 'muted', v: '' },
      { t: 'muted', v: '  [Simulated values — for demo purposes only]' },
    ],
  },
  portfolio: {
    output: [
      { t: 'head',  v: '  PORTFOLIO TRACKER  [simulated]' },
      { t: 'green', v: '  RELIANCE      ₹ 2,890  ▲ +12.3%  ██████████░ Long' },
      { t: 'green', v: '  TCS           ₹ 3,654  ▲ +8.7%   ████████░░░ Long' },
      { t: 'red',   v: '  HDFC BANK     ₹ 1,542  ▼ -2.1%   █████░░░░░░ Watch' },
      { t: 'green', v: '  INFY          ₹ 1,432  ▲ +5.4%   ███████░░░░ Long' },
      { t: 'cyan',  v: '  BANKNIFTY CE  ₹   245  ▲ +67%    ████████████ Active' },
      { t: 'muted', v: '' },
      { t: 'muted', v: '  [Simulated values — for demo purposes only]' },
    ],
  },
  stats: {
    output: [
      { t: 'head',  v: '  KEY STATS' },
      { t: 'cyan',  v: '  Experience   →  2+ Years in production systems' },
      { t: 'cyan',  v: '  Projects     →  10+ shipped' },
      { t: 'cyan',  v: '  Uptime       →  99.95% achieved' },
      { t: 'cyan',  v: '  Throughput   →  15K+ messages/day' },
      { t: 'cyan',  v: '  Txn Volume   →  $50M+ / month' },
      { t: 'muted', v: '' },
      { t: 'green', v: '  CGPA         →  8.6 / 10 — PCCOE Pune' },
    ],
  },
  certifications: {
    output: [
      { t: 'head',  v: '  CERTIFICATIONS & LEARNING' },
      { t: 'white', v: '  ✓  AWS Cloud Practitioner (in progress)' },
      { t: 'white', v: '  ✓  Spring Boot & Microservices — Udemy' },
      { t: 'white', v: '  ✓  Apache Kafka Developer — Confluent' },
      { t: 'white', v: '  ✓  System Design — AlgoExpert / Grokking' },
      { t: 'cyan',  v: '  ✓  NSE Certified Options Trader (NCFM)' },
      { t: 'muted', v: '' },
      { t: 'muted', v: '  Currently learning: Rust · K8s Operators · Apache Flink' },
    ],
  },
  resume: {
    output: [
      { t: 'head',  v: '  RESUME' },
      { t: 'white', v: '  Name     →  Akash Kasture' },
      { t: 'white', v: '  Role     →  Software Engineer | Trader' },
      { t: 'white', v: '  Stack    →  Java · Spring Boot · Kafka · Oracle SQL · Docker' },
      { t: 'muted', v: '' },
      { t: 'cyan',  v: '  Download →  Contact me for the latest resume PDF' },
      { t: 'muted', v: '  Email    →  akashkasture4884@gmail.com' },
    ],
  },
  github: {
    output: [
      { t: 'white', v: '  Opening GitHub profile...' },
      { t: 'cyan',  v: '  → https://github.com/akashkasture' },
      { t: 'muted', v: '  Featured: ChatStream · Multi-LLM RAG · BankNifty Screener' },
    ],
  },
  linkedin: {
    output: [
      { t: 'white', v: '  Opening LinkedIn profile...' },
      { t: 'cyan',  v: '  → https://linkedin.com/in/akashkasture' },
      { t: 'muted', v: '  Feel free to connect and reach out!' },
    ],
  },
  contact: {
    output: [
      { t: 'head',  v: '  CONTACT' },
      { t: 'white', v: '  Email    →  akashkasture4884@gmail.com' },
      { t: 'white', v: '  GitHub   →  github.com/akashkasture' },
      { t: 'white', v: '  LinkedIn →  linkedin.com/in/akashkasture' },
      { t: 'white', v: '  Location →  Pune, India' },
      { t: 'green', v: '  Status   →  ● Open to opportunities' },
      { t: 'muted', v: '  Response time → < 24 hours' },
    ],
  },
  coffee: {
    output: [
      { t: 'white', v: '  Brewing...' },
      { t: 'muted', v: '  ░░░░░░░░░░░░  0%' },
      { t: 'yellow',v: '  ████░░░░░░░░  33%' },
      { t: 'yellow',v: '  ████████░░░░  67%' },
      { t: 'green', v: '  ████████████  100%  ☑ Done' },
      { t: 'cyan',  v: '  Coffee ready! Productivity +∞' },
    ],
  },
};

const SUGGESTIONS = Object.keys(COMMANDS);

const COLOR_MAP = {
  head:   'text-indigo-300 font-bold',
  white:  'text-slate-200',
  cyan:   'text-cyan-400',
  green:  'text-emerald-400',
  red:    'text-red-400',
  yellow: 'text-amber-400',
  purple: 'text-purple-400',
  pink:   'text-pink-400',
  indigo: 'text-indigo-400',
  muted:  'text-slate-600',
  dim:    'text-slate-700',
  label:  'text-slate-400',
};

const BOOT_LINES = [
  { t: 'dim',   v: '  akash.dev terminal v3.0 — booting...' },
  { t: 'muted', v: '  [✓] Loading profile data...' },
  { t: 'muted', v: '  [✓] Connecting to market feed...' },
  { t: 'muted', v: '  [✓] Initializing Kafka consumer...' },
  { t: 'green', v: '  [✓] All systems online. Ready.' },
  { t: 'cyan',  v: '  Type "help" to see all commands.' },
];

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [suggestion, setSuggestion] = useState('');
  const [booted, setBooted] = useState(false);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Boot sequence animation
  useEffect(() => {
    let cancelled = false;
    const show = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return;
        await new Promise(r => setTimeout(r, 280));
        setHistory(prev => [...prev, { type: BOOT_LINES[i].t, content: BOOT_LINES[i].v }]);
      }
      if (!cancelled) setBooted(true);
    };
    show();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const inputLine = { type: 'input', content: `$ ${cmd}` };

    if (trimmed === 'clear') {
      setHistory([{ type: 'cyan', content: '  Terminal cleared. Type "help" for commands.' }]);
      setCmdHistory(prev => [cmd, ...prev]);
      setHistIdx(-1);
      setInput('');
      setSuggestion('');
      return;
    }

    if (trimmed === 'github') {
      window.open('https://github.com/akashkasture', '_blank');
    }
    if (trimmed === 'linkedin') {
      window.open('https://linkedin.com/in/akashkasture', '_blank');
    }

    const def = COMMANDS[trimmed];
    const lines = def
      ? def.output.map(o => ({ type: o.t, content: o.v }))
      : [{ type: 'red', content: `  Command not found: ${trimmed}. Try "help".` }];

    setHistory(prev => [...prev, inputLine, ...lines, { type: 'muted', content: '' }]);
    setCmdHistory(prev => [cmd, ...prev]);
    setHistIdx(-1);
    setInput('');
    setSuggestion('');
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : cmdHistory[idx]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion && suggestion !== input) setInput(suggestion);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val) {
      const match = SUGGESTIONS.find(s => s.startsWith(val.toLowerCase()));
      setSuggestion(match || '');
    } else {
      setSuggestion('');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: '#000000' }}>
      {/* Output */}
      <div
        ref={outputRef}
        className="p-5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden font-mono text-sm terminal-scroll"
        onClick={() => inputRef.current?.focus()}
        style={{ letterSpacing: '0.01em' }}
      >
        <AnimatePresence initial={false}>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              className={`leading-relaxed whitespace-pre-wrap mb-0.5 ${
                entry.type === 'input'
                  ? 'text-indigo-400'
                  : COLOR_MAP[entry.type] || 'text-slate-400'
              }`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12 }}
            >
              {entry.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Input line */}
        {booted && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-indigo-400 select-none">$</span>
            <div className="relative flex-1">
              {/* Autocomplete ghost text */}
              {suggestion && suggestion !== input && (
                <span className="absolute left-0 top-0 text-slate-700 pointer-events-none font-mono">
                  {suggestion}
                </span>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white outline-none caret-indigo-400 font-mono"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick command chips */}
      <div
        className="px-5 py-3 border-t flex gap-1.5 flex-wrap flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#0a1120' }}
      >
        {['help', 'about', 'skills', 'trading', 'market', 'pnl', 'stats', 'projects', 'experience', 'contact'].map(cmd => (
          <button
            key={cmd}
            onClick={() => { inputRef.current?.focus(); runCommand(cmd); }}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-white/6 text-slate-600 hover:text-slate-300 hover:border-indigo-500/25 hover:bg-indigo-500/5 transition-all duration-150"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
