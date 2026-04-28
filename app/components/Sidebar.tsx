'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <aside className="w-64 bg-indigo-950 text-white flex flex-col min-h-screen">
      <div className="p-6 text-2xl font-black tracking-wider border-b border-indigo-800">
        SIR-CORE
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="block p-3 rounded hover:bg-indigo-800 transition font-medium">
          👁️ Centro de Mando
        </Link>
        <Link href="/" className="block p-3 rounded hover:bg-indigo-800 transition font-medium">
          📊 Matriz de Riesgos
        </Link>
        <Link href="/rat-module" className="block p-3 rounded hover:bg-indigo-800 transition font-medium">
          📁 Registro RAT
        </Link>
        <Link href="/data-flow" className="block p-3 rounded hover:bg-indigo-800 transition font-medium">
          🔄 Flujo de Datos
        </Link>
        <Link href="/dpia" className="block p-3 rounded hover:bg-indigo-800 transition font-medium">
          ⚖️ Evaluación de Impacto
        </Link>
      </nav>
      
      {/* El Botón de Abandono del Trono */}
      <div className="p-4 border-t border-indigo-800">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-left p-3 text-red-300 font-bold hover:bg-red-900/50 hover:text-red-100 rounded transition flex items-center"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}