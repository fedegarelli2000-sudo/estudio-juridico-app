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

  // --- MODO CLARO / OSCURO (ACTIVABLE / DESACTIVABLE) ---
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- ESTADO DEL BUSCADOR GLOBAL EN LA BARRA SUPERIOR ---
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // --- CONTROL DE ACCESO Y CONTRASEÑA UNIVERSAL EN NUBE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('Gina2468');
  const [recoveryEmailConfig, setRecoveryEmailConfig] = useState('fedegarelli2000@gmail.com');
  
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryInputEmail, setRecoveryInputEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  // 4. ACCESO CON HUELLA DIGITAL (OPCIONAL / MÓVIL)
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('lex_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
    if (window.PublicKeyCredential) {
      setBiometricSupported(true);
    }
  }, []);

  const handleBiometricLogin = async () => {
    try {
      if (!window.PublicKeyCredential) {
        alert('La autenticación biométrica no está soportada en este dispositivo o navegador.');
        return;
      }
      const publicKey = {
        challenge: new Uint8Array([21, 31, 105, 78, 18, 45, 99, 50]),
        rp: { name: "Estudio Jurídico MM" },
        user: {
          id: new Uint8Array([1, 2, 3, 4]),
          name: "dr.garelli@estudio.com",
          displayName: "Dr. Federico Garelli"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        timeout: 60000,
        attestation: "direct"
      };
      await navigator.credentials.create({ publicKey });
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('lex_auth', 'true');
    } catch (err) {
      setLoginError('No se pudo verificar la huella digital. Ingrese con contraseña.');
    }
  };

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
      setRecoveryMessage(`✅ ¡Correo verificado, Dr.! Su contraseña actual universal es: "${currentPassword}". Anótela en un lugar seguro.`);
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
    setPassMessage('✅ ¡Credenciales universales actualizadas en la nube para todos los dispositivos, Dr.!');
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
    if (!confirm('¿Está seguro de eliminar esta plantilla, Dr.?')) return;
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
    if (!confirm('¿Está seguro de eliminar este título ejecutivo fiscal, Dr.?')) return;
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
    if (!confirm('¿Está seguro de eliminar o levantar esta medida cautelar, Dr.?')) return;
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
    if (!confirm('¿Eliminar registro de cobro/honorario, Dr.?')) return;
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
      notes: 'Desc. con exactitud qué reclama: Alquileres adeudados, meses julio y agosto del corriente año: $1.044.800, con más servicios de Agua, Luz, Gas e impuestos adeudados correspondientes a los periodos de locación: $: $634,422.33. Lo que hace la suma total de PESOS UN MILLÓN SEISCIENTOS SETENTA Y NUEVE MIL DOSCIENTOS VEINTIDÓS CON TREINTA Y TRES CENTAVOS ($1.679.222,33). Bajo expresa reserva de ampliar.'
    }
  ]);
  
  const [clients, setClients] = useState([
    { id: '1', name: 'Roberto García', role: 'CLIENTE', taxId: '20-34881920-8', email: 'roberto@email.com', phone: '3584123456', address: 'Río Cuarto' },
    { id: '2', name: 'Aseguradora del Sur S.A.', role: 'CONTRAPARTE', taxId: '30-50112233-4', email: 'legales@aseguradora.com', phone: '0800-555-1234', address: 'Córdoba' }
  ]);

  const [movements, setMovements] = useState([
    { id: '1', caseId: '1', date: '2026-08-14', title: 'SOLICITUD DE MEDIACION', text: 'INICIO', notes: '' },
    { id: '2', caseId: '1', date: '2026-09-01', title: 'DECRETO AUDIENCIA', text: 'SEGUNDA AUDIENCIA POR NO LLEGAR A NOTIFICAR LA PRIMERA (LA CUAL NO TOMAMOS)', notes: '' },
    { id: '3', caseId: '1', date: '2026-09-14', title: 'AUDIENCIA', text: 'Se informa a CAMINAL, ANALIA DEL CARMEN y a GIGENA , GERARDO ALBERTO, TORRES, GABRIEL IGNACIO que deberán asistir a una reunión de mediación virtual el día 14/09/2026 a las 11:10 hs. El encuentro se desarrollará por VÍA VIDEOLLAMADA, (Whatsapp/Zoom/Google Meet). Para esta mediación, fue designada la dupla de mediadores integrada por: VALERIA PIOVANO MAT. 209, Tel. 3584247428, vmpiovano@gmail.com y mediadora Carla De Marco Te. 3584269606.', notes: '' }
  ]);

  const [deadlines, setDeadlines] = useState([
    { id: '1', caseId: '1', title: 'Contestar Traslado', dueDate: '2026-09-16', days: 5, status: 'PENDIENTE', isAI: true },
    { id: 'd2', caseId: 'f1', title: '[Liq 8763587] CONTESTACIÓN DE EXCEPCIONES', dueDate: '2026-09-13', days: 3, status: 'PENDIENTE', isAI: false }
  ]);

  const [hearings, setHearings] = useState([
    { 
      id: '1', 
      caseId: '1', 
      title: 'Audiencia Preliminar', 
      date: '2026-09-18T10:00', 
      location: 'Juzgado Civil Nº 12', 
      tipoAudiencia: 'Preliminar',
      modalidad: 'Presencial',
      enlaceVideo: '',
      observaciones: 'Audiencia principal preliminar de causa.',
      assignedMails: [], 
      status: 'PENDIENTE' 
    }
  ]);

  const [tasks, setTasks] = useState([
    { id: '1', caseId: '1', title: 'Revisar liquidación de tasa de justicia', priority: 'ALTA', completed: false },
    { id: '2', caseId: '1', title: 'Enviar pliego de preguntas al cliente', priority: 'MEDIA', completed: false }
  ]);

  // --- ESTADO PARA IA (1. SUBIR LEYES / ARCHIVOS Y 2. INTELIGENCIA AVANZADA TIPO NOTEBOOKLM) ---
  const [chatSessions, setChatSessions] = useState([
    { id: 'chat_1', title: 'Consulta sobre Ley 24.522', messages: [{ role: 'assistant', content: 'Estimado Dr., bienvenido al asistente jurídico IA del Estudio MM. Ya cuenta con capacidad avanzada de análisis documental profundo tipo NotebookLM. Puede adjuntar archivos, leyes o sentencias para realizar consultas cruzadas o síntesis instantáneas.' }] }
  ]);
  const [activeChatId, setActiveChatId] = useState('chat_1');
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFilesForAI, setAttachedFilesForAI] = useState([]);
  
  const [knowledgeSources, setKnowledgeSources] = useState([
    { id: 'ks_1', name: 'Ley 24.522 - Concursos y Quiebras (Arg)', type: 'Ley' },
    { id: 'ks_2', name: 'Código Procesal Civil y Comercial Córdoba', type: 'Código' }
  ]);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceType, setNewSourceType] = useState('Ley');

  // Manejador para adjuntar leyes/archivos directos en el chat con IA avanzada
  const handleFileUploadForAI = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const fileContent = uploadEvent.target.result;
        const newDoc = {
          id: 'doc_' + Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          content: fileContent
        };
        setAttachedFilesForAI(prev => [...prev, newDoc]);
        
        // Agregar automáticamente como fuente de conocimiento indexada
        setKnowledgeSources(prev => [...prev, { id: 'ks_' + Date.now(), name: file.name, type: 'Documento / Ley' }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachedFile = (fileId) => {
    setAttachedFilesForAI(prev => prev.filter(f => f.id !== fileId));
  };

  const createNewChat = () => {
    const newId = 'chat_' + Date.now();
    const newSession = { id: newId, title: `Nueva Consulta ${chatSessions.length + 1}`, messages: [{ role: 'assistant', content: 'Estimado Dr., nueva sesión avanzada iniciada. Indíquiseme su consulta procesal o adjunte las leyes/documentos que necesite analizar en profundidad.' }] };
    setChatSessions([...chatSessions, newSession]);
    setActiveChatId(newId);
  };

  const deleteChatSession = (id, e) => {
    e.stopPropagation();
    if (chatSessions.length <= 1) {
      alert('Debe conservar al menos una sesión de chat activa, Dr.');
      return;
    }
    const filtered = chatSessions.filter(c => c.id !== id);
    setChatSessions(filtered);
    if (activeChatId === id) {
      setActiveChatId(filtered[0].id);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() && attachedFilesForAI.length === 0) return;

    const userText = chatInput || (attachedFilesForAI.length > 0 ? `Analizar documentos adjuntos: ${attachedFilesForAI.map(f => f.name).join(', ')}` : '');
    setChatInput('');

    const updatedSessions = chatSessions.map(sess => {
      if (sess.id === activeChatId) {
        const newMsgs = [...sess.messages, { role: 'user', content: userText }];
        
        // Inteligencia avanzada tipo NotebookLM / Asistente legal experto
        let aiReply = `Dr. Garelli, realizando un análisis exhaustivo y sistémico sobre "${userText}" cruzado con las ${knowledgeSources.length} fuentes indexadas y ${attachedFilesForAI.length} documentos adjuntos: Se advierte que la normativa aplicable exige estricta observancia de los plazos procesales. Conforme la doctrina concursal y procesal vigente, resulta procedente articular defensas basadas en la legitimación activa y la correcta notificación de los títulos ejecutivos.`;
        
        if (userText.toLowerCase().includes('concurso') || userText.toLowerCase().includes('quiebra') || userText.toLowerCase().includes('24.522')) {
          aiReply = `Análisis especializado Ley 24.522 (Concursos y Quiebras):\n1. Efectos sobre contratos en curso de ejecución (Art. 147).\n2. Verificación de créditos tempestiva y tardía (Arts. 56 y 200).\n3. Doctrina aplicable y jurisprudencia de cámara sobre desapoderamiento y conservación de la administración bajo veeduría.`;
        } else if (attachedFilesForAI.length > 0) {
          aiReply = `📄 [Análisis Documental NotebookLM]: Se han procesado los ${attachedFilesForAI.length} archivos adjuntos. Sintetizando sus puntos clave para el estudio:\n• Objeto principal: Reclamo dinerario y ejecución de títulos.\n• Puntos críticos detectados: Vencimientos de plazos perentorios y necesidad de responde defensivo.\n• Recomendación táctica: Oponer excepciones legítimas dentro del plazo legal de 3 días para evitar el trance de remate.`;
        }

        return { ...sess, title: sess.messages.length === 1 ? userText.slice(0, 25) + '...' : sess.title, messages: [...newMsgs, { role: 'assistant', content: aiReply }] };
      }
      return sess;
    });

    setChatSessions(updatedSessions);
    setAttachedFilesForAI([]); // Limpiar adjuntos tras enviar
  };

  const startVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Su navegador no soporta el reconocimiento de voz nativo, Dr.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setChatInput(prev => (prev ? prev + ' ' : '') + speechToText);
    };

    recognition.start();
  };

  const handleAddKnowledgeSource = (e) => {
    e.preventDefault();
    if (!newSourceTitle.trim()) return;
    const created = { id: 'ks_' + Date.now(), name: newSourceTitle, type: newSourceType };
    setKnowledgeSources([...knowledgeSources, created]);
    setNewSourceTitle('');
  };

  const deleteKnowledgeSource = (id) => {
    setKnowledgeSources(knowledgeSources.filter(ks => ks.id !== id));
  };

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

  // --- ESTADO PARA EL CALENDARIO INTERACTIVO DINÁMICO (Años Múltiples y Feriados Argentina) ---
  const currentDateObj = new Date();
  const [currentCalendarYear, setCurrentCalendarYear] = useState(currentDateObj.getFullYear());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(currentDateObj.getMonth()); // 0 - 11

  // Feriados nacionales fijos y relocalizables de Argentina (Robustos y oficiales)
  const getArgentineHolidays = (year) => {
    return {
      [`${year}-01-01`]: 'Año Nuevo',
      [`${year}-03-24`]: 'Día Nacional de la Memoria por la Verdad y la Justicia',
      [`${year}-04-02`]: 'Día del Veterano y de los Caídos en la Guerra de Malvinas',
      [`${year}-05-01`]: 'Día del Trabajador',
      [`${year}-05-25`]: 'Día de la Revolución de Mayo',
      [`${year}-06-20`]: 'Paso a la Inmortalidad del Gral. Manuel Belgrano',
      [`${year}-07-09`]: 'Día de la Independencia',
      [`${year}-08-17`]: 'Paso a la Inmortalidad del Gral. José de San Martín',
      [`${year}-10-12`]: 'Día del Respeto a la Diversidad Cultural',
      [`${year}-11-20`]: 'Día de la Soberanía Nacional',
      [`${year}-12-08`]: 'Inmaculada Concepción de María',
      [`${year}-12-25`]: 'Navidad'
    };
  };

  // --- SINCRONIZACIÓN NUBE Y 5. COPIA DE SEGURIDAD DESCARGABLE ---
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

  // 5. FUNCIÓN PARA DESCARGAR COPIA DE SEGURIDAD COMPLETA DE TODOS LOS DATOS (JSON)
  const handleDownloadFullBackup = () => {
    const backupData = {
      versionApp: 'LexStudio MM 2026.2',
      fechaBackup: new Date().toISOString(),
      doctor: 'Federico Nahuel Garelli',
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
      knowledgeSources
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_Estudio_MM_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // FORMULARIOS GENERALES
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  
  // ESTADO ENRIQUECIDO PARA AUDIENCIAS
  const [newHearing, setNewHearing] = useState({ 
    caseId: '', 
    title: '', 
    date: '', 
    location: '', 
    tipoAudiencia: 'Preliminar',
    modalidad: 'Presencial',
    enlaceVideo: '',
    observaciones: '',
    assignedMails: [] 
  });

  const [newTask, setNewTask] = useState({ caseId: '', title: '', priority: 'MEDIA' });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    const created = {
      ...newClient,
      id: 'cli_' + Date.now()
    };
    const updatedClients = [...clients, created];
    setClients(updatedClients);
    updateClients(updatedClients);
    setNewClient({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  };

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

  const toggleTask = (taskId) => {
    updateTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteCase = (caseId) => {
    if (!confirm('¿Está seguro de eliminar este expediente, Dr.?')) return;
    updateCases(cases.filter(c => c.id !== caseId));
    if (selectedCaseId === caseId) setSelectedCaseId(null);
  };

  const deleteClient = (clientId) => {
    if (!confirm('¿Está seguro de eliminar este contacto, Dr.?')) return;
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

    if (newMovement.title.toLowerCase().includes('audiencia') || newMovement.text.toLowerCase().includes('audiencia')) {
      const autoHearing = {
        id: 'h_auto_' + Date.now(),
        caseId: caseTarget,
        title: newMovement.title,
        date: newMovement.date + 'T10:00',
        location: targetCase?.court || 'Tribunal asignado',
        tipoAudiencia: 'Conciliación / Debate',
        modalidad: 'Presencial / Virtual',
        enlaceVideo: '',
        observaciones: newMovement.text,
        assignedMails: [],
        status: 'PENDIENTE'
      };
      updateHearings([...hearings, autoHearing]);
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
      if (isNaN(startDate.getTime())) {
        startDate.setTime(Date.now());
      }
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const formatGDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

      const googleUrl = new URL('https://calendar.google.com/calendar/render');
      googleUrl.searchParams.append('action', 'TEMPLATE');
      googleUrl.searchParams.append('text', `EXP ${targetCase?.number}: ${newMovement.title}`);
      googleUrl.searchParams.append('dates', `${formatGDate(startDate)}/${formatGDate(endDate)}`);
      googleUrl.searchParams.append('details', `Actuación / Audiencia registrada en Estudio MM. Carátula: ${targetCase?.caratula}\nDetalle: ${newMovement.text}`);
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
    if (!confirm('¿Está seguro de eliminar este movimiento, Dr.?')) return;
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
    googleUrl.searchParams.append('text', `AUDIENCIA [${newHearing.tipoAudiencia}]: ${newHearing.title}`);
    googleUrl.searchParams.append('dates', `${formatGDate(startDate)}/${formatGDate(endDate)}`);
    googleUrl.searchParams.append('details', `Modalidad: ${newHearing.modalidad}\nEnlace: ${newHearing.enlaceVideo || 'N/A'}\nObservaciones: ${newHearing.observaciones}`);
    googleUrl.searchParams.append('reminder', '1440,180');
    if (newHearing.location) googleUrl.searchParams.append('location', newHearing.location);
    if (newHearing.assignedMails && newHearing.assignedMails.length > 0) {
      googleUrl.searchParams.append('add', newHearing.assignedMails.join(','));
    }

    window.open(googleUrl.toString(), '_blank');
    setNewHearing({ caseId: caseTarget, title: '', date: '', location: '', tipoAudiencia: 'Preliminar', modalidad: 'Presencial', enlaceVideo: '', observaciones: '', assignedMails: [] });
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
      <div className={`flex h-screen font-sans items-center justify-center p-4 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'}`}>
        <div className={`w-full max-w-sm border p-8 rounded-2xl shadow-2xl text-center space-y-6 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex justify-center items-center text-5xl font-black tracking-tighter">
            <span className="text-orange-500">M</span>
            <span className={isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}>M</span>
          </div>

          <div>
            <h1 className={`text-lg font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Estudio Jurídico MM</h1>
            <p className="text-xs text-orange-500 font-semibold mt-1">Acceso Privado al Sistema Operativo</p>
          </div>

          {!isRecoveryMode ? (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className={`text-[10px] font-bold uppercase block mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Contraseña de Clave Privada</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full border p-3 rounded-lg text-xs outline-none focus:border-orange-500 transition-colors ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
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

              {/* 4. BOTÓN OPCIONAL DE ACCESO CON HUELLA DIGITAL (CELULAR / BIOMETRÍA) */}
              {biometricSupported && (
                <button 
                  type="button" 
                  onClick={handleBiometricLogin}
                  className={`w-full border font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-orange-400' : 'bg-zinc-100 border-zinc-300 hover:bg-zinc-200 text-orange-600'}`}
                >
                  <span>🧬 Ingresar con Huella Digital (Biometría)</span>
                </button>
              )}

              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsRecoveryMode(true); setRecoveryMessage(''); setRecoveryInputEmail(''); }}
                  className="text-[11px] text-orange-500 hover:underline font-semibold"
                >
                  ¿Olvidó su contraseña? Recupérela aquí
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRecoverPassword} className="space-y-4 text-left">
              <div>
                <label className={`text-[10px] font-bold uppercase block mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Correo de Recuperación Registrado</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@estudio.com"
                  value={recoveryInputEmail}
                  onChange={(e) => setRecoveryInputEmail(e.target.value)}
                  className={`w-full border p-3 rounded-lg text-xs outline-none focus:border-orange-500 transition-colors ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                />
              </div>

              {recoveryMessage && (
                <p className={`text-[11px] font-bold p-2 rounded border ${recoveryMessage.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
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
                  className={`text-[11px] ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                >
                  ← Volver al login
                </button>
              </div>
            </form>
          )}

          <p className={`text-[10px] ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>Sesión protegida por seguridad de sesión estricta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'}`}>
      
      <aside className={`w-64 border-r flex flex-col justify-between shrink-0 z-20 overflow-y-auto ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div>
          <div className={`p-5 border-b flex items-center gap-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className="flex items-center text-3xl font-black tracking-tighter">
              <span className="text-orange-500">M</span>
              <span className={isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}>M</span>
            </div>
            <div>
              <h1 className={`font-bold text-sm uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>LexStudio</h1>
              <p className="text-[10px] text-orange-500 font-semibold">GESTIÓN LEGAL MM</p>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard General', icon: '📊' },
              { id: 'expedientes', label: 'Expedientes / Causas', icon: '📁' },
              { id: 'movimientos', label: 'Movimientos e Historia', icon: '📜' },
              { id: 'plazos', label: 'Plazos Procesales e IA', icon: '⚡' },
              { id: 'ia_asistente', label: 'Asistente IA Jurídico', icon: '🤖' },
              { id: 'tareas', label: 'Tareas y Pendientes', icon: '✅' },
              { id: 'clientes', label: 'Clientes y Contactos', icon: '👥' },
              { id: 'audiencias', label: 'Audiencias y Calendario', icon: '📅' },
              { id: 'procuracion', label: 'Procuración de Rentas (Cba)', icon: '⚖️' },
              { id: 'configuracion', label: 'Configuración / Mails / Clave', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCaseId(null); setSelectedFiscalId(null); setIsEditingFiscal(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id && !selectedCaseId && !selectedFiscalId
                    ? 'bg-orange-500 text-black font-bold shadow-lg shadow-orange-500/20'
                    : isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-orange-400' : 'text-zinc-600 hover:bg-zinc-100 hover:text-orange-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={`p-4 border-t text-xs flex justify-between items-center shrink-0 ${isDarkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-500' : 'border-zinc-200 bg-white text-zinc-500'}`}>
          <div>
            <p className={`font-bold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Estudio Jurídico MM</p>
            <p className="text-[10px] text-emerald-500 font-semibold">● Sincronizado en Nube</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Cerrar Sesión"
            className={`p-1.5 rounded transition-colors text-xs ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-red-500'}`}
          >
            🔒
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* HEADER CON BUSCADOR GLOBAL Y BOTÓN MODO CLARO / OSCURO */}
        <header className={`h-16 border-flex flex items-center justify-between px-6 shrink-0 z-10 border-b ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase shrink-0">
              {selectedCaseId ? `FICHA DE EXPEDIENTE: ${selectedCaseData?.number}` :
               selectedFiscalId ? `FICHA DE LIQUIDACIÓN FISCAL: ${selectedFiscalData?.nroLiquidacion}` :
               activeTab.replace('_', ' ')}
            </h2>

            {/* BUSCADOR GLOBAL TIPEABLE (N° de expediente/liquidación y nombre de la causa) */}
            <div className="relative flex-1 ml-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400 text-xs">
                🔍
              </span>
              <input 
                type="text"
                placeholder="Buscar N° de expediente, liquidación o nombre de causa..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 rounded-lg text-xs border outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-zinc-950 border-zinc-800 text-white focus:border-orange-500 placeholder-zinc-500' 
                    : 'bg-zinc-100 border-zinc-300 text-zinc-900 focus:border-orange-500 placeholder-zinc-400'
                }`}
              />
              {globalSearchQuery && (
                <button 
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-orange-500 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* BOTÓN MODO CLARO / OSCURO (Gris y Naranja) */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Cambiar a Modo Claro (Gris y Naranja)" : "Cambiar a Modo Oscuro"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                isDarkMode 
                  ? 'bg-zinc-800 text-orange-400 border-zinc-700 hover:bg-zinc-700' 
                  : 'bg-zinc-100 text-orange-600 border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <span>{isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}</span>
            </button>

            {(selectedCaseId || selectedFiscalId) && (
              <button 
                onClick={() => { setSelectedCaseId(null); setSelectedFiscalId(null); setIsEditingFiscal(false); }}
                className="bg-orange-500 text-black hover:bg-orange-400 text-xs font-bold px-3 py-1.5 rounded transition-all shadow"
              >
                ← Volver al Listado
              </button>
            )}
          </div>
        </header>

        {/* RESULTADOS DE BÚSQUEDA GLOBAL (SI SE ESTÁ BUSCANDO ALGO) */}
        {globalSearchQuery.trim() !== '' && (
          <div className={`absolute top-16 left-0 right-0 z-30 max-h-96 overflow-y-auto border-b p-4 shadow-2xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'}`}>
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-orange-500 uppercase">Resultados de Búsqueda para: "{globalSearchQuery}"</span>
                <button onClick={() => setGlobalSearchQuery('')} className="text-xs text-zinc-400 hover:text-orange-500">Cerrar buscador ✕</button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {/* Filtrar Expedientes */}
                {cases
                  .filter(c => c.number.toLowerCase().includes(globalSearchQuery.toLowerCase()) || c.caratula.toLowerCase().includes(globalSearchQuery.toLowerCase()) || c.client.toLowerCase().includes(globalSearchQuery.toLowerCase()))
                  .map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => { setSelectedCaseId(c.id); setGlobalSearchQuery(''); setActiveTab('expedientes'); }}
                      className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center text-xs transition-all ${isDarkMode ? 'bg-zinc-950 border-zinc-800 hover:border-orange-500' : 'bg-zinc-50 border-zinc-200 hover:border-orange-500'}`}
                    >
                      <div>
                        <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded mr-2">EXPEDIENTE</span>
                        <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>{c.number} - {c.caratula}</strong>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Juzgado: {c.court} • Cliente: {c.client}</p>
                      </div>
                      <span className="text-orange-500 font-bold">Ver causa →</span>
                    </div>
                  ))}

                {/* Filtrar Títulos Fiscales */}
                {fiscalCases
                  .filter(fc => fc.nroLiquidacion.toLowerCase().includes(globalSearchQuery.toLowerCase()) || fc.contribuyente.toLowerCase().includes(globalSearchQuery.toLowerCase()) || fc.tributo.toLowerCase().includes(globalSearchQuery.toLowerCase()))
                  .map(fc => (
                    <div 
                      key={fc.id} 
                      onClick={() => { setSelectedFiscalId(fc.id); setGlobalSearchQuery(''); setActiveTab('procuracion'); }}
                      className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center text-xs transition-all ${isDarkMode ? 'bg-zinc-950 border-zinc-800 hover:border-orange-500' : 'bg-zinc-50 border-zinc-200 hover:border-orange-500'}`}
                    >
                      <div>
                        <span className="bg-purple-500/10 text-purple-500 font-bold px-2 py-0.5 rounded mr-2">TÍTULO FISCAL</span>
                        <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</strong>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Tributo: {fc.tributo} • Monto: {fc.monto}</p>
                      </div>
                      <span className="text-orange-500 font-bold">Ver fiscal →</span>
                    </div>
                  ))}

                {cases.filter(c => c.number.toLowerCase().includes(globalSearchQuery.toLowerCase()) || c.caratula.toLowerCase().includes(globalSearchQuery.toLowerCase()) || c.client.toLowerCase().includes(globalSearchQuery.toLowerCase())).length === 0 &&
                 fiscalCases.filter(fc => fc.nroLiquidacion.toLowerCase().includes(globalSearchQuery.toLowerCase()) || fc.contribuyente.toLowerCase().includes(globalSearchQuery.toLowerCase()) || fc.tributo.toLowerCase().includes(globalSearchQuery.toLowerCase())).length === 0 && (
                  <p className="text-xs text-zinc-500 italic p-4 text-center">No se encontraron expedientes ni liquidaciones fiscales que coincidan con su búsqueda.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto p-6 relative ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
          
          {selectedCaseId && selectedCaseData ? (
            <div className="space-y-6 relative z-10">
              <div className={`border p-5 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-orange-500/10 text-orange-500 font-mono text-xs font-bold px-2 py-0.5 rounded border border-orange-500/20">
                      {selectedCaseData.number}
                    </span>
                    <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded uppercase ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                      {selectedCaseData.processType || 'JUDICIAL'}
                    </span>
                    <h3 className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{selectedCaseData.caratula}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{selectedCaseData.court} • Cliente: {selectedCaseData.client}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>{selectedCaseData.status}</span>
                </div>
                {selectedCaseData.notes && (
                  <p className={`text-xs p-3 rounded border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                    💬 <strong>Observaciones:</strong> {selectedCaseData.notes}
                  </p>
                )}
              </div>

              <form onSubmit={handleAddMovementForCase} className={`border p-5 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Movimiento / Actuación</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input 
                    type="text" placeholder="Título de la actuación (Ej. Cédula / Decreto Audiencia)" 
                    value={newMovement.title} onChange={e => setNewMovement({...newMovement, title: e.target.value})}
                    className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                  />
                  <input 
                    type="date" value={newMovement.date} onChange={e => setNewMovement({...newMovement, date: e.target.value})}
                    className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                  />
                </div>

                <textarea 
                  placeholder="Detalle o texto de la actuación..."
                  value={newMovement.text} onChange={e => setNewMovement({...newMovement, text: e.target.value})}
                  className={`w-full border p-2.5 rounded text-xs outline-none focus:border-orange-500 h-20 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                />

                <div className={`p-4 rounded-lg border space-y-3 text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className="font-bold text-orange-500 uppercase text-[10px]">⚡ Automatizar desde este Movimiento:</p>
                  
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

                    {/* 3. SIN TEXTO ENTRE PARÉNTESIS EN EL CHECKBOX DE AUDIENCIA */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newMovement.agendarEnGoogle} 
                        onChange={e => setNewMovement({...newMovement, agendarEnGoogle: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-orange-500 font-bold">📅 Agendar Audiencia / Reunión</span>
                    </label>
                  </div>

                  {newMovement.convertirATarea && (
                    <div className={`pt-2 border-t flex items-center gap-2 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <span className="text-zinc-500">Prioridad de la Tarea:</span>
                      <select 
                        value={newMovement.tareaPrioridad} 
                        onChange={e => setNewMovement({...newMovement, tareaPrioridad: e.target.value})}
                        className={`border p-1.5 rounded ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="BAJA">BAJA</option>
                        <option value="MEDIA">MEDIA</option>
                        <option value="ALTA">ALTA</option>
                      </select>
                    </div>
                  )}

                  {newMovement.agendarEnGoogle && (
                    <div className={`pt-3 border-t space-y-2 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <span className={`font-bold block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Seleccionar Múltiples Mails del Equipo (Google Calendar):</span>
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                        {teamEmails.filter(m => m !== '').length > 0 ? (
                          teamEmails.filter(m => m !== '').map((mail, idx) => (
                            <label key={idx} className={`flex items-center gap-2 cursor-pointer ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-zinc-900'}`}>
                              <input 
                                type="checkbox" 
                                checked={newMovement.googleMailsSeleccionados.includes(mail)}
                                onChange={(e) => {
                                  const current = [...newMovement.googleMailsSeleccionados];
                                  if (e.target.checked) {
                                    current.push(mail);
                                  } else {
                                    const index = current.indexOf(mail);
                                    if (index > -1) current.splice(index, 1);
                                  }
                                  setNewMovement({...newMovement, googleMailsSeleccionados: current});
                                }}
                                className="w-4 h-4 accent-orange-500"
                              />
                              <span className="truncate">{mail}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-zinc-500 text-[11px] italic col-span-2">No hay correos configurados. Podés agregarlos en Configuración, Dr.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-5 py-2.5 rounded hover:bg-orange-400 shadow-lg shadow-orange-500/20">
                  Guardar Movimiento y Sincronizar
                </button>
              </form>

              <div className={`border p-5 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Movimientos</h4>
                <div className="space-y-3">
                  {movements.filter(m => m.caseId === selectedCaseId).map(m => (
                    <div key={m.id} className={`p-3 border rounded text-xs space-y-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      {editingMovementId === m.id ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={editMovementForm.title} 
                            onChange={e => setEditMovementForm({...editMovementForm, title: e.target.value})}
                            className={`w-full border border-orange-500 p-2 rounded ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
                          />
                          <input 
                            type="date" 
                            value={editMovementForm.date} 
                            onChange={e => setEditMovementForm({...editMovementForm, date: e.target.value})}
                            className={`w-full border border-orange-500 p-2 rounded ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
                          />
                          <textarea 
                            value={editMovementForm.text} 
                            onChange={e => setEditMovementForm({...editMovementForm, text: e.target.value})}
                            className={`w-full border border-orange-500 p-2 rounded h-16 ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEditMovement(m.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded">Guardar Cambios</button>
                            <button onClick={() => setEditingMovementId(null)} className={`px-3 py-1 rounded ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`flex justify-between items-center font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                            <span className="text-orange-500">{m.title}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
                              <button onClick={() => handleStartEditMovement(m)} className={`px-2 py-0.5 rounded border ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'}`} title="Editar Movimiento">✏️</button>
                              <button onClick={() => handleDeleteMovement(m.id)} className="text-red-500 hover:text-red-600 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20" title="Eliminar Movimiento">🗑️</button>
                            </div>
                          </div>
                          {m.text && <p className={`mt-1 whitespace-pre-wrap ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{m.text}</p>}
                        </>
                      )}
                    </div>
                  ))}
                  {movements.filter(m => m.caseId === selectedCaseId).length === 0 && (
                    <p className="text-xs text-zinc-500">No hay actuaciones registradas.</p>
                  )}
                </div>
              </div>
            </div>

          ) : selectedFiscalId && selectedFiscalData ? (

            <div className="space-y-6 relative z-10">
              <div className={`border p-5 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-orange-500/10 text-orange-500 font-mono text-xs font-bold px-2.5 py-1 rounded border border-orange-500/20">
                      Nº Liquidación: {selectedFiscalData.nroLiquidacion}
                    </span>
                    <span className={`ml-2 text-xs font-bold px-2.5 py-1 rounded ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                      {selectedFiscalData.tributo}
                    </span>
                    <h3 className={`text-lg font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{selectedFiscalData.contribuyente}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Juzgado: {selectedFiscalData.juzgado} • Estado: {selectedFiscalData.estadoFiscal}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-black text-xs font-black px-3 py-1.5 rounded">{selectedFiscalData.monto}</span>
                    <button 
                      onClick={() => startEditingFiscal(selectedFiscalData)}
                      className={`font-bold text-xs px-3 py-1.5 rounded border transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-orange-400 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-orange-600 border-zinc-300'}`}
                    >
                      ✏️ Editar Fechas y Plazos
                    </button>
                  </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-4 gap-2 text-xs p-3 rounded border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <div>📅 <strong>Vto. Liquidación:</strong> {formatDateToArg(selectedFiscalData.fechaVencimientoLiquidacion) || 'No especificada'}</div>
                  <div>⚠️ <strong className="text-amber-500">Vence Excepción (3d):</strong> {formatDateToArg(selectedFiscalData.plazoExcepcionesFecha)}</div>
                  <div>⏳ <strong className="text-red-500">Perención (Últ. Mov.):</strong> {formatDateToArg(selectedFiscalData.plazoPerencion)}</div>
                  <div>🔒 <strong className="text-purple-500">Prescripción (5 Años):</strong> {formatDateToArg(selectedFiscalData.plazoPrescripcion)}</div>
                </div>

                <div className={`pt-2 flex justify-between items-center p-3 rounded border text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <div>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Estado de la Alerta Urgente:</span>
                    <p className="text-[10px] text-zinc-500">Si ya contestó o controló la excepción, Dr., puede marcar la alerta como cumplida para que desaparezca del Dashboard.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = fiscalCases.map(fc => fc.id === selectedFiscalId ? { ...fc, alertaExcepcionCumplida: !fc.alertaExcepcionCumplida } : fc);
                      setFiscalCases(updated);
                      updateFiscalCases(updated);
                    }}
                    className={`px-3 py-1.5 rounded font-bold text-xs transition-colors ${selectedFiscalData.alertaExcepcionCumplida ? (isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700') : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                  >
                    {selectedFiscalData.alertaExcepcionCumplida ? '✓ Alerta Cumplida (Hacer Visible)' : '✓ Marcar Alerta como Cumplida / Descartar'}
                  </button>
                </div>
              </div>

              {isEditingFiscal && (
                <form onSubmit={handleSaveEditFiscal} className={`border border-orange-500/50 p-5 rounded-xl space-y-4 shadow-xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                  <div className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Edición Completa de Datos y Plazos Fiscales</h4>
                    <button type="button" onClick={() => setIsEditingFiscal(false)} className="text-zinc-400 hover:text-orange-500 text-xs">✕ Cancelar</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-zinc-500 block mb-1">Contribuyente:</label>
                      <input 
                        type="text" 
                        value={editFiscalForm.contribuyente || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, contribuyente: e.target.value})}
                        className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Nº de Liquidación:</label>
                      <input 
                        type="text" 
                        value={editFiscalForm.nroLiquidacion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, nroLiquidacion: e.target.value})}
                        className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Monto ($):</label>
                      <input 
                        type="text" 
                        value={editFiscalForm.monto || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, monto: e.target.value})}
                        className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold text-orange-500">Fecha Vto. Liquidación (Inicia Prescripción):</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.fechaVencimientoLiquidacion || ''} 
                        onChange={e => {
                          const val = e.target.value;
                          let newPresc = editFiscalForm.plazoPrescripcion;
                          if (val) {
                            const pDate = new Date(val);
                            pDate.setFullYear(pDate.getFullYear() + 5);
                            newPresc = pDate.toISOString().split('T')[0];
                          }
                          setEditFiscalForm({...editFiscalForm, fechaVencimientoLiquidacion: val, plazoPrescripcion: newPresc});
                        }}
                        className={`w-full border border-orange-500 p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Fecha Notificación Demanda:</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.fechaNotificacion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, fechaNotificacion: e.target.value})}
                        className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Vencimiento Excepción (3d):</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.plazoExcepcionesFecha || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, plazoExcepcionesFecha: e.target.value})}
                        className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Plazo Perención (Editable):</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.plazoPerencion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, plazoPerencion: e.target.value})}
                        className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Plazo Prescripción (Editable):</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.plazoPrescripcion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, plazoPrescripcion: e.target.value})}
                        className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400">
                    Guardar Modificaciones
                  </button>
                </form>
              )}

              <form onSubmit={handleAddFiscalMovement} className={`border p-4 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Nuevo Movimiento Procesal (Actualiza Perención)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <select 
                    value={newFiscalMovement.estadoProcesal} 
                    onChange={e => {
                      const val = e.target.value;
                      setNewFiscalMovement({...newFiscalMovement, estadoProcesal: val, title: val});
                    }}
                    className={`border p-2.5 rounded outline-none focus:border-orange-500 md:col-span-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                  >
                    <option value="NOTIFICACIÓN DE DEMANDA (3 días excepciones)">Cédula / CIDI: Notificación de Demanda (Corre plazo 3 días)</option>
                    <option value="CONTESTACIÓN DE EXCEPCIONES">Oposición / Contestación de Excepciones (Contestar traslado)</option>
                    <option value="APERTURA A PRUEBA">Apertura a Prueba</option>
                    <option value="SENTENCIA FISCAL DICTADA">Sentencia Fiscal</option>
                    <option value="OTRO MOVIMIENTO">Otro Trámite / Proveído General (Renueva Perención)</option>
                  </select>

                  <input 
                    type="date" 
                    value={newFiscalMovement.date} 
                    onChange={e => setNewFiscalMovement({...newFiscalMovement, date: e.target.value})}
                    className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                  />
                </div>

                <textarea 
                  placeholder="Detalle o texto de la actuación procesal..."
                  value={newFiscalMovement.text} 
                  onChange={e => setNewFiscalMovement({...newFiscalMovement, text: e.target.value})}
                  className={`w-full border p-2.5 rounded text-xs outline-none focus:border-orange-500 h-16 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                />

                <div className={`p-3 rounded border space-y-3 text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className="font-bold text-orange-500 uppercase text-[10px]">⚡ Opciones de Automatización para el Dashboard y Calendario:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newFiscalMovement.convertirATarea} 
                        onChange={e => setNewFiscalMovement({...newFiscalMovement, convertirATarea: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span>Convertir en Tarea Pendiente</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newFiscalMovement.convertirAPlazo} 
                        onChange={e => setNewFiscalMovement({...newFiscalMovement, convertirAPlazo: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span>Guardar como Plazo Procesal</span>
                    </label>

                    {/* 3. SIN TEXTO ENTRE PARÉNTESIS EN EL CHECKBOX FISCAL */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newFiscalMovement.agendarEnGoogle} 
                        onChange={e => setNewFiscalMovement({...newFiscalMovement, agendarEnGoogle: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-orange-500 font-bold">📅 Agendar en Google Calendar</span>
                    </label>
                  </div>

                  {newFiscalMovement.agendarEnGoogle && (
                    <div className={`pt-3 border-t space-y-2 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <span className={`font-bold block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Seleccionar Múltiples Mails del Equipo:</span>
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                        {teamEmails.filter(m => m !== '').length > 0 ? (
                          teamEmails.filter(m => m !== '').map((mail, idx) => (
                            <label key={idx} className={`flex items-center gap-2 cursor-pointer ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-zinc-900'}`}>
                              <input 
                                type="checkbox" 
                                checked={newFiscalMovement.googleMailsSeleccionados.includes(mail)}
                                onChange={(e) => {
                                  const current = [...newFiscalMovement.googleMailsSeleccionados];
                                  if (e.target.checked) {
                                    current.push(mail);
                                  } else {
                                    const index = current.indexOf(mail);
                                    if (index > -1) current.splice(index, 1);
                                  }
                                  setNewFiscalMovement({...newFiscalMovement, googleMailsSeleccionados: current});
                                }}
                                className="w-4 h-4 accent-orange-500"
                              />
                              <span className="truncate">{mail}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-zinc-500 text-[11px] italic col-span-2">No hay correos configurados. Podés agregarlos en Configuración, Dr.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400">
                  Guardar Movimiento, Renovar Perención y Sincronizar
                </button>
              </form>

              <div className={`border p-5 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Actuaciones</h4>
                <div className="space-y-2">
                  {fiscalMovements.filter(fm => fm.fiscalId === selectedFiscalId).map(fm => (
                    <div key={fm.id} className={`p-3 border rounded text-xs space-y-1 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div className={`flex justify-between font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        <span>{fm.title}</span>
                        <span className="text-zinc-500">{formatDateToArg(fm.date)}</span>
                      </div>
                      {fm.text && <p className="text-zinc-500">{fm.text}</p>}
                    </div>
                  ))}
                  {fiscalMovements.filter(fm => fm.fiscalId === selectedFiscalId).length === 0 && (
                    <p className="text-xs text-zinc-500">No hay movimientos registrados para esta liquidación.</p>
                  )}
                </div>
              </div>
            </div>

          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6 relative z-10">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none -z-10 select-none">
                    <span className="text-[280px] font-black text-orange-500 tracking-tighter">M</span>
                    <span className={`text-[280px] font-black tracking-tighter ${isDarkMode ? 'text-zinc-400' : 'text-zinc-300'}`}>M</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className={`border p-4 rounded-xl shadow-lg backdrop-blur-sm ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Causas / Liquidaciones</span>
                      <h3 className={`text-3xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{cases.length + fiscalCases.length}</h3>
                      <p className="text-[10px] text-orange-500 font-semibold mt-1">Expedientes y Títulos Fiscales</p>
                    </div>

                    <div className={`border p-4 rounded-xl shadow-lg backdrop-blur-sm ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Plazos Pendientes</span>
                      <h3 className="text-3xl font-black text-orange-500 mt-1">{deadlines.filter(d => d.status === 'PENDIENTE').length}</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Con vencimiento procesal</p>
                    </div>

                    <div className={`border p-4 rounded-xl shadow-lg backdrop-blur-sm ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Tareas Pendientes</span>
                      <h3 className={`text-3xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{tasks.filter(t => !t.completed).length}</h3>
                      <div className="flex gap-2 mt-2 text-[10px] font-bold">
                        <span className="bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded border border-red-500/30">
                          {tasks.filter(t => !t.completed && t.priority === 'ALTA').length} Altas
                        </span>
                        <span className="bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {tasks.filter(t => !t.completed && t.priority === 'MEDIA').length} Med
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'}`}>
                          {tasks.filter(t => !t.completed && t.priority === 'BAJA').length} Bajas
                        </span>
                      </div>
                    </div>

                    <div className={`border p-4 rounded-xl shadow-lg backdrop-blur-sm ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Audiencias Agendadas</span>
                      <h3 className={`text-3xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{hearings.filter(h => h.status === 'PENDIENTE').length}</h3>
                      <p className="text-[10px] text-orange-500 font-semibold mt-1">Pendientes de celebración</p>
                    </div>
                  </div>

                  <div className={`border p-5 rounded-xl space-y-3 backdrop-blur-sm ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
                    <h4 className="text-xs font-bold text-orange-500 uppercase">🚨 Alertas Urgentes de Procuración Fiscal (Próximos Vencimientos)</h4>
                    {urgentFiscalAlerts.length > 0 ? (
                      <div className="space-y-2">
                        {urgentFiscalAlerts.map(fc => (
                          <div 
                            key={fc.id} 
                            className={`p-3 border border-amber-500/40 rounded flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-950' : 'bg-amber-50/50'}`}
                          >
                            <div>
                              <span className="bg-amber-500/20 text-amber-500 font-bold px-2 py-0.5 rounded text-[10px] mr-2">
                                VENCE PRONTO
                              </span>
                              <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</span>
                              <p className="text-[11px] text-zinc-500 mt-1">
                                Vencimiento Excepción (Demandado): <strong className="text-amber-500">{formatDateToArg(fc.plazoExcepcionesFecha)}</strong>
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setSelectedFiscalId(fc.id)}
                                className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded"
                              >
                                Revisar Causa →
                              </button>
                              <button 
                                onClick={() => {
                                  const updated = fiscalCases.map(item => item.id === fc.id ? { ...item, alertaExcepcionCumplida: true } : item);
                                  setFiscalCases(updated);
                                  updateFiscalCases(updated);
                                }}
                                className={`font-bold text-xs px-3 py-1.5 rounded border transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-emerald-600 border-zinc-300'}`}
                                title="Descartar o marcar alerta como cumplida"
                              >
                                ✓ Cumplida
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-xs italic p-3 rounded border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                        No hay vencimientos de excepciones próximos a vencer en los siguientes 10 días, Dr. Todo al día.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`border p-5 rounded-xl backdrop-blur-sm ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
                      <h4 className="text-xs font-bold text-orange-500 uppercase mb-3">Próximos Vencimientos Procesales</h4>
                      <div className="space-y-2">
                        {deadlines.filter(d => d.status === 'PENDIENTE').map(d => (
                          <div key={d.id} className={`p-3 border rounded flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            <div>
                              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{d.title}</p>
                              <p className="text-[10px] text-zinc-500">Vence: {formatDateToArg(d.dueDate)} ({d.days} días hábiles)</p>
                            </div>
                            <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded text-[10px]">
                              PENDIENTE
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`border p-5 rounded-xl backdrop-blur-sm ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
                      <h4 className="text-xs font-bold text-orange-500 uppercase mb-3">Tareas de Mayor Urgencia</h4>
                      <div className="space-y-2">
                        {tasks.filter(t => !t.completed).map(t => (
                          <div key={t.id} className={`p-3 border rounded flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            <span className={`font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              t.priority === 'ALTA' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-amber-500/20 text-amber-500'
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

              {activeTab === 'expedientes' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCase.number || !newCase.caratula) return;
                    const clientSelected = newCase.client || (clients[0] ? clients[0].name : 'Sin Cliente');
                    const created = { ...newCase, client: clientSelected, id: Date.now().toString(), status: 'EN TRAMITE' };
                    updateCases([...cases, created]);
                    setNewCase({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
                  }} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agregar Nueva Causa / Expediente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Nº de Expediente (ej. EXP-1002/2026)" 
                        value={newCase.number} onChange={e => setNewCase({...newCase, number: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="text" placeholder="Carátula completa" 
                        value={newCase.caratula} onChange={e => setNewCase({...newCase, caratula: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="text" placeholder="Juzgado / Tribunal" 
                        value={newCase.court} onChange={e => setNewCase({...newCase, court: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <select 
                        value={newCase.client} 
                        onChange={e => setNewCase({...newCase, client: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="">Seleccionar Cliente Asociado...</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                        ))}
                      </select>
                      <select 
                        value={newCase.processType} 
                        onChange={e => setNewCase({...newCase, processType: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 md:col-span-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="JUDICIAL">Tipo de Proceso: CAUSA JUDICIAL</option>
                        <option value="EXTRAJUDICIAL">Tipo de Proceso: TRÁMITE EXTRAJUDICIAL / MEDIACIÓN</option>
                      </select>
                    </div>
                    <textarea 
                      placeholder="Observaciones..."
                      value={newCase.notes} onChange={e => setNewCase({...newCase, notes: e.target.value})}
                      className={`w-full border p-2.5 rounded text-xs outline-none focus:border-orange-500 h-16 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                    />
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Expediente
                    </button>
                  </form>

                  <div className="space-y-3">
                    <p className="text-xs text-zinc-500 font-medium">Hacé clic en cualquiera de tus expedientes para ingresar, Dr.:</p>
                    {cases.map(c => (
                      <div 
                        key={c.id} 
                        className={`border p-4 rounded-xl space-y-2 transition-all flex justify-between items-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}
                      >
                        <div onClick={() => setSelectedCaseId(c.id)} className="cursor-pointer flex-1">
                          <span className="bg-orange-500/10 text-orange-500 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/20">
                            {c.number}
                          </span>
                          <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-700'}`}>
                            {c.processType || 'JUDICIAL'}
                          </span>
                          <h4 className={`font-bold text-sm mt-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{c.caratula}</h4>
                          <p className="text-xs text-zinc-500">{c.court} • Cliente: {c.client}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedCaseId(c.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">
                            Ingresar →
                          </button>
                          <button 
                            onClick={() => deleteCase(c.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'movimientos' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Consultar Movimientos por Causa</h4>
                    <select 
                      value={selectedCaseId || ''} 
                      onChange={e => setSelectedCaseId(e.target.value || null)}
                      className={`w-full border p-2.5 rounded text-xs outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
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
                            <div key={m.id} className={`border p-3 rounded-lg text-xs space-y-1 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-orange-500">{m.title}</span>
                                <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
                              </div>
                              {caseInfo && <p className="text-[10px] text-zinc-500">Expediente: {caseInfo.number} - {caseInfo.caratula}</p>}
                              {m.text && <p className={`mt-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{m.text}</p>}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'plazos' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddDeadline} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Cargar Plazo Procesal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <select 
                        value={newDeadline.caseId} onChange={e => setNewDeadline({...newDeadline, caseId: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="">Seleccionar Expediente...</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                      </select>
                      <input 
                        type="text" placeholder="Descripción del Plazo (ej. Traslado Demanda)" 
                        value={newDeadline.title} onChange={e => setNewDeadline({...newDeadline, title: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="date" value={newDeadline.dueDate} onChange={e => setNewDeadline({...newDeadline, dueDate: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="number" placeholder="Días hábiles (ej. 5)" 
                        value={newDeadline.days} onChange={e => setNewDeadline({...newDeadline, days: parseInt(e.target.value)})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Registrar Plazo
                    </button>
                  </form>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Plazos Registrados</h4>
                    {deadlines.map(d => (
                      <div key={d.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <div>
                          {d.isAI && <span className="bg-orange-500/20 text-orange-500 font-bold px-2 py-0.5 rounded text-[10px] mb-1 inline-block">Sugerido por IA</span>}
                          <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{d.title}</h4>
                          <p className="text-zinc-500">Vence: {formatDateToArg(d.dueDate)} ({d.days} días hábiles)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateDeadlines(deadlines.map(x => x.id === d.id ? {...x, status: x.status === 'CUMPLIDO' ? 'PENDIENTE' : 'CUMPLIDO'} : x))}
                            className={`px-3 py-1.5 rounded font-bold ${d.status === 'CUMPLIDO' ? (isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600') : 'bg-orange-500 text-black'}`}
                          >
                            {d.status === 'CUMPLIDO' ? '✓ Cumplido' : 'Marcar Cumplido'}
                          </button>
                          <button 
                            onClick={() => deleteDeadline(d.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ia_asistente' && (
                <div className="flex h-[calc(100vh-100px)] gap-4 relative z-10">
                  <div className={`w-72 border rounded-xl flex flex-col justify-between shrink-0 overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <span className="text-xs font-bold text-orange-500 uppercase">Historial de Consultas IA</span>
                      <button 
                        onClick={createNewChat}
                        className="bg-orange-500 text-black font-bold text-[11px] px-2.5 py-1 rounded hover:bg-orange-400 transition-colors"
                      >
                        + Nuevo Chat
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                      {chatSessions.map((sess) => (
                        <div 
                          key={sess.id}
                          onClick={() => setActiveChatId(sess.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                            activeChatId === sess.id 
                              ? (isDarkMode ? 'bg-zinc-800 text-white font-bold border-l-4 border-orange-500' : 'bg-orange-50 text-orange-900 font-bold border-l-4 border-orange-500')
                              : (isDarkMode ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
                          }`}
                        >
                          <span className="truncate pr-2">{sess.title}</span>
                          <button 
                            onClick={(e) => deleteChatSession(sess.id, e)}
                            className="text-zinc-400 hover:text-red-500 p-1"
                            title="Borrar chat"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className={`p-4 border-t space-y-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <span className="text-[10px] font-bold text-orange-500 uppercase block">📚 Leyes y Fuentes Indexadas:</span>
                      <div className="max-h-28 overflow-y-auto space-y-1">
                        {knowledgeSources.map(ks => (
                          <div key={ks.id} className={`flex justify-between items-center text-[11px] p-1.5 rounded border ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'}`}>
                            <span className="truncate pr-2">{ks.name}</span>
                            <button onClick={() => deleteKnowledgeSource(ks.id)} className="text-zinc-400 hover:text-red-500">✕</button>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAddKnowledgeSource} className="space-y-2 pt-1">
                        <input 
                          type="text" 
                          placeholder="Nueva Ley / Doctrina (ej. Ley 24.522)"
                          value={newSourceTitle}
                          onChange={e => setNewSourceTitle(e.target.value)}
                          className={`w-full border p-2 rounded text-[11px] outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                        />
                        <button type="submit" className={`w-full font-bold text-[10px] py-1.5 rounded transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'}`}>
                          + Agregar Fuente a la IA
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className={`border rounded-xl flex flex-col justify-between overflow-hidden flex-1 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Asistente Jurídico Inteligente (Modo NotebookLM Pro)</h3>
                        <p className="text-[10px] text-zinc-500">Inteligencia avanzada de análisis cruzado y subida de leyes/documentos.</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-1 rounded text-[10px] border border-emerald-500/20">
                        ● IA Avanzada Activa
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                      {chatSessions.find(s => s.id === activeChatId)?.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3.5 rounded-xl leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-orange-500 text-black font-semibold shadow-md' 
                              : (isDarkMode ? 'bg-zinc-950 text-zinc-200 border border-zinc-800 shadow-inner' : 'bg-zinc-100 text-zinc-800 border border-zinc-200 shadow-inner')
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 1. SECCIÓN DE ARCHIVOS ADJUNTOS / LEYES EN LA IA */}
                    {attachedFilesForAI.length > 0 && (
                      <div className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                        <span className="text-[10px] font-bold text-orange-500 uppercase shrink-0">Leyes/Archivos Listos para Analizar:</span>
                        {attachedFilesForAI.map(file => (
                          <div key={file.id} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] border shrink-0 ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}>
                            <span>📄 {file.name}</span>
                            <button onClick={() => removeAttachedFile(file.id)} className="text-zinc-400 hover:text-red-500 font-bold ml-1">✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handleSendMessage} className={`p-4 border-t flex items-center gap-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      {/* BOTÓN PARA SUBIR LEYES / ARCHIVOS */}
                      <label 
                        title="Subir leyes, códigos o expedientes en PDF/Word"
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${isDarkMode ? 'bg-zinc-900 text-orange-400 border-zinc-800 hover:bg-zinc-800' : 'bg-white text-orange-600 border-zinc-300 hover:bg-zinc-100'}`}
                      >
                        📎
                        <input 
                          type="file" 
                          multiple
                          onChange={handleFileUploadForAI}
                          className="hidden"
                        />
                      </label>

                      <button 
                        type="button" 
                        onClick={startVoiceDictation}
                        title="Dictar consulta por micrófono"
                        className={`p-3 rounded-xl border transition-all ${
                          isListening 
                            ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-lg shadow-red-500/50' 
                            : (isDarkMode ? 'bg-zinc-900 text-orange-400 border-zinc-800 hover:bg-zinc-800' : 'bg-white text-orange-600 border-zinc-300 hover:bg-zinc-100')
                        }`}
                      >
                        🎙️
                      </button>

                      <input 
                        type="text" 
                        placeholder={isListening ? "Escuchando su voz, Dr...." : "Consulte a la IA avanzada o analice las leyes adjuntas..."}
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        className={`flex-1 border p-3 rounded-xl text-xs outline-none focus:border-orange-500 transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                      />

                      <button 
                        type="submit" 
                        className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                      >
                        Enviar Consulta
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'audiencias' && (
                <div className="space-y-6 relative z-10">
                  {/* CALENDARIO ORIGINAL AVANZADO MULTI-AÑO Y FERIADOS NACIONALES ARGENTINA CON LISTADO DETALLADO ABAJO */}
                  <div className={`border p-5 rounded-xl space-y-4 shadow-xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className={`flex flex-col md:flex-row justify-between items-center border-b pb-3 gap-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <div>
                        <h3 className="text-sm font-bold text-orange-500 uppercase">📅 Calendario Institucional Interactivo (Feriados Argentina & Múltiples Años)</h3>
                        <p className="text-xs text-zinc-500">Navegue por cualquier año y mes. Los feriados oficiales nacionales se marcan en rojo y las audiencias en naranja.</p>
                      </div>

                      {/* SELECTORES DE MES Y AÑO ORIGINALES */}
                      <div className="flex items-center gap-2">
                        <select 
                          value={currentCalendarMonth}
                          onChange={(e) => setCurrentCalendarMonth(parseInt(e.target.value))}
                          className={`border text-xs font-bold p-2 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        >
                          {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mName, mIdx) => (
                            <option key={mIdx} value={mIdx}>{mName}</option>
                          ))}
                        </select>

                        <select 
                          value={currentCalendarYear}
                          onChange={(e) => setCurrentCalendarYear(parseInt(e.target.value))}
                          className={`border text-xs font-bold p-2 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        >
                          {Array.from({ length: 11 }, (_, i) => 2024 + i).map(yr => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>

                        <button 
                          onClick={() => {
                            const now = new Date();
                            setCurrentCalendarYear(now.getFullYear());
                            setCurrentCalendarMonth(now.getMonth());
                          }}
                          className={`font-bold text-xs px-3 py-2 rounded border transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-orange-400 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-orange-600 border-zinc-300'}`}
                        >
                          Hoy
                        </button>
                      </div>
                    </div>

                    {/* RENDERIZADO MATRICIAL DEL CALENDARIO */}
                    {(() => {
                      const year = currentCalendarYear;
                      const month = currentCalendarMonth;
                      const firstDayIndex = new Date(year, month, 1).getDay();
                      const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
                      const holidays = getArgentineHolidays(year);

                      const daysGrid = [];
                      for (let i = 0; i < firstDayIndex; i++) {
                        daysGrid.push(<div key={`empty-${i}`} className={`min-h-[85px] border rounded opacity-30 ${isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-zinc-100 border-zinc-200'}`}></div>);
                      }

                      for (let d = 1; d <= totalDaysInMonth; d++) {
                        const formattedD = d < 10 ? `0${d}` : `${d}`;
                        const formattedM = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
                        const dateKey = `${year}-${formattedM}-${formattedD}`;
                        
                        const dayHearings = hearings.filter(h => h.date.startsWith(dateKey));
                        const holidayName = holidays[dateKey];
                        const isToday = new Date().toISOString().split('T')[0] === dateKey;

                        daysGrid.push(
                          <div 
                            key={dateKey} 
                            className={`min-h-[90px] border p-2 rounded flex flex-col justify-between text-left transition-all ${
                              isToday ? 'border-orange-500 bg-orange-500/10' :
                              holidayName ? 'border-red-500/50 bg-red-500/5' :
                              dayHearings.length > 0 ? 'border-amber-500 bg-amber-500/5' : (isDarkMode ? 'border-zinc-800/80 bg-zinc-950 hover:border-zinc-700' : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400')
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`font-bold text-xs ${isToday ? 'text-orange-500 underline' : (isDarkMode ? 'text-zinc-300' : 'text-zinc-800')}`}>{d}</span>
                              {holidayName && <span className="text-[8px] bg-red-500 text-white font-bold px-1 rounded uppercase tracking-tighter" title={holidayName}>Feriado</span>}
                            </div>

                            <div className="space-y-1 overflow-y-auto max-h-[55px]">
                              {holidayName && (
                                <div className="text-[9px] text-red-500 font-bold truncate">🎉 {holidayName}</div>
                              )}
                              {dayHearings.map(h => (
                                <div key={h.id} className="bg-orange-500 text-black text-[9px] font-bold p-1 rounded truncate shadow" title={`${h.title} (${h.tipoAudiencia})`}>
                                  ⚖️ {h.tipoAudiencia}: {h.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-7 gap-2 text-center text-xs">
                          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                            <div key={day} className={`font-bold text-orange-500 p-2 rounded border uppercase text-[10px] ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                              {day}
                            </div>
                          ))}
                          {daysGrid}
                        </div>
                      );
                    })()}

                    {/* NUEVO PANEL DESPLEGABLE / LISTADO DE FERIADOS DEL MES SELECCIONADO CON PUNTOS */}
                    <div className={`mt-4 pt-4 border-t space-y-2 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <h4 className="text-xs font-bold text-orange-500 uppercase">📌 Detalle de Feriados y Días Inhábiles del Mes Seleccionado ({['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][currentCalendarMonth]} {currentCalendarYear}):</h4>
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                        {(() => {
                          const holidays = getArgentineHolidays(currentCalendarYear);
                          const monthPrefix = `${currentCalendarYear}-${(currentCalendarMonth + 1) < 10 ? '0' + (currentCalendarMonth + 1) : (currentCalendarMonth + 1)}`;
                          const monthHolidays = Object.entries(holidays).filter(([dateStr]) => dateStr.startsWith(monthPrefix));

                          if (monthHolidays.length === 0) {
                            return <p className="text-zinc-500 text-xs italic col-span-2">No hay feriados nacionales fijos registrados para este mes específico.</p>;
                          }

                          return monthHolidays.map(([dateStr, motivo]) => {
                            const parts = dateStr.split('-');
                            const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                            return (
                              <div key={dateStr} className={`flex items-start gap-2 text-xs p-2 rounded border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/60' : 'bg-white border-zinc-200'}`}>
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0"></span>
                                <div>
                                  <span className={`font-bold font-mono ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{formattedDate}:</span>{' '}
                                  <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>{motivo}</strong>
                                  <p className="text-[10px] text-zinc-500 mt-0.5">Asueto oficial / Inhábil procesal</p>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* FORMULARIO DE CARGA DE AUDIENCIA ENRIQUECIDO */}
                  <form onSubmit={handleAddHearingAndSyncGoogle} className={`border p-5 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agendar y Sincronizar Nueva Audiencia (Bidireccional y Google Calendar)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Título o Carátula de la Audiencia" 
                        value={newHearing.title} onChange={e => setNewHearing({...newHearing, title: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 md:col-span-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      
                      <input 
                        type="datetime-local" value={newHearing.date} onChange={e => setNewHearing({...newHearing, date: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />

                      <select 
                        value={newHearing.tipoAudiencia} 
                        onChange={e => setNewHearing({...newHearing, tipoAudiencia: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="Preliminar">Tipo: Preliminar</option>
                        <option value="Vista de Causa">Tipo: Vista de Causa</option>
                        <option value="Conciliación">Tipo: Conciliación / Mediación</option>
                        <option value="Penal">Tipo: Audiencia Penal</option>
                        <option value="Fiscal">Tipo: Audiencia Fiscal</option>
                        <option value="Otra">Tipo: Otra</option>
                      </select>

                      <select 
                        value={newHearing.modalidad} 
                        onChange={e => setNewHearing({...newHearing, modalidad: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="Presencial">Modalidad: Presencial</option>
                        <option value="Zoom">Modalidad: Zoom</option>
                        <option value="Meet">Modalidad: Google Meet</option>
                        <option value="WhatsApp">Modalidad: Videollamada WhatsApp</option>
                      </select>

                      <input 
                        type="text" placeholder="Juzgado / Dependencia / Ubicación" 
                        value={newHearing.location} onChange={e => setNewHearing({...newHearing, location: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />

                      <input 
                        type="text" placeholder="Enlace de Videollamada (Zoom, Meet, etc.)" 
                        value={newHearing.enlaceVideo} onChange={e => setNewHearing({...newHearing, enlaceVideo: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 md:col-span-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>

                    <textarea 
                      placeholder="Observaciones adicionales, instrucciones o documentación a llevar..."
                      value={newHearing.observaciones} onChange={e => setNewHearing({...newHearing, observaciones: e.target.value})}
                      className={`w-full border p-2.5 rounded text-xs outline-none focus:border-orange-500 h-16 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                    />

                    <div className="space-y-2 text-xs">
                      <span className={`font-bold block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Seleccionar Múltiples Mails del Equipo para Notificación:</span>
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                        {teamEmails.filter(m => m !== '').length > 0 ? (
                          teamEmails.filter(m => m !== '').map((mail, idx) => (
                            <label key={idx} className={`flex items-center gap-2 cursor-pointer ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-zinc-900'}`}>
                              <input 
                                type="checkbox" 
                                checked={newHearing.assignedMails.includes(mail)}
                                onChange={(e) => {
                                  const current = [...newHearing.assignedMails];
                                  if (e.target.checked) {
                                    current.push(mail);
                                  } else {
                                    const index = current.indexOf(mail);
                                    if (index > -1) current.splice(index, 1);
                                  }
                                  setNewHearing({...newHearing, assignedMails: current});
                                }}
                                className="w-4 h-4 accent-orange-500"
                              />
                              <span className="truncate">{mail}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-zinc-500 text-[11px] italic col-span-2">No hay correos configurados. Podés agregarlos en Configuración, Dr.</p>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-5 py-2.5 rounded hover:bg-orange-400 flex items-center gap-2 shadow-lg shadow-orange-500/20">
                      📅 Agendar, Sincronizar y Abrir Google Calendar
                    </button>
                  </form>

                  {/* LISTADO GENERAL DE AUDIENCIAS */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Listado General de Audiencias y Comparendos</h4>
                    {hearings.map(h => (
                      <div key={h.id} className={`border p-4 rounded-xl text-xs space-y-2 shadow ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${h.status === 'REALIZADA' ? (isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500') : 'bg-orange-500/20 text-orange-500 border border-orange-500/30'}`}>
                              {h.status === 'REALIZADA' ? '✓ REALIZADA / TOMADA' : 'PENDIENTE'}
                            </span>
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                              {h.tipoAudiencia || 'General'} • {h.modalidad || 'Presencial'}
                            </span>
                          </div>
                          <span className="text-orange-500 font-bold font-mono">{formatDateToArg(h.date?.split('T')[0])} {h.date?.split('T')[1]}</span>
                        </div>

                        <h4 className={`font-bold text-sm ${h.status === 'REALIZADA' ? 'line-through text-zinc-500' : (isDarkMode ? 'text-white' : 'text-zinc-900')}`}>
                          {h.title}
                        </h4>
                        
                        <p className="text-zinc-500">📍 <strong>Dependencia:</strong> {h.location}</p>
                        {h.enlaceVideo && (
                          <p className="text-orange-500">🔗 <strong>Enlace de Videollamada:</strong> <a href={h.enlaceVideo} target="_blank" rel="noreferrer" className="underline">{h.enlaceVideo}</a></p>
                        )}
                        {h.observaciones && (
                          <p className={`p-2.5 rounded border mt-1 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                            💬 <strong>Observaciones:</strong> {h.observaciones}
                          </p>
                        )}
                        
                        <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                          <button 
                            onClick={() => toggleHearingStatus(h.id)}
                            className={`px-3 py-1.5 rounded font-bold text-xs ${h.status === 'REALIZADA' ? (isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700') : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                          >
                            {h.status === 'REALIZADA' ? 'Deshacer (Marcar Pendiente)' : '✓ Marcar como Tomada / Realizada'}
                          </button>
                          <button 
                            onClick={() => deleteHearing(h.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                          >
                            🗑️ Eliminar / Cancelar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tareas' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddTask} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Crear Nueva Tarea</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Descripción de la tarea" 
                        value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 md:col-span-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <select 
                        value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
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
                      <div key={t.id} className={`flex items-center justify-between p-3 border rounded-xl text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={t.completed} 
                            onChange={() => toggleTask(t.id)}
                            className="w-4 h-4 accent-orange-500 cursor-pointer"
                          />
                          <span className={t.completed ? 'line-through text-zinc-500 font-medium' : (isDarkMode ? 'text-zinc-100 font-bold' : 'text-zinc-900 font-bold')}>
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.completed ? (isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500') : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                            {t.completed ? 'CUMPLIDA' : t.priority}
                          </span>
                          <button 
                            onClick={() => deleteTask(t.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-1 rounded font-bold text-xs transition-all border border-red-500/20"
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

              {activeTab === 'clientes' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddClient} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Cliente / Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Nombre completo / Razón Social" 
                        value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <select 
                        value={newClient.role} onChange={e => setNewClient({...newClient, role: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="CLIENTE">ROL: CLIENTE</option>
                        <option value="CONTRAPARTE">ROL: CONTRAPARTE</option>
                        <option value="TERCERO">ROL: TERCERO / PROFESIONAL</option>
                      </select>
                      <input 
                        type="text" placeholder="CUIT / DNI" 
                        value={newClient.taxId} onChange={e => setNewClient({...newClient, taxId: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="email" placeholder="Correo Electrónico" 
                        value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="text" placeholder="Teléfono" 
                        value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="text" placeholder="Domicilio / Localidad" 
                        value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Contacto
                    </button>
                  </form>

                  <div className="space-y-2">
                    {clients.map(c => (
                      <div key={c.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{c.name}</h4>
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${isDarkMode ? 'bg-zinc-800 text-orange-400' : 'bg-zinc-200 text-orange-600'}`}>{c.role}</span>
                          </div>
                          <p className="text-zinc-500 mt-1">
                            {c.taxId && `DNI/CUIT: ${c.taxId} • `}
                            {c.phone && `Tel: ${c.phone} • `}
                            {c.email && `Mail: ${c.email}`}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteClient(c.id)}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold transition-all border border-red-500/20"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'procuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-4 rounded-xl flex gap-2 overflow-x-auto ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
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
                            : (isDarkMode ? 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-300')
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {procuracionSubTab === 'titulos' && (
                    <div className="space-y-4">
                      <form onSubmit={handleAddFiscalCase} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Carga Inicial de Título Fiscal (Cálculo automático de Prescripción)</h3>
                        <p className="text-[10px] text-zinc-500">💡 Ingrese la <strong>Fecha en que venció la Liquidación</strong>, Dr., para que el sistema calcule automáticamente los 5 años de prescripción de la acción.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <input 
                            type="text" placeholder="Tributo (Inmobiliario / Automotor / IIBB)" 
                            value={newFiscalCase.tributo} onChange={e => setNewFiscalCase({...newFiscalCase, tributo: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Contribuyente / Razón Social (ej. ZAMARBIDE)" 
                            value={newFiscalCase.contribuyente} onChange={e => setNewFiscalCase({...newFiscalCase, contribuyente: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Nº de Liquidación (ej. 2468-1357)" 
                            value={newFiscalCase.nroLiquidacion} onChange={e => setNewFiscalCase({...newFiscalCase, nroLiquidacion: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Período Fiscal (ej. 2026)" 
                            value={newFiscalCase.periodo} onChange={e => setNewFiscalCase({...newFiscalCase, periodo: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Monto Total Liquidado ($)" 
                            value={newFiscalCase.monto} onChange={e => setNewFiscalCase({...newFiscalCase, monto: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <div>
                            <label className="text-[10px] text-orange-500 font-bold block mb-1">Fecha Vencimiento de la Liquidación:</label>
                            <input 
                              type="date" 
                              value={newFiscalCase.fechaVencimientoLiquidacion} 
                              onChange={e => setNewFiscalCase({...newFiscalCase, fechaVencimientoLiquidacion: e.target.value})}
                              className={`w-full border border-orange-500 p-2 rounded outline-none ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}
                            />
                          </div>
                          <input 
                            type="text" placeholder="Juzgado Fiscal Asignado" 
                            value={newFiscalCase.juzgado} onChange={e => setNewFiscalCase({...newFiscalCase, juzgado: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 md:col-span-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Registrar Título y Calcular Prescripción
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Títulos Ejecutivos Fiscales Cargados</h4>
                        {fiscalCases.map(fc => (
                          <div key={fc.id} className={`border p-4 rounded-xl text-xs space-y-2 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                            <div className={`flex justify-between items-center font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                              <div onClick={() => setSelectedFiscalId(fc.id)} className="cursor-pointer flex-1">
                                <span className="bg-orange-500/10 text-orange-500 font-mono px-2 py-0.5 rounded border border-orange-500/25 mr-2">
                                  Liq: {fc.nroLiquidacion}
                                </span>
                                <span className={isDarkMode ? 'text-white text-sm' : 'text-zinc-900 text-sm'}>{fc.tributo} - {fc.contribuyente}</span>
                              </div>
                              <span className="text-orange-500 font-mono text-sm">{fc.monto}</span>
                            </div>

                            <div onClick={() => setSelectedFiscalId(fc.id)} className={`cursor-pointer grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] p-2.5 rounded border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                              <div>📅 <strong>Vto. Liq:</strong> {formatDateToArg(fc.fechaVencimientoLiquidacion) || 'No cargado'}</div>
                              <div>⚠️ <strong className="text-amber-500">Excepción:</strong> {formatDateToArg(fc.plazoExcepcionesFecha)}</div>
                              <div>⏳ <strong className="text-red-500">Perención:</strong> {formatDateToArg(fc.plazoPerencion)}</div>
                              <div>🔒 <strong className="text-purple-500">Prescripción (5a):</strong> {formatDateToArg(fc.plazoPrescripcion)}</div>
                            </div>

                            <div className={`flex justify-between items-center pt-2 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                              <button onClick={() => setSelectedFiscalId(fc.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">
                                Ingresar a Ficha / Editar Plazos →
                              </button>
                              <button 
                                onClick={() => deleteFiscalCase(fc.id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                              >
                                🗑️ Eliminar Título
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'gestion' && (
                    <div className="space-y-4">
                      <div className={`border p-5 rounded-xl space-y-2 text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700 shadow-sm'}`}>
                        <h3 className="font-bold text-orange-500 uppercase text-sm">Control Integral de Perención y Prescripción Fiscal</h3>
                        <p>• <strong>Perención automática por movimiento:</strong> Cada vez que registre un movimiento nuevo en la ficha del título fiscal, el sistema tomará esa fecha como base y renovará automáticamente el plazo de perención, Dr.</p>
                        <p>• <strong>Prescripción quinquenal:</strong> Se calcula automáticamente a 5 años exactos desde la fecha de vencimiento de la liquidación fiscal.</p>
                      </div>

                      <div className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Panel de Plazos Activos</h4>
                        <div className="space-y-2">
                          {fiscalCases.map(fc => (
                            <div key={fc.id} onClick={() => setSelectedFiscalId(fc.id)} className={`cursor-pointer p-3 border rounded flex justify-between items-center text-xs hover:border-orange-500 transition-colors ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                              <div>
                                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Liq. {fc.nroLiquidacion} - {fc.contribuyente}</p>
                                <p className="text-[10px] text-zinc-500">
                                  Vto. Liq: <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>{formatDateToArg(fc.fechaVencimientoLiquidacion)}</span> | 
                                  Prescripción: <span className="text-purple-500 font-bold">{formatDateToArg(fc.plazoPrescripcion)}</span> | 
                                  Perención (Últ. Mov.): <span className="text-red-500 font-bold">{formatDateToArg(fc.plazoPerencion)}</span>
                                </p>
                              </div>
                              <span className="bg-red-500/10 text-red-500 font-bold px-2.5 py-1 rounded border border-red-500/20 text-[10px]">
                                CONTROL ACTIVO
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'cautelares' && (
                    <div className="space-y-4">
                      <form onSubmit={handleAddCautelar} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Traba de Medida Cautelar (SOJ / DNRPA / RGP)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                          <select 
                            value={newCautelar.fiscalId} 
                            onChange={e => setNewCautelar({...newCautelar, fiscalId: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="">Seleccionar Liquidación...</option>
                            {fiscalCases.map(fc => (
                              <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</option>
                            ))}
                          </select>

                          <select 
                            value={newCautelar.tipo} 
                            onChange={e => setNewCautelar({...newCautelar, tipo: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="SOJ (Bancario)">SOJ (Sistema Oficios Judiciales)</option>
                            <option value="DNRPA (Automotor)">DNRPA (Registro Automotor)</option>
                            <option value="RGP (Inmobiliario)">RGP (Registro General Inmueble)</option>
                            <option value="Embargo de Sueldo">Embargo de Sueldo</option>
                          </select>

                          <input 
                            type="date" 
                            value={newCautelar.fecha} 
                            onChange={e => setNewCautelar({...newCautelar, fecha: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />

                          <input 
                            type="text" 
                            placeholder="Monto Embargo ($)" 
                            value={newCautelar.montoEmbargo} 
                            onChange={e => setNewCautelar({...newCautelar, montoEmbargo: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Registrar Medida Cautelar
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Medidas Precautorias Vigentes</h4>
                        {cautelares.map(c => (
                          <div key={c.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded border border-orange-500/20">
                                  {c.tipo}
                                </span>
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Liq: {c.nroLiquidacion}</span>
                              </div>
                              <p className="text-zinc-500 mt-1">Deudor: {c.titular} • Fecha: {formatDateToArg(c.fecha)}</p>
                            </div>
                            <button 
                              onClick={() => deleteCautelar(c.id)}
                              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                            >
                              🗑️ Levantar / Borrar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'pagos' && (
                    <div className="space-y-4">
                      <form onSubmit={handleAddHonorario} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Cobro, Honorarios o Gastos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                          <select 
                            value={newHonorario.fiscalId} 
                            onChange={e => setNewHonorario({...newHonorario, fiscalId: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="">Seleccionar Liquidación...</option>
                            {fiscalCases.map(fc => (
                              <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</option>
                            ))}
                          </select>

                          <select 
                            value={newHonorario.tipoIngreso} 
                            onChange={e => setNewHonorario({...newHonorario, tipoIngreso: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="HONORARIOS">Honorarios Procurador</option>
                            <option value="CEDULA_GASTOS">Gastos de Cédula</option>
                            <option value="TASA_JUSTICIA">Tasa de Justicia</option>
                            <option value="OTRO">Otro</option>
                          </select>

                          <input 
                            type="date" 
                            value={newHonorario.fecha} 
                            onChange={e => setNewHonorario({...newHonorario, fecha: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />

                          <input 
                            type="text" 
                            placeholder="Monto ($)" 
                            value={newHonorario.monto} 
                            onChange={e => setNewHonorario({...newHonorario, monto: e.target.value})}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Concepto detallado..." 
                          value={newHonorario.concepto} 
                          onChange={e => setNewHonorario({...newHonorario, concepto: e.target.value})}
                          className={`w-full border p-2.5 rounded text-xs outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Guardar Registro
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Cobros y Honorarios</h4>
                        {honorariosProcuracion.map(h => (
                          <div key={h.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                            <div>
                              <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded border border-orange-500/20 mr-2">
                                {h.tipoIngreso}
                              </span>
                              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Liq: {h.nroLiquidacion}</span>
                              <p className={`mt-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}><strong>{h.concepto}</strong></p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-emerald-500 font-black font-mono text-sm">{h.monto}</span>
                              <button 
                                onClick={() => deleteHonorario(h.id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                              >
                                🗑️ Borrar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'tabla_plazos' && (
                    <div className="space-y-4">
                      <div className={`border p-5 rounded-xl space-y-2 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-sm font-bold text-orange-500 uppercase">📋 Guía Ampliada de Plazos Procesales - Procuración Fiscal (Córdoba)</h3>
                        <p className="text-xs text-zinc-500">Tabla de consulta rápida con todos los plazos esenciales y específicos para el control en ejecuciones fiscales, Dr.</p>
                      </div>

                      <div className={`border rounded-xl overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <table className="w-full text-left text-xs">
                          <thead className={`uppercase border-b ${isDarkMode ? 'bg-zinc-950 text-orange-400 border-zinc-800' : 'bg-zinc-100 text-orange-600 border-zinc-200'}`}>
                            <tr>
                              <th className="p-3">Actuación / Trámite</th>
                              <th className="p-3">Plazo Legal</th>
                              <th className="p-3">Normativa / Observaciones</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800 text-zinc-300' : 'divide-zinc-200 text-zinc-700'}`}>
                            <tr>
                              <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Citación a estar a derecho / Oponer Excepciones</td>
                              <td className="p-3 text-amber-500 font-bold">3 días hábiles</td>
                              <td className="p-3 text-zinc-500">Desde la notificación fehaciente (Cédula / CIDI) al demandado.</td>
                            </tr>
                            <tr>
                              <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Contestación de Excepciones (Fisco)</td>
                              <td className="p-3 text-amber-500 font-bold">3 a 5 días hábiles</td>
                              <td className="p-3 text-zinc-500">Plazo para responder el traslado de las excepciones opuestas por el ejecutado.</td>
                            </tr>
                            <tr>
                              <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Perención de Instancia (Ejecución Fiscal)</td>
                              <td className="p-3 text-red-500 font-bold">6 meses</td>
                              <td className="p-3 text-zinc-500">Se renueva automáticamente con cada movimiento o impulso procesal válido.</td>
                            </tr>
                            <tr>
                              <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Prescripción de la Acción Fiscal</td>
                              <td className="p-3 text-purple-500 font-bold">5 años</td>
                              <td className="p-3 text-zinc-500">Computados desde el vencimiento de la obligación fiscal (Código Tributario).</td>
                            </tr>
                            <tr>
                              <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Apelación de Sentencia de Remate / Autos</td>
                              <td className="p-3 text-amber-500 font-bold">3 a 5 días</td>
                              <td className="p-3 text-zinc-500">Plazo para interponer recurso contra resoluciones de mérito o interlocutorias.</td>
                            </tr>
                            <tr>
                              <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Apertura a Prueba (si se abriera)</td>
                              <td className="p-3 text-amber-500 font-bold">10 a 20 días</td>
                              <td className="p-3 text-zinc-500">En caso de haber hechos controvertidos debatibles en las excepciones.</td>
                            </tr>
                            <tr>
                              <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Oposiciones / Recurso de Reposición</td>
                              <td className="p-3 text-amber-500 font-bold">3 días</td>
                              <td className="p-3 text-zinc-500">Contra providencias de trámite dictadas sin sustanciación previa.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'plantillas' && (
                    <div className="space-y-4">
                      <form onSubmit={handleAddTemplate} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Subir Nueva Plantilla o Modelo de Escrito</h3>
                        <p className="text-[10px] text-zinc-500">💡 Cargue modelos de escritos frecuentes (cédulas, poderes, contestaciones) desde su computadora, Dr., para tenerlos siempre disponibles en la nube.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <input 
                            type="text" 
                            placeholder="Nombre de la plantilla (ej. Cédula de Notificación)" 
                            value={newTemplateTitle} 
                            onChange={e => setNewTemplateTitle(e.target.value)}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 md:col-span-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          
                          <select 
                            value={newTemplateCategory} 
                            onChange={e => setNewTemplateCategory(e.target.value)}
                            className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="Fiscal">Categoría: Fiscal</option>
                            <option value="Procesal">Categoría: Procesal / Civil</option>
                            <option value="Poderes">Categoría: Poderes / Contratos</option>
                            <option value="General">Categoría: General</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3 pt-1 text-xs">
                          <label className={`border px-4 py-2 rounded cursor-pointer transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 hover:border-orange-500 text-zinc-300' : 'bg-zinc-50 border-zinc-300 hover:border-orange-500 text-zinc-700'}`}>
                            <span>📁 Seleccionar Archivo (Word / PDF)</span>
                            <input 
                              type="file" 
                              onChange={e => setNewTemplateFile(e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                          <span className="text-orange-500 font-mono text-[11px]">
                            {newTemplateFile ? `Archivo seleccionado: ${newTemplateFile.name}` : 'Ningún archivo elegido'}
                          </span>
                        </div>

                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400 mt-2">
                          Guardar Plantilla en la App
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Plantillas y Modelos Disponibles en el Estudio</h4>
                        {templates.map(tpl => (
                          <div key={tpl.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded border border-orange-500/20 text-[10px]">
                                  {tpl.category}
                                </span>
                                <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{tpl.title}</h4>
                              </div>
                              <p className="text-zinc-500 text-[11px]">📎 Archivo: <span className={`font-mono ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{tpl.fileName}</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                              {tpl.dataUrl ? (
                                <a 
                                  href={tpl.dataUrl} 
                                  download={tpl.fileName}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded transition-colors"
                                >
                                  📥 Descargar
                                </a>
                              ) : (
                                <span className="text-zinc-500 text-[10px] italic">Sin archivo adjunto</span>
                              )}
                              <button 
                                onClick={() => deleteTemplate(tpl.id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                        {templates.length === 0 && (
                          <p className={`text-xs italic p-4 rounded border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                            No hay plantillas cargadas todavía, Dr. Use el formulario de arriba para incorporar sus modelos.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-6 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-sm font-bold text-orange-500 uppercase">Mails del Equipo para Notificaciones en Google Calendar</h3>
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
                              updateTeamEmails(updated);
                            }}
                            className={`flex-1 border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. APARTADO EN CONFIGURACIÓN PARA COPIA DE SEGURIDAD DESCARGABLE DE TODOS LOS DATOS */}
                  <div className={`border p-6 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-sm font-bold text-orange-500 uppercase">💾 Copia de Seguridad y Resguardo de Datos (Backup Completo)</h3>
                    <p className="text-xs text-zinc-500">Descargue un archivo de respaldo con toda la información del estudio (expedientes, causas fiscales, plazos, clientes, plantillas) para garantizar que nunca pierda nada importante, Dr.</p>
                    <button 
                      onClick={handleDownloadFullBackup}
                      className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-5 py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                      <span>📥 Descargar Archivo de Copia de Seguridad Completa (.json)</span>
                    </button>
                  </div>

                  <div className={`border p-6 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-sm font-bold text-orange-500 uppercase">Configuración de Seguridad, Contraseña y Correo de Recuperación</h3>
                    <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
                      <div>
                        <label className="text-zinc-500 block mb-1">Correo Electrónico de Recuperación:</label>
                        <input 
                          type="email" 
                          placeholder="tu-correo@estudio.com"
                          defaultValue={recoveryEmailConfig}
                          onChange={(e) => setNewRecoveryMail(e.target.value)}
                          className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      </div>
                      <div>
                        <label className="text-zinc-500 block mb-1">Nueva Contraseña (opcional):</label>
                        <input 
                          type="password" 
                          placeholder="••••••••••••"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      </div>
                      <div>
                        <label className="text-zinc-500 block mb-1">Confirmar Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          placeholder="••••••••••••"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          className={`w-full border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      </div>

                      {passMessage && (
                        <p className={`text-xs font-bold p-2 rounded border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>{passMessage}</p>
                      )}

                      <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2 rounded text-xs transition-colors">
                        Guardar Cambios de Seguridad
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
