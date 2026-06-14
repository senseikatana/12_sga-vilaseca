import { useMemo } from 'react';
import { CheckCircle2, ArrowDownToLine, Send, AlertTriangle } from 'lucide-react';
import KpiCard from './KpiCard';

interface DesktopDashboardViewProps {
  dbState: any;
  filteredIn: any[];
  filteredOut: any[];
  t: any;
}

export default function DesktopDashboardView({ dbState, filteredIn, filteredOut, t }: DesktopDashboardViewProps) {
  const criticalStock = useMemo(() => 
    dbState.products.filter((p: any) => p.stock <= p.minStock).length, 
    [dbState.products]
  );
  
  const serviceLevel = "98.4%";
  
  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title={t.compRate} value={serviceLevel} subtitle="vs 96.2% el mes anterior" icon={CheckCircle2} trend="+2.2%" trendUp={true} />
        <KpiCard title={t.inToday} value={filteredIn.length} subtitle="Muelles de descarga activos" icon={ArrowDownToLine} />
        <KpiCard title={t.pendingDisp} value={filteredOut.filter((o: any) => o.status !== 'Completado').length} subtitle="En cola de expedición" icon={Send} />
        <KpiCard title={t.lowStock} value={criticalStock} subtitle="Artículos bajo stock mínimo" icon={AlertTriangle} trend={criticalStock > 0 ? "Crítico" : "Óptimo"} trendUp={criticalStock === 0} />
      </div>

      {/* Visual Charts & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Volume Chart */}
        <div className="bg-[#050811] border border-slate-805 p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Volumen de Movimiento Diario</h3>
              <p className="text-xs text-slate-400">Entradas vs Salidas de palets</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-indigo-950 text-indigo-300 rounded border border-indigo-900">Últimos 7 días</span>
          </div>

          <div className="h-44 flex items-end justify-between px-2 pb-2 border-b border-slate-800">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, idx) => {
              const val1 = [40, 55, 65, 80, 45, 20, 15][idx];
              const val2 = [30, 45, 75, 60, 50, 25, 10][idx];
              return (
                <div key={idx} className="flex flex-col items-center flex-1 space-y-2">
                  <div className="w-full flex justify-center space-x-1.5 items-end h-36">
                    <div style={{ height: `${val1}%` }} className="w-2.5 bg-indigo-500 rounded-t-xs" title={`Entradas: ${val1}`} />
                    <div style={{ height: `${val2}%` }} className="w-2.5 bg-indigo-300/40 rounded-t-xs" title={`Salidas: ${val2}`} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex space-x-4 mt-3 text-xs justify-center font-medium">
            <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-500" />Entradas</span>
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-indigo-350" />Salidas</span>
          </div>
        </div>

        {/* Live Feed Logs */}
        <div className="bg-[#050811] border border-slate-800 p-5 rounded-2xl flex flex-col">
          <h3 className="font-bold text-sm text-white mb-4">Registro Operativo de Almacén</h3>
          <div className="flex-1 overflow-y-auto space-y-3.5 max-h-56 pr-2">
            {[
              { time: '16:25', task: 'Luis confirmó picking SKU-002', zone: 'Zona A' },
              { time: '16:18', task: 'Recepción muelle B completada', zone: 'Muelle B' },
              { time: '16:04', task: 'Ubicado palet SKU-006 en estante C-01', zone: 'Zona C' },
              { time: '15:52', task: 'Ajuste manual stock SKU-005 - rotura', zone: 'Zona A' }
            ].map((log, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs border-b border-slate-900 pb-2">
                <div>
                  <p className="font-semibold text-slate-200">{log.task}</p>
                  <p className="text-[10px] text-indigo-400 font-medium">{log.zone}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
