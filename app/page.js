'use client';

import React, { useState, useEffect } from 'react';
import LogoMM from '../components/LogoSWM';
import { supabase } from '../lib/supabase';

export default function AppCore() {
  // Estado de Navegación y Pantallas
  const [splash, setSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Búsqueda Global
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Configuración de Prioridades
  const [config, setConfig] = useState({
    diasRojo: 3,
    diasAmarillo: 7,
    googleCalendars: []
  });

  // Datos Persistentes
  const [clientes, setClientes] = useState([]);
  const [causasJ, setCausasJ] = useState([]);
  const [causasEJ, setCausasEJ] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [plazos, setPlazos] = useState([]);
  const [eventos, setEventos] = useState([]);

  // Estados de Formularios y Modales
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedCausa, setSelectedCausa] = useState(null);
  const [formNuevoCliente, setFormNuevoCliente] = useState({ nombre_razon_social: '', dni_cuit: '', telefono: '', email: '', domicilio: '', observaciones: '' });
  const [formNuevaCausa, setFormNuevaCausa] = useState({ cliente_id: '', numero_expediente: '', caratula: '', juzgado: '', secretaria: '', fuero: 'Civil y Comercial', localidad: '', provincia: 'Córdoba', estado: 'En Tramite' });

  // Carga Inicial
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 1800);
    cargarDatos();
    return () => clearTimeout(timer);
  }, []);

  const cargarDatos = async () => {
    try {
      const { data: dataClientes } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
      if (dataClientes) setClientes(dataClientes);

      const { data: dataCausasJ } = await supabase.from('causas_judiciales').select('*, clientes(nombre_razon_social)').order('created_at', { ascending: false });
      if (dataCausasJ) setCausasJ(dataCausasJ);

      const { data: dataTareas } = await supabase.from('tareas').select('*').order('fecha', { ascending: true });
      if (dataTareas) setTareas(dataTareas);

      const { data: dataPlazos } = await supabase.from('plazos').select('*').order('fecha_vencimiento', { ascending: true });
      if (dataPlazos) setPlazos(dataPlazos);
    } catch (err) {
      console.error("Error al cargar datos desde Supabase:", err);
    }
  };

  // Lógica de Alertas y Semáforo de Vencimientos
  const calcularUrgencia = (fechaVencimiento) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const venc = new Date(fechaVencimiento);
    venc.setHours(0, 0, 0, 0);

    const diferenciaDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) return { nivel: 'vencido', label: 'VENCIDO', color: 'bg-red-950 text-red-300 border-red-800' };
    if (diferenciaDias <= config.diasRojo) return { nivel: 'rojo', label: `Urgente (${diferenciaDias}d)`, color: 'bg-red-900/60 text-red-200 border-red-600' };
    if (diferenciaDias <= config.diasAmarillo) return { nivel: 'amarillo', label: `Atención (${diferenciaDias}d)`, color: 'bg-amber-900/60 text-amber-200 border-amber-600' };
    return { nivel: 'verde', label: `En plazo (${diferenciaDias}d)`, color: 'bg-emerald-900/60 text-emerald-200 border-emerald-600' };
  };

  // Buscador Global
  const ejecutarBusqueda = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    
    const query = q.toLowerCase();
    const resultClientes = clientes.filter(c => c.nombre_razon_social.toLowerCase().includes(query) || c.dni_cuit.includes(query)).map(item => ({ ...item, type: 'cliente' }));
    const resultCausas = causasJ.filter(cj => cj.caratula.toLowerCase().includes(query) || cj.numero_expediente.toLowerCase().includes(query)).map(item => ({ ...item, type: 'causa' }));
    
    setSearchResults([...resultClientes, ...resultCausas]);
  };

  // Crear Cliente
  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('clientes').insert([formNuevoCliente]).select();
    if (!error && data) {
      setClientes([data[0], ...clientes]);
      setFormNuevoCliente({ nombre_razon_social: '', dni_cuit: '', telefono: '', email: '', domicilio: '', observaciones: '' });
      alert('Cliente guardado exitosamente');
    }
  };

  // Crear Causa
  const handleGuardarCausa = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('causas_judiciales').insert([formNuevaCausa]).select('*, clientes(nombre_razon_social)');
    if (!error && data) {
      setCausasJ([data[0], ...causasJ]);
      setFormNuevaCausa({ cliente_id: '', numero_expediente: '', caratula: '', juzgado: '', secretaria: '', fuero: 'Civil y Comercial', localidad: '', provincia: 'Córdoba', estado: 'En Tramite' });
      alert('Causa agregada exitosamente');
    }
  };

  // Conexión Google Calendar
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
        <LogoMM size="large" className="animate-pulse" />
        <div className="mt-8 text-zinc-500 text-sm tracking-widest animate-bounce">
          Cargando Centro de Control...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* BARRA LATERAL (SIDEBAR) */}
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
              { id: 'tareas', label: 'Tareas', icon: '✅' },
              { id: 'causas_j', label: 'Causas Judiciales', icon: '⚖️' },
              { id: 'causas_ej', label: 'Causas Extrajudiciales', icon: '📋' },
              { id: 'clientes', label: 'Clientes', icon: '👥' },
              { id: 'configuracion', label: 'Opciones', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCliente(null); setSelectedCausa(null); }}
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

      {/* CONTENEDOR CENTRAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* ENCABEZADO / BUSCADOR GLOBAL */}
        <header className="h-16 bg-zinc-900/60 border-b border-zinc-800 px-6 flex items-center justify-between relative z-10 backdrop-blur">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Buscar por cliente, expediente, carátula, CUIT..."
              value={searchQuery}
              onChange={(e) => ejecutarBusqueda(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-sm rounded-lg pl-9 pr-4 py-1.5 text-zinc-200 focus:outline-none focus:border-orange-500"
            />
            <span className="absolute left-3 top-2 text-zinc-500 text-xs">🔍</span>
            
            {/* RESULTADOS BUSQUEDA EN TIEMPO REAL */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 top-10 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto p-2">
                {searchResults.map((res, i) => (
                  <div 
                    key={i}
                    onClick={() => {
                      if (res.type === 'cliente') { setSelectedCliente(res); setActiveTab('clientes'); }
                      if (res.type === 'causa') { setSelectedCausa(res); setActiveTab('causas_j'); }
                      setSearchResults([]);
                      setSearchQuery('');
                    }}
                    className="p-2 hover:bg-zinc-800 rounded cursor-pointer border-b border-zinc-800 text-xs"
                  >
                    <span className="font-bold text-orange-400 uppercase">{res.type}</span>
                    <p className="text-zinc-200 font-semibold">{res.nombre_razon_social || res.caratula}</p>
                    <p className="text-zinc-500">{res.dni_cuit || res.numero_expediente}</p>
                  </div>
                ))}
              </div>
            )}
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

        {/* VISTAS DINÁMICAS */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Bienvenido</h1>
                <p className="text-zinc-400 text-sm mt-1">Centro de Control de Actividad Profesional - Estudio MM</p>
              </div>

              {/* METRICAS RÁPIDAS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Audiencias Hoy</span>
                  <p className="text-2xl font-bold text-orange-500 mt-1">
                    {tareas.filter(t => t.fecha === new Date().toISOString().split('T')[0] && t.titulo.toLowerCase().includes('audiencia')).length}
                  </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Plazos Inminentes</span>
                  <p className="text-2xl font-bold text-red-400 mt-1">
                    {plazos.filter(p => calcularUrgencia(p.fecha_vencimiento).nivel === 'rojo').length}
                  </p>
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

              {/* BLOQUE PRINCIPAL: TAREAS DEL DÍA + PLAZOS A VENCER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* MIS TAREAS DE HOY */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                      <span>✅</span> Mis tareas de hoy
                    </h2>
                    <button 
                      onClick={() => setActiveTab('tareas')}
                      className="text-xs text-orange-500 hover:underline font-medium"
                    >
                      + Nueva Tarea
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto">
                    {tareas.filter(t => t.fecha === new Date().toISOString().split('T')[0]).length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4 text-center">No hay tareas agendadas para el día de hoy.</p>
                    ) : (
                      tareas.filter(t => t.fecha === new Date().toISOString().split('T')[0]).map(t => (
                        <div key={t.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-zinc-200">{t.titulo}</p>
                            <span className="text-[10px] text-zinc-500">{t.hora} hs • {t.prioridad}</span>
                          </div>
                          <button 
                            onClick={async () => {
                              await supabase.from('tareas').update({ estado: 'Completada' }).eq('id', t.id);
                              cargarDatos();
                            }}
                            className="text-xs bg-zinc-800 hover:bg-emerald-950 text-zinc-300 hover:text-emerald-400 px-2.5 py-1 rounded border border-zinc-700"
                          >
                            Concluir
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* PLAZOS A VENCER (CON SEMÁFORO DE PRIORIDADES) */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                  <div className="border-b border-zinc-800 pb-3">
                    <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                      <span>🔴</span> Plazos a vencer
                    </h2>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto">
                    {plazos.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4 text-center">Sin vencimientos computados.</p>
                    ) : (
                      plazos.map(p => {
                        const urg = calcularUrgencia(p.fecha_vencimiento);
                        return (
                          <div key={p.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-zinc-200">{p.descripcion}</p>
                              <span className="text-[10px] text-zinc-500">Vence: {p.fecha_vencimiento}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${urg.color}`}>
                              {urg.label}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. AGENDA E INTEGRACIÓN GOOGLE CALENDAR */}
          {activeTab === 'agenda' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h1 className="text-2xl font-bold">Agenda de Turnos y Audiencias</h1>
                  <p className="text-xs text-zinc-400">Sincronización con Google Calendar y plazos del estudio.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-zinc-200">Agendar Evento Directo</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    sincronizarGoogleCalendar(
                      fd.get('titulo'),
                      fd.get('fecha'),
                      fd.get('hora'),
                      fd.get('detalle')
                    );
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="titulo" required placeholder="Asunto o Audiencia" className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                    <input name="fecha" type="date" required className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                    <input name="hora" type="time" defaultValue="09:00" className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                    <input name="detalle" placeholder="Expediente / Observaciones" className="bg-zinc-950 border border-zinc-700 p-2 rounded text-xs text-white" />
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold p-2.5 rounded text-xs transition">
                    📅 Guardar y Sincronizar en Google Calendar
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. SECCIÓN CLIENTES Y FICHA INDIVIDUAL */}
          {activeTab === 'clientes' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
                <p className="text-xs text-zinc-400">Alta, consulta y legajo completo por cliente.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ALTA CLIENTE */}
                <form onSubmit={handleGuardarCliente} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                  <h3 className="font-bold text-sm text-orange-500">Nuevo Cliente</h3>
                  <input placeholder="Nombre / Razón Social" required value={formNuevoCliente.nombre_razon_social} onChange={e => setFormNuevoCliente({...formNuevoCliente, nombre_razon_social: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-2 rou
