import React, { useState } from 'react';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

interface CrudViewProps {
  entityKey: string;
  title: string;
  data: any[];
  fields: Field[];
  onSave: (data: any, id: number | null) => void;
  onDelete: (id: number) => void;
  onInject: () => void;
  t: any;
}

const getStatusColor = (status: string) => {
  const greenStatuses = ['OK', 'Activo', 'Completado', 'Disponible', 'Activa', 'Completada', 'Recibido', 'Despachado'];
  const orangeStatuses = ['Bajo', 'Pendiente', 'En Proceso', 'En Ruta', 'Empacando', 'Picking', 'Packing', 'Control de Calidad'];
  const redStatuses = ['Crítico', 'Inactivo', 'Mantenimiento', 'Cancelado', 'Pausada', 'warning'];

  if (greenStatuses.includes(status)) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-550/30';
  if (orangeStatuses.includes(status)) return 'bg-amber-500/20 text-amber-400 border border-amber-550/30';
  if (redStatuses.includes(status)) return 'bg-rose-500/20 text-rose-400 border border-rose-550/30';
  return 'bg-slate-800 text-slate-400 border border-slate-700/50';
};

export default function CrudView({ title, data, fields, onSave, onDelete, onInject, t }: CrudViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const openForm = (item: any = null) => {
    setEditingId(item ? item.id : null);
    setFormData(item || fields.reduce((acc: any, f: any) => ({ ...acc, [f.key]: f.type === 'number' ? 0 : '' }), {}));
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, editingId);
    setIsOpen(false);
  };

  return (
    <div className="bg-[#050811] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-800 bg-[#050811]/80 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-white">{title}</h2>
          <p className="text-xs text-slate-400 font-semibold">{data.length} registros totales</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onInject}
            className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            type="button"
          >
            <Sparkles size={14} className="text-indigo-400 animate-pulse" /> Generar Lote Mock
          </button>
          <button 
            onClick={() => openForm()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            type="button"
          >
            <Plus size={14} /> {t.add}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0b0f19]/50">
              {fields.map((f: any) => (
                <th key={f.key} className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">{f.label}</th>
              ))}
              <th className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 1} className="py-12 text-center text-slate-500 text-xs font-semibold">
                  No hay registros disponibles. Prueba a generar un lote mock.
                </td>
              </tr>
            ) : (
              data.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-900 hover:bg-[#0b0f19]/25 transition duration-150">
                  {fields.map((f: any) => (
                    <td key={f.key} className="py-3.5 px-5 text-xs font-semibold text-slate-300">
                      {f.key === 'status' || f.key === 'type' ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(item[f.key])}`}>
                          {item[f.key]}
                        </span>
                      ) : f.key === 'price' || f.key === 'totalValue' ? (
                        `€${(parseFloat(item[f.key]) || 0).toLocaleString()}`
                      ) : item[f.key]}
                    </td>
                  ))}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button onClick={() => openForm(item)} className="p-1.5 text-slate-400 hover:text-indigo-400 rounded transition mr-1.5" title={t.edit}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => { if(confirm('¿Eliminar este registro?')) onDelete(item.id); }} className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition" title={t.delete}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#050811]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">{editingId ? t.edit : t.add} Registro</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {fields.map((f: any) => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full bg-[#050811] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                      required
                    >
                      <option value="">Selecciona...</option>
                      {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      step={f.key === 'price' || f.key === 'totalValue' ? '0.01' : '1'}
                      value={formData[f.key] !== undefined ? formData[f.key] : ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                      className="w-full bg-[#050811] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                      required
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6 text-xs font-bold">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400">
                {t.cancel}
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
