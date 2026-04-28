'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function DpiaForm({ onDpiaAdded, dpiaToEdit, onClose }: { onDpiaAdded: () => void, dpiaToEdit?: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!dpiaToEdit;

  // Estados locales para el cálculo en vivo
  const [ctScore, setCtScore] = useState(dpiaToEdit?.ctScore || 0);
  const [ciScore, setCiScore] = useState(dpiaToEdit?.ciScore || 0);

  const gravityScore = ctScore + ciScore;
  let gravityLevel = 'BAJO';
  let levelColor = 'bg-green-100 text-green-800';
  if (gravityScore >= 4) { gravityLevel = 'MUY ALTO'; levelColor = 'bg-red-600 text-white'; }
  else if (gravityScore >= 3) { gravityLevel = 'ALTO'; levelColor = 'bg-orange-500 text-white'; }
  else if (gravityScore >= 2) { gravityLevel = 'MEDIO'; levelColor = 'bg-yellow-300 text-yellow-900'; }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      finality: formData.get('finality'),
      legalBase: formData.get('legalBase'),
      titularCategories: formData.get('titularCategories'),
      dataCategories: formData.get('dataCategories'),
      ctScore: ctScore,
      ciScore: ciScore,
      gravityScore: gravityScore,
      gravityLevel: gravityLevel,
    };

    const endpoint = isEditing ? `/api/dpia/${dpiaToEdit.id}` : '/api/dpia';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });

    if (response.ok) {
      onDpiaAdded();
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className={`text-2xl font-black ${isEditing ? 'text-amber-600' : 'text-indigo-900'}`}>
          {isEditing ? 'Modificar Evaluación DPIA' : 'Nueva Evaluación de Impacto'}
        </h2>
        <button type="button" onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Finalidad del Tratamiento</label>
          <textarea required defaultValue={dpiaToEdit?.finality} name="finality" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white text-gray-900 min-h-[60px]" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base Legal</label>
          <input required defaultValue={dpiaToEdit?.legalBase} name="legalBase" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white text-gray-900" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categorías de Titulares</label>
          <input required defaultValue={dpiaToEdit?.titularCategories} name="titularCategories" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white text-gray-900" />
        </div>
        <div className="space-y-1 col-span-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categorías de Datos Personales</label>
          <input required defaultValue={dpiaToEdit?.dataCategories} name="dataCategories" className="w-full border p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white text-gray-900" />
        </div>

        <div className="col-span-full bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 flex flex-col md:flex-row gap-6 items-center mt-2">
          <div className="flex flex-col w-full space-y-1">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Score Análisis CT (Contexto)</label>
            <input type="number" step="0.1" min="0" value={ctScore} onChange={(e) => setCtScore(Number(e.target.value))} required className="w-full border border-indigo-200 p-2.5 rounded text-gray-900" />
          </div>
          <div className="flex flex-col w-full space-y-1">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Score Análisis CI (Impacto)</label>
            <input type="number" step="0.1" min="0" value={ciScore} onChange={(e) => setCiScore(Number(e.target.value))} required className="w-full border border-indigo-200 p-2.5 rounded text-gray-900" />
          </div>
          <div className="w-full flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gravedad (G)</span>
            <span className="text-4xl font-black text-indigo-950 mb-2">{gravityScore.toFixed(2)}</span>
            <span className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-widest uppercase ${levelColor}`}>{gravityLevel}</span>
          </div>
        </div>

        <button disabled={loading} type="submit" className={`col-span-full text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all mt-4 ${isEditing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-900 hover:bg-indigo-800'}`}>
          {loading ? 'Calculando...' : (isEditing ? 'Actualizar Dictamen' : 'Dictaminar Evaluación')}
        </button>
      </form>
    </div>
  );
}