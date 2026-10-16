import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Culto } from '../types';

interface CultoFormModalProps {
  onClose: () => void;
  onSave: (nome: string, data: string, tipo: Culto['tipo']) => void;
}

export default function CultoFormModal({ onClose, onSave }: CultoFormModalProps) {
  const [nome, setNome] = useState('');
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tipo, setTipo] = useState<Culto['tipo']>('Culto');

  const handleSave = () => {
    if (!nome.trim()) {
      alert('Nome do culto é obrigatório');
      return;
    }
    onSave(nome, data, tipo);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Novo Culto</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Nome do Culto *</label>
            <input 
              type="text" 
              value={nome} 
              onChange={e => setNome(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" 
              placeholder="Ex: Culto de Domingo Manhã"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Data *</label>
            <input 
              type="date" 
              value={data} 
              onChange={e => setData(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Tipo</label>
            <select 
              value={tipo} 
              onChange={e => setTipo(e.target.value as Culto['tipo'])}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
              <option value="Culto">Culto</option>
              <option value="EBD">EBD</option>
              <option value="Reunião">Reunião</option>
              <option value="Evento">Evento</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
            Criar Culto
          </button>
        </div>
      </div>
    </div>
  );
}
