'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

export default function AppCore() {
  const [splash, setSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [causasJ, setCausasJ] = useState([]);
  const [tareas, setTareas] = useState([]);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formNuevoCliente, setFormNuevoCliente] = useState({ nombre_razon_social: '', dni_cuit: '', telefono: '', email: '', domicilio: '', observaciones: '' });
  const [formNuevaCausa, setFormNuevaCausa] = useState({ cliente_id: '', numero_expediente: '', caratula: '', juzgado: '', secretaria: '', fuero: 'Civil y Comercial', localidad: '', provincia: 'Córdoba', estado: 'En Tramite' });

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 1500);
    cargarDatos();
    return () => clearTimeout(timer);
  }, []);

  const cargarDatos = async () => {
    try {
      if (!supabase) return;
      const { data: dataClientes } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
      if (dataClientes) setClientes(dataClientes);

      const { data: dataCausasJ } = await supabase.from('causas_judiciales').select('*, clientes(nombre_razon_social)').order('created_at', { ascending: false });
      if (dataCausasJ) setCausasJ(dataCausasJ);
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  const ejecutarBusqueda = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    
    const query = q.toLowerCase();
    const resultClientes = clientes.filter(c => c.nombre_razon_social.toLowerCase().includes(query) || c.dni_cuit.includes(query)).map(item => ({ ...item, type: 'cliente' }));
    const resultCausas = causasJ.filter(cj => cj.caratula.toLowerCase().includes(query) || cj.numero_expediente.toLowerCase().includes(query)).map(item => ({ ...item, type: 'causa' }));
    
    setSearchResults([...resultClientes, ...resultCausas]);
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const { data, error } = await supabase.from('clientes').insert([formNuevoCliente]).select();
    if (!error && data) {
      setClientes([data[0], ...clientes]);
      setFormNuevoCliente({ nombre_razon_social: '', dni_cuit: '', telefono: '', email: '', domicilio: '', observaciones: '' });
      alert('Cliente guardado exitosamente');
    }
  };

  const handleGuardarCausa = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const { data, error } = await supabase.from('causas_judiciales').insert([formNuevaCausa]).select('*, clientes(nombre_razon_social)');
    if (!error && data) {
      setCausasJ([data[0], ...causasJ]);
      setFormNuevaCausa({ cliente_id: '', numero_expediente: '', caratula: '', juzgado: '', secretaria: '', fuero: 'Civil y Comercial', localidad: '', provincia: 'Córdoba', estado: 'En Tramite' });
      alert('Causa agregada exitosamente');
    }
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
      <div className="h-screen w-screen bg-zinc-950 flex flex-col justify-center items-center">
        <LogoMM size="large" />
        <div className="mt-8 text-zinc-500 text-sm tracking-widest animate-pulse">
          Cargando Centro de Control...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex flex-col justify-between p-4 z-20`}>
        <div>
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen ? <LogoMM size="small" /> : <div className="font-bold text-orange-500 text-xl">MM</div>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'agenda', label: 'Agenda', icon: '📅' },
              { id: 'causas_j', label: 'Causas Judiciales', icon: '⚖️' },
              { id: 'clientes', label: 'Clientes', icon: '👥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCliente(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-orange-600/20 text-orange-500 border border-orange-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}
              >
                <span className="text-lg">{tab.icon}</span>
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        
        {sidebarOpen && (
          <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
            Estudio MM • Gestión Jurídica
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-zinc-900/60 border-b border-zinc-800 px-6 flex items-center justify-between relative z-10 backdrop-blur">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Buscar cliente, causa, CUIT..."
              value={searchQuery}
              onChange={(e) => ejecutarBusqueda(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-sm rounded-lg pl-9 pr-4 py-1.5 text-zinc-200 focus:outline-none focus:border-orange-500"
            />
            <span className="absolute left-3 top-2 text-zinc-500 text-xs">🔍</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-full border border-orange-500/20 font-medium">
              Río Cuarto, Argentina
            </span>
            <div className="w-8 h-8 rounded-full bg-orange-600 text-black font-bold flex items-center justify-center">
              MM
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Bienvenido</h1>
                <p className="text-zinc-400 text-sm mt-1">Centro de Control - Estudio MM</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Audiencias Hoy</span>
                  <p className="text-2xl font-bold text-orange-500 mt-1">0</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Causas Activas</span>
                  <p className="text-2xl font-bold text-zinc-100 mt-1">{causasJ.length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Clientes Registrados</span>
                  <p className="text-2xl font-bold text-zinc-100 mt-1">{clientes.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold">Agenda de Turnos y Audiencias</h1>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-zinc-200">Agendar Evento Directo</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    sincronizarGoogleCalendar(fd.get('titulo'), fd.get('fecha'), fd.get('hora'), fd.get('detalle'));
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="titulo" required placeholder="Asunto / Audiencia" className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                    <input name="fecha" type="date" required className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                    <input name="hora" type="time" defaultValue="09:00" className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                    <input name="detalle" placeholder="Observaciones" className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold p-2.5 rounded text-xs transition">
                    📅 Guardar y Sincronizar en Google Calendar
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'clientes' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={handleGuardarCliente} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                  <h3 className="font-bold text-sm text-orange-500">Nuevo Cliente</h3>
                  <input placeholder="Nombre / Razón Social" required value={formNuevoCliente.nombre_razon_social} onChange={e => setFormNuevoCliente({...formNuevoCliente, nombre_razon_social: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                  <input placeholder="DNI / CUIT" required value={formNuevoCliente.dni_cuit} onChange={e => setFormNuevoCliente({...formNuevoCliente, dni_cuit: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                  <input placeholder="Teléfono" value={formNuevoCliente.telefono} onChange={e => setFormNuevoCliente({...formNuevoCliente, telefono: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                  <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-black font-bold p-2 rounded text-xs">Guardar Cliente</button>
                </form>

                <div className="lg:col-span-2 space-y-2">
                  {clientes.map(c => (
                    <div key={c.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-zinc-100">{c.nombre_razon_social}</p>
                        <p className="text-xs text-zinc-500">CUIT/DNI: {c.dni_cuit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'causas_j' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold">Causas Judiciales</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={handleGuardarCausa} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                  <h3 className="font-bold text-sm text-orange-500">Nueva Causa Judicial</h3>
                  <select required value={formNuevaCausa.cliente_id} onChange={e => setFormNuevaCausa({...formNuevaCausa, cliente_id: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white">
                    <option value="">-- Seleccionar Cliente --</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_razon_social}</option>)}
                  </select>
                  <input placeholder="N° Expediente" required value={formNuevaCausa.numero_expediente} onChange={e => setFormNuevaCausa({...formNuevaCausa, numero_expediente: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                  <input placeholder="Carátula" required value={formNuevaCausa.caratula} onChange={e => setFormNuevaCausa({...formNuevaCausa, caratula: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                  <button type="submit" className="w-full bg-orange-600 text-black font-bold p-2 rounded text-xs">Cargar Causa</button>
                </form>

                <div className="lg:col-span-2 space-y-2">
                  {causasJ.map(cj => (
                    <div key={cj.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <p className="text-sm font-bold text-zinc-100">{cj.caratula}</p>
                      <p className="text-xs text-zinc-500">Expte: {cj.numero_expediente}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
