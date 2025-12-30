
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am your AI Winter Safety Advisor. How can I help you stay safe and prepared today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const response = await getChatResponse(history, userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the intelligence core right now. Please check your emergency manual." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl">
             <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">SafeZone AI Assistant</h3>
            <p className="text-xs text-slate-400">Available 24/7 for winter guidance</p>
          </div>
        </div>
        <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">
          Live Analysis
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full h-fit shadow-sm ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-200'}`}>
                {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-slate-700" />}
              </div>
              <div className={`p-5 rounded-3xl shadow-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="p-2 rounded-full bg-slate-200 h-fit">
                <Bot className="w-5 h-5 text-slate-700" />
              </div>
              <div className="p-5 rounded-3xl bg-white border border-slate-200 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-slate-400 italic">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything (e.g., 'How to prevent pipes from freezing?')"
            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-6 pr-16 focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:bg-slate-300 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase font-medium tracking-widest">
          AI guidance is meant to supplement, not replace, local official warnings.
        </p>
      </div>
    </div>
  );
};

export default Advisor;
