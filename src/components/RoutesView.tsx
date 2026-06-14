import { useState } from 'react';
import { Route as RouteIcon, Bot, Sparkles, Loader2 } from 'lucide-react';
import { callAI } from '../lib/openrouter';

export default function RoutesView() {
  const [optimizedText, setOptimizedText] = useState<string>('');
  const [loadingRoute, setLoadingRoute] = useState(false);

  const handleOptimizeRoute = async () => {
    setLoadingRoute(true);
    try {
      const text = await callAI('optimize_route');
      setOptimizedText(text);
    } catch {
      setOptimizedText('Sin conexión con el backend. Asegúrate de que el servidor está activo.');
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <div className="bg-[#050811] border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <RouteIcon className="text-indigo-400" /> Planificador de Rutas de Almacén
          </h2>
          <p className="text-xs text-slate-400">Cálculo inteligente de rutas internas para minimizar distancias de picking</p>
        </div>
        <button
          onClick={handleOptimizeRoute}
          disabled={loadingRoute}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
          type="button"
        >
          {loadingRoute ? <Loader2 className="animate-spin" size={14} /> : <Bot size={14} />} Optimizar con IA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map */}
        <div className="lg:col-span-2 bg-[#0b0f19] border border-slate-800 p-6 rounded-xl relative">
          <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Mapa del Almacén</p>
          <div className="grid grid-cols-4 gap-4 h-64 border border-slate-800/80 rounded-xl p-4 bg-slate-950/40 relative">
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-900 text-indigo-300 border border-indigo-700 rounded text-[9px] font-bold">Muelles A, B, C</div>
            {['Zona Recepción (A)', 'Zona Estanterías (B)', 'Zona Frío (D)', 'Zona Despacho (C)'].map((zone, idx) => (
              <div key={idx} className="border border-slate-800 bg-[#0b0f19]/60 rounded-xl p-3 flex flex-col justify-between items-center text-center">
                <span className="text-[10px] font-bold text-slate-400">{zone}</span>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400 border border-slate-700">
                  {['A', 'B', 'D', 'C'][idx]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization results */}
        <div className="bg-[#0b0f19] border border-slate-800 p-5 rounded-xl flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1">
            <Sparkles size={14} className="text-indigo-400" /> Ruta Recomendada
          </h3>
          <div className="flex-1 overflow-y-auto max-h-56 pr-1 text-xs text-slate-300 font-semibold space-y-3">
            {optimizedText ? (
              <p className="leading-relaxed bg-[#050811] p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">{optimizedText}</p>
            ) : (
              <p className="text-slate-500 italic">Haz clic en "Optimizar con IA" para recibir instrucciones optimizadas basadas en la carga de trabajo actual.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
