import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export type ArcState = 'idle' | 'listening' | 'thinking';

interface ArcReactorProps {
  state: ArcState;
  className?: string;
}

export function ArcReactor({ state, className }: ArcReactorProps) {
  const getColors = () => {
    switch (state) {
      case 'listening': return 'border-green-400 shadow-green-500/50';
      case 'thinking': return 'border-purple-400 shadow-purple-500/50';
      case 'idle':
      default: return 'border-cyber-accent shadow-cyber-accent/50';
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'listening':
        return { scale: [1, 1.2, 1], rotate: 360, transition: { duration: 1, repeat: Infinity } };
      case 'thinking':
        return { scale: [1, 0.8, 1.1, 1], rotate: -360, transition: { duration: 1.5, repeat: Infinity } };
      case 'idle':
      default:
        return { scale: [1, 1.05, 1], rotate: 0, transition: { duration: 3, repeat: Infinity } };
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center w-24 h-24", className)}>
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full border-4 opacity-50 shadow-[0_0_30px]",
          getColors()
        )}
        animate={getAnimation()}
      />
      <motion.div
        className={cn(
          "absolute inset-2 rounded-full border-2 border-dashed opacity-70",
          getColors()
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div className={cn(
        "w-12 h-12 rounded-full bg-cyber-dark border border-cyber-accent/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center z-10 transition-colors duration-500",
        state === 'listening' ? 'bg-green-900/50' : state === 'thinking' ? 'bg-purple-900/50' : ''
      )}>
        <div className={cn(
          "w-4 h-4 rounded-full shadow-[0_0_10px]",
          state === 'listening' ? 'bg-green-400 shadow-green-400' : state === 'thinking' ? 'bg-purple-400 shadow-purple-400' : 'bg-cyber-accent shadow-cyber-accent'
        )} />
      </div>
    </div>
  );
}
