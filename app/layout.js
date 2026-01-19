import './globals.css'

export const metadata = {
<<<<<<< Updated upstream
  title: 'Le Laboratoire Fabuleux',
  description: 'Jeu éducatif SVT sur la digestion',
=======
  title: 'Le Laboratoire Fabuleux - Serious Game SVT',
  description: 'Jeu sérieux pour apprendre la digestion en SVT',
>>>>>>> Stashed changes
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
<<<<<<< Updated upstream
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
=======
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />
>>>>>>> Stashed changes
      </head>
      <body>{children}</body>
    </html>
  )
}
