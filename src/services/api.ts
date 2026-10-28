import { useStore } from '../store/useStore';

export async function generateAIResponse(prompt: string): Promise<string> {
  const state = useStore.getState();

  const systemPrompt = `You are ALTER, an advanced AI Assistant OS.
Your primary directive is to assist the user accurately and concisely.

Current Memories:
${state.memories.map(m => `- ${m.content}`).join('\n')}

Pending Tasks:
${state.tasks.filter(t => !t.completed).map(t => `- ${t.title}`).join('\n')}

INSTRUCTIONS:
1. If the user shares a personal fact or preference you should remember, silently append [MEMORY_ADD: fact] to your response.
2. If the user asks you to remind them or adds a task, silently append [TASK_ADD: task title] to your response.
3. Be concise, professional, and slightly cybernetic in tone.
4. Reply in the same language the user speaks (English or Persian).`;

  let responseText = "";

  if (state.activeProvider === 'gemini') {
      if (!state.geminiKey) throw new Error("MISSING API KEY: Please configure Gemini API Key in Settings.");

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }]
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Gemini API Error");
      }

      const data = await res.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    } else if (state.activeProvider === 'openai') {
      if (!state.openaiKey) throw new Error("MISSING API KEY: Please configure OpenAI API Key in Settings.");

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "OpenAI API Error");
      }

      const data = await res.json();
      responseText = data.choices?.[0]?.message?.content || "";

    } else if (state.activeProvider === 'custom') {
        if (!state.customEndpoint) throw new Error("MISSING ENDPOINT: Please configure Custom Endpoint in Settings.");
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (state.customKey) headers['Authorization'] = `Bearer ${state.customKey}`;

        const res = await fetch(state.customEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: 'gpt-4o-mini', // typical openrouter fallback
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: prompt }
                ]
            })
        });

        if (!res.ok) {
            throw new Error("Custom API Error");
        }

        const data = await res.json();
        responseText = data.choices?.[0]?.message?.content || "";
    }

  // Parse autonomous tags
  let cleanedResponse = responseText;

  const memoryRegex = /\[MEMORY_ADD:\s*(.+?)\]/g;
  let memMatch;
  while ((memMatch = memoryRegex.exec(responseText)) !== null) {
    state.addMemory(memMatch[1].trim());
    cleanedResponse = cleanedResponse.replace(memMatch[0], "");
  }

  const taskRegex = /\[TASK_ADD:\s*(.+?)\]/g;
  let taskMatch;
  while ((taskMatch = taskRegex.exec(responseText)) !== null) {
    state.addTask(taskMatch[1].trim());
    cleanedResponse = cleanedResponse.replace(taskMatch[0], "");
  }

  return cleanedResponse.trim();
}
