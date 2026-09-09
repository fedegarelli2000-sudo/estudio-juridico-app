'use client';
import { useState } from 'react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('calendario');

  // Estado del Formulario
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
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#09090b', color: '#f4f4f5', fontFamily: 'sans-serif' }}>
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside style={{ width: sidebarOpen ? '250px' : '70px', backgroundColor: '#18181b', borderRight: '1px solid #27272a', transition: 'all 0.3s', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            {sidebarOpen && <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f97316', letterSpacing: '1px', margin: 0 }}>ESTUDIO MM</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: '#a1a1aa', background: '#27272a', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('calendario')} 
              style={{ width: '100%', textAlign: 'left', padding: '10px', borderRadius: '6px', background: activeTab === 'calendario' ? '#27272a' : 'transparent', color: activeTab === 'calendario' ? '#f97316' : '#a1a1aa', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📅 {sidebarOpen && 'Calendario'}
            </button>
            <button 
              onClick={() => setActiveTab('causas')} 
              style={{ width: '100%', textAlign: 'left', padding: '10px', borderRadius: '6px', background: activeTab === 'causas' ? '#27272a' : 'transparent', color: activeTab === 'causas' ? '#f97316' : '#a1a1aa', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📁 {sidebarOpen && 'Gestión de Causas'}
            </button>
          </nav>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px', backgroundColor: '#09090b' }}>
        {activeTab === 'calendario' && (
          <section style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid #27272a', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Calendario</h2>
              <p style={{ fontSize: '14px', color: '#a1a1aa', marginTop: '4px' }}>Agendá plazos, audiencias y notificaciones para tu estudio</p>
            </div>

            <form onSubmit={guardarYNotificarGoogleCalendar} style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '8px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e4e4e7', margin: 0 }}>Agendar Nuevo Evento / Plazo</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#a1a1aa', marginBottom: '4px' }}>Título del Plazo / Asunto</label>
                  <input 
                    type="text" 
                    required 
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Vencimiento Contestación Causa Perez" 
                    style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#a1a1aa', marginBottom: '4px' }}>Tipo de Plazo</label>
                  <select 
                    value={tipo} 
                    onChange={(e) => setTipo(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
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
                  <label style={{ display: 'block', fontSize: '14px', color: '#f97316', marginBottom: '4px' }}>Especificar Tipo de Plazo:</label>
                  <input 
                    type="text" 
                    value={tipoPersonalizado}
                    onChange={(e) => setTipoPersonalizado(e.target.value)}
                    placeholder="Escribí el tipo de plazo..." 
                    style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid #f97316', color: '#fff', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#a1a1aa', marginBottom: '4px' }}>Fecha de Inicio / Vencimiento</label>
                  <input 
                    type="date" 
                    required 
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#a1a1aa', marginBottom: '4px' }}>Hora</label>
                  <input 
                    type="time" 
                    required 
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#a1a1aa', marginBottom: '4px' }}>Detalle / Notas adicionales</label>
                <textarea 
                  rows="3" 
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Ingresá observaciones, N° de expediente, juzgado, etc..." 
                  style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginTop: '8px' }}
              >
                📅 Guardar y Enviar Notificación a Google Calendar
              </button>
            </form>
          </section>
        )}

        {activeTab === 'causas' && (
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>Gestión de Causas</h2>
            <p style={{ fontSize: '14px', color: '#a1a1aa' }}>Módulo de causas vinculado con Supabase.</p>
          </section>
        )}
      </main>
    </div>
  );
}
