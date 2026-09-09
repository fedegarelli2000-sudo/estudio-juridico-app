export const metadata = {
  title: 'Estudio Jurídico',
  description: 'Gestión de expedientes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
