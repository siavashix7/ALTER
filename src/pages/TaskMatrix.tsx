import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ListTodo, Trash2, Plus, Check, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

export function TaskMatrix() {
  const { tasks, addTask, toggleTask, deleteTask, language } = useStore();
  const [newTask, setNewTask] = useState('');
  const isRtl = language === 'fa';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30">
            <ListTodo className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-green-100">
            {isRtl ? 'ماتریس وظایف' : 'TASK MATRIX'}
          </h1>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-cyber-dark border border-green-500/20 text-green-400 text-sm font-mono">
          {isRtl ? `${pendingCount} وظیفه فعال` : `${pendingCount} PENDING`}
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-6 relative">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={isRtl ? "وظیفه جدید تعریف کنید..." : "Assign new directive..."}
          className="w-full bg-cyber-dark/50 border border-green-500/30 rounded-xl py-3 px-4 text-cyber-text placeholder:text-cyber-muted/50 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all"
          dir="auto"
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 p-2 rounded-lg text-green-400 hover:bg-green-500/10 disabled:opacity-50 transition-colors",
            isRtl ? "left-2" : "right-2"
          )}
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-cyber-muted/50 gap-4">
            <ListTodo className="w-12 h-12 opacity-20" />
            <p className="text-sm tracking-widest uppercase">
              {isRtl ? 'هیچ وظیفه‌ای نیست' : 'NO ACTIVE DIRECTIVES'}
            </p>
          </div>
        ) : (
          [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || b.timestamp - a.timestamp).map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all group",
                task.completed
                  ? "bg-cyber-dark/20 border-transparent opacity-60"
                  : "bg-cyber-dark/40 border-white/5 hover:border-green-500/30"
              )}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "p-1 rounded-full transition-colors flex-shrink-0",
                  task.completed ? "text-green-500" : "text-cyber-muted hover:text-green-400"
                )}
              >
                {task.completed ? <Check className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>

              <span
                className={cn(
                  "flex-1 text-sm transition-all",
                  task.completed ? "line-through text-cyber-muted" : "text-cyber-text"
                )}
                dir="auto"
              >
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-cyber-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
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
