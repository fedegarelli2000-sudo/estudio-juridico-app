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

  // FUNCIÓN AUXILIAR MEJORADA PARA PASAR MONTO NUMÉRICO A LETRAS (EN ESPAÑOL)
  const numeroALetras = (num) => {
    const n = parseFloat(num.toString().replace(/[^0-9,.-]+/g, "").replace(",", ".")) || 0;
    if (n === 0) return "CERO PESOS";

    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const dieces = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    function convertirGrupo(n) {
      let r = '';
      if (n === 100) return 'CIEN';
      if (n > 100) r += centenas[Math.floor(n / 100)] + ' ';
      let dec = Math.floor((n % 100) / 10);
      let uni = n % 10;
      if (dec === 1) {
        r += dieces[uni];
      } else if (dec === 2 && uni > 0) {
        r += 'VEINTI' + unidades[uni];
      } else {
        if (dec > 0) r += decenas[dec];
        if (dec > 0 && uni > 0) r += ' Y ';
        if (uni > 0) r += unidades[uni];
      }
      return r.trim();
    }

    const millones = Math.floor(n / 1000000);
    const miles = Math.floor((n % 1000000) / 1000);
    const enteros = Math.floor(n % 1000);

    let resultado = '';
    if (millones > 0) {
      resultado += millones === 1 ? 'UN MILLON ' : convertirGrupo(millones) + ' MILLONES ';
    }
    if (miles > 0) {
      resultado += miles === 1 ? 'MIL ' : convertirGrupo(miles) + ' MIL ';
    }
    if (enteros > 0 || (millones === 0 && miles === 0)) {
      resultado += convertirGrupo(enteros);
    }

    return `PESOS ${resultado.trim()}.-`;
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

  // ESTADO PARA EDITAR FONDO FIJO POR EXPEDIENTE
  const [editingFondoCaseId, setEditingFondoCaseId] = useState(null);
  const [editFondoInput, setEditFondoInput] = useState('');

  // ESTADO PARA EL NUEVO MÓDULO DE RECIBOS EN LA BARRA LATERAL (CON PAGADOR PERSONALIZADO Y OPCIÓN DE PROCURACIÓN)
  const [reciboForm, setReciboForm] = useState({
    tipoRecibo: 'Anticipo para gastos / Fondo fijo',
    customTipo: '',
    asociacionTipo: 'expediente', // 'expediente' o 'fiscal'
    causaId: '',
    fiscalId: '',
    pagadorNombre: '',
    monto: '',
    conceptoDetallado: ''
  });

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
      fondoFijo: 0,
      honorariosAcordados: 0,
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
      [`${year}-11-20`]: 'Día del Soberanía Nacional',
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
  const [newCase, setNewCase] = useState({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '', fondoFijo: 0, honorariosAcordados: 0 });
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
const [prescripcionesCumplidas, setPrescripcionesCumplidas] = React.useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('lex_prescripciones_cumplidas');
    return saved ? JSON.parse(saved) : [];
  });
 
const urgentPrescriptionAlerts = fiscalCases.filter(fc => {
    if (prescripcionesCumplidas.includes(fc.id)) return false;
    
    const fechaCruda = fc.vtoLiquidacion || fc.fechaVencimientoLiquidacion || fc.vencimientoLiquidacion || fc.vtoLiq;
    if (!fechaCruda) return false;
    
    let partes = [];
    if (fechaCruda.includes('/')) {
      partes = fechaCruda.split('/');
    } else if (fechaCruda.includes('-')) {
      partes = fechaCruda.split('-');
    }
    
    if (partes.length !== 3) return false;

    let dia, mes, anio;
    if (partes[0].length === 4) {
      anio = parseInt(partes[0], 10);
      mes = parseInt(partes[1], 10) - 1;
      dia = parseInt(partes[2], 10);
    } else {
      dia = parseInt(partes[0], 10);
      mes = parseInt(partes[1], 10) - 1;
      anio = parseInt(partes[2], 10);
    }

    const fechaVenc = new Date(anio, mes, dia);
    if (isNaN(fechaVenc)) return false;

    const fechaPrescripcion = new Date(fechaVenc);
    fechaPrescripcion.setFullYear(fechaPrescripcion.getFullYear() + 5);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const diffTime = fechaPrescripcion - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 60 || diffDays < 0;
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
              { id: 'recibos', label: 'Recibos', icon: '🧾' },
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

              {/* SECCIÓN: Generador Automático de Escritos con Inteligencia (Plantillas Dinámicas con más opciones) */}
              <div className={`border p-5 rounded-xl space-y-4 border-orange-500/40 ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <div>
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Generador Automático de Escritos con IA (Plantillas Dinámicas)</h4>
                    <p className="text-[11px] text-zinc-400">Rellena automáticamente este modelo con los datos del expediente actual y descárgalo listo en Word (.docx).</p>
                  </div>
                </div>

                <form onSubmit={handleAddTemplate} className={`p-3 rounded-lg border flex flex-col md:flex-row gap-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <input 
                    type="text" 
                    placeholder="Título de la nueva plantilla..."
                    value={newTemplateTitle}
                    onChange={e => setNewTemplateTitle(e.target.value)}
                    className={`flex-1 border p-2 rounded text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                    required
                  />
                  <select 
                    value={newTemplateCategory}
                    onChange={e => setNewTemplateCategory(e.target.value)}
                    className={`border p-2 rounded text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                  >
                    <option value="Fiscal">Fiscal</option>
                    <option value="Procesal">Procesal Civil</option>
                    <option value="Civil">Civil</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Laboral">Laboral</option>
                    <option value="Familia">Familia</option>
                    <option value="Penal">Penal</option>
                    <option value="Concursos y Quiebras">Concursos y Quiebras</option>
                    <option value="Mediación">Mediación</option>
                    <option value="Contencioso Administrativo">Contencioso Administrativo</option>
                  </select>
                  <input 
                    type="file" 
                    accept=".docx,.doc,.txt"
                    onChange={e => setNewTemplateFile(e.target.files[0])}
                    className={`border p-1.5 rounded text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-400' : 'bg-white border-zinc-300 text-zinc-600'}`}
                  />
                  <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-3 py-2 rounded text-xs">
                    + Agregar Plantilla
                  </button>
                </form>

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

              {/* SECCIÓN: Apartado de Honorarios por Expediente */}
              <div className={`border p-5 rounded-xl space-y-4 border-emerald-500/40 ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚖️</span>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-500 uppercase">Apartado de Honorarios Profesionales y Regulación</h4>
                      <p className="text-[11px] text-zinc-400">Controlá los honorarios pactados, percibidos y pendientes de cobro para esta causa.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const nuevoHonorarioAcordado = prompt("Ingrese el monto total de honorarios acordados / regulados para esta causa ($):", selectedCaseData.honorariosAcordados || 0);
                      if (nuevoHonorarioAcordado !== null) {
                        const val = parseFloat(nuevoHonorarioAcordado.replace(/[^0-9,.-]+/g, "").replace(",", ".")) || 0;
                        const updatedCases = cases.map(c => c.id === selectedCaseData.id ? { ...c, honorariosAcordados: val } : c);
                        updateCases(updatedCases);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded shadow transition-all"
                  >
                    ✏️ Modificar Honorarios Acordados
                  </button>
                </div>

                {(() => {
                  const caseHonorariosCobrados = honorariosProcuracion.filter(h => (h.nroLiquidacion?.toLowerCase().includes(selectedCaseData.number.toLowerCase()) || h.referencia?.toLowerCase().includes(selectedCaseData.number.toLowerCase())) && h.tipoIngreso === 'HONORARIOS');
                  const totalCobrado = caseHonorariosCobrados.reduce((acc, curr) => acc + (parseFloat(curr.monto.replace(/[^0-9,.-]+/g, "").replace(",", ".")) || 0), 0);
                  const honorariosAcordadosTotal = selectedCaseData.honorariosAcordados || 0;
                  const saldoHonorariosPendiente = honorariosAcordadosTotal - totalCobrado;

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Honorarios Acordados / Regulados</span>
                          <h5 className="text-lg font-black text-emerald-400 mt-0.5">${honorariosAcordadosTotal.toLocaleString('es-AR')}</h5>
                        </div>

                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Honorarios Cobrados (Registrados)</span>
                          <h5 className="text-lg font-black text-emerald-500 mt-0.5">${totalCobrado.toLocaleString('es-AR')}</h5>
                        </div>

                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Saldo Honorarios Pendiente</span>
                          <h5 className={`text-lg font-black mt-0.5 ${saldoHonorariosPendiente > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            ${saldoHonorariosPendiente.toLocaleString('es-AR')} {saldoHonorariosPendiente > 0 ? '(A Cobrar)' : '(Cobrado Total)'}
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
                          tipoIngreso: 'HONORARIOS',
                          fiscalId: 'exp_hon_' + Date.now(),
                          nroLiquidacion: selectedCaseData.number,
                          id: 'h_' + Date.now()
                        };
                        const updated = [...honorariosProcuracion, created];
                        setHonorariosProcuracion(updated);
                        updateHonorarios(updated);
                        e.target.reset();
                      }} className="flex gap-2 text-xs">
                        <input name="concepto" placeholder="Concepto del cobro de honorarios (ej. Anticipo honorarios etapa preliminar)" className={`flex-1 border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`} required />
                        <div className="relative flex items-center w-48">
                          <input 
                            name="monto" 
                            placeholder="Monto ($)" 
                            onChange={(e) => {
                              const val = e.target.value;
                              const hintEl = document.getElementById('hint_honorario_letras');
                              if (hintEl) hintEl.innerText = val ? numeroALetras(val) : '';
                            }}
                            className={`w-full border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`} 
                            required 
                          />
                        </div>
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded shadow">Registrar Cobro Honorario</button>
                      </form>
                      <div id="hint_honorario_letras" className="text-[10px] text-orange-500 font-bold italic"></div>

                      <div className="space-y-2 pt-1">
                        {caseHonorariosCobrados.map(h => (
                          <div key={h.id} className={`p-3 rounded-lg border flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            <div>
                              <span className="bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded text-[9px] mr-2">HONORARIOS</span>
                              <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>{h.concepto}</strong>
                              <p className="text-[10px] text-zinc-400">Fecha: {formatDateToArg(h.fecha)} • En letras: {numeroALetras(h.monto)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-emerald-400">${h.monto}</span>
                              
                              <button 
                                onClick={() => {
                                  const receiptHtml = `
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                      <meta charset="utf-8">
                                      <title>Recibo de Honorarios - Estudio Jurídico MM</title>
                                      <style>
                                        body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 20px; font-size: 12px; }
                                        .recibo-container { border: 2px dashed #333; padding: 25px; margin-bottom: 30px; position: relative; background: #fff; }
                                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f97316; padding-bottom: 15px; margin-bottom: 15px; }
                                        .logo-container { display: flex; align-items: center; gap: 8px; }
                                        .logo-box { width: 45px; height: 45px; background: #09090b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; }
                                        .logo-m1 { color: #f97316; }
                                        .logo-m2 { color: #71717a; }
                                        .estudio-info h2 { margin: 0; font-size: 16px; font-weight: 900; color: #09090b; text-transform: uppercase; }
                                        .estudio-info p { margin: 2px 0 0 0; font-size: 10px; color: #f97316; font-weight: bold; }
                                        .copia-tag { font-size: 14px; font-weight: 900; border: 2px solid #09090b; padding: 5px 15px; text-transform: uppercase; }
                                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 12px; }
                                        .amount-box { background: #f4f4f5; border: 1px solid #d4d4d8; padding: 12px; font-size: 15px; font-weight: bold; margin-bottom: 15px; }
                                        .concepto-box { margin-bottom: 20px; font-size: 13px; line-height: 1.5; }
                                        .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
                                        .sig-line { width: 220px; border-top: 1px solid #000; text-align: center; padding-top: 5px; font-size: 11px; font-weight: bold; }
                                      </style>
                                    </head>
                                    <body>
                                      <!-- ORIGINAL -->
                                      <div class="recibo-container">
                                        <div class="header">
                                          <div class="logo-container">
                                            <div class="logo-box">
                                              <span class="logo-m1">M</span><span class="logo-m2">M</span>
                                            </div>
                                            <div class="estudio-info">
                                              <h2>Estudio Jurídico MM</h2>
                                              <p>Gestión Legal Integral • Río Cuarto</p>
                                            </div>
                                          </div>
                                          <div class="copia-tag">ORIGINAL</div>
                                        </div>

                                        <div class="details-grid">
                                          <div><strong>Fecha:</strong> ${formatDateToArg(h.fecha)}</div>
                                          <div><strong>Expediente Nº:</strong> ${selectedCaseData.number}</div>
                                          <div><strong>Carátula:</strong> ${selectedCaseData.caratula}</div>
                                          <div><strong>Cliente / Pagador:</strong> ${selectedCaseData.client}</div>
                                        </div>

                                        <div class="amount-box">
                                          Son: ${numeroALetras(h.monto)} — Monto: $ ${h.monto}
                                        </div>

                                        <div class="concepto-box">
                                          <strong>En concepto de:</strong> ${h.concepto} para el expediente Nº ${selectedCaseData.number} (${selectedCaseData.caratula}).
                                        </div>

                                        <div class="signatures">
                                          <div class="sig-line">Firma del Cliente / Pagador</div>
                                          <div class="sig-line">Firma y Sello - Estudio Jurídico MM</div>
                                        </div>
                                      </div>

                                      <!-- DUPLICADO -->
                                      <div class="recibo-container">
                                        <div class="header">
                                          <div class="logo-container">
                                            <div class="logo-box">
                                              <span class="logo-m1">M</span><span class="logo-m2">M</span>
                                            </div>
                                            <div class="estudio-info">
                                              <h2>Estudio Jurídico MM</h2>
                                              <p>Gestión Legal Integral • Río Cuarto</p>
                                            </div>
                                          </div>
                                          <div class="copia-tag">DUPLICADO</div>
                                        </div>

                                        <div class="details-grid">
                                          <div><strong>Fecha:</strong> ${formatDateToArg(h.fecha)}</div>
                                          <div><strong>Expediente Nº:</strong> ${selectedCaseData.number}</div>
                                          <div><strong>Carátula:</strong> ${selectedCaseData.caratula}</div>
                                          <div><strong>Cliente / Pagador:</strong> ${selectedCaseData.client}</div>
                                        </div>

                                        <div class="amount-box">
                                          Son: ${numeroALetras(h.monto)} — Monto: $ ${h.monto}
                                        </div>

                                        <div class="concepto-box">
                                          <strong>En concepto de:</strong> ${h.concepto} para el expediente Nº ${selectedCaseData.number} (${selectedCaseData.caratula}).
                                        </div>

                                        <div class="signatures">
                                          <div class="sig-line">Firma del Cliente / Pagador</div>
                                          <div class="sig-line">Firma y Sello - Estudio Jurídico MM</div>
                                        </div>
                                      </div>

                                      <script>
                                        window.onload = function() { window.print(); }
                                      </script>
                                    </body>
                                    </html>
                                  `;
                                  const win = window.open('', '_blank');
                                  win.document.write(receiptHtml);
                                  win.document.close();
                                }}
                                className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded font-bold text-xs transition-all"
                                title="Generar Recibo PDF (Original y Duplicado)"
                              >
                                🧾 Recibo
                              </button>

                              <button onClick={() => deleteHonorario(h.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded font-bold" title="Eliminar Registro">🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SECCIÓN: Registro de Gastos Judiciales por Expediente y Control de Anticipos (Fondo Fijo) */}
              <div className={`border p-5 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <div>
                      <h4 className="text-xs font-bold text-orange-500 uppercase">Registro de Gastos Judiciales por Expediente y Control de Anticipos (Fondo Fijo)</h4>
                      <p className="text-[11px] text-zinc-400">Controlá qué fondo fijo entregó el cliente, modificalo cuando sea necesario y generá el recibo en PDF por duplicado.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      const motivoAnticipo = prompt("Ingrese el concepto o motivo del recibo (ej. anticipo para fondo fijo de tasas y viáticos):", "anticipo para fondo fijo de tasas y viáticos") || "anticipo para gastos";
                      const montoRecibo = prompt("Ingrese el monto recibido ($):", "150000") || "150000";

                      const receiptHtml = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="utf-8">
                          <title>Recibo de Pago - Estudio Jurídico MM</title>
                          <style>
                            body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 20px; font-size: 12px; }
                            .recibo-container { border: 2px dashed #333; padding: 25px; margin-bottom: 30px; position: relative; background: #fff; }
                            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f97316; padding-bottom: 15px; margin-bottom: 15px; }
                            .logo-container { display: flex; align-items: center; gap: 8px; }
                            .logo-box { width: 45px; height: 45px; background: #09090b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; }
                            .logo-m1 { color: #f97316; }
                            .logo-m2 { color: #71717a; }
                            .estudio-info h2 { margin: 0; font-size: 16px; font-weight: 900; color: #09090b; text-transform: uppercase; }
                            .estudio-info p { margin: 2px 0 0 0; font-size: 10px; color: #f97316; font-weight: bold; }
                            .copia-tag { font-size: 14px; font-weight: 900; border: 2px solid #09090b; padding: 5px 15px; text-transform: uppercase; }
                            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 12px; }
                            .amount-box { background: #f4f4f5; border: 1px solid #d4d4d8; padding: 12px; font-size: 15px; font-weight: bold; margin-bottom: 15px; }
                            .concepto-box { margin-bottom: 20px; font-size: 13px; line-height: 1.5; }
                            .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
                            .sig-line { width: 220px; border-top: 1px solid #000; text-align: center; padding-top: 5px; font-size: 11px; font-weight: bold; }
                          </style>
                        </head>
                        <body>
                          <!-- ORIGINAL -->
                          <div class="recibo-container">
                            <div class="header">
                              <div class="logo-container">
                                <div class="logo-box">
                                  <span class="logo-m1">M</span><span class="logo-m2">M</span>
                                </div>
                                <div class="estudio-info">
                                  <h2>Estudio Jurídico MM</h2>
                                  <p>Gestión Legal Integral • Río Cuarto</p>
                                </div>
                              </div>
                              <div class="copia-tag">ORIGINAL</div>
                            </div>

                            <div class="details-grid">
                              <div><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</div>
                              <div><strong>Expediente Nº:</strong> ${selectedCaseData.number}</div>
                              <div><strong>Carátula:</strong> ${selectedCaseData.caratula}</div>
                              <div><strong>Cliente / Pagador:</strong> ${selectedCaseData.client}</div>
                            </div>

                            <div class="amount-box">
                              Son: ${numeroALetras(montoRecibo)} — Monto: $ ${montoRecibo}
                            </div>

                            <div class="concepto-box">
                              <strong>En concepto de:</strong> ${motivoAnticipo} para el expediente Nº ${selectedCaseData.number} (${selectedCaseData.caratula}).
                            </div>

                            <div class="signatures">
                              <div class="sig-line">Firma del Cliente / Entregante</div>
                              <div class="sig-line">Firma y Sello - Estudio Jurídico MM</div>
                            </div>
                          </div>

                          <!-- DUPLICADO -->
                          <div class="recibo-container">
                            <div class="header">
                              <div class="logo-container">
                                <div class="logo-box">
                                  <span class="logo-m1">M</span><span class="logo-m2">M</span>
                                </div>
                                <div class="estudio-info">
                                  <h2>Estudio Jurídico MM</h2>
                                  <p>Gestión Legal Integral • Río Cuarto</p>
                                </div>
                              </div>
                              <div class="copia-tag">DUPLICADO</div>
                            </div>

                            <div class="details-grid">
                              <div><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</div>
                              <div><strong>Expediente Nº:</strong> ${selectedCaseData.number}</div>
                              <div><strong>Carátula:</strong> ${selectedCaseData.caratula}</div>
                              <div><strong>Cliente / Pagador:</strong> ${selectedCaseData.client}</div>
                            </div>

                            <div class="amount-box">
                              Son: ${numeroALetras(montoRecibo)} — Monto: $ ${montoRecibo}
                            </div>

                            <div class="concepto-box">
                              <strong>En concepto de:</strong> ${motivoAnticipo} para el expediente Nº ${selectedCaseData.number} (${selectedCaseData.caratula}).
                            </div>

                            <div class="signatures">
                              <div class="sig-line">Firma del Cliente / Entregante</div>
                              <div class="sig-line">Firma y Sello - Estudio Jurídico MM</div>
                            </div>
                          </div>

                          <script>
                            window.onload = function() { window.print(); }
                          </script>
                        </body>
                        </html>
                      `;

                      const win = window.open('', '_blank');
                      win.document.write(receiptHtml);
                      win.document.close();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded shadow transition-all flex items-center gap-1.5"
                  >
                    <span>📄 Descargar Recibo PDF (Duplicado)</span>
                  </button>
                </div>

                {(() => {
                  const caseHonorarios = honorariosProcuracion.filter(h => h.nroLiquidacion?.toLowerCase().includes(selectedCaseData.number.toLowerCase()) || h.referencia?.toLowerCase().includes(selectedCaseData.number.toLowerCase()));
                  const totalGastosExp = caseHonorarios
                    .filter(h => h.tipoIngreso !== 'HONORARIOS')
                    .reduce((acc, curr) => acc + (parseFloat(curr.monto.replace(/[^0-9,.-]+/g, "").replace(",", ".")) || 0), 0);
                  
                  const fondoFijoCliente = selectedCaseData.fondoFijo !== undefined ? selectedCaseData.fondoFijo : 0;
                  const saldoRestante = fondoFijoCliente - totalGastosExp;

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Fondo Fijo / Anticipo Entregado</span>
                            <button 
                              onClick={() => {
                                setEditingFondoCaseId(selectedCaseData.id);
                                setEditFondoInput(fondoFijoCliente.toString());
                              }}
                              className="text-[10px] text-orange-500 font-bold hover:underline"
                            >
                              ✏️ Modificar
                            </button>
                          </div>

                          {editingFondoCaseId === selectedCaseData.id ? (
                            <div className="flex gap-2 mt-1">
                              <input 
                                type="text"
                                value={editFondoInput}
                                onChange={e => setEditFondoInput(e.target.value)}
                                className={`w-full border border-orange-500 p-1.5 rounded text-xs ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
                              />
                              <button 
                                onClick={() => {
                                  const newVal = parseFloat(editFondoInput.replace(/[^0-9,.-]+/g, "").replace(",", ".")) || 0;
                                  const updatedCases = cases.map(c => c.id === selectedCaseData.id ? { ...c, fondoFijo: newVal } : c);
                                  updateCases(updatedCases);
                                  setEditingFondoCaseId(null);
                                }}
                                className="bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-bold"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <h5 className="text-lg font-black text-emerald-500 mt-0.5">${fondoFijoCliente.toLocaleString('es-AR')}</h5>
                          )}
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

                  <div className="border p-5 rounded-xl space-y-3 backdrop-blur-sm ${darkModeClasses}">
  <h4 className="text-xs font-bold text-orange-500 uppercase">🚨 Alertas Urgentes de Procuración Fiscal (Prescripciones a 5 Años)</h4>
  
  {urgentPrescriptionAlerts.length > 0 ? (
  <div className="space-y-2">
    {urgentPrescriptionAlerts.map(fc => {
      const fechaCruda = fc.vtoLiquidacion || fc.fechaVencimientoLiquidacion || fc.vencimientoLiquidacion || fc.vtoLiq;
      let diffDays = 0;
      if (fechaCruda) {
        let partes = fechaCruda.includes('/') ? fechaCruda.split('/') : fechaCruda.split('-');
        if (partes.length === 3) {
          let dia, mes, anio;
          if (partes[0].length === 4) {
            anio = parseInt(partes[0], 10);
            mes = parseInt(partes[1], 10) - 1;
            dia = parseInt(partes[2], 10);
          } else {
            dia = parseInt(partes[0], 10);
            mes = parseInt(partes[1], 10) - 1;
            anio = parseInt(partes[2], 10);
          }
          const fechaVenc = new Date(anio, mes, dia);
          if (!isNaN(fechaVenc)) {
            const fechaPrescripcion = new Date(fechaVenc);
            fechaPrescripcion.setFullYear(fechaPrescripcion.getFullYear() + 5);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            diffDays = Math.ceil((fechaPrescripcion - hoy) / (1000 * 60 * 60 * 24));
          }
        }
      }

      return (
        <div 
          key={fc.id}
          className="p-3 border border-amber-500/40 rounded flex justify-between items-center text-xs bg-amber-500/10"
        >
          <div>
            {diffDays < 0 ? (
              <span className="bg-red-900 text-red-200 font-bold px-2 py-0.5 rounded text-[10px] mr-2">
                ⚠️ ¡PRESCRIPTO!
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-500 font-bold px-2 py-0.5 rounded text-[10px] mr-2">
                ⚠️ PRESCRIPCIÓN PRÓXIMA
              </span>
            )}
            <span className="font-bold text-sm">Liq: {fc.nroLiquidacion} - {fc.contribuyente}</span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Vto. Liquidación: <strong className="text-amber-500">{fechaCruda}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFiscalId(fc.id)}
              className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded hover:bg-orange-400 transition-colors"
            >
              Revisar Causa →
            </button>
            <button
              onClick={() => {
                const cumplidasActuales = [...prescripcionesCumplidas, fc.id];
                setPrescripcionesCumplidas(cumplidasActuales);
                localStorage.setItem('lex_prescripciones_cumplidas', JSON.stringify(cumplidasActuales));
              }}
              className="font-bold text-xs px-3 py-1.5 rounded border transition-colors border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20"
              title="Descartar o marcar alerta como cumplida"
            >
              ✓ Cumplida
            </button>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="text-zinc-400 text-xs italic py-2">
    No hay causas fiscales próximas a prescribir en los siguientes 60 días. Todo al día.
  </div>
)}
{/* --- TARJETA VISUAL DE PRESCRIPCIÓN EN EL DASHBOARD --- */}
{urgentPrescriptionAlerts.map(fc => {
  if (!fc.vencimientoLiquidacion) return null;
  const partes = fc.vencimientoLiquidacion.split('T')[0].split('-');
  let fechaVenc;
  if (partes.length === 3) {
    fechaVenc = new Date(partes[0], partes[1] - 1, partes[2]);
  } else {
    fechaVenc = new Date(fc.vencimientoLiquidacion);
  }
  if (isNaN(fechaVenc)) return null;

  const fechaPresc = new Date(fechaVenc);
  fechaPresc.setFullYear(fechaPresc.getFullYear() + 5);
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((fechaPresc - hoy) / (1000 * 60 * 60 * 24));
  
  return (
    <div key={fc.id} className="p-4 rounded-xl border border-orange-500/50 bg-orange-500/10 mb-3 flex items-center justify-between">
      <div>
        <span className="bg-orange-500 text-black font-bold text-[10px] px-2 py-0.5 rounded uppercase mr-2">
          {diffDays < 0 ? '¡PRESCRIPTO!' : `Prescribe en ${diffDays} días`}
        </span>
        <span className="font-bold text-sm">Liq: {fc.nroLiquidacion} - {fc.contribuyente}</span>
        <p className="text-xs text-zinc-400 mt-1">Fecha límite de prescripción (5 años): {fechaPresc.toLocaleDateString()}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => seleccionarCausa(fc.id)}
          className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-3 py-1.5 rounded transition-all"
        >
          Revisar Causa →
        </button>
        <button 
          onClick={() => {
            const actualizadas = [...prescripcionesCumplidas, fc.id];
            setPrescripcionesCumplidas(actualizadas);
            localStorage.setItem('lex_prescripciones_cumplidas', JSON.stringify(actualizadas));
          }}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs px-3 py-1.5 rounded transition-all border border-zinc-700"
        >
          ✓ Marcar como Listo
        </button>
      </div>
    </div>
  );
})}             

{/* --- TARJETA DE PRESCRIPCIÓN EN EL DASHBOARD --- */}
{urgentPrescriptionAlerts.map(fc => {
  if (!fc.vencimientoLiquidacion) return null;
  const partes = fc.vencimientoLiquidacion.split('T')[0].split('-');
  let fechaVenc;
  if (partes.length === 3) {
    fechaVenc = new Date(partes[0], partes[1] - 1, partes[2]);
  } else {
    fechaVenc = new Date(fc.vencimientoLiquidacion);
  }
  if (isNaN(fechaVenc)) return null;

  const fechaPresc = new Date(fechaVenc);
  fechaPresc.setFullYear(fechaPresc.getFullYear() + 5);
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((fechaPresc - hoy) / (1000 * 60 * 60 * 24));
  
  return (
    <div key={fc.id} className="p-4 rounded-xl border border-orange-500/50 bg-orange-500/10 mb-3 mt-3 flex items-center justify-between">
      <div>
        <span className="bg-orange-500 text-black font-bold text-[10px] px-2 py-0.5 rounded uppercase mr-2">
          {diffDays < 0 ? '¡PRESCRIPTO!' : `Prescribe en ${diffDays} días`}
        </span>
        <span className="font-bold text-sm">Liq: {fc.nroLiquidacion} - {fc.contribuyente}</span>
        <p className="text-xs text-zinc-400 mt-1">Fecha límite de prescripción (5 años): {fechaPresc.toLocaleDateString()}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => seleccionarCausa(fc.id)}
          className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-3 py-1.5 rounded transition-all"
        >
          Revisar Causa →
        </button>
        <button 
          onClick={() => {
            const actualizadas = [...prescripcionesCumplidas, fc.id];
            setPrescripcionesCumplidas(actualizadas);
            localStorage.setItem('lex_prescripciones_cumplidas', JSON.stringify(actualizadas));
          }}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs px-3 py-1.5 rounded transition-all border border-zinc-700"
        >
          ✓ Marcar como Listo
        </button>
      </div>
    </div>
  );
})}
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

              {activeTab === 'expedientes' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCase.number || !newCase.caratula) return;
                    const clientSelected = newCase.client || (clients[0] ? clients[0].name : 'Sin Cliente');
                    const created = { ...newCase, client: clientSelected, id: Date.now().toString(), status: 'EN TRAMITE', fondoFijo: 0, honorariosAcordados: 0 };
                    updateCases([...cases, created]);
                    setNewCase({ number: '', caratula: '', court: '', client: '', processType: 'JUDICIAL', notes: '', fondoFijo: 0, honorariosAcordados: 0 });
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
                    <p className="text-xs text-zinc-500 font-medium">Hacé clic en cualquiera de tus expedientes para ingresar:</p>
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
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-500">{formatDateToArg(m.date)}</span>
                                  <button 
                                    onClick={() => handleDeleteMovement(m.id)} 
                                    className="text-red-500 hover:text-red-600 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20 text-xs" 
                                    title="Eliminar Movimiento"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                              {caseInfo && <p className="text-[10px] text-zinc-500">Expediente: {caseInfo.number} - {caseInfo.caratula}</p>}
                              {m.text && <p className={`mt-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{m.text}</p>}
                            </div>
                          );
                        })}
                      {movements.filter(m => !selectedCaseId || m.caseId === selectedCaseId).length === 0 && (
                        <p className="text-xs text-zinc-500">No hay actuaciones registradas.</p>
                      )}
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

              {activeTab === 'audiencias' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-5 rounded-xl space-y-4 shadow-xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className={`flex flex-col md:flex-row justify-between items-center border-b pb-3 gap-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <div>
                        <h3 className="text-sm font-bold text-orange-500 uppercase">📅 Calendario Institucional Interactivo (Feriados Argentina & Múltiples Años)</h3>
                        <p className="text-xs text-zinc-500">Navegue por cualquier año y mes. Los feriados oficiales nacionales se marcan en rojo y las audiencias en naranja.</p>
                      </div>

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

                      <div className="flex flex-col gap-1">
                        <select 
                          value={newHearing.tipoAudiencia === 'Audiencia mediación' || newHearing.tipoAudiencia === 'Audiencia art 659 cpcc' || newHearing.tipoAudiencia === 'Preliminar' || newHearing.tipoAudiencia === 'Vista de Causa' || newHearing.tipoAudiencia === 'Conciliación' || newHearing.tipoAudiencia === 'Penal' || newHearing.tipoAudiencia === 'Fiscal' || newHearing.tipoAudiencia === 'Otra' ? newHearing.tipoAudiencia : 'OTRO'} 
                          onChange={e => {
                            const val = e.target.value;
                            if (val === 'OTRO') {
                              setNewHearing({...newHearing, tipoAudiencia: ''});
                            } else {
                              setNewHearing({...newHearing, tipoAudiencia: val});
                            }
                          }}
                          className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        >
                          <option value="Preliminar">Tipo: Preliminar</option>
                          <option value="Audiencia mediación">Tipo: Audiencia Mediación</option>
                          <option value="Audiencia art 659 cpcc">Tipo: Audiencia Art. 659 CPCC</option>
                          <option value="Vista de Causa">Tipo: Vista de Causa</option>
                          <option value="Conciliación">Tipo: Conciliación / Mediación</option>
                          <option value="Penal">Tipo: Audiencia Penal</option>
                          <option value="Fiscal">Tipo: Audiencia Fiscal</option>
                          <option value="OTRO">Tipo: Otro (Escribir personalizado)</option>
                        </select>

                        {!(['Preliminar', 'Audiencia mediación', 'Audiencia art 659 cpcc', 'Vista de Causa', 'Conciliación', 'Penal', 'Fiscal', 'Otra'].includes(newHearing.tipoAudiencia)) && (
                          <input 
                            type="text"
                            placeholder="Especifique el tipo de audiencia..."
                            value={newHearing.tipoAudiencia}
                            onChange={e => setNewHearing({...newHearing, tipoAudiencia: e.target.value})}
                            className={`border border-orange-500 p-2 rounded outline-none text-xs ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}
                          />
                        )}
                      </div>

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
                          <p className="text-zinc-500 text-[11px] italic col-span-2">No hay correos configurados.</p>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-5 py-2.5 rounded hover:bg-orange-400">
                      Agendar y Sincronizar en Google Calendar
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'procuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-2 border-b pb-3">
                    <button onClick={() => setProcuracionSubTab('titulos')} className={`px-4 py-2 rounded font-bold text-xs ${procuracionSubTab === 'titulos' ? 'bg-orange-500 text-black' : isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-white text-zinc-700'}`}>Títulos Ejecutivos (CBA)</button>
                    <button onClick={() => setProcuracionSubTab('cautelares')} className={`px-4 py-2 rounded font-bold text-xs ${procuracionSubTab === 'cautelares' ? 'bg-orange-500 text-black' : isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-white text-zinc-700'}`}>Medidas Cautelares (SOJ)</button>
                    <button onClick={() => setProcuracionSubTab('honorarios')} className={`px-4 py-2 rounded font-bold text-xs ${procuracionSubTab === 'honorarios' ? 'bg-orange-500 text-black' : isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-white text-zinc-700'}`}>Honorarios & Gastos Fiscales</button>
                  </div>

                  {procuracionSubTab === 'titulos' && (
                    <div className="space-y-6">
                      <form onSubmit={handleAddFiscalCase} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Cargar Nuevo Título Ejecutivo Fiscal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <select 
                            value={newFiscalCase.tributo} onChange={e => setNewFiscalCase({...newFiscalCase, tributo: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="Inmobiliario">Tributo: Inmobiliario</option>
                            <option value="Comercio e Industria">Tributo: Comercio e Industria</option>
                            <option value="Automotor">Tributo: Automotor</option>
                            <option value="Tasas Retributivas">Tributo: Tasas Retributivas</option>
                          </select>
                          <input 
                            type="text" placeholder="Contribuyente (Ej. ZAMARBIDE)" 
                            value={newFiscalCase.contribuyente} onChange={e => setNewFiscalCase({...newFiscalCase, contribuyente: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Nº de Liquidación" 
                            value={newFiscalCase.nroLiquidacion} onChange={e => setNewFiscalCase({...newFiscalCase, nroLiquidacion: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Monto (Ej. $99.800.000)" 
                            value={newFiscalCase.monto} onChange={e => setNewFiscalCase({...newFiscalCase, monto: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <div>
                            <label className="text-[10px] text-orange-500 font-bold block mb-1">Fecha Vto. Liq. (Inicia Prescripción 5 años):</label>
                            <input 
                              type="date" 
                              value={newFiscalCase.fechaVencimientoLiquidacion} 
                              onChange={e => setNewFiscalCase({...newFiscalCase, fechaVencimientoLiquidacion: e.target.value})}
                              className={`w-full border border-orange-500 p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}
                            />
                          </div>
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Registrar Título Fiscal
                        </button>
                      </form>

{/* --- GESTOR DE PLANTILLAS Y CARGA DE DOCUMENTOS --- */}
<div className={`p-5 rounded-2xl border my-4 shadow-md ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
  <h4 className="text-sm font-black uppercase text-orange-500 mb-3">
    📁 Gestión y Rellenado Automático de Plantillas por Causa
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
    
    {/* Columna 1: Subir y Guardar Plantilla */}
    <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
      <h5 className="font-bold text-orange-500 uppercase">1. Subir Plantilla Nueva (Word / Texto)</h5>
      <p className="text-[11px] text-zinc-400">Subí tu modelo base (.docx o .txt) para que quede guardado en el sistema del estudio.</p>
      
      <input 
        type="file" 
        accept=".docx,.doc,.txt"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const contenidoLeido = event.target.result;
            const plantillasGuardadas = JSON.parse(localStorage.getItem('lex_mis_plantillas') || '[]');
            const nuevaPlantilla = { id: Date.now().toString(), nombre: file.name, contenido: contenidoLeido };
            plantillasGuardadas.push(nuevaPlantilla);
            localStorage.setItem('lex_mis_plantillas', JSON.stringify(plantillasGuardadas));
            alert(`¡Plantilla "${file.name}" subida y guardada con éxito en el sistema!`);
          };
          reader.readAsText(file);
        }}
        className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-black hover:file:bg-orange-400 cursor-pointer"
      />
    </div>

    {/* Columna 2: Rellenar con datos del expediente y descargar */}
    <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
      <h5 className="font-bold text-orange-500 uppercase">2. Rellenar y Descargar para una Causa</h5>
      <p className="text-[11px] text-zinc-400">Seleccioná un título fiscal o expediente para volcar sus datos en la plantilla.</p>
      
      <select 
        id="selectCausaParaPlantilla"
        className={`w-full p-2.5 rounded border outline-none ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
      >
        <option value="">Seleccionar Título / Contribuyente...</option>
        {fiscalCases.map(fc => (
          <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - Contribuyente: {fc.contribuyente} (${fc.monto || '0'})</option>
        ))}
      </select>

      <button
        onClick={() => {
          const select = document.getElementById('selectCausaParaPlantilla');
          const causaId = select.value;
          if (!causaId) {
            alert('Por favor, seleccioná un título fiscal o causa primero.');
            return;
          }
          const causa = fiscalCases.find(fc => fc.id === causaId);
          if (!causa) return;

          const textoRellenado = `SEÑOR JUEZ DE EJECUCIÓN FISCAL:\n\nProcuración de Rentas de la Provincia de Córdoba, en autos caratulados contra ${causa.contribuyente}, Liquidación Nº ${causa.nroLiquidacion}, a V.S. digo:\n\n1. OBJETO: Que vengo a promover ejecución fiscal por la suma de $${causa.monto || '0'} con más sus accesorios legales...\n\nPROVEER DE CONFORMIDAD,\nSERÁ JUSTICIA.`;

          const blob = new Blob(['\ufeff' + `<html><head><meta charset='utf-8'></head><body style='font-family:Arial; font-size:12pt; white-space:pre-wrap;'>${textoRellenado}</body></html>`], {
            type: 'application/msword'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Escrito_${causa.contribuyente || 'Apremio'}.doc`;
          a.click();
        }}
        className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs py-2.5 rounded shadow transition-all"
      >
        📥 Generar y Descargar Escrito Rellenado (Word)
      </button>
    </div>

  </div>
</div>
                              
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Títulos Ejecutivos Fiscales Activos</h4>
                        {fiscalCases.map(fc => (
                          <div key={fc.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                            <div onClick={() => setSelectedFiscalId(fc.id)} className="cursor-pointer flex-1">
                              <span className="bg-purple-500/10 text-purple-500 font-bold px-2 py-0.5 rounded text-[10px] mr-2">Liq: {fc.nroLiquidacion}</span>
                              <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>{fc.contribuyente}</strong>
                              <p className="text-[10px] text-zinc-400 mt-0.5">Tributo: {fc.tributo} • Monto: {fc.monto} • Vto Excepción: {formatDateToArg(fc.plazoExcepcionesFecha)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelectedFiscalId(fc.id)} className="bg-orange-500 text-black font-bold px-3 py-1.5 rounded">
                                Gestionar Ficha →
                              </button>
                              <button onClick={() => deleteFiscalCase(fc.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold transition-all border border-red-500/20">
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'cautelares' && (
                    <div className="space-y-6">
                      <form onSubmit={handleAddCautelar} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Trabar Medida Cautelar (SOJ / Bancario / Inhibición)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <select 
                            value={newCautelar.fiscalId} onChange={e => setNewCautelar({...newCautelar, fiscalId: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="">Seleccionar Título Fiscal...</option>
                            {fiscalCases.map(fc => <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</option>)}
                          </select>
                          <select 
                            value={newCautelar.tipo} onChange={e => setNewCautelar({...newCautelar, tipo: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="SOJ (Bancario)">SOJ (Embargo Bancario)</option>
                            <option value="Inhibición General de Bienes">Inhibición General de Bienes</option>
                            <option value="Embargo Automotor">Embargo Automotor (Registro)</option>
                            <option value="Embargo Inmobiliario">Embargo Inmobiliario</option>
                          </select>
                          <input 
                            type="date" value={newCautelar.fecha} onChange={e => setNewCautelar({...newCautelar, fecha: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Monto Embargado / Afectado ($)" 
                            value={newCautelar.montoEmbargo} onChange={e => setNewCautelar({...newCautelar, montoEmbargo: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Registrar Medida Cautelar
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Medidas Cautelares Vigentes</h4>
                        {cautelares.map(c => (
                          <div key={c.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                            <div>
                              <span className="bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded text-[10px] mr-2">{c.tipo}</span>
                              <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>Liq: {c.nroLiquidacion} - {c.titular}</strong>
                              <p className="text-[10px] text-zinc-400 mt-0.5">Fecha: {formatDateToArg(c.fecha)} • Monto: {c.montoEmbargo || 'Sin especificar'}</p>
                            </div>
                            <button onClick={() => deleteCautelar(c.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded font-bold transition-all border border-red-500/20">
                              🗑️ Levantar / Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {procuracionSubTab === 'honorarios' && (
                    <div className="space-y-6">
                      <form onSubmit={handleAddHonorario} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <h3 className="text-xs font-bold text-orange-500 uppercase">+ Registrar Honorario o Gasto Fiscal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <select 
                            value={newHonorario.fiscalId} onChange={e => setNewHonorario({...newHonorario, fiscalId: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="">Seleccionar Título Fiscal...</option>
                            {fiscalCases.map(fc => <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</option>)}
                          </select>
                          <select 
                            value={newHonorario.tipoIngreso} onChange={e => setNewHonorario({...newHonorario, tipoIngreso: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="HONORARIOS">Ingreso: Honorarios Profesionales</option>
                            <option value="GASTO_JUDICIAL">Gasto: Tasa / Bono / Diligenciamiento</option>
                          </select>
                          <input 
                            type="date" value={newHonorario.fecha} onChange={e => setNewHonorario({...newHonorario, fecha: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Concepto (Ej. Anticipo regulación)" 
                            value={newHonorario.concepto} onChange={e => setNewHonorario({...newHonorario, concepto: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                          <input 
                            type="text" placeholder="Monto ($)" 
                            value={newHonorario.monto} onChange={e => setNewHonorario({...newHonorario, monto: e.target.value})}
                            className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                        <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                          Registrar en Caja Fiscal
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recibos' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-orange-500 text-black font-black text-2xl flex items-center justify-center">🧾</div>
                      <div>
                        <h3 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Generador de Recibos Oficiales (Original y Duplicado)</h3>
                        <p className="text-xs text-orange-500 font-semibold">Estudio Jurídico MM • Río Cuarto</p>
                      </div>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!reciboForm.monto || !reciboForm.pagadorNombre) {
                        alert('Por favor complete el nombre del pagador y el monto.');
                        return;
                      }

                      const finalTipo = reciboForm.tipoRecibo === 'OTRO' ? (reciboForm.customTipo || 'Recibo Oficial') : reciboForm.tipoRecibo;
                      const refAsociada = reciboForm.asociacionTipo === 'expediente' 
                        ? (cases.find(c => c.id === reciboForm.causaId)?.number ? `Expediente Nº ${cases.find(c => c.id === reciboForm.causaId).number} (${cases.find(c => c.id === reciboForm.causaId).caratula})` : 'General / Estudio')
                        : (fiscalCases.find(fc => fc.id === reciboForm.fiscalId)?.nroLiquidacion ? `Liquidación Fiscal Nº ${fiscalCases.find(fc => fc.id === reciboForm.fiscalId).nroLiquidacion} (${fiscalCases.find(fc => fc.id === reciboForm.fiscalId).contribuyente})` : 'General / Estudio');

                      const receiptHtml = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="utf-8">
                          <title>Recibo Oficial - Estudio Jurídico MM</title>
                          <style>
                            body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 20px; font-size: 12px; }
                            .recibo-container { border: 2px dashed #333; padding: 25px; margin-bottom: 30px; position: relative; background: #fff; }
                            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f97316; padding-bottom: 15px; margin-bottom: 15px; }
                            .logo-container { display: flex; align-items: center; gap: 8px; }
                            .logo-box { width: 45px; height: 45px; background: #09090b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; }
                            .logo-m1 { color: #f97316; }
                            .logo-m2 { color: #71717a; }
                            .estudio-info h2 { margin: 0; font-size: 16px; font-weight: 900; color: #09090b; text-transform: uppercase; }
                            .estudio-info p { margin: 2px 0 0 0; font-size: 10px; color: #f97316; font-weight: bold; }
                            .copia-tag { font-size: 14px; font-weight: 900; border: 2px solid #09090b; padding: 5px 15px; text-transform: uppercase; }
                            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 12px; }
                            .amount-box { background: #f4f4f5; border: 1px solid #d4d4d8; padding: 12px; font-size: 15px; font-weight: bold; margin-bottom: 15px; }
                            .concepto-box { margin-bottom: 20px; font-size: 13px; line-height: 1.5; }
                            .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
                            .sig-line { width: 220px; border-top: 1px solid #000; text-align: center; padding-top: 5px; font-size: 11px; font-weight: bold; }
                          </style>
                        </head>
                        <body>
                          <!-- ORIGINAL -->
                          <div class="recibo-container">
                            <div class="header">
                              <div class="logo-container">
                                <div class="logo-box">
                                  <span class="logo-m1">M</span><span class="logo-m2">M</span>
                                </div>
                                <div class="estudio-info">
                                  <h2>Estudio Jurídico MM</h2>
                                  <p>Gestión Legal Integral • Río Cuarto</p>
                                </div>
                              </div>
                              <div class="copia-tag">ORIGINAL</div>
                            </div>

                            <div class="details-grid">
                              <div><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</div>
                              <div><strong>Tipo de Recibo:</strong> ${finalTipo}</div>
                              <div><strong>Pagador / Cliente:</strong> ${reciboForm.pagadorNombre}</div>
                              <div><strong>Asociado a:</strong> ${refAsociada}</div>
                            </div>

                            <div class="amount-box">
                              Son: ${numeroALetras(reciboForm.monto)} — Monto: $ ${reciboForm.monto}
                            </div>

                            <div class="concepto-box">
                              <strong>En concepto de:</strong> ${reciboForm.conceptoDetallado || finalTipo} (${refAsociada}).
                            </div>

                            <div class="signatures">
                              <div class="sig-line">Firma del Pagador / Entregante</div>
                              <div class="sig-line">Firma y Sello - Estudio Jurídico MM</div>
                            </div>
                          </div>

                          <!-- DUPLICADO -->
                          <div class="recibo-container">
                            <div class="header">
                              <div class="logo-container">
                                <div class="logo-box">
                                  <span class="logo-m1">M</span><span class="logo-m2">M</span>
                                </div>
                                <div class="estudio-info">
                                  <h2>Estudio Jurídico MM</h2>
                                  <p>Gestión Legal Integral • Río Cuarto</p>
                                </div>
                              </div>
                              <div class="copia-tag">DUPLICADO</div>
                            </div>

                            <div class="details-grid">
                              <div><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</div>
                              <div><strong>Tipo de Recibo:</strong> ${finalTipo}</div>
                              <div><strong>Pagador / Cliente:</strong> ${reciboForm.pagadorNombre}</div>
                              <div><strong>Asociado a:</strong> ${refAsociada}</div>
                            </div>

                            <div class="amount-box">
                              Son: ${numeroALetras(reciboForm.monto)} — Monto: $ ${reciboForm.monto}
                            </div>

                            <div class="concepto-box">
                              <strong>En concepto de:</strong> ${reciboForm.conceptoDetallado || finalTipo} (${refAsociada}).
                            </div>

                            <div class="signatures">
                              <div class="sig-line">Firma del Pagador / Entregante</div>
                              <div class="sig-line">Firma y Sello - Estudio Jurídico MM</div>
                            </div>
                          </div>

                          <script>
                            window.onload = function() { window.print(); }
                          </script>
                        </body>
                        </html>
                      `;

                      const win = window.open('', '_blank');
                      win.document.write(receiptHtml);
                      win.document.close();
                    }} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`font-bold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Tipo de Recibo:</label>
                          <select 
                            value={reciboForm.tipoRecibo}
                            onChange={e => setReciboForm({...reciboForm, tipoRecibo: e.target.value})}
                            className={`w-full border p-3 rounded-lg outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          >
                            <option value="Anticipo para gastos / Fondo fijo">Anticipo para gastos / Fondo fijo</option>
                            <option value="Pago de honorarios profesionales">Pago de honorarios profesionales</option>
                            <option value="Entrega a cuenta">Entrega a cuenta</option>
                            <option value="Cancelación total">Cancelación total</option>
                            <option value="OTRO">Otro (Escribir personalizado)</option>
                          </select>

                          {reciboForm.tipoRecibo === 'OTRO' && (
                            <input 
                              type="text"
                              placeholder="Especifique el tipo de recibo..."
                              value={reciboForm.customTipo}
                              onChange={e => setReciboForm({...reciboForm, customTipo: e.target.value})}
                              className={`w-full border border-orange-500 p-2.5 rounded-lg mt-2 outline-none ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}
                              required
                            />
                          )}
                        </div>

                        <div>
                          <label className={`font-bold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Nombre del Pagador / Cliente:</label>
                          <input 
                            type="text"
                            placeholder="Ej. Roberto García o Razón Social"
                            value={reciboForm.pagadorNombre}
                            onChange={e => setReciboForm({...reciboForm, pagadorNombre: e.target.value})}
                            className={`w-full border p-3 rounded-lg outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                            required
                          />
                        </div>

                        <div>
                          <label className={`font-bold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Asociar a:</label>
                          <div className="flex gap-4 mb-2">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="asocTipo" 
                                checked={reciboForm.asociacionTipo === 'expediente'} 
                                onChange={() => setReciboForm({...reciboForm, asociacionTipo: 'expediente'})}
                                className="accent-orange-500"
                              />
                              <span>Expediente Judicial</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="asocTipo" 
                                checked={reciboForm.asociacionTipo === 'fiscal'} 
                                onChange={() => setReciboForm({...reciboForm, asociacionTipo: 'fiscal'})}
                                className="accent-orange-500"
                              />
                              <span>Procuración Fiscal (CBA)</span>
                            </label>
                          </div>

                          {reciboForm.asociacionTipo === 'expediente' ? (
                            <select 
                              value={reciboForm.causaId}
                              onChange={e => setReciboForm({...reciboForm, causaId: e.target.value})}
                              className={`w-full border p-3 rounded-lg outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                            >
                              <option value="">Seleccionar Expediente...</option>
                              {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                            </select>
                          ) : (
                            <select 
                              value={reciboForm.fiscalId}
                              onChange={e => setReciboForm({...reciboForm, fiscalId: e.target.value})}
                              className={`w-full border p-3 rounded-lg outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                            >
                              <option value="">Seleccionar Liquidación Fiscal...</option>
                              {fiscalCases.map(fc => <option key={fc.id} value={fc.id}>Liq: {fc.nroLiquidacion} - {fc.contribuyente}</option>)}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className={`font-bold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Monto en Pesos ($):</label>
                          <input 
                            type="text"
                            placeholder="Ej. 250000"
                            value={reciboForm.monto}
                            onChange={e => {
                              const val = e.target.value;
                              setReciboForm({...reciboForm, monto: val});
                              const hint = document.getElementById('hint_recibo_letras');
                              if (hint) hint.innerText = val ? numeroALetras(val) : '';
                            }}
                            className={`w-full border p-3 rounded-lg outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                            required
                          />
                          <div id="hint_recibo_letras" className="text-[10px] text-orange-500 font-bold italic mt-1"></div>
                        </div>
                      </div>

                      <div>
                        <label className={`font-bold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Concepto Detallado:</label>
                        <textarea 
                          placeholder="Descripción detallada del pago recibido..."
                          value={reciboForm.conceptoDetallado}
                          onChange={e => setReciboForm({...reciboForm, conceptoDetallado: e.target.value})}
                          className={`w-full border p-3 rounded-lg outline-none focus:border-orange-500 h-20 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      </div>

                      <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 rounded-lg shadow-lg shadow-orange-500/20 text-xs transition-all flex items-center justify-center gap-2">
                        <span>🖨️ Generar y Descargar Recibo PDF (Original y Duplicado)</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'finanzas' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-5 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Carga Directa en Caja Estudio / Honorarios</h3>
                    <form onSubmit={handleAddDirectFinance} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <input 
                        type="date" 
                        value={newDirectFinance.fecha} 
                        onChange={e => setNewDirectFinance({...newDirectFinance, fecha: e.target.value})}
                        className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <select 
                        value={newDirectFinance.tipoIngreso} 
                        onChange={e => setNewDirectFinance({...newDirectFinance, tipoIngreso: e.target.value})}
                        className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="HONORARIOS">Honorarios Profesionales</option>
                        <option value="GASTO_JUDICIAL">Gasto Operativo / Estudio</option>
                        <option value="OTRO">Otro (Personalizado)</option>
                      </select>

                      {newDirectFinance.tipoIngreso === 'OTRO' ? (
                        <input 
                          type="text" 
                          placeholder="Concepto personalizado..."
                          value={newDirectFinance.customConcepto}
                          onChange={e => setNewDirectFinance({...newDirectFinance, customConcepto: e.target.value})}
                          className={`border border-orange-500 p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}
                          required
                        />
                      ) : (
                        <input 
                          type="text" 
                          placeholder="Referencia o Detalle..."
                          value={newDirectFinance.referencia}
                          onChange={e => setNewDirectFinance({...newDirectFinance, referencia: e.target.value})}
                          className={`border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                        />
                      )}

                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Monto ($)" 
                          value={newDirectFinance.monto} 
                          onChange={e => setNewDirectFinance({...newDirectFinance, monto: e.target.value})}
                          className={`flex-1 border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                          required
                        />
                        <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2.5 rounded shadow">Agregar</button>
                      </div>
                    </form>
                  </div>

                  <div className={`border p-5 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-orange-500 uppercase">Caja General de Honorarios y Gastos del Estudio</h4>
                        <p className="text-[11px] text-zinc-400">Seleccione varios ítems para ver la autosuma instantánea en tiempo real.</p>
                      </div>
                      
                      {selectedFinanceIds.length > 0 && (
                        <div className="bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded shadow">
                          Autosuma ({selectedFinanceIds.length} ítems): ${selectedFinanceIds.reduce((sum, id) => {
                            const item = honorariosProcuracion.find(h => h.id === id);
                            return sum + (parseFloat(item?.monto?.toString().replace(/[^0-9,.-]+/g, "").replace(",", ".")) || 0);
                          }, 0).toLocaleString('es-AR')}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {honorariosProcuracion.map(h => (
                        <div key={h.id} className={`p-3 rounded-lg border flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              checked={selectedFinanceIds.includes(h.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFinanceIds([...selectedFinanceIds, h.id]);
                                } else {
                                  setSelectedFinanceIds(selectedFinanceIds.filter(itemId => itemId !== h.id));
                                }
                              }}
                              className="w-4 h-4 accent-orange-500 cursor-pointer"
                            />
                            <div>
                              <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded text-[9px] mr-2">{h.tipoIngreso || 'HONORARIO'}</span>
                              <strong className={isDarkMode ? 'text-white' : 'text-zinc-900'}>{h.concepto}</strong>
                              <p className="text-[10px] text-zinc-400">Fecha: {formatDateToArg(h.fecha)} • Ref: {h.nroLiquidacion || h.referencia || 'General'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-orange-400">${h.monto}</span>
                            <button onClick={() => deleteHonorario(h.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded font-bold" title="Eliminar Registro">🗑️</button>
                          </div>
                        </div>
                      ))}
                      {honorariosProcuracion.length === 0 && (
                        <p className="text-xs text-zinc-500 italic">No hay registros financieros cargados en el sistema.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'clientes' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddClient} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agregar Nuevo Cliente o Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input 
                        type="text" placeholder="Nombre completo o Razón Social" 
                        value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <select 
                        value={newClient.role} onChange={e => setNewClient({...newClient, role: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="CLIENTE">Rol: CLIENTE</option>
                        <option value="CONTRAPARTE">Rol: CONTRAPARTE</option>
                        <option value="TESTIGO">Rol: TESTIGO</option>
                        <option value="PERITO">Rol: PERITO</option>
                        <option value="OTRO">Rol: OTRO</option>
                      </select>
                      <input 
                        type="text" placeholder="CUIT / DNI" 
                        value={newClient.taxId} onChange={e => setNewClient({...newClient, taxId: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="email" placeholder="Correo electrónico" 
                        value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="text" placeholder="Teléfono de contacto" 
                        value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <input 
                        type="text" placeholder="Dirección / Domicilio" 
                        value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Contacto
                    </button>
                  </form>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Directorio de Contactos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {clients.map(cli => (
                        <div key={cli.id} className={`border p-4 rounded-xl space-y-1 text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded text-[10px] mr-2">{cli.role}</span>
                              <strong className={`text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{cli.name}</strong>
                            </div>
                            <button onClick={() => deleteClient(cli.id)} className="text-red-500 hover:text-red-600 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20" title="Eliminar Contacto">🗑️</button>
                          </div>
                          <p className="text-zinc-400 mt-1">CUIT/DNI: {cli.taxId || 'N/A'} • Tel: {cli.phone || 'N/A'}</p>
                          <p className="text-zinc-500">Email: {cli.email || 'N/A'} • Dir: {cli.address || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tareas' && (
                <div className="space-y-6 relative z-10">
                  <form onSubmit={handleAddTask} className={`border p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-orange-500 uppercase">+ Agregar Nueva Tarea Pendiente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <select 
                        value={newTask.caseId} onChange={e => setNewTask({...newTask, caseId: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="">Seleccionar Expediente / Causa...</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.number} - {c.caratula}</option>)}
                      </select>
                      <input 
                        type="text" placeholder="Título de la tarea..." 
                        value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      />
                      <select 
                        value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                        className={`border p-2.5 rounded outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'}`}
                      >
                        <option value="ALTA">Prioridad: ALTA</option>
                        <option value="MEDIA">Prioridad: MEDIA</option>
                        <option value="BAJA">Prioridad: BAJA</option>
                      </select>
                    </div>
                    <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-4 py-2 rounded hover:bg-orange-400">
                      Guardar Tarea
                    </button>
                  </form>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-orange-500 uppercase">Listado de Tareas</h4>
                    {tasks.map(t => (
                      <div key={t.id} className={`border p-4 rounded-xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)}
                            className="w-4 h-4 accent-orange-500 cursor-pointer"
                          />
                          <span className={`font-bold ${t.completed ? 'line-through opacity-50' : (isDarkMode ? 'text-white' : 'text-zinc-900')}`}>{t.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.priority === 'ALTA' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {t.priority}
                          </span>
                          <button onClick={() => deleteTask(t.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded font-bold">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reporte' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-6 rounded-2xl shadow-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-orange-500 uppercase">📋 Reporte y Agenda Diaria del Estudio</h3>
                        <p className="text-xs text-zinc-500">Resumen operativo listo para imprimir o guardar en PDF.</p>
                      </div>
                      <button onClick={() => window.print()} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2.5 rounded shadow">
                        🖨️ Imprimir / Guardar PDF
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <h4 className="font-bold text-orange-500 uppercase mb-2">⚡ Plazos Procesales Pendientes</h4>
                        {deadlines.filter(d => d.status === 'PENDIENTE').map(d => (
                          <div key={d.id} className={`p-2 border rounded mb-1 flex justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            <span>{d.title}</span>
                            <strong>Vence: {formatDateToArg(d.dueDate)}</strong>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-bold text-orange-500 uppercase mb-2">📅 Audiencias Agendadas</h4>
                        {hearings.filter(h => h.status === 'PENDIENTE').map(h => (
                          <div key={h.id} className={`p-2 border rounded mb-1 flex justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            <span>{h.tipoAudiencia}: {h.title}</span>
                            <strong>{formatDateToArg(h.date?.split('T')[0])} ({h.modalidad})</strong>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-bold text-orange-500 uppercase mb-2">✅ Tareas Prioritarias</h4>
                        {tasks.filter(t => !t.completed).map(t => (
                          <div key={t.id} className={`p-2 border rounded mb-1 flex justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            <span>{t.title}</span>
                            <strong>Prioridad: {t.priority}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'juzgados_rc' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-6 rounded-2xl shadow-xl space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-orange-500 uppercase">🏛️ Directorio de Juzgados y Tribunales • Río Cuarto</h3>
                        <p className="text-xs text-zinc-500">Información de contacto, fueros y dependencias judiciales en la circunscripción.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { fuero: 'Civil y Comercial Nº 1', tel: '0358-4678000', dir: 'Palacio de Tribunales - Alvear y Pringles' },
                        { fuero: 'Civil y Comercial Nº 2', tel: '0358-4678001', dir: 'Palacio de Tribunales - Alvear y Pringles' },
                        { fuero: 'Civil y Comercial Nº 12', tel: '0358-4678012', dir: 'Palacio de Tribunales - Alvear y Pringles' },
                        { fuero: 'Juzgado Fiscal Río Cuarto', tel: '0358-4678050', dir: 'Sede Rentas / Tribunales Provinciales' },
                        { fuero: 'Cámara del Trabajo', tel: '0358-4678020', dir: 'Palacio de Tribunales - 2do Piso' },
                        { fuero: 'Fuero de Familia', tel: '0358-4678030', dir: 'Sede Tribunales II' }
                      ].map((j, i) => (
                        <div key={i} className={`p-4 rounded-xl border text-xs space-y-1 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <strong className={`text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{j.fuero}</strong>
                          <p className="text-orange-500 font-bold">Tel: {j.tel}</p>
                          <p className="text-zinc-500">Dirección: {j.dir}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="space-y-6 relative z-10">
                  <div className={`border p-6 rounded-2xl shadow-xl space-y-6 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div>
                      <h3 className="text-sm font-bold text-orange-500 uppercase">⚙️ Configuración General y Credenciales en Nube</h3>
                      <p className="text-xs text-zinc-500">Administre los correos del equipo para notificaciones de Google Calendar, cambie su contraseña universal y descargue copias de seguridad.</p>
                    </div>

                    <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <h4 className="text-xs font-bold text-orange-500 uppercase">📧 Mails del Equipo (Sincronizados)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {teamEmails.map((mail, idx) => (
                          <input 
                            key={idx}
                            type="email"
                            placeholder={`Correo integrante ${idx + 1}`}
                            value={mail}
                            onChange={(e) => {
                              const updated = [...teamEmails];
                              updated[idx] = e.target.value;
                              setTeamEmails(updated);
                              updateTeamEmails(updated);
                            }}
                            className={`border p-2.5 rounded text-xs outline-none focus:border-orange-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className={`p-4 rounded-xl border space-y-4 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <h4 className="text-xs font-bold text-orange-500 uppercase">🔒 Cambiar Contraseña Universal y Correo de Recuperación</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-zinc-400 block mb-1">Nueva Contraseña:</label>
                          <input 
                            type="password" 
                            placeholder="Dejar en blanco para no cambiar"
                            value={newPass}
                            onChange={e => setNewPass(e.target.value)}
                            className={`w-full border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">Confirmar Nueva Contraseña:</label>
                          <input 
                            type="password" 
                            placeholder="Repita la nueva contraseña"
                            value={confirmPass}
                            onChange={e => setConfirmPass(e.target.value)}
                            className={`w-full border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-zinc-400 block mb-1">Nuevo Correo de Recuperación:</label>
                          <input 
                            type="email" 
                            placeholder={recoveryEmailConfig}
                            value={newRecoveryMail}
                            onChange={e => setNewRecoveryMail(e.target.value)}
                            className={`w-full border p-2.5 rounded outline-none ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                          />
                        </div>
                      </div>

                      {passMessage && (
                        <p className={`text-xs font-bold p-2.5 rounded border ${passMessage.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          {passMessage}
                        </p>
                      )}

                      <button type="submit" className="bg-orange-500 text-black font-bold text-xs px-5 py-2.5 rounded hover:bg-orange-400">
                        Actualizar Credenciales en la Nube
                      </button>
                    </form>

                    <div className={`p-4 rounded-xl border flex justify-between items-center ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div>
                        <h4 className="text-xs font-bold text-orange-500 uppercase">💾 Copia de Resguardo Completa (Backup Descargable)</h4>
                        <p className="text-[11px] text-zinc-400">Descargue un archivo de texto/JSON puro con todos los expedientes, clientes, movimientos y finanzas.</p>
                      </div>
                      <button onClick={handleDownloadFullBackup} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2.5 rounded shadow">
                        Descargar Backup .txt
                      </button>
                    </div>
                  </div>
                </div>
            </main>
      </div>
    </div>
  );
}
