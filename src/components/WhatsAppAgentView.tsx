import React, { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { callAI } from '../lib/openrouter';

interface WhatsAppAgentViewProps {
  chats: any[];
  setDbState: React.Dispatch<React.SetStateAction<any>>;
}

export default function WhatsAppAgentView({ chats, setDbState }: WhatsAppAgentViewProps) {
  const [activeChat, setActiveChat] = useState<any>(chats[0] || null);
  const [replyText, setReplyText] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);

  const handleGenerateAIResponse = async () => {
    if (!activeChat) return;
    setLoadingResponse(true);
    try {
      const res = await openRouterChat(
        `Redacta una respuesta profesional y directa para este mensaje de WhatsApp de un operario o transportista de almacén: "${activeChat.message}". Sé breve (máx 2 frases) y operativo.`,
        'Eres el coordinador logístico de WhatsApp de WarehouseFlow SGA. Respondes a conductores, transportistas y operarios de almacén de forma concisa y profesional.',
      );
      setReplyText(res);
    } catch {
      setReplyText('Error al generar respuesta. Comprueba tu API key de OpenRouter.');
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleSendReply = () => {
    if (!replyText || !activeChat) return;
    setDbState((prev: any) => {
      const updated = prev.whatsapp.map((chat: any) => 
        chat.id === activeChat.id ? { ...chat, responseByAI: replyText } : chat
      );
      return { ...prev, whatsapp: updated };
    });
    setActiveChat((prev: any) => ({ ...prev, responseByAI: replyText }));
    setReplyText('');
  };

  return (
    <div className="bg-[#050811] border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row gap-6">
      {/* Contact List */}
      <div className="w-full lg:w-80 space-y-3 shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chats Activos</h3>
        {chats.map((chat: any) => (
          <div 
            key={chat.id} 
            onClick={() => setActiveChat(chat)}
            className={`p-3.5 rounded-xl border cursor-pointer transition ${
              activeChat?.id === chat.id 
                ? 'bg-indigo-950/40 border-indigo-700/60' 
                : 'bg-[#0b0f19] border-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold text-xs text-white">{chat.sender}</p>
              <span className="text-[10px] text-slate-500 font-bold">{chat.time}</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate font-medium">{chat.message}</p>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[350px]">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-slate-200">{activeChat.sender}</p>
                <p className="text-[10px] text-emerald-550 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Chofer en Ruta</p>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 text-xs font-semibold">
              <div className="flex justify-start">
                <div className="bg-[#050811] border border-slate-800 rounded-xl p-3 max-w-[80%] text-slate-350">
                  {activeChat.message}
                </div>
              </div>
              
              {activeChat.responseByAI && (
                <div className="flex justify-end">
                  <div className="bg-indigo-600 rounded-xl p-3 max-w-[80%] text-white">
                    {activeChat.responseByAI}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="space-y-3">
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta o genera una inteligente..."
                className="w-full bg-[#050811] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 h-20 resize-none font-semibold"
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={handleGenerateAIResponse}
                  disabled={loadingResponse}
                  className="px-3.5 py-2 border border-slate-800 hover:bg-slate-800 text-slate-355 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  type="button"
                >
                  {loadingResponse ? <Loader2 className="animate-spin" size={12} /> : <Bot size={12} />} IA Redactar
                </button>
                <button 
                  onClick={handleSendReply}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  type="button"
                >
                  <Send size={12} /> Enviar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic text-xs">
            Selecciona un chat activo para iniciar las comunicaciones.
          </div>
        )}
      </div>
    </div>
  );
}
