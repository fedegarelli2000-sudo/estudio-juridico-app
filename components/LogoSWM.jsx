import React from 'react';

export default function LogoSWM({ size = 'medium', className = '' }) {
  const dimensions = {
    small: { width: 120, height: 40, fontSize: '22px' },
    medium: { width: 180, height: 60, fontSize: '32px' },
    large: { width: 280, height: 90, fontSize: '50px' }
  }[size] || { width: 180, height: 60, fontSize: '32px' };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        width={dimensions.width / 2}
        height={dimensions.height}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* M Gris (Fondo - Ligeramente detrás) */}
        <path
          d="M 10 70 L 10 20 L 30 50 L 50 20 L 50 70"
          stroke="#9CA3AF"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90"
        />
        {/* M Naranja (Frente - Superpuesta) */}
        <path
          d="M 40 70 L 40 20 L 60 50 L 80 20 L 80 70"
          stroke="#FF6B00"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col">
        <span 
          className="font-extrabold tracking-widest leading-none text-zinc-100"
          style={{ fontSize: dimensions.fontSize }}
        >
          SWM
        </span>
        <span className="text-[10px] tracking-widest text-orange-500 uppercase font-semibold mt-1">
          Estudio Jurídico
        </span>
      </div>
    </div>
  );
}
