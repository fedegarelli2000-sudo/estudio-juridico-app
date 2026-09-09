import React, { useState } from 'react';
import { 
  LayoutDashboard, FolderBriefcase, Users, AlertTriangle, Calendar, 
  FileText, DollarSign, Search, Bell, Sparkles, Check, X, Plus, 
  Clock, ShieldAlert, ArrowUpRight, CheckSquare, ChevronRight, FileCode
} from 'lucide-react';

export default function App() {
  // Estado de navegación activa entre módulos
  const [activeModule, setActiveModule] = useState('dashboard');
  
  // Estado para la IA de plazos (Simulación)
  const [plazoEstado, setPlazoEstado] = useState('PENDIENTE'); // 'PENDIENTE', 'CONFIRMADO', 'RECHAZADO'
  
  // Estado para el buscador global
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para la generación automática de documentos con variables
  const [selectedCaseForTemplate, setSelectedCaseForTemplate] = useState('EXP-9821/2026');
  const [generatedDocument, setGeneratedDocument] = useState('');

  // Datos del expediente seleccionado
  const caseData = {
    caseNumber: 'EXP-9821/2026',
    caratula: 'García, Roberto Carlos c/ Aseguradora del Sur S.A. s/ Daños y Perjuicios',
    court: 'Juzgado Civil y Comercial Nº 12 - Sec. 2',
    jurisdiction: 'Fuero Civil y Comercial',
    client: 'García, Roberto Carlos',
    demandado: 'Aseguradora del Sur S.A.',
    lawyer: 'Dr. Federico Garelli',
    startDate: '15/03/2026',
    status: 'EN TRAMITE'
  };

  // Función para autocompletar plantilla
  const handleGenerateDocument = () => {
    const templateText = `INICIA DEMANDA / PRESENTA ESCRITO

Señor Juez del ${caseData.court}:

${caseData.lawyer}, en representación de ${caseData.client}, en los autos caratulados "${caseData.caratula}" (${caseData.caseNumber}), ante V.S. me presento y digo:

I. OBJETO
Que vengo en tiempo y forma a presentar el correspondiente escrito respecto a la contraparte ${caseData.demandado}...

Río Cuarto, 9 de Septiembre de 2026.`;

    setGeneratedDocument(templateText);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* 1. BARRA NAVEGACIÓN LATERAL (MENU PRINCIPAL) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white font-bold text-lg">
              <ScaleIcon />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">LexSystem</h1>
              <p className="text-xs text-slate-400">Estudio Jurídico</p>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard },
              { id: 'expedientes', label: 'Expedientes / Casos', icon: FolderBriefcase },
              { id: 'clientes', label: 'Clientes y Contactos', icon: Users },
              { id: 'plazos', label: 'Plazos e IA', icon: AlertTriangle, badge: plazoEstado === 'PENDIENTE' ? '1' : null },
              { id: 'calendario', label: 'Calendario y Audiencias', icon: Calendar },
              { id: 'plantillas', label: 'Plantillas y Documentos', icon: FileText },
              { id: 'finanzas', label: 'Finanzas y Honorarios', icon: DollarSign },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-semibold' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p className="font-semibold text-slate-300">Dr. Federico Garelli</p>
          <p>Abogado Titular</p>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* BARRA SUPERIOR (BUSCADOR GLOBAL Y NOTIFICACIONES) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Búsqueda global (Expediente, Cliente, DNI, Juzgado)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 rounded-lg text-sm border-transparent focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5" />
              {plazoEstado === 'PENDIENTE' && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO SEGÚN EL MÓDULO SELECCIONADO */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* MÓDULO 1: DASHBOARD GENERAL */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Dashboard General</h2>
                <p className="text-xs text-slate-500">Resumen operativo del estudio jurídico</p>
              </div>

              {/* KPIS / RESUMEN */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Expedientes Activos</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">42</h3>
                  <span className="text-xs text-emerald-600 font-medium">3 nuevos este mes</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Plazos IA por Confirmar</span>
                  <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                    {plazoEstado === 'PENDIENTE' ? '1' : '0'}
                  </h3>
                  <span className="text-xs text-slate-500">Requiere revisión humana</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Audiencias Próximas</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">2</h3>
                  <span className="text-xs text-slate-500">Próxima: Mañana 10:00 hs</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Honorarios Pendientes</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">$1.850.000</h3>
                  <span className="text-xs text-red-500 font-medium">2 cuotas vencidas</span>
                </div>
              </div>

              {/* SECCIÓN DE ATENCIÓN URGENTE */}
              {plazoEstado === 'PENDIENTE' && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span>Alerta de IA: Nuevo Plazo Detectado</span>
                    </div>
                    <button 
                      onClick={() => setActiveModule('plazos')}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      Ver en Módulo de Plazos <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700">
                    Se detectó un traslado de contestación en el expediente <strong>{caseData.caseNumber}</strong>. Cómputo estimado: 5 días hábiles (Vence 16/09/2026).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MÓDULO 2: EXPEDIENTES / CASOS */}
          {activeModule === 'expedientes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded">
                      {caseData.caseNumber}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-2">{caseData.caratula}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{caseData.court} • {caseData.jurisdiction}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">
                    {caseData.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">CLIENTE</span>
                    <span className="font-bold text-slate-800">{caseData.client}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">DEMANDADO</span>
                    <span className="font-bold text-slate-800">{caseData.demandado}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">ABOGADO</span>
                    <span className="font-bold text-slate-800">{caseData.lawyer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">INICIO</span>
                    <span className="font-bold text-slate-800">{caseData.startDate}</span>
                  </div>
                </div>
              </div>

              {/* LÍNEA DE TIEMPO DE ACTUACIONES */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Historial e Integración de Actuaciones</h3>
                <div className="border-l-2 border-slate-200 ml-3 pl-6 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white"></span>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <span className="text-[11px] font-bold text-indigo-600">09 DE SEPTIEMBRE, 2026</span>
                      <h4 className="text-sm font-bold text-slate-800 mt-0.5">Notificación Electrónica - Confiere Traslado</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        "Confiérase traslado a la parte actora por el término de ley de la contestación de demanda."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 3: CLIENTES */}
          {activeModule === 'clientes' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Base de Clientes y Contactos</h2>
                <button className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Nuevo Cliente
                </button>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nombre / Razón Social</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">CUIT / DNI</th>
                    <th className="p-3">Expediente Asociado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-800">{caseData.client}</td>
                    <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">CLIENTE</span></td>
                    <td className="p-3 text-slate-600">20-34881920-8</td>
                    <td className="p-3 text-indigo-600 font-bold">{caseData.caseNumber}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">{caseData.demandado}</td>
                    <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">CONTRAPARTE</span></td>
                    <td className="p-3 text-slate-600">30-50112233-4</td>
                    <td className="p-3 text-indigo-600 font-bold">{caseData.caseNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* MÓDULO 4: PLAZOS E INTELIGENCIA ARTIFICIAL */}
          {activeModule === 'plazos' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Gestión de Plazos y Asistente IA</h2>
                <p className="text-xs text-slate-500">Módulo de detección inteligente y control de vencimientos procesales</p>
              </div>

              {plazoEstado === 'PENDIENTE' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded">
                        REVISION REQUERIDA POR EL ABOGADO
                      </span>
                      <h3 className="text-base font-bold text-slate-900">Traslado de Contestación de Demanda</h3>
                      <p className="text-xs text-slate-600">
                        <strong>Expediente:</strong> {caseData.caseNumber} ({caseData.caratula})
                      </p>
                      <div className="flex gap-4 text-xs bg-white p-3 rounded-lg border border-amber-200 mt-2">
                        <div><span className="text-slate-400 block">Cómputo</span><span className="font-bold">5 Días Hábiles</span></div>
                        <div><span className="text-slate-400 block">Inicio</span><span className="font-bold">10/09/2026</span></div>
                        <div><span className="text-slate-400 block">Vencimiento</span><span className="font-bold text-red-600">16/09/2026</span></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setPlazoEstado('CONFIRMADO')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Confirmar Plazo
                      </button>
                      <button 
                        onClick={() => setPlazoEstado('RECHAZADO')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs font-bold">
                  Estado actualizado: El plazo fue {plazoEstado === 'CONFIRMADO' ? 'confirmado e incorporado al calendario' : 'rechazado'}.
                </div>
              )}
            </div>
          )}

          {/* MÓDULO 5: CALENDARIO Y AUDIENCIAS */}
          {activeModule === 'calendario' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Calendario General del Estudio</h2>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-indigo-600">MAÑANA - 10:00 HS</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">AUDIENCIA</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">Audiencia Preliminar - {caseData.caseNumber}</h4>
                <p className="text-xs text-slate-500">{caseData.court}</p>
              </div>
            </div>
          )}

          {/* MÓDULO 6: PLANTILLAS Y GENERACIÓN */}
          {activeModule === 'plantillas' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Generador Automático de Escritos</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={handleGenerateDocument}
                    className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Generar Escrito Automático para {caseData.caseNumber}
                  </button>
                </div>

                {generatedDocument && (
                  <textarea 
                    value={generatedDocument} 
                    readOnly
                    rows={10} 
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none"
                  />
                )}
              </div>
            </div>
          )}

          {/* MÓDULO 7: FINANZAS */}
          {activeModule === 'finanzas' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Control Financiero de Honorarios</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-bold">HONORARIOS PACTADOS</span>
                  <span className="text-lg font-extrabold text-slate-800">$2.500.000</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-bold">SALDO PENDIENTE DE COBRO</span>
                  <span className="text-lg font-extrabold text-red-600">$1.850.000</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Icono decorativo de balanza legal
function ScaleIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2L3 9h3v10h12V9h3L12 2zm0 3.8L16.2 9H7.8L12 5.8zM8 17v-6h8v6H8z"/>
    </svg>
  );
}
