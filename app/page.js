// Version MM v4.0 - Icono Integrado y Borrado
'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  // CONFIGURACIÓN DIRECTA DEL ICONO CON DOS M (Naranja y Gris)
  useEffect(() => {
    const faviconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#09090b"/>
        <text x="10" y="70" font-family="Arial, sans-serif" font-weight="900" font-size="60" fill="#f97316">M</text>
        <text x="48" y="70" font-family="Arial, sans-serif" font-weight="900" font-size="60" fill="#71717a">M</text>
      </svg>
    `;
    const encodedSvg = encodeURIComponent(faviconSvg);
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = `data:image/svg+xml,${encodedSvg}`;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = "Estudio Jurídico MM";
  }, []);

  // --- CONTROL DE ACCESO Y CONTRASEÑA ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('estudioGarelli2026');

  useEffect(() => {
    const savedPassword = localStorage.getItem('lex_app_password');
    if (savedPassword) setCurrentPassword(savedPassword);
    const savedAuth = localStorage.getItem('lex_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true);
      setLoginError('');
      localStorage.setItem('lex_auth', 'true');
    } else {
      setLoginError('Contraseña incorrecta. Verifique los datos de acceso.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lex_auth');
    setIsAuthenticated(false);
  };

  // CAMBIO DE CONTRASEÑA
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPass) return;
    if (newPass !== confirmPass) {
      setPassMessage('❌ Las contraseñas no coinciden.');
      return;
    }
    setCurrentPassword(newPass);
    localStorage.setItem('lex_app_password', newPass);
    setPassMessage('✅ ¡Contraseña actualizada con éxito!');
    setNewPass('');
    setConfirmPass('');
  };

  // --- NAVEGACIÓN Y ESTADOS ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const [teamEmails, setTeamEmails] = useState(['', '', '', '', '', '']);

  const [cases, setCases] = useState([
    {
      id: '1',
      number: 'EXP-9821/2026',
      caratula: 'García, Roberto c/ Aseguradora del Sur S.A. s/ Daños',
      court: 'Juzgado Civil y Comercial Nº 12',
      client: 'Roberto García',
      processType: 'JUDICIAL',
      status: 'EN TRAMITE',
      notes: 'Cliente prefiere contacto por correo por la tarde.'
    }
  ]);
  
  const [clients, setClients] = useState([
    { id: '1', name: 'Roberto García', role: 'CLIENTE', taxId: '20-34881920-8', email: 'roberto@email.com', phone: '3584123456', address: 'Río Cuarto' },
    { id: '2', name: 'Aseguradora del Sur S.A.', role: 'CONTRAPARTE', taxId: '30-50112233-4', email: 'legales@aseguradora.com', phone: '0800-555-1234', address: 'Córdoba' }
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
    { id: '2', caseId: '1', title: 'Enviar pliego de preguntas al cliente', priority: 'MEDIA', completed: false },
    { id: '3', caseId: '1', title: 'Buscar copia de DNI en archivo', priority: 'BAJA', completed: true }
  ]);

  // CARGA INICIAL
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

  // GUARDADO PERSISTENTE
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
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newMovement, setNewMovement] = useState({ caseId: '', date: '', title: '', text: '', notes: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  const [newHearing, setNewHearing] = useState({ caseId: '', title: '', date: '', location: '', assignedMail: '' });
  const [newTask, setNewTask] = useState({ caseId: '', title: '', priority: 'MEDIA' });

  // HANDLERS DE BORRADO
  const toggleHearingStatus = (hearingId) => {
    setHearings(hearings.map(h => h.id === hearingId ? { ...h, status: h.status === 'REALIZADA' ? 'PENDIENTE' : 'REALIZADA' } : h));
  };

  const deleteHearing = (hearingId) => {
    setHearings(hearings.filter(h => h.id !== hearingId));
  };

  const deleteDeadline = (deadlineId) => {
    setDeadlines(deadlines.filter(d => d.id !== deadlineId));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleAddCase = (e) => {
    e.preventDefault();
    if (!newCase.number || !newCase.caratula) return;
    const clientSelected = newCase.client || (clients[0] ? clients[0].name : 'Sin Cliente');
    const created = { ...newCase, client: clientSelected, id: Date.now().toString(), status: 'EN TRAMITE' };
    setCases([...cases, created]);
    setNewCase({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    setClients([...clients, { ...newClient, id: Date.now().toString() }]);
    setNewClient({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
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
    const caseTarget = selectedCaseId || newDeadline.caseId || cases[0]?.id || '1';
    setDeadlines([...deadlines, { ...newDeadline, caseId: caseTarget, id: Date.now().toString(), status: 'PENDIENTE', isAI: false }]);
    setNewDeadline({ caseId: caseTarget, title: '', dueDate: '', days: 5 });
  };

  const handleAddHearingAndSyncGoogle = (e) => {
    e.preventDefault();
    if (!newHearing.title || !newHearing.date) return;

    const caseTarget = selectedCaseId || newHearing.caseId || cases[0]?.id || '1';
    const hearingObj = { ...newHearing, caseId: caseTarget, id: Date.now().toString(), status: 'PENDIENTE' };
    setHearings([...hearings, hearingObj]);

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
    setNewHearing({ caseId: caseTarget, title: '', date: '', location: '', assignedMail: '' });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const caseTarget = selectedCaseId || newTask.caseId || cases[0]?.id || '1';
    setTasks([...tasks, { ...newTask, caseId: caseTarget, id: Date.now().toString(), completed: false }]);
    setNewTask({ caseId: caseTarget, title: '', priority: 'MEDIA' });
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const selectedCaseData = cases.find(c => c.id === selectedCaseId);

  // --- LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
          <div className="flex justify-center items-center text-5xl font-black tracking-tighter">
            <span className="text-orange-500">M</span>
            <span className="text-zinc-500">M</span>
          </div>

          <div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">Estudio Jurídico MM</h1>
            <p className="text-xs text-orange-500 font-semibold mt-1">Acceso Privado al Sistema Operativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Contraseña de Clave Privada</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white text-xs outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {loginError && (
              <p className="text-[11px] text-red-500 font-bold bg-red-500/10 p-2 rounded border border-red-500/20">{loginError}</p>
            )}

            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
            >
              Ingresar al Estudio
            </button>
          </form>

          <p className="text-[10px] text-zinc-600">Conexión cifrada de acceso exclusivo para el personal autorizado.</p>
        </div>
      </div>
    );
  }

  // --- INTERFAZ PRINCIPAL ---
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      
      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 z-20">
        <div>
          <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
            <div className="flex items-center text-3xl font-black tracking-tighter">
              <span className="text-orange-500">M</span>
              <span className="text-zinc-500">M</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-sm uppercase tracking-wider">LexStudio</h1>
              <p className="text-[10px] text-orange-500 font-semibold">GESTIÓN LEGAL MM</p>
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
              { id: 'configuracion', label: 'Configuración / Mails / Clave', icon: '⚙️' }
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

        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center">
          <div>
            <p className="font-bold text-zinc-300">Estudio Jurídico MM</p>
            <p className="text-[10px]">Sistema Operativo Activo</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 rounded transition-colors text-xs"
          >
            🔒
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 z-10">
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

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950 relative">
          
          {/* DETALLE INDIVIDUAL DE EXPEDIENTE */}
          {selectedCaseId && selectedCaseData ? (
            <div className="space-y-6 relative z-10">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-orange-500/10 text-orange-400 font-mono text-xs font-bold px-2 py-0.5 rounded border border-orange-500/20">
                      {selectedCaseData.number}
                    </span>
                    <span className="ml-2 text-xs font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase">
                      {selectedCaseData.processType || 'JUDICIAL'}
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

              {/* MOVIMIENTOS EN ESTE EXPEDIENTE */}
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
              {/* DASHBOARD CON MARCA DE AGUA MM */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 relative z-10">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none -z-10 select-none">
                    <span className="text-[280px] font-black text-orange-500 tracking-tighter">M</span>
                    <span className="text-[280px] font-black text-zinc-400 tracking-tighter">M</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Causas Activas</span>
                      <h3 className="text-3xl font-black text-white mt-1">{cases.length}</h3>
                      <p className="text-[10px] text-orange-500 font-semibold mt-1">Expedientes en trámite</p>
                    </div>

                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Plazos Pendientes</span>
                      <h3 className="text-3xl font-black text-orange-500 mt-1">{deadlines.filter(d => d.status === 'PENDIENTE').length}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1">Con vencimiento procesal</p>
                    </div>

                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Tareas Pendientes</span>
                      <h3 className="text-3xl font-black text-white mt-1">{tasks.filter(t => !t.completed).length}</h3>
                      <div className="flex gap-2 mt-2 text-[10px] font-bold">
                        <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
                          {tasks.filter(t => !t.completed && t.priority === 'ALTA').length} Altas
                        </span>
                        <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {tasks.filter(t => !t.completed && t.priority === 'MEDIA').length} Med
                        </span>
                        <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                          {tasks.filter(t => !t.completed && t.priority === 'BAJA').length} Bajas
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Audiencias Agendadas</span>
                      <h3 className="text-3xl font-black text-white mt-1">{hearings.filter(h => h.status === 'PENDIENTE').length}</h3>
                      <p className="text-[10px] text-orange-400 font-semibold mt-1">Pendientes de celebración</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-5 rounded-xl">
                      <h4 className="text-xs font-bold text-orange-500 uppercase mb-3">Próximos Vencimientos Procesales</h4>
                      <div className="space-y-2">
                        {deadlines.filter(d => d.status === 'PENDIENTE').map(d => (
                          <div key={d.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-white">{d.title}</p>
                              <p className="text-[10px] text-zinc-500">Vence: {d.dueDate} ({d.days} días hábiles)</p>
                            </div>
                            <span className="bg-orange-500/10 text-orange-400 font-bold px-2 py-0.5 rounded text-[10px]">
                              PENDIENTE
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-5 rounded-xl">
                      <h4 className="text-xs font-bold text-orange-500 uppercase mb-3">Tareas de Mayor Urgencia</h4>
                      <div className="space-y-2">
                        {tasks.filter(t => !t.completed).map(t => (
                          <div key={t.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-200">{t.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              t.priority === 'ALTA' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EXPEDIENTES / CAUSAS */}
              {activeTab === 'expedientes' && (
                <div className="space-y-6 relative z-10">
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
                      
                      <select 
                        value={newCase.client} 
                        onChange={e => setNewCase({...newCase, client: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="">Seleccionar Cliente Asociado...</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                        ))}
                      </select>

                      <select 
                        value={newCase.processType} 
                        onChange={e => setNewCase({...newCase, processType: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500 md:col-span-2"
                      >
                        <option value="JUDICIAL">Tipo de Proceso: CAUSA JUDICIAL</option>
                        <option value="EXTRAJUDICIAL">Tipo de Proceso: TRÁMITE EXTRAJUDICIAL / MEDIACIÓN</option>
                      </select>
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
                          <span className="ml-2 text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                            {c.processType || 'JUDICIAL'}
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

              {/* MOVIMIENTOS E HISTORIA */}
              {activeTab === 'movimientos' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddMovementForCase} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Cargar Movimiento o Actuación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <select 
                        value={newMovement.caseId} onChange={e => setNewMovement({...newMovement, caseId: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="">Seleccionar Expediente Específico...</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                      </select>
                      <input 
                        type="date" value={newMovement.date} onChange={e => setNewMovement({...newMovement, date: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <input 
                      type="text" placeholder="Título de la actuación (Ej. Cédula / Proveído)" 
                      value={newMovement.title} onChange={e => setNewMovement({...newMovement, title: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500"
                    />
                    <textarea 
                      placeholder="Transcripción o síntesis de la actuación..."
                      value={newMovement.text} onChange={e => setNewMovement({...newMovement, text: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-20"
                    />
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Movimiento
                    </button>
                  </form>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Consultar Movimientos por Causa</h4>
                    <select 
                      value={selectedCaseId || ''} 
                      onChange={e => setSelectedCaseId(e.target.value || null)}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500"
                    >
                      <option value="">Ver Todos los Movimientos</option>
                      {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                    </select>

                    <div className="space-y-2 pt-2">
                      {movements
                        .filter(m => !selectedCaseId || m.caseId === selectedCaseId)
                        .map(m => {
                          const caseInfo = cases.find(c => c.id === m.caseId);
                          return (
                            <div key={m.id} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-orange-400">{m.title}</span>
                                <span className="text-zinc-500">{m.date}</span>
                              </div>
                              {caseInfo && <p className="text-[10px] text-zinc-500">Expediente: {caseInfo.number}</p>}
                              {m.text && <p className="text-zinc-300 mt-1">{m.text}</p>}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* PLAZOS PROCESALES CON BORRADO */}
              {activeTab === 'plazos' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddDeadline} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Cargar Plazo Procesal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <select 
                        value={newDeadline.caseId} onChange={e => setNewDeadline({...newDeadline, caseId: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="">Seleccionar Expediente...</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                      </select>
                      <input 
                        type="text" placeholder="Descripción del Plazo (ej. Traslado Demanda)" 
                        value={newDeadline.title} onChange={e => setNewDeadline({...newDeadline, title: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                      <input 
                        type="date" value={newDeadline.dueDate} onChange={e => setNewDeadline({...newDeadline, dueDate: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                      <input 
                        type="number" placeholder="Días hábiles (ej. 5)" 
                        value={newDeadline.days} onChange={e => setNewDeadline({...newDeadline, days: parseInt(e.target.value)})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Registrar Plazo
                    </button>
                  </form>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Plazos Registrados</h4>
                    {deadlines.map(d => (
                      <div key={d.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          {d.isAI && <span className="bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded text-[10px] mb-1 inline-block">Sugerido por IA</span>}
                          <h4 className="font-bold text-white">{d.title}</h4>
                          <p className="text-zinc-500">Vencimiento: {d.dueDate} ({d.days} días hábiles)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDeadlines(deadlines.map(x => x.id === d.id ? {...x, status: x.status === 'CUMPLIDO' ? 'PENDIENTE' : 'CUMPLIDO'} : x))}
                            className={`px-3 py-1.5 rounded font-bold ${d.status === 'CUMPLIDO' ? 'bg-zinc-800 text-zinc-400' : 'bg-orange-500 text-black'}`}
                          >
                            {d.status === 'CUMPLIDO' ? '✓ Cumplido' : 'Marcar Cumplido'}
                          </button>
                          <button 
                            onClick={() => deleteDeadline(d.id)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AUDIENCIAS */}
              {activeTab === 'audiencias' && (
                <div className="space-y-6 relative z-10">
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

              {/* TAREAS CON BORRADO */}
              {activeTab === 'tareas' && (
                <div className="space-y-6 relative z-10">
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
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.completed ? 'bg-zinc-800 text-zinc-500' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                            {t.completed ? 'CUMPLIDA' : t.priority}
                          </span>
                          <button 
                            onClick={() => deleteTask(t.id)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-1 rounded font-bold text-xs transition-all border border-red-500/20"
                            title="Eliminar tarea"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CLIENTES */}
              {activeTab === 'clientes' && (
                <div className="space-y-6 relative z-10">
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
                        <option value="CLIENTE">ROL: CLIENTE</option>
                        <option value="CONTRAPARTE">ROL: CONTRAPARTE</option>
                        <option value="TERCERO">ROL: TERCERO / PROFESIONAL</option>
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
                      <input 
                        type="text" placeholder="Teléfono / Celular de contacto" 
                        value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                      <input 
                        type="text" placeholder="Domicilio / Localidad" 
                        value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Contacto
                    </button>
                  </form>

                  <div className="space-y-2">
                    {clients.map(c => (
                      <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{c.name}</h4>
                            <span className="bg-zinc-800 text-orange-400 font-bold px-2 py-0.5 rounded text-[10px]">{c.role}</span>
                          </div>
                          <p className="text-zinc-400 mt-1">
                            {c.taxId && `DNI/CUIT: ${c.taxId} • `}
                            {c.phone && `Tel: ${c.phone} • `}
                            {c.email && `Mail: ${c.email}`}
                          </p>
                          {c.address && <p className="text-zinc-500 text-[10px]">📍 {c.address}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONFIGURACIÓN */}
              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-orange-500 uppercase">Mails del Equipo para Notificaciones en Google Calendar</h3>
                    <p className="text-xs text-zinc-400">Podés registrar hasta 6 casillas de correo para asignarles eventos y audiencias:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-zinc-500 font-bold w-14">Mail {index + 1}:</span>
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

                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-orange-500 uppercase">Cambiar Contraseña de Acceso al Estudio</h3>
                    <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
                      <div>
                        <label className="text-zinc-400 block mb-1">Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          placeholder="••••••••••••"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Confirmar Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          placeholder="••••••••••••"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      {passMessage && (
                        <p className="text-xs font-bold p-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">{passMessage}</p>
                      )}

                      <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2 rounded text-xs transition-colors">
                        Guardar Nueva Contraseña
                      </button>
                    </form>
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
