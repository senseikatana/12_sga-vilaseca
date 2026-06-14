import { useState, useMemo } from 'react';
import { Mic, Play, CheckSquare, Square, RadioReceiver } from 'lucide-react';

interface VoicePickingViewProps {
  pickingTasks: any[];
  products: any[];
}

export default function VoicePickingView({ pickingTasks }: VoicePickingViewProps) {
  const [activeTask, setActiveTask] = useState<any>(null);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [pickedItemsLocal, setPickedItemsLocal] = useState<any[]>([]);

  // Sample items for the active picking task
  const activeTaskItems = useMemo(() => {
    if (!activeTask) return [];
    return [
      { id: 1, sku: 'SKU-001', name: 'Palet Europeo 120x80', location: 'A-01-01', quantity: 2, picked: pickedItemsLocal.includes(1) },
      { id: 2, sku: 'SKU-002', name: 'Caja Cartón 60x40x40', location: 'A-02-03', quantity: 10, picked: pickedItemsLocal.includes(2) },
      { id: 3, sku: 'SKU-003', name: 'Film Estirable 500mm', location: 'B-05-02', quantity: 1, picked: pickedItemsLocal.includes(3) }
    ];
  }, [activeTask, pickedItemsLocal]);

  // Voice confirmation simulation
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartPicking = (task: any) => {
    setActiveTask(task);
    setPickedItemsLocal([]);
    setCommandLog([]);
    speakText(`Iniciando picking tarea ${task.taskNumber}. Dirígete al pasillo A muelle 1 para recoger el primer artículo.`);
    setCommandLog(prev => [...prev, 'Sistema: Dirígete al pasillo A-01-01 para recoger Palet Europeo 120x80.']);
  };

  const simulateSpeechCommand = (command: string) => {
    setCommandLog(prev => [...prev, `Operario: "${command}"`]);
    
    if (command === 'confirmar' || command === 'picked') {
      const nextToPick = activeTaskItems.find(item => !item.picked);
      if (nextToPick) {
        setPickedItemsLocal(prev => [...prev, nextToPick.id]);
        const updatedItems = activeTaskItems.map(item => item.id === nextToPick.id ? { ...item, picked: true } : item);
        const allDone = updatedItems.every(i => i.picked);
        
        if (allDone) {
          speakText("Tarea completada. Entrega los productos en el muelle de despacho.");
          setCommandLog(prev => [...prev, 'Sistema: Tarea de picking completada con éxito.']);
        } else {
          const nextItem = updatedItems.find(item => !item.picked);
          if (nextItem) {
            speakText(`Confirmado. Siguiente artículo: ${nextItem.name} en ubicación ${nextItem.location}.`);
            setCommandLog(prev => [...prev, `Sistema: Dirígete a ${nextItem.location} para recoger ${nextItem.name}.`]);
          }
        }
      }
    }
  };

  return (
    <div className="bg-[#050811] border border-slate-800 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Mic className="text-indigo-400" /> Picking Guiado por Voz (IA)
          </h2>
          <p className="text-xs text-slate-400">Instrucciones por altavoz y comandos por voz manos libres</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Altavoz Listo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tareas Disponibles</h3>
          {pickingTasks.map((task: any) => (
            <div key={task.id} className="p-4 bg-[#0b0f19] border border-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-slate-200">{task.taskNumber}</p>
                <p className="text-xs text-slate-400">Orden: {task.orderNumber}</p>
                <p className="text-[10px] text-slate-500 mt-1">Método: Zone picking ({task.zone})</p>
              </div>
              <button 
                onClick={() => handleStartPicking(task)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                type="button"
              >
                <Play size={12} /> Iniciar
              </button>
            </div>
          ))}
        </div>

        {/* Picking Execution Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeTask ? (
            <div className="bg-[#0b0f19] border border-slate-800 p-5 rounded-2xl">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Ejecutando {activeTask.taskNumber}</h4>
                  <p className="text-xs text-indigo-400">Operario: Carlos Ruiz</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/40 text-amber-400 border border-amber-800/40">En Proceso</span>
              </div>

              {/* Items List */}
              <div className="space-y-3.5 mb-6">
                {activeTaskItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3.5 rounded-xl border flex justify-between items-center ${
                      item.picked 
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400' 
                        : 'bg-[#050811] border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.picked ? <CheckSquare className="text-emerald-500" size={18} /> : <Square size={18} />}
                      <div>
                        <p className={`font-bold text-xs ${item.picked ? 'line-through' : ''}`}>{item.name}</p>
                        <p className="text-[10px] text-slate-500">Ubicación: <span className="text-indigo-400 font-bold">{item.location}</span></p>
                      </div>
                    </div>
                    <span className="font-bold text-xs bg-[#0b0f19] px-2.5 py-1 rounded border border-slate-800">Cant: {item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Simulated Speech Interface */}
              <div className="bg-[#050811] border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-400 flex items-center gap-1.5">
                    <RadioReceiver size={14} className="text-indigo-400" /> Micrófono / Reconocimiento de Voz
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">Decir "Confirmar" al recoger</span>
                </div>

                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => simulateSpeechCommand('confirmar')}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition"
                  >
                    Simular "Confirmar" (Confirm picked)
                  </button>
                  <button 
                    type="button"
                    onClick={() => speakText("Repitiendo ubicación del artículo actual. Pasillo A-02 rack 3.")}
                    className="px-4 bg-[#0b0f19] border border-slate-800 rounded-xl text-slate-350 text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    Repetir Audio
                  </button>
                </div>

                <div className="mt-4 border-t border-slate-800/80 pt-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Historial de Comandos</p>
                  <div className="max-h-24 overflow-y-auto space-y-1.5 text-[11px] font-semibold pr-2">
                    {commandLog.map((log, idx) => (
                      <p key={idx} className={log.startsWith('Sistema') ? 'text-indigo-400' : 'text-emerald-400'}>
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0b0f19]/30 border border-dashed border-slate-800 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
              <Mic size={32} className="text-slate-650 mb-2" />
              <p className="text-xs text-slate-500 font-semibold">Selecciona una tarea de picking y haz clic en "Iniciar" para comenzar la guía por voz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
