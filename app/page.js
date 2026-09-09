'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- ESTADOS INTERACTIVOS PERSISTENTES (Carga inicial o localStorage) ---
  const [teamEmails, setTeamEmails] = useState(['', '', '', '']);
  const [cases, setCases] = useState([
    {
      id: '1',
      number: 'EXP-9821/2026',
      caratula: 'García, Roberto c/ Aseguradora del Sur S.A. s/ Daños',
      court: 'Juzgado Civil y Comercial Nº 12',
      client: 'Roberto García',
      status: 'EN TRAMITE',
      notes: 'Cliente prefiere contacto por correo por la tarde.'
    }
  ]);
  
  const [clients, setClients] = useState([
    { id: '1', name: 'Roberto García', role: 'CLIENTE', taxId: '20-34881920-8', email: 'roberto@email.com' },
    { id: '2', name: 'Aseguradora del Sur S.A.', role: 'CONTRAPARTE', taxId: '30-50112233-4', email: 'legales@aseguradora.com' }
  ]);

  const [movements, setMovements] = useState([
    { id: '1', caseId: '1', date: '2026-09-09', title: 'Cédula de Traslado', text: 'Se concede traslado por el término de ley.', notes: 'Revisar con perito antes del vencimiento.' }
  ]);

  const [deadlines, setDeadlines] = useState([
    { id: '1', caseId: '1', title: 'Contestar Traslado', dueDate: '2026-09-16', days: 5, status: 'PENDIENTE', isAI: true }
  ]);

  const [hearings, setHearings] = useState([
    { id: '1', caseId: '1', title: 'Audiencia Preliminar', date: '2026-09-18T10:00', location: 'Juzgado Civil Nº 12', assignedMail: '' }
  ]);

  // Carga inicial de datos guardados en el navegador
  useEffect(() => {
    const savedEmails = localStorage.getItem('lex_emails');
    const savedCases = localStorage.getItem('lex_cases');
    const savedClients = localStorage.getItem('lex_clients');
    const savedMovements = localStorage.getItem('lex_movements');
    const savedDeadlines = localStorage.getItem('lex_deadlines');
    const savedHearings = localStorage.getItem('lex_hearings');

    if (savedEmails) setTeamEmails(JSON.parse(savedEmails));
    if (savedCases) setCases(JSON.parse(savedCases));
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedMovements) setMovements(JSON.parse(savedMovements));
    if (savedDeadlines) setDeadlines(JSON.parse(savedDeadlines));
    if (savedHearings) setHearings(JSON.parse(savedHearings));
  }, []);

  // Guardar en localStorage ante cada cambio
  useEffect(() => {
    localStorage.setItem('lex_emails', JSON.stringify(teamEmails));
    localStorage.setItem('lex_cases', JSON.stringify(cases));
    localStorage.setItem('lex_clients', JSON.stringify(clients));
    localStorage.setItem('lex_movements', JSON.stringify(movements));
    localStorage.setItem('lex_deadlines', JSON.stringify(deadlines));
    localStorage.setItem('lex_hearings', JSON.stringify(hearings));
  }, [teamEmails, cases, clients, movements, deadlines, hearings]);

  // --- FORMULARIOS DE ALTA RAPIDA ---
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '' });
  const [newMovement, setNewMovement] = useState({ caseId: '1', date: '', title: '', text: '', notes: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '1', title: '', dueDate: '', days: 5 });
  const [newHearing, setNewHearing] = useState({ caseId: '1', title: '', date: '', location: '', assignedMail: '' });

  // Manejadores de envío
  const handleAddCase = (e) => {
    e.preventDefault();
    if (!newCase.number || !newCase.caratula) return;
    setCases([...cases, { ...newCase, id: Date.now().toString(), status: 'EN TRAMITE' }]);
    setNewCase({ number: '', caratula: '', court: '', client: '', notes: '' });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    setClients([...clients, { ...newClient, id: Date.now().toString() }]);
    setNewClient({ name: '', role: 'CLIENTE', taxId: '', email: '' });
  };

  const handleAddMovement = (e) => {
    e.preventDefault();
    if (!newMovement.title) return;
    setMovements([...movements, { ...newMovement, id: Date.now().toString() }]);
    setNewMovement({ caseId: cases[0]?.id || '1', date: '', title: '', text: '', notes: '' });
  };

  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!newDeadline.title) return;
    setDeadlines([...deadlines, { ...newDeadline, id: Date.now().toString(), status: 'PENDIENTE', isAI: false }]);
    setNewDeadline({ caseId: cases[0]?.id || '1', title: '', dueDate: '', days: 5 });
  };

  const handleAddHearing = (e) => {
    e.preventDefault();
    if (!newHearing.title) return;
    setHearings([...hearings, { ...newHearing, id: Date.now().toString() }]);
    setNewHearing({ caseId: cases[0]?.id || '1', title: '', date: '', location: '', assignedMail: '' });
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      
      {/* 1. BARRA LATERAL CON LOGO MM Y DISEÑO NEGRO/NARANJA */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          {/* LOGO MM */}
          <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
            <div className="flex items-center text-2xl font-black tracking-tighter">
              <span className="text-orange-500">M</span>
              <span className="text-zinc-500">M</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-sm uppercase tracking-wider">LexStudio</h1>
              <p className="text-[10px] text-orange-500 font-semibold">GESTIÓN LEGAL INTEGRAL</p>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard General', icon: '📊' },
              { id: 'expedientes', label: 'Expedientes / Causas', icon: '📁' },
              { id: 'movimientos', label: 'Movimientos e Historia', icon: '📜' },
              { id: 'plazos', label: 'Plazos Procesales e IA', icon: '⚡' },
              { id: 'clientes', label: 'Clientes y Contactos', icon: '👥' },
              { id: 'audiencias', label: 'Audiencias y Calendar', icon: '📅' },
              { id: 'configuracion', label: 'Configuración / Mails', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-black font-bold shadow-lg shadow-orange-500/20'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-orange-400'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
          <p className="font-bold text-zinc-300">Estudio Jurídico MM</p>
          <p className="text-[10px]">Sistema Operativo Activo</p>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* ENCABEZADO */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase">
            {activeTab.replace('_', ' ')}
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs text-zinc-400 font-medium">Modo Base de Datos Funcional</span>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL RECARGABLE */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          
          {/* --- DASHBOARD --- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Causas Activas</span>
                  <h3 className="text-2xl font-black text-white mt-1">{cases.length}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Plazos Pendientes</span>
                  <h3 className="text-2xl font-black text-orange-500 mt-1">{deadlines.filter(d => d.status === 'PENDIENTE').length}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Clientes Registrados</span>
                  <h3 className="text-2xl font-black text-white mt-1">{clients.length}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Audiencias Agendadas</span>
                  <h3 className="text-2xl font-black text-white mt-1">{hearings.length}</h3>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-orange-500 uppercase mb-3">Próximos Plazos a Vencer</h3>
                <div className="space-y-2">
                  {deadlines.map(d => (
                    <div key={d.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{d.title}</p>
                        <p className="text-[10px] text-zinc-500">Vence: {d.dueDate}</p>
                      </div>
                      <span className="bg-orange-500/10 text-orange-400 font-bold px-2 py-1 rounded text-[10px] border border-orange-500/20">
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- EXPEDIENTES / CAUSAS --- */}
          {activeTab === 'expedientes' && (
            <div className="space-y-6">
              {/* Formulario de Alta */}
              <form onSubmit={handleAddCase} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agregar Nueva Causa / Expediente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input 
                    type="text" placeholder="Nº de Expediente (ej. EXP-1002/2026)" 
                    value={newCase.number} onChange={e => setNewCase({...newCase, number: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="text" placeholder="Carátula completa" 
                    value={newCase.caratula} onChange={e => setNewCase({...newCase, caratula: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="text" placeholder="Juzgado / Tribunal" 
                    value={newCase.court} onChange={e => setNewCase({...newCase, court: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="text" placeholder="Cliente asociado" 
                    value={newCase.client} onChange={e => setNewCase({...newCase, client: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                </div>
                <textarea 
                  placeholder="Observaciones o notas manuales sobre el expediente..."
                  value={newCase.notes} onChange={e => setNewCase({...newCase, notes: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-20"
                />
                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400 transition-colors">
                  Guardar Expediente
                </button>
              </form>

              {/* Lista de Causas */}
              <div className="space-y-3">
                {cases.map(c => (
                  <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-orange-500/10 text-orange-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/20">
                          {c.number}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{c.caratula}</h4>
                        <p className="text-xs text-zinc-400">{c.court} • Cliente: {c.client}</p>
                      </div>
                      <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded">{c.status}</span>
                    </div>
                    {c.notes && (
                      <p className="text-xs bg-zinc-950 p-2.5 rounded border border-zinc-800/50 text-zinc-300 italic">
                        💬 <strong>Notas:</strong> {c.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- MOVIMIENTOS --- */}
          {activeTab === 'movimientos' && (
            <div className="space-y-6">
              <form onSubmit={handleAddMovement} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Nuevo Movimiento / Actuación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <select 
                    value={newMovement.caseId} onChange={e => setNewMovement({...newMovement, caseId: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  >
                    {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                  </select>
                  <input 
                    type="date" value={newMovement.date} onChange={e => setNewMovement({...newMovement, date: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                </div>
                <input 
                  type="text" placeholder="Título de la actuación (Ej. Presenta Escrito / Cédula)" 
                  value={newMovement.title} onChange={e => setNewMovement({...newMovement, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500"
                />
                <textarea 
                  placeholder="Transcripción del texto judicial o detalle..."
                  value={newMovement.text} onChange={e => setNewMovement({...newMovement, text: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-20"
                />
                <textarea 
                  placeholder="Observaciones manuales del abogado..."
                  value={newMovement.notes} onChange={e => setNewMovement({...newMovement, notes: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-16"
                />
                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                  Guardar Movimiento
                </button>
              </form>

              <div className="space-y-3">
                {movements.map(m => (
                  <div key={m.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-orange-400">{m.title}</span>
                      <span className="text-zinc-500">{m.date}</span>
                    </div>
                    {m.text && <p className="text-zinc-300 bg-zinc-950 p-2.5 rounded border border-zinc-800">{m.text}</p>}
                    {m.notes && <p className="text-zinc-400 italic">📝 Observación: {m.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- PLAZOS E IA --- */}
          {activeTab === 'plazos' && (
            <div className="space-y-6">
              <form onSubmit={handleAddDeadline} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase">+ Cargar Plazo Procesal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <input 
                    type="text" placeholder="Descripción del Plazo" 
                    value={newDeadline.title} onChange={e => setNewDeadline({...newDeadline, title: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="date" value={newDeadline.dueDate} onChange={e => setNewDeadline({...newDeadline, dueDate: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="number" placeholder="Cantidad de días" 
                    value={newDeadline.days} onChange={e => setNewDeadline({...newDeadline, days: parseInt(e.target.value)})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                </div>
                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                  Registrar Plazo
                </button>
              </form>

              <div className="space-y-3">
                {deadlines.map(d => (
                  <div key={d.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      {d.isAI && <span className="bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded text-[10px] mb-1 inline-block">Sugerido por IA</span>}
                      <h4 className="font-bold text-white">{d.title}</h4>
                      <p className="text-zinc-500">Vencimiento: {d.dueDate} ({d.days} días hábiles)</p>
                    </div>
                    <button 
                      onClick={() => setDeadlines(deadlines.map(x => x.id === d.id ? {...x, status: 'CUMPLIDO'} : x))}
                      className={`px-3 py-1.5 rounded font-bold ${d.status === 'CUMPLIDO' ? 'bg-zinc-800 text-zinc-500' : 'bg-orange-500 text-black'}`}
                    >
                      {d.status === 'CUMPLIDO' ? '✓ Cumplido' : 'Marcar Cumplido'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CLIENTES --- */}
          {activeTab === 'clientes' && (
            <div className="space-y-6">
              <form onSubmit={handleAddClient} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Cliente / Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input 
                    type="text" placeholder="Nombre completo / Razón Social" 
                    value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <select 
                    value={newClient.role} onChange={e => setNewClient({...newClient, role: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  >
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="CONTRAPARTE">CONTRAPARTE</option>
                    <option value="TERCERO">TERCERO</option>
                  </select>
                  <input 
                    type="text" placeholder="CUIT / DNI" 
                    value={newClient.taxId} onChange={e => setNewClient({...newClient, taxId: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="email" placeholder="Correo Electrónico" 
                    value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                </div>
                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                  Guardar Contacto
                </button>
              </form>

              <div className="space-y-2">
                {clients.map(c => (
                  <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-zinc-500">{c.taxId} • {c.email}</p>
                    </div>
                    <span className="bg-zinc-800 text-orange-400 font-bold px-2 py-1 rounded text-[10px]">{c.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- AUDIENCIAS Y CALENDAR --- */}
          {activeTab === 'audiencias' && (
            <div className="space-y-6">
              <form onSubmit={handleAddHearing} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agendar Audiencia / Reunión</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input 
                    type="text" placeholder="Título de Audiencia o Reunión" 
                    value={newHearing.title} onChange={e => setNewHearing({...newHearing, title: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="datetime-local" value={newHearing.date} onChange={e => setNewHearing({...newHearing, date: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="text" placeholder="Lugar / Enlace Virtual" 
                    value={newHearing.location} onChange={e => setNewHearing({...newHearing, location: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <select 
                    value={newHearing.assignedMail} onChange={e => setNewHearing({...newHearing, assignedMail: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  >
                    <option value="">Notificar a Integrante de Equipo (Google Calendar)</option>
                    {teamEmails.filter(m => m !== '').map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>
                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                  Agendar Audiencia
                </button>
              </form>

              <div className="space-y-3">
                {hearings.map(h => (
                  <div key={h.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white">{h.title}</h4>
                      <span className="text-orange-400 font-bold">{h.date}</span>
                    </div>
                    <p className="text-zinc-400">Lugar: {h.location}</p>
                    {h.assignedMail && <p className="text-zinc-500 text-[10px]">📧 Agendado para sincronizar con: {h.assignedMail}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CONFIGURACION Y MAILS DEL EQUIPO --- */}
          {activeTab === 'configuracion' && (
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-orange-500 uppercase">Configuración de Integrantes y Google Calendar</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Agregá hasta 4 correos electrónicos de las personas que trabajan en tu equipo para asignarles audiencias, plazos y reuniones.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-zinc-500 font-bold w-16">Mail {index + 1}:</span>
                    <input 
                      type="email" 
                      placeholder={`ejemplo${index + 1}@estudio.com`}
                      value={teamEmails[index] || ''}
                      onChange={(e) => {
                        const updated = [...teamEmails];
                        updated[index] = e.target.value;
                        setTeamEmails(updated);
                      }}
                      className="flex-1 bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-400">
                ✅ <strong>Estado:</strong> Los correos se guardan automáticamente en la configuración del estudio para su uso en la agenda.
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
