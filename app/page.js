'use client';

<<<<<<< Updated upstream
import React from 'react';
import Link from 'next/link';

const COLORS = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  secondary: '#E3F2FD',
  background: '#F8FCFF',
  white: '#FFFFFF',
  textDark: '#1A365D',
  textLight: '#64748B',
};

const MicroscopeIcon = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
    <circle cx="35" cy="25" r="15" stroke={COLORS.primary} strokeWidth="4" fill="none"/>
    <line x1="35" y1="40" x2="35" y2="70" stroke={COLORS.primary} strokeWidth="4" strokeLinecap="round"/>
    <line x1="20" y1="85" x2="80" y2="85" stroke={COLORS.primaryDark} strokeWidth="5" strokeLinecap="round"/>
    <line x1="35" y1="70" x2="35" y2="85" stroke={COLORS.primary} strokeWidth="4"/>
    <line x1="35" y1="55" x2="55" y2="55" stroke={COLORS.primary} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="65" cy="55" r="8" stroke={COLORS.primaryDark} strokeWidth="3" fill={COLORS.secondary}/>
  </svg>
);

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <MicroscopeIcon />
        <h1 style={{ color: COLORS.primaryDark, fontSize: '2.2rem', fontWeight: '800', marginTop: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          Le Laboratoire Fabuleux
        </h1>
        <p style={{ color: COLORS.textLight, fontSize: '1.1rem', marginTop: '8px' }}>
          Bienvenue dans l'aventure de la digestion !
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '350px' }}>
        <Link href="/eleve" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '24px', borderRadius: '20px', border: 'none',
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
            color: COLORS.white, fontSize: '1.3rem', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(79, 195, 247, 0.4)', transition: 'transform 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '1.8rem' }}>🧑‍🔬</span>
            Espace Élève
          </button>
        </Link>

        <Link href="/enseignant" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '24px', borderRadius: '20px', border: `3px solid ${COLORS.primary}`,
            background: COLORS.white, color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '1.8rem' }}>👨‍🏫</span>
            Espace Enseignant
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '60px', color: COLORS.textLight, fontSize: '0.9rem' }}>
        SVT - Sciences de la Vie et de la Terre
=======
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
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
