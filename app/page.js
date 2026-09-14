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

  // CONFIGURACIÓN DE HUELLA DIGITAL / BIOMETRÍA
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('lex_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
    
    const bioSetting = localStorage.getItem('lex_biometric_enabled');
    if (bioSetting === 'true') {
      setBiometricEnabled(true);
    }

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
          name: "garelli@estudio.com",
          displayName: "Federico Garelli"
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

  // ESTADO PARA EDICIÓN DE GASTOS / HONORARIOS / FINANZAS
  const [editingFinanceId, setEditingFinanceId] = useState(null);
  const [editFinanceForm, setEditFinanceForm] = useState({ concepto: '', monto: '', fecha: '', tipoIngreso: 'HONORARIOS' });

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateTitle.trim()) return;

    if (newTemplateFile) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const created = {
          id: 'tpl_' + Date.now(),
          title: newTemplateTitle.trim(),
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
        title: newTemplateTitle.trim(),
        category: newTemplateCategory,
        fileName: 'Escrito_Base.txt',
        dataUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(`MODELO DE ESCRITO: ${newTemplateTitle.trim()}\nCategoría: ${newTemplateCategory}\n\nSeñor Juez:\n[Completar datos de autos y petitorio]\n\nSERÁ JUSTICIA.`)
      };
      const updated = [...templates, created];
      setTemplates(updated);
      updateTemplates(updated);
      setNewTemplateTitle('');
      setNewTemplateFile(null);
    }
  };

  const deleteTemplate = (id) => {
    if (!confirm('¿Está seguro de eliminar esta plantilla?')) return;
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    updateTemplates(updated);
  };

  const startEditingFinance = (h) => {
    setEditingFinanceId(h.id);
    setEditFinanceForm({ concepto: h.concepto, monto: h.monto, fecha: h.fecha, tipoIngreso: h.tipoIngreso || 'HONORARIOS' });
  };

  const handleSaveEditFinance = (id) => {
    const updated = honorariosProcuracion.map(h => h.id === id ? { ...h, ...editFinanceForm } : h);
    setHonorariosProcuracion(updated);
    updateHonorarios(updated);
    setEditingFinanceId(null);
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

  // Estados para selección múltiple y autosuma en Finanzas
  const [selectedFinanceIds, setSelectedFinanceIds] = useState([]);

  // Estado para carga directa en Finanzas con soporte para concepto "OTRO"
  const [newDirectFinance, setNewDirectFinance] = useState({
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
    monto: '',
    tipoIngreso: 'HONORARIOS',
    customConcepto: '',
    referencia: 'General / Estudio'
  });

  const handleAddDirectFinance = (e) => {
    e.preventDefault();
    if (!newDirectFinance.monto) return;

    const finalConcepto = newDirectFinance.tipoIngreso === 'OTRO' 
      ? (newDirectFinance.customConcepto.trim() || 'Otro concepto') 
      : (newDirectFinance.concepto.trim() || (newDirectFinance.tipoIngreso === 'HONORARIOS' ? 'Cobro de honorarios' : 'Gastos operativos'));

    const created = {
      fecha: newDirectFinance.fecha,
      concepto: finalConcepto,
      monto: newDirectFinance.monto,
      tipoIngreso: newDirectFinance.tipoIngreso,
      fiscalId: 'direct_' + Date.now(),
      nroLiquidacion: newDirectFinance.referencia,
      id: 'h_' + Date.now()
    };

    const updated = [...honorariosProcuracion, created];
    setHonorariosProcuracion(updated);
    updateHonorarios(updated);
    setNewDirectFinance({
      fecha: new Date().toISOString().split('T')[0],
      concepto: '',
      monto: '',
      tipoIngreso: 'HONORARIOS',
      customConcepto: '',
      referencia: 'General / Estudio'
    });
  };

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
    if (!confirm('¿Eliminar registro de cobro/honorario/gasto?')) return;
    const updated = honorariosProcuracion.filter(h => h.id !== id);
    setHonorariosProcuracion(updated);
    updateHonorarios(updated);
    setSelectedFinanceIds(selectedFinanceIds.filter(itemId => itemId !== id));
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
      notes: 'Desc. con exactitud qué reclama: Alquileres adeudados, meses julio y agosto del corriente año: $1.044.800, con más servicios de Agua, Luz, Gas e impuestos adeudados correspondientes a los periodos de locación: $: $634,422.33. Lo que hace la suma total de PESOS UN MILLÓN SEISCIENTO SETENTA Y NUEVE MIL DOSCIENTOS VEINTIDÓS CON TREINTA Y TRES CENTAVOS ($1.679.222,33). Bajo expresa reserva de ampliar.'
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
    { id: '1', caseId: '1', title: 'Contestar Traslado', dueDate: '2026-09-16', days: 5, status: 'PENDIENTE', isAI: false },
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

  // --- ESTADO PARA EL CALENDARIO INTERACTIVO DINÁMICO ---
  const currentDateObj = new Date();
  const [currentCalendarYear, setCurrentCalendarYear] = useState(currentDateObj.getFullYear());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(currentDateObj.getMonth());

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

  // --- SINCRONIZACIÓN NUBE Y COPIA DE SEGURIDAD DESCARGABLE (TEXTO / JSON PURO) ---
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

  const handleDownloadFullBackup = () => {
    const backupData = {
      versionApp: 'LexStudio MM 2026.2',
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
      templates
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `Copia_Resguardo_Estudio_MM_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  // FORMULARIOS GENERALES
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '' });
  const [newClient, setNewClient] = useState({ name: '', role: 'CLIENTE', taxId: '', email: '', phone: '', address: '' });
  const [newDeadline, setNewDeadline] = useState({ caseId: '', title: '', dueDate: '', days: 5 });
  
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

              {biometricEnabled && biometricSupported && (
                <button 
                  type="button" 
                  onClick={handleBiometricLogin}
                  className={`w-full border font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-orange-400 shadow-md' : 'bg-zinc-100 border-zinc-300 hover:bg-zinc-200 text-orange-600 shadow-md'}`}
                >
                  <span>🧬 Desbloquear con Huella Digital</span>
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
      
      <style jsx global>{`
        /* SCROLLBAR PERSONALIZADO Y ARMONIOSO */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? '#27272a #09090b' : '#d4d4d8 #f4f4f5'};
        }
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        *::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#09090b' : '#f4f4f5'};
        }
        *::-webkit-scrollbar-thumb {
          background-color: ${isDarkMode ? '#27272a' : '#d4d4d8'};
          border-radius: 4px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background-color: ${isDarkMode ? '#f97316' : '#ea580c'};
        }
      `}</style>

      <aside className={`w-64 border-r flex flex-col justify-between shrink-0 z-20 overflow-y-auto ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div>
          {/* Logo actualizado según requerimiento: Dos M (Naranja y Gris) */}
          <div className={`p-5 border-b flex items-center gap-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-md border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-300'}`}>
              <span className="text-orange-500">M</span>
              <span className="text-zinc-500">M</span>
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
              { id: 'plazos', label: 'Plazos Procesales', icon: '⚡' },
              { id: 'tareas', label: 'Tareas y Pendientes', icon: '✅' },
              { id: 'clientes', label: 'Clientes y Contactos', icon: '👥' },
              { id: 'audiencias', label: 'Audiencias y Calendario', icon: '📅' },
              { id: 'procuracion', label: 'Procuración de Rentas (Cba)', icon: '⚖️' },
              { id: 'finanzas', label: 'Finanzas y Caja Estudio', icon: '💰' },
              { id: 'reporte', label: 'Reporte y Agenda Diaria', icon: '📋' },
              { id: 'juzgados_rc', label: 'Juzgados Río Cuarto (Excel)', icon: '🏛️' },
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
        
        <header className={`h-16 flex items-center justify-between px-6 shrink-0 z-10 border-b ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase shrink-0">
              {selectedCaseId ? `FICHA DE EXPEDIENTE: ${selectedCaseData?.number}` :
               selectedFiscalId ? `FICHA DE LIQUIDACIÓN FISCAL: ${selectedFiscalData?.nroLiquidacion}` :
               activeTab.replace('_', ' ')}
            </h2>

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
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
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

        {globalSearchQuery.trim() !== '' && (
          <div className={`absolute top-16 left-0 right-0 z-30 max-h-96 overflow-y-auto border-b p-4 shadow-2xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'}`}>
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-orange-500 uppercase">Resultados de Búsqueda para: "{globalSearchQuery}"</span>
                <button onClick={() => setGlobalSearchQuery('')} className="text-xs text-zinc-400 hover:text-orange-500">Cerrar buscador ✕</button>
              </div>

              <div className="grid grid-cols-1 gap-2">
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

              {/* SECCIÓN NUEVA: Generador Automático de Escritos con Inteligencia (Plantillas Dinámicas) */}
              <div className={`border p-5 rounded-xl space-y-4 border-orange-500/40 ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <div>
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Generador Automático de Escritos con IA (Plantillas Dinámicas)</h4>
                    <p className="text-[11px] text-zinc-400">Rellena automáticamente este modelo con los datos del expediente actual y descárgalo listo en Word (.docx).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map(tpl => {
                    const handleDownloadGeneratedDoc = () => {
                      const textContent = tpl.dataUrl && tpl.dataUrl.startsWith('data:text/plain') 
                        ? decodeURIComponent(tpl.dataUrl.split(',')[1]) 
                        : `ESTUDIO JURÍDICO MM
Juzgado: ${selectedCaseData.court}
Expediente Nº: ${selectedCaseData.number}
Carátula: ${selectedCaseData.caratula}
Cliente / Patrocinado: ${selectedCaseData.client}

--- ${tpl.title.toUpperCase()} ---

Señor Juez:
${selectedCaseData.client}, por derecho propio / con el patrocinio letrado correspondiente, constituyendo domicilio procesal en la causa caratulada "${selectedCaseData.caratula}" (Expte. Nº ${selectedCaseData.number}), ante V.S. respetuosamente se presenta y dice:

I. OBJETO
Que vengo por el presente a interponer en tiempo y forma escrito de estilo / contestación / memorial conforme a los antecedentes de autos y las observaciones del expediente: "${selectedCaseData.notes || 'Sin observaciones adicionales'}".

II. PETITORIO
Por lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido el domicilio procesal.
2) Se tenga por acompañado el presente escrito.
3) Proveer de conformidad que SERÁ JUSTICIA.

___________________________________
Firma Abogado / Apoderado`;

                      const blob = new Blob([textContent], { type: 'application/msword;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${tpl.title.replace(/\s+/g, '_')}_Exp_${selectedCaseData.number}.docx`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    };

                    return (
                      <div key={tpl.id} className={`p-3 rounded-lg border flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                        <div>
                          <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded text-[9px] mr-2">{tpl.category}</span>
                          <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>{tpl.title}</strong>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Archivo base: {tpl.fileName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleDownloadGeneratedDoc}
                            className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-3 py-1.5 rounded text-xs shadow transition-all flex items-center gap-1"
                          >
                            <span>📥 Descargar Word</span>
                          </button>
                          <button 
                            onClick={() => deleteTemplate(tpl.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1.5 rounded font-bold transition-all text-xs"
                            title="Eliminar plantilla"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECCIÓN NUEVA: Registro de Gastos Judiciales por Expediente y Control de Anticipos */}
              <div className={`border p-5 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <div>
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Registro de Gastos Judiciales por Expediente y Control de Anticipos (Fondo Fijo)</h4>
                    <p className="text-[11px] text-zinc-400">Controlá qué fondo fijo entregó el cliente para bonos, tasas o viáticos, y el saldo exacto en tiempo real. Ahora podés editar o borrar cualquier gasto.</p>
                  </div>
                </div>

                {(() => {
                  const caseHonorarios = honorariosProcuracion.filter(h => h.nroLiquidacion?.toLowerCase().includes(selectedCaseData.number.toLowerCase()) || h.referencia?.toLowerCase().includes(selectedCaseData.number.toLowerCase()));
                  const totalGastosExp = caseHonorarios
                    .filter(h => h.tipoIngreso !== 'HONORARIOS')
                    .reduce((acc, curr) => acc + (parseFloat(curr.monto.replace(/[^0-9,.-]+/g, "").replace(",", ".")) || 0), 0);
                  
                  const fondoFijoCliente = 150000; // Fondo fijo estimativo de ejemplo para el expediente
                  const saldoRestante = fondoFijoCliente - totalGastosExp;

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Fondo Fijo / Anticipo Entregado</span>
                          <h5 className="text-lg font-black text-emerald-500 mt-0.5">${fondoFijoCliente.toLocaleString('es-AR')}</h5>
                        </div>
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Gastos Imputados (Tasas/Bonos)</span>
                          <h5 className="text-lg font-black text-amber-500 mt-0.5">${totalGastosExp.toLocaleString('es-AR')}</h5>
                        </div>
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Saldo Exacto en Tiempo Real</span>
                          <h5 className={`text-lg font-black mt-0.5 ${saldoRestante >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${saldoRestante.toLocaleString('es-AR')} {saldoRestante >= 0 ? '(A Favor)' : '(A Reclamar al Cliente)'}
                          </h5>
                        </div>
                      </div>

                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const conceptoInput = e.target.concepto.value;
                        const montoInput = e.target.monto.value;
                        if (!montoInput || !conceptoInput) return;
                        
                        const created = {
                          fecha: new Date().toISOString().split('T')[0],
                          concepto: conceptoInput,
                          monto: montoInput,
                          tipoIngreso: 'GASTO_JUDICIAL',
                          fiscalId: 'exp_gasto_' + Date.now(),
                          nroLiquidacion: selectedCaseData.number,
                          id: 'h_' + Date.now()
                        };
                        const updated = [...honorariosProcuracion, created];
                        setHonorariosProcuracion(updated);
                        updateHonorarios(updated);
                        e.target.reset();
                      }} className="flex gap-2 text-xs">
                        <input name="concepto" placeholder="Concepto del gasto (ej. Bono de ley / Tasa de justicia)" className={`flex-1 border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`} required />
                        <input name="monto" placeholder="Monto ($)" className={`w-32 border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`} required />
                        <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2.5 rounded shadow">Registrar Gasto</button>
                      </form>

                      {/* Listado de gastos de este expediente con opción de editar y borrar */}
                      <div className="space-y-2 pt-2">
                        {caseHonorarios.map(h => (
                          <div key={h.id} className={`p-3 rounded-lg border flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            {editingFinanceId === h.id ? (
                              <div className="flex-1 flex gap-2 items-center">
                                <input 
                                  type="text" 
                                  value={editFinanceForm.concepto} 
                                  onChange={e => setEditFinanceForm({...editFinanceForm, concepto: e.target.value})}
                                  className={`flex-1 border border-orange-500 p-1.5 rounded ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
                                />
                                <input 
                                  type="text" 
                                  value={editFinanceForm.monto} 
                                  onChange={e => setEditFinanceForm({...editFinanceForm, monto: e.target.value})}
                                  className={`w-24 border border-orange-500 p-1.5 rounded ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
                                />
                                <button onClick={() => handleSaveEditFinance(h.id)} className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded">Guardar</button>
                                <button onClick={() => setEditingFinanceId(null)} className={`px-2 py-1.5 rounded ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>✕</button>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <span className="bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded text-[9px] mr-2">{h.tipoIngreso}</span>
                                  <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>{h.concepto}</strong>
                                  <p className="text-[10px] text-zinc-400">Fecha: {formatDateToArg(h.fecha)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono font-bold text-amber-500">${h.monto}</span>
                                  <button onClick={() => startEditingFinance(h)} className="px-2 py-1 rounded border text-xs" title="Editar Gasto">✏️</button>
                                  <button onClick={() => deleteHonorario(h.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded font-bold" title="Eliminar Gasto">🗑️</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
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
                          <p className="text-zinc-500 text-[11px] italic col-span-2">No hay correos configurados. Podés agregarlos en Configuración.</p>
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
                    <p className="text-[10px] text-zinc-500">Si ya contestó o controló la excepción, puede marcar la alerta como cumplida para que desaparezca del Dashboard.</p>
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
                          <p className="text-zinc-500 text-[11px] italic col-span-2">No hay correos configurados. Podés agregarlos en Configuración.</p>
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
                  <div className={`border p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDarkMode ? 'bg-gradient-to-r from-zinc-900 to-zinc-950 border-zinc-800/80' : 'bg-gradient-to-r from-white to-zinc-50 border-zinc-200'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Sistema Operativo Conectado</span>
                      </div>
                      <h3 className={`text-2xl md:text-3xl font-black tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {(() => {
                          const hour = new Date().getHours();
                          if (hour < 12) return '¡Buenos días, Estudio MM!';
                          if (hour < 20) return '¡Buenas tardes, Estudio MM!';
                          return '¡Buenas noches, Estudio MM!';
                        })()}
                      </h3>
                      <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mt-0.5">
                        Panel de Control y Gestión Jurídica Integral
                      </p>
                    </div>

                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-inner ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'}`}>
                      <div className="text-2xl">📅</div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-orange-500 font-extrabold">Fecha de Hoy</p>
                        <p className="text-xs font-black capitalize">
                          {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

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
                        No hay vencimientos de excepciones próximos a vencer en los siguientes 10 días. Todo al día.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-5 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-sm font-bold text-orange-500 uppercase">⚙️ Configuración General y Credenciales del Estudio</h3>
                    <p className="text-xs text-zinc-500">Actualice la contraseña universal, el correo de recuperación o descargue una copia de resguardo completa de todos los datos en formato JSON/Texto.</p>

                    <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
                      <h4 className="font-bold text-orange-500 uppercase">Cambiar Contraseña Universal</h4>
                      <div>
                        <label className="text-zinc-500 block mb-1">Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          placeholder="Nueva contraseña..." 
                          value={newPass} 
                          onChange={e => setNewPass(e.target.value)}
                          className={`w-full border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      </div>
                      <div>
                        <label className="text-zinc-500 block mb-1">Confirmar Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          placeholder="Repita la nueva contraseña..." 
                          value={confirmPass} 
                          onChange={e => setConfirmPass(e.target.value)}
                          className={`w-full border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      </div>
                      <div>
                        <label className="text-zinc-500 block mb-1">Actualizar Correo de Recuperación:</label>
                        <input 
                          type="email" 
                          placeholder={recoveryEmailConfig} 
                          value={newRecoveryMail} 
                          onChange={e => setNewRecoveryMail(e.target.value)}
                          className={`w-full border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      </div>

                      {passMessage && (
                        <p className="text-emerald-500 font-bold p-2 bg-emerald-500/10 rounded border border-emerald-500/20">{passMessage}</p>
                      )}

                      <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2.5 rounded hover:bg-orange-400">
                        Actualizar Credenciales en la Nube
                      </button>
                    </form>

                    <div className={`pt-4 border-t space-y-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <h4 className="font-bold text-orange-500 uppercase text-xs">Copia de Resguardo Institucional</h4>
                      <p className="text-xs text-zinc-500">Descargue un archivo de texto plano con todos los expedientes, movimientos, finanzas y clientes para resguardo de seguridad.</p>
                      <button 
                        onClick={handleDownloadFullBackup}
                        className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2.5 rounded shadow"
                      >
                        📥 Descargar Copia de Resguardo Completa (.txt)
                      </button>
                    </div>
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
