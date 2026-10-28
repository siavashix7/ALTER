import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateAIResponse } from '../services/api';
import { ArcReactor, type ArcState } from '../components/ArcReactor';
import { Send, Mic, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSpeech } from '../hooks/useSpeech';

export function Chat() {
  const { messages, addMessage, activeProvider, geminiKey, openaiKey, language } = useStore();
  const [input, setInput] = useState('');
  const [arcState, setArcState] = useState<ArcState>('idle');
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, toggleListening, clearTranscript, isSupported, speak } = useSpeech(language);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // When speech transcript changes, update input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  const isRtl = language === 'fa';

  const hasKey = activeProvider === 'gemini' ? !!geminiKey : !!openaiKey;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !hasKey) return;

    const userPrompt = input.trim();
    setInput('');
    setError(null);
    addMessage({ role: 'user', content: userPrompt });
    setArcState('thinking');

    try {
      const response = await generateAIResponse(userPrompt);
      addMessage({ role: 'assistant', content: response });
      if (ttsEnabled) {
          speak(response, true);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      addMessage({ role: 'system', content: `Error: ${err.message || 'Failed to connect to AI core.'}` });
    } finally {
      setArcState('idle');
    }
  };

  const isTextRtl = (text: string) => {
      const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
      return rtlChars.test(text);
  };

  return (
    <div className="flex flex-col h-full p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <div className={cn("w-2 h-2 rounded-full", hasKey ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]")} />
           <span className="text-xs text-cyber-muted uppercase tracking-widest">
             {hasKey ? 'SYSTEM ONLINE' : 'API KEY REQUIRED'}
           </span>
        </div>
        <button
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className="text-cyber-muted hover:text-cyber-accent transition-colors p-2"
        >
          {ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <ArcReactor state={arcState} />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-500/50 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
        {messages.map((msg) => {
           const rtl = isTextRtl(msg.content);
           return (
            <div
              key={msg.id}
              className={cn(
                "max-w-[85%] rounded-2xl p-4 break-words shadow-lg",
                msg.role === 'user'
                  ? "bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-text self-end ml-auto rounded-tr-none"
                  : msg.role === 'system'
                  ? "bg-red-900/20 border border-red-500/30 text-red-300 self-center mx-auto text-sm w-full rounded-xl"
                  : "bg-cyber-dark border border-white/5 text-cyber-text self-start mr-auto rounded-tl-none",
                rtl ? "text-right font-sans" : "text-left font-mono"
              )}
              dir={rtl ? 'rtl' : 'ltr'}
            >
              {msg.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRtl ? "درخواست خود را وارد کنید..." : "Initialize command sequence..."}
          disabled={!hasKey}
          className={cn(
            "w-full bg-cyber-dark/50 border border-cyber-accent/30 rounded-full py-4 px-6 text-cyber-text placeholder:text-cyber-muted/50 focus:outline-none focus:border-cyber-accent focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all",
            isRtl ? "pr-14 pl-16 font-sans" : "pl-6 pr-24 font-mono text-sm"
          )}
          dir="auto"
        />
        <div className={cn("absolute top-1/2 -translate-y-1/2 flex items-center gap-1", isRtl ? "left-2" : "right-2")}>
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={!hasKey}
              className={cn(
                "p-3 rounded-full transition-colors",
                isListening ? "text-green-400 bg-green-400/10" : "text-cyber-muted hover:text-cyber-accent hover:bg-cyber-accent/10",
                !hasKey && "opacity-50 cursor-not-allowed"
              )}
            >
              <Mic size={20} />
            </button>
          )}
          <button
            type="submit"
            disabled={!input.trim() || !hasKey || arcState === 'thinking'}
            className="p-3 rounded-full text-cyber-accent hover:bg-cyber-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} className={cn(isRtl && "rotate-180")} />
          </button>
        </div>
      </form>
    </div>
  );
}
