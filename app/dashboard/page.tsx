'use client';

import { useEffect, useState } from 'react';

interface Risk {
  id: string;
  riskEvent: string;
  impactValue: number;
  probabilityValue: number;
  inherentRiskLevel: string;
}

export default function Dashboard() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      const res = await fetch('/api/risks');
      const data = await res.json();
      setRisks(data);
      setLoading(false);
    };
    fetchRisks();
  }, []);

  // Función para agrupar riesgos en coordenadas (X = Probabilidad, Y = Impacto)
  const getRisksAt = (impact: number, probability: number) => {
    return risks.filter(r => r.impactValue === impact && r.probabilityValue === probability);
  };

  // Función para determinar el color del cuadrante (Táctica de semáforo de riesgos)
  const getQuadrantColor = (impact: number, probability: number) => {
    const score = impact * probability;
    if (score >= 15) return 'bg-red-500 border-red-600'; // Nivel Alto
    if (score >= 8) return 'bg-yellow-400 border-yellow-500'; // Nivel Medio
    return 'bg-green-400 border-green-500'; // Nivel Bajo
  };

  return (
    <main className="min-h-screen p-10 bg-gray-50 text-gray-900">
      <header className="border-b-2 border-indigo-200 pb-4 mb-8">
        <h1 className="text-4xl font-black text-indigo-900 tracking-tight">Dashboard Táctico</h1>
        <p className="mt-2 text-lg text-gray-600">Visión global de amenazas y niveles de riesgo</p>
      </header>

      {loading ? (
        <p className="text-indigo-600 font-bold animate-pulse">Analizando la matriz de datos...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tarjetas de Resumen Rápido */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-500 font-bold uppercase text-sm">Total de Riesgos Identificados</h3>
              <p className="text-5xl font-black text-indigo-900">{risks.length}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow border border-red-100">
              <h3 className="text-red-800 font-bold uppercase text-sm">Riesgos Críticos (Alto)</h3>
              <p className="text-5xl font-black text-red-600">
                {risks.filter(r => r.inherentRiskLevel === 'Alto').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
              <h3 className="text-yellow-800 font-bold uppercase text-sm">Riesgos en Observación (Medio)</h3>
              <p className="text-5xl font-black text-yellow-600">
                {risks.filter(r => r.inherentRiskLevel === 'Medio').length}
              </p>
            </div>
          </div>

          {/* El Mapa de Calor 5x5 */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">Mapa de Calor (Impacto vs Probabilidad)</h2>
            
            <div className="relative flex">
              {/* Eje Y - Impacto */}
              <div className="flex flex-col justify-between pr-4 font-bold text-gray-500 py-8">
                <span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
              </div>
              
              <div className="flex-1">
                {/* Cuadrícula 5x5 */}
                <div className="grid grid-rows-5 grid-cols-5 gap-1 h-96">
                  {[5, 4, 3, 2, 1].map((impact) => (
                    [1, 2, 3, 4, 5].map((probability) => {
                      const quadrantRisks = getRisksAt(impact, probability);
                      return (
                        <div 
                          key={`${impact}-${probability}`} 
                          className={`relative border-2 rounded-md transition-all hover:scale-105 shadow-sm flex items-center justify-center cursor-help ${getQuadrantColor(impact, probability)}`}
                          title={`Impacto: ${impact} | Probabilidad: ${probability}\nRiesgos aquí: ${quadrantRisks.length}`}
                        >
                          {quadrantRisks.length > 0 && (
                            <span className="text-white font-black text-2xl drop-shadow-md">
                              {quadrantRisks.length}
                            </span>
                          )}
                        </div>
                      )
                    })
                  ))}
                </div>
                {/* Eje X - Probabilidad */}
                <div className="flex justify-between px-8 pt-4 font-bold text-gray-500">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8 text-sm font-bold text-gray-400">
              <span className="-rotate-90 origin-left translate-y-20 absolute -ml-8 tracking-widest uppercase">Impacto</span>
              <span className="mx-auto tracking-widest uppercase ml-16">Probabilidad</span>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}