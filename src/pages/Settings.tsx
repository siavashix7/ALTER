import { useState } from 'react';
import { useStore, type Provider } from '../store/useStore';
import { Settings as SettingsIcon, Key, Server, Globe2, Eye, EyeOff, Save, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export function Settings() {
  const store = useStore();
  const isRtl = store.language === 'fa';

  const [showKeys, setShowKeys] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local state for form before saving
  const [formData, setFormData] = useState({
    geminiKey: store.geminiKey,
    openaiKey: store.openaiKey,
    customEndpoint: store.customEndpoint,
    customKey: store.customKey,
    activeProvider: store.activeProvider,
    language: store.language
  });

  const handleSave = () => {
    store.setGeminiKey(formData.geminiKey);
    store.setOpenaiKey(formData.openaiKey);
    store.setCustomEndpoint(formData.customEndpoint);
    store.setCustomKey(formData.customKey);
    store.setActiveProvider(formData.activeProvider);
    store.setLanguage(formData.language);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const providers: { id: Provider; label: string }[] = [
    { id: 'gemini', label: 'Google Gemini' },
    { id: 'openai', label: 'OpenAI GPT' },
    { id: 'custom', label: 'Custom Endpoint' }
  ];

  const hasSTT = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="p-6 max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-cyber-accent/10 rounded-xl border border-cyber-accent/30">
          <SettingsIcon className="w-6 h-6 text-cyber-accent" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-cyber-accent">
          {isRtl ? 'پیکربندی سیستم' : 'SYSTEM CONFIGURATION'}
        </h1>
      </div>

      <div className="space-y-8">
        {/* Core Preferences */}
        <section className="space-y-4">
          <h2 className="text-sm tracking-widest text-cyber-muted uppercase flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            {isRtl ? 'تنظیمات پایه' : 'Core Preferences'}
          </h2>

          <div className="bg-cyber-dark/40 border border-white/5 rounded-2xl p-5 space-y-5">
            <div>
              <label className="block text-xs text-cyber-muted mb-2">Language / زبان</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({ ...formData, language: 'en' })}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-xl border text-sm transition-all",
                    formData.language === 'en'
                      ? "border-cyber-accent bg-cyber-accent/10 text-cyber-accent"
                      : "border-white/10 text-cyber-muted hover:border-white/20"
                  )}
                >
                  English
                </button>
                <button
                  onClick={() => setFormData({ ...formData, language: 'fa' })}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-xl border text-sm transition-all font-sans",
                    formData.language === 'fa'
                      ? "border-cyber-accent bg-cyber-accent/10 text-cyber-accent"
                      : "border-white/10 text-cyber-muted hover:border-white/20"
                  )}
                >
                  فارسی
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-cyber-muted mb-2">{isRtl ? 'هوش مصنوعی فعال' : 'Active AI Engine'}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {providers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setFormData({ ...formData, activeProvider: p.id })}
                    className={cn(
                      "py-2 px-4 rounded-xl border text-sm transition-all",
                      formData.activeProvider === p.id
                        ? "border-cyber-accent bg-cyber-accent/10 text-cyber-accent"
                        : "border-white/10 text-cyber-muted hover:border-white/20"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API Configurations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm tracking-widest text-cyber-muted uppercase flex items-center gap-2">
              <Key className="w-4 h-4" />
              {isRtl ? 'کلیدهای دسترسی' : 'API Credentials'}
            </h2>
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="text-xs text-cyber-muted hover:text-cyber-accent flex items-center gap-1"
            >
              {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showKeys ? (isRtl ? 'مخفی' : 'Hide') : (isRtl ? 'نمایش' : 'Show')}
            </button>
          </div>

          <div className="bg-cyber-dark/40 border border-white/5 rounded-2xl p-5 space-y-4">
            <div>
              <label className="flex justify-between text-xs text-cyber-muted mb-2">
                <span>Gemini API Key</span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Get Free Key</a>
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                value={formData.geminiKey}
                onChange={e => setFormData({...formData, geminiKey: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent font-mono"
              />
            </div>
            <div>
              <label className="flex justify-between text-xs text-cyber-muted mb-2">
                <span>OpenAI API Key</span>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Get Key</a>
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                value={formData.openaiKey}
                onChange={e => setFormData({...formData, openaiKey: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent font-mono"
              />
            </div>
          </div>
        </section>

        {/* Diagnostics */}
        <section className="space-y-4">
          <h2 className="text-sm tracking-widest text-cyber-muted uppercase flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {isRtl ? 'وضعیت سیستم' : 'System Diagnostics'}
          </h2>
          <div className="bg-cyber-dark/40 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-cyber-muted">Speech-to-Text (Voice Input)</span>
              <span className={cn("px-2 py-1 rounded font-mono text-xs", hasSTT ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                {hasSTT ? 'SUPPORTED' : 'UNSUPPORTED'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-cyber-muted">Text-to-Speech (Voice Output)</span>
              <span className={cn("px-2 py-1 rounded font-mono text-xs", hasTTS ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                {hasTTS ? 'SUPPORTED' : 'UNSUPPORTED'}
              </span>
            </div>
          </div>
        </section>

        {/* Custom Endpoint */}
        {formData.activeProvider === 'custom' && (
          <section className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-sm tracking-widest text-cyber-muted uppercase flex items-center gap-2">
              <Server className="w-4 h-4" />
              {isRtl ? 'سرور سفارشی' : 'Custom Server'}
            </h2>
            <div className="bg-cyber-dark/40 border border-white/5 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs text-cyber-muted mb-2">Endpoint URL (REST format)</label>
                <input
                  type="text"
                  value={formData.customEndpoint}
                  onChange={e => setFormData({...formData, customEndpoint: e.target.value})}
                  placeholder="https://api.example.com/v1/chat/completions"
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-cyber-muted mb-2">Authorization Bearer Token (Optional)</label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={formData.customKey}
                  onChange={e => setFormData({...formData, customKey: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent font-mono"
                />
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-24 left-4 right-4 max-w-3xl mx-auto flex justify-end">
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg",
            saved
              ? "bg-green-500 text-black shadow-green-500/30"
              : "bg-cyber-accent text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          )}
        >
          <Save className="w-5 h-5" />
          {saved ? (isRtl ? 'ذخیره شد' : 'SAVED') : (isRtl ? 'اعمال تغییرات' : 'APPLY CHANGES')}
        </button>
      </div>
    </div>
  );
}
