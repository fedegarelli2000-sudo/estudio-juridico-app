'use client';

import React, { useState, useEffect, useRef } from 'react';

const SUPABASE_URL = 'https://uiaicluwzdhvobmghwhj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function Home() {
  // FAVICON CON DOS M
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

  // --- AUTENTICACIÓN ---
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
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [movements, setMovements] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Bandera para evitar bucles de sincronización local/remota
  const isSyncingFromCloud = useRef(false);

  // CARGA INICIAL DESDE SUPABASE Y LOCALSTORAGE
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Carga inmediata de respaldo local para evitar pantalla en blanco
      try {
        const c = localStorage.getItem('lex_cases'); if (c) setCases(JSON.parse(c));
        const cl = localStorage.getItem('lex_clients'); if (cl) setClients(JSON.parse(cl));
        const m = localStorage.getItem('lex_movements'); if (m) setMovements(JSON.parse(m));
        const d = localStorage.getItem('lex_deadlines'); if (d) setDeadlines(JSON.parse(d));
        const h = localStorage.getItem('lex_hearings'); if (h) setHearings(JSON.parse(h));
        const t = localStorage.getItem('lex_tasks'); if (t) setTasks(JSON.parse(t));
        const e = localStorage.getItem('lex_emails'); if (e) setTeamEmails(JSON.parse(e));
      } catch (err) { console.error(err); }

      // 2. Traer datos frescos de la nube
      if (!SUPABASE_ANON_KEY) return;
      try {
        isSyncingFromCloud.current = true;
        const res = await fetch(`${SUPABASE_URL}/rest/v1/estudio_data?select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const data = await res.json();
        if (data && Array.isArray(data)) {
          data.forEach(item => {
            if (item.value) {
              if (item.key === 'lex_cases') { setCases(item.value); localStorage.setItem('lex_cases', JSON.stringify(item.value)); }
              if (item.key === 'lex_clients') { setClients(item.value); localStorage.setItem('lex_clients', JSON.stringify(item.value)); }
              if (item.key === 'lex_movements') { setMovements(item.value); localStorage.setItem('lex_movements', JSON.stringify(item.value)); }
              if (item.key === 'lex_deadlines') { setDeadlines(item.value); localStorage.setItem('lex_deadlines', JSON.stringify(item.value)); }
              if (item.key === 'lex_hearings') { setHearings(item.value); localStorage.setItem('lex_hearings', JSON.stringify(item.value)); }
              if (item.key === 'lex_tasks') { setTasks(item.value); localStorage.setItem('lex_tasks', JSON.stringify(item.value)); }
              if (item.key === 'lex_emails') { setTeamEmails(item.value); localStorage.setItem('lex_emails', JSON.stringify(item.value)); }
            }
          });
        }
      } catch (e) {
        console.error('Error cargando de la nube:', e);
      } finally {
        isSyncingFromCloud.current = false;
      }
    };

    loadInitialData();

    // Sondeo de sincronización cada 4 segundos entre dispositivos
    const interval = setInterval(async () => {
      if (!SUPABASE_ANON_KEY) return;
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/estudio_data?select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const data = await res.json();
        if (data && Array.isArray(data)) {
          isSyncingFromCloud.current = true;
          data.forEach(item => {
            if (item.value) {
              if (item.key === 'lex_cases') { setCases(prev => { if(JSON.stringify(prev) !== JSON.stringify(item.value)) { localStorage.setItem('lex_cases', JSON.stringify(item.value)); return item.value; } return prev; }); }
              if (item.key === 'lex_clients') { setClients(prev => { if(JSON.stringify(prev) !== JSON.stringify(item.value)) { localStorage.setItem('lex_clients', JSON.stringify(item.value)); return item.value; } return prev; }); }
              if (item.key === 'lex_movements') { setMovements(prev => { if(JSON.stringify(prev) !== JSON.stringify(item.value)) { localStorage.setItem('lex_movements', JSON.stringify(item.value)); return item.value; } return prev; }); }
              if (item.key === 'lex_deadlines') { setDeadlines(prev => { if(JSON.stringify(prev) !== JSON.stringify(item.value)) { localStorage.setItem('lex_deadlines', JSON.stringify(item.value)); return item.value; } return prev; }); }
              if (item.key === 'lex_hearings') { setHearings(prev => { if(JSON.stringify(prev) !== JSON.stringify(item.value)) { localStorage.setItem('lex_hearings', JSON.stringify(item.value)); return item.value; } return prev; }); }
              if (item.key === 'lex_tasks') { setTasks(prev => { if(JSON.stringify(prev) !== JSON.stringify(item.value)) { localStorage.setItem('lex_tasks', JSON.stringify(item.value)); return item.value; } return prev; }); }
              if (item.key === 'lex_emails') { setTeamEmails(prev => { if(JSON.stringify(prev) !== JSON.stringify(item.value)) { localStorage.setItem('lex_emails', JSON.stringify(item.value)); return item.value; } return prev; }); }
            }
          });
        }
      } catch (e) {
        console.error('Error en sondeo:', e);
      } finally {
        isSyncingFromCloud.current = false;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // FUNCIÓN DE GUARDADO ATÓMICO (Nube + Local)
  const saveToCloudAndLocal = async (key, value) => {
    if (isSyncingFromCloud.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }

    if (!SUPABASE_ANON_KEY) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/estudio_data`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ key, value })
      });
    } catch (e) {
      console.error('Error guardando en nube:', e);
    }
  };

  const updateCases = (val) => { setCases(val); saveToCloudAndLocal('lex_cases', val); };
  const updateClients = (val) => { setClients(val); saveToCloudAndLocal('lex_clients', val); };
  const updateMovements = (val) => { setMovements(val); saveToCloudAndLocal('lex_movements', val); };
  const updateDeadlines = (val) => { setDeadlines(val); saveToCloudAndLocal('lex_deadlines', val); };
  const updateHearings = (val) => { setHearings(val); saveToCloudAndLocal('lex_hearings', val); };
  const updateTasks = (val) => { setTasks(val); saveToCloudAndLocal('lex_tasks', val); };
  const updateTeamEmails = (val) => { setTeamEmails(val); saveToCloudAndLocal('lex_emails', val); };

  // FORMULARIOS DE ALTA
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newMovement, setNewMovement] = useState({ caseId: '', date: '', title: '', text: '', notes: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  const [newHearing, setNewHearing] = useState({ caseId: '', title: '', date: '', location: '', assignedMail: '' });
  const [newTask, setNewTask] = useState({ caseId: '', title: '', priority: 'MEDIA' });

  // HANDLERS Y ELIMINACIONES NUEVAS
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

  // NUEVO: Eliminar Expediente (y sus movimientos/plazos vinculados)
  const deleteCase = (caseId) => {
    if (!confirm('¿Está seguro de eliminar este expediente y sus registros vinculados?')) return;
    updateCases(cases.filter(c => c.id !== caseId));
    updateMovements(movements.filter(m => m.caseId !== caseId));
    updateDeadlines(deadlines.filter(d => d.caseId !== caseId));
    updateHearings(hearings.filter(h => h.caseId !== caseId));
    updateTasks(tasks.filter(t => t.caseId !== caseId));
    if (selectedCaseId === caseId) setSelectedCaseId(null);
  };

  // NUEVO: Eliminar Cliente / Contacto
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
            <p className="text-[10px] text-emerald-500 font-semibold">● Sincronizado</p>
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
                  Guardar Movimiento
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
              {/* DASHBOARD */}
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
                    </div>
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Plazos Pendientes</span>
                      <h3 className="text-3xl font-black text-orange-500 mt-1">{deadlines.filter(d => d.status === 'PENDIENTE').length}</h3>
                    </div>
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Tareas Pendientes</span>
                      <h3 className="text-3xl font-black text-white mt-1">{tasks.filter(t => !t.completed).length}</h3>
                    </div>
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Audiencias Agendadas</span>
                      <h3 className="text-3xl font-black text-white mt-1">{hearings.filter(h => h.status === 'PENDIENTE').length}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* EXPEDIENTES / CAUSAS (CON BOTÓN ELIMINAR) */}
              {activeTab === 'expedientes' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddCase} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agregar Nueva Causa / Expediente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Nº de Expediente" 
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
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Expediente
                    </button>
                  </form>

                  <div className="space-y-3">
                    {cases.map(c => (
                      <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                        <div onClick={() => setSelectedCaseId(c.id)} className="cursor-pointer flex-1">
                          <span className="text-orange-400 font-bold">{c.number}</span>
                          <h4 className="font-bold text-white text-sm mt-1">{c.caratula}</h4>
                          <p className="text-zinc-400 text-[10px]">{c.court} • {c.client}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedCaseId(c.id)} className="bg-orange-500 text-black font-bold px-3 py-1.5 rounded">
                            Ingresar →
                          </button>
                          <button 
                            onClick={() => deleteCase(c.id)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold transition-all border border-red-500/20"
                            title="Eliminar Expediente"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOVIMIENTOS */}
              {activeTab === 'movimientos' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddMovementForCase} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Cargar Movimiento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <select 
                        value={newMovement.caseId} onChange={e => setNewMovement({...newMovement, caseId: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="">Seleccionar Expediente...</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                      </select>
                      <input 
                        type="date" value={newMovement.date} onChange={e => setNewMovement({...newMovement, date: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <input 
                      type="text" placeholder="Título de la actuación" 
                      value={newMovement.title} onChange={e => setNewMovement({...newMovement, title: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500"
                    />
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Movimiento
                    </button>
                  </form>
                </div>
              )}

              {/* PLAZOS */}
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
                        type="text" placeholder="Descripción del Plazo" 
                        value={newDeadline.title} onChange={e => setNewDeadline({...newDeadline, title: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                      <input 
                        type="date" value={newDeadline.dueDate} onChange={e => setNewDeadline({...newDeadline, dueDate: e.target.value})}
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
                          <h4 className="font-bold text-white">{d.title}</h4>
                          <p className="text-zinc-500">Vence: {d.dueDate}</p>
                        </div>
                        <button onClick={() => deleteDeadline(d.id)} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded font-bold">🗑️ Eliminar</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AUDIENCIAS */}
              {activeTab === 'audiencias' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddHearingAndSyncGoogle} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agendar Audiencia</h3>
                    <input 
                      type="text" placeholder="Título" 
                      value={newHearing.title} onChange={e => setNewHearing({...newHearing, title: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white text-xs outline-none focus:border-orange-500"
                    />
                    <input 
                      type="datetime-local" value={newHearing.date} onChange={e => setNewHearing({...newHearing, date: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white text-xs outline-none focus:border-orange-500"
                    />
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400">
                      Agendar en Calendar
                    </button>
                  </form>
                </div>
              )}

              {/* TAREAS */}
              {activeTab === 'tareas' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddTask} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Crear Tarea</h3>
                    <input 
                      type="text" placeholder="Descripción" 
                      value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white text-xs outline-none focus:border-orange-500"
                    />
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Tarea
                    </button>
                  </form>
                  <div className="space-y-2">
                    {tasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs">
                        <span className={t.completed ? 'line-through text-zinc-500' : 'text-white font-bold'}>{t.title}</span>
                        <button onClick={() => deleteTask(t.id)} className="bg-red-500/10 text-red-400 p-1 rounded">🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CLIENTES (CON BOTÓN ELIMINAR) */}
              {activeTab === 'clientes' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddClient} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Cliente / Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Nombre completo" 
                        value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                      <input 
                        type="text" placeholder="CUIT / DNI" 
                        value={newClient.taxId} onChange={e => setNewClient({...newClient, taxId: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Cliente
                    </button>
                  </form>

                  <div className="space-y-2">
                    {clients.map(c => (
                      <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <h4 className="font-bold text-white text-sm">{c.name}</h4>
                          <p className="text-zinc-400">{c.taxId}</p>
                        </div>
                        <button 
                          onClick={() => deleteClient(c.id)}
                          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold transition-all border border-red-500/20"
                          title="Eliminar Cliente"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONFIGURACIÓN */}
              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-orange-500 uppercase">Cambiar Contraseña de Acceso al Estudio</h3>
                    <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
                      <div>
                        <label className="text-zinc-400 block mb-1">Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Confirmar Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      {passMessage && <p className="text-xs font-bold p-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">{passMessage}</p>}
                      <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2 rounded text-xs">
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
