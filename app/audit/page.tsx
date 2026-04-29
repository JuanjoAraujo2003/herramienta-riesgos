'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// Se ha corregido la importación: de ShieldEye a Eye
import { Eye, Clock, Activity, Fingerprint } from 'lucide-react';

export default function AuditModule() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/audit')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <main className="min-h-screen p-8 lg:p-12 bg-gray-900 text-gray-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex items-center gap-4 border-b border-gray-800 pb-6">
          <div className="p-4 bg-emerald-900/50 text-emerald-400 rounded-lg">
            {/* El ícono ha sido actualizado */}
            <Eye size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Registro de Auditoría</h1>
            <p className="mt-1 text-gray-400 font-medium">Vigilancia absoluta e inalterable sobre los movimientos del sistema.</p>
          </div>
        </header>

        <section className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-700 text-gray-400 uppercase text-xs tracking-wider font-bold">
                  <th className="p-5 flex items-center gap-2"><Clock size={16} /> Fecha y Hora</th>
                  <th className="p-5"><Fingerprint size={16} className="inline mr-2" /> Usuario / Ejecutor</th>
                  <th className="p-5"><Activity size={16} className="inline mr-2" /> Acción</th>
                  <th className="p-5">Módulo Afectado</th>
                  <th className="p-5">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {logs.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No se han detectado movimientos recientes.</td></tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-750 transition-colors">
                    <td className="p-5 text-sm text-gray-300">
                      {new Date(log.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="p-5 font-bold text-emerald-400">{log.userEmail}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        log.action === 'ELIMINAR' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                        log.action === 'EDITAR' ? 'bg-amber-900/50 text-amber-400 border border-amber-800' :
                        'bg-blue-900/50 text-blue-400 border border-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-5 text-sm font-medium text-gray-300">{log.entity}</td>
                    <td className="p-5 text-sm text-gray-400 truncate max-w-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </motion.div>
    </main>
  );
}