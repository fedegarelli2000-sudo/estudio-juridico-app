import './globals.css';

export const metadata = {
  title: 'Estudio MM',
  description: 'Sistema de gestión para estudio jurídico',
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
