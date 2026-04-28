'use client';

import { useEffect, useState } from 'react';
import DataFlowForm from '../components/DataFlowForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Database, Network, Server } from 'lucide-react';

export default function DataFlowModule() {
  const [flows, setFlows] = useState<any[]>([]);
  const [editingFlow, setEditingFlow] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFlows = async () => {
    const res = await fetch('/api/data-flow');
    const data = await res.json();
    setFlows(data);
  };

  useEffect(() => { fetchFlows(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Erradicar esta fase del flujo?")) return;
    await fetch(`/api/data-flow/${id}`, { method: 'DELETE' });
    fetchFlows();
  };

  const openNewFlow = () => { setEditingFlow(null); setIsModalOpen(true); };
  const openEditFlow = (flow: any) => { setEditingFlow(flow); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setTimeout(() => setEditingFlow(null), 300); };

  return (
    <main className="min-h-screen p-8 lg:p-12 bg-gray-50/50 text-gray-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Mapa de Flujo de Datos</h1>
            <p className="mt-1 text-gray-500 font-medium">Rastreo del ciclo de vida de la información personal.</p>
          </div>
          <button onClick={openNewFlow} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
            <Plus size={20} /> Registrar Fase
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-lg"><Network size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Fases Registradas</p>
              <p className="text-3xl font-black text-gray-800">{flows.length}</p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider font-bold">
                  <th className="p-5">Fase</th>
                  <th className="p-5">Descripción</th>
                  <th className="p-5">Tecnología</th>
                  <th className="p-5">Base Legal</th>
                  <th className="p-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {flows.map((flow) => (
                  <tr key={flow.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-5 font-black text-indigo-700">{flow.phase}</td>
                    <td className="p-5 text-gray-700 max-w-xs truncate">{flow.description}</td>
                    <td className="p-5"><span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold">{flow.technologies}</span></td>
                    <td className="p-5 text-sm font-medium text-gray-600">{flow.legalBase}</td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditFlow(flow)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(flow.id)} className="p-2 text-red-600 hover:bg-red-100 rounded transition"><Trash2 size={18} /></button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <DataFlowForm key={editingFlow ? editingFlow.id : 'nuevo'} onFlowAdded={fetchFlows} flowToEdit={editingFlow} onClose={closeModal} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}