'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Estudiante } from '@/lib/types'

const ESTADOS = ['activo', 'graduado', 'desertor']
const COLORES: Record<string, string> = {
  activo: 'bg-green-100 text-green-700',
  graduado: 'bg-blue-100 text-blue-700',
  desertor: 'bg-red-100 text-red-700',
}

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', bootcamp: '', edicion: '', estado: 'activo', fecha_inicio: '' })

  async function fetchEstudiantes() {
    const { data } = await supabase.from('estudiantes').select('*').order('created_at', { ascending: false })
    setEstudiantes(data || [])
  }

  useEffect(() => { fetchEstudiantes() }, [])

  async function handleSubmit() {
    await supabase.from('estudiantes').insert([form])
    setForm({ nombre: '', email: '', telefono: '', bootcamp: '', edicion: '', estado: 'activo', fecha_inicio: '' })
    setShowForm(false)
    fetchEstudiantes()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estudiantes</h2>
          <p className="text-slate-500">Gestión por bootcamp</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition text-sm font-medium">
          + Nuevo estudiante
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Agregar estudiante</h3>
          <div className="grid grid-cols-2 gap-4">
            {[['nombre','Nombre completo'],['email','Email'],['telefono','Teléfono'],['bootcamp','Bootcamp'],['edicion','Edición'],['fecha_inicio','Fecha de inicio']].map(([key, label]) => (
              <input key={key} placeholder={label} type={key === 'fecha_inicio' ? 'date' : 'text'} value={(form as any)[key]}
                onChange={e => setForm({...form, [key]: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            ))}
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
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
              {['Nombre','Email','Teléfono','Bootcamp','Edición','Estado','Inicio'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {estudiantes.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">No hay estudiantes aún.</td></tr>
            )}
            {estudiantes.map(e => (
              <tr key={e.id} className="border-b hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-800">{e.nombre}</td>
                <td className="px-4 py-3 text-slate-600">{e.email}</td>
                <td className="px-4 py-3 text-slate-600">{e.telefono}</td>
                <td className="px-4 py-3 text-slate-600">{e.bootcamp}</td>
                <td className="px-4 py-3 text-slate-600">{e.edicion}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${COLORES[e.estado]}`}>{e.estado}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{e.fecha_inicio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
