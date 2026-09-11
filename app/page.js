'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  // CONFIGURACIÓN DINÁMICA DEL FAVICON
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

  // --- CONTROL DE ACCESO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('Gina2468');
  const [recoveryEmailConfig, setRecoveryEmailConfig] = useState('fedegarelli2000@gmail.com');
  
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryInputEmail, setRecoveryInputEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('lex_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('lex_auth', 'true');
    } else {
      setLoginError('Contraseña incorrecta. Verifique los datos de acceso.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lex_auth');
    setIsAuthenticated(false);
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    if (recoveryInputEmail.trim().toLowerCase() === recoveryEmailConfig.toLowerCase()) {
      setRecoveryMessage(`✅ ¡Correo verificado! Su contraseña actual universal es: "${currentPassword}".`);
    } else {
      setRecoveryMessage('❌ El correo ingresado no coincide con el mail de recuperación.');
    }
  };

  // --- NAVEGACIÓN Y ESTADOS ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedFiscalId, setSelectedFiscalId] = useState(null);

  const [teamEmails, setTeamEmails] = useState(['fedegarelli2000@gmail.com', 'mmanginim@hotmail.com', 'estudiojuridicogarelli@gmail.com']);

  const formatDateToArg = (dateStr) => {
    if (!dateStr || dateStr.includes('Sin fecha') || dateStr.includes('Pendiente') || dateStr.includes('A calcular')) return dateStr;
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // --- MÓDULO DE PROCURACIÓN FISCAL (CBA) ---
  const [procuracionSubTab, setProcuracionSubTab] = useState('titulos');
  
  const [fiscalCases, setFiscalCases] = useState([
    {
      id: 'f1',
      tributo: 'Inmobiliario',
      contribuyente: 'ZAMARBIDE',
      nroLiquidacion: '8763587',
      periodo: '2026',
      monto: '$99.800.000',
      fechaVencimientoLiquidacion: '2025-01-20',
      fechaNotificacion: '2026-09-10',
      plazoExcepcionesFecha: '2026-09-13', 
      plazoPerencion: '2027-03-10',
      plazoPrescripcion: '2030-01-20',
      estadoFiscal: 'TÍTULO PRESENTADO / NOTIFICADO',
      juzgado: 'Juzgado Fiscal Río Cuarto',
      cidiNotif: 'Notificado vía Cédula/CIDI',
      alertaExcepcionCumplida: false
    }
  ]);

  const [fiscalMovements, setFiscalMovements] = useState([]);
  const [isEditingFiscal, setIsEditingFiscal] = useState(false);
  const [editFiscalForm, setEditFiscalForm] = useState({});

  const startEditingFiscal = (fc) => {
    setIsEditingFiscal(true);
    setEditFiscalForm({ ...fc });
  };

  const handleSaveEditFiscal = (e) => {
    e.preventDefault();
    let nuevaPrescripcion = editFiscalForm.plazoPrescripcion;
    if (editFiscalForm.fechaVencimientoLiquidacion) {
      const presDate = new Date(editFiscalForm.fechaVencimientoLiquidacion);
      presDate.setFullYear(presDate.getFullYear() + 5);
      nuevaPrescripcion = presDate.toISOString().split('T')[0];
    }
    const formToSave = { ...editFiscalForm, plazoPrescripcion: nuevaPrescripcion };
    const updatedList = fiscalCases.map(fc => fc.id === formToSave.id ? formToSave : fc);
    setFiscalCases(updatedList);
    updateFiscalCases(updatedList);
    setIsEditingFiscal(false);
  };

  // --- EXPEDIENTES Y DEMÁS MÓDULOS ---
  const [cases, setCases] = useState([
    {
      id: '1',
      number: '14900698',
      caratula: 'Cámara de Alquileres / Cobro',
      court: 'Juzgado Civil y Comercial Nº 12',
      client: 'Cámara',
      processType: 'JUDICIAL',
      status: 'EN TRAMITE',
      notes: 'Alquileres adeudados julio y agosto.'
    }
  ]);
  
  const [clients, setClients] = useState([
    { id: '1', name: 'Roberto García', role: 'CLIENTE', taxId: '20-34881920-8', email: 'roberto@email.com', phone: '3584123456', address: 'Río Cuarto' }
  ]);

  const [movements, setMovements] = useState([
    { id: '1', caseId: '1', date: '2026-08-14', title: 'SOLICITUD DE MEDIACION', text: 'INICIO', notes: '' },
    { id: '2', caseId: '1', date: '2026-09-01', title: 'DECRETO AUDIENCIA', text: 'SEGUNDA AUDIENCIA', notes: '' }
  ]);

  const [deadlines, setDeadlines] = useState([
    { id: '1', caseId: '1', title: 'Contestar Traslado', dueDate: '2026-09-16', days: 5, status: 'PENDIENTE', isAI: true }
  ]);

  // --- AUDIENCIAS Y CALENDARIO (ENRIQUECIDO Y SINCRONIZADO) ---
  const [hearings, setHearings] = useState([
    { 
      id: 'h_1', 
      caseId: '1', 
      title: 'Audiencia Preliminar de Conciliación', 
      date: '2026-09-18T10:00', 
      location: 'Juzgado Civil Nº 12 (Piso 2)', 
      tipo: 'Preliminar / Mediación',
      modalidad: 'Presencial',
      enlaceMeet: '',
      observaciones: 'Llevar poder actualizado y legajos de liquidación.',
      assignedMails: ['fedegarelli2000@gmail.com'], 
      status: 'PENDIENTE' 
    }
  ]);

  const [tasks, setTasks] = useState([
    { id: '1', caseId: '1', title: 'Revisar liquidación de tasa de justicia', priority: 'ALTA', completed: false }
  ]);

  const [newMovement, setNewMovement] = useState({ 
    caseId: '', 
    date: '', 
    title: '', 
    text: '', 
    notes: '',
    convertirATarea: false,
    tareaPrioridad: 'MEDIA',
    convertirAPlazo: false,
    plazoDias: 5,
    agendarAudiencia: false, // <-- NUEVO: Salta automáticamente a audiencias si se marca
    tipoAudiencia: 'Preliminar / Mediación',
    modalidadAudiencia: 'Presencial',
    lugarAudiencia: '',
    agendarEnGoogle: true,
    googleMailsSeleccionados: []
  });

  const [editingMovementId, setEditingMovementId] = useState(null);
  const [editMovementForm, setEditMovementForm] = useState({ title: '', date: '', text: '' });

  // NUEVO FORMULARIO DE AUDIENCIA COMPLETO
  const [newHearing, setNewHearing] = useState({
    caseId: '',
    title: '',
    date: '',
    location: '',
    tipo: 'Preliminar / Mediación',
    modalidad: 'Presencial',
    enlaceMeet: '',
    observaciones: '',
    assignedMails: []
  });

  // --- MÓDULO DE IA AVANZADO ---
  const [chatSessions, setChatSessions] = useState([
    {
      id: 'sess_1',
      title: 'Chat Inicial / Consulta General',
      messages: [
        { role: 'assistant', text: '¡Hola, Dr.! Soy su asistente de IA jurídica para el Estudio MM. ¿Sobre qué ley, causa o consulta legal trabajamos hoy?' }
      ]
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState('sess_1');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [customSources, setCustomSources] = useState([
    { id: 'src_1', title: 'Ley Nacional de Concursos y Quiebras Nº 24.522', content: 'Ley reguladora de concursos preventivos...' },
    { id: 'src_2', title: 'Código Tributario Provincial Córdoba', content: 'Normas sobre apremios fiscales y títulos ejecutivos...' }
  ]);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceContent, setNewSourceContent] = useState('');
  const [showSourceModal, setShowSourceModal] = useState(false);

  const handleAddCustomSource = (e) => {
    e.preventDefault();
    if (!newSourceTitle || !newSourceContent) return;
    const created = { id: 'src_' + Date.now(), title: newSourceTitle, content: newSourceContent };
    const updated = [...customSources, created];
    setCustomSources(updated);
    syncWithCloud('lex_custom_sources', updated);
    setNewSourceTitle('');
    setNewSourceContent('');
    setShowSourceModal(false);
  };

  const deleteCustomSource = (id) => {
    if (!confirm('¿Eliminar esta ley o fuente?')) return;
    const updated = customSources.filter(s => s.id !== id);
    setCustomSources(updated);
    syncWithCloud('lex_custom_sources', updated);
  };

  const handleToggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Su navegador no soporta entrada de voz.');
      return;
    }
    if (isRecording) { setIsRecording(false); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setAiQuery(prev => prev ? `${prev} ${speechText}` : speechText);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleCreateNewChat = () => {
    const newSessionId = 'sess_' + Date.now();
    const newSession = {
      id: newSessionId,
      title: 'Nueva Consulta Legal',
      messages: [{ role: 'assistant', text: 'Nueva sesión iniciada. ¿Qué desea analizar, Dr.?' }]
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentChatId(newSessionId);
  };

  const handleDeleteChatSession = (e, sessionId) => {
    e.stopPropagation();
    if (chatSessions.length <= 1) return;
    const filtered = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(filtered);
    if (currentChatId === sessionId) setCurrentChatId(filtered[0].id);
  };

  const currentChat = chatSessions.find(s => s.id === currentChatId) || chatSessions[0];

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiLoading) return;
    const userMsg = aiQuery.trim();
    const updatedMessages = [...currentChat.messages, { role: 'user', text: userMsg }];
    const chatTitle = currentChat.messages.length === 1 ? (userMsg.length > 25 ? userMsg.substring(0, 25) + '...' : userMsg) : currentChat.title;
    
    setChatSessions(chatSessions.map(s => s.id === currentChatId ? { ...s, title: chatTitle, messages: updatedMessages } : s));
    setAiQuery('');
    setIsAiLoading(true);

    setTimeout(() => {
      let aiResponse = `Dr., analizando su consulta sobre "${userMsg}": Actualmente el estudio cuenta con ${hearings.length} audiencia(s) agendada(s) y ${deadlines.length} plazos pendientes. Verifique los datos en la solapa correspondiente.`;
      const finalMessages = [...updatedMessages, { role: 'assistant', text: aiResponse }];
      setChatSessions(prev => prev.map(s => s.id === currentChatId ? { ...s, messages: finalMessages } : s));
      setIsAiLoading(false);
    }, 800);
  };

  // --- SINCRONIZACIÓN NUBE Y BACKUP ---
  const handleDownloadBackup = () => {
    const fullBackupData = { app: "Estudio Jurídico MM", cases, clients, movements, deadlines, hearings, tasks, fiscalCases };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_EstudioMM_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const syncWithCloud = async (key, value) => {
    try {
      await fetch('/api/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) });
    } catch (e) { console.error(e); }
  };

  const fetchFromCloud = async () => {
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data) {
        if (data.lex_cases) setCases(data.lex_cases);
        if (data.lex_hearings) setHearings(data.lex_hearings);
        if (data.lex_deadlines) setDeadlines(data.lex_deadlines);
        if (data.lex_tasks) setTasks(data.lex_tasks);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchFromCloud();
    const interval = setInterval(fetchFromCloud, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateCases = (val) => { setCases(val); syncWithCloud('lex_cases', val); };
  const updateHearings = (val) => { setHearings(val); syncWithCloud('lex_hearings', val); };
  const updateDeadlines = (val) => { setDeadlines(val); syncWithCloud('lex_deadlines', val); };
  const updateTasks = (val) => { setTasks(val); syncWithCloud('lex_tasks', val); };

  // --- AUTOMATIZACIÓN DESDE MOVIMIENTO DE EXPEDIENTE ---
  const handleAddMovementForCase = (e) => {
    e.preventDefault();
    if (!newMovement.title || !newMovement.date) return;
    const caseTarget = selectedCaseId || newMovement.caseId || cases[0]?.id || '1';
    const targetCase = cases.find(c => c.id === caseTarget);

    const createdMov = {
      id: 'm_' + Date.now(),
      caseId: caseTarget,
      date: newMovement.date,
      title: newMovement.title,
      text: newMovement.text,
      notes: newMovement.notes
    };

    setMovements([...movements, createdMov]);

    // 1. SI SE MARCA AUTOMATIZAR AUDIENCIA: SALTA DIRECTAMENTE A AUDIENCIAS Y CALENDARIO
    if (newMovement.agendarAudiencia) {
      const newHearingObj = {
        id: 'h_' + Date.now(),
        caseId: caseTarget,
        title: `[Exp ${targetCase?.number}] ${newMovement.title}`,
        date: newMovement.date.includes('T') ? newMovement.date : `${newMovement.date}T09:00`,
        location: newMovement.lugarAudiencia || targetCase?.court || 'Juzgado',
        tipo: newMovement.tipoAudiencia,
        modalidad: newMovement.modalidadAudiencia,
        enlaceMeet: '',
        observaciones: newMovement.text,
        assignedMails: teamEmails,
        status: 'PENDIENTE'
      };
      updateHearings([...hearings, newHearingObj]);
    }

    if (newMovement.convertirATarea) {
      const newTaskObj = {
        id: 't_' + Date.now(),
        caseId: caseTarget,
        title: `[Exp ${targetCase?.number}] ${newMovement.title}`,
        priority: newMovement.tareaPrioridad,
        completed: false
      };
      updateTasks([...tasks, newTaskObj]);
    }

    if (newMovement.convertirAPlazo) {
      const movDateObj = new Date(newMovement.date);
      movDateObj.setDate(movDateObj.getDate() + (newMovement.plazoDias || 5));
      const newDeadlineObj = {
        id: 'd_' + Date.now(),
        caseId: caseTarget,
        title: `[Exp ${targetCase?.number}] ${newMovement.title}`,
        dueDate: movDateObj.toISOString().split('T')[0],
        days: newMovement.plazoDias || 5,
        status: 'PENDIENTE',
        isAI: false
      };
      updateDeadlines([...deadlines, newDeadlineObj]);
    }

    if (newMovement.agendarEnGoogle) {
      const startDate = new Date(newMovement.date);
      if (isNaN(startDate.getTime())) startDate.setTime(Date.now());
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const formatGDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

      const googleUrl = new URL('https://calendar.google.com/calendar/render');
      googleUrl.searchParams.append('action', 'TEMPLATE');
      googleUrl.searchParams.append('text', `EXP ${targetCase?.number}: ${newMovement.title}`);
      googleUrl.searchParams.append('dates', `${formatGDate(startDate)}/${formatGDate(endDate)}`);
      googleUrl.searchParams.append('details', `Actuación: ${newMovement.text}`);
      if (newMovement.googleMailsSeleccionados && newMovement.googleMailsSeleccionados.length > 0) {
        googleUrl.searchParams.append('add', newMovement.googleMailsSeleccionados.join(','));
      }
      window.open(googleUrl.toString(), '_blank');
    }

    setNewMovement({ 
      caseId: caseTarget, 
      date: '', 
      title: '', 
      text: '', 
      notes: '',
      convertirATarea: false,
      tareaPrioridad: 'MEDIA',
      convertirAPlazo: false,
      plazoDias: 5,
      agendarAudiencia: false,
      tipoAudiencia: 'Preliminar / Mediación',
      modalidadAudiencia: 'Presencial',
      lugarAudiencia: '',
      agendarEnGoogle: true,
      googleMailsSeleccionados: []
    });
  };

  const handleAddHearingDirect = (e) => {
    e.preventDefault();
    if (!newHearing.title || !newHearing.date) return;
    const caseTarget = selectedCaseId || newHearing.caseId || cases[0]?.id || '1';
    
    const created = {
      ...newHearing,
      caseId: caseTarget,
      id: 'h_' + Date.now(),
      status: 'PENDIENTE',
      assignedMails: newHearing.assignedMails.length > 0 ? newHearing.assignedMails : teamEmails
    };

    const updated = [...hearings, created];
    updateHearings(updated);

    // Sincronizar con Google Calendar
    const startDate = new Date(newHearing.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const formatGDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.append('action', 'TEMPLATE');
    googleUrl.searchParams.append('text', `AUDIENCIA: ${newHearing.title}`);
    googleUrl.searchParams.append('dates', `${formatGDate(startDate)}/${formatGDate(endDate)}`);
    googleUrl.searchParams.append('details', `Modalidad: ${newHearing.modalidad} | Lugar: ${newHearing.location} | Obs: ${newHearing.observaciones}`);
    if (newHearing.location) googleUrl.searchParams.append('location', newHearing.location);
    if (created.assignedMails.length > 0) googleUrl.searchParams.append('add', created.assignedMails.join(','));
    window.open(googleUrl.toString(), '_blank');

    setNewHearing({ caseId: '', title: '', date: '', location: '', tipo: 'Preliminar / Mediación', modalidad: 'Presencial', enlaceMeet: '', observaciones: '', assignedMails: [] });
  };

  const toggleHearingStatus = (id) => {
    updateHearings(hearings.map(h => h.id === id ? { ...h, status: h.status === 'REALIZADA' ? 'PENDIENTE' : 'REALIZADA' } : h));
  };

  const deleteHearing = (id) => {
    if (!confirm('¿Eliminar esta audiencia?')) return;
    updateHearings(hearings.filter(h => h.id !== id));
  };

  const selectedCaseData = cases.find(c => c.id === selectedCaseId);
  const selectedFiscalData = fiscalCases.find(fc => fc.id === selectedFiscalId);

  // ESTADO PARA EL CALENDARIO MENSUAL VISUAL
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
          <div className="flex justify-center items-center text-5xl font-black tracking-tighter">
            <span className="text-orange-500">M</span><span className="text-zinc-500">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">Estudio Jurídico MM</h1>
            <p className="text-xs text-orange-500 font-semibold mt-1">Acceso Privado al Sistema</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white text-xs outline-none focus:border-orange-500"
              />
            </div>
            {loginError && <p className="text-[11px] text-red-500 font-bold bg-red-500/10 p-2 rounded border border-red-500/20">{loginError}</p>}
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs py-3 rounded-lg shadow-lg">
              Ingresar al Estudio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      
      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 z-20 overflow-y-auto">
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
              { id: 'asistente_ia', label: 'Asistente IA Legal', icon: '🤖' },
              { id: 'expedientes', label: 'Expedientes / Causas', icon: '📁' },
              { id: 'movimientos', label: 'Movimientos e Historia', icon: '📜' },
              { id: 'plazos', label: 'Plazos Procesales e IA', icon: '⚡' },
              { id: 'tareas', label: 'Tareas y Pendientes', icon: '✅' },
              { id: 'clientes', label: 'Clientes y Contactos', icon: '👥' },
              { id: 'audiencias', label: 'Audiencias y Calendario', icon: '📅' }, // <-- CORREGIDO NOMBRE AQUÍ
              { id: 'procuracion', label: 'Procuración de Rentas (Cba)', icon: '⚖️' },
              { id: 'configuracion', label: 'Configuración / Backup', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCaseId(null); setSelectedFiscalId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id && !selectedCaseId && !selectedFiscalId
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

        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center bg-zinc-900 shrink-0">
          <div>
            <p className="font-bold text-zinc-300">Estudio Jurídico MM</p>
            <p className="text-[10px] text-emerald-500 font-semibold">● Sincronizado en Nube</p>
          </div>
          <button onClick={handleLogout} title="Cerrar Sesión" className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 rounded transition-colors text-xs">
            🔒
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 z-10">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase">
            {selectedCaseId ? `FICHA DE EXPEDIENTE: ${selectedCaseData?.number}` :
             selectedFiscalId ? `FICHA FISCAL: ${selectedFiscalData?.nroLiquidacion}` :
             activeTab === 'audiencias' ? 'AUDIENCIAS Y CALENDARIO' : activeTab.replace('_', ' ')}
          </h2>
          {(selectedCaseId || selectedFiscalId) && (
            <button onClick={() => { setSelectedCaseId(null); setSelectedFiscalId(null); }} className="bg-orange-500 text-black hover:bg-orange-400 text-xs font-bold px-3 py-1.5 rounded">
              ← Volver al Listado Principal
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950 relative">
          
          {selectedCaseId && selectedCaseData ? (
            <div className="space-y-6 relative z-10">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-orange-500/10 text-orange-400 font-mono text-xs font-bold px-2 py-0.5 rounded border border-orange-500/20">{selectedCaseData.number}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedCaseData.caratula}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedCaseData.court} • Cliente: {selectedCaseData.client}</p>
                  </div>
                  <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded">{selectedCaseData.status}</span>
                </div>
              </div>

              {/* FORMULARIO DE MOVIMIENTO CON AUTOMATIZACIÓN DE AUDIENCIA */}
              <form onSubmit={handleAddMovementForCase} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Movimiento y Automatizar</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input 
                    type="text" placeholder="Título de la actuación (Ej. Decreto Audiencia)" 
                    value={newMovement.title} onChange={e => setNewMovement({...newMovement, title: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                  <input 
                    type="datetime-local" value={newMovement.date} onChange={e => setNewMovement({...newMovement, date: e.target.value})}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                </div>

                <textarea 
                  placeholder="Detalle o texto de la actuación..."
                  value={newMovement.text} onChange={e => setNewMovement({...newMovement, text: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-20"
                />

                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3 text-xs">
                  <p className="font-bold text-orange-400 uppercase text-[10px]">⚡ Automatización Inteligente:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CHECKBOX CLAVE PARA QUE SALTE A AUDIENCIAS Y CALENDARIO */}
                    <label className="flex items-center gap-2 cursor-pointer bg-orange-500/10 p-2.5 rounded border border-orange-500/30">
                      <input 
                        type="checkbox" 
                        checked={newMovement.agendarAudiencia} 
                        onChange={e => setNewMovement({...newMovement, agendarAudiencia: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-orange-400 font-bold">📅 Saltar automáticamente a Audiencias y Calendario</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded border border-zinc-800">
                      <input 
                        type="checkbox" 
                        checked={newMovement.agendarEnGoogle} 
                        onChange={e => setNewMovement({...newMovement, agendarEnGoogle: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span>Sincronizar Google Calendar</span>
                    </label>
                  </div>

                  {newMovement.agendarAudiencia && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                      <select 
                        value={newMovement.tipoAudiencia} 
                        onChange={e => setNewMovement({...newMovement, tipoAudiencia: e.target.value})}
                        className="bg-zinc-900 border border-zinc-800 p-2 rounded text-white"
                      >
                        <option value="Preliminar / Mediación">Preliminar / Mediación</option>
                        <option value="Vista de Causa / Testimonial">Vista de Causa / Testimonial</option>
                        <option value="Absolución de Posiciones">Absolución de Posiciones</option>
                        <option value="Penal / Debates">Penal / Debates</option>
                      </select>
                      <input 
                        type="text" placeholder="Lugar o Juzgado (Ej. Sala 3 / Videollamada)"
                        value={newMovement.lugarAudiencia} onChange={e => setNewMovement({...newMovement, lugarAudiencia: e.target.value})}
                        className="bg-zinc-900 border border-zinc-800 p-2 rounded text-white"
                      />
                    </div>
                  )}
                </div>

                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-5 py-2.5 rounded hover:bg-orange-400">
                  Guardar Movimiento y Ejecutar Automatización
                </button>
              </form>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Movimientos</h4>
                <div className="space-y-3">
                  {movements.filter(m => m.caseId === selectedCaseId).map(m => (
                    <div key={m.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs space-y-1">
                      <div className="flex justify-between font-bold text-zinc-200">
                        <span className="text-orange-400">{m.title}</span>
                        <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
                      </div>
                      {m.text && <p className="text-zinc-300">{m.text}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Causas Activas</span>
                      <h3 className="text-3xl font-black text-white mt-1">{cases.length}</h3>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Audiencias Próximas</span>
                      <h3 className="text-3xl font-black text-orange-500 mt-1">{hearings.filter(h => h.status === 'PENDIENTE').length}</h3>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Plazos Pendientes</span>
                      <h3 className="text-3xl font-black text-white mt-1">{deadlines.filter(d => d.status === 'PENDIENTE').length}</h3>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Tareas</span>
                      <h3 className="text-3xl font-black text-white mt-1">{tasks.filter(t => !t.completed).length}</h3>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'asistente_ia' && (
                <div className="flex h-[calc(100vh-100px)] gap-4 relative z-10">
                  <div className="w-64 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col p-3 shrink-0">
                    <button onClick={handleCreateNewChat} className="w-full bg-orange-500 text-black font-bold text-xs py-2.5 rounded-xl mb-3">
                      ✨ Nuevo Chat Legal
                    </button>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {chatSessions.map((session) => (
                        <div key={session.id} onClick={() => setCurrentChatId(session.id)} className={`flex justify-between p-2.5 rounded-xl text-xs cursor-pointer ${currentChatId === session.id ? 'bg-zinc-800 text-orange-400 font-bold' : 'text-zinc-400 hover:bg-zinc-950'}`}>
                          <span className="truncate pr-2">{session.title}</span>
                          <button onClick={(e) => handleDeleteChatSession(e, session.id)} className="text-zinc-500 hover:text-red-400">🗑️</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                      <h3 className="text-xs font-bold text-orange-500 uppercase">Asistente IA Jurídico MM</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {currentChat.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-orange-500 text-black font-semibold' : 'bg-zinc-950 border border-zinc-800 text-zinc-200'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isAiLoading && <div className="text-zinc-500 text-xs italic animate-pulse">Analizando expedientes y leyes...</div>}
                    </div>
                    <form onSubmit={handleAskAI} className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
                      <button type="button" onClick={handleToggleVoiceRecording} className={`p-3 rounded-xl border ${isRecording ? 'bg-red-500 text-white animate-bounce' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>🎙️</button>
                      <input type="text" placeholder="Consulte con voz o texto..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-xs text-white outline-none focus:border-orange-500" />
                      <button type="submit" className="bg-orange-500 text-black font-bold px-6 py-3.5 rounded-xl text-xs">Enviar</button>
                    </form>
                  </div>
                </div>
              )}

              {/* MÓDULO DE AUDIENCIAS Y CALENDARIO (CON CALENDARIO VISUAL EN EL ESPACIO NEGRO Y DATOS AMPLIADOS) */}
              {activeTab === 'audiencias' && (
                <div className="space-y-6 relative z-10">
                  
                  {/* FORMULARIO DE CARGA DETALLADA DE AUDIENCIA */}
                  <form onSubmit={handleAddHearingDirect} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4 shadow-xl">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agendar Audiencia / Reunión y Sincronizar Google Calendar</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Título de la Audiencia" 
                        value={newHearing.title} onChange={e => setNewHearing({...newHearing, title: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white outline-none focus:border-orange-500"
                      />
                      <input 
                        type="datetime-local" 
                        value={newHearing.date} onChange={e => setNewHearing({...newHearing, date: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white outline-none focus:border-orange-500"
                      />
                      <select 
                        value={newHearing.caseId} onChange={e => setNewHearing({...newHearing, caseId: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="">Vincular a Expediente (Opcional)...</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <select 
                        value={newHearing.tipo} onChange={e => setNewHearing({...newHearing, tipo: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="Preliminar / Mediación">Tipo: Preliminar / Mediación</option>
                        <option value="Vista de Causa / Testimonial">Tipo: Vista de Causa / Testimonial</option>
                        <option value="Absolución de Posiciones">Tipo: Absolución de Posiciones</option>
                        <option value="Penal / Debates">Tipo: Penal / Debates</option>
                      </select>

                      <select 
                        value={newHearing.modalidad} onChange={e => setNewHearing({...newHearing, modalidad: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white outline-none focus:border-orange-500"
                      >
                        <option value="Presencial">Modalidad: Presencial</option>
                        <option value="Virtual (Zoom / Meet)">Modalidad: Virtual (Zoom / Meet)</option>
                        <option value="WhatsApp / Telefónica">Modalidad: WhatsApp / Telefónica</option>
                      </select>

                      <input 
                        type="text" placeholder="Lugar físico o Enlace Meet/Zoom" 
                        value={newHearing.location} onChange={e => setNewHearing({...newHearing, location: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>

                    <textarea 
                      placeholder="Observaciones, documentación a presentar o instrucciones para la audiencia..."
                      value={newHearing.observaciones} onChange={e => setNewHearing({...newHearing, observaciones: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-orange-500 h-16"
                    />

                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-6 py-3 rounded hover:bg-orange-400 shadow-lg">
                      📅 Agendar en Sistema y Google Calendar
                    </button>
                  </form>

                  {/* CALENDARIO VISUAL INTERactivo (OCUPA EL ESPACIO NEGRO Y MUESTRA DÍAS CON AUDIENCIAS) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* CALENDARIO MENSUAL GRÁFICO */}
                    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4 lg:col-span-1 shadow-xl">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">{monthNames[month]} {year}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => setCurrentCalendarDate(new Date(year, month - 1, 1))} className="p-1.5 bg-zinc-800 rounded hover:bg-zinc-700 text-xs">◀</button>
                          <button onClick={() => setCurrentCalendarDate(new Date(year, month + 1, 1))} className="p-1.5 bg-zinc-800 rounded hover:bg-zinc-700 text-xs">▶</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 uppercase">
                        <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const dateStrFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                          const hasHearingToday = hearings.some(h => h.date.startsWith(dateStrFormatted));

                          return (
                            <div 
                              key={dayNum} 
                              className={`p-2 rounded flex flex-col items-center justify-center font-bold transition-all ${
                                hasHearingToday 
                                  ? 'bg-orange-500 text-black shadow-md scale-105' 
                                  : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800'
                              }`}
                            >
                              <span>{dayNum}</span>
                              {hasHearingToday && <span className="w-1 h-1 bg-black rounded-full mt-0.5" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* LISTADO DE AUDIENCIAS AGENDADAS */}
                    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4 lg:col-span-2 shadow-xl">
                      <h4 className="text-xs font-bold text-orange-500 uppercase">Listado de Audiencias y Reuniones Programadas</h4>
                      
                      <div className="space-y-3">
                        {hearings.map(h => (
                          <div key={h.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-500/10 text-orange-400 font-bold px-2 py-0.5 rounded border border-orange-500/20">{h.tipo || 'Audiencia'}</span>
                                <span className="text-zinc-400 font-semibold">{h.modalidad || 'Presencial'}</span>
                              </div>
                              <h5 className="font-bold text-white text-sm">{h.title}</h5>
                              <p className="text-zinc-400">📅 Fecha: <strong className="text-orange-400">{formatDateToArg(h.date)}</strong> • 📍 {h.location}</p>
                              {h.observaciones && <p className="text-zinc-500 italic bg-zinc-900 p-2 rounded mt-1">📝 {h.observaciones}</p>}
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                              <button 
                                onClick={() => toggleHearingStatus(h.id)} 
                                className={`px-3 py-1.5 rounded font-bold text-[10px] ${h.status === 'REALIZADA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
                              >
                                {h.status}
                              </button>
                              <button onClick={() => deleteHearing(h.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded">🗑️</button>
                            </div>
                          </div>
                        ))}
                        {hearings.length === 0 && <p className="text-xs text-zinc-600">No hay audiencias agendadas actualmente.</p>}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'expedientes' && (
                <div className="space-y-6 relative z-10">
                  <div className="space-y-3">
                    {cases.map(c => (
                      <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="bg-orange-500/10 text-orange-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">{c.number}</span>
                          <h4 className="font-bold text-white text-sm mt-1">{c.caratula}</h4>
                        </div>
                        <button onClick={() => setSelectedCaseId(c.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">Ingresar →</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-orange-500 uppercase">Resguardo y Backup</h3>
                    <button onClick={handleDownloadBackup} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl">
                      📥 Descargar Backup General (.JSON)
                    </button>
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
