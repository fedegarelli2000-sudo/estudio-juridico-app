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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif' }}>
      
      {/* BARRA LATERAL */}
      <aside style={{ width: sidebarOpen ? '240px' : '60px', backgroundColor: '#18181b', borderRight: '1px solid #27272a', padding: '16px', transition: 'all 0.2s', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', itemsCenter: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          {sidebarOpen && <h1 style={{ color: '#ff6b00', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>ESTUDIO MM</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('calendario')} 
            style={{ textAlign: 'left', padding: '10px', background: activeTab === 'calendario' ? '#27272a' : 'transparent', color: activeTab === 'calendario' ? '#ff6b00' : '#a1a1aa', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📅 {sidebarOpen && 'Calendario'}
          </button>
          <button 
            onClick={() => setActiveTab('causas')} 
            style={{ textAlign: 'left', padding: '10px', background: activeTab === 'causas' ? '#27272a' : 'transparent', color: activeTab === 'causas' ? '#ff6b00' : '#a1a1aa', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📁 {sidebarOpen && 'Gestión de Causas'}
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '32px', backgroundColor: '#09090b' }}>
        {activeTab === 'calendario' && (
          <div style={{ maxWidth: '650px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Calendario</h2>
            <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '24px' }}>Agendá plazos, audiencias y notificaciones para tu estudio</p>

            <form onSubmit={guardarYNotificarGoogleCalendar} style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '8px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#e4e4e7' }}>Agendar Nuevo Evento / Plazo</h3>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Título del Plazo / Asunto</label>
                  <input 
                    type="text" 
                    required 
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Vencimiento Contestación Causa Perez" 
                    style={{ width: '100%', padding: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Tipo de Plazo</label>
                  <select 
                    value={tipo} 
                    onChange={(e) => setTipo(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
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
                  <label style={{ display: 'block', fontSize: '12px', color: '#ff6b00', marginBottom: '4px' }}>Especificar Tipo de Plazo:</label>
                  <input 
                    type="text" 
                    value={tipoPersonalizado}
                    onChange={(e) => setTipoPersonalizado(e.target.value)}
                    placeholder="Escribí el tipo de plazo..." 
                    style={{ width: '100%', padding: '8px', backgroundColor: '#27272a', border: '1px solid #ff6b00', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Fecha de Inicio / Vencimiento</label>
                  <input 
                    type="date" 
                    required 
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Hora</label>
                  <input 
                    type="time" 
                    required 
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Detalle / Notas adicionales</label>
                <textarea 
                  rows="3" 
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Ingresá observaciones, N° de expediente, juzgado, etc..." 
                  style={{ width: '100%', padding: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '10px', backgroundColor: '#ff6b00', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' }}
              >
                📅 Guardar y Enviar Notificación a Google Calendar
              </button>
            </form>
          </div>
        )}

        {activeTab === 'causas' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Gestión de Causas</h2>
            <p style={{ color: '#a1a1aa' }}>Módulo conectado a Supabase.</p>
          </div>
        )}
      </main>
    </div>
  );
}
