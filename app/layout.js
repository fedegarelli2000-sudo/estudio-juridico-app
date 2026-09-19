export const metadata = {
  title: 'Estudio Jurídico MM',
  description: 'Sistema de gestión para estudio jurídico',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#09090b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-zinc-950 text-white min-h-screen">
        {children}
        <script src="/register-sw.js"></script>
      </body>
    </html>
  );
}
