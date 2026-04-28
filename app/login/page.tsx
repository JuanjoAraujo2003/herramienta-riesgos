'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Credenciales denegadas. Intruso detectado.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-indigo-900 tracking-wider">SIR-CORE</h1>
          <p className="text-gray-500 mt-2">Centro de Comando Restringido</p>
        </div>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Identificación (Correo)</label>
            <input 
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded focus:border-indigo-500 outline-none transition" 
              placeholder="tu@correo.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Clave de Acceso</label>
            <input 
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded focus:border-indigo-500 outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            disabled={loading} type="submit" 
            className="w-full bg-indigo-900 text-white font-bold py-3 px-4 rounded hover:bg-indigo-800 transition disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}