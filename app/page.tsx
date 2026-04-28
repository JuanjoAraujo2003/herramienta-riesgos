'use client';

import { useEffect, useState } from 'react';
import RiskForm from './components/RiskForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ShieldAlert, TrendingUp, Activity } from 'lucide-react';

export default function Home() {
  const [risks, setRisks] = useState<any[]>([]);
  const [editingRisk, setEditingRisk] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRisks = async () => {
    const res = await fetch('/api/risks');
    const data = await res.json();
    setRisks(data);
  };

  useEffect(() => { fetchRisks(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Ordenas erradicar este riesgo de forma permanente?")) return;
    await fetch(`/api/risks/${id}`, { method: 'DELETE' });
    fetchRisks();
  };

  const openNewRisk = () => {
    setEditingRisk(null);
    setIsModalOpen(true);
  };

  const openEditRisk = (risk: any) => {
    setEditingRisk(risk);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingRisk(null), 300); // Limpiamos después de la animación
  };

  // Cálculos rápidos para el tablero superior
  const highRisks = risks.filter(r => r.inherentRiskLevel === 'Alto').length;
  const mediumRisks = risks.filter(r => r.inherentRiskLevel === 'Medio').length;

  return (
    <main className="min-h-screen p-8 lg:p-12 bg-gray-50/50 text-gray-900">
      
      {/* Animación de entrada de la página principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-7xl mx-auto space-y-8"
      >
        
        {/* Cabecera y Botón de Acción Principal */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Matriz de Riesgos</h1>
            <p className="mt-1 text-gray-500 font-medium">Gestión y control de amenazas tecnológicas y no tecnológicas.</p>
          </div>
          <button 
            onClick={openNewRisk}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Plus size={20} /> Nuevo Riesgo
          </button>
        </header>

        {/* Tarjetas de Resumen Rápido (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-lg"><Activity size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Registros</p>
              <p className="text-3xl font-black text-gray-800">{risks.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-red-50 text-red-600 rounded-lg"><ShieldAlert size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nivel Crítico</p>
              <p className="text-3xl font-black text-gray-800">{highRisks}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp size={28} /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">En Observación</p>
              <p className="text-3xl font-black text-gray-800">{mediumRisks}</p>
            </div>
          </div>
        </div>

        {/* Tabla de Datos Limpia */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider font-bold">
                  <th className="p-5">Área / Proceso</th>
                  <th className="p-5">Evento de Riesgo</th>
                  <th className="p-5">Control</th>
                  <th className="p-5 text-center">Nivel Inherente</th>
                  <th className="p-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {risks.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">El tablero está vacío. Registra tu primera amenaza.</td></tr>
                )}
                {risks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-gray-900">{risk.area}</div>
                      <div className="text-xs text-gray-500 mt-1">{risk.process}</div>
                    </td>
                    <td className="p-5 font-medium text-gray-700 max-w-xs truncate" title={risk.riskEvent}>{risk.riskEvent}</td>
                    <td className="p-5 text-sm text-gray-500 font-medium bg-gray-50 rounded-md my-2 inline-block px-3 py-1 ml-5 border border-gray-100">{risk.controlType}</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                        risk.inherentRiskLevel === 'Alto' ? 'bg-red-50 text-red-700 border-red-200' : 
                        risk.inherentRiskLevel === 'Medio' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {risk.inherentRiskLevel} ({risk.inherentRiskScore})
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditRisk(risk)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(risk.id)} className="p-2 text-red-600 hover:bg-red-100 rounded transition" title="Eliminar">
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

      {/* Modal / Ventana Emergente con Animación (Framer Motion) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Fondo Oscuro Desenfocado */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            {/* Contenedor del Formulario */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <RiskForm 
                  key={editingRisk ? editingRisk.id : 'nuevo'} 
                  onRiskAdded={fetchRisks} 
                  riskToEdit={editingRisk}
                  onClose={closeModal}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}