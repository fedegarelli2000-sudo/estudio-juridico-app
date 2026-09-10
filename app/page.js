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
  const [recoveryEmailConfig, setRecoveryEmailConfig] = useState('federico@estudio.com');
  
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryInputEmail, setRecoveryInputEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  useEffect(() => {
    const savedPassword = localStorage.getItem('lex_app_password');
    if (savedPassword) setCurrentPassword(savedPassword);

    const savedRecoveryMail = localStorage.getItem('lex_recovery_email');
    if (savedRecoveryMail) setRecoveryEmailConfig(savedRecoveryMail);

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
      setRecoveryMessage(`✅ ¡Correo verificado! Su contraseña actual es: "${currentPassword}". Anótela en un lugar seguro.`);
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
      localStorage.setItem('lex_app_password', newPass);
    }
    if (newRecoveryMail) {
      setRecoveryEmailConfig(newRecoveryMail);
      localStorage.setItem('lex_recovery_email', newRecoveryMail);
    }
    setPassMessage('✅ ¡Credenciales y ajustes de seguridad actualizados con éxito!');
    setNewPass('');
    setConfirmPass('');
    setNewRecoveryMail('');
  };

  // --- NAVEGACIÓN Y ESTADOS ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedFiscalId, setSelectedFiscalId] = useState(null);

  const [teamEmails, setTeamEmails] = useState(['', '', '', '', '', '']);

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
    googleMailSeleccionado: ''
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
      if (newFiscalMovement.googleMailSeleccionado) {
        googleUrl.searchParams.append('add', newFiscalMovement.googleMailSeleccionado);
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
      googleMailSeleccionado: ''
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
    { id: '1', caseId: '1', title: 'Contestar Traslado', dueDate: '2026-09-16', days: 5, status: 'PENDIENTE', isAI: true },
    { id: 'd2', caseId: 'f1', title: '[Liq 8763587] CONTESTACIÓN DE EXCEPCIONES', dueDate: '2026-09-13', days: 3, status: 'PENDIENTE', isAI: false }
  ]);

  const [hearings, setHearings] = useState([
    { id: '1', caseId: '1', title: 'Audiencia Preliminar', date: '2026-09-18T10:00', location: 'Juzgado Civil Nº 12', assignedMail: '', status: 'PENDIENTE' }
  ]);

  const [tasks, setTasks] = useState([
    { id: '1', caseId: '1', title: 'Revisar liquidación de tasa de justicia', priority: 'ALTA', completed: false },
    { id: '2', caseId: '1', title: 'Enviar pliego de preguntas al cliente', priority: 'MEDIA', completed: false },
    { id: '3', caseId: '1', title: 'Buscar copia de DNI en archivo', priority: 'BAJA', completed: true }
  ]);

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

  // FORMULARIOS GENERALES
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newMovement, setNewMovement] = useState({ caseId: '', date: '', title: '', text: '', notes: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  const [newHearing, setNewHearing] = useState({ caseId: '', title: '', date: '', location: '', assignedMail: '' });
  const [newTask, setNewTask] = useState({ caseId: '', title: '', priority: 'MEDIA' });

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
    if (!confirm('¿Está seguro de eliminar este expediente?')) return;
    updateCases(cases.filter(c => c.id !== caseId));
    if (selectedCaseId === caseId) setSelectedCaseId(null);
  };

  const deleteClient = (clientId) => {
    if (!confirm('¿Está seguro de eliminar este contacto?')) return;
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

  const selectedCaseData = cases.find(c => c.id === selectedCaseId);
  const selectedFiscalData = fiscalCases.find(fc => fc.id === selectedFiscalId);

  // --- FILTRO DE ALERTAS URGENTES EN EL DASHBOARD ---
  const today = new Date();
  const urgentFiscalAlerts = fiscalCases.filter(fc => {
    if (fc.alertaExcepcionCumplida) return false;
    if (!fc.plazoExcepcionesFecha || fc.plazoExcepcionesFecha.includes('Pendiente') || fc.plazoExcepcionesFecha.includes('A calcular')) return false;
    const expDate = new Date(fc.plazoExcepcionesFecha);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 10;
  });

  // --- LOGIN / PANTALLA DE ACCESO ---
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

          <p className="text-[10px] text-zinc-600">Sesión protegida por seguridad de sesión estricta.</p>
        </div>
      </div>
    );
  }

  // --- INTERFAZ PRINCIPAL COMPLETA ---
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      
      {/* MENÚ LATERAL CON SCROLL VERTICAL (SOLUCIÓN CELULAR) */}
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
              { id: 'expedientes', label: 'Expedientes / Causas', icon: '📁' },
              { id: 'movimientos', label: 'Movimientos e Historia', icon: '📜' },
              { id: 'plazos', label: 'Plazos Procesales e IA', icon: '⚡' },
              { id: 'tareas', label: 'Tareas y Pendientes', icon: '✅' },
              { id: 'clientes', label: 'Clientes y Contactos', icon: '👥' },
              { id: 'audiencias', label: 'Audiencias y Calendar', icon: '📅' },
              { id: 'procuracion', label: 'Procuración de Rentas (Cba)', icon: '⚖️' },
              { id: 'configuracion', label: 'Configuración / Mails / Clave', icon: '⚙️' }
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

      {/* ÁREA DE CONTENIDO */}
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
          
          {/* DETALLE DE EXPEDIENTE JUDICIAL */}
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

              <form onSubmit={handleAddMovementForCase} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Movimiento</h4>
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
                        <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
                      </div>
                      {m.text && <p className="text-zinc-400">{m.text}</p>}
                    </div>
                  ))}
                  {movements.filter(m => m.caseId === selectedCaseId).length === 0 && (
                    <p className="text-xs text-zinc-600">No hay actuaciones registradas.</p>
                  )}
                </div>
              </div>
            </div>

          ) : selectedFiscalId && selectedFiscalData ? (

            /* DETALLE DE LIQUIDACIÓN FISCAL */
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
                  <div>⏳ <strong className="text-red-400">Perención (Últ. Mov.):</strong> {formatDateToArg(selectedFiscalData.plazoPerencion)}</div>
                  <div>🔒 <strong className="text-purple-400">Prescripción (5 Años):</strong> {formatDateToArg(selectedFiscalData.plazoPrescripcion)}</div>
                </div>

                <div className="pt-2 flex justify-between items-center bg-zinc-950 p-3 rounded border border-zinc-800 text-xs">
                  <div>
                    <span className="font-bold text-white">Estado de la Alerta Urgente:</span>
                    <p className="text-[10px] text-zinc-400">Si ya contestaste o controlaste la excepción, podés marcar la alerta como cumplida para que desaparezca del Dashboard.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = fiscalCases.map(fc => fc.id === selectedFiscalId ? { ...fc, alertaExcepcionCumplida: !fc.alertaExcepcionCumplida } : fc);
                      setFiscalCases(updated);
                      updateFiscalCases(updated);
                    }}
                    className={`px-3 py-1.5 rounded font-bold text-xs transition-colors ${selectedFiscalData.alertaExcepcionCumplida ? 'bg-zinc-800 text-zinc-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                  >
                    {selectedFiscalData.alertaExcepcionCumplida ? '✓ Alerta Cumplida (Hacer Visible)' : '✓ Marcar Alerta como Cumplida / Descartar'}
                  </button>
                </div>
              </div>

              {isEditingFiscal && (
                <form onSubmit={handleSaveEditFiscal} className="bg-zinc-900 border border-orange-500/50 p-5 rounded-xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Edición Completa de Datos y Plazos Fiscales</h4>
                    <button type="button" onClick={() => setIsEditingFiscal(false)} className="text-zinc-400 hover:text-white text-xs">✕ Cancelar</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-zinc-400 block mb-1">Contribuyente:</label>
                      <input 
                        type="text" 
                        value={editFiscalForm.contribuyente || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, contribuyente: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Nº de Liquidación:</label>
                      <input 
                        type="text" 
                        value={editFiscalForm.nroLiquidacion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, nroLiquidacion: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Monto ($):</label>
                      <input 
                        type="text" 
                        value={editFiscalForm.monto || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, monto: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 font-bold text-orange-400">Fecha Vto. Liquidación (Inicia Prescripción):</label>
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
                        className="w-full bg-zinc-950 border border-orange-500 p-2.5 rounded text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Fecha Notificación Demanda:</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.fechaNotificacion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, fechaNotificacion: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Vencimiento Excepción (3d):</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.plazoExcepcionesFecha || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, plazoExcepcionesFecha: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Plazo Perención (Editable):</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.plazoPerencion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, plazoPerencion: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Plazo Prescripción (Editable):</label>
                      <input 
                        type="date" 
                        value={editFiscalForm.plazoPrescripcion || ''} 
                        onChange={e => setEditFiscalForm({...editFiscalForm, plazoPrescripcion: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400">
                    Guardar Modificaciones
                  </button>
                </form>
              )}

              <form onSubmit={handleAddFiscalMovement} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Nuevo Movimiento Procesal (Actualiza Perención)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <select 
                    value={newFiscalMovement.estadoProcesal} 
                    onChange={e => {
                      const val = e.target.value;
                      setNewFiscalMovement({...newFiscalMovement, estadoProcesal: val, title: val});
                    }}
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500 md:col-span-2"
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
                    className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                  />
                </div>

                <textarea 
                  placeholder="Detalle o texto de la actuación procesal..."
                  value={newFiscalMovement.text} 
                  onChange={e => setNewFiscalMovement({...newFiscalMovement, text: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-16"
                />

                <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-3 text-xs">
                  <p className="font-bold text-orange-400 uppercase text-[10px]">⚡ Opciones de Automatización para el Dashboard y Calendario:</p>
                  
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

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newFiscalMovement.agendarEnGoogle} 
                        onChange={e => setNewFiscalMovement({...newFiscalMovement, agendarEnGoogle: e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-orange-400 font-bold">📅 Agendar en Google Calendar</span>
                    </label>
                  </div>

                  {newFiscalMovement.agendarEnGoogle && (
                    <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                      <span className="text-zinc-400">Seleccionar Mail del Equipo:</span>
                      <select 
                        value={newFiscalMovement.googleMailSeleccionado} 
                        onChange={e => setNewFiscalMovement({...newFiscalMovement, googleMailSeleccionado: e.target.value})}
                        className="bg-zinc-900 border border-zinc-800 p-1.5 rounded text-white flex-1"
                      >
                        <option value="">(Opcional) Enviar invitación a correo configurado</option>
                        {teamEmails.filter(m => m !== '').map((m, i) => <option key={i} value={m}>{m}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400">
                  Guardar Movimiento, Renovar Perención y Sincronizar
                </button>
              </form>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Actuaciones</h4>
                <div className="space-y-2">
                  {fiscalMovements.filter(fm => fm.fiscalId === selectedFiscalId).map(fm => (
                    <div key={fm.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs space-y-1">
                      <div className="flex justify-between font-bold text-zinc-200">
                        <span>{fm.title}</span>
                        <span className="text-zinc-500">{formatDateToArg(fm.date)}</span>
                      </div>
                      {fm.text && <p className="text-zinc-400">{fm.text}</p>}
                    </div>
                  ))}
                  {fiscalMovements.filter(fm => fm.fiscalId === selectedFiscalId).length === 0 && (
                    <p className="text-xs text-zinc-600">No hay movimientos registrados para esta liquidación.</p>
                  )}
                </div>
              </div>
            </div>

          ) : (
            <>
              {/* DASHBOARD GENERAL */}
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

                  <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-5 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">🚨 Alertas Urgentes de Procuración Fiscal (Próximos Vencimientos)</h4>
                    {urgentFiscalAlerts.length > 0 ? (
                      <div className="space-y-2">
                        {urgentFiscalAlerts.map(fc => (
                          <div 
                            key={fc.id} 
                            className="p-3 bg-zinc-950 border border-amber-500/40 rounded flex justify-between items-center text-xs"
                          >
                            <div>
                              <span className="bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] mr-2">
                                VENCE PRONTO
                              </span>
                              <span className="font-bold text-white text-sm">Liq: {fc.nroLiquidacion} - {fc.contribuyente}</span>
                              <p className="text-[11px] text-zinc-400 mt-1">
                                Vencimiento Excepción (Demandado): <strong className="text-amber-400">{formatDateToArg(fc.plazoExcepcionesFecha)}</strong>
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
                                className="bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded border border-zinc-700"
                                title="Descartar o marcar alerta como cumplida"
                              >
                                ✓ Cumplida
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic bg-zinc-950 p-3 rounded border border-zinc-800">
                        No hay vencimientos de excepciones próximos a vencer en los siguientes 10 días. Todo al día.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-5 rounded-xl">
                      <h4 className="text-xs font-bold text-orange-500 uppercase mb-3">Próximos Vencimientos Procesales</h4>
                      <div className="space-y-2">
                        {deadlines.filter(d => d.status === 'PENDIENTE').map(d => (
                          <div key={d.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-white">{d.title}</p>
                              <p className="text-[10px] text-zinc-500">Vence: {formatDateToArg(d.dueDate)} ({d.days} días hábiles)</p>
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
                      placeholder="Observaciones..."
                      value={newCase.notes} onChange={e => setNewCase({...newCase, notes: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500 h-16"
                    />
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Expediente
                    </button>
                  </form>

                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 font-medium">Hacé clic en cualquiera de tus expedientes para ingresar:</p>
                    {cases.map(c => (
                      <div 
                        key={c.id} 
                        className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2 transition-all flex justify-between items-center"
                      >
                        <div onClick={() => setSelectedCaseId(c.id)} className="cursor-pointer flex-1">
                          <span className="bg-orange-500/10 text-orange-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/20">
                            {c.number}
                          </span>
                          <span className="ml-2 text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                            {c.processType || 'JUDICIAL'}
                          </span>
                          <h4 className="font-bold text-white text-sm mt-1">{c.caratula}</h4>
                          <p className="text-xs text-zinc-400">{c.court} • Cliente: {c.client}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedCaseId(c.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">
                            Ingresar →
                          </button>
                          <button 
                            onClick={() => deleteCase(c.id)}
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
                      placeholder="Transcripción o síntesis..."
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
                                <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
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

              {/* PLAZOS PROCESALES */}
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
                          <p className="text-zinc-500">Vence: {formatDateToArg(d.dueDate)} ({d.days} días hábiles)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateDeadlines(deadlines.map(x => x.id === d.id ? {...x, status: x.status === 'CUMPLIDO' ? 'PENDIENTE' : 'CUMPLIDO'} : x))}
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

              {/* TAREAS */}
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
                        type="text" placeholder="Teléfono" 
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
                        </div>
                        <button 
                          onClick={() => deleteClient(c.id)}
                          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold transition-all border border-red-500/20"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN PROCURACIÓN DE RENTAS (CBA) */}
              {activeTab === 'procuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-2 overflow-x-auto">
                    {[
                      { id: 'titulos', label: '1. Títulos y Vto. de Liquidación' },
                      { id: 'gestion', label: '2. Plazos y Perención' },
                      { id: 'cautelares', label: '3. Medidas Cautelares' },
                      { id: 'pagos', label: '4. Cobros y Honorarios' },
                      { id: 'tabla_plazos', label: '5. 📋 Tabla de Plazos Procesales (Guía Rápida)' }
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
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Carga Inicial de Título Fiscal (Cálculo automático de Prescripción)</h3>
                        <p className="text-[10px] text-zinc-400">💡 Ingresá la <strong>Fecha en que venció la Liquidación</strong> para que el sistema calcule automáticamente los 5 años de prescripción de la acción.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <input 
                            type="text" placeholder="Tributo (Inmobiliario / Automotor / IIBB)" 
                            value={newFiscalCase.tributo} onChange={e => setNewFiscalCase({...newFiscalCase, tributo: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                          <input 
                            type="text" placeholder="Contribuyente / Razón Social (ej. ZAMARBIDE)" 
                            value={newFiscalCase.contribuyente} onChange={e => setNewFiscalCase({...newFiscalCase, contribuyente: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                          <input 
                            type="text" placeholder="Nº de Liquidación (ej. 2468-1357)" 
                            value={newFiscalCase.nroLiquidacion} onChange={e => setNewFiscalCase({...newFiscalCase, nroLiquidacion: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                          <input 
                            type="text" placeholder="Período Fiscal (ej. 2026)" 
                            value={newFiscalCase.periodo} onChange={e => setNewFiscalCase({...newFiscalCase, periodo: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                          <input 
                            type="text" placeholder="Monto Total Liquidado ($)" 
                            value={newFiscalCase.monto} onChange={e => setNewFiscalCase({...newFiscalCase, monto: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                          <div>
                            <label className="text-[10px] text-orange-400 font-bold block mb-1">Fecha Vencimiento de la Liquidación:</label>
                            <input 
                              type="date" 
                              value={newFiscalCase.fechaVencimientoLiquidacion} 
                              onChange={e => setNewFiscalCase({...newFiscalCase, fechaVencimientoLiquidacion: e.target.value})}
                              className="w-full bg-zinc-950 border border-orange-500 p-2 rounded text-white outline-none"
                            />
                          </div>
                          <input 
                            type="text" placeholder="Juzgado Fiscal Asignado" 
                            value={newFiscalCase.juzgado} onChange={e => setNewFiscalCase({...newFiscalCase, juzgado: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500 md:col-span-2"
                          />
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Registrar Título y Calcular Prescripción
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Títulos Ejecutivos Fiscales Cargados</h4>
                        {fiscalCases.map(fc => (
                          <div key={fc.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs space-y-2">
                            <div className="flex justify-between items-center font-bold text-white">
                              <div onClick={() => setSelectedFiscalId(fc.id)} className="cursor-pointer flex-1">
                                <span className="bg-orange-500/10 text-orange-400 font-mono px-2 py-0.5 rounded border border-orange-500/25 mr-2">
                                  Liq: {fc.nroLiquidacion}
                                </span>
                                <span className="text-white text-sm">{fc.tributo} - {fc.contribuyente}</span>
                              </div>
                              <span className="text-orange-400 font-mono text-sm">{fc.monto}</span>
                            </div>

                            <div onClick={() => setSelectedFiscalId(fc.id)} className="cursor-pointer grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded border border-zinc-800">
                              <div>📅 <strong>Vto. Liq:</strong> {formatDateToArg(fc.fechaVencimientoLiquidacion) || 'No cargado'}</div>
                              <div>⚠️ <strong className="text-amber-400">Excepción:</strong> {formatDateToArg(fc.plazoExcepcionesFecha)}</div>
                              <div>⏳ <strong className="text-red-400">Perención:</strong> {formatDateToArg(fc.plazoPerencion)}</div>
                              <div>🔒 <strong className="text-purple-400">Prescripción (5a):</strong> {formatDateToArg(fc.plazoPrescripcion)}</div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                              <button onClick={() => setSelectedFiscalId(fc.id)} className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded">
                                Ingresar a Ficha / Editar Plazos →
                              </button>
                              <button 
                                onClick={() => deleteFiscalCase(fc.id)}
                                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
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
                      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3 text-xs text-zinc-300">
                        <h3 className="font-bold text-orange-500 uppercase text-sm">Control Integral de Perención y Prescripción Fiscal</h3>
                        <p>• <strong>Perención automática por movimiento:</strong> Cada vez que registrás un movimiento nuevo en la ficha del título fiscal, el sistema toma esa fecha como base y renueva automáticamente el plazo de perención.</p>
                        <p>• <strong>Prescripción quinquenal:</strong> Se calcula automáticamente a 5 años exactos desde la fecha de vencimiento de la liquidación fiscal.</p>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Panel de Plazos Activos</h4>
                        <div className="space-y-2">
                          {fiscalCases.map(fc => (
                            <div key={fc.id} onClick={() => setSelectedFiscalId(fc.id)} className="cursor-pointer p-3 bg-zinc-950 border border-zinc-800 rounded flex justify-between items-center text-xs hover:border-orange-500 transition-colors">
                              <div>
                                <p className="font-bold text-white">Liq. {fc.nroLiquidacion} - {fc.contribuyente}</p>
                                <p className="text-[10px] text-zinc-400">
                                  Vto. Liq: <span className="text-zinc-200">{formatDateToArg(fc.fechaVencimientoLiquidacion)}</span> | 
                                  Prescripción: <span className="text-purple-400 font-bold">{formatDateToArg(fc.plazoPrescripcion)}</span> | 
                                  Perención (Últ. Mov.): <span className="text-red-400 font-bold">{formatDateToArg(fc.plazoPerencion)}</span>
                                </p>
                              </div>
                              <span className="bg-red-500/10 text-red-400 font-bold px-2.5 py-1 rounded border border-red-500/20 text-[10px]">
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
                      <form onSubmit={handleAddCautelar} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Traba de Medida Cautelar (SOJ / DNRPA / RGP)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                          <select 
                            value={newCautelar.fiscalId} 
                            onChange={e => setNewCautelar({...newCautelar, fiscalId: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          >
                            <option value="">Seleccionar Liquidación...</option>
                            {fiscalCases.map(fc => (
                              <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</option>
                            ))}
                          </select>

                          <select 
                            value={newCautelar.tipo} 
                            onChange={e => setNewCautelar({...newCautelar, tipo: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
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
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />

                          <input 
                            type="text" 
                            placeholder="Monto Embargo ($)" 
                            value={newCautelar.montoEmbargo} 
                            onChange={e => setNewCautelar({...newCautelar, montoEmbargo: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Registrar Medida Cautelar
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Medidas Precautorias Vigentes</h4>
                        {cautelares.map(c => (
                          <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-500/10 text-orange-400 font-bold px-2 py-0.5 rounded border border-orange-500/20">
                                  {c.tipo}
                                </span>
                                <span className="text-white font-bold">Liq: {c.nroLiquidacion}</span>
                              </div>
                              <p className="text-zinc-400 mt-1">Deudor: {c.titular} • Fecha: {formatDateToArg(c.fecha)}</p>
                            </div>
                            <button 
                              onClick={() => deleteCautelar(c.id)}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
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
                      <form onSubmit={handleAddHonorario} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Cobro, Honorarios o Gastos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                          <select 
                            value={newHonorario.fiscalId} 
                            onChange={e => setNewHonorario({...newHonorario, fiscalId: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          >
                            <option value="">Seleccionar Liquidación...</option>
                            {fiscalCases.map(fc => (
                              <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</option>
                            ))}
                          </select>

                          <select 
                            value={newHonorario.tipoIngreso} 
                            onChange={e => setNewHonorario({...newHonorario, tipoIngreso: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
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
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />

                          <input 
                            type="text" 
                            placeholder="Monto ($)" 
                            value={newHonorario.monto} 
                            onChange={e => setNewHonorario({...newHonorario, monto: e.target.value})}
                            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Concepto detallado..." 
                          value={newHonorario.concepto} 
                          onChange={e => setNewHonorario({...newHonorario, concepto: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white outline-none focus:border-orange-500"
                        />
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Guardar Registro
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Historial de Cobros y Honorarios</h4>
                        {honorariosProcuracion.map(h => (
                          <div key={h.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <span className="bg-orange-500/10 text-orange-400 font-bold px-2 py-0.5 rounded border border-orange-500/20 mr-2">
                                {h.tipoIngreso}
                              </span>
                              <span className="text-white font-bold">Liq: {h.nroLiquidacion}</span>
                              <p className="text-zinc-300 mt-1"><strong>{h.concepto}</strong></p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-emerald-400 font-black font-mono text-sm">{h.monto}</span>
                              <button 
                                onClick={() => deleteHonorario(h.id)}
                                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-all border border-red-500/20"
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
                      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
                        <h3 className="text-sm font-bold text-orange-500 uppercase">📋 Guía Ampliada de Plazos Procesales - Procuración Fiscal (Córdoba)</h3>
                        <p className="text-xs text-zinc-400">Tabla de consulta rápida con todos los plazos esenciales y específicos para el control en ejecuciones fiscales.</p>
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
                              <td className="p-3 font-bold text-white">Citación a estar a derecho / Oponer Excepciones</td>
                              <td className="p-3 text-amber-400 font-bold">3 días hábiles</td>
                              <td className="p-3 text-zinc-400">Desde la notificación fehaciente (Cédula / CIDI) al demandado.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Contestación de Excepciones (Fisco)</td>
                              <td className="p-3 text-amber-400 font-bold">3 a 5 días hábiles</td>
                              <td className="p-3 text-zinc-400">Plazo para responder el traslado de las excepciones opuestas por el ejecutado.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Perención de Instancia (Ejecución Fiscal)</td>
                              <td className="p-3 text-red-400 font-bold">6 meses</td>
                              <td className="p-3 text-zinc-400">Se renueva automáticamente con cada movimiento o impulso procesal válido.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Prescripción de la Acción Fiscal</td>
                              <td className="p-3 text-purple-400 font-bold">5 años</td>
                              <td className="p-3 text-zinc-400">Computados desde el vencimiento de la obligación fiscal (Código Tributario).</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Apelación de Sentencia de Remate / Autos</td>
                              <td className="p-3 text-amber-400 font-bold">3 a 5 días</td>
                              <td className="p-3 text-zinc-400">Plazo para interponer recurso contra resoluciones de mérito o interlocutorias.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Apertura a Prueba (si se abriera)</td>
                              <td className="p-3 text-amber-400 font-bold">10 a 20 días</td>
                              <td className="p-3 text-zinc-400">In case of haber hechos controvertidos debatibles en las excepciones.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-white">Oposiciones / Recurso de Reposición</td>
                              <td className="p-3 text-amber-400 font-bold">3 días</td>
                              <td className="p-3 text-zinc-400">Contra providencias de trámite dictadas sin sustanciación previa.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONFIGURACIÓN */}
              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
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
                            className="flex-1 bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-orange-500 uppercase">Configuración de Seguridad, Contraseña y Correo de Recuperación</h3>
                    <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
                      <div>
                        <label className="text-zinc-400 block mb-1">Correo Electrónico de Recuperación:</label>
                        <input 
                          type="email" 
                          placeholder="tu-correo@estudio.com"
                          defaultValue={recoveryEmailConfig}
                          onChange={(e) => setNewRecoveryMail(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Nueva Contraseña (opcional):</label>
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
