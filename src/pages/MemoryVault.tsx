import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Brain, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export function MemoryVault() {
  const { memories, addMemory, deleteMemory, clearMemories, language } = useStore();
  const [newMemory, setNewMemory] = useState('');
  const isRtl = language === 'fa';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemory.trim()) {
      addMemory(newMemory.trim());
      setNewMemory('');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-purple-100">
            {isRtl ? 'خزانه حافظه' : 'MEMORY VAULT'}
          </h1>
        </div>
        {memories.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm(isRtl ? 'آیا از پاک کردن تمام حافظه مطمئن هستید؟' : 'Are you sure you want to purge all memories?')) {
                clearMemories();
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-900/40 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">{isRtl ? 'پاکسازی کامل' : 'PURGE CORE'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleAdd} className="mb-6 relative">
        <input
          type="text"
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          placeholder={isRtl ? "یک خاطره یا واقعیت جدید وارد کنید..." : "Inject new memory construct..."}
          className="w-full bg-cyber-dark/50 border border-purple-500/30 rounded-xl py-3 px-4 text-cyber-text placeholder:text-cyber-muted/50 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
          dir="auto"
        />
        <button
          type="submit"
          disabled={!newMemory.trim()}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 p-2 rounded-lg text-purple-400 hover:bg-purple-500/10 disabled:opacity-50 transition-colors",
            isRtl ? "left-2" : "right-2"
          )}
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
        {memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-cyber-muted/50 gap-4">
            <Brain className="w-12 h-12 opacity-20" />
            <p className="text-sm tracking-widest uppercase">
              {isRtl ? 'حافظه خالی است' : 'MEMORY BANKS EMPTY'}
            </p>
          </div>
        ) : (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-cyber-dark/40 border border-white/5 hover:border-purple-500/20 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-cyber-text text-sm break-words" dir="auto">
                  {memory.content}
                </p>
                <p className="text-[10px] text-cyber-muted/50 mt-2 font-mono">
                  {new Date(memory.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteMemory(memory.id)}
                className="p-2 text-cyber-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Delete memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
