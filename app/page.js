'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      {/* Logo et titre */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #0288D1 0%, #4FC3F7 100%)',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 15px 40px rgba(2, 136, 209, 0.3)',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
            <path d="M50 10 L50 45 M35 30 L65 30" stroke="white" strokeWidth="8" strokeLinecap="round"/>
            <path d="M30 55 Q30 90 50 90 Q70 90 70 55 L70 50 L30 50 Z" fill="white" opacity="0.9"/>
            <circle cx="42" cy="65" r="5" fill="#4FC3F7"/>
            <circle cx="58" cy="70" r="4" fill="#0288D1"/>
            <circle cx="50" cy="78" r="3" fill="#4FC3F7"/>
          </svg>
        </div>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: '2.5rem',
          color: '#01579B',
          textShadow: '2px 2px 0 #B3E5FC',
          marginBottom: '10px',
        }}>
          Le Laboratoire Fabuleux
        </h1>
        <p style={{ 
          color: '#546E7A', 
          fontSize: '1.1rem',
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          Serious Game - Sciences de la Vie et de la Terre
        </p>
      </div>

      {/* Cartes de navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        maxWidth: '800px',
        width: '100%',
      }}>
        {/* Carte Élève */}
        <Link href="/eleve" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 10px 40px rgba(2, 136, 209, 0.15)',
            border: '3px solid #B3E5FC',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(2, 136, 209, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(2, 136, 209, 0.15)';
          }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #4FC3F7 0%, #81D4FA 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="35" r="20" fill="white"/>
                <path d="M20 85 Q20 55 50 55 Q80 55 80 85" fill="white"/>
                <circle cx="50" cy="35" r="6" fill="#4FC3F7"/>
              </svg>
            </div>
            <h2 style={{ 
              color: '#01579B', 
              fontSize: '1.5rem', 
              marginBottom: '10px',
              fontWeight: '800',
            }}>
              Espace Élève
            </h2>
            <p style={{ color: '#546E7A', fontSize: '0.95rem' }}>
              Accède aux ressources, gère ton équipe et progresse dans le jeu
            </p>
          </div>
        </Link>

        {/* Carte Enseignant */}
        <Link href="/enseignant" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 10px 40px rgba(2, 136, 209, 0.15)',
            border: '3px solid #B3E5FC',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(2, 136, 209, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(2, 136, 209, 0.15)';
          }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #0288D1 0%, #4FC3F7 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
                <rect x="15" y="25" width="70" height="50" rx="5" fill="white"/>
                <rect x="25" y="35" width="30" height="4" rx="2" fill="#4FC3F7"/>
                <rect x="25" y="45" width="50" height="3" rx="1.5" fill="#B3E5FC"/>
                <rect x="25" y="53" width="40" height="3" rx="1.5" fill="#B3E5FC"/>
                <rect x="25" y="61" width="45" height="3" rx="1.5" fill="#B3E5FC"/>
                <circle cx="70" cy="40" r="12" fill="#4FC3F7"/>
                <path d="M66 40 L69 43 L75 37" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ 
              color: '#01579B', 
              fontSize: '1.5rem', 
              marginBottom: '10px',
              fontWeight: '800',
            }}>
              Espace Enseignant
            </h2>
            <p style={{ color: '#546E7A', fontSize: '0.95rem' }}>
              Gère tes classes, attribue des points et suit la progression
            </p>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '60px', 
        color: '#78909C',
        fontSize: '0.9rem',
      }}>
        <p>🔬 Thème : La Digestion • Classe de 5ème</p>
      </div>
    </div>
  );
}
