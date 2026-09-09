'use client';
import { useState } from 'react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('calendario');

  // Formulario
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Audiencia');
  const [tipoPersonalizado, setTipoPersonalizado] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('09:00');
  const [detalle, setDetalle] = useState('');

  const guardarYNotificarGoogleCalendar = (e) => {
    e.preventDefault();

    const tipoFinal = (tipo === 'Otros' && tipoPersonalizado.trim() !== '') 
      ? tipoPersonalizado 
      : tipo;

    if (!fecha || !titulo) {
      alert("Por favor completá los campos obligatorios.");
      return;
    }

    const startDateTime = new Date(`${fecha}T${hora}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const formatGCalDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const datesParam = `${formatGCalDate(startDateTime)}/${formatGCalDate(endDateTime)}`;
    const titleFormatted = encodeURIComponent(`[${tipoFinal}] - ${titulo}`);
    const detailsFormatted = encodeURIComponent(`Tipo: ${tipoFinal}\nNotas: ${detalle}`);

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleFormatted}&dates=${datesParam}&details=${detailsFormatted}`;

    window.open(gcalUrl, '_blank');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex flex-col justify-between p-4`}>
        <div>
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && <h1 className="text-xl font-bold text-orange-500 tracking-wider">ESTUDIO MM</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-white p-1 rounded bg-zinc-800">
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('calendario')} 
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 font-medium ${activeTab === 'calendario' ? 'bg-zinc-800 text-orange-500' : 'text-zinc-400 hover:text-white'}`}
            >
              📅 {sidebarOpen && 'Calendario'}
            </button>
            <button 
              onClick={() => setActiveTab('causas')} 
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 font-medium ${activeTab === 'causas' ? 'bg-zinc-800 text-orange-500' : 'text-zinc-400 hover:text-white'}`}
            >
              📁 {sidebarOpen && 'Gestión de Causas'}
            </button>
          </nav>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'calendario' && (
          <section className="space-y-6 max-w-3xl">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Calendario</h2>
              <p className="text-sm text-zinc-400">Agendá plazos, audiencias y notificaciones para tu estudio</p>
            </div>

            <form onSubmit={guardarYNotificarGoogleCalendar} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 space-y-4">
              <h3 className="text-lg font-semibold text-zinc-200">Agendar Nuevo Evento / Plazo</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Título del Plazo / Asunto</label>
                  <input 
                    type="text" 
                    required 
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Vencimiento Contestación Causa Perez" 
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Tipo de Plazo</label>
                  <select 
                    value={tipo} 
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Audiencia">Audiencia</option>
                    <option value="Plazo Procesal">Plazo Procesal</option>
                    <option value="Tarea">Tarea</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              {tipo === 'Otros' && (
                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-1">Especificar Tipo de Plazo:</label>
                  <input 
                    type="text" 
                    value={tipoPersonalizado}
                    onChange={(e) => setTipoPersonalizado(e.target.value)}
                    placeholder="Escribí el tipo de plazo..." 
                    className="w-full bg-zinc-800 border border-orange-500 text-white rounded p-2 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Fecha de Inicio / Vencimiento</label>
                  <input 
                    type="date" 
                    required 
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Hora</label>
                  <input 
                    type="time" 
                    required 
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Detalle / Notas adicionales</label>
                <textarea 
                  rows="3" 
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Ingresá observaciones, N° de expediente, juzgado, etc..." 
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-2 focus:border-orange-500 focus:outline-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black font-bold py-2.5 px-4 rounded hover:bg-orange-600 transition flex justify-center items-center gap-2"
              >
                📅 Guardar y Enviar Notificación a Google Calendar
              </button>
            </form>
          </section>
        )}

        {activeTab === 'causas' && (
          <section className="space-y-6">
            <h2 class="text-2xl font-bold text-white">Gestión de Causas</h2>
            <p className="text-sm text-zinc-400">Módulo de causas vinculado con Supabase.</p>
          </section>
        )}
      </main>
    </div>
  );
}
