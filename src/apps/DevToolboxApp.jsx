import { useState } from 'react';
import { Braces, Copy, Lock, RefreshCw, Regex as RegexIcon, Clock as ClockIcon } from 'lucide-react';

const TOOLS = [
  { id: 'json', label: 'JSON', icon: Braces },
  { id: 'base64', label: 'Base64', icon: Lock },
  { id: 'jwt', label: 'JWT', icon: Lock },
  { id: 'regex', label: 'Regex', icon: RegexIcon },
  { id: 'time', label: 'Timestamp', icon: ClockIcon },
];

function b64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function b64Decode(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function base64UrlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const normalized = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return b64Decode(normalized);
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-4)' }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--surface-border)',
  color: 'var(--text-1)',
};

function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(value || ''); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
      disabled={!value}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-colors disabled:opacity-30"
      style={{ color: 'var(--text-3)', background: 'rgba(255,255,255,0.05)' }}
    >
      <Copy size={10} /> {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function JsonTool() {
  const [input, setInput] = useState('{"name":"AK OS","real":true,"apps":13}');
  let formatted = '';
  let error = null;
  try {
    formatted = input.trim() ? JSON.stringify(JSON.parse(input), null, 2) : '';
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="flex flex-col h-full">
      <Field label="Input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className="w-full h-28 rounded-lg p-2.5 text-xs font-mono outline-none resize-none"
          style={inputStyle}
        />
      </Field>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: error ? '#f87171' : 'var(--text-4)' }}>
          {error ? `Invalid JSON — ${error}` : 'Formatted'}
        </span>
        <CopyBtn value={formatted} />
      </div>
      <pre className="flex-1 min-h-0 overflow-auto rounded-lg p-2.5 text-xs font-mono" style={inputStyle}>
        {formatted}
      </pre>
    </div>
  );
}

function Base64Tool() {
  const [plain, setPlain] = useState('AK OS by Akash Kasture');
  const [encoded, setEncoded] = useState('');
  const [error, setError] = useState(null);

  const encode = () => { try { setEncoded(b64Encode(plain)); setError(null); } catch { setError('Could not encode input'); } };
  const decode = () => { try { setPlain(b64Decode(encoded)); setError(null); } catch { setError('Invalid Base64 string'); } };

  return (
    <div className="flex flex-col gap-3">
      <Field label="Plain text">
        <textarea value={plain} onChange={(e) => setPlain(e.target.value)} spellCheck={false} className="w-full h-20 rounded-lg p-2.5 text-xs font-mono outline-none resize-none" style={inputStyle} />
      </Field>
      <div className="flex items-center justify-center gap-2">
        <button onClick={encode} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--os-accent)' }}>Encode ↓</button>
        <button onClick={decode} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--os-accent-2)' }}>Decode ↑</button>
      </div>
      <Field label="Base64">
        <textarea value={encoded} onChange={(e) => setEncoded(e.target.value)} spellCheck={false} className="w-full h-20 rounded-lg p-2.5 text-xs font-mono outline-none resize-none" style={inputStyle} />
      </Field>
      {error && <p className="text-[11px]" style={{ color: '#f87171' }}>{error}</p>}
      <CopyBtn value={encoded} />
    </div>
  );
}

function JwtTool() {
  const [token, setToken] = useState('');
  const parts = token.trim().split('.');
  let header = null, payload = null, error = null;

  if (token.trim()) {
    if (parts.length < 2) {
      error = 'Not a JWT — expected header.payload.signature';
    } else {
      try {
        header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
        payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
      } catch {
        error = 'Could not decode — check the token is well-formed';
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Field label="Token">
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOi..."
          spellCheck={false}
          className="w-full h-16 rounded-lg p-2.5 text-xs font-mono outline-none resize-none"
          style={inputStyle}
        />
      </Field>
      <p className="text-[10px] mb-2" style={{ color: 'var(--text-4)' }}>Decodes header + payload locally in your browser. Does not verify the signature.</p>
      {error && <p className="text-[11px] mb-2" style={{ color: '#f87171' }}>{error}</p>}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-2.5 overflow-hidden">
        <div className="flex flex-col min-h-0">
          <span className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-4)' }}>Header</span>
          <pre className="flex-1 min-h-0 overflow-auto rounded-lg p-2.5 text-[11px] font-mono" style={inputStyle}>{header}</pre>
        </div>
        <div className="flex flex-col min-h-0">
          <span className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-4)' }}>Payload</span>
          <pre className="flex-1 min-h-0 overflow-auto rounded-lg p-2.5 text-[11px] font-mono" style={inputStyle}>{payload}</pre>
        </div>
      </div>
    </div>
  );
}

function RegexTool() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Reach me at akashkasture4884@gmail.com or via the contact app.');

  let matches = [];
  let error = null;
  try {
    const effectiveFlags = flags.includes('g') ? flags : `${flags}g`;
    const re = new RegExp(pattern, effectiveFlags);
    matches = [...text.matchAll(re)];
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">
        <Field label="Pattern">
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} className="w-full rounded-lg px-2.5 py-2 text-xs font-mono outline-none" style={inputStyle} />
        </Field>
        <Field label="Flags">
          <input value={flags} onChange={(e) => setFlags(e.target.value)} spellCheck={false} className="w-16 rounded-lg px-2.5 py-2 text-xs font-mono outline-none" style={inputStyle} />
        </Field>
      </div>
      <Field label="Test string">
        <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} className="w-full h-20 rounded-lg p-2.5 text-xs font-mono outline-none resize-none" style={inputStyle} />
      </Field>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: error ? '#f87171' : 'var(--text-4)' }}>
          {error ? `Invalid regex — ${error}` : `${matches.length} match${matches.length === 1 ? '' : 'es'}`}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-auto rounded-lg p-2.5" style={inputStyle}>
        {matches.length === 0 && !error && <span className="text-xs" style={{ color: 'var(--text-4)' }}>No matches</span>}
        {matches.map((m, i) => (
          <div key={i} className="text-xs font-mono mb-1.5 pb-1.5" style={{ borderBottom: i < matches.length - 1 ? '1px solid var(--surface-border)' : 'none', color: 'var(--text-2)' }}>
            <span style={{ color: 'var(--os-accent)' }}>[{m.index}]</span> {m[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimestampTool() {
  const [epoch, setEpoch] = useState('1717425600');
  const [human, setHuman] = useState('2024-06-03T16:00:00');

  const setNow = () => {
    const ms = Date.now();
    setEpoch(String(Math.floor(ms / 1000)));
    setHuman(new Date(ms).toISOString().slice(0, 19));
  };

  const fromEpoch = () => {
    const n = Number(epoch);
    if (!Number.isFinite(n)) return;
    const ms = epoch.length > 10 ? n : n * 1000;
    setHuman(new Date(ms).toISOString().slice(0, 19));
  };

  const fromHuman = () => {
    const ms = new Date(human).getTime();
    if (Number.isFinite(ms)) setEpoch(String(Math.floor(ms / 1000)));
  };

  const preview = (() => {
    const n = Number(epoch);
    if (!Number.isFinite(n)) return 'Invalid epoch';
    const ms = epoch.length > 10 ? n : n * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? 'Invalid epoch' : d.toString();
  })();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button onClick={setNow} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-3)' }}>
          <RefreshCw size={11} /> Now
        </button>
      </div>
      <Field label="Unix epoch (s or ms)">
        <div className="flex gap-2">
          <input value={epoch} onChange={(e) => setEpoch(e.target.value)} className="flex-1 rounded-lg px-2.5 py-2 text-xs font-mono outline-none" style={inputStyle} />
          <button onClick={fromEpoch} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--os-accent)' }}>→</button>
        </div>
      </Field>
      <Field label="ISO date/time">
        <div className="flex gap-2">
          <input value={human} onChange={(e) => setHuman(e.target.value)} className="flex-1 rounded-lg px-2.5 py-2 text-xs font-mono outline-none" style={inputStyle} />
          <button onClick={fromHuman} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--os-accent-2)' }}>→</button>
        </div>
      </Field>
      <Field label="Preview">
        <div className="rounded-lg px-2.5 py-2 text-xs font-mono" style={inputStyle}>{preview}</div>
      </Field>
    </div>
  );
}

export default function DevToolboxApp() {
  const [tool, setTool] = useState('json');

  return (
    <div className="@container flex flex-col h-full">
      <div className="flex items-center gap-1 px-3 py-2 flex-shrink-0 overflow-x-auto" style={{ borderBottom: '1px solid var(--surface-border)' }}>
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const active = tool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
              style={{ background: active ? 'rgba(var(--os-accent-rgb), 0.14)' : 'transparent', color: active ? 'var(--os-accent)' : 'var(--text-3)' }}
            >
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {tool === 'json' && <JsonTool />}
        {tool === 'base64' && <Base64Tool />}
        {tool === 'jwt' && <JwtTool />}
        {tool === 'regex' && <RegexTool />}
        {tool === 'time' && <TimestampTool />}
      </div>
    </div>
  );
}
