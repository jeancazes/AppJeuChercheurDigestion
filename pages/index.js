import { useEffect, useState } from 'react';
import Link from 'next/link';
import { testConnection } from '../lib/supabase';

export default function Home() {
  const [supabaseConnected, setSupabaseConnected] = useState(null);

  useEffect(() => {
    // Tester la connexion Supabase au chargement
    testConnection().then(setSupabaseConnected);
  }, []);

  return (
    <div style={styles.container}>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
      `}</style>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>🧪 Le Laboratoire Fabuleux</h1>
          <p style={styles.subtitle}>
            Plateforme de gaming éducatif pour cours de SVT
          </p>
          <p style={styles.version}>Version 7.0 - Avec Supabase</p>
        </div>

        {/* Statut de connexion Supabase */}
        <div style={styles.statusBox}>
          {supabaseConnected === null && (
            <p style={styles.statusText}>🔄 Vérification de la connexion...</p>
          )}
          {supabaseConnected === true && (
            <p style={styles.statusSuccess}>✅ Supabase connecté</p>
          )}
          {supabaseConnected === false && (
            <p style={styles.statusError}>
              ❌ Erreur de connexion Supabase
              <br />
              <small>Vérifiez votre fichier .env.local</small>
            </p>
          )}
        </div>

        {/* Boutons de navigation */}
        <div style={styles.cards}>
          <Link href="/teacher" style={styles.card}>
            <div>
              <h2 style={styles.cardTitle}>👨‍🏫 Interface Professeur</h2>
              <p style={styles.cardDescription}>
                Gérer les classes, créer des équipes, attribuer des points
              </p>
              <p style={styles.cardNote}>Code PIN requis : 1447</p>
            </div>
          </Link>

          <Link href="/student" style={styles.card}>
            <div>
              <h2 style={styles.cardTitle}>👩‍🎓 Interface Élève</h2>
              <p style={styles.cardDescription}>
                Consulter sa fiche, acheter des ressources éducatives
              </p>
              <p style={styles.cardNote}>Sélection de classe requise</p>
            </div>
          </Link>
        </div>

        {/* Informations */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📚 Comment ça marche ?</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoNumber}>1</div>
              <p>Le professeur crée une classe et des équipes</p>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoNumber}>2</div>
              <p>Les équipes gagnent des points de réputation</p>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoNumber}>3</div>
              <p>Chaque 5 points = nouveau niveau + budget</p>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoNumber}>4</div>
              <p>Les équipes achètent des ressources éducatives</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>Développé pour l'enseignement des SVT</p>
          <p style={styles.footerLinks}>
            <a href="/GUIDE_SUPABASE.md" style={styles.link}>Guide Supabase</a>
            {' | '}
            <a href="/VERCEL.md" style={styles.link}>Guide Vercel</a>
            {' | '}
            <a href="/MIGRATION.md" style={styles.link}>Migration v6→v7</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
  },
  title: {
    fontSize: '3rem',
    margin: '0 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.3rem',
    margin: '0',
    opacity: 0.9,
  },
  version: {
    fontSize: '0.9rem',
    margin: '10px 0 0 0',
    opacity: 0.7,
  },
  statusBox: {
    background: 'white',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  statusText: {
    margin: 0,
    color: '#666',
  },
  statusSuccess: {
    margin: 0,
    color: '#10b981',
    fontWeight: 'bold',
  },
  statusError: {
    margin: 0,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
    },
  },
  cardTitle: {
    fontSize: '1.5rem',
    margin: '0 0 10px 0',
    color: '#667eea',
  },
  cardDescription: {
    fontSize: '1rem',
    margin: '0 0 15px 0',
    color: '#666',
  },
  cardNote: {
    fontSize: '0.85rem',
    margin: 0,
    color: '#999',
    fontStyle: 'italic',
  },
  infoBox: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '40px',
  },
  infoTitle: {
    textAlign: 'center',
    color: '#667eea',
    marginTop: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  infoCard: {
    textAlign: 'center',
    padding: '20px',
  },
  infoNumber: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 auto 15px',
  },
  footer: {
    textAlign: 'center',
    color: 'white',
    marginTop: '60px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
  footerLinks: {
    marginTop: '10px',
  },
  link: {
    color: 'white',
    textDecoration: 'underline',
    opacity: 0.8,
  },
};
