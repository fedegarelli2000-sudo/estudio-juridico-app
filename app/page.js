'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('judiciales');
  const [clientes, setClientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [tareas, setTareas] = useState([]);

  // Formularios
  const [clienteForm, setClienteForm] = useState({ nombre: '', dni: '', telefono: '', email: '' });
  const [expedienteForm, setExpedienteForm] = useState({ 
    caratula: '', numero: '', tipoCausa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', estado: 'En Tramite', fechaAudiencia: '', clienteId: '', abogadoAsignado: '' 
  });
  const [tareaForm, setTareaForm] = useState({ titulo: '', fechaVencimiento: '', expedienteId: '', responsableMail: '' });

  const addCliente = (e) => {
    e.preventDefault();
    if (!clienteForm.nombre || !clienteForm.dni) return;
    setClientes([...clientes, { ...clienteForm, id: Date.now() }]);
    setClienteForm({ nombre: '', dni: '', telefono: '', email: '' });
  };

  const addExpediente = (e) => {
    e.preventDefault();
    if (!expedienteForm.caratula) return;
    const clienteObj = clientes.find(c => c.id.toString() === expedienteForm.clienteId);
    setExpedientes([...expedientes, { ...expedienteForm, id: Date.now(), clienteNombre: clienteObj ? clienteObj.nombre : 'Rentas / Estado' }]);
    setExpedienteForm({ caratula: '', numero: '', tipoCausa: 'Judicial', fuero: 'Civil y Comercial', juzgado: '', estado: 'En Tramite', fechaAudiencia: '', clienteId: '', abogadoAsignado: '' });
  };

  const addTarea = (e) => {
    e.preventDefault();
    if (!tareaForm.titulo || !tareaForm.fechaVencimiento) return;
    setTareas([...tareas, { ...tareaForm, id: Date.now(), completada: false }]);
    setTareaForm({ titulo: '', fechaVencimiento: '', expedienteId: '', responsableMail: '' });
  };

  const expedientesJudiciales = expedientes.filter(e => e.tipoCausa === 'Judicial');
  const expedientesExtrajudiciales = expedientes.filter(e => e.tipoCausa === 'Extrajudicial');

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#000000', color: '#e2e8f0', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', backgroundColor: '#0a0a0a', borderRadius: '16px', padding: '28px', border: '1px solid #1a1a1a', boxShadow: '0 20px 40px rgba(0,0,0,0.9)' }}>
        
        {/* LOGO M&M Y ENCABEZADO */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '18px', borderBottom: '1px solid #1a1a1a', paddingBottom: '20px', marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#000000', border: '2px solid #282828', width: '64px', height: '64px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900', letterSpacing: '-4px', paddingRight: '4px', boxShadow: '0 4px 12px rgba(255,107,0,0.15)' }}>
            <span style={{ color: '#ff6b00', zIndex: 1 }}>M</span>
            <span style={{ color: '#c0c0c0', marginLeft: '-10px', zIndex: 0 }}>M</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#ffffff', letterSpacing: '0.5px' }}>ESTUDIO JURÍDICO M&M</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#ff6b00', fontWeight: '600' }}>GESTIÓN JUDICIAL, EXTRAJUDICIAL Y RENTAS DE CÓRDOBA</p>
          </div>
        </header>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('judiciales')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'judiciales' ? '#ff6b00' : '#121212', color: activeTab === 'judiciales' ? '#ffffff' : '#888888', fontWeight: 'bold', cursor: 'pointer', minWidth: '140px' }}
          >
            ⚖️ Causas Judiciales ({expedientesJudiciales.length})
          </button>
          <button 
            onClick={() => setActiveTab('extrajudiciales')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'extrajudiciales' ? '#ff6b00' : '#121212', color: activeTab === 'extrajudiciales' ? '#ffffff' : '#888888', fontWeight: 'bold', cursor: 'pointer', minWidth: '140px' }}
          >
            🏛️ Extrajudiciales / Rentas ({expedientesExtrajudiciales.length})
          </button>
          <button 
            onClick={() => setActiveTab('tareas')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'tareas' ? '#ff6b00' : '#121212', color: activeTab === 'tareas' ? '#ffffff' : '#888888', fontWeight: 'bold', cursor: 'pointer', minWidth: '140px' }}
          >
            📅 Plazos y Tareas ({tareas.length})
          </button>
          <button 
            onClick={() => setActiveTab('clientes')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'clientes' ? '#ff6b00' : '#121212', color: activeTab === 'clientes' ? '#ffffff' : '#888888', fontWeight: 'bold', cursor: 'pointer', minWidth: '140px' }}
          >
            👤 Clientes ({clientes.length})
          </button>
        </nav>

        {/* SECCIÓN CAUSAS (JUDICIALES / EXTRAJUDICIALES) */}
        {(activeTab === 'judiciales' || activeTab === 'extrajudiciales') && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>
              ➕ Cargar {activeTab === 'judiciales' ? 'Causa Judicial' : 'Causa Extrajudicial / Rentas'}
            </h2>
            <form onSubmit={addExpediente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '32px', backgroundColor: '#111111', padding: '20px', borderRadius: '12px', border: '1px solid #222222' }}>
              <select value={expedienteForm.tipoCausa} onChange={e => setExpedienteForm({...expedienteForm, tipoCausa: e.target.value})} style={inputDarkStyle}>
                <option value="Judicial">Tipo: Causa Judicial</option>
                <option value="Extrajudicial">Tipo: Extrajudicial / Rentas Córdoba</option>
              </select>

              <input type="text" placeholder="Carátula / Deudor (ej: Rentas c/ Perez...)" value={expedienteForm.caratula} onChange={e => setExpedienteForm({...expedienteForm, caratula: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="N° Expediente / Matrícula / Cuit" value={expedienteForm.numero} onChange={e => setExpedienteForm({...expedienteForm, numero: e.target.value})} style={inputDarkStyle} />
              
              <select value={expedienteForm.fuero} onChange={e => setExpedienteForm({...expedienteForm, fuero: e.target.value})} style={inputDarkStyle}>
                <option value="Civil y Comercial">Fuero: Civil y Comercial</option>
                <option value="Tributario / Rentas">Fuero: Tributario / Rentas</option>
                <option value="Laboral">Fuero: Laboral</option>
                <option value="Familia">Fuero: Familia</option>
                <option value="Concursos y Quiebras">Fuero: Concursos y Quiebras</option>
              </select>

              <input type="text" placeholder="Juzgado / Repartición" value={expedienteForm.juzgado} onChange={e => setExpedienteForm({...expedienteForm, juzgado: e.target.value})} style={inputDarkStyle} />
              <input type="text" placeholder="Mail Abogado / Asignado" value={expedienteForm.abogadoAsignado} onChange={e => setExpedienteForm({...expedienteForm, abogadoAsignado: e.target.value})} style={inputDarkStyle} />

              <select value={expedienteForm.clienteId} onChange={e => setExpedienteForm({...expedienteForm, clienteId: e.target.value})} style={inputDarkStyle}>
                <option value="">Vincular con Cliente (opcional)...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>

              <input type="date" value={expedienteForm.fechaAudiencia} onChange={e => setExpedienteForm({...expedienteForm, fechaAudiencia: e.target.value})} style={inputDarkStyle} />

              <button type="submit" style={btnOrangeStyle}>Guardar en el Sistema</button>
            </form>

            <h3 style={{ fontSize: '16px', color: '#888888', marginBottom: '14px' }}>
              📋 {activeTab === 'judiciales' ? 'Listado de Causas Judiciales' : 'Listado de Causas Extrajudiciales (Rentas)'}
            </h3>
            {(activeTab === 'judiciales' ? expedientesJudiciales : expedientesExtrajudiciales).length === 0 ? (
              <p style={{ color: '#555555', fontStyle: 'italic' }}>No hay registros en esta categoría.</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {(activeTab === 'judiciales' ? expedientesJudiciales : expedientesExtrajudiciales).map(e => (
                  <div key={e.id} style={cardDarkStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '16px', color: '#ffffff' }}>{e.caratula}</strong>
                      <span style={{ backgroundColor: '#ff6b0022', color: '#ff6b00', border: '1px solid #ff6b0044', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>N° {e.numero || 'S/N'}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#aaaaaa', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span>⚖️ {e.fuero}</span>
                      <span>🏛️ {e.juzgado || 'Sin especificar'}</span>
                      <span>👤 Cliente: {e.clienteNombre}</span>
                      {e.abogadoAsignado && <span>✉️ {e.abogadoAsignado}</span>}
                      {e.fechaAudiencia && <span style={{ color: '#ff6b00' }}>📅 Vencimiento/Audiencia: {e.fechaAudiencia}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN PLAZOS Y TAREAS */}
        {activeTab === 'tareas' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>➕ Nueva Tarea o Vencimiento de Plazo</h2>
            <form onSubmit={addTarea} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px', backgroundColor: '#111111', padding: '20px', borderRadius: '12px', border: '1px solid #222222' }}>
              <input type="text" placeholder="Descripción de la tarea / Plazo" value={tareaForm.titulo} onChange={e => setTareaForm({...tareaForm, titulo: e.target.value})} style={inputDarkStyle} required />
              <input type="date" value={tareaForm.fechaVencimiento} onChange={e => setTareaForm({...tareaForm, fechaVencimiento: e.target.value})} style={inputDarkStyle} required />
              <input type="email" placeholder="Mail a notificar (Google Calendar)" value={tareaForm.responsableMail} onChange={e => setTareaForm({...tareaForm, responsableMail: e.target.value})} style={inputDarkStyle} />
              <button type="submit" style={btnOrangeStyle}>Agendar Plazo</button>
            </form>

            <h3 style={{ fontSize: '16px', color: '#888888', marginBottom: '14px' }}>📌 Plazos Pendientes</h3>
            {tareas.length === 0 ? <p style={{ color: '#555555', fontStyle: 'italic' }}>No hay tareas o plazos pendientes.</p> : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {tareas.map(t => (
                  <div key={t.id} style={cardDarkStyle}>
                    <strong style={{ color: '#ffffff' }}>{t.titulo}</strong>
                    <div style={{ fontSize: '13px', color: '#ff6b00', marginTop: '4px' }}>
                      📅 Vence: {t.fechaVencimiento} | ✉️ Notificar a: {t.responsableMail || 'Todos los mails'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN CLIENTES */}
        {activeTab === 'clientes' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>➕ Registrar Nuevo Cliente</h2>
            <form onSubmit={addCliente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px', backgroundColor: '#111111', padding: '20px', borderRadius: '12px', border: '1px solid #222222' }}>
              <input type="text" placeholder="Nombre completo" value={clienteForm.nombre} onChange={e => setClienteForm({...clienteForm, nombre: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="DNI / CUIT" value={clienteForm.dni} onChange={e => setClienteForm({...clienteForm, dni: e.target.value})} style={inputDarkStyle} required />
              <input type="text" placeholder="Teléfono / WhatsApp" value={clienteForm.telefono} onChange={e => setClienteForm({...clienteForm, telefono: e.target.value})} style={inputDarkStyle} />
              <input type="email" placeholder="Correo electrónico" value={clienteForm.email} onChange={e => setClienteForm({...clienteForm, email: e.target.value})} style={inputDarkStyle} />
              <button type="submit" style={btnOrangeStyle}>Guardar Cliente</button>
            </form>

            <h3 style={{ fontSize: '16px', color: '#888888', marginBottom: '14px' }}>👤 Padrón de Clientes</h3>
            {clientes.length === 0 ? <p style={{ color: '#555555', fontStyle: 'italic' }}>No hay clientes registrados.</p> : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {clientes.map(c => (
                  <div key={c.id} style={cardDarkStyle}>
                    <strong style={{ fontSize: '15px', color: '#ffffff' }}>{c.nombre}</strong> <span style={{ color: '#666666' }}>(DNI/CUIT: {c.dni})</span>
                    <div style={{ fontSize: '13px', color: '#aaaaaa', marginTop: '4px' }}>
                      📞 {c.telefono || 'Sin teléfono'} | ✉️ {c.email || 'Sin correo'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const inputDarkStyle = { backgroundColor: '#000000', border: '1px solid #282828', color: '#ffffff', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none' };
const btnOrangeStyle = { backgroundColor: '#ff6b00', color: '#ffffff', border: 'none', padding: '12px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', gridColumn: '1 / -1' };
const cardDarkStyle = { backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '10px', padding: '16px' };
