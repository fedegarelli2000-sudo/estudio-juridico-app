'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('clientes');
  const [clientes, setClientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);

  // Form Estados
  const [clienteForm, setClienteForm] = useState({ nombre: '', dni: '', telefono: '', email: '' });
  const [expedienteForm, setExpedienteForm] = useState({ caratula: '', numero: '', fuero: '', clienteId: '' });

  const addCliente = (e) => {
    e.preventDefault();
    if (!clienteForm.nombre || !clienteForm.dni) return;
    setClientes([...clientes, { ...clienteForm, id: Date.now() }]);
    setClienteForm({ nombre: '', dni: '', telefono: '', email: '' });
  };

  const addExpediente = (e) => {
    e.preventDefault();
    if (!expedienteForm.caratula || !expedienteForm.numero) return;
    const clienteObj = clientes.find(c => c.id.toString() === expedienteForm.clienteId);
    setExpedientes([...expedientes, { ...expedienteForm, id: Date.now(), clienteNombre: clienteObj ? clienteObj.nombre : 'Sin asignar' }]);
    setExpedienteForm({ caratula: '', numero: '', fuero: '', clienteId: '' });
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <header style={{ borderBottom: '2px solid #eef2f5', paddingBottom: '16px', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2530' }}>⚖️ Estudio Jurídico - Panel de Gestión</h1>
        </header>

        {/* Navegación */}
        <nav style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveTab('clientes')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'clientes' ? '#1e40af' : '#e2e8f0', color: activeTab === 'clientes' ? '#fff' : '#334155', fontWeight: 'bold', cursor: 'pointer' }}
          >
            👤 Clientes ({clientes.length})
          </button>
          <button 
            onClick={() => setActiveTab('expedientes')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'expedientes' ? '#1e40af' : '#e2e8f0', color: activeTab === 'expedientes' ? '#fff' : '#334155', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📁 Expedientes ({expedientes.length})
          </button>
        </nav>

        {/* Seccion Clientes */}
        {activeTab === 'clientes' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#334155' }}>Registrar Nuevo Cliente</h2>
            <form onSubmit={addCliente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <input type="text" placeholder="Nombre completo" value={clienteForm.nombre} onChange={e => setClienteForm({...clienteForm, nombre: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="DNI / CUIT" value={clienteForm.dni} onChange={e => setClienteForm({...clienteForm, dni: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="Teléfono" value={clienteForm.telefono} onChange={e => setClienteForm({...clienteForm, telefono: e.target.value})} style={inputStyle} />
              <input type="email" placeholder="Correo electrónico" value={clienteForm.email} onChange={e => setClienteForm({...clienteForm, email: e.target.value})} style={inputStyle} />
              <button type="submit" style={btnStyle}>Guardar Cliente</button>
            </form>

            <h3 style={{ fontSize: '16px', color: '#475569' }}>Listado de Clientes</h3>
            {clientes.length === 0 ? <p style={{ color: '#94a3b8' }}>No hay clientes registrados.</p> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {clientes.map(c => (
                  <li key={c.id} style={cardStyle}>
                    <strong>{c.nombre}</strong> (DNI: {c.dni}) — 📞 {c.telefono || 'Sin tel'} | ✉️ {c.email || 'Sin email'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Seccion Expedientes */}
        {activeTab === 'expedientes' && (
          <div>
            <h2 style={{ fontSize: '18px', color: '#334155' }}>Cargar Nuevo Expediente</h2>
            <form onSubmit={addExpediente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <input type="text" placeholder="Carátula del caso" value={expedienteForm.caratula} onChange={e => setExpedienteForm({...expedienteForm, caratula: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="N° de Expediente / Año" value={expedienteForm.numero} onChange={e => setExpedienteForm({...expedienteForm, numero: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="Fuero / Juzgado" value={expedienteForm.fuero} onChange={e => setExpedienteForm({...expedienteForm, fuero: e.target.value})} style={inputStyle} />
              <select value={expedienteForm.clienteId} onChange={e => setExpedienteForm({...expedienteForm, clienteId: e.target.value})} style={inputStyle}>
                <option value="">Vincular a cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <button type="submit" style={btnStyle}>Guardar Expediente</button>
            </form>

            <h3 style={{ fontSize: '16px', color: '#475569' }}>Listado de Expedientes</h3>
            {expedientes.length === 0 ? <p style={{ color: '#94a3b8' }}>No hay expedientes cargados.</p> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {expedientes.map(e => (
                  <li key={e.id} style={cardStyle}>
                    <strong>{e.caratula}</strong> (Expte: {e.numero})<br/>
                    <small style={{ color: '#64748b' }}>Fuero: {e.fuero || 'N/A'} | Cliente: {e.clienteNombre}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = { padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' };
const btnStyle = { padding: '10px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#059669', color: '#fff', fontWeight: 'bold', cursor: 'pointer', gridColumn: '1 / -1' };
const cardStyle = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '8px', fontSize: '14px' };
