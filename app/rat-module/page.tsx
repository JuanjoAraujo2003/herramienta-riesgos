'use client';

import { useEffect, useState } from 'react';
import RatForm from '../components/RatForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FolderOpen, Scale, FileText } from 'lucide-react';

export default function RatModule() {
  const [rats, setRats] = useState<any[]>([]);
  const [editingRat, setEditingRat] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRats = async () => {
    const res = await fetch('/api/rat');
    const data = await res.json();
    setRats(data);
  };

  useEffect(() => { fetchRats(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este registro del RAT?")) return;
    await fetch(`/api/rat/${id}`, { method: 'DELETE' });
    fetchRats();
  };

  const openNewRat = () => {
    setEditingRat(null);
    setIsModalOpen(true);
  };

  const openEditRat = (rat: any) => {
    setEditingRat(rat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingRat(null), 300);
  };

  const granEscalaCount = rats.filter(r => r.isGranEscala).length;
  const normalCount = rats.length - granEscalaCount;

  return (
    <main className="min-h-screen p-8 lg:p-12 bg-gray-50/50 text-gray-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Registro RAT</h1>
            <p className="mt-1 text-gray-500 font-medium">Inventario de Actividades de Tratamiento de Datos Personales.</p>
          </div>
          <button onClick={openNewRat} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
            <Plus size={20} /> Registrar Actividad
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-lg"><FolderOpen size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total de Procesos</p>
              <p className="text-3xl font-black text-gray-800">{rats.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-red-50 text-red-600 rounded-lg"><Scale size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">A Gran Escala</p>
              <p className="text-3xl font-black text-gray-800">{granEscalaCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-lg"><FileText size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tratamiento Estándar</p>
              <p className="text-3xl font-black text-gray-800">{normalCount}</p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider font-bold">
                  <th className="p-5">Proyecto / Proceso</th>
                  <th className="p-5">Departamento</th>
                  <th className="p-5">Base Legal</th>
                  <th className="p-5 text-center">Tipo de Operación</th>
                  <th className="p-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rats.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No hay actividades de tratamiento registradas.</td></tr>
                )}
                {rats.map((rat) => (
                  <tr key={rat.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-gray-900 truncate max-w-[250px]" title={rat.projectName}>{rat.projectName}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-[250px]" title={rat.finality}>{rat.finality}</div>
                    </td>
                    <td className="p-5 font-medium text-gray-700">{rat.department}</td>
                    <td className="p-5 text-sm text-gray-500"><span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded">{rat.legalBase}</span></td>
                    <td className="p-5 text-center">
                      {rat.isGranEscala ? (
                        <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">Gran Escala</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">Estándar</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditRat(rat)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(rat.id)} className="p-2 text-red-600 hover:bg-red-100 rounded transition" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <RatForm key={editingRat ? editingRat.id : 'nuevo'} onRatAdded={fetchRats} ratToEdit={editingRat} onClose={closeModal} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}