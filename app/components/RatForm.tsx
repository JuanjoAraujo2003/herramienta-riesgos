'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function RatForm({ 
  onRatAdded, 
  ratToEdit, 
  onClose 
}: { 
  onRatAdded: () => void, 
  ratToEdit?: any, 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!ratToEdit;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      projectName: formData.get('projectName'),
      department: formData.get('department'),
      finality: formData.get('finality'),
      legalBase: formData.get('legalBase'),
      titularCategories: formData.get('titularCategories'),
      dataCategories: formData.get('dataCategories'),
      conservationPeriod: formData.get('conservationPeriod'),
      isGranEscala: formData.get('isGranEscala') === 'true',
    };

    const endpoint = isEditing ? `/api/rat/${ratToEdit.id}` : '/api/rat';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onRatAdded();
        onClose();
      } else {
        alert('El sistema ha rechazado el registro en el RAT.');
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
          {isEditing ? 'Modificar Registro RAT' : 'Nueva Actividad de Tratamiento'}
        </h2>
        <button type="button" onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Proyecto / Proceso</label>
          <input required defaultValue={ratToEdit?.projectName} name="projectName" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Departamento</label>
          <input required defaultValue={ratToEdit?.department} name="department" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base Legal</label>
          <input required defaultValue={ratToEdit?.legalBase} name="legalBase" placeholder="Ej. Consentimiento, Contrato..." className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>

        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Finalidad del Tratamiento</label>
          <textarea required defaultValue={ratToEdit?.finality} name="finality" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition min-h-[80px]" />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categorías de Titulares</label>
          <textarea required defaultValue={ratToEdit?.titularCategories} name="titularCategories" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition min-h-[80px]" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categorías de Datos</label>
          <textarea required defaultValue={ratToEdit?.dataCategories} name="dataCategories" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition min-h-[80px]" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tiempo de Conservación</label>
          <input required defaultValue={ratToEdit?.conservationPeriod} name="conservationPeriod" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-gray-50 hover:bg-white transition" />
        </div>
        
        <div className="space-y-1 bg-red-50 p-3 rounded border border-red-100">
          <label className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-2">¿Es a Gran Escala?</label>
          <select name="isGranEscala" defaultValue={ratToEdit ? (ratToEdit.isGranEscala ? 'true' : 'false') : 'false'} className="w-full border border-red-200 p-2.5 rounded outline-none text-gray-900 bg-white">
            <option value="false">NO - Operación Estándar</option>
            <option value="true">SÍ - Tratamiento Masivo / Gran Escala</option>
          </select>
        </div>

        <button disabled={loading} type="submit" className={`col-span-full text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all transform active:scale-95 mt-4 ${isEditing ? 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg' : 'bg-indigo-900 hover:bg-indigo-800 hover:shadow-lg'}`}>
          {loading ? 'Procesando orden...' : (isEditing ? 'Guardar Modificación' : 'Agregar al RAT')}
        </button>
      </form>
    </div>
  );
}