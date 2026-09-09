'use client';

import React, { useState, useEffect } from 'react';

function LogoMM({ size = 'medium' }) {
  const dimensions = {
    small: { width: 100, height: 35, fontSize: '20px' },
    medium: { width: 150, height: 50, fontSize: '28px' },
    large: { width: 220, height: 70, fontSize: '42px' }
  }[size] || { width: 150, height: 50, fontSize: '28px' };

  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        width={dimensions.width / 2}
        height={dimensions.height}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 70 L 10 20 L 30 50 L 50 20 L 50 70"
          stroke="#9CA3AF"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        />
        <path
          d="M 35 70 L 35 20 L 55 50 L 75 20 L 75 70"
          stroke="#FF6B00"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col">
        <span 
          className="font-extrabold tracking-widest leading-none text-zinc-100"
          style={{ fontSize: dimensions.fontSize }}
        >
          MM
        </span>
        <span className="text-[9px] tracking-widest text-orange-500 uppercase font-semibold mt-1">
          Estudio Jurídico
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [splash, setSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [clientes, setClientes] = useState([]);
  const [causasJ, setCausasJ] = useState([]);

  const [formNuevoCliente, setFormNuevoCliente] = useState({ nombre_razon_social: '', dni_cuit: '', telefono: '' });
  const [formNuevaCausa, setFormNuevaCausa] = useState({ cliente_id: '', numero_expediente: '', caratula: '' });

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleGuardarCliente = (e) => {
    e.preventDefault();
    const nuevo = { ...formNuevoCliente, id: Date.now() };
    setClientes([nuevo, ...clientes]);
    setFormNuevoCliente({ nombre_razon_social: '', dni_cuit: '', telefono: '' });
  };

  const handleGuardarCausa = (e) => {
    e.preventDefault();
    const nueva = { ...formNuevaCausa, id: Date.now() };
    setCausasJ([nueva, ...causasJ]);
    setFormNuevaCausa({ cliente_id: '', numero_expediente: '', caratula: '' });
  };

  const sincronizarGoogleCalendar = (titulo, fecha, hora, detalle) => {
    const startDateTime = new Date(`${fecha}T${hora}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const formatGCalDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const datesParam = `${formatGCalDate(startDateTime)}/${formatGCalDate(endDateTime)}`;
    const titleFormatted = encodeURIComponent(titulo);
    const detailsFormatted = encodeURIComponent(detalle || '');

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleFormatted}&dates=${datesParam}&details=${detailsFormatted}`;
    window.open(gcalUrl, '_blank');
  };

  if (splash) {
    return (
      <div style={{ height: '100vh', width: '100vw', backgroundColor: '#09090b', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <svg width="60" height="40" viewBox="0 0 100 80" fill="none">
            <path d="M 10 70 L 10 20 L 30 50 L 50 20 L 50 70" stroke="#9CA3AF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 35 70 L 35 20 L 55 50 L 75 20 L 75 70" stroke="#FF6B00" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '36px', fontWeight: 'bold' }}>MM</span>
        </div>
        <p style={{ marginTop: '16px', color: '#71717a', fontSize: '14px', textAlign: 'center' }}>Cargando Centro de Control...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#09090b', color: '#f4f4f5', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? '240px' : '70px', backgroundColor: '#18181b', borderRight: '1px solid #27272a', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            {sidebarOpen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="40" height="25" viewBox="0 0 100 80" fill="none">
                  <path d="M 10 70 L 10 20 L 30 50 L 50 20 L 50 70" stroke="#9CA3AF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 35 70 L 35 20 L 55 50 L 75 20 L 75 70" stroke="#FF6B00" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>MM</span>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'agenda', label: 'Agenda', icon: '📅' },
              { id: 'causas_j', label: 'Causas Judiciales', icon: '⚖️' },
              { id: 'clientes', label: 'Clientes', icon: '👥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: 'left',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: activeTab === tab.id ? '#27272a' : 'transparent',
                  color: activeTab === tab.id ? '#ff6b00' : '#a1a1aa'
                }}
              >
                {tab.icon} {sidebarOpen && tab.label}
              </button>
            ))}
          </nav>
        </div>

        {sidebarOpen && (
          <div style={{ borderTop: '1px solid #27272a', paddingTop: '12px', fontSize: '12px', color: '#71717a' }}>
            Estudio MM • Gestión Jurídica
          </div>
        )}
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header style={{ height: '64px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <input
            type="text"
            placeholder="Buscar cliente, causa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '320px', backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}
          />
          <div style={{ fontSize: '12px', color: '#ff6b00', fontWeight: 'bold' }}>
            Río Cuarto, Argentina
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px', backgroundColor: '#09090b', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <div style={{ maxWidth: '900px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Bienvenido</h1>
              <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '24px' }}>Centro de Control - Estudio MM</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Audiencias Hoy</span>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b00', margin: '8px 0 0 0' }}>0</p>
                </div>
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Causas Activas</span>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '8px 0 0 0' }}>{causasJ.length}</p>
                </div>
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Clientes Registrados</span>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '8px 0 0 0' }}>{clientes.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div style={{ maxWidth: '700px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Agenda y Vencimientos</h1>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  sincronizarGoogleCalendar(fd.get('titulo'), fd.get('fecha'), fd.get('hora'), fd.get('detalle'));
                }}
                style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <h3 style={{ margin: 0, fontSize: '16px' }}>Agendar Evento Directo</h3>
                <input name="titulo" required placeholder="Asunto / Audiencia" style={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input name="fecha" type="date" required style={{ flex: 1, backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                  <input name="hora" type="time" defaultValue="09:00" style={{ flex: 1, backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                </div>
                <input name="detalle" placeholder="Observaciones" style={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                <button type="submit" style={{ backgroundColor: '#ff6b00', color: '#000', fontWeight: 'bold', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' }}>
                  📅 Guardar y Sincronizar en Google Calendar
                </button>
              </form>
            </div>
          )}

          {activeTab === 'clientes' && (
            <div style={{ maxWidth: '800px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Gestión de Clientes</h1>
              <form onSubmit={handleGuardarCliente} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="Nombre / Razón Social" required value={formNuevoCliente.nombre_razon_social} onChange={e => setFormNuevoCliente({...formNuevoCliente, nombre_razon_social: e.target.value})} style={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                <input placeholder="DNI / CUIT" required value={formNuevoCliente.dni_cuit} onChange={e => setFormNuevoCliente({...formNuevoCliente, dni_cuit: e.target.value})} style={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                <button type="submit" style={{ backgroundColor: '#fff', color: '#000', fontWeight: 'bold', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar Cliente</button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {clientes.map(c => (
                  <div key={c.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '12px', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{c.nombre_razon_social}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#a1a1aa' }}>CUIT/DNI: {c.dni_cuit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'causas_j' && (
            <div style={{ maxWidth: '800px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Causas Judiciales</h1>
              <form onSubmit={handleGuardarCausa} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="N° Expediente" required value={formNuevaCausa.numero_expediente} onChange={e => setFormNuevaCausa({...formNuevaCausa, numero_expediente: e.target.value})} style={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                <input placeholder="Carátula" required value={formNuevaCausa.caratula} onChange={e => setFormNuevaCausa({...formNuevaCausa, caratula: e.target.value})} style={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#fff', padding: '8px', borderRadius: '4px' }} />
                <button type="submit" style={{ backgroundColor: '#ff6b00', color: '#000', fontWeight: 'bold', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cargar Causa</button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {causasJ.map(cj => (
                  <div key={cj.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '12px', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{cj.caratula}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#a1a1aa' }}>Expte: {cj.numero_expediente}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
