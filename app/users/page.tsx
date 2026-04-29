'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Shield, Mail, User, Key, Users as UsersIcon } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'ANALYST' });

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Usuario creado exitosamente");
      setForm({ email: '', password: '', name: '', role: 'ANALYST' });
      fetchUsers();
    } else {
      alert("Fallo al crear usuario");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 lg:p-12 bg-gray-50 text-gray-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-10">
        
        <header>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight flex items-center gap-3">
            <UsersIcon size={40} className="text-indigo-600" /> Gestión del Personal
          </h1>
          <p className="mt-2 text-gray-500 font-medium text-lg">Controla quién accede al imperio y define sus facultades.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORMULARIO DE CREACIÓN */}
          <section className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <UserPlus size={20} /> Reclutar Usuario
              </h2>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900" placeholder="Ej: John Doe" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900" placeholder="usuario@empresa.com" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contraseña Inicial</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900" placeholder="••••••••" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rango / Permisos</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900 appearance-none">
                    <option value="ANALYST">ANALISTA (Solo Lectura/Creación)</option>
                    <option value="ADMIN">EMPERADOR (Control Total)</option>
                  </select>
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-95">
                {loading ? 'Procesando...' : 'FORJAR USUARIO'}
              </button>
            </form>
          </section>

          {/* LISTADO DE USUARIOS */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="p-5">Usuario</th>
                    <th className="p-5">Rango</th>
                    <th className="p-5">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </td>
                      <td className="p-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-5 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </motion.div>
    </main>
  );
}