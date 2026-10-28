import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Provider = 'gemini' | 'openai' | 'custom';
export type Language = 'en' | 'fa';
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Memory {
  id: string;
  content: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  timestamp: number;
}

export interface AlterState {
  // Settings
  geminiKey: string;
  openaiKey: string;
  customEndpoint: string;
  customKey: string;
  activeProvider: Provider;
  language: Language;

  // Data
  messages: Message[];
  memories: Memory[];
  tasks: Task[];

  // Actions
  setGeminiKey: (key: string) => void;
  setOpenaiKey: (key: string) => void;
  setCustomEndpoint: (endpoint: string) => void;
  setCustomKey: (key: string) => void;
  setActiveProvider: (provider: Provider) => void;
  setLanguage: (lang: Language) => void;

  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  addMemory: (content: string) => void;
  deleteMemory: (id: string) => void;
  clearMemories: () => void;

  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useStore = create<AlterState>()(
  persist(
    (set) => ({
      // Initial Settings
      geminiKey: '',
      openaiKey: '',
      customEndpoint: '',
      customKey: '',
      activeProvider: 'gemini',
      language: 'en',

      // Initial Data
      messages: [],
      memories: [],
      tasks: [],

      // Actions
      setGeminiKey: (key) => set({ geminiKey: key }),
      setOpenaiKey: (key) => set({ openaiKey: key }),
      setCustomEndpoint: (endpoint) => set({ customEndpoint: endpoint }),
      setCustomKey: (key) => set({ customKey: key }),
      setActiveProvider: (provider) => set({ activeProvider: provider }),
      setLanguage: (lang) => set({ language: lang }),

      addMessage: (msg) => set((state) => ({
        messages: [...state.messages, { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }]
      })),
      clearMessages: () => set({ messages: [] }),

      addMemory: (content) => set((state) => ({
        memories: [...state.memories, { id: crypto.randomUUID(), content, timestamp: Date.now() }]
      })),
      deleteMemory: (id) => set((state) => ({
        memories: state.memories.filter((m) => m.id !== id)
      })),
      clearMemories: () => set({ memories: [] }),

      addTask: (title) => set((state) => ({
        tasks: [...state.tasks, { id: crypto.randomUUID(), title, completed: false, timestamp: Date.now() }]
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      }))
    }),
    {
      name: 'alter-storage',
    }
  )
)
