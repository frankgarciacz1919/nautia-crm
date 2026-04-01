import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nautia CRM',
  description: 'CRM interno de Nautia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <aside className="w-64 bg-[#0f172a] text-white flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <h1 className="text-xl font-bold text-cyan-400">⚓ Nautia CRM</h1>
              <p className="text-xs text-slate-400 mt-1">Panel interno</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition text-sm">📊 Dashboard</Link>
              <Link href="/leads" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition text-sm">🎯 Leads</Link>
              <Link href="/estudiantes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition text-sm">🎓 Estudiantes</Link>
              <Link href="/pagos" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition text-sm">💰 Pagos</Link>
            </nav>
            <div className="p-4 border-t border-slate-700">
              <p className="text-xs text-slate-500">© 2026 Nautia</p>
            </div>
          </aside>
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
