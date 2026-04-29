'use client';

import { useEffect, useState } from 'react';
import DpiaForm from '../components/DpiaForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Gavel, AlertTriangle } from 'lucide-react';
import { getSession } from 'next-auth/react'; // Detección de sesión

export default function DpiaModule() {
  const [dpias, setDpias] = useState<any[]>([]);
  const [editingDpia, setEditingDpia] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ESTADO DE JERARQUÍA
  const [userRole, setUserRole] = useState<string>('ANALYST');

  const fetchDpias = async () => {
    const res = await fetch('/api/dpia');
    const data = await res.json();
    setDpias(data);
  };

  useEffect(() => { 
    fetchDpias(); 
    // Identificación Absoluta
    getSession().then(session => {
      if (session?.user) {
        setUserRole((session.user as any).role || 'ANALYST');
      }
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Erradicar este dictamen?")) return;
    await fetch(`/api/dpia/${id}`, { method: 'DELETE' });
    fetchDpias();
  };

  const openNewDpia = () => { setEditingDpia(null); setIsModalOpen(true); };
  const openEditDpia = (dpia: any) => { setEditingDpia(dpia); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setTimeout(() => setEditingDpia(null), 300); };

  const criticalCount = dpias.filter(d => d.gravityLevel === 'MUY ALTO' || d.gravityLevel === 'ALTO').length;

  return (
    <main className="min-h-screen p-8 lg:p-12 bg-gray-50/50 text-gray-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Evaluación DPIA</h1>
            <p className="mt-1 text-gray-500 font-medium">Cálculo automatizado de Gravedad y Análisis de Impacto.</p>
          </div>
          <button onClick={openNewDpia} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
            <Plus size={20} /> Nuevo Dictamen
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-lg"><Gavel size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Dictámenes Emitidos</p>
              <p className="text-3xl font-black text-gray-800">{dpias.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tratamientos de Riesgo Crítico</p>
              <p className="text-3xl font-black text-gray-800">{criticalCount}</p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider font-bold">
                  <th className="p-5">Finalidad</th>
                  <th className="p-5 text-center">Score CT</th>
                  <th className="p-5 text-center">Score CI</th>
                  <th className="p-5 text-center">Gravedad (G)</th>
                  <th className="p-5 text-center">Nivel</th>
                  <th className="p-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dpias.map((dpia) => (
                  <tr key={dpia.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-5 font-medium text-gray-800 max-w-xs truncate">{dpia.finality}</td>
                    <td className="p-5 text-center font-mono text-gray-500">{dpia.ctScore}</td>
                    <td className="p-5 text-center font-mono text-gray-500">{dpia.ciScore}</td>
                    <td className="p-5 text-center font-black text-lg text-indigo-900">{dpia.gravityScore}</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                        dpia.gravityLevel === 'MUY ALTO' ? 'bg-red-50 text-red-700 border-red-200' : 
                        dpia.gravityLevel === 'ALTO' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                        dpia.gravityLevel === 'MEDIO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {dpia.gravityLevel}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {/* SOLO EL EMPERADOR VE ESTOS BOTONES */}
                      {userRole === 'ADMIN' && (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditDpia(dpia)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(dpia.id)} className="p-2 text-red-600 hover:bg-red-100 rounded transition"><Trash2 size={18} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <DpiaForm key={editingDpia ? editingDpia.id : 'nuevo'} onDpiaAdded={fetchDpias} dpiaToEdit={editingDpia} onClose={closeModal} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}