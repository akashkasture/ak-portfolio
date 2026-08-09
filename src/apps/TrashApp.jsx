import { motion, AnimatePresence } from 'framer-motion';
import { FileText, RotateCcw, X } from 'lucide-react';
import { IconFolder, IconTrash } from '../os/icons';
import { useFileSystem } from '../context/FileSystemContext';

export default function TrashApp() {
  const { trashedNodes, restore, deleteForever, emptyTrash } = useFileSystem();
  const items = trashedNodes();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--surface-border)' }}>
        <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>
          Trash · {items.length} item{items.length === 1 ? '' : 's'}
        </span>
        {items.length > 0 && (
          <button
            onClick={emptyTrash}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors text-red-400 hover:bg-red-500/10"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
          >
            Empty Trash
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6">
            <IconTrash size={28} style={{ color: 'var(--text-4)' }} />
            <p className="text-sm" style={{ color: 'var(--text-4)' }}>Trash is empty.</p>
            <p className="text-xs" style={{ color: 'var(--text-4)' }}>Files deleted in AK Files land here.</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {items.map((node) => (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
              className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.04]"
            >
              {node.type === 'folder'
                ? <IconFolder size={17} style={{ color: 'var(--text-4)' }} />
                : <FileText size={16} style={{ color: 'var(--text-4)' }} />}
              <span className="flex-1 text-sm truncate" style={{ color: 'var(--text-2)' }}>{node.name}</span>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => restore(node.id)}
                  aria-label={`Restore ${node.name}`}
                  title="Restore"
                  className="p-1.5 rounded-md text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  onClick={() => deleteForever(node.id)}
                  aria-label={`Delete ${node.name} forever`}
                  title="Delete forever"
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
