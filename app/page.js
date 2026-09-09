'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [saludo, setSaludo] = useState('');
  const [fechaActual, setFechaActual] = useState('');

  // Datos
  const [clientes, setClientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [eventos, setEventos] = useState([
    { id: 1, titulo: 'AUDIENCIA MEDIACION', tipo: 'Audiencia', fecha: '2026-09-08', hora: '19:25', mail: 'fede@estudio.com' }
  ]);
  const [mailsEstudio, setMailsEstudio] = useState(['fede@estudio.com']);

  // Formularios
  const [clienteForm, setClienteForm] = useState({ nombre: '', dni: '', telefono: '', email: '' });
  const [expedienteForm, setExpedienteForm] = useState({ caratula: '', numero: '', tipoCausa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', clienteId: '' });
  const [eventoForm, setEventoForm] = useState({ titulo: '', tipo: 'Audiencia', fecha: '2026-09-09', hora: '10:00', mailDestino: '' });
  const [nuevoMail, setNuevoMail] = useState('');

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) setSaludo('¡Buenos días!');
    else if (hora >= 12 && hora < 20) setSaludo('¡Buenas tardes!');
    else setSaludo('¡Buenas noches!');

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setFechaActual(new Date().toLocaleDateString('es-AR', opciones));
  }, []);

  const addCliente = (e) => {
    e.preventDefault();
    if (!clienteForm.nombre) return;
    setClientes([...clientes, { ...clienteForm, id: Date.now() }]);
    setClienteForm({ nombre: '', dni: '', telefono: '', email: '' });
  };

  const addExpediente = (e) => {
    e.preventDefault();
    if (!expedienteForm.caratula) return;
    setExpedientes([...expedientes, { ...expedienteForm, id: Date.now() }]);
    setExpedienteForm({ caratula: '', numero: '', tipoCausa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', clienteId: '' });
  };

  const addEvento = (e) => {
    e.preventDefault();
    if (!eventoForm.titulo) return;
    setEventos([...eventos, { ...eventoForm, id: Date.now() }]);
    setEventoForm({ titulo: '', tipo: 'Audiencia', fecha: '2026-09-09', hora: '10:00', mailDestino: '' });
  };

  const addMail = (e) => {
    e.preventDefault();
    if (!nuevoMail || mailsEstudio.includes(nuevoMail)) return;
    setMailsEstudio([...mailsEstudio, nuevoMail]);
    setNuevoMail('');
  };

  const tipoColors = {
    Plazo: '#3b82f6',
    Tarea: '#10b981',
    Audiencia: '#ef4444',
    Cita: '#06b6d4',
    Vencimiento: '#f59e0b',
    Cuota: '#8b5cf6'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#000000', color: '#e2e8f0', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#0a0a0a', borderRadius: '16px', padding: '28px', border: '1px solid #1a1a1a' }}>
        
        {/* LOGO MM SOBRE FONDO NEGRO */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ backgroundColor: '#000000', border: '2px solid #282828', width: '64px', height: '64px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900', letterSpacing: '-5px', paddingRight: '5px' }}>
              <span style={{ color: '#ff6b00', zIndex: 1 }}>M</span>
              <span style={{ color: '#c0c0c0', marginLeft: '-11px', zIndex: 0 }}>M</span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', color: '#ffffff' }}>ESTUDIO JURÍDICO MM</h1>
              <p style={{ margin: 0, fontSize: '12px', color: '#ff6b00', fontWeight: 'bold' }}>GESTIÓN JUDICIAL, EXTRAJUDICIAL Y RENTAS CÓRDOBA</p>
            </div>
          </div>
        </header>

        {/* NAVEGACIÓN */}
        <nav style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('inicio')} style={tabStyle(activeTab === 'inicio')}>🏠 Dashboard / Mi Día</button>
          <button onClick={() => setActiveTab('calendario')} style={tabStyle(activeTab === 'calendario')}>📅 Calendario Yúdico</button>
          <button onClick={() => setActiveTab('judiciales')} style={tabStyle(activeTab === 'judiciales')}>⚖️ Judiciales ({expedientes.filter(e => e.tipoCausa === 'Judicial').length})</button>
          <button onClick={() => setActiveTab('rentas')} style={tabStyle(activeTab === 'rentas')}>🏛️ Rentas ({expedientes.filter(e => e.tipoCausa === 'Extrajudicial').length})</button>
          <button onClick={() => setActiveTab('clientes')} style={tabStyle(activeTab === 'clientes')}>👤 Clientes ({clientes.length})</button>
        </nav>

        {/* PANTALLA INICIO (ESTILO FOTO 1) */}
        {activeTab === 'inicio' && (
          <div>
            <div style={{ backgroundColor: '#111111', padding: '20px', borderRadius: '12px', border: '1px solid #222222', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#ffffff', margin: 0 }}>{saludo}</h2>
              <p style={{ color: '#888888', margin: '4px 0 0 0', fontSize: '14px' }}>{fechaActual} • {eventos.length} plazos próximos y 0 tareas pendientes</p>
            </div>

            {/* CARTEL DE ALERTA URGENTE */}
            <div style={{ backgroundColor: '#ef444415', border: '1px solid #ef444444', padding: '14px 18px', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>Alerta urgente</span>
              <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>AUDIENCIA MEDIACION HOY</span>
            </div>

            {/* SECCIÓN MI DÍA */}
            <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '4px' }}>Mi Día</h3>
            <p style={{ color: '#666666', fontSize: '13px', margin: '0 0 16px 0' }}>Plazos, tareas y audiencias de hoy</p>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
              {eventos.map(ev => (
                <div key={ev.id} style={{ backgroundColor: '#111111', border: '1px solid #222222', borderLeft: `4px solid ${tipoColors[ev.tipo] || '#ff6b00'}`, borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: tipoColors[ev.tipo], fontWeight: 'bold', textTransform: 'uppercase' }}>{ev.tipo}</span>
                    <h4 style={{ margin: '4px 0', fontSize: '16px', color: '#ffffff' }}>{ev.titulo}</h4>
                    <span style={{ fontSize: '12px', color: '#888888' }}>⏰ {ev.hora}hs | ✉️ Notificar a: {ev.mail || 'Todo el equipo'}</span>
                  </div>
                  <button style={{ backgroundColor: '#222222', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Ver detalles</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANTALLA CALENDARIO (ESTILO FOTO 2 Y 3) */}
        {activeTab === 'calendario' && (
          <div>
            {/* BANNER SINCRONIZACIÓN GOOGLE CALENDAR */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #222222', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '18px' }}>Calendario Integrado</h3>
              <p style={{ color: '#888888', fontSize: '13px', margin: '6px 0 16px 0' }}>
                Conectá la cuenta de Google para sincronizar automáticamente los eventos agendados con los correos del estudio.
              </p>
              
              {/* VINCULADOR DE MAILS */}
              <form onSubmit={addMail} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input type="email" placeholder="Agregar correo para sincronizar (ej: abogado@gmail.com)" value={nuevoMail} onChange={e => setNuevoMail(e.target.value)} style={{ ...inputDarkStyle, flex: 1 }} required />
                <button type="submit" style={{ ...btnOrangeStyle, gridColumn: 'auto' }}>Vincular Mail</button>
              </form>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#a0aec0' }}>Mails autorizados:</span>
                {mailsEstudio.map((m, i) => (
                  <span key={i} style={{ backgroundColor: '#222222', color: '#ff6b00', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>✉️ {m}</span>
                ))}
              </div>
            </div>

            {/* FORMULARIO AGENDAR NUEVO EVENTO */}
            <h3 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '12px' }}>➕ Agendar Cita / Audiencia / Plazo</h3>
            <form onSubmit={addEvento} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', backgroundColor: '#111111', padding: '16px', borderRadius: '12px', border: '1px solid #222222', marginBottom: '28px' }}>
              <input type="text" placeholder="Título (ej: Audiencia Mediación)" value={eventoForm.titulo} onChange={e => setEventoForm({...eventoForm, titulo: e.target.value})} style={inputDarkStyle} required />
              
              <select value={eventoForm.tipo} onChange={e => setEventoForm({...eventoForm, tipo: e.target.value})} style={inputDarkStyle}>
                <option value="Audiencia">Tipo: Audiencia</option>
                <option value="Plazo">Tipo: Plazo</option>
                <option value="Tarea">Tipo: Tarea</option>
                <option value="Cita">Tipo: Cita</option>
                <option value="Vencimiento">Tipo: Vencimiento</option>
                <option value="Cuota">Tipo: Cuota</option>
              </select>

              <input type="date" value={eventoForm.fecha} onChange={e => setEventoForm({...eventoForm, fecha: e.target.value})} style={inputDarkStyle} required />
              <input type="time" value={eventoForm.hora} onChange={e => setEventoForm({...eventoForm, hora: e.target.value})} style={inputDarkStyle} required />

              <select value={eventoForm.mailDestino} onChange={e => setEventoForm({...eventoForm, mailDestino: e.target.value})} style={inputDarkStyle}>
                <option value="">Enviar a mail de la lista...</option>
                {mailsEstudio.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
              </select>

              <button type="submit" style={btnOrangeStyle}>Agendar y Sincronizar</button>
            </form>

            {/* VISTA PREVIA CALENDARIO (GRILLA ESTILO YÚDICO) */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '18px' }}>Septiembre 2026</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Object.keys(tipoColors).map(t => (
                    <span key={t} style={{ fontSize: '11px', color: tipoColors[t], backgroundColor: '#000', padding: '3px 8px', borderRadius: '4px', border: '1px solid #222' }}>● {t}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                {['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map(d => (
                  <div key={d} style={{ color: '#666666', fontSize: '12px', paddingBottom: '8px', fontWeight: 'bold' }}>{d}</div>
                ))}

                {/* Días simulados del mes */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dia = i + 1;
                  const fechaStr = `2026-09-${dia < 10 ? '0' + dia : dia}`;
                  const evsDia = eventos.filter(e => e.fecha === fechaStr);

                  return (
                    <div key={i} style={{ backgroundColor: '#000000', border: '1px solid #1a1a1a', minHeight: '70px', padding: '6px', borderRadius: '6px', textAlign: 'left' }}>
                      <span style={{ fontSize: '11px', color: '#666666', fontWeight: 'bold' }}>{dia}</span>
                      {evsDia.map(ev => (
                        <div key={ev.id} style={{ backgroundColor: tipoColors[ev.tipo] || '#ff6b00', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ev.hora} {ev.titulo}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* RESTO DE SECCIONES (JUDICIALES / RENTAS / CLIENTES) */}
        {(activeTab === 'judiciales' || activeTab === 'rentas') && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Cargar Causa ({activeTab === 'judiciales' ? 'Judicial' : 'Extrajudicial / Rentas'})</h2>
            <form onSubmit={addExpediente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#111111', padding: '16px', borderRadius: '12px', border: '1px solid #222222', marginBottom: '24px' }}>
              <input type="text" placeholder="Carátula / Deudor" value={expedienteForm.caratula} onChange={e => setExpedienteForm({...expedienteForm, caratula: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="N° Expediente / CUIT" value={expedienteForm.numero} onChange={e => setExpedienteForm({...expedienteForm, numero: e.target.value})} style={inputDarkStyle} />
              <button type="submit" style={btnOrangeStyle}>Guardar Expediente</button>
            </form>
          </div>
        )}

        {activeTab === 'clientes' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Registrar Cliente</h2>
            <form onSubmit={addCliente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#111111', padding: '16px', borderRadius: '12px', border: '1px solid #222222' }}>
              <input type="text" placeholder="Nombre completo" value={clienteForm.nombre} onChange={e => setClienteForm({...clienteForm, nombre: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="DNI / CUIT" value={clienteForm.dni} onChange={e => setClienteForm({...clienteForm, dni: e.target.value})} style={inputDarkStyle} required />
              <button type="submit" style={btnOrangeStyle}>Guardar Cliente</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

const tabStyle = (active) => ({
  padding: '10px 16px', borderRadius: '8px', border: 'none',
  backgroundColor: active ? '#ff6b00' : '#121212', color: active ? '#ffffff' : '#888888',
  fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
});

const inputDarkStyle = { backgroundColor: '#000000', border: '1px solid #282828', color: '#ffffff', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const btnOrangeStyle = { backgroundColor: '#ff6b00', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', gridColumn: '1 / -1' };
