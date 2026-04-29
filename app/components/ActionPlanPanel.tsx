'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Trash2, Plus, ShieldCheck } from 'lucide-react';

export default function ActionPlanPanel({ riskId }: { riskId: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    const res = await fetch(`/api/action-plans?riskId=${riskId}`);
    const data = await res.json();
    setPlans(data);
  };

  useEffect(() => { fetchPlans(); }, [riskId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask || !newResponsible) return;
    
    setLoading(true);
    await fetch('/api/action-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ riskId, task: newTask, responsible: newResponsible })
    });
    setNewTask('');
    setNewResponsible('');
    fetchPlans();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Erradicar esta tarea de mitigación?")) return;
    await fetch(`/api/action-plans/${id}`, { method: 'DELETE' });
    fetchPlans();
  };

  const toggleStatus = async (plan: any) => {
    // Si estaba pendiente, se completa. Si estaba completado, vuelve a pendiente.
    const newStatus = plan.status === 'Completado' ? 'Pendiente' : 'Completado';
    const newProgress = newStatus === 'Completado' ? 100 : 0;
    
    await fetch(`/api/action-plans/${plan.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, progress: newProgress })
    });
    fetchPlans();
  };

  return (
    <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-black text-indigo-950 mb-4 flex items-center gap-2">
        <ShieldCheck className="text-indigo-600" size={22} /> 
        Planes de Acción y Mitigación
      </h3>

      {/* Formulario Táctico de Tareas */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input 
          required value={newTask} onChange={e => setNewTask(e.target.value)} 
          placeholder="Describa la tarea a ejecutar..." 
          className="flex-1 border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
        />
        <input 
          required value={newResponsible} onChange={e => setNewResponsible(e.target.value)} 
          placeholder="Responsable" 
          className="w-full sm:w-1/3 border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
        />
        <button disabled={loading} type="submit" className="bg-indigo-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-800 transition disabled:opacity-50 flex items-center justify-center">
          <Plus size={20} />
        </button>
      </form>

      {/* Lista de Tareas en Vivo */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {plans.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">No hay planes de mitigación asignados a este riesgo. El flanco está expuesto.</p>}
        
        {plans.map(plan => (
          <div key={plan.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${plan.status === 'Completado' ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-gray-200 shadow-sm hover:border-indigo-300'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleStatus(plan)} 
                className={`${plan.status === 'Completado' ? 'text-emerald-500' : 'text-gray-300 hover:text-indigo-500'} transition-transform transform hover:scale-110`}
                title="Marcar como Completado"
              >
                <CheckCircle size={26} />
              </button>
              <div>
                <p className={`font-bold text-sm ${plan.status === 'Completado' ? 'text-emerald-800 line-through opacity-70' : 'text-gray-800'}`}>
                  {plan.task}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Responsable: <span className="text-indigo-700">{plan.responsible}</span></p>
              </div>
            </div>
            <button onClick={() => handleDelete(plan.id)} className="text-red-400 hover:text-red-600 p-2 transition">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}