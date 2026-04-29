import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Invocamos nuestras nuevas tropas
import Providers from "./components/Providers";

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
        
        {/* Envolvemos todo el imperio con el Provider */}
        <Providers>
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </Providers>

      </body>
    </html>
  );
}