'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Pago, Estudiante } from '@/lib/types'

const ESTADOS = ['pendiente', 'pagado', 'reembolsado']
const COLORES: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-green-100 text-green-700',
  reembolsado: 'bg-red-100 text-red-700',
}

export default function Pagos() {
  const [pagos, setPagos] = useState<any[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ estudiante_id: '', monto: '', tipo: 'early_bird', estado: 'pendiente', metodo_pago: '', fecha_pago: '' })

  async function fetchData() {
    const [{ data: p }, { data: e }] = await Promise.all([
      supabase.from('pagos').select('*, estudiantes(nombre, bootcamp)').order('created_at', { ascending: false }),
      supabase.from('estudiantes').select('*'),
    ])
    setPagos(p || [])
    setEstudiantes(e || [])
  }

  useEffect(() => { fetchData() }, [])

  async function handleSubmit() {
    await supabase.from('pagos').insert([{ ...form, monto: parseFloat(form.monto) }])
    setForm({ estudiante_id: '', monto: '', tipo: 'early_bird', estado: 'pendiente', metodo_pago: '', fecha_pago: '' })
    setShowForm(false)
    fetchData()
  }

  const totalPagado = pagos.filter(p => p.estado === 'pagado').reduce((a, p) => a + p.monto, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pagos</h2>
          <p className="text-slate-500">Seguimiento de cobros — <span className="text-green-600 font-medium">S/ {totalPagado.toFixed(2)} cobrados</span></p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition text-sm font-medium">
          + Registrar pago
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Registrar pago</h3>
          <div className="grid grid-cols-2 gap-4">
            <select value={form.estudiante_id} onChange={e => setForm({...form, estudiante_id: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
              <option value="">Seleccionar estudiante</option>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombre} — {e.bootcamp}</option>)}
            </select>
            <input placeholder="Monto (S/)" type="number" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
              <option value="early_bird">Early Bird (S/299)</option>
              <option value="regular">Regular (S/399)</option>
            </select>
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <input placeholder="Método de pago (Yape, transferencia...)" value={form.metodo_pago} onChange={e => setForm({...form, metodo_pago: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            <input type="date" value={form.fecha_pago} onChange={e => setForm({...form, fecha_pago: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-700">Guardar</button>
            <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              {['Estudiante','Bootcamp','Monto','Tipo','Estado','Método','Fecha'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagos.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">No hay pagos registrados aún.</td></tr>
            )}
            {pagos.map(p => (
              <tr key={p.id} className="border-b hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-800">{p.estudiantes?.nombre}</td>
                <td className="px-4 py-3 text-slate-600">{p.estudiantes?.bootcamp}</td>
                <td className="px-4 py-3 font-medium text-slate-800">S/ {p.monto}</td>
                <td className="px-4 py-3 text-slate-600">{p.tipo}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${COLORES[p.estado]}`}>{p.estado}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.metodo_pago}</td>
                <td className="px-4 py-3 text-slate-600">{p.fecha_pago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
