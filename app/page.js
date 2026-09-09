// app/page.js
'use client';
import { useState, useEffect } from 'react';
// Importamos la conexión que creamos en el Paso 1
import { supabase } from '../lib/supabase';

export default function Home() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [saludo, setSaludo] = useState('');
  const [fechaActual, setFechaActual] = useState('');

  // Estados remotos (datos que vienen de Supabase)
  const [clientes, setClientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de los Formularios (lo que escribes)
  const [clienteForm, setClienteForm] = useState({ nombre: '', dni: '', telefono: '', email: '' });
  const [expedienteForm, setExpedienteForm] = useState({ carátula: '', numero: '', tipo_causa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', abogado_asignado: '' });
  const [eventoForm, setEventoForm] = useState({ titulo: '', tipo: 'Audiencia', fecha: '2026-09-09', hora: '10:00', mail_destino: '' });

  // 1. Carga inicial: Saludo, fecha y datos de la base de datos
  useEffect(() => {
    // Saludo según la hora
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) setSaludo('Good morning! / ¡Buenos días!');
    else if (hora >= 12 && hora < 20) setSaludo('¡Buenas tardes!');
    else setSaludo('¡Buenas noches!');

    // Fecha actual formateada
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setFechaActual(new Date().toLocaleDateString('es-AR', opciones));

    // Cargar datos de Supabase
    fetchData();
  }, []);

  // Función para traer datos desde Supabase
  const fetchData = async () => {
    setLoading(true);
    // Verificamos si la conexión está lista
    if (!supabase) {
      console.error('Supabase client not initialized.');
      setLoading(false);
      return;
    }

    // Traemos datos de las 3 tablas
    const { data: dataClientes } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
    const { data: dataExpedientes } = await supabase.from('expedientes').select('*').order('created_at', { ascending: false });
    const { data: dataEventos } = await supabase.from('eventos').select('*').order('created_at', { ascending: false });

    if (dataClientes) setClientes(dataClientes);
    if (dataExpedientes) setExpedientes(dataExpedientes);
    if (dataEventos) setEventos(dataEventos);
    setLoading(false);
  };

  // 2. Funciones para GUARDAR en Supabase
  const addCliente = async (e) => {
    e.preventDefault();
    if (!clienteForm.nombre || !clienteForm.dni) return;
    const { data, error } = await supabase.from('clientes').insert([clienteForm]).select();
    if (!error && data) {
      setClientes([data[0], ...clientes]); // Actualiza la lista sin recargar
      setClienteForm({ nombre: '', dni: '', telefono: '', email: '' }); // Limpia formulario
    } else if (error) console.error('Error guardando cliente:', error);
  };

  const addExpediente = async (e) => {
    e.preventDefault();
    if (!expedienteForm.carátula) return;
    // Asignamos el tipo de causa según la pestaña activa (Judicial o Rentas)
    const tipoFinal = activeTab === 'rentas' ? 'Extrajudicial' : 'Judicial';
    const finalForm = { ...expedienteForm, tipo_causa: tipoFinal };
    const { data, error } = await supabase.from('expedientes').insert([finalForm]).select();
    if (!error && data) {
      setExpedientes([data[0], ...expedientes]);
      setExpedienteForm({ carátula: '', numero: '', tipo_causa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', abogado_asignado: '' });
    } else if (error) console.error('Error guardando expediente:', error);
  };

  const addEvento = async (e) => {
    e.preventDefault();
    if (!eventoForm.titulo || !eventoForm.fecha) return;
    const { data, error } = await supabase.from('eventos').insert([eventoForm]).select();
    if (!error && data) {
      setEventos([data[0], ...eventos]);
      setEventoForm({ titulo: '', tipo: 'Audiencia', fecha: '2026-09-09', hora: '10:00', mail_destino: '' });
    } else if (error) console.error('Error guardando evento:', error);
  };

  // Colores para el calendario estilo Yúdico
  const tipoColors = {
    Plazo: '#3b82f6', // Azul
    Tarea: '#10b981', // Verde
    Audiencia: '#ef4444', // Rojo
    Cita: '#06b6d4', // Cian
    Vencimiento: '#f59e0b', // Naranja
    Cuota: '#8b5cf6' // Violeta
  };

  // 3. Renderizado de la Interfaz (UI)
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#000000', color: '#e2e8f0', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#0a0a0a', borderRadius: '16px', padding: '28px', border: '1px solid #1a1a1a', boxShadow: '0 20px 40px rgba(0,0,0,0.9)' }}>
        
        {/* LOGO MM Y ENCABEZADO */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* ISOTIPO DOBLE M SOBRE FONDO NEGRO */}
            <div style={{ backgroundColor: '#000000', border: '2px solid #282828', width: '64px', height: '64px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900', letterSpacing: '-5px', paddingRight: '5px' }}>
              <span style={{ color: '#ff6b00', zIndex: 1 }}>M</span>
              <span style={{ color: '#c0c0c0', marginLeft: '-11px', zIndex: 0 }}>M</span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', color: '#ffffff' }}>ESTUDIO JURÍDICO MM</h1>
              <p style={{ margin: 0, fontSize: '12px', color: '#ff6b00', fontWeight: 'bold' }}>GESTIÓN JUDICIAL, EXTRAJUDICIAL Y RENTAS CÓRDOBA</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '13px', color: '#ff6b00', fontWeight: 'bold' }}>{saludo}</span>
            <div style={{ fontSize: '12px', color: '#666666' }}>{fechaActual}</div>
          </div>
        </header>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('inicio')} style={tabStyle(activeTab === 'inicio')}>🏠 Dashboard / Mi Día</button>
          <button onClick={() => setActiveTab('calendario')} style={tabStyle(activeTab === 'calendario')}>📅 Calendario Yúdico</button>
          <button onClick={() => setActiveTab('judiciales')} style={tabStyle(activeTab === 'judiciales')}>⚖️ Judiciales ({expedientes.filter(e => e.tipo_causa === 'Judicial').length})</button>
          <button onClick={() => setActiveTab('rentas')} style={tabStyle(activeTab === 'rentas')}>🏛️ Rentas / Extrajud. ({expedientes.filter(e => e.tipo_causa === 'Extrajudicial').length})</button>
          <button onClick={() => setActiveTab('clientes')} style={tabStyle(activeTab === 'clientes')}>👤 Clientes ({clientes.length})</button>
        </nav>

        {loading && <p style={{ color: '#ff6b00', fontSize: '14px', fontStyle: 'italic' }}>⚡ Conectando con la base de datos de Supabase...</p>}

        {/* PANTALLA INICIO / MI DÍA */}
        {activeTab === 'inicio' && (
          <div>
            <div style={{ backgroundColor: '#111111', padding: '20px', borderRadius: '12px', border: '1px solid #222222', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', color: '#ffffff', margin: '0 0 4px 0' }}>{saludo}</h2>
              <p style={{ color: '#888888', margin: 0, fontSize: '14px' }}>Resumen general cargado desde la nube para hoy {fechaActual}.</p>
            </div>

            <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '4px' }}>Mi Día</h3>
            <p style={{ color: '#666666', fontSize: '13px', margin: '0 0 16px 0' }}>Plazos, tareas y audiencias agendadas</p>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
              {eventos.length === 0 ? <p style={{ color: '#555555', fontStyle: 'italic' }}>No hay audiencias ni plazos agendados en la nube.</p> : (
                eventos.map(ev => (
                  <div key={ev.id} style={{ backgroundColor: '#111111', border: '1px solid #222222', borderLeft: `4px solid ${tipoColors[ev.tipo] || '#ff6b00'}`, borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: tipoColors[ev.tipo], fontWeight: 'bold', textTransform: 'uppercase' }}>{ev.tipo}</span>
                      <h4 style={{ margin: '4px 0', fontSize: '16px', color: '#ffffff' }}>{ev.titulo}</h4>
                      <span style={{ fontSize: '12px', color: '#aaaaaa' }}>📅 Vence: {ev.fecha} | ⏰ {ev.hora}hs | ✉️ Notificar a: {ev.mail_destino || 'Todo el equipo'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PANTALLA CALENDARIO */}
        {activeTab === 'calendario' && (
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '12px' }}>➕ Agendar Cita / Audiencia / Plazo (Sincronizado con Supabase)</h3>
            <form onSubmit={addEvento} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', backgroundColor: '#111111', padding: '16px', borderRadius: '12px', border: '1px solid #222222', marginBottom: '28px' }}>
              <input type="text" placeholder="Título (ej: Audiencia Mediación Garelli)" value={eventoForm.titulo} onChange={e => setEventoForm({...eventoForm, titulo: e.target.value})} style={inputDarkStyle} required />
              
              <select value={eventoForm.tipo} onChange={e => setEventoForm({...eventoForm, tipo: e.target.value})} style={inputDarkStyle}>
                <option value="Audiencia">Tipo: Audiencia</option>
                <option value="Plazo">Tipo: Plazo Procesal</option>
                <option value="Tarea">Tipo: Tarea</option>
                <option value="Cita">Tipo: Cita/Reunión</option>
                <option value="Vencimiento">Tipo: Vencimiento Cuota/Tasa</option>
              </select>

              <input type="date" value={eventoForm.fecha} onChange={e => setEventoForm({...eventoForm, fecha: e.target.value})} style={inputDarkStyle} required />
              <input type="time" value={eventoForm.hora} onChange={e => setEventoForm({...eventoForm, hora: e.target.value})} style={inputDarkStyle} required />
              <input type="email" placeholder="Mail colega a notificar (Google Calendar)" value={eventoForm.mail_destino} onChange={e => setEventoForm({...eventoForm, mail_destino: e.target.value})} style={inputDarkStyle} />

              <button type="submit" style={btnOrangeStyle}>Guardar en la Nube y Sincronizar Calendario</button>
            </form>
          </div>
        )}

        {/* SECCIÓN CAUSAS (JUDICIALES / RENTAS) */}
        {(activeTab === 'judiciales' || activeTab === 'rentas') && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Cargar Causa ({activeTab === 'judiciales' ? 'Judicial' : 'Extrajudicial / Rentas Córdoba'})</h2>
            <form onSubmit={addExpediente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '32px', backgroundColor: '#111111', padding: '20px', borderRadius: '12px', border: '1px solid #222222' }}>
              <input type="text" placeholder="Carátula / Deudor (ej: Rentas c/ Garelli...)" value={expedienteForm.carátula} onChange={e => setExpedienteForm({...expedienteForm, carátula: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="N° Expediente / Matrícula / CUIT" value={expedienteForm.numero} onChange={e => setExpedienteForm({...expedienteForm, numero: e.target.value})} style={inputDarkStyle} />
              
              <select value={expedienteForm.fuero} onChange={e => setExpedienteForm({...expedienteForm, fuero: e.target.value})} style={inputDarkStyle}>
                <option value="Civil y Comercial">Fuero: Civil y Comercial</option>
                <option value="Tributario / Rentas">Fuero: Tributario / Rentas</option>
                <option value="Laboral">Fuero: Laboral</option>
                <option value="Familia">Fuero: Familia</option>
                <option value="Penal">Fuero: Penal</option>
              </select>

              <input type="text" placeholder="Juzgado / Nominación / Repartición" value={expedienteForm.juzgado} onChange={e => setExpedienteForm({...expedienteForm, juzgado: e.target.value})} style={inputDarkStyle} />
              <input type="text" placeholder="Abogado Asignado / Procurador" value={expedienteForm.abogado_asignado} onChange={e => setExpedienteForm({...expedienteForm, abogado_asignado: e.target.value})} style={inputDarkStyle} />

              <button type="submit" style={btnOrangeStyle}>Guardar Expediente en la Nube</button>
            </form>

            <h3 style={{ fontSize: '16px', color: '#888888', marginBottom: '12px' }}>Listado de Causas Cargadas</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {expedientes.filter(e => e.tipo_causa === (activeTab === 'rentas' ? 'Extrajudicial' : 'Judicial')).map(e => (
                <div key={e.id} style={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '16px', color: '#ffffff' }}>{e.carátula}</strong>
                    <span style={{ backgroundColor: '#ff6b0022', color: '#ff6b00', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>N° {e.numero || 'S/N'}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#aaaaaa', marginTop: '6px' }}>⚖️ {e.fuero} | 🏛️ {e.juzgado || 'Sin especificar'} | 👤 Asignado: {e.abogado_asignado || 'Sin asignar'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN CLIENTES */}
        {activeTab === 'clientes' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Registrar Nuevo Cliente</h2>
            <form onSubmit={addCliente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#111111', padding: '16px', borderRadius: '12px', border: '1px solid #222222', marginBottom: '24px' }}>
              <input type="text" placeholder="Nombre completo" value={clienteForm.nombre} onChange={e => setClienteForm({...clienteForm, nombre: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="DNI / CUIT" value={clienteForm.dni} onChange={e => setClienteForm({...clienteForm, dni: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="Teléfono / WhatsApp" value={clienteForm.telefono} onChange={e => setClienteForm({...clienteForm, telefono: e.target.value})} style={inputDarkStyle} />
              <input type="email" placeholder="Correo electrónico" value={clienteForm.email} onChange={e => setClienteForm({...clienteForm, email: e.target.value})} style={inputDarkStyle} />
              <button type="submit" style={btnOrangeStyle}>Guardar Cliente en la Nube</button>
            </form>

            <h3 style={{ fontSize: '16px', color: '#888888', marginBottom: '12px' }}>Padrón de Clientes</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {clientes.map(c => (
                <div key={c.id} style={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '10px', padding: '14px' }}>
                  <strong style={{ fontSize: '15px', color: '#ffffff' }}>{c.nombre}</strong> <span style={{ color: '#666666' }}>(DNI/CUIT: {c.dni})</span>
                  <div style={{ fontSize: '13px', color: '#aaaaaa', marginTop: '4px' }}>📞 {c.telefono || 'Sin teléfono'} | ✉️ {c.email || 'Sin correo'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Estilos rápidos (CSS-in-JS)
const tabStyle = (active) => ({
  flex: '1 1 140px', padding: '12px', borderRadius: '10px', border: 'none',
  backgroundColor: active ? '#ff6b00' : '#121212', color: active ? '#ffffff' : '#888888',
  fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px'
});

const inputDarkStyle = { backgroundColor: '#000000', border: '1px solid #282828', color: '#ffffff', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const btnOrangeStyle = { backgroundColor: '#ff6b00', color: '#ffffff', border: 'none', padding: '12px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', gridColumn: '1 / -1' };
