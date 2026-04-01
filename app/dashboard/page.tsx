'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, estudiantes: 0, pagos: 0, ingresos: 0 })

  useEffect(() => {
    async function fetchStats() {
      const [{ count: leads }, { count: estudiantes }, { data: pagos }] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('estudiantes').select('*', { count: 'exact', head: true }),
        supabase.from('pagos').select('monto, estado'),
      ])
      const ingresos = pagos?.filter(p => p.estado === 'pagado').reduce((a, p) => a + p.monto, 0) || 0
      setStats({ leads: leads || 0, estudiantes: estudiantes || 0, pagos: pagos?.length || 0, ingresos })
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Leads totales', value: stats.leads, icon: '🎯', color: 'bg-blue-50 border-blue-200' },
    { label: 'Estudiantes', value: stats.estudiantes, icon: '🎓', color: 'bg-green-50 border-green-200' },
    { label: 'Pagos registrados', value: stats.pagos, icon: '💳', color: 'bg-purple-50 border-purple-200' },
    { label: 'Ingresos (S/)', value: `S/ ${stats.ingresos.toFixed(2)}`, icon: '💰', color: 'bg-yellow-50 border-yellow-200' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h2>
      <p className="text-slate-500 mb-8">Resumen general de Nautia</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <div key={card.label} className={`border rounded-xl p-6 ${card.color}`}>
            <div className="text-3xl mb-3">{card.icon}</div>
            <div className="text-2xl font-bold text-slate-800">{card.value}</div>
            <div className="text-sm text-slate-600 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
