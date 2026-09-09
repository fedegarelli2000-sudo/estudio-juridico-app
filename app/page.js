'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [saludo, setSaludo] = useState('');
  const [fechaActual, setFechaActual] = useState('');

  // Estados remotos de Supabase
  const [clientes, setClientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Equipo y Mails de notificación
  const [equipoMails, setEquipoMails] = useState([
    'colega1@estudiomm.com',
    'estudiojuridicomm@gmail.com'
  ]);
  const [nuevoMail, setNuevoMail] = useState('');

  // Calculadora de plazos
  const [calcFechaInicio, setCalcFechaInicio] = useState('');
  const [calcDias, setCalcDias] = useState(3);
  const [calcResultado, setCalcResultado] = useState(null);

  // Formularios
  const [clienteForm, setClienteForm] = useState({ nombre: '', dni: '', telefono: '', email: '' });
  const [expedienteForm, setExpedienteForm] = useState({ caratula: '', numero: '', tipo_causa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', abogado_asignado: '' });
  const [eventoForm, setEventoForm] = useState({ titulo: '', tipo: 'Audiencia', fecha: '', hora: '10:00', mail_destino: '' });

  // Saludo por hora exacta y carga de datos
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) {
      setSaludo('¡Buenos días!');
    } else if (hora >= 12 && hora < 20) {
      setSaludo('¡Buenas tardes!');
    } else {
      setSaludo('¡Buenas noches!');
    }

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setFechaActual(new Date().toLocaleDateString('es-AR', opciones));

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: dataClientes } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
    const { data: dataExpedientes } = await supabase.from('expedientes').select('*').order('created_at', { ascending: false });
    const { data: dataEventos } = await supabase.from('eventos').select('*').order('created_at', { ascending: false });

    if (dataClientes) setClientes(dataClientes);
    if (dataExpedientes) setExpedientes(dataExpedientes);
    if (dataEventos) setEventos(dataEventos);
    setLoading(false);
  };

  // Guardar en Supabase
  const addCliente = async (e) => {
    e.preventDefault();
    if (!clienteForm.nombre || !clienteForm.dni) return;
    const { data, error } = await supabase.from('clientes').insert([clienteForm]).select();
    if (!error && data) {
      setClientes([data[0], ...clientes]);
      setClienteForm({ nombre: '', dni: '', telefono: '', email: '' });
    }
  };

  const addExpediente = async (e) => {
    e.preventDefault();
    if (!expedienteForm.caratula) return;
    const tipoFinal = activeTab === 'rentas' ? 'Extrajudicial' : 'Judicial';
    const finalForm = { ...expedienteForm, tipo_causa: tipoFinal };
    const { data, error } = await supabase.from('expedientes').insert([finalForm]).select();
    if (!error && data) {
      setExpedientes([data[0], ...expedientes]);
      setExpedienteForm({ caratula: '', numero: '', tipo_causa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', abogado_asignado: '' });
    }
  };

  const addEvento = async (e) => {
    e.preventDefault();
    if (!eventoForm.titulo || !eventoForm.fecha) return;
    const { data, error } = await supabase.from('eventos').insert([eventoForm]).select();
    if (!error && data) {
      setEventos([data[0], ...eventos]);
      setEventoForm({ titulo: '', tipo: 'Audiencia', fecha: '', hora: '10:00', mail_destino: '' });
    }
  };

  const addMailEquipo = (e) => {
    e.preventDefault();
    if (!nuevoMail || equipoMails.includes(nuevoMail)) return;
    setEquipoMails([...equipoMails, nuevoMail]);
    setNuevoMail('');
  };

  // Lógica para calculadora de días hábiles procesales
  const calcularPlazo = (e) => {
    e.preventDefault();
    if (!calcFechaInicio) return;
    let fecha = new Date(calcFechaInicio);
    let diasAgregados = 0;
    while (diasAgregados < parseInt(calcDias)) {
      fecha.setDate(fecha.getDate() + 1);
      const diaSemana = fecha.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) { // Omite sábados (6) y domingos (0)
        diasAgregados++;
      }
    }
    setCalcResultado(fecha.toLocaleDateString('es-AR'));
  };

  const tipoColors = {
    Plazo: '#3b82f6',
    Tarea: '#10b981',
    Audiencia: '#ef4444',
    Cita: '#06b6d4',
    Vencimiento: '#f59e0b',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000000', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* MENÚ LATERAL PLEGABLE (SIDEBAR) */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid #1a1a1a',
        padding: '20px 12px',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between'
      }}>
        <div>
          {/* BOTÓN COLAPSAR Y LOGO MM */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', marginBottom: '32px' }}>
            {sidebarOpen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#000000', border: '2px solid #282828', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '900', letterSpacing: '-3px' }}>
                  <span style={{ color: '#ff6b00', zIndex: 1 }}>M</span>
                  <span style={{ color: '#c0c0c0', marginLeft: '-7px', zIndex: 0 }}>M</span>
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: 'bold' }}>ESTUDIO MM</h1>
                  <span style={{ fontSize: '10px', color: '#ff6b00', fontWeight: 'bold' }}>GESTIÓN JURÍDICA</span>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ backgroundColor: '#141414', border: '1px solid #282828', color: '#ff6b00', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* OPCIONES DE NAVEGACIÓN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('inicio')} style={navBtnStyle(activeTab === 'inicio', sidebarOpen)}>
              <span>🏠</span> {sidebarOpen && <span>Dashboard / Mi Día</span>}
            </button>
            <button onClick={() => setActiveTab('calendario')} style={navBtnStyle(activeTab === 'calendario', sidebarOpen)}>
              <span>📅</span> {sidebarOpen && <span>Calendario Yúdico</span>}
            </button>
            <button onClick={() => setActiveTab('judiciales')} style={navBtnStyle(activeTab === 'judiciales', sidebarOpen)}>
              <span>⚖️</span> {sidebarOpen && <span>Judiciales ({expedientes.filter(e => e.tipo_causa === 'Judicial').length})</span>}
            </button>
            <button onClick={() => setActiveTab('rentas')} style={navBtnStyle(activeTab === 'rentas', sidebarOpen)}>
              <span>🏛️</span> {sidebarOpen && <span>Rentas / Extrajudicial ({expedientes.filter(e => e.tipo_causa === 'Extrajudicial').length})</span>}
            </button>
            <button onClick={() => setActiveTab('clientes')} style={navBtnStyle(activeTab === 'clientes', sidebarOpen)}>
              <span>👤</span> {sidebarOpen && <span>Clientes ({clientes.length})</span>}
            </button>
            <button onClick={() => setActiveTab('calculadora')} style={navBtnStyle(activeTab === 'calculadora', sidebarOpen)}>
              <span>⏱️</span> {sidebarOpen && <span>Contador de Plazos</span>}
            </button>
          </div>
        </div>

        {/* AJUSTES / CONFIGURACIÓN DE MAILS */}
        <div>
          <button onClick={() => setActiveTab('configuracion')} style={navBtnStyle(activeTab === 'configuracion', sidebarOpen)}>
            <span>⚙️</span> {sidebarOpen && <span>Config. Mails / Equipo</span>}
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* CABECERA SUPERIOR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a0a', padding: '16px 24px', borderRadius: '12px', border: '1px solid #1a1a1a', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '13px', color: '#ff6b00', fontWeight: 'bold' }}>{saludo}</span>
            <div style={{ fontSize: '12px', color: '#666666' }}>{fechaActual}</div>
          </div>
          {loading && <span style={{ fontSize: '12px', color: '#ff6b00' }}>⚡ Conectado a Supabase</span>}
        </header>

        {/* DASHBOARD / MI DÍA */}
        {activeTab === 'inicio' && (
          <div>
            <h2 style={{ fontSize: '20px', color: '#ffffff', marginBottom: '4px' }}>Mi Día</h2>
            <p style={{ color: '#666666', fontSize: '13px', margin: '0 0 20px 0' }}>Plazos, audiencias y compromisos del estudio</p>

            <div style={{ display: 'grid', gap: '12px' }}>
              {eventos.length === 0 ? <p style={{ color: '#555555', fontStyle: 'italic' }}>No hay audiencias ni plazos agendados en la nube.</p> : (
                eventos.map(ev => (
                  <div key={ev.id} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderLeft: `4px solid ${tipoColors[ev.tipo] || '#ff6b00'}`, borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: tipoColors[ev.tipo], fontWeight: 'bold', textTransform: 'uppercase' }}>{ev.tipo}</span>
                      <h4 style={{ margin: '4px 0', fontSize: '16px', color: '#ffffff' }}>{ev.titulo}</h4>
                      <span style={{ fontSize: '12px', color: '#888888' }}>📅 Vence: {ev.fecha} | ⏰ {ev.hora}hs | ✉️ Notificación enviada a: {ev.mail_destino || 'Equipo MM'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CALENDARIO */}
        {activeTab === 'calendario' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Agendar Cita / Plazo con Notificación por Mail</h2>
            <form onSubmit={addEvento} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a', marginBottom: '24px' }}>
              <input type="text" placeholder="Título (ej: Audiencia de Mediación)" value={eventoForm.titulo} onChange={e => setEventoForm({...eventoForm, titulo: e.target.value})} style={inputStyle} required />
              
              <select value={eventoForm.tipo} onChange={e => setEventoForm({...eventoForm, tipo: e.target.value})} style={inputStyle}>
                <option value="Audiencia">Audiencia</option>
                <option value="Plazo">Plazo Procesal</option>
                <option value="Tarea">Tarea</option>
                <option value="Cita">Cita / Reunión</option>
                <option value="Vencimiento">Vencimiento Tasa / Cuota</option>
              </select>

              <input type="date" value={eventoForm.fecha} onChange={e => setEventoForm({...eventoForm, fecha: e.target.value})} style={inputStyle} required />
              <input type="time" value={eventoForm.hora} onChange={e => setEventoForm({...eventoForm, hora: e.target.value})} style={inputStyle} required />
              
              <select value={eventoForm.mail_destino} onChange={e => setEventoForm({...eventoForm, mail_destino: e.target.value})} style={inputStyle}>
                <option value="">Seleccionar Mail de Colega a Notificar...</option>
                {equipoMails.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
              </select>

              <button type="submit" style={btnStyle}>Guardar y Enviar Notificación Google Calendar</button>
            </form>
          </div>
        )}

        {/* SECCIÓN CAUSAS */}
        {(activeTab === 'judiciales' || activeTab === 'rentas') && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Cargar Causa ({activeTab === 'judiciales' ? 'Judicial' : 'Extrajudicial / Rentas'})</h2>
            <form onSubmit={addExpediente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a', marginBottom: '24px' }}>
              <input type="text" placeholder="Carátula / Deudor" value={expedienteForm.caratula} onChange={e => setExpedienteForm({...expedienteForm, caratula: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="N° Expediente / Matrícula / CUIT" value={expedienteForm.numero} onChange={e => setExpedienteForm({...expedienteForm, numero: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="Juzgado / Repartición" value={expedienteForm.juzgado} onChange={e => setExpedienteForm({...expedienteForm, juzgado: e.target.value})} style={inputStyle} />
              <button type="submit" style={btnStyle}>Guardar Causa en Supabase</button>
            </form>

            <div style={{ display: 'grid', gap: '10px' }}>
              {expedientes.filter(e => e.tipo_causa === (activeTab === 'rentas' ? 'Extrajudicial' : 'Judicial')).map(e => (
                <div key={e.id} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '16px' }}>
                  <strong style={{ color: '#ffffff', fontSize: '16px' }}>{e.caratula}</strong>
                  <span style={{ color: '#ff6b00', fontSize: '12px', marginLeft: '10px' }}>N° {e.numero || 'S/N'}</span>
                  <div style={{ fontSize: '12px', color: '#888888', marginTop: '4px' }}>🏛️ {e.juzgado || 'Sin especificar'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENTES CON WHATSAPP DIRECTO */}
        {activeTab === 'clientes' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Nuevo Cliente</h2>
            <form onSubmit={addCliente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a', marginBottom: '24px' }}>
              <input type="text" placeholder="Nombre completo" value={clienteForm.nombre} onChange={e => setClienteForm({...clienteForm, nombre: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="DNI / CUIT" value={clienteForm.dni} onChange={e => setClienteForm({...clienteForm, dni: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="Teléfono / WhatsApp (ej: 3584123456)" value={clienteForm.telefono} onChange={e => setClienteForm({...clienteForm, telefono: e.target.value})} style={inputStyle} />
              <input type="email" placeholder="Email" value={clienteForm.email} onChange={e => setClienteForm({...clienteForm, email: e.target.value})} style={inputStyle} />
              <button type="submit" style={btnStyle}>Guardar Cliente</button>
            </form>

            <div style={{ display: 'grid', gap: '10px' }}>
              {clientes.map(c => (
                <div key={c.id} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#ffffff' }}>{c.nombre}</strong> <span style={{ color: '#666666' }}>(DNI: {c.dni})</span>
                    <div style={{ fontSize: '12px', color: '#888888', marginTop: '4px' }}>📞 {c.telefono || 'Sin teléfono'} | ✉️ {c.email || 'Sin correo'}</div>
                  </div>
                  {c.telefono && (
                    <a href={`https://wa.me/${c.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25D366', color: '#ffffff', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
                      💬 WhatsApp
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTADOR DE PLAZOS PROCESALES */}
        {activeTab === 'calculadora' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>⏱️ Calculadora de Plazos Procesales (Días Hábiles)</h2>
            <form onSubmit={calcularPlazo} style={{ backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a', maxWidth: '500px' }}>
              <label style={{ fontSize: '13px', color: '#888888', display: 'block', marginBottom: '6px' }}>Fecha de Cédula / Notificación:</label>
              <input type="date" value={calcFechaInicio} onChange={e => setCalcFechaInicio(e.target.value)} style={{ ...inputStyle, marginBottom: '16px' }} required />

              <label style={{ fontSize: '13px', color: '#888888', display: 'block', marginBottom: '6px' }}>Plazo en días hábiles:</label>
              <input type="number" value={calcDias} onChange={e => setCalcDias(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} required min="1" />

              <button type="submit" style={btnStyle}>Calcular Fecha de Vencimiento</button>

              {calcResultado && (
                <div style={{ marginTop: '20px', backgroundColor: '#ff6b0022', border: '1px solid #ff6b00', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#ff6b00', display: 'block' }}>EL PLAZO VENCE EL DÍA:</span>
                  <strong style={{ fontSize: '22px', color: '#ffffff' }}>{calcResultado}</strong>
                </div>
              )}
            </form>
          </div>
        )}

        {/* CONFIGURACIÓN DE MAILS DE NOTIFICACIÓN */}
        {activeTab === 'configuracion' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>⚙️ Configuración de Mails del Equipo</h2>
            <p style={{ color: '#888888', fontSize: '13px', marginBottom: '20px' }}>Agrega las casillas de correo de tus colegas para notificarles plazos y audiencias de Google Calendar.</p>

            <form onSubmit={addMailEquipo} style={{ display: 'flex', gap: '12px', marginBottom: '24px', maxWidth: '500px' }}>
              <input type="email" placeholder="ejemplo@estudiomm.com" value={nuevoMail} onChange={e => setNuevoMail(e.target.value)} style={inputStyle} required />
              <button type="submit" style={{ ...btnStyle, width: 'auto' }}>Agregar Mail</button>
            </form>

            <h3 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '12px' }}>Correos Registrados:</h3>
            <div style={{ display: 'grid', gap: '8px', maxWidth: '500px' }}>
              {equipoMails.map((mail, i) => (
                <div key={i} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#e2e8f0', fontSize: '14px' }}>✉️ {mail}</span>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>✓ Sincronizado</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Estilos dinámicos
const navBtnStyle = (active, open) => ({
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '12px 16px', borderRadius: '8px', border: 'none',
  backgroundColor: active ? '#ff6b00' : 'transparent',
  color: active ? '#ffffff' : '#888888',
  fontWeight: active ? 'bold' : 'normal',
  cursor: 'pointer', textAlign: 'left', fontSize: '13px', width: '100%', transition: 'all 0.2s'
});

const inputStyle = { backgroundColor: '#000000', border: '1px solid #282828', color: '#ffffff', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const btnStyle = { backgroundColor: '#ff6b00', color: '#ffffff', border: 'none', padding: '12px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', width: '100%' };
