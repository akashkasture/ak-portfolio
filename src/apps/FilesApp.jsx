import { useMemo, useRef, useState } from 'react';
import { ChevronRight, FilePlus, FileText, FolderPlus, Pencil, Search, Trash2, ArrowLeft } from 'lucide-react';
import { IconFolder } from '../os/icons';
import { useFileSystem } from '../context/FileSystemContext';

function timeAgo(ts) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function Editor({ node, onBack }) {
  const { updateContent, renameNode } = useFileSystem();
  const saveTimer = useRef(null);
  const [draft, setDraft] = useState(node.content);
  const [saved, setSaved] = useState(true);

  const onChange = (value) => {
    setDraft(value);
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateContent(node.id, value);
      setSaved(true);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--surface-border)' }}>
        <button onClick={onBack} aria-label="Back to files" className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={15} />
        </button>
        <input
          defaultValue={node.name}
          onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== node.name) renameNode(node.id, v); }}
          className="bg-transparent outline-none text-sm font-medium flex-1"
          style={{ color: 'var(--text-1)' }}
          aria-label="File name"
        />
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-4)' }}>{saved ? 'saved' : 'saving…'}</span>
      </div>
      <textarea
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-h-0 w-full resize-none outline-none bg-transparent p-4 text-sm font-mono leading-relaxed"
        style={{ color: 'var(--text-2)' }}
        spellCheck={false}
        aria-label="File content"
      />
    </div>
  );
}

export default function FilesApp() {
  const fsApi = useFileSystem();
  const { rootId, getNode, childrenOf, createNode, renameNode, moveToTrash } = fsApi;
  const [cwd, setCwd] = useState(rootId);
  const [openFileId, setOpenFileId] = useState(null);
  const [query, setQuery] = useState('');
  const [renaming, setRenaming] = useState(null);

  const crumbs = useMemo(() => {
    const chain = [];
    let node = getNode(cwd);
    while (node) {
      chain.unshift(node);
      node = node.parentId ? getNode(node.parentId) : null;
    }
    return chain;
  }, [cwd, getNode]);

  const items = childrenOf(cwd).filter((n) => !query || n.name.toLowerCase().includes(query.toLowerCase()));
  const openFile = openFileId ? getNode(openFileId) : null;

  if (openFile && !openFile.trashed) {
    return <Editor key={openFile.id} node={openFile} onBack={() => setOpenFileId(null)} />;
  }

  const newItem = (type) => {
    const name = type === 'folder' ? 'New Folder' : 'Untitled.md';
    const id = createNode(name, type, cwd);
    setRenaming(id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 flex-wrap" style={{ borderBottom: '1px solid var(--surface-border)' }}>
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {crumbs.map((c, i) => (
            <span key={c.id} className="flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight size={12} style={{ color: 'var(--text-4)' }} />}
              <button
                onClick={() => setCwd(c.id)}
                className="text-[13px] truncate px-1 py-0.5 rounded transition-colors hover:bg-white/5"
                style={{ color: i === crumbs.length - 1 ? 'var(--text-1)' : 'var(--text-3)' }}
              >
                {c.name}
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Search size={13} style={{ color: 'var(--text-4)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent outline-none text-xs w-24"
              style={{ color: 'var(--text-2)' }}
              aria-label="Search files"
            />
          </div>
          <button onClick={() => newItem('folder')} aria-label="New folder" title="New folder" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <FolderPlus size={15} />
          </button>
          <button onClick={() => newItem('file')} aria-label="New file" title="New file" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <FilePlus size={15} />
          </button>
        </div>
      </div>

      {/* Listing */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6">
            <IconFolder size={28} style={{ color: 'var(--text-4)' }} />
            <p className="text-sm" style={{ color: 'var(--text-4)' }}>
              {query ? 'Nothing matches your search.' : 'This folder is empty.'}
            </p>
          </div>
        )}
        {items.map((node) => (
          <div
            key={node.id}
            className="group flex items-center gap-3 px-4 py-2.5 cursor-default transition-colors hover:bg-white/[0.04]"
            onDoubleClick={() => (node.type === 'folder' ? setCwd(node.id) : setOpenFileId(node.id))}
          >
            {node.type === 'folder'
              ? <IconFolder size={17} style={{ color: '#38bdf8' }} />
              : <FileText size={16} style={{ color: 'var(--text-3)' }} />}
            {renaming === node.id ? (
              <input
                autoFocus
                defaultValue={node.name}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => { const v = e.target.value.trim(); if (v) renameNode(node.id, v); setRenaming(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setRenaming(null); }}
                className="flex-1 bg-transparent outline-none text-sm rounded px-1"
                style={{ color: 'var(--text-1)', border: '1px solid var(--os-accent)' }}
                aria-label="Rename"
              />
            ) : (
              <button
                className="flex-1 text-left text-sm truncate"
                style={{ color: 'var(--text-1)' }}
                onClick={() => (node.type === 'folder' ? setCwd(node.id) : setOpenFileId(node.id))}
              >
                {node.name}
              </button>
            )}
            <span className="text-[11px] font-mono flex-shrink-0" style={{ color: 'var(--text-4)' }}>{timeAgo(node.updatedAt)}</span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => setRenaming(node.id)} aria-label={`Rename ${node.name}`} className="p-1.5 rounded-md text-slate-400 hover:text-white transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={() => moveToTrash(node.id)} aria-label={`Move ${node.name} to trash`} className="p-1.5 rounded-md text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 text-[11px] font-mono flex-shrink-0" style={{ borderTop: '1px solid var(--surface-border)', color: 'var(--text-4)' }}>
        {items.length} item{items.length === 1 ? '' : 's'} · double-click to open · files persist in your browser
      </div>
    </div>
  );
}
