import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Invocamos nuestras nuevas tropas

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema Integral de Riesgos",
  description: "Gobernado bajo la voluntad absoluta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-100 flex min-h-screen`}>
        
        {/* El Panel Lateral ahora es inteligente y obedece rutas */}
        <Sidebar />

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}