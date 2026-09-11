'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('Gina2468');
  const [recoveryEmailConfig, setRecoveryEmailConfig] = useState('fedegarelli2000@gmail.com');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryInputEmail, setRecoveryInputEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('lex_auth') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('lex_auth', 'true');
    } else {
      setLoginError('Contraseña incorrecta.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lex_auth');
    setIsAuthenticated(false);
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedFiscalId, setSelectedFiscalId] = useState(null);

  const formatDateToArg = (dateStr) => {
    if (!dateStr || dateStr.includes('Sin fecha') || dateStr.includes('Pendiente')) return dateStr;
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // MÓDULOS COMPLETOS
  const [procuracionSubTab, setProcuracionSubTab] = useState('titulos');
  const [fiscalCases, setFiscalCases] = useState([
    {
      id: 'f1', tributo: 'Inmobiliario', contribuyente: 'ZAMARBIDE', nroLiquidacion: '8763587', periodo: '2026', monto: '$99.800.000',
      fechaVencimientoLiquidacion: '2025-01-20', fechaNotificacion: '2026-09-10', plazoExcepcionesFecha: '2026-09-13',
      plazoPerencion: '2027-03-10', plazoPrescripcion: '2030-01-20', estadoFiscal: 'TÍTULO PRESENTADO / NOTIFICADO', juzgado: 'Juzgado Fiscal Río Cuarto'
    }
  ]);
  const [fiscalMovements, setFiscalMovements] = useState([]);
  const [cautelares, setCautelares] = useState([]);
  const [honorariosProcuracion, setHonorariosProcuracion] = useState([]);
  const [templates, setTemplates] = useState([
    { id: 't1', title: 'Cédula de Notificación', category: 'Procesal', fileName: 'cedula.docx' },
    { id: 't2', title: 'Contestación de Demanda Fiscal', category: 'Fiscal', fileName: 'contestacion.docx' }
  ]);

  const [cases, setCases] = useState([
    { id: '1', number: '14900698', caratula: 'Cámara de Alquileres / Cobro', court: 'Juzgado Civil Nº 12', client: 'Cámara', processType: 'JUDICIAL', status: 'EN TRAMITE', notes: 'Alquileres adeudados.' }
  ]);
  const [clients, setClients] = useState([{ id: '1', name: 'Roberto García', role: 'CLIENTE', taxId: '20-34881920-8', email: 'roberto@email.com', phone: '3584123456' }]);
  const [movements, setMovements] = useState([{ id: '1', caseId: '1', date: '2026-08-14', title: 'INICIO DE MEDIACIÓN', text: 'Se presentó solicitud.' }]);
  const [deadlines, setDeadlines] = useState([{ id: '1', caseId: '1', title: 'Contestar Traslado', dueDate: '2026-09-16', days: 5, status: 'PENDIENTE' }]);
  const [hearings, setHearings] = useState([{ id: 'h1', caseId: '1', title: 'Audiencia Preliminar', date: '2026-09-18T10:00', location: 'Juzgado Civil Nº 12', tipo: 'Preliminar / Mediación', modalidad: 'Presencial', status: 'PENDIENTE' }]);
  const [tasks, setTasks] = useState([{ id: '1', caseId: '1', title: 'Revisar liquidación', priority: 'ALTA', completed: false }]);

  // FORMULARIOS DETALLADOS
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newMovement, setNewMovement] = useState({ caseId: '', date: '', title: '', text: '', convertirATarea: false, convertirAPlazo: false, agendarAudiencia: false, tipoAudiencia: 'Preliminar / Mediación', modalidadAudiencia: 'Presencial', lugarAudiencia: '', agendarEnGoogle: true });
  const [newHearing, setNewHearing] = useState({ caseId: '', title: '', date: '', location: '', tipo: 'Preliminar / Mediación', modalidad: 'Presencial', observaciones: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  const [newTask, setNewTask] = useState({ caseId: '', title: '', priority: 'MEDIA' });

  // IA Y CHAT
  const [chatSessions, setChatSessions] = useState([{ id: 'sess_1', title: 'Consulta General', messages: [{ role: 'assistant', text: 'Hola, Dr. ¿En qué le asisto hoy?' }] }]);
  const [currentChatId, setCurrentChatId] = useState('sess_1');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [customSources, setCustomSources] = useState([{ id: 'src_1', title: 'Ley 24.522 Concursos y Quiebras', content: 'Artículo 1...' }]);
  const [showSourceModal, setShowSourceModal] = useState(false);

  const currentChat = chatSessions.find(s => s.id === currentChatId) || chatSessions[0];

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiLoading) return;
    const userMsg = aiQuery.trim();
    const updatedMessages = [...currentChat.messages, { role: 'user', text: userMsg }];
    setChatSessions(chatSessions.map(s => s.id === currentChatId ? { ...s, messages: updatedMessages } : s));
    setAiQuery('');
    setIsAiLoading(true);
    setTimeout(() => {
      const aiResponse = `Dr., analizando su consulta ("${userMsg}") frente a las fuentes y normativas del estudio: El sistema procesal vigente y las leyes cargadas respaldan esta vía.`;
      setChatSessions(prev => prev.map(s => s.id === currentChatId ? { ...s, messages: [...updatedMessages, { role: 'assistant', text: aiResponse }] } : s));
      setIsAiLoading(false);
    }, 800);
  };

  const handleToggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Su navegador no soporta voz.'); return; }
    if (isRecording) { setIsRecording(false); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      setAiQuery(prev => prev ? `${prev} ${event.results[0][0].transcript}` : event.results[0][0].transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleAddMovementForCase = (e) => {
    e.preventDefault();
    if (!newMovement.title || !newMovement.date) return;
    const caseTarget = selectedCaseId || newMovement.caseId || cases[0]?.id || '1';
    const targetCase = cases.find(c => c.id === caseTarget);

    setMovements([...movements, { id: 'm_' + Date.now(), caseId: caseTarget, date: newMovement.date, title: newMovement.title, text: newMovement.text }]);

    if (newMovement.agendarAudiencia) {
      setHearings([...hearings, {
        id: 'h_' + Date.now(), caseId: caseTarget,
        title: `[Exp ${targetCase?.number}] ${newMovement.title}`,
        date: newMovement.date.includes('T') ? newMovement.date : `${newMovement.date}T09:00`,
        location: newMovement.lugarAudiencia || targetCase?.court || 'Juzgado',
        tipo: newMovement.tipoAudiencia, modalidad: newMovement.modalidadAudiencia,
        observaciones: newMovement.text, status: 'PENDIENTE'
      }]);
    }
    setNewMovement({ caseId: '', date: '', title: '', text: '', convertirATarea: false, convertirAPlazo: false, agendarAudiencia: false, tipoAudiencia: 'Preliminar / Mediación', modalidadAudiencia: 'Presencial', lugarAudiencia: '', agendarEnGoogle: true });
  };

  const handleAddHearingDirect = (e) => {
    e.preventDefault();
    if (!newHearing.title || !newHearing.date) return;
    setHearings([...hearings, { ...newHearing, id: 'h_' + Date.now(), caseId: selectedCaseId || cases[0]?.id || '1', status: 'PENDIENTE' }]);
    setNewHearing({ caseId: '', title: '', date: '', location: '', tipo: 'Preliminar / Mediación', modalidad: 'Presencial', observaciones: '' });
  };

  const toggleHearingStatus = (id) => {
    setHearings(hearings.map(h => h.id === id ? { ...h, status: h.status === 'REALIZADA' ? 'PENDIENTE' : 'REALIZADA' } : h));
  };

  const deleteHearing = (id) => { setHearings(hearings.filter(h => h.id !== id)); };

  // CALENDARIO MENSUAL VISUAL
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
          <h1 className="text-lg font-bold text-white uppercase tracking-wider">Estudio Jurídico MM</h1>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input type="password" placeholder="Contraseña" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white text-xs outline-none focus:border-orange-500" />
            {loginError && <p className="text-[11px] text-red-500 font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-orange-500 text-black font-bold text-xs py-3 rounded-lg">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 z-20 overflow-y-auto">
        <div>
          <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
            <span className="text-orange-500 text-3xl font-black">MM</span>
            <div><h1 className="font-bold text-white text-sm uppercase">LexStudio</h1><p className="text-[10px] text-orange-500 font-semibold">GESTIÓN LEGAL MM</p></div>
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
              { id: 'audiencias', label: 'Audiencias y Calendario', icon: '📅' },
              { id: 'procuracion', label: 'Procuración de Rentas (Cba)', icon: '⚖️' },
              { id: 'configuracion', label: 'Configuración / Backup', icon: '⚙️' }
            ].map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedCaseId(null); setSelectedFiscalId(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${activeTab === tab.id && !selectedCaseId ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center">
          <span>Dr. Activo</span>
          <button onClick={handleLogout} className="text-red-400">🔒</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase">
            {selectedCaseId ? `EXPEDIENTE: ${cases.find(c => c.id === selectedCaseId)?.number}` : activeTab === 'audiencias' ? 'AUDIENCIAS Y CALENDARIO' : activeTab.replace('_', ' ')}
          </h2>
          {selectedCaseId && <button onClick={() => setSelectedCaseId(null)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">← Volver</button>}
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950 relative">
          {selectedCaseId ? (
            <div className="space-y-6">
              <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
                <h3 className="text-lg font-bold text-white">{cases.find(c => c.id === selectedCaseId)?.caratula}</h3>
                <p className="text-xs text-zinc-400">{cases.find(c => c.id === selectedCaseId)?.court}</p>
              </div>

              {/* FORMULARIO DE MOVIMIENTO CON AUTOMATIZACIÓN DE AUDIENCIA */}
              <form onSubmit={handleAddMovementForCase} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Movimiento y Automatizar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input type="text" placeholder="Título (Ej. Decreto Audiencia)" value={newMovement.title} onChange={e => setNewMovement({...newMovement, title: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white" />
                  <input type="datetime-local" value={newMovement.date} onChange={e => setNewMovement({...newMovement, date: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white" />
                </div>
                <textarea placeholder="Texto de la actuación..." value={newMovement.text} onChange={e => setNewMovement({...newMovement, text: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white h-20" />
                
                <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-orange-400 font-bold">
                    <input type="checkbox" checked={newMovement.agendarAudiencia} onChange={e => setNewMovement({...newMovement, agendarAudiencia: e.target.checked})} className="w-4 h-4 accent-orange-500" />
                    📅 Saltar automáticamente a Audiencias y Calendario
                  </label>
                  {newMovement.agendarAudiencia && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <select value={newMovement.tipoAudiencia} onChange={e => setNewMovement({...newMovement, tipoAudiencia: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-2 rounded text-white">
                        <option value="Preliminar / Mediación">Preliminar / Mediación</option>
                        <option value="Vista de Causa / Testimonial">Vista de Causa</option>
                      </select>
                      <input type="text" placeholder="Lugar / Sala" value={newMovement.lugarAudiencia} onChange={e => setNewMovement({...newMovement, lugarAudiencia: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-2 rounded text-white" />
                    </div>
                  )}
                </div>
                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded">Guardar Movimiento</button>
              </form>

              <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">Actuaciones del Expediente</h4>
                {movements.filter(m => m.caseId === selectedCaseId).map(m => (
                  <div key={m.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs">
                    <span className="font-bold text-orange-400">{m.title}</span> - <span className="text-zinc-400">{formatDateToArg(m.date)}</span>
                    <p className="text-zinc-300 mt-1">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><span className="text-xs text-zinc-400">Causas Activas</span><h3 className="text-3xl font-black text-white">{cases.length}</h3></div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><span className="text-xs text-zinc-400">Audiencias Próximas</span><h3 className="text-3xl font-black text-orange-500">{hearings.length}</h3></div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><span className="text-xs text-zinc-400">Plazos Procesales</span><h3 className="text-3xl font-black text-white">{deadlines.length}</h3></div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><span className="text-xs text-zinc-400">Tareas</span><h3 className="text-3xl font-black text-white">{tasks.length}</h3></div>
                </div>
              )}

              {activeTab === 'asistente_ia' && (
                <div className="flex h-[calc(100vh-100px)] gap-4">
                  <div className="w-64 bg-zinc-900 p-3 rounded-2xl border border-zinc-800 flex flex-col">
                    <button onClick={() => setShowSourceModal(true)} className="w-full bg-zinc-950 text-zinc-300 font-bold text-xs py-2 rounded-xl border border-zinc-800 mb-3">📚 Cargar Leyes ({customSources.length})</button>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {chatSessions.map(s => <div key={s.id} onClick={() => setCurrentChatId(s.id)} className="p-2.5 rounded-xl text-xs bg-zinc-800 text-orange-400 font-bold cursor-pointer truncate">{s.title}</div>)}
                    </div>
                  </div>
                  <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {currentChat.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-2xl p-4 rounded-2xl text-xs ${msg.role === 'user' ? 'bg-orange-500 text-black font-semibold' : 'bg-zinc-950 border border-zinc-800 text-zinc-200'}`}>{msg.text}</div>
                        </div>
                      ))}
                      {isAiLoading && <div className="text-zinc-400 text-xs italic">Pensando respuesta...</div>}
                    </div>
                    <form onSubmit={handleAskAI} className="p-4 bg-zinc-950 border-t border-zinc-800 flex gap-2">
                      <button type="button" onClick={handleToggleVoiceRecording} className={`p-3 rounded-xl border ${isRecording ? 'bg-red-500 text-white' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>🎙️</button>
                      <input type="text" placeholder="Pregunte con voz o texto..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-xs text-white" />
                      <button type="submit" className="bg-orange-500 text-black font-bold px-6 py-3.5 rounded-xl text-xs">Enviar</button>
                    </form>
                  </div>
                </div>
              )}

              {/* AUDIENCIAS Y CALENDARIO INTERACTIVO */}
              {activeTab === 'audiencias' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddHearingDirect} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agendar Audiencia o Reunión</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input type="text" placeholder="Título de Audiencia" value={newHearing.title} onChange={e => setNewHearing({...newHearing, title: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white" />
                      <input type="datetime-local" value={newHearing.date} onChange={e => setNewHearing({...newHearing, date: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white" />
                      <select value={newHearing.caseId} onChange={e => setNewHearing({...newHearing, caseId: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white">
                        <option value="">Vincular a Expediente...</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <select value={newHearing.tipo} onChange={e => setNewHearing({...newHearing, tipo: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white">
                        <option value="Preliminar / Mediación">Preliminar / Mediación</option>
                        <option value="Vista de Causa">Vista de Causa</option>
                      </select>
                      <select value={newHearing.modalidad} onChange={e => setNewHearing({...newHearing, modalidad: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white">
                        <option value="Presencial">Presencial</option>
                        <option value="Virtual">Virtual</option>
                      </select>
                      <input type="text" placeholder="Lugar / Enlace" value={newHearing.location} onChange={e => setNewHearing({...newHearing, location: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded text-white" />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-5 py-2.5 rounded">Agendar Audiencia</button>
                  </form>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">
                      <h4 className="text-xs font-bold text-orange-500 uppercase">{monthNames[month]} {year}</h4>
                      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 uppercase"><span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span></div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={i} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const hasHearingToday = hearings.some(h => h.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`));
                          return <div key={dayNum} className={`p-2 rounded font-bold ${hasHearingToday ? 'bg-orange-500 text-black' : 'bg-zinc-950 text-zinc-300'}`}>{dayNum}</div>;
                        })}
                      </div>
                    </div>

                    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3 lg:col-span-2">
                      <h4 className="text-xs font-bold text-orange-500 uppercase">Listado de Audiencias</h4>
                      {hearings.map(h => (
                        <div key={h.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <span className="text-orange-400 font-bold">{h.tipo}</span>
                            <h5 className="font-bold text-white text-sm">{h.title}</h5>
                            <p className="text-zinc-400">📅 {formatDateToArg(h.date)} • 📍 {h.location}</p>
                          </div>
                          <button onClick={() => deleteHearing(h.id)} className="text-red-400">🗑️</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'expedientes' && (
                <div className="space-y-4">
                  <form onSubmit={(e) => { e.preventDefault(); if(!newCase.number) return; setCases([...cases, { ...newCase, id: Date.now().toString(), status: 'EN TRAMITE' }]); setNewCase({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' }); }} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Nuevo Expediente</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <input type="text" placeholder="Nº Expediente" value={newCase.number} onChange={e => setNewCase({...newCase, number: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white" />
                      <input type="text" placeholder="Carátula" value={newCase.caratula} onChange={e => setNewCase({...newCase, caratula: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white" />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded">Guardar</button>
                  </form>
                  {cases.map(c => (
                    <div key={c.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                      <div><span className="text-orange-400 font-mono font-bold">Nº {c.number}</span><h4 className="font-bold text-white text-sm mt-1">{c.caratula}</h4></div>
                      <button onClick={() => setSelectedCaseId(c.id)} className="bg-orange-500 text-black font-bold px-3 py-1.5 rounded">Ficha →</button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'procuracion' && (
                <div className="space-y-4">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-2">
                    <button onClick={() => setProcuracionSubTab('titulos')} className={`px-3 py-2 rounded text-xs font-bold ${procuracionSubTab === 'titulos' ? 'bg-orange-500 text-black' : 'bg-zinc-950 text-zinc-400'}`}>1. Títulos Fiscales</button>
                    <button onClick={() => setProcuracionSubTab('tabla_plazos')} className={`px-3 py-2 rounded text-xs font-bold ${procuracionSubTab === 'tabla_plazos' ? 'bg-orange-500 text-black' : 'bg-zinc-950 text-zinc-400'}`}>5. Tabla de Plazos</button>
                  </div>
                  {procuracionSubTab === 'tabla_plazos' && (
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-950 text-orange-400 border-b border-zinc-800"><tr><th className="p-3">Trámite</th><th className="p-3">Plazo Legal</th></tr></thead>
                        <tbody className="divide-y divide-zinc-800 text-zinc-300">
                          <tr><td className="p-3 font-bold">Excepciones Fiscales</td><td className="p-3 text-amber-400 font-bold">3 días hábiles</td></tr>
                          <tr><td className="p-3 font-bold">Perención</td><td className="p-3 text-red-400 font-bold">6 meses</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                  <h3 className="text-sm font-bold text-orange-500 uppercase mb-3">Backup y Resguardo</h3>
                  <button onClick={() => alert('Backup descargado')} className="bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl">📥 Descargar Resguardo (.JSON)</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
