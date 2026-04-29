'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  ClipboardList, 
  RefreshCcw, 
  Scale, 
  Eye, 
  Users, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession(); // Detectamos la sesión activa
  
  // Extraemos el rol (con fallback por seguridad)
  const userRole = (session?.user as any)?.role || 'ANALYST';

  if (pathname === '/login') return null;

  return (
    <aside className="w-64 bg-indigo-950 text-white flex flex-col min-h-screen shadow-xl border-r border-indigo-900">
      <div className="p-6 text-2xl font-black tracking-tighter border-b border-indigo-900/50 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-sm">SIR</div>
        SIR-CORE
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Centro de Mando" active={pathname === '/dashboard'} />
        <SidebarLink href="/" icon={<ShieldAlert size={18} />} label="Matriz de Riesgos" active={pathname === '/'} />
        <SidebarLink href="/rat-module" icon={<ClipboardList size={18} />} label="Registro RAT" active={pathname === '/rat-module'} />
        <SidebarLink href="/data-flow" icon={<RefreshCcw size={18} />} label="Flujo de Datos" active={pathname === '/data-flow'} />
        <SidebarLink href="/dpia" icon={<Scale size={18} />} label="Evaluación Impacto" active={pathname === '/dpia'} />

        {/* SECCIONES RESTRINGIDAS: SOLO ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="pt-4 mt-4 border-t border-indigo-900/50 space-y-1">
            <p className="px-3 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Administración</p>
            <SidebarLink 
              href="/audit" 
              icon={<Eye size={18} />} 
              label="Auditoría" 
              active={pathname === '/audit'} 
              color="text-emerald-400"
            />
            <SidebarLink 
              href="/users" 
              icon={<Users size={18} />} 
              label="Gestión de Usuarios" 
              active={pathname === '/users'} 
              color="text-blue-400"
            />
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-indigo-900/50">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 p-3 text-red-300 font-bold hover:bg-red-950/30 hover:text-red-100 rounded-lg transition-all"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

// Sub-componente para los enlaces (limpia el código)
function SidebarLink({ href, icon, label, active, color = "text-white" }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${
        active 
        ? "bg-indigo-600 text-white shadow-lg" 
        : `hover:bg-indigo-900/50 ${color} opacity-80 hover:opacity-100`
      }`}
    >
      {icon} {label}
    </Link>
  );
}