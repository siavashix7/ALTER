import { Outlet, NavLink } from 'react-router-dom';
import { MessageSquare, BrainCircuit, CheckSquare, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function Layout() {
  const language = useStore((state) => state.language);
  const isRtl = language === 'fa';

  const navItems = [
    { to: '/', icon: MessageSquare, label: isRtl ? 'گفتگو' : 'Chat' },
    { to: '/memory', icon: BrainCircuit, label: isRtl ? 'حافظه' : 'Memory' },
    { to: '/tasks', icon: CheckSquare, label: isRtl ? 'وظایف' : 'Tasks' },
    { to: '/settings', icon: Settings, label: isRtl ? 'تنظیمات' : 'System' },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-[100dvh] bg-cyber-bg text-cyber-text overflow-hidden",
        isRtl ? 'font-sans' : 'font-mono'
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <main className="flex-1 overflow-y-auto pb-20 safe-area-pt">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-cyber-dark/80 backdrop-blur-md border-t border-cyber-accent/20 flex items-center justify-around px-4 safe-area-pb z-50">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300",
                isActive
                  ? "text-cyber-accent scale-110 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-cyber-muted hover:text-cyber-text"
              )
            }
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
