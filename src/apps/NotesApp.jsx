import { useEffect, useMemo, useRef, useState } from 'react';
import { Pin, Plus, Search, Trash2 } from 'lucide-react';
import { IconNote } from '../os/icons';

const STORAGE_KEY = 'ak-os-notes-v1';

function seed() {
  const now = Date.now();
  return [
    {
      id: `note-${now}`,
      body: 'Welcome to AK Notes\n\nEverything you write here autosaves to your browser — no account, no server.\n\n• Create notes with the + button\n• Pin the ones you care about\n• The first line becomes the title',
      pinned: true,
      updatedAt: now,
    },
  ];
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* fall through */ }
  return seed();
}

function titleOf(note) {
  const first = (note.body || '').split('\n')[0].trim();
  return first || 'Untitled note';
}

export default function NotesApp() {
  const [notes, setNotes] = useState(load);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current && notes.length > 0) {
      didInit.current = true;
      setSelectedId(notes[0].id);
    }
  }, [notes]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* ignore */ }
  }, [notes]);

  const sorted = useMemo(
    () =>
      [...notes]
        .filter((n) => !query || n.body.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (a.pinned !== b.pinned ? (a.pinned ? -1 : 1) : b.updatedAt - a.updatedAt)),
    [notes, query]
  );

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const createNote = () => {
    const note = { id: `note-${Date.now()}`, body: '', pinned: false, updatedAt: Date.now() };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  };

  const updateBody = (id, body) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, body, updatedAt: Date.now() } : n)));
  };

  const togglePin = (id) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const remove = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="@container h-full">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-40 @md:w-56 flex-shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--surface-border)' }}>
          <div className="flex items-center gap-1.5 p-2.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--surface-border)' }}>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg flex-1 min-w-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Search size={12} style={{ color: 'var(--text-4)' }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent outline-none text-xs w-full"
                style={{ color: 'var(--text-2)' }}
                aria-label="Search notes"
              />
            </div>
            <button onClick={createNote} aria-label="New note" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0">
              <Plus size={15} />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto py-1">
            {sorted.length === 0 && (
              <p className="text-xs text-center px-3 py-6" style={{ color: 'var(--text-4)' }}>No notes yet.</p>
            )}
            {sorted.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedId(note.id)}
                className="w-full text-left px-3 py-2.5 transition-colors"
                style={{ background: selectedId === note.id ? 'rgba(var(--os-accent-rgb), 0.12)' : 'transparent' }}
              >
                <div className="flex items-center gap-1.5">
                  {note.pinned && <Pin size={10} className="flex-shrink-0" style={{ color: 'var(--os-accent)' }} />}
                  <span className="text-[13px] font-medium truncate" style={{ color: 'var(--text-1)' }}>{titleOf(note)}</span>
                </div>
                <div className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>
                  {(note.body.split('\n').slice(1).find((l) => l.trim()) || 'No additional text')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        {selected ? (
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-end gap-1 px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <button
                onClick={() => togglePin(selected.id)}
                aria-label={selected.pinned ? 'Unpin note' : 'Pin note'}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: selected.pinned ? 'var(--os-accent)' : 'var(--text-4)' }}
              >
                <Pin size={14} />
              </button>
              <button onClick={() => remove(selected.id)} aria-label="Delete note" className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              key={selected.id}
              value={selected.body}
              onChange={(e) => updateBody(selected.id, e.target.value)}
              placeholder="Start writing…"
              className="flex-1 min-h-0 w-full resize-none outline-none bg-transparent p-4 text-sm leading-relaxed"
              style={{ color: 'var(--text-2)' }}
              aria-label="Note content"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <IconNote size={28} style={{ color: 'var(--text-4)' }} />
            <p className="text-sm" style={{ color: 'var(--text-4)' }}>Select a note or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
