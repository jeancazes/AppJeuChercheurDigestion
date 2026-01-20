import { useEffect, useState } from 'react';
import Link from 'next/link';
import { testConnection } from '../lib/supabase';
import { COLORS } from '../lib/theme';

export default function Home() {
  const [supabaseConnected, setSupabaseConnected] = useState(null);

  useEffect(() => {
    testConnection().then(setSupabaseConnected);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      padding: '20px',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 20px',
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 12px 35px ${COLORS.cardShadow}`,
          }}>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L50 45 M35 30 L65 30" stroke="white" strokeWidth="8" strokeLinecap="round"/>
              <path d="M30 55 Q30 90 50 90 Q70 90 70 55 L70 50 L30 50 Z" fill="white" opacity="0.9"/>
              <circle cx="42" cy="65" r="5" fill={COLORS.primaryLight}/>
              <circle cx="58" cy="70" r="4" fill={COLORS.primary}/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: '2.5rem',
            color: COLORS.primaryDark,
            marginBottom: '12px',
            textShadow: `2px 2px 0 ${COLORS.secondary}`,
          }}>
            Le Laboratoire Fabuleux
          </h1>
          <p style={{ color: COLORS.textLight, fontSize: '1.2rem', marginBottom: '8px' }}>
            Plateforme de gaming éducatif pour cours de SVT
          </p>
          <p style={{ color: COLORS.primary, fontSize: '0.9rem', fontWeight: '600' }}>
            Version 8 - Design v6 + Supabase
          </p>
        </div>

        {/* Statut Supabase */}
        <div style={{
          background: COLORS.white,
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '30px',
          textAlign: 'center',
          border: `2px solid ${COLORS.cardBorder}`,
          boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
        }}>
          {supabaseConnected === null && (
            <p style={{ margin: 0, color: COLORS.textLight }}>🔄 Vérification de la connexion...</p>
          )}
          {supabaseConnected === true && (
            <p style={{ margin: 0, color: COLORS.success, fontWeight: 'bold' }}>✅ Supabase connecté</p>
          )}
          {supabaseConnected === false && (
            <div>
              <p style={{ margin: 0, color: COLORS.error, fontWeight: 'bold' }}>
                ❌ Erreur de connexion Supabase
              </p>
              <p style={{ fontSize: '0.85rem', color: COLORS.textLight, margin: '8px 0 0 0' }}>
                Vérifiez votre fichier .env.local
              </p>
            </div>
          )}
        </div>

        {/* Cartes de navigation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <Link href="/teacher" style={{ textDecoration: 'none' }}>
            <div style={{
              background: COLORS.white,
              borderRadius: '20px',
              padding: '30px',
              border: `3px solid ${COLORS.cardBorder}`,
              boxShadow: `0 8px 25px ${COLORS.cardShadow}`,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👨‍🏫</div>
              <h2 style={{ color: COLORS.primaryDark, fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>
                Interface Enseignant
              </h2>
              <p style={{ color: COLORS.textLight, fontSize: '1rem', marginBottom: '16px' }}>
                Gérer les classes, créer des équipes, attribuer des points de réputation
              </p>
              <div style={{
                background: COLORS.secondary,
                color: COLORS.primary,
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-block',
              }}>
                Code PIN : 1447
              </div>
            </div>
          </Link>

          <Link href="/student" style={{ textDecoration: 'none' }}>
            <div style={{
              background: COLORS.white,
              borderRadius: '20px',
              padding: '30px',
              border: `3px solid ${COLORS.cardBorder}`,
              boxShadow: `0 8px 25px ${COLORS.cardShadow}`,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👩‍🎓</div>
              <h2 style={{ color: COLORS.primaryDark, fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>
                Interface Élève
              </h2>
              <p style={{ color: COLORS.textLight, fontSize: '1rem', marginBottom: '16px' }}>
                Consulter sa fiche d'équipe, acheter des ressources éducatives
              </p>
              <div style={{
                background: COLORS.secondary,
                color: COLORS.primary,
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-block',
              }}>
                Sélection de classe
              </div>
            </div>
          </Link>
        </div>

        {/* Comment ça marche */}
        <div style={{
          background: COLORS.white,
          borderRadius: '20px',
          padding: '30px',
          border: `2px solid ${COLORS.cardBorder}`,
          boxShadow: `0 8px 25px ${COLORS.cardShadow}`,
          marginBottom: '30px',
        }}>
          <h3 style={{ textAlign: 'center', color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800', marginTop: 0, marginBottom: '30px' }}>
            📚 Comment ça marche ?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
          }}>
            {[
              { num: 1, text: 'Le professeur crée une classe et des équipes' },
              { num: 2, text: 'Les équipes gagnent des points de réputation' },
              { num: 3, text: 'Chaque 5 points = nouveau niveau + budget' },
              { num: 4, text: 'Les équipes achètent des ressources éducatives' },
            ].map(item => (
              <div key={item.num} style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                  color: COLORS.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0 auto 15px',
                }}>
                  {item.num}
                </div>
                <p style={{ fontSize: '0.9rem', color: COLORS.text, margin: 0 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: COLORS.textLight, paddingTop: '20px', borderTop: `1px solid ${COLORS.cardBorder}` }}>
          <p style={{ fontSize: '0.9rem', margin: '0 0 10px 0' }}>
            Développé pour l'enseignement des SVT
          </p>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            <a href="/GUIDE_SUPABASE.md" style={{ color: COLORS.primary, textDecoration: 'none' }}>Guide Supabase</a>
            {' | '}
            <a href="/VERCEL.md" style={{ color: COLORS.primary, textDecoration: 'none' }}>Guide Vercel</a>
            {' | '}
            <a href="/MIGRATION.md" style={{ color: COLORS.primary, textDecoration: 'none' }}>Migration</a>
          </p>
        </div>
      </div>
    </div>
  );
}
