import React, { useState } from 'react';
import { Cpu, Loader2, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface SapIntegrationViewProps {
  logs: any[];
  setDbState: React.Dispatch<React.SetStateAction<any>>;
}

export default function SapIntegrationView({ logs, setDbState }: SapIntegrationViewProps) {
  const [syncing, setSyncing] = useState(false);

  const handleSyncSap = () => {
    setSyncing(true);
    setTimeout(() => {
      setDbState((prev: any) => ({
        ...prev,
        sapLogs: [
          { id: Math.random(), timestamp: new Date().toLocaleTimeString(), event: 'Sincronización manual completa con SAP ERP', type: 'info' },
          ...prev.sapLogs
        ]
      }));
      setSyncing(false);
    }, 1500);
  };

  return (
    <div className="bg-[#050811] border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Cpu className="text-indigo-400" /> SAP ERP Hub Integration
          </h2>
          <p className="text-xs text-slate-400">Integración de stock en tiempo real y transacciones directas con SAP RFC</p>
        </div>
        <button 
          onClick={handleSyncSap}
          disabled={syncing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
          type="button"
        >
          {syncing ? <Loader2 className="animate-spin" size={14} /> : <ArrowLeftRight size={14} />} Sincronizar Ahora
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status indicator */}
        <div className="bg-[#0b0f19] border border-slate-800 p-5 rounded-xl text-center space-y-3 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950/65 border border-emerald-800 flex items-center justify-center text-emerald-450">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">SAP Endpoint Status</h4>
            <p className="text-xs text-emerald-500 font-bold mt-0.5">Conectado y Listo</p>
          </div>
          <p className="text-[10px] text-slate-400">Último Ping: hace 1 minuto</p>
        </div>

        {/* Sync Logs */}
        <div className="md:col-span-2 bg-[#0b0f19] border border-slate-800 p-5 rounded-xl flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Eventos de Integración Recientes</h3>
          <div className="space-y-3 overflow-y-auto max-h-56 pr-1 font-semibold text-xs">
            {logs.map((log: any) => (
              <div key={log.id} className="flex justify-between items-start border-b border-slate-800/80 pb-2">
                <div className="space-y-0.5">
                  <p className="text-slate-200">{log.event}</p>
                  <span className={`text-[9px] uppercase font-bold ${log.type === 'warning' ? 'text-amber-500' : 'text-indigo-400'}`}>
                    {log.type}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
