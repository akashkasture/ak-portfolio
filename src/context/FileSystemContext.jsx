import { createContext, useContext, useEffect, useState } from 'react';
import { personalInfo, projects, experience } from '../data/portfolio';

const STORAGE_KEY = 'ak-os-files-v1';

function seed() {
  const nodes = {};
  let counter = 0;
  const add = (name, type, parentId, content = '') => {
    const id = `n${++counter}`;
    nodes[id] = { id, name, type, parentId, content, trashed: false, updatedAt: Date.now() };
    return id;
  };

  const root = add('Home', 'folder', null);

  add(
    'About.md',
    'file',
    root,
    `# ${personalInfo.name}\n${personalInfo.title}\n${personalInfo.location}\n\n${personalInfo.description}\n\nEmail: ${personalInfo.email}\nGitHub: ${personalInfo.github}\nLinkedIn: ${personalInfo.linkedin}`
  );

  const proj = add('Projects', 'folder', root);
  projects.forEach((p) => {
    add(
      `${p.title.split('—')[0].trim()}.md`,
      'file',
      proj,
      `# ${p.title}\nCategory: ${p.category}\n\n${p.description}\n\nTech: ${p.tech.join(', ')}`
    );
  });

  const exp = add('Experience', 'folder', root);
  experience.forEach((e) => {
    add(
      `${e.company} — ${e.role}.md`,
      'file',
      exp,
      `# ${e.role}\n${e.company} · ${e.period}\n\n${e.description}\n\n${e.achievements.map((a) => `• ${a}`).join('\n')}`
    );
  });

  add('Resume.md', 'file', root, `# Resume\n\nLatest resume available on request:\n${personalInfo.email}`);
  add('Archive', 'folder', root);

  return { nodes, rootId: root, counter };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.nodes && parsed?.rootId) return parsed;
    }
  } catch { /* fall through to seed */ }
  return seed();
}

const Ctx = createContext(null);

export function FileSystemProvider({ children }) {
  const [fs, setFs] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fs)); } catch { /* ignore */ }
  }, [fs]);

  const mutate = (fn) => setFs((prev) => {
    const next = { ...prev, nodes: { ...prev.nodes } };
    fn(next);
    return next;
  });

  const descendants = (nodes, id) => {
    const out = [];
    const walk = (pid) => {
      Object.values(nodes).forEach((n) => {
        if (n.parentId === pid) { out.push(n.id); walk(n.id); }
      });
    };
    walk(id);
    return out;
  };

  const api = {
    rootId: fs.rootId,
    getNode: (id) => fs.nodes[id],
    childrenOf: (parentId) =>
      Object.values(fs.nodes)
        .filter((n) => n.parentId === parentId && !n.trashed)
        .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1)),
    trashedNodes: () => Object.values(fs.nodes).filter((n) => n.trashed),
    createNode: (name, type, parentId) => {
      let created;
      mutate((next) => {
        next.counter = (next.counter || 0) + 1;
        const id = `n${next.counter}`;
        next.nodes[id] = { id, name, type, parentId, content: '', trashed: false, updatedAt: Date.now() };
        created = id;
      });
      return created;
    },
    renameNode: (id, name) => mutate((next) => {
      if (next.nodes[id]) next.nodes[id] = { ...next.nodes[id], name, updatedAt: Date.now() };
    }),
    updateContent: (id, content) => mutate((next) => {
      if (next.nodes[id]) next.nodes[id] = { ...next.nodes[id], content, updatedAt: Date.now() };
    }),
    moveToTrash: (id) => mutate((next) => {
      if (next.nodes[id]) next.nodes[id] = { ...next.nodes[id], trashed: true };
    }),
    restore: (id) => mutate((next) => {
      const node = next.nodes[id];
      if (!node) return;
      // If the original parent folder is gone or trashed, restore into Home
      const parentOk = node.parentId && next.nodes[node.parentId] && !next.nodes[node.parentId].trashed;
      next.nodes[id] = { ...node, trashed: false, parentId: parentOk ? node.parentId : next.rootId };
    }),
    deleteForever: (id) => mutate((next) => {
      [id, ...descendants(next.nodes, id)].forEach((nid) => delete next.nodes[nid]);
    }),
    emptyTrash: () => mutate((next) => {
      Object.values(next.nodes)
        .filter((n) => n.trashed)
        .forEach((n) => [n.id, ...descendants(next.nodes, n.id)].forEach((nid) => delete next.nodes[nid]));
    }),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useFileSystem() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useFileSystem must be used within FileSystemProvider');
  return ctx;
}
