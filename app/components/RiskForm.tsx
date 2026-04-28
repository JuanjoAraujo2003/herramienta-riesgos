'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function RiskForm({ 
  onRiskAdded, 
  riskToEdit, 
  onClose 
}: { 
  onRiskAdded: () => void, 
  riskToEdit?: any, 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!riskToEdit;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      area: formData.get('area'),
      process: formData.get('process'),
      finality: formData.get('finality'),
      riskEvent: formData.get('riskEvent'),
      assetType: formData.get('assetType'),
      threat: formData.get('threat'),
      vulnerability: formData.get('vulnerability'),
      impactValue: Number(formData.get('impactValue')),
      probabilityValue: Number(formData.get('probabilityValue')),
      controlType: formData.get('controlType'),
      automationLevel: formData.get('automationLevel'),
    };

    const endpoint = isEditing ? `/api/risks/${riskToEdit.id}` : '/api/risks';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onRiskAdded();
        onClose(); // Ordenamos cerrar el modal tras la victoria
      } else {
        alert('El sistema ha rechazado la orden.');
      }
    } catch (error) {
      console.error('Error táctico:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className={`text-2xl font-black ${isEditing ? 'text-amber-600' : 'text-indigo-900'}`}>
          {isEditing ? 'Modificar Riesgo' : 'Nuevo Registro de Riesgo'}
        </h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Área</label>
          <input required defaultValue={riskToEdit?.area} name="area" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Proceso</label>
          <input required defaultValue={riskToEdit?.process} name="process" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Finalidad</label>
          <input required defaultValue={riskToEdit?.finality} name="finality" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evento de Riesgo</label>
          <input required defaultValue={riskToEdit?.riskEvent} name="riskEvent" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amenaza</label>
          <input required defaultValue={riskToEdit?.threat} name="threat" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vulnerabilidad</label>
          <input required defaultValue={riskToEdit?.vulnerability} name="vulnerability" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Activo</label>
          <input defaultValue={riskToEdit?.assetType} name="assetType" placeholder="Opcional" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Control</label>
          <select required defaultValue={riskToEdit?.controlType} name="controlType" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition">
            <option value="">Seleccionar...</option>
            <option value="Preventivo">Preventivo</option>
            <option value="Detectivo">Detectivo</option>
            <option value="Correctivo">Correctivo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 col-span-full bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Impacto (1-5)</label>
            <input required defaultValue={riskToEdit?.impactValue} type="number" min="1" max="5" name="impactValue" className="w-full border border-indigo-200 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Probabilidad (1-5)</label>
            <input required defaultValue={riskToEdit?.probabilityValue} type="number" min="1" max="5" name="probabilityValue" className="w-full border border-indigo-200 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-white" />
          </div>
        </div>

        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nivel de Automatización</label>
          <select required defaultValue={riskToEdit?.automationLevel} name="automationLevel" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition">
            <option value="">Seleccionar...</option>
            <option value="Automático">Automático</option>
            <option value="Semi Automático">Semi Automático</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <button disabled={loading} type="submit" className={`col-span-full text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all transform active:scale-95 mt-4 ${isEditing ? 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg' : 'bg-indigo-900 hover:bg-indigo-800 hover:shadow-lg'}`}>
          {loading ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Registrar en la Matriz')}
        </button>
      </form>
    </div>
  );
}