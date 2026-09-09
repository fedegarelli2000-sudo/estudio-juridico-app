'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // --- ESTADOS INTERACTIVOS ---
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
    { id: '1', caseId: '1', title: 'Audiencia Preliminar', date: '2026-09-18T10:00', location: 'Juzgado Civil Nº 12', assignedMail: '', status: 'PENDIENTE' }
  ]);

  const [tasks, setTasks] = useState([
    { id: '1', caseId: '1', title: 'Revisar liquidación de tasa de justicia', priority: 'ALTA', completed: false },
    { id: '2', caseId: '1', title: 'Enviar pliego de preguntas al cliente', priority: 'MEDIA', completed: true }
  ]);

  // Carga inicial desde memoria local
  useEffect(() => {
    try {
      const savedEmails = localStorage.getItem('lex_emails');
      const savedCases = localStorage.getItem('lex_cases');
      const savedClients = localStorage.getItem('lex_clients');
      const savedMovements = localStorage.getItem('lex_movements');
      const savedDeadlines = localStorage.getItem('lex_deadlines');
      const savedHearings = localStorage.getItem('lex_hearings');
      const savedTasks = localStorage.getItem('lex_tasks');

      if (savedEmails) setTeamEmails(JSON.parse(savedEmails));
      if (savedCases) setCases(JSON.parse(savedCases));
      if (savedClients) setClients(JSON.parse(savedClients));
      if (savedMovements) setMovements(JSON.parse(savedMovements));
      if (savedDeadlines) setDeadlines(JSON.parse(savedDeadlines));
      if (savedHearings) setHearings(JSON.parse(savedHearings));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Guardado continuo en memoria local
  useEffect(() => {
    try {
      localStorage.setItem('lex_emails', JSON.stringify(teamEmails));
      localStorage.setItem('lex_cases', JSON.stringify(cases));
      localStorage.setItem('lex_clients', JSON.stringify(clients));
      localStorage.setItem('lex_movements', JSON.stringify(movements));
      localStorage.setItem('lex_deadlines', JSON.stringify(deadlines));
      localStorage.setItem('lex_hearings', JSON.stringify(hearings));
      localStorage.setItem('lex_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [teamEmails, cases, clients, movements, deadlines, hearings, tasks]);

  // FORMULARIOS DE ALTA
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '' });
  const [newMovement, setNewMovement] = useState({ caseId: '1', date: '', title: '', text: '', notes: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '1', title: '', dueDate: '', days: 5 });
  const [newHearing, setNewHearing] = useState({ caseId: '1', title: '', date: '', location: '', assignedMail: '' });
  const [newTask, setNewTask] = useState({ caseId: '1', title: '', priority: 'MEDIA' });

  // HANDLERS PARA AUDIENCIAS (TOMAR / CANCELAR / ELIMINAR)
  const toggleHearingStatus = (hearingId) => {
    setHearings(hearings.map(h => h.id === hearingId ? { ...h, status: h.status === 'REALIZADA' ? 'PENDIENTE' : 'REALIZADA' } : h));
  };

  const deleteHearing = (hearingId) => {
    setHearings(hearings.filter(h => h.id !== hearingId));
  };

  // HANDLERS GENERALES
  const handleAddCase = (e) => {
    e.preventDefault();
    if (!newCase.number || !newCase.caratula) return;
    const created = { ...newCase, id: Date.now().toString(), status: 'EN TRAMITE' };
    setCases([...cases, created]);
    setNewCase({ number: '', caratula: '', court: '', client: '', notes: '' });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    setClients([...clients, { ...newClient, id: Date.now().toString() }]);
    setNewClient({ name: '', role: 'CLIENTE', taxId: '', email: '' });
  };

  const handleAddMovementForCase = (e) => {
    e.preventDefault();
    if (!newMovement.title) return;
    const caseTarget = selectedCaseId || newMovement.caseId || cases[0]?.id || '1';
    setMovements([...movements, { ...newMovement, caseId: caseTarget, id: Date.now().toString() }]);
    setNewMovement({ caseId: caseTarget, date: '', title: '', text: '', notes: '' });
  };

  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!newDeadline.title) return;
    setDeadlines([...deadlines, { ...newDeadline, caseId: selectedCaseId || cases[0]?.id || '1', id: Date.now().toString(), status: 'PENDIENTE', isAI: false }]);
    setNewDeadline({ caseId: selectedCaseId || cases[0]?.id || '1', title: '', dueDate: '', days: 5 });
  };

  const handleAddHearingAndSyncGoogle = (e) => {
    e.preventDefault();
    if (!newHearing.title || !newHearing.date) return;

    const hearingObj = { ...newHearing, caseId: selectedCaseId || cases[0]?.id || '1', id: Date.now().toString(), status: 'PENDIENTE' };
    setHearings([...hearings, hearingObj]);

    // INTEGRACIÓN GOOGLE CALENDAR
    const startDate = new Date(newHearing.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const formatGDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.append('action', 'TEMPLATE');
    googleUrl.searchParams.append('text', `AUDIENCIA: ${newHearing.title}`);
    googleUrl.searchParams.append('dates', `${formatGDate(startDate)}/${formatGDate(endDate)}`);
    googleUrl.searchParams.append('details', `Audiencia agendada desde Estudio MM.`);
    if (newHearing.location) googleUrl.searchParams.append('location', newHearing.location);
    if (newHearing.assignedMail) googleUrl.searchParams.append('add', newHearing.assignedMail);

    window.open(googleUrl.toString(), '_blank');
    setNewHearing({ caseId: selectedCaseId || cases[0]?.id || '1', title: '', date: '', location: '', assignedMail: '' });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setTasks([...tasks, { ...newTask, caseId: selectedCaseId || cases[0]?.id || '1', id: Date.now().toString(), completed: false }]);
    setNewTask({ caseId: selectedCaseId || cases[0]?.id || '1', title: '', priority: 'MEDIA' });
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const selectedCaseData = cases.find(c => c.id === selectedCaseId);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      
      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
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
              { id: 'tareas', label: 'Tareas y Pendientes', icon: '✅' },
              { id: 'clientes', label: 'Clientes y Contactos', icon: '👥' },
              { id: 'audiencias', label: 'Audiencias y Calendar', icon: '📅' },
              { id: 'configuracion', label: 'Configuración / Mails', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCaseId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id && !selectedCaseId
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

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase">
            {selectedCaseId ? `FICHA DE EXPEDIENTE: ${selectedCaseData?.number}` : activeTab.replace('_', ' ')}
          </h2>
          {selectedCaseId && (
            <button 
              onClick={() => setSelectedCaseId(null)}
              className="bg-orange-500 text-black hover:bg-orange-400 text-xs font-bold px-3 py-1.5 rounded transition-all"
            >
              ← Volver a Lista de Expedientes
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          
          {/* VISTA INDIVIDUAL DE CADA EXPEDIENTE AL INGRESAR */}
          {selectedCaseId && selectedCaseData ? (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-orange-500/10 text-orange-400 font-mono text-xs font-bold px-2 py-0.5 rounded border border-orange-500/20">
                      {selectedCaseData.number}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedCaseData.caratula}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedCaseData.court} • Cliente: {selectedCaseData.client}</p>
                  </div>
                  <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded">{selectedCaseData.status}</span>
                </div>
                {selectedCaseData.notes && (
                  <p className="text-xs bg-zinc-950 p-3 rounded border border-zinc-800 text-zinc-300">
                    💬 <strong>Observaciones del Abogado:</strong> {selectedCaseData.notes}
                  </p>
                )}
              </div>

              {/* CARGA DE MOVIMIENTOS DENTRO DE ESTE EXPEDIENTE */}
              <form onSubmit={handleAddMovementForCase} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Movimiento en este Expediente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input 
                    type="text" placeholder="Título de la actuación (Ej. Cédula / Proveído)" 
                    value={newMovement.title} onChange={e => setNewMovement({...newMovement, title: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="date" value={newMovement.date} onChange={e => setNewMovement({...newMovement, date: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                </div>
                <textarea 
                  placeholder="Detalle o texto de la actuación..."
                  value={newMovement.text} onChange={e => setNewMovement({...newMovement, text: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-16"
                />
                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                  Guardar Movimiento en este Expediente
                </button>
              </form>

              {/* MOVIMIENTOS REGISTRADOS */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Movimientos</h4>
                <div className="space-y-2">
                  {movements.filter(m => m.caseId === selectedCaseId).map(m => (
                    <div key={m.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs space-y-1">
                      <div className="flex justify-between font-bold text-zinc-200">
                        <span>{m.title}</span>
                        <span className="text-zinc-500">{m.date}</span>
                      </div>
                      {m.text && <p className="text-zinc-400">{m.text}</p>}
                    </div>
                  ))}
                  {movements.filter(m => m.caseId === selectedCaseId).length === 0 && (
                    <p className="text-xs text-zinc-600">No hay actuaciones registradas para este expediente.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
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
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Tareas Pendientes</span>
                      <h3 className="text-2xl font-black text-white mt-1">{tasks.filter(t => !t.completed).length}</h3>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Audiencias Agendadas</span>
                      <h3 className="text-2xl font-black text-white mt-1">{hearings.filter(h => h.status === 'PENDIENTE').length}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* LISTA DE EXPEDIENTES / CAUSAS */}
              {activeTab === 'expedientes' && (
                <div className="space-y-6">
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
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-16"
                    />
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Expediente
                    </button>
                  </form>

                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 font-medium">Hacé clic en cualquiera de tus expedientes para ingresar y ver sus actuaciones:</p>
                    {cases.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedCaseId(c.id)}
                        className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2 cursor-pointer hover:border-orange-500 transition-all flex justify-between items-center"
                      >
                        <div>
                          <span className="bg-orange-500/10 text-orange-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/20">
                            {c.number}
                          </span>
                          <h4 className="font-bold text-white text-sm mt-1">{c.caratula}</h4>
                          <p className="text-xs text-zinc-400">{c.court} • Cliente: {c.client}</p>
                        </div>
                        <span className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">
                          Ingresar al Expediente →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AUDIENCIAS CON CONTROLES (TOMADAS / CANCELADAS / ELIMINAR) */}
              {activeTab === 'audiencias' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddHearingAndSyncGoogle} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agendar y Notificar Audiencia</h3>
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
                        type="text" placeholder="Lugar / Juzgado / Enlace Virtual" 
                        value={newHearing.location} onChange={e => setNewHearing({...newHearing, location: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                      <select 
                        value={newHearing.assignedMail} onChange={e => setNewHearing({...newHearing, assignedMail: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="">Mail a Notificar (Google Calendar)</option>
                        {teamEmails.filter(m => m !== '').map((m, i) => <option key={i} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400 flex items-center gap-2">
                      📅 Agendar y Abrir Invitación en Google Calendar
                    </button>
                  </form>

                  {/* LISTA DE AUDIENCIAS CON BOTONES DE ACCIÓN */}
                  <div className="space-y-3">
                    {hearings.map(h => (
                      <div key={h.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${h.status === 'REALIZADA' ? 'bg-zinc-800 text-zinc-500' : 'bg-orange-500/20 text-orange-400'}`}>
                              {h.status === 'REALIZADA' ? '✓ REALIZADA / TOMADA' : 'PENDIENTE'}
                            </span>
                            <h4 className={`font-bold text-sm mt-1 ${h.status === 'REALIZADA' ? 'line-through text-zinc-500' : 'text-white'}`}>
                              {h.title}
                            </h4>
                          </div>
                          <span className="text-orange-400 font-bold">{h.date}</span>
                        </div>
                        <p className="text-zinc-400">Lugar: {h.location}</p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                          <button 
                            onClick={() => toggleHearingStatus(h.id)}
                            className={`px-3 py-1.5 rounded font-bold text-xs ${h.status === 'REALIZADA' ? 'bg-zinc-800 text-zinc-300' : 'bg-emerald-600 text-white'}`}
                          >
                            {h.status === 'REALIZADA' ? 'Deshacer (Marcar Pendiente)' : '✓ Marcar como Tomada / Realizada'}
                          </button>
                          <button 
                            onClick={() => deleteHearing(h.id)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                          >
                            🗑️ Eliminar / Cancelar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOSTRAR OTROS MÓDULOS (TAREAS, CLIENTES, MOVIMIENTOS, CONFIGURACIÓN) */}
              {activeTab === 'tareas' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddTask} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Crear Nueva Tarea</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Descripción de la tarea" 
                        value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500 md:col-span-2"
                      />
                      <select 
                        value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="BAJA">Prioridad BAJA</option>
                        <option value="MEDIA">Prioridad MEDIA</option>
                        <option value="ALTA">Prioridad ALTA</option>
                      </select>
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Tarea
                    </button>
                  </form>

                  <div className="space-y-2">
                    {tasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={t.completed} 
                            onChange={() => toggleTask(t.id)}
                            className="w-4 h-4 accent-orange-500 cursor-pointer"
                          />
                          <span className={t.completed ? 'line-through text-zinc-500 font-medium' : 'text-zinc-100 font-bold'}>
                            {t.title}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.completed ? 'bg-zinc-800 text-zinc-500' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                          {t.completed ? 'CUMPLIDA' : t.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                          <p className="text-zinc-500">{c.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-orange-500 uppercase">Configuración de Mails para Integración con Google Calendar</h3>
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
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}
