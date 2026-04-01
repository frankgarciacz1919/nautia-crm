export type Lead = {
  id: string
  nombre: string
  email: string
  telefono: string
  fuente: string
  bootcamp_interes: string
  estado: 'nuevo' | 'contactado' | 'interesado' | 'inscrito' | 'perdido'
  notas: string
  created_at: string
}

export type Estudiante = {
  id: string
  nombre: string
  email: string
  telefono: string
  bootcamp: string
  edicion: string
  estado: 'activo' | 'graduado' | 'desertor'
  fecha_inicio: string
  created_at: string
}

export type Pago = {
  id: string
  estudiante_id: string
  monto: number
  tipo: 'early_bird' | 'regular'
  estado: 'pendiente' | 'pagado' | 'reembolsado'
  metodo_pago: string
  fecha_pago: string
  created_at: string
}
