'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/types'

const ESTADOS = ['nuevo', 'contactado', 'interesado', 'inscrito', 'perdido']
const COLORES: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-700',
  contactado: 'bg-yellow-100 text-yellow-700',
  interesado: 'bg-orange-100 text-orange-700',
  inscrito: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-700',
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', fuente: '', bootcamp_interes: '', estado: 'nuevo', notas: '' })

  async function fetchLeads() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data || [])
  }

  useEffect(() => { fetchLeads() }, [])

  async function handleSubmit() {
    await supabase.from('leads').insert([form])
    setForm({ nombre: '', email: '', telefono: '', fuente: '', bootcamp_interes: '', estado: 'nuevo', notas: '' })
    setShowForm(false)
    fetchLeads()
  }

  async function cambiarEstado(id: string, estado: string) {
    await supabase.from('leads').update({ estado }).eq('id', id)
    fetchLeads()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leads</h2>
          <p className="text-slate-500">Pipeline de ventas Nautia</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition text-sm font-medium">
          + Nuevo lead
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Agregar lead</h3>
          <div className="grid grid-cols-2 gap-4">
            {[['nombre','Nombre completo'],['email','Email'],['telefono','Teléfono'],['fuente','Fuente (LinkedIn, Web...)'],['bootcamp_interes','Bootcamp de interés']].map(([key, label]) => (
              <input key={key} placeholder={label} value={(form as any)[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            ))}
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <textarea placeholder="Notas adicionales" value={form.notas} onChange={e => setForm({...form, notas: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-4 focus:outline-none focus:ring-2 focus:ring-cyan-400" rows={2} />
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
              {['Nombre','Email','Teléfono','Bootcamp','Fuente','Estado','Notas'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">No hay leads aún. ¡Agrega el primero!</td></tr>
            )}
            {leads.map(lead => (
              <tr key={lead.id} className="border-b hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-800">{lead.nombre}</td>
                <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                <td className="px-4 py-3 text-slate-600">{lead.telefono}</td>
                <td className="px-4 py-3 text-slate-600">{lead.bootcamp_interes}</td>
                <td className="px-4 py-3 text-slate-600">{lead.fuente}</td>
                <td className="px-4 py-3">
                  <select value={lead.estado} onChange={e => cambiarEstado(lead.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${COLORES[lead.estado]}`}>
                    {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">{lead.notas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
