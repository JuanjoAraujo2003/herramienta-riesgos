'use client';

import { useEffect, useState } from 'react';
import RiskForm from './components/RiskForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ShieldAlert, TrendingUp, Activity, Search, Filter, Download } from 'lucide-react';
import ActionPlanPanel from './components/ActionPlanPanel';

export default function Home() {
  const [risks, setRisks] = useState<any[]>([]);
  const [editingRisk, setEditingRisk] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Nuevas armas: Estados para Búsqueda y Filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('Todos');

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

  const openNewRisk = () => { setEditingRisk(null); setIsModalOpen(true); };
  const openEditRisk = (risk: any) => { setEditingRisk(risk); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setTimeout(() => setEditingRisk(null), 300); };

  // 1. MOTOR DE BÚSQUEDA Y FILTRADO (Inteligencia Táctica)
  const filteredRisks = risks.filter((risk) => {
    const matchesSearch = 
      risk.area.toLowerCase().includes(searchTerm.toLowerCase()) || 
      risk.riskEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.process.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterLevel === 'Todos' || risk.inherentRiskLevel === filterLevel;
    
    return matchesSearch && matchesFilter;
  });

  // 2. MOTOR DE EXPORTACIÓN (Diplomacia Burocrática)
  const exportToCSV = () => {
    // Definimos las columnas
    const headers = ['Area', 'Proceso', 'Evento de Riesgo', 'Amenaza', 'Vulnerabilidad', 'Impacto', 'Probabilidad', 'Score', 'Nivel', 'Control'];
    
    // Extraemos solo lo que estamos viendo filtrado
    const csvData = filteredRisks.map(r => [
      `"${r.area}"`, `"${r.process}"`, `"${r.riskEvent}"`, `"${r.threat}"`, `"${r.vulnerability}"`,
      r.impactValue, r.probabilityValue, r.inherentRiskScore, r.inherentRiskLevel, `"${r.controlType}"`
    ]);
    
    // Unimos todo en un formato universal
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    
    // Forzamos la descarga en el navegador
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF asegura que Excel lea los acentos (UTF-8)
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Matriz_Riesgos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const highRisks = risks.filter(r => r.inherentRiskLevel === 'Alto').length;
  const mediumRisks = risks.filter(r => r.inherentRiskLevel === 'Medio').length;

  return (
    <main className="min-h-screen p-8 lg:p-12 bg-gray-50/50 text-gray-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Matriz de Riesgos</h1>
            <p className="mt-1 text-gray-500 font-medium">Gestión y control de amenazas tecnológicas y no tecnológicas.</p>
          </div>
          <button onClick={openNewRisk} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
            <Plus size={20} /> Nuevo Riesgo
          </button>
        </header>

        {/* KPIs */}
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

        {/* BARRA DE COMANDO: Búsqueda, Filtros y Exportación */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            
            {/* Buscador */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por área, proceso o evento..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* Filtro por Nivel */}
            <div className="relative w-full md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none bg-white"
              >
                <option value="Todos">Todos los Niveles</option>
                <option value="Alto">Nivel Alto</option>
                <option value="Medio">Nivel Medio</option>
                <option value="Bajo">Nivel Bajo</option>
              </select>
            </div>

          </div>

          {/* Botón de Exportación */}
          <button 
            onClick={exportToCSV}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-lg font-bold transition"
          >
            <Download size={18} /> Exportar Matriz (CSV)
          </button>
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
                {filteredRisks.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No se encontraron riesgos que coincidan con la búsqueda.</td></tr>
                )}
                {filteredRisks.map((risk) => (
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
                        <button onClick={() => openEditRisk(risk)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition" title="Editar"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(risk.id)} className="p-2 text-red-600 hover:bg-red-100 rounded transition" title="Eliminar"><Trash2 size={18} /></button>
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
                
                {/* Formulario Principal de Riesgo */}
                <RiskForm key={editingRisk ? editingRisk.id : 'nuevo'} onRiskAdded={fetchRisks} riskToEdit={editingRisk} onClose={closeModal} />
                
                {/* INYECCIÓN DEL PANEL DE MITIGACIÓN (Solo visible al Editar) */}
                {editingRisk && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <ActionPlanPanel riskId={editingRisk.id} />
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}