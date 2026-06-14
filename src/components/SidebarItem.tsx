import React from 'react';

interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

export default function SidebarItem({ icon: Icon, label, active, onClick, badge }: SidebarItemProps) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl mb-1 transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-semibold' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3 text-sm">
        <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          active ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/50'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
