'use client';

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
      </div>
    </div>
  );
}
