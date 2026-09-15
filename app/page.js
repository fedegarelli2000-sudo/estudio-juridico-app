'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  // CONFIGURACIÓN DINÁMICA DEL FAVICON CON DOS M (Naranja y Gris)
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

  // --- SINCRONIZACIÓN AUTOMÁTICA CON EL SERVIDOR NUBE ---
  const syncWithCloud = async (key, value) => {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
    } catch (e) {
      console.error('Error sincronizando con nube:', e);
    }
  };

  const fetchFromCloud = async () => {
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data) {
        if (data.lex_cases) setCases(data.lex_cases);
        if (data.lex_clients) setClients(data.lex_clients);
        if (data.lex_movements) setMovements(data.lex_movements);
        if (data.lex_deadlines) setDeadlines(data.lex_deadlines);
        if (data.lex_hearings) setHearings(data.lex_hearings);
        if (data.lex_tasks) setTasks(data.lex_tasks);
        if (data.lex_emails) setTeamEmails(data.lex_emails);
      }
    } catch (e) {
      console.error('Error obteniendo de nube:', e);
    }
  };

  // Sondeo periódico cada 3 segundos para refrescar datos entre celular y compu
  useEffect(() => {
    fetchFromCloud();
    const interval = setInterval(fetchFromCloud, 3000);
    return () => clearInterval(interval);
  }, []);

  // SETTERS CON SINCRONIZACIÓN AUTOMÁTICA
  const updateCases = (val) => { setCases(val); syncWithCloud('lex_cases', val); };
  const updateClients = (val) => { setClients(val); syncWithCloud('lex_clients', val); };
  const updateMovements = (val) => { setMovements(val); syncWithCloud('lex_movements', val); };
  const updateDeadlines = (val) => { setDeadlines(val); syncWithCloud('lex_deadlines', val); };
  const updateHearings = (val) => { setHearings(val); syncWithCloud('lex_hearings', val); };
  const updateTasks = (val) => { setTasks(val); syncWithCloud('lex_tasks', val); };
  const updateTeamEmails = (val) => { setTeamEmails(val); syncWithCloud('lex_emails', val); };

  // FORMULARIOS DE ALTA
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newMovement, setNewMovement] = useState({ caseId: '', date: '', title: '', text: '', notes: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  const [newHearing, setNewHearing] = useState({ caseId: '', title: '', date: '', location: '', assignedMail: '' });
  const [newTask, setNewTask] = useState({ caseId: '', title: '', priority: 'MEDIA' });

  // HANDLERS DE BORRADO Y ESTADOS
  const toggleHearingStatus = (hearingId) => {
    updateHearings(hearings.map(h => h.id === hearingId ? { ...h, status: h.status === 'REALIZADA' ? 'PENDIENTE' : 'REALIZADA' } : h));
  };

  const deleteHearing = (hearingId) => {
    updateHearings(hearings.filter(h => h.id !== hearingId));
  };

  const deleteDeadline = (deadlineId) => {
    updateDeadlines(deadlines.filter(d => d.id !== deadlineId));
  };

  const deleteTask = (taskId) => {
    updateTasks(tasks.filter(t => t.id !== taskId));
  };

  const deleteCase = (caseId) => {
    if (!confirm('¿Está seguro de eliminar este expediente y sus registros vinculados?')) return;
    updateCases(cases.filter(c => c.id !== caseId));
    updateMovements(movements.filter(m => m.caseId !== caseId));
    updateDeadlines(deadlines.filter(d => d.caseId !== caseId));
    updateHearings(hearings.filter(h => h.caseId !== caseId));
    updateTasks(tasks.filter(t => t.caseId !== caseId));
    if (selectedCaseId === caseId) setSelectedCaseId(null);
  };

  const deleteClient = (clientId) => {
    if (!confirm('¿Está seguro de eliminar este cliente/contacto?')) return;
    updateClients(clients.filter(c => c.id !== clientId));
  };

  const handleAddCase = (e) => {
    e.preventDefault();
    if (!newCase.number || !newCase.caratula) return;
    const clientSelected = newCase.client || (clients[0] ? clients[0].name : 'Sin Cliente');
    const created = { ...newCase, client: clientSelected, id: Date.now().toString(), status: 'EN TRAMITE' };
    updateCases([...cases, created]);
    setNewCase({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    updateClients([...clients, { ...newClient, id: Date.now().toString() }]);
    setNewClient({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  };

  const handleAddMovementForCase = (e) => {
    e.preventDefault();
    if (!newMovement.title) return;
    const caseTarget = selectedCaseId || newMovement.caseId || cases[0]?.id || '1';
    updateMovements([...movements, { ...newMovement, caseId: caseTarget, id: Date.now().toString() }]);
    setNewMovement({ caseId: caseTarget, date: '', title: '', text: '', notes: '' });
  };

  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!newDeadline.title) return;
    const caseTarget = selectedCaseId || newDeadline.caseId || cases[0]?.id || '1';
    updateDeadlines([...deadlines, { ...newDeadline, caseId: caseTarget, id: Date.now().toString(), status: 'PENDIENTE', isAI: false }]);
    setNewDeadline({ caseId: caseTarget, title: '', dueDate: '', days: 5 });
  };

  const handleAddHearingAndSyncGoogle = (e) => {
    e.preventDefault();
    if (!newHearing.title || !newHearing.date) return;

    const caseTarget = selectedCaseId || newHearing.caseId || cases[0]?.id || '1';
    const hearingObj = { ...newHearing, caseId: caseTarget, id: Date.now().toString(), status: 'PENDIENTE' };
    updateHearings([...hearings, hearingObj]);

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
    updateTasks([...tasks, { ...newTask, caseId: caseTarget, id: Date.now().toString(), completed: false }]);
    setNewTask({ caseId: caseTarget, title: '', priority: 'MEDIA' });
  };

  const toggleTask = (taskId) => {
    updateTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
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

  // --- INTERFAZ PRINCIPAL COMPLETA ---
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
            <p className="text-[10px] text-emerald-500 font-semibold">● Sincronizado en Nube</p>
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
                    className="bg-zinc-950
