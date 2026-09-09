import './globals.css';

export const metadata = {
  title: 'SWM - Estudio MM',
  description: 'Sistema de Gestión y Centro de Control Jurídico',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-zinc-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
