import './globals.css'

export const metadata = {
  title: 'Le Laboratoire Fabuleux',
  description: 'Jeu éducatif SVT sur la digestion',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
