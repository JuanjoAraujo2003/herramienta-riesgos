'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function DataFlowForm({ onFlowAdded, flowToEdit, onClose }: { onFlowAdded: () => void, flowToEdit?: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!flowToEdit;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      phase: formData.get('phase'),
      description: formData.get('description'),
      technologies: formData.get('technologies'),
      personalData: formData.get('personalData'),
      involvedParties: formData.get('involvedParties'),
      legalBase: formData.get('legalBase'),
    };

    const endpoint = isEditing ? `/api/data-flow/${flowToEdit.id}` : '/api/data-flow';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });

    if (response.ok) {
      onFlowAdded();
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className={`text-2xl font-black ${isEditing ? 'text-amber-600' : 'text-indigo-900'}`}>
          {isEditing ? 'Modificar Flujo' : 'Nuevo Registro de Flujo'}
        </h2>
        <button type="button" onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fase del Ciclo</label>
          <select required defaultValue={flowToEdit?.phase} name="phase" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white transition text-gray-900">
            <option value="">Selecciona la fase...</option>
            <option value="Obtención / Captura">Obtención / Captura</option>
            <option value="Registro">Registro</option>
            <option value="Almacenamiento">Almacenamiento</option>
            <option value="Uso">Uso</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Eliminación / Supresión">Eliminación / Supresión</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tecnologías / Herramientas</label>
          <input required defaultValue={flowToEdit?.technologies} name="technologies" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white transition text-gray-900" />
        </div>
        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción del Tratamiento</label>
          <textarea required defaultValue={flowToEdit?.description} name="description" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white transition min-h-[80px] text-gray-900" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Datos Personales Involucrados</label>
          <textarea required defaultValue={flowToEdit?.personalData} name="personalData" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white transition min-h-[80px] text-gray-900" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actores Involucrados</label>
          <textarea required defaultValue={flowToEdit?.involvedParties} name="involvedParties" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white transition min-h-[80px] text-gray-900" />
        </div>
        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base Legal por Fase</label>
          <input required defaultValue={flowToEdit?.legalBase} name="legalBase" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white transition text-gray-900" />
        </div>
        <button disabled={loading} type="submit" className={`col-span-full text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all mt-4 ${isEditing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-900 hover:bg-indigo-800'}`}>
          {loading ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Agregar al Ciclo')}
        </button>
      </form>
    </div>
  );
}