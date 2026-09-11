'use client';

import React, { useState, useEffect, useRef } from 'react';

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
      setRecoveryMessage(`✅ ¡Correo verificado! Su contraseña actual universal es: "${currentPassword}". Anótela en un lugar seguro.`);
    } else {
      setRecoveryMessage('❌ El correo ingresado no coincide con el mail de recuperación configurado.');
    }
  };

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [newRecoveryMail, setNewRecoveryMail] = useState('');
  const [passMessage, setPassMessage] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPass && newPass !== confirmPass) {
      setPassMessage('❌ Las nuevas contraseñas no coinciden.');
      return;
    }
    if (newPass) {
      setCurrentPassword(newPass);
      updateAppPassword(newPass);
    }
    if (newRecoveryMail) {
      setRecoveryEmailConfig(newRecoveryMail);
      updateRecoveryEmail(newRecoveryMail);
    }
    setPassMessage('✅ ¡Credenciales universales actualizadas en la nube para todos los dispositivos!');
    setNewPass('');
    setConfirmPass('');
    setNewRecoveryMail('');
  };

  // --- NAVEGACIÓN Y ESTADOS ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedFiscalId, setSelectedFiscalId] = useState(null);

  const [teamEmails, setTeamEmails] = useState(['fedegarelli2000@gmail.com', 'mmanginim@hotmail.com', 'estudiojuridicogarelli@gmail.com', '', '', '']);

  const formatDateToArg = (dateStr) => {
    if (!dateStr || dateStr.includes('Sin fecha') || dateStr.includes('Pendiente') || dateStr.includes('A calcular')) return dateStr;
    const parts = dateStr.split('-');
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

  // ESTADO PARA PLANTILLAS DE ESCRITOS
  const [templates, setTemplates] = useState([
    { id: 't1', title: 'Modelo Cédula de Notificación', category: 'Procesal', fileName: 'cedula_notificacion.docx', dataUrl: '' },
    { id: 't2', title: 'Contestación de Demanda Fiscal', category: 'Fiscal', fileName: 'contestacion_excepciones.docx', dataUrl: '' }
  ]);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('Fiscal');
  const [newTemplateFile, setNewTemplateFile] = useState(null);

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateTitle) return;

    if (newTemplateFile) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const created = {
          id: 'tpl_' + Date.now(),
          title: newTemplateTitle,
          category: newTemplateCategory,
          fileName: newTemplateFile.name,
          dataUrl: uploadEvent.target.result
        };
        const updated = [...templates, created];
        setTemplates(updated);
        updateTemplates(updated);
        setNewTemplateTitle('');
        setNewTemplateFile(null);
      };
      reader.readAsDataURL(newTemplateFile);
    } else {
      const created = {
        id: 'tpl_' + Date.now(),
        title: newTemplateTitle,
        category: newTemplateCategory,
        fileName: 'Sin archivo adjunto',
        dataUrl: ''
      };
      const updated = [...templates, created];
      setTemplates(updated);
      updateTemplates(updated);
      setNewTemplateTitle('');
    }
  };

  const deleteTemplate = (id) => {
    if (!confirm('¿Está seguro de eliminar esta plantilla?')) return;
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    updateTemplates(updated);
  };

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

  const [cautelares, setCautelares] = useState([]);
  const [honorariosProcuracion, setHonorariosProcuracion] = useState([]);

  const [newFiscalCase, setNewFiscalCase] = useState({
    tributo: 'Inmobiliario',
    contribuyente: '',
    nroLiquidacion: '',
    periodo: '',
    monto: '',
    fechaVencimientoLiquidacion: '',
    juzgado: 'Juzgado Fiscal Río Cuarto'
  });

  const [newFiscalMovement, setNewFiscalMovement] = useState({ 
    fiscalId: '', 
    date: '', 
    title: 'Cédula de Notificación de Demanda', 
    text: '', 
    estadoProcesal: 'NOTIFICACIÓN DE DEMANDA (3 días excepciones)',
    convertirATarea: false,
    tareaPrioridad: 'ALTA',
    convertirAPlazo: false,
    plazoDias: 3,
    agendarEnGoogle: false,
    googleMailsSeleccionados: []
  });

  const [newCautelar, setNewCautelar] = useState({ fiscalId: '', tipo: 'SOJ (Bancario)', fecha: '', montoEmbargo: '' });
  const [newHonorario, setNewHonorario] = useState({ fiscalId: '', fecha: '', concepto: '', monto: '', tipoIngreso: 'HONORARIOS' });

  const handleAddFiscalCase = (e) => {
    e.preventDefault();
    if (!newFiscalCase.contribuyente || !newFiscalCase.monto || !newFiscalCase.nroLiquidacion) return;

    let prescripcionStr = 'A calcular';
    if (newFiscalCase.fechaVencimientoLiquidacion) {
      const presDate = new Date(newFiscalCase.fechaVencimientoLiquidacion);
      presDate.setFullYear(presDate.getFullYear() + 5);
      prescripcionStr = presDate.toISOString().split('T')[0];
    }

    const created = {
      ...newFiscalCase,
      id: 'f_' + Date.now(),
      fechaNotificacion: '',
      plazoExcepcionesFecha: 'Pendiente Notificación',
      plazoPerencion: 'A calcular (Por movimiento)',
      plazoPrescripcion: prescripcionStr,
      estadoFiscal: 'INICIO / TÍTULO CARGADO',
      cidiNotif: 'Pendiente',
      alertaExcepcionCumplida: false
    };

    const updated = [...fiscalCases, created];
    setFiscalCases(updated);
    updateFiscalCases(updated);

    setNewFiscalCase({
      tributo: 'Inmobiliario',
      contribuyente: '',
      nroLiquidacion: '',
      periodo: '',
      monto: '',
      fechaVencimientoLiquidacion: '',
      juzgado: 'Juzgado Fiscal Río Cuarto'
    });
  };

  const deleteFiscalCase = (id) => {
    if (!confirm('¿Está seguro de eliminar este título ejecutivo fiscal?')) return;
    const upFC = fiscalCases.filter(fc => fc.id !== id);
    setFiscalCases(upFC);
    updateFiscalCases(upFC);

    const upFM = fiscalMovements.filter(fm => fm.fiscalId !== id);
    setFiscalMovements(upFM);
    updateFiscalMovements(upFM);

    const upC = cautelares.filter(c => c.fiscalId !== id);
    setCautelares(upC);
    updateCautelares(upC);

    const upH = honorariosProcuracion.filter(h => h.fiscalId !== id);
    setHonorariosProcuracion(upH);
    updateHonorarios(upH);

    if (selectedFiscalId === id) setSelectedFiscalId(null);
  };

  const handleAddFiscalMovement = (e) => {
    e.preventDefault();
    if (!newFiscalMovement.date) return;
    const targetId = selectedFiscalId || newFiscalMovement.fiscalId;
    if (!targetId) return;

    const targetCase = fiscalCases.find(fc => fc.id === targetId);

    const created = { ...newFiscalMovement, fiscalId: targetId, id: 'fm_' + Date.now() };
    const updatedMovements = [...fiscalMovements, created];
    setFiscalMovements(updatedMovements);
    updateFiscalMovements(updatedMovements);

    const movDateStr = newFiscalMovement.date;
    const movDateObj = new Date(movDateStr);

    let excepcionStr = undefined;
    let perencionStr = undefined;
    let estadoNuevo = newFiscalMovement.estadoProcesal;
    let cidiStatus = 'Notificado vía Cédula/CIDI';

    const perDate = new Date(movDateObj);
    perDate.setMonth(perDate.getMonth() + 6);
    perencionStr = perDate.toISOString().split('T')[0];

    if (newFiscalMovement.title.toLowerCase().includes('cédula') || newFiscalMovement.title.toLowerCase().includes('notificación') || newFiscalMovement.estadoProcesal.includes('3 días')) {
      const expDate = new Date(movDateObj);
      expDate.setDate(expDate.getDate() + 3);
      excepcionStr = expDate.toISOString().split('T')[0];
    }

    const updatedCases = fiscalCases.map(fc => {
      if (fc.id === targetId) {
        return {
          ...fc,
          fechaNotificacion: movDateStr,
          plazoExcepcionesFecha: excepcionStr !== undefined ? excepcionStr : fc.plazoExcepcionesFecha,
          plazoPerencion: perencionStr,
          estadoFiscal: estadoNuevo,
          cidiNotif: cidiStatus,
          alertaExcepcionCumplida: false
        };
      }
      return fc;
    });

    setFiscalCases(updatedCases);
    updateFiscalCases(updatedCases);

    if (newFiscalMovement.convertirATarea) {
      const newTaskObj = {
        id: 't_' + Date.now(),
        caseId: targetId,
        title: `[Liq ${targetCase?.nroLiquidacion}] ${newFiscalMovement.title}`,
        priority: newFiscalMovement.tareaPrioridad,
        completed: false
      };
      updateTasks([...tasks, newTaskObj]);
    }

    if (newFiscalMovement.convertirAPlazo) {
      const dueDateCalc = new Date(movDateObj);
      dueDateCalc.setDate(dueDateCalc.getDate() + (newFiscalMovement.plazoDias || 3));
      const newDeadlineObj = {
        id: 'd_' + Date.now(),
        caseId: targetId,
        title: `[Liq ${targetCase?.nroLiquidacion}] ${newFiscalMovement.title}`,
        dueDate: dueDateCalc.toISOString().split('T')[0],
        days: newFiscalMovement.plazoDias || 3,
        status: 'PENDIENTE',
        isAI: false
      };
      updateDeadlines([...deadlines, newDeadlineObj]);
    }

    if (newFiscalMovement.agendarEnGoogle) {
      const startDate = new Date(movDateObj);
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const formatGDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

      const googleUrl = new URL('https://calendar.google.com/calendar/render');
      googleUrl.searchParams.append('action', 'TEMPLATE');
      googleUrl.searchParams.append('text', `FISCAL LIQ ${targetCase?.nroLiquidacion}: ${newFiscalMovement.title}`);
      googleUrl.searchParams.append('dates', `${formatGDate(startDate)}/${formatGDate(endDate)}`);
      googleUrl.searchParams.append('details', `Actuación registrada en Estudio Jurídico MM. Contribuyente: ${targetCase?.contribuyente}`);
      googleUrl.searchParams.append('reminder', '1440,180');
      if (newFiscalMovement.googleMailsSeleccionados && newFiscalMovement.googleMailsSeleccionados.length > 0) {
        googleUrl.searchParams.append('add', newFiscalMovement.googleMailsSeleccionados.join(','));
      }
      window.open(googleUrl.toString(), '_blank');
    }

    setNewFiscalMovement({ 
      fiscalId: targetId, 
      date: '', 
      title: 'Cédula de Notificación de Demanda', 
      text: '', 
      estadoProcesal: 'NOTIFICACIÓN DE DEMANDA (3 días excepciones)',
      convertirATarea: false,
      tareaPrioridad: 'ALTA',
      convertirAPlazo: false,
      plazoDias: 3,
      agendarEnGoogle: false,
      googleMailsSeleccionados: []
    });
  };

  const handleAddCautelar = (e) => {
    e.preventDefault();
    if (!newCautelar.fecha) return;
    const targetId = selectedFiscalId || newCautelar.fiscalId || fiscalCases[0]?.id;
    const targetCase = fiscalCases.find(fc => fc.id === targetId);
    if (!targetCase) return;

    const created = {
      ...newCautelar,
      fiscalId: targetId,
      nroLiquidacion: targetCase.nroLiquidacion,
      titular: targetCase.contribuyente,
      id: 'c_' + Date.now(),
      estado: 'TRABADA Y VIGENTE'
    };

    const updated = [...cautelares, created];
    setCautelares(updated);
    updateCautelares(updated);
    setNewCautelar({ fiscalId: '', tipo: 'SOJ (Bancario)', fecha: '', montoEmbargo: '' });
  };

  const deleteCautelar = (id) => {
    if (!confirm('¿Está seguro de eliminar o levantar esta medida cautelar?')) return;
    const updated = cautelares.filter(c => c.id !== id);
    setCautelares(updated);
    updateCautelares(updated);
  };

  const handleAddHonorario = (e) => {
    e.preventDefault();
    if (!newHonorario.monto || !newHonorario.concepto) return;
    const targetId = selectedFiscalId || newHonorario.fiscalId || fiscalCases[0]?.id;
    const targetCase = fiscalCases.find(fc => fc.id === targetId);
    if (!targetCase) return;

    const created = {
      ...newHonorario,
      fiscalId: targetId,
      nroLiquidacion: targetCase.nroLiquidacion,
      id: 'h_' + Date.now()
    };

    const updated = [...honorariosProcuracion, created];
    setHonorariosProcuracion(updated);
    updateHonorarios(updated);
    setNewHonorario({ fiscalId: '', fecha: '', concepto: '', monto: '', tipoIngreso: 'HONORARIOS' });
  };

  const deleteHonorario = (id) => {
    if (!confirm('¿Eliminar registro de cobro/honorario?')) return;
    const updated = honorariosProcuracion.filter(h => h.id !== id);
    setHonorariosProcuracion(updated);
    updateHonorarios(updated);
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
      notes: 'Alquileres adeudados julio y agosto: $1.044.800 + servicios $634.422,33. Total: $1.679.222,33.'
    }
  ]);
  
  const [clients, setClients] = useState([
    { id: '1', name: 'Roberto García', role: 'CLIENTE', taxId: '20-34881920-8', email: 'roberto@email.com', phone: '3584123456', address: 'Río Cuarto' },
    { id: '2', name: 'Aseguradora del Sur S.A.', role: 'CONTRAPARTE', taxId: '30-50112233-4', email: 'legales@aseguradora.com', phone: '0800-555-1234', address: 'Córdoba' }
  ]);

  const [movements, setMovements] = useState([
    { id: '1', caseId: '1', date: '2026-08-14', title: 'SOLICITUD DE MEDIACION', text: 'INICIO', notes: '' },
    { id: '2', caseId: '1', date: '2026-09-01', title: 'DECRETO AUDIENCIA', text: 'SEGUNDA AUDIENCIA POR NO LLEGAR A NOTIFICAR LA PRIMERA', notes: '' },
    { id: '3', caseId: '1', date: '2026-09-14', title: 'AUDIENCIA', text: 'Reunión de mediación virtual.', notes: '' }
  ]);

  const [deadlines, setDeadlines] = useState([
    { id: '1', caseId: '1', title: 'Contestar Traslado', dueDate: '2026-09-16', days: 5, status: 'PENDIENTE', isAI: true },
    { id: 'd2', caseId: 'f1', title: '[Liq 8763587] CONTESTACIÓN DE EXCEPCIONES', dueDate: '2026-09-13', days: 3, status: 'PENDIENTE', isAI: false }
  ]);

  const [hearings, setHearings] = useState([
    { id: '1', caseId: '1', title: 'Audiencia Preliminar', date: '2026-09-18T10:00', location: 'Juzgado Civil Nº 12', assignedMails: [], status: 'PENDIENTE' }
  ]);

  const [tasks, setTasks] = useState([
    { id: '1', caseId: '1', title: 'Revisar liquidación de tasa de justicia', priority: 'ALTA', completed: false },
    { id: '2', caseId: '1', title: 'Enviar pliego de preguntas al cliente', priority: 'MEDIA', completed: false }
  ]);

  // --- ESTADO PARA NUEVO MOVIMIENTO Y EDICIÓN ---
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
    agendarEnGoogle: false,
    googleMailsSeleccionados: []
  });

  const [editingMovementId, setEditingMovementId] = useState(null);
  const [editMovementForm, setEditMovementForm] = useState({ title: '', date: '', text: '' });

  // --- MÓDULO DE IA AVANZADO (ESTILO GEMINI + LEYES/FUENTES + CHAT DE VOZ + HISTORIAL LATERAL) ---
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

  // ESTADO PARA LEYES Y FUENTES PERSONALIZADAS CARGADAS
  const [customSources, setCustomSources] = useState([
    { id: 'src_1', title: 'Ley Nacional de Concursos y Quiebras Nº 24.522 (Artículos Principales)', content: 'Ley 24.522 reguladora de concursos preventivos y quiebras en Argentina...' },
    { id: 'src_2', title: 'Código Tributario Provincial Córdoba (Ejecuciones Fiscales)', content: 'Normas sobre apremios fiscales, títulos ejecutivos y excepciones admitidas...' }
  ]);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceContent, setNewSourceContent] = useState('');
  const [showSourceModal, setShowSourceModal] = useState(false);

  const handleAddCustomSource = (e) => {
    e.preventDefault();
    if (!newSourceTitle || !newSourceContent) return;
    const created = {
      id: 'src_' + Date.now(),
      title: newSourceTitle,
      content: newSourceContent
    };
    const updated = [...customSources, created];
    setCustomSources(updated);
    syncWithCloud('lex_custom_sources', updated);
    setNewSourceTitle('');
    setNewSourceContent('');
    setShowSourceModal(false);
  };

  const deleteCustomSource = (id) => {
    if (!confirm('¿Eliminar esta ley o fuente de consulta?')) return;
    const updated = customSources.filter(s => s.id !== id);
    setCustomSources(updated);
    syncWithCloud('lex_custom_sources', updated);
  };

  // MANEJO DE GRABACIÓN DE VOZ (SPEECH TO TEXT)
  const handleToggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Su navegador no soporta entrada de voz por micrófono. Utilice Google Chrome o Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setAiQuery(prev => prev ? `${prev} ${speechText}` : speechText);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleCreateNewChat = () => {
    const newSessionId = 'sess_' + Date.now();
    const newSession = {
      id: newSessionId,
      title: 'Nueva Consulta Legal',
      messages: [
        { role: 'assistant', text: 'Nueva sesión iniciada. ¿Qué ley, expediente o consulta desea analizar, Dr.?' }
      ]
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentChatId(newSessionId);
  };

  const handleDeleteChatSession = (e, sessionId) => {
    e.stopPropagation();
    if (chatSessions.length <= 1) {
      alert('Debe conservar al menos una sesión de chat.');
      return;
    }
    const filtered = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(filtered);
    if (currentChatId === sessionId) {
      setCurrentChatId(filtered[0].id);
    }
  };

  const currentChat = chatSessions.find(s => s.id === currentChatId) || chatSessions[0];

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiLoading) return;

    const userMsg = aiQuery.trim();
    const updatedMessages = [...currentChat.messages, { role: 'user', text: userMsg }];
    
    const chatTitle = currentChat.messages.length === 1 ? (userMsg.length > 25 ? userMsg.substring(0, 25) + '...' : userMsg) : currentChat.title;

    const updatedSessions = chatSessions.map(s => s.id === currentChatId ? { ...s, title: chatTitle, messages: updatedMessages } : s);
    setChatSessions(updatedSessions);
    setAiQuery('');
    setIsAiLoading(true);

    setTimeout(() => {
      let aiResponse = "Analizando su consulta con base en las leyes cargadas...";
      const qLower = userMsg.toLowerCase();

      const matchedSource = customSources.find(s => qLower.includes(s.title.toLowerCase().substring(0, 8)) || s.content.toLowerCase().includes(qLower));

      if (matchedSource) {
        aiResponse = `📖 **Referencia encontrada en su fuente "${matchedSource.title}":**\n\n"${matchedSource.content.substring(0, 350)}..."\n\n*Análisis para el Dr.:* Esta fuente resulta plenamente aplicable al caso planteado bajo los estándares procesales vigentes.`;
      } else if (qLower.includes('plazo') || qLower.includes('venc')) {
        const peds = deadlines.filter(d => d.status === 'PENDIENTE');
        aiResponse = `Dr., actualmente tiene ${peds.length} plazos pendientes:\n` + peds.map(p => `• ${p.title} (Vence: ${formatDateToArg(p.dueDate)})`).join('\n');
      } else if (qLower.includes('fiscal') || qLower.includes('renta') || qLower.includes('zamarbide')) {
        aiResponse = `Dr., posee ${fiscalCases.length} títulos fiscales activos. Destaca la Liquidación Nº ${fiscalCases[0]?.nroLiquidacion} de ${fiscalCases[0]?.contribuyente} por ${fiscalCases[0]?.monto}, con vencimiento de excepciones el ${formatDateToArg(fiscalCases[0]?.plazoExcepcionesFecha)}.`;
      } else if (qLower.includes('causa') || qLower.includes('expediente') || qLower.includes('alquiler')) {
        aiResponse = `Dr., tiene ${cases.length} expediente(s) judicial(es) en trámite:\n` + cases.map(c => `• [${c.number}] ${c.caratula} (${c.court})`).join('\n');
      } else if (qLower.includes('concurso') || qLower.includes('quiebra') || qLower.includes('24.522')) {
        aiResponse = `Dr., conforme a la Ley de Concursos y Quiebras Nº 24.522 cargada en su base, los créditos con garantía real o privilegios especiales se rigen por los artículos específicos de verificación tempestiva y verificación tardía. ¿Desea que redacte un modelo de presentación?`;
      } else {
        aiResponse = `Dr., analizando su consulta ("${userMsg}") frente a las fuentes normativas y expedientes del estudio: Se sugiere revisar la solapa de Procuración Fiscal o cargar una ley específica en el botón superior de "Fuentes" para un cotejo exacto de artículos.`;
      }

      const finalMessages = [...updatedMessages, { role: 'assistant', text: aiResponse }];
      setChatSessions(prev => prev.map(s => s.id === currentChatId ? { ...s, messages: finalMessages } : s));
      setIsAiLoading(false);
    }, 900);
  };

  // --- FUNCIÓN DE BACKUP COMPLETO (JSON DOWNLOAD) ---
  const handleDownloadBackup = () => {
    const fullBackupData = {
      app: "Estudio Jurídico MM - Sistema Operativo",
      fechaBackup: new Date().toISOString(),
      cases,
      clients,
      movements,
      deadlines,
      hearings,
      tasks,
      teamEmails,
      fiscalCases,
      fiscalMovements,
      cautelares,
      honorariosProcuracion,
      templates,
      customSources,
      currentPassword,
      recoveryEmailConfig
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_EstudioMM_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // --- SINCRONIZACIÓN NUBE ---
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
        if (data.lex_fiscal_cases) setFiscalCases(data.lex_fiscal_cases);
        if (data.lex_fiscal_movements) setFiscalMovements(data.lex_fiscal_movements);
        if (data.lex_cautelares) setCautelares(data.lex_cautelares);
        if (data.lex_honorarios) setHonorariosProcuracion(data.lex_honorarios);
        if (data.lex_templates) setTemplates(data.lex_templates);
        if (data.lex_custom_sources) setCustomSources(data.lex_custom_sources);
        if (data.lex_app_password) setCurrentPassword(data.lex_app_password);
        if (data.lex_recovery_email) setRecoveryEmailConfig(data.lex_recovery_email);
      }
    } catch (e) {
      console.error('Error obteniendo de nube:', e);
    }
  };

  useEffect(() => {
    fetchFromCloud();
    const interval = setInterval(fetchFromCloud, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateCases = (val) => { setCases(val); syncWithCloud('lex_cases', val); };
  const updateClients = (val) => { setClients(val); syncWithCloud('lex_clients', val); };
  const updateMovements = (val) => { setMovements(val); syncWithCloud('lex_movements', val); };
  const updateDeadlines = (val) => { setDeadlines(val); syncWithCloud('lex_deadlines', val); };
  const updateHearings = (val) => { setHearings(val); syncWithCloud('lex_hearings', val); };
  const updateTasks = (val) => { setTasks(val); syncWithCloud('lex_tasks', val); };
  const updateTeamEmails = (val) => { setTeamEmails(val); syncWithCloud('lex_emails', val); };
  const updateFiscalCases = (val) => { setFiscalCases(val); syncWithCloud('lex_fiscal_cases', val); };
  const updateFiscalMovements = (val) => { setFiscalMovements(val); syncWithCloud('lex_fiscal_movements', val); };
  const updateCautelares = (val) => { setCautelares(val); syncWithCloud('lex_cautelares', val); };
  const updateHonorarios = (val) => { setHonorariosProcuracion(val); syncWithCloud('lex_honorarios', val); };
  const updateTemplates = (val) => { setTemplates(val); syncWithCloud('lex_templates', val); };
  const updateAppPassword = (val) => { setCurrentPassword(val); syncWithCloud('lex_app_password', val); };
  const updateRecoveryEmail = (val) => { setRecoveryEmailConfig(val); syncWithCloud('lex_recovery_email', val); };

  // FORMULARIOS GENERALES
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  const [newHearing, setNewHearing] = useState({ caseId: '', title: '', date: '', location: '', assignedMails: [] });
  const [newTask, setNewTask] = useState({ caseId: '', title: '', priority: 'MEDIA' });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    const created = { ...newClient, id: 'cli_' + Date.now() };
    const updatedClients = [...clients, created];
    setClients(updatedClients);
    updateClients(updatedClients);
    setNewClient({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  };

  const toggleHearingStatus = (hearingId) => {
    updateHearings(hearings.map(h => h.id === hearingId ? { ...h, status: h.status === 'REALIZADA' ? 'PENDIENTE' : 'REALIZADA' } : h));
  };

  const deleteHearing = (hearingId) => { updateHearings(hearings.filter(h => h.id !== hearingId)); };
  const deleteDeadline = (deadlineId) => { updateDeadlines(deadlines.filter(d => d.id !== deadlineId)); };
  const deleteTask = (taskId) => { updateTasks(tasks.filter(t => t.id !== taskId)); };
  const toggleTask = (taskId) => { updateTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)); };

  const deleteCase = (caseId) => {
    if (!confirm('¿Está seguro de eliminar este expediente?')) return;
    updateCases(cases.filter(c => c.id !== caseId));
    if (selectedCaseId === caseId) setSelectedCaseId(null);
  };

  const deleteClient = (clientId) => {
    if (!confirm('¿Está seguro de eliminar este contacto?')) return;
    const updated = clients.filter(c => c.id !== clientId);
    setClients(updated);
    updateClients(updated);
  };

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

    updateMovements([...movements, createdMov]);

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
      googleUrl.searchParams.append('details', `Actuación registrada en Estudio MM. Carátula: ${targetCase?.caratula}\nDetalle: ${newMovement.text}`);
      googleUrl.searchParams.append('reminder', '1440,180');
      
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
      agendarEnGoogle: false,
      googleMailsSeleccionados: []
    });
  };

  const handleDeleteMovement = (movId) => {
    if (!confirm('¿Está seguro de eliminar este movimiento?')) return;
    updateMovements(movements.filter(m => m.id !== movId));
  };

  const handleStartEditMovement = (m) => {
    setEditingMovementId(m.id);
    setEditMovementForm({ title: m.title, date: m.date, text: m.text });
  };

  const handleSaveEditMovement = (movId) => {
    const updated = movements.map(m => m.id === movId ? { ...m, ...editMovementForm } : m);
    updateMovements(updated);
    setEditingMovementId(null);
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
    googleUrl.searchParams.append('reminder', '1440,180');
    if (newHearing.location) googleUrl.searchParams.append('location', newHearing.location);
    if (newHearing.assignedMails && newHearing.assignedMails.length > 0) {
      googleUrl.searchParams.append('add', newHearing.assignedMails.join(','));
    }

    window.open(googleUrl.toString(), '_blank');
    setNewHearing({ caseId: caseTarget, title: '', date: '', location: '', assignedMails: [] });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const caseTarget = selectedCaseId || newTask.caseId || cases[0]?.id || '1';
    updateTasks([...tasks, { ...newTask, caseId: caseTarget, id: Date.now().toString(), completed: false }]);
    setNewTask({ caseId: caseTarget, title: '', priority: 'MEDIA' });
  };

  const selectedCaseData = cases.find(c => c.id === selectedCaseId);
  const selectedFiscalData = fiscalCases.find(fc => fc.id === selectedFiscalId);

  const today = new Date();
  const urgentFiscalAlerts = fiscalCases.filter(fc => {
    if (fc.alertaExcepcionCumplida) return false;
    if (!fc.plazoExcepcionesFecha || fc.plazoExcepcionesFecha.includes('Pendiente') || fc.plazoExcepcionesFecha.includes('A calcular')) return false;
    const expDate = new Date(fc.plazoExcepcionesFecha);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 10;
  });

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

          {!isRecoveryMode ? (
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

              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsRecoveryMode(true); setRecoveryMessage(''); setRecoveryInputEmail(''); }}
                  className="text-[11px] text-orange-400 hover:underline"
                >
                  ¿Olvidó su contraseña? Recupérela aquí
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRecoverPassword} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Correo de Recuperación Registrado</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@estudio.com"
                  value={recoveryInputEmail}
                  onChange={(e) => setRecoveryInputEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white text-xs outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {recoveryMessage && (
                <p className={`text-[11px] font-bold p-2 rounded border ${recoveryMessage.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {recoveryMessage}
                </p>
              )}

              <button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
              >
                Verificar Correo y Recuperar
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsRecoveryMode(false)}
                  className="text-[11px] text-zinc-400 hover:text-white"
                >
                  ← Volver al login
                </button>
              </div>
            </form>
          )}

          <p className="text-[10px] text-zinc-600">Sesión protegida por seguridad estricta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      
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
              { id: 'audiencias', label: 'Audiencias y Calendar', icon: '📅' },
              { id: 'procuracion', label: 'Procuración de Rentas (Cba)', icon: '⚖️' },
              { id: 'configuracion', label: 'Configuración / Backup', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCaseId(null); setSelectedFiscalId(null); setIsEditingFiscal(false); }}
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
          <button 
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 rounded transition-colors text-xs"
          >
            🔒
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 z-10">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase">
            {selectedCaseId ? `FICHA DE EXPEDIENTE: ${selectedCaseData?.number}` :
             selectedFiscalId ? `FICHA DE LIQUIDACIÓN FISCAL: ${selectedFiscalData?.nroLiquidacion}` :
             activeTab.replace('_', ' ')}
          </h2>
          {(selectedCaseId || selectedFiscalId) && (
            <button 
              onClick={() => { setSelectedCaseId(null); setSelectedFiscalId(null); setIsEditingFiscal(false); }}
              className="bg-orange-500 text-black hover:bg-orange-400 text-xs font-bold px-3 py-1.5 rounded transition-all"
            >
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
                    💬 <strong>Observaciones:</strong> {selectedCaseData.notes}
                  </p>
                )}
              </div>

              <form onSubmit={handleAddMovementForCase} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Movimiento / Actuación</h4>
                
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
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-20"
                />

                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3 text-xs">
                  <p className="font-bold text-orange-400 uppercase text-[10px]">⚡ Automatizar desde este Movimiento:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newMovement.convertirATarea} 
                        onChange={e => setNewMovement({...newMovement, convertirATarea: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span>Agendar como Tarea</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newMovement.convertirAPlazo} 
                        onChange={e => setNewMovement({...newMovement, convertirAPlazo: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span>Agendar como Plazo / Vencimiento</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newMovement.agendarEnGoogle} 
                        onChange={e => setNewMovement({...newMovement, agendarEnGoogle: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-orange-400 font-bold">📅 Agendar Audiencia / Reunión</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-5 py-2.5 rounded hover:bg-orange-400 shadow-lg shadow-orange-500/20">
                  Guardar Movimiento y Automatizar
                </button>
              </form>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Movimientos</h4>
                <div className="space-y-3">
                  {movements.filter(m => m.caseId === selectedCaseId).map(m => (
                    <div key={m.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs space-y-2">
                      {editingMovementId === m.id ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={editMovementForm.title} 
                            onChange={e => setEditMovementForm({...editMovementForm, title: e.target.value})}
                            className="w-full bg-zinc-900 border border-orange-500 p-2 rounded text-white"
                          />
                          <input 
                            type="date" 
                            value={editMovementForm.date} 
                            onChange={e => setEditMovementForm({...editMovementForm, date: e.target.value})}
                            className="w-full bg-zinc-900 border border-orange-500 p-2 rounded text-white"
                          />
                          <textarea 
                            value={editMovementForm.text} 
                            onChange={e => setEditMovementForm({...editMovementForm, text: e.target.value})}
                            className="w-full bg-zinc-900 border border-orange-500 p-2 rounded text-white h-16"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEditMovement(m.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded">Guardar Cambios</button>
                            <button onClick={() => setEditingMovementId(null)} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-center font-bold text-zinc-200">
                            <span className="text-orange-400">{m.title}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
                              <button onClick={() => handleStartEditMovement(m)} className="text-zinc-400 hover:text-white px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800" title="Editar">✏️</button>
                              <button onClick={() => handleDeleteMovement(m.id)} className="text-red-400 hover:text-red-300 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20" title="Eliminar">🗑️</button>
                            </div>
                          </div>
                          {m.text && <p className="text-zinc-300 mt-1 whitespace-pre-wrap">{m.text}</p>}
                        </>
                      )}
                    </div>
                  ))}
                  {movements.filter(m => m.caseId === selectedCaseId).length === 0 && (
                    <p className="text-xs text-zinc-600">No hay actuaciones registradas.</p>
                  )}
                </div>
              </div>
            </div>

          ) : selectedFiscalId && selectedFiscalData ? (

            <div className="space-y-6 relative z-10">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-orange-500/10 text-orange-400 font-mono text-xs font-bold px-2.5 py-1 rounded border border-orange-500/20">
                      Nº Liquidación: {selectedFiscalData.nroLiquidacion}
                    </span>
                    <span className="ml-2 text-xs font-bold bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded">
                      {selectedFiscalData.tributo}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{selectedFiscalData.contribuyente}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Juzgado: {selectedFiscalData.juzgado} • Estado: {selectedFiscalData.estadoFiscal}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-black text-xs font-black px-3 py-1.5 rounded">{selectedFiscalData.monto}</span>
                    <button 
                      onClick={() => startEditingFiscal(selectedFiscalData)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-orange-400 font-bold text-xs px-3 py-1.5 rounded border border-zinc-700 transition-colors"
                    >
                      ✏️ Editar Fechas y Plazos
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs bg-zinc-950 p-3 rounded border border-zinc-800 mt-3">
                  <div>📅 <strong>Vto. Liquidación:</strong> {formatDateToArg(selectedFiscalData.fechaVencimientoLiquidacion) || 'No especificada'}</div>
                  <div>⚠️ <strong className="text-amber-400">Vence Excepción (3d):</strong> {formatDateToArg(selectedFiscalData.plazoExcepcionesFecha)}</div>
                  <div>⏳ <strong className="text-red-400">Perención:</strong> {formatDateToArg(selectedFiscalData.plazoPerencion)}</div>
                  <div>🔒 <strong className="text-purple-400">Prescripción (5a):</strong> {formatDateToArg(selectedFiscalData.plazoPrescripcion)}</div>
                </div>
              </div>
            </div>

          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6 relative z-10">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none -z-10 select-none">
                    <span className="text-[280px] font-black text-orange-500 tracking-tighter">M</span>
                    <span className="text-[280px] font-black text-zinc-400 tracking-tighter">M</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Causas / Liquidaciones</span>
                      <h3 className="text-3xl font-black text-white mt-1">{cases.length + fiscalCases.length}</h3>
                      <p className="text-[10px] text-orange-500 font-semibold mt-1">Expedientes y Títulos Fiscales</p>
                    </div>

                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Plazos Pendientes</span>
                      <h3 className="text-3xl font-black text-orange-500 mt-1">{deadlines.filter(d => d.status === 'PENDIENTE').length}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1">Con vencimiento procesal</p>
                    </div>

                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Tareas Pendientes</span>
                      <h3 className="text-3xl font-black text-white mt-1">{tasks.filter(t => !t.completed).length}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1">Pendientes de resolución</p>
                    </div>

                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl shadow-lg">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Audiencias Agendadas</span>
                      <h3 className="text-3xl font-black text-white mt-1">{hearings.filter(h => h.status === 'PENDIENTE').length}</h3>
                      <p className="text-[10px] text-orange-400 font-semibold mt-1">Pendientes de celebración</p>
                    </div>
                  </div>

                  {urgentFiscalAlerts.length > 0 && (
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-5 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-orange-500 uppercase">🚨 Alertas Urgentes de Procuración Fiscal (Próximos Vencimientos)</h4>
                      {urgentFiscalAlerts.map(fc => (
                        <div key={fc.id} className="p-3 bg-zinc-950 border border-amber-500/40 rounded flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-white text-sm">Liq: {fc.nroLiquidacion} - {fc.contribuyente}</span>
                            <p className="text-[11px] text-zinc-400 mt-1">Vencimiento Excepción: <strong className="text-amber-400">{formatDateToArg(fc.plazoExcepcionesFecha)}</strong></p>
                          </div>
                          <button onClick={() => setSelectedFiscalId(fc.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">
                            Revisar Causa →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MÓDULO DE ASISTENTE IA ESTILO GEMINI CON HISTORIAL LATERAL, MICRÓFONO Y CARGA DE LEYES */}
              {activeTab === 'asistente_ia' && (
                <div className="flex h-[calc(100vh-100px)] gap-4 relative z-10">
                  
                  {/* COLUMNA LATERAL DE HISTORIAL DE CHATS (ESTILO GEMINI) */}
                  <div className="w-64 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col p-3 shrink-0">
                    <button 
                      onClick={handleCreateNewChat}
                      className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all mb-3"
                    >
                      <span>✨</span> Nuevo Chat Legal
                    </button>

                    <div className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-2">Historial de Consultas</div>

                    <div className="flex-1 overflow-y-auto space-y-1">
                      {chatSessions.map((session) => (
                        <div 
                          key={session.id}
                          onClick={() => setCurrentChatId(session.id)}
                          className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                            currentChatId === session.id 
                              ? 'bg-zinc-800 text-orange-400 font-bold border border-zinc-700' 
                              : 'text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200'
                          }`}
                        >
                          <span className="truncate pr-2">{session.title}</span>
                          <button 
                            onClick={(e) => handleDeleteChatSession(e, session.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1 transition-opacity"
                            title="Eliminar chat"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-zinc-800 mt-2">
                      <button 
                        onClick={() => setShowSourceModal(true)}
                        className="w-full bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-bold text-xs py-2 px-3 rounded-xl border border-zinc-800 flex items-center justify-center gap-2 transition-all"
                      >
                        <span>📚</span> Cargar Leyes / Fuentes ({customSources.length})
                      </button>
                    </div>
                  </div>

                  {/* PANEL PRINCIPAL DE CONVERSACIÓN CON LA IA */}
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden relative shadow-2xl">
                    
                    {/* ENCABEZADO */}
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                      <div>
                        <h3 className="text-xs font-bold text-orange-500 uppercase flex items-center gap-2">
                          <span>✨</span> Asistente IA Jurídico (Modo Gemini Pro)
                        </h3>
                        <p className="text-[10px] text-zinc-400">Entrenado con sus expedientes, plazos y las {customSources.length} leyes cargadas en el estudio.</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                        Dr. Activo
                      </span>
                    </div>

                    {/* MENSAJES DEL CHAT */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {currentChat.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-orange-500 text-black font-semibold rounded-br-none shadow-md' 
                              : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-bl-none whitespace-pre-wrap'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isAiLoading && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-950 border border-zinc-800 text-zinc-400 p-4 rounded-2xl text-xs italic animate-pulse">
                            Buscando en leyes y redactando respuesta para el Dr....
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BARRA DE ENTRADA CON MICRÓFONO Y TEXTO */}
                    <form onSubmit={handleAskAI} className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
                      
                      {/* BOTÓN DE MICRÓFONO PARA CHAT DE VOZ */}
                      <button 
                        type="button"
                        onClick={handleToggleVoiceRecording}
                        title="Hablar por micrófono"
                        className={`p-3 rounded-xl border transition-all ${
                          isRecording 
                            ? 'bg-red-500 text-white border-red-400 animate-bounce' 
                            : 'bg-zinc-900 text-zinc-300 hover:text-white border-zinc-800'
                        }`}
                      >
                        🎙️
                      </button>

                      <input 
                        type="text" 
                        placeholder={isRecording ? "Escuchando su consulta por voz..." : "Pregunte sobre jurisprudencia, plazos, redacción o leyes cargadas..."} 
                        value={aiQuery} 
                        onChange={e => setAiQuery(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-xs text-white outline-none focus:border-orange-500 transition-colors"
                      />

                      <button 
                        type="submit" 
                        className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3.5 rounded-xl text-xs transition-colors shadow-lg shadow-orange-500/20"
                      >
                        Enviar
                      </button>
                    </form>
                  </div>

                  {/* MODAL DE GESTIÓN Y CARGA DE LEYES / FUENTES */}
                  {showSourceModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl p-6 space-y-5 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                          <h3 className="text-sm font-bold text-orange-500 uppercase">📚 Fuentes, Leyes y Códigos para la IA</h3>
                          <button onClick={() => setShowSourceModal(false)} className="text-zinc-400 hover:text-white text-xs">✕ Cerrar</button>
                        </div>

                        <form onSubmit={handleAddCustomSource} className="space-y-3">
                          <p className="text-[11px] text-zinc-400">Agregue artículos de leyes, códigos procesales o doctrinas para que la IA los consulte al responder.</p>
                          <input 
                            type="text" 
                            placeholder="Título de la Ley o Fuente (ej. Ley 24.522 Art. 256)" 
                            value={newSourceTitle} 
                            onChange={e => setNewSourceTitle(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none focus:border-orange-500"
                          />
                          <textarea 
                            placeholder="Texto de la ley, artículo o normativa..." 
                            value={newSourceContent} 
                            onChange={e => setNewSourceContent(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none focus:border-orange-500 h-28"
                          />
                          <button type="submit" className="w-full bg-orange-500 text-black font-bold text-xs py-3 rounded-xl hover:bg-orange-400">
                            Guardar Fuente en la Memoria de la IA
                          </button>
                        </form>

                        <div className="space-y-2 pt-2 border-t border-zinc-800 max-h-48 overflow-y-auto">
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase">Fuentes ya cargadas ({customSources.length}):</h4>
                          {customSources.map(s => (
                            <div key={s.id} className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs">
                              <span className="font-bold text-zinc-200 truncate pr-2">{s.title}</span>
                              <button onClick={() => deleteCustomSource(s.id)} className="text-red-400 hover:text-red-300">🗑️</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {activeTab === 'expedientes' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCase.number || !newCase.caratula) return;
                    const clientSelected = newCase.client || (clients[0] ? clients[0].name : 'Sin Cliente');
                    const created = { ...newCase, client: clientSelected, id: Date.now().toString(), status: 'EN TRAMITE' };
                    updateCases([...cases, created]);
                    setNewCase({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
                  }} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
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
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Expediente
                    </button>
                  </form>

                  <div className="space-y-3">
                    {cases.map(c => (
                      <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2 flex justify-between items-center">
                        <div onClick={() => setSelectedCaseId(c.id)} className="cursor-pointer flex-1">
                          <span className="bg-orange-500/10 text-orange-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/20">{c.number}</span>
                          <h4 className="font-bold text-white text-sm mt-1">{c.caratula}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedCaseId(c.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">Ingresar →</button>
                          <button onClick={() => deleteCase(c.id)} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded font-bold text-xs">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'movimientos' && (
                <div className="space-y-6 relative z-10">
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
                        .map(m => (
                          <div key={m.id} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-orange-400">{m.title}</span>
                              <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
                            </div>
                            {m.text && <p className="text-zinc-300 mt-1">{m.text}</p>}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

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
                      <input 
                        type="number" placeholder="Días hábiles" 
                        value={newDeadline.days} onChange={e => setNewDeadline({...newDeadline, days: parseInt(e.target.value)})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">Registrar Plazo</button>
                  </form>

                  <div className="space-y-3">
                    {deadlines.map(d => (
                      <div key={d.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <h4 className="font-bold text-white">{d.title}</h4>
                          <p className="text-zinc-500">Vence: {formatDateToArg(d.dueDate)} ({d.days} días)</p>
                        </div>
                        <button onClick={() => deleteDeadline(d.id)} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded font-bold">🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'audiencias' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddHearingAndSyncGoogle} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agendar y Notificar Audiencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Título de Audiencia" 
                        value={newHearing.title} onChange={e => setNewHearing({...newHearing, title: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                      <input 
                        type="datetime-local" value={newHearing.date} onChange={e => setNewHearing({...newHearing, date: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400">
                      📅 Agendar en Google Calendar
                    </button>
                  </form>
                </div>
              )}

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
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">Guardar Tarea</button>
                  </form>

                  <div className="space-y-2">
                    {tasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} className="w-4 h-4 accent-orange-500 cursor-pointer" />
                          <span className={t.completed ? 'line-through text-zinc-500' : 'text-zinc-100 font-bold'}>{t.title}</span>
                        </div>
                        <button onClick={() => deleteTask(t.id)} className="bg-red-500/10 text-red-400 p-1 rounded">🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded">Guardar</button>
                  </form>
                </div>
              )}

              {activeTab === 'procuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-2 overflow-x-auto">
                    {[
                      { id: 'titulos', label: '1. Títulos y Vto. de Liquidación' },
                      { id: 'gestion', label: '2. Plazos y Perención' },
                      { id: 'cautelares', label: '3. Medidas Cautelares' },
                      { id: 'pagos', label: '4. Cobros y Honorarios' },
                      { id: 'tabla_plazos', label: '5. 📋 Tabla de Plazos Procesales' },
                      { id: 'plantillas', label: '6. 📄 Plantillas de Escritos' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setProcuracionSubTab(sub.id)}
                        className={`px-3 py-2 rounded text-xs font-bold whitespace-nowrap transition-all ${
                          procuracionSubTab === sub.id 
                            ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' 
                            : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {procuracionSubTab === 'titulos' && (
                    <div className="space-y-4">
                      <form onSubmit={handleAddFiscalCase} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Carga Inicial de Título Fiscal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <input 
                            type="text" placeholder="Contribuyente" 
                            value={newFiscalCase.contribuyente} onChange={e => setNewFiscalCase({...newFiscalCase, contribuyente: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                          <input 
                            type="text" placeholder="Nº de Liquidación" 
                            value={newFiscalCase.nroLiquidacion} onChange={e => setNewFiscalCase({...newFiscalCase, nroLiquidacion: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                          <input 
                            type="text" placeholder="Monto Total ($)" 
                            value={newFiscalCase.monto} onChange={e => setNewFiscalCase({...newFiscalCase, monto: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded">Registrar Título</button>
                      </form>

                      <div className="space-y-3">
                        {fiscalCases.map(fc => (
                          <div key={fc.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs space-y-2">
                            <div className="flex justify-between items-center font-bold text-white">
                              <div onClick={() => setSelectedFiscalId(fc.id)} className="cursor-pointer flex-1">
                                <span className="bg-orange-500/10 text-orange-400 font-mono px-2 py-0.5 rounded border border-orange-500/25 mr-2">Liq: {fc.nroLiquidacion}</span>
                                <span className="text-white text-sm">{fc.contribuyente}</span>
                              </div>
                              <span className="text-orange-400 font-mono text-sm">{fc.monto}</span>
                            </div>
                            <button onClick={() => setSelectedFiscalId(fc.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">Ingresar a Ficha →</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'tabla_plazos' && (
                    <div className="space-y-4">
                      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
                        <h3 className="text-sm font-bold text-orange-500 uppercase">📋 Guía de Plazos Procesales - Procuración Fiscal (Córdoba)</h3>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-zinc-950 text-orange-400 uppercase border-b border-zinc-800">
                            <tr>
                              <th className="p-3">Actuación / Trámite</th>
                              <th className="p-3">Plazo Legal</th>
                              <th className="p-3">Normativa / Observaciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800 text-zinc-300">
                            <tr>
                              <td className="p-3 font-bold text-white">Oponer Excepciones</td>
                              <td className="p-3 text-amber-400 font-bold">3 días hábiles</td>
                              <td className="p-3 text-zinc-400">Desde la notificación fehaciente (Cédula / CIDI).</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Perención de Instancia</td>
                              <td className="p-3 text-red-400 font-bold">6 meses</td>
                              <td className="p-3 text-zinc-400">Se renueva con cada movimiento procesal.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Prescripción Fiscal</td>
                              <td className="p-3 text-purple-400 font-bold">5 años</td>
                              <td className="p-3 text-zinc-400">Desde el vencimiento de la obligación.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'plantillas' && (
                    <div className="space-y-4">
                      <form onSubmit={handleAddTemplate} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Subir Plantilla de Escrito</h3>
                        <input 
                          type="text" placeholder="Nombre de la plantilla" 
                          value={newTemplateTitle} onChange={e => setNewTemplateTitle(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white text-xs outline-none focus:border-orange-500"
                        />
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded">Guardar Plantilla</button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-orange-500 uppercase">💾 Resguardo y Backup Completo</h3>
                    <button onClick={handleDownloadBackup} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors">
                      📥 Descargar Backup (.JSON)
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
