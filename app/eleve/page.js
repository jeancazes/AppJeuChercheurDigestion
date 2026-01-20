'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGameStore, COLORS, LEVEL_CONFIG } from '@/lib/gameStore';

// ============================================
// ICÔNES SVG MÉDICALES
// ============================================
const MedicalIcons = {
  microscope: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="35" cy="25" r="15" stroke="currentColor" strokeWidth="6" fill="none"/>
      <line x1="35" y1="40" x2="35" y2="70" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <line x1="20" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <line x1="35" y1="70" x2="35" y2="85" stroke="currentColor" strokeWidth="6"/>
      <line x1="50" y1="55" x2="70" y2="55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  flask: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path d="M35 10 L35 40 L15 80 Q10 90 20 90 L80 90 Q90 90 85 80 L65 40 L65 10" stroke="currentColor" strokeWidth="5" fill="none"/>
      <line x1="30" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="50" cy="70" rx="20" ry="8" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path d="M15 20 L15 80 Q50 70 50 70 Q50 70 85 80 L85 20 Q50 30 50 30 Q50 30 15 20Z" stroke="currentColor" strokeWidth="5" fill="none"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="35" r="20" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M20 90 Q20 60 50 60 Q80 60 80 90" stroke="currentColor" strokeWidth="5" fill="none"/>
    </svg>
  ),
  help: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M35 40 Q35 25 50 25 Q65 25 65 40 Q65 50 50 55 L50 62" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="75" r="4" fill="currentColor"/>
    </svg>
  ),
  back: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path d="M60 20 L30 50 L60 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path d="M20 20 L30 20 L45 60 L80 60 L90 30 L35 30" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="45" cy="78" r="8" fill="currentColor"/>
      <circle cx="75" cy="78" r="8" fill="currentColor"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
      <path d="M20 50 L40 70 L80 30" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <rect x="20" y="45" width="60" height="45" rx="8" stroke="currentColor" strokeWidth="6" fill="none"/>
      <path d="M30 45 L30 30 Q30 10 50 10 Q70 10 70 30 L70 45" stroke="currentColor" strokeWidth="6" fill="none"/>
    </svg>
  ),
  school: (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <path d="M10 40 L50 20 L90 40 L50 60 Z" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M25 50 L25 75 Q50 85 75 75 L75 50" stroke="currentColor" strokeWidth="5" fill="none"/>
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
      <path d="M70 10 L90 10 L90 30" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M90 10 L45 55" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <path d="M75 55 L75 85 L15 85 L15 25 L45 25" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  team: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="35" cy="30" r="12" stroke="currentColor" strokeWidth="4" fill="none"/>
      <circle cx="65" cy="30" r="12" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path d="M15 70 Q15 50 35 50 Q55 50 55 70" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path d="M45 70 Q45 50 65 50 Q85 50 85 70" stroke="currentColor" strokeWidth="4" fill="none"/>
    </svg>
  ),
};

// ============================================
// PAGE DE SÉLECTION DE CLASSE
// ============================================
const ClassSelectionPage = ({ onSelectClass }) => {
  const gameStore = getGameStore();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true);
      try {
        await gameStore.refreshClasses();
        setClasses(gameStore.getClasses());
      } catch (error) {
        console.error('Erreur chargement classes:', error);
      }
      setLoading(false);
    };

    loadClasses();

    // S'abonner aux changements
    const unsubscribe = gameStore.subscribe(() => {
      setClasses(gameStore.getClasses());
    });

    return unsubscribe;
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 16px',
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 10px 30px ${COLORS.cardShadow}`,
          animation: 'float 3s ease-in-out infinite',
        }}>
          <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
            <path d="M50 10 L50 45 M35 30 L65 30" stroke="white" strokeWidth="8" strokeLinecap="round"/>
            <path d="M30 55 Q30 90 50 90 Q70 90 70 55 L70 50 L30 50 Z" fill="white" opacity="0.9"/>
            <circle cx="42" cy="65" r="5" fill={COLORS.primaryLight}/>
            <circle cx="58" cy="70" r="4" fill={COLORS.primary}/>
          </svg>
        </div>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: '1.6rem',
          color: COLORS.primaryDark,
          marginBottom: '8px',
        }}>
          Le Laboratoire Fabuleux
        </h1>
        <p style={{ color: COLORS.textLight, fontSize: '1rem', marginBottom: '8px' }}>
          👋 Bienvenue, jeune scientifique !
        </p>
        <p style={{ color: COLORS.primary, fontSize: '0.95rem', fontWeight: '600' }}>
          Sélectionne ta classe
        </p>
      </div>

      {/* Chargement */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textLight }}>
          <p>Chargement des classes...</p>
        </div>
      )}

      {/* Aucune classe */}
      {!loading && classes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: COLORS.textLight, fontSize: '1.1rem', marginBottom: '10px' }}>
            Aucune classe disponible
          </p>
          <p style={{ color: COLORS.textLight, fontSize: '0.9rem' }}>
            Contactez votre enseignant pour créer une classe
          </p>
        </div>
      )}

      {/* Liste des classes */}
      {!loading && classes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
          {classes.map(classe => {
            const equipes = gameStore.getEquipesByClasse(classe.id);
            
            return (
              <button
                key={classe.id}
                onClick={() => onSelectClass(classe)}
                style={{
                  background: COLORS.white,
                  border: `3px solid ${COLORS.cardBorder}`,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <h2 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>
                    {classe.name}
                  </h2>
                  <p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>
                    {classe.anneeScolaire}
                  </p>
                </div>
                <div style={{
                  background: COLORS.secondary,
                  padding: '10px 16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.primary }}>
                    {equipes.length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>équipe{equipes.length > 1 ? 's' : ''}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Lien retour */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link href="/" style={{
          color: COLORS.textLight,
          fontSize: '0.9rem',
          textDecoration: 'none',
        }}>
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

// ============================================
// PAGE DE SÉLECTION D'ÉQUIPE
// ============================================
const TeamSelectionPage = ({ classe, onSelectTeam, onBack }) => {
  const gameStore = getGameStore();
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      try {
        await gameStore.loadClasse(classe.id);
        setEquipes(gameStore.getEquipesByClasse(classe.id));
      } catch (error) {
        console.error('Erreur chargement équipes:', error);
      }
      setLoading(false);
    };

    loadTeams();

    // S'abonner aux changements
    const unsubscribe = gameStore.subscribe(() => {
      setEquipes(gameStore.getEquipesByClasse(classe.id));
    });

    return unsubscribe;
  }, [classe.id]);

  const shortenName = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return name;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
    }}>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        padding: '16px 20px',
        borderBottom: `2px solid ${COLORS.cardBorder}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: COLORS.primary,
          }}>
            {MedicalIcons.back}
          </button>
          <div>
            <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>
              {classe.name}
            </h1>
            <p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>
              Sélectionne ton équipe
            </p>
          </div>
        </div>
      </div>

      {/* Chargement */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textLight }}>
          <p>Chargement des équipes...</p>
        </div>
      )}

      {/* Aucune équipe */}
      {!loading && equipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: COLORS.textLight, fontSize: '1.1rem', marginBottom: '10px' }}>
            Aucune équipe dans cette classe
          </p>
          <p style={{ color: COLORS.textLight, fontSize: '0.9rem' }}>
            Contactez votre enseignant pour créer des équipes
          </p>
        </div>
      )}

      {/* Liste des équipes */}
      {!loading && equipes.length > 0 && (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {equipes.map(equipe => {
              const levelInfo = LEVEL_CONFIG[equipe.level];
              
              return (
                <button
                  key={equipe.id}
                  onClick={() => onSelectTeam(equipe.id)}
                  style={{
                    background: COLORS.white,
                    border: `3px solid ${COLORS.cardBorder}`,
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: COLORS.white,
                      }}>
                        {MedicalIcons.team}
                      </div>
                      <div>
                        <h3 style={{ color: COLORS.primaryDark, fontSize: '1.1rem', fontWeight: '800', marginBottom: '2px' }}>
                          Équipe {equipe.numero}
                        </h3>
                        <span style={{
                          background: COLORS.secondary,
                          color: COLORS.primaryDark,
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}>
                          Niv. {equipe.level} - {levelInfo.title}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      background: '#E8F5E9',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: COLORS.success }}>
                      {equipe.budget}€
                    </div>
                    <div style={{ fontSize: '0.65rem', color: COLORS.textLight }}>budget</div>
                  </div>
                </div>
                
                <div style={{
                  background: COLORS.background,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}>
                  {equipe.membres.map((membre, i) => (
                    <span
                      key={i}
                      style={{
                        background: COLORS.white,
                        color: COLORS.text,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        border: `1px solid ${COLORS.cardBorder}`,
                      }}
                    >
                      {shortenName(membre)}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// PAGE D'ACCUEIL
// ============================================
const HomePage = ({ equipe, classeInfo, onNavigate, onLogout }) => {
  const levelInfo = LEVEL_CONFIG[equipe.level];
  const nextLevel = equipe.level < 4 ? LEVEL_CONFIG[equipe.level + 1] : null;
  const progressToNext = nextLevel 
    ? ((equipe.reputation - levelInfo.repRequired) / (nextLevel.repRequired - levelInfo.repRequired)) * 100
    : 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      padding: '20px',
    }}>
      {/* Header avec logo et déconnexion */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ textAlign: 'center', flex: 2 }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 10px',
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 25px ${COLORS.cardShadow}`,
            animation: 'float 3s ease-in-out infinite',
          }}>
            <svg width="35" height="35" viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L50 45 M35 30 L65 30" stroke="white" strokeWidth="8" strokeLinecap="round"/>
              <path d="M30 55 Q30 90 50 90 Q70 90 70 55 L70 50 L30 50 Z" fill="white" opacity="0.9"/>
              <circle cx="42" cy="65" r="5" fill={COLORS.primaryLight}/>
              <circle cx="58" cy="70" r="4" fill={COLORS.primary}/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: '1.4rem',
            color: COLORS.primaryDark,
            textShadow: `1px 1px 0 ${COLORS.secondary}`,
          }}>
            Le Laboratoire Fabuleux
          </h1>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.textLight,
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            Changer<br/>d'équipe
          </button>
        </div>
      </div>

      <p style={{ color: COLORS.textLight, fontSize: '0.85rem', textAlign: 'center', marginBottom: '20px' }}>
        {classeInfo?.name} • Équipe {equipe.numero} • {classeInfo?.anneeScolaire}
      </p>

      {/* Carte équipe */}
      <div style={{
        background: COLORS.white,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: `0 8px 30px ${COLORS.cardShadow}`,
        border: `2px solid ${COLORS.cardBorder}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              color: COLORS.white,
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '700',
              display: 'inline-block',
              marginBottom: '8px',
            }}>
              Équipe {equipe.numero}
            </div>
            <h2 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>
              {levelInfo.title}
            </h2>
            <p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>
              Niveau {equipe.level}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: COLORS.success }}>
              {equipe.budget}€
            </div>
            <div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Budget</div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: COLORS.textLight }}>
              Réputation: {equipe.reputation} pts
            </span>
            {nextLevel && (
              <span style={{ fontSize: '0.8rem', color: COLORS.primaryLight }}>
                → {nextLevel.title}
              </span>
            )}
          </div>
          <div style={{
            height: '10px',
            background: COLORS.secondary,
            borderRadius: '5px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(progressToNext, 100)}%`,
              background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              borderRadius: '5px',
              transition: 'width 0.5s ease',
            }}/>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            flex: 1,
            background: '#E3F2FD',
            padding: '10px',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.primary }}>
              {equipe.reputationDecouvertes}
            </div>
            <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>🔍 Découvertes</div>
          </div>
          <div style={{
            flex: 1,
            background: '#F3E5F5',
            padding: '10px',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#7B1FA2' }}>
              {equipe.reputationRaisonnement}
            </div>
            <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>🧠 Raisonnement</div>
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {[
          { id: 'catalogue', icon: MedicalIcons.flask, label: 'Catalogue', color: COLORS.primary },
          { id: 'mes-ressources', icon: MedicalIcons.book, label: 'Mes Ressources', color: '#4CAF50' },
          { id: 'fiche', icon: MedicalIcons.user, label: 'Mon Équipe', color: '#FF9800' },
          { id: 'aide', icon: MedicalIcons.help, label: 'Aide', color: '#9C27B0' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: COLORS.white,
              border: `2px solid ${COLORS.cardBorder}`,
              borderRadius: '16px',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
            }}
          >
            <div style={{ color: item.color }}>{item.icon}</div>
            <span style={{ color: COLORS.text, fontWeight: '600', fontSize: '0.9rem' }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// CARTE RESSOURCE
// ============================================
const ResourceCard = ({ resource, equipe, onPurchase }) => {
  const isOwned = equipe.purchasedResources.includes(resource.id);
  const canAfford = equipe.budget >= resource.price;
  const hasAccess = equipe.level >= resource.level;
  const canBuy = !isOwned && canAfford && hasAccess;

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: '16px',
      padding: '16px',
      boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
      border: `2px solid ${isOwned ? COLORS.success : COLORS.cardBorder}`,
      opacity: hasAccess ? 1 : 0.6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <h4 style={{ color: COLORS.primaryDark, fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>
            {resource.title}
          </h4>
          <p style={{ color: COLORS.textLight, fontSize: '0.8rem', lineHeight: '1.4' }}>
            {resource.description}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: isOwned ? COLORS.success : COLORS.warning }}>
            {resource.price}€
          </div>
          {resource.inClass && (
            <div style={{ fontSize: '0.65rem', color: COLORS.textLight, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
              <span style={{ color: COLORS.primary }}>{MedicalIcons.school}</span>
              En classe
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {isOwned ? (
          <>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              background: '#E8F5E9',
              borderRadius: '10px',
              color: COLORS.success,
              fontWeight: '600',
              fontSize: '0.85rem',
            }}>
              {MedicalIcons.check} Acheté
            </div>
            {resource.link && (
              <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{
                padding: '10px 16px',
                background: COLORS.primary,
                color: COLORS.white,
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                Ouvrir {MedicalIcons.external}
              </a>
            )}
          </>
        ) : (
          <button
            onClick={() => canBuy && onPurchase(resource.id)}
            disabled={!canBuy}
            style={{
              flex: 1,
              padding: '12px',
              background: canBuy ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)` : '#E0E0E0',
              color: canBuy ? COLORS.white : '#9E9E9E',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: canBuy ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {!hasAccess ? <>{MedicalIcons.lock} Niveau {resource.level} requis</> : !canAfford ? <>Budget insuffisant</> : <>{MedicalIcons.cart} Acheter</>}
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// PAGE CATALOGUE
// ============================================
const CataloguePage = ({ equipe, onBack, onPurchase }) => {
  const gameStore = getGameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState(0);

  const resources = gameStore.getResources();

  const filteredResources = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = filterLevel === 0 || r.level === filterLevel;
    return matchSearch && matchLevel;
  });

  const groupedByLevel = [1, 2, 3, 4].map(level => ({
    level,
    resources: filteredResources.filter(r => r.level === level),
  })).filter(g => g.resources.length > 0);

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Catalogue des Ressources</h1>
        </div>
        <input type="text" placeholder="🔍 Rechercher une ressource..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `2px solid ${COLORS.cardBorder}`, fontSize: '0.9rem', marginBottom: '12px' }}/>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[0, 1, 2, 3, 4].map(level => (
            <button key={level} onClick={() => setFilterLevel(level)} style={{ padding: '8px 14px', borderRadius: '20px', border: 'none', background: filterLevel === level ? COLORS.primary : COLORS.secondary, color: filterLevel === level ? COLORS.white : COLORS.text, fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              {level === 0 ? 'Tous' : `Niv. ${level}`}{level > 0 && level > equipe.level && ' 🔒'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {groupedByLevel.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textLight }}>Aucune ressource trouvée</div>
        ) : (
          groupedByLevel.map(({ level, resources: levelResources }) => {
            const lc = LEVEL_CONFIG[level];
            const isLocked = level > equipe.level;
            return (
              <div key={level} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '10px 14px', background: isLocked ? '#F5F5F5' : COLORS.white, borderRadius: '12px', border: `2px solid ${isLocked ? '#E0E0E0' : COLORS.cardBorder}` }}>
                  <span style={{ background: isLocked ? '#E0E0E0' : COLORS.primary, color: isLocked ? '#9E9E9E' : COLORS.white, padding: '4px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700' }}>{isLocked && '🔒 '}Niv. {level}</span>
                  <span style={{ color: COLORS.primaryDark, fontWeight: '600', flex: 1 }}>{lc.title}</span>
                  <span style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>{levelResources.length} ressource{levelResources.length > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {levelResources.map(resource => (<ResourceCard key={resource.id} resource={resource} equipe={equipe} onPurchase={onPurchase}/>))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============================================
// PAGE MES RESSOURCES
// ============================================
const MesRessourcesPage = ({ equipe, onBack }) => {
  const gameStore = getGameStore();
  const purchasedResources = equipe.purchasedResources.map(id => gameStore.getResource(id)).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Mes Ressources</h1>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {purchasedResources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.textLight }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <p>Vous n'avez pas encore acheté de ressources.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Rendez-vous dans le catalogue pour commencer vos recherches !</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {purchasedResources.map(resource => (
              <div key={resource.id} style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${COLORS.success}` }}>
                <h4 style={{ color: COLORS.primaryDark, fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px' }}>{resource.title}</h4>
                <p style={{ color: COLORS.textLight, fontSize: '0.8rem', marginBottom: '12px' }}>{resource.description}</p>
                {resource.link ? (
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: COLORS.primary, color: COLORS.white, borderRadius: '10px', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' }}>Accéder à la ressource {MedicalIcons.external}</a>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#E3F2FD', color: COLORS.primary, borderRadius: '10px', fontWeight: '600', fontSize: '0.85rem' }}>{MedicalIcons.school} Disponible en classe</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// PAGE FICHE ÉQUIPE (avec édition des membres)
// ============================================
const FichePage = ({ equipe, classeInfo, onBack, onUpdateMembres }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMembres, setEditedMembres] = useState([...equipe.membres]);
  const [notification, setNotification] = useState(null);
  
  const levelInfo = LEVEL_CONFIG[equipe.level];
  const avatars = ['👨‍⚕️', '👩‍⚕️', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🥼', '🔬', '🧬'];
  const randomAvatar = avatars[equipe.numero % avatars.length];

  // Icône stylo pour édition
  const EditIcon = (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
      <path d="M70 15 L85 30 L35 80 L15 85 L20 65 Z" stroke="currentColor" strokeWidth="6" fill="none" strokeLinejoin="round"/>
      <path d="M60 25 L75 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );

  // Icône plus pour ajouter
  const PlusIcon = (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    </svg>
  );

  // Icône poubelle pour supprimer
  const TrashIcon = (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <path d="M25 30 L75 30 L70 85 L30 85 Z" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M20 30 L80 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      <path d="M40 20 L60 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      <path d="M40 45 L40 70 M50 45 L50 70 M60 45 L60 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );

  const handleStartEdit = () => {
    setEditedMembres([...equipe.membres]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedMembres([...equipe.membres]);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Filtrer les membres vides
    const filteredMembres = editedMembres.filter(m => m.trim() !== '');
    
    if (filteredMembres.length === 0) {
      setNotification({ type: 'error', message: 'L\'équipe doit avoir au moins un membre !' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (filteredMembres.length > 5) {
      setNotification({ type: 'error', message: 'Maximum 5 membres par équipe !' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    onUpdateMembres(filteredMembres);
    setIsEditing(false);
    setNotification({ type: 'success', message: 'Membres mis à jour !' });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleMemberChange = (index, value) => {
    const newMembres = [...editedMembres];
    newMembres[index] = value;
    setEditedMembres(newMembres);
  };

  const handleAddMember = () => {
    if (editedMembres.length >= 5) {
      setNotification({ type: 'error', message: 'Maximum 5 membres par équipe !' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setEditedMembres([...editedMembres, '']);
  };

  const handleRemoveMember = (index) => {
    if (editedMembres.length <= 1) {
      setNotification({ type: 'error', message: 'L\'équipe doit avoir au moins un membre !' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const newMembres = editedMembres.filter((_, i) => i !== index);
    setEditedMembres(newMembres);
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'success' ? COLORS.success : COLORS.error,
          color: COLORS.white,
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          zIndex: 200,
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        }}>
          {notification.type === 'success' ? '✓' : '⚠️'} {notification.message}
        </div>
      )}

      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Fiche d'Équipe</h1>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ background: COLORS.white, borderRadius: '24px', padding: '24px', boxShadow: `0 10px 40px ${COLORS.cardShadow}`, border: `3px solid ${COLORS.cardBorder}`, textAlign: 'center' }}>
          {/* Avatar */}
          <div style={{ width: '100px', height: '100px', margin: '0 auto 16px', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', boxShadow: `0 8px 25px ${COLORS.cardShadow}` }}>{randomAvatar}</div>
          
          {/* Classe */}
          <div style={{ background: COLORS.secondary, padding: '8px 16px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>
            <span style={{ color: COLORS.primaryDark, fontWeight: '600', fontSize: '0.9rem' }}>{classeInfo?.name} • {classeInfo?.anneeScolaire}</span>
          </div>
          
          <h2 style={{ color: COLORS.primaryDark, fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Équipe {equipe.numero}</h2>
          
          {/* Niveau */}
          <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`, color: COLORS.white, padding: '12px 24px', borderRadius: '16px', display: 'inline-block', marginBottom: '20px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>Niveau {equipe.level} - {levelInfo.title}</div>
          </div>
          
          {/* Section Membres */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
              <h3 style={{ color: COLORS.textLight, fontSize: '0.85rem', margin: 0 }}>Membres de l'équipe</h3>
              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  style={{
                    background: COLORS.secondary,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {EditIcon} Modifier
                </button>
              )}
            </div>

            {isEditing ? (
              /* Mode édition */
              <div style={{ textAlign: 'left' }}>
                {editedMembres.map((membre, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={membre}
                      onChange={(e) => handleMemberChange(i, e.target.value)}
                      placeholder="Prénom Nom"
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: `2px solid ${COLORS.cardBorder}`,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => handleRemoveMember(i)}
                      style={{
                        background: '#FFEBEE',
                        border: '2px solid #FFCDD2',
                        borderRadius: '10px',
                        padding: '10px',
                        cursor: 'pointer',
                        color: '#C62828',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {TrashIcon}
                    </button>
                  </div>
                ))}

                {/* Bouton ajouter membre */}
                {editedMembres.length < 5 && (
                  <button
                    onClick={handleAddMember}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#E8F5E9',
                      border: '2px dashed #4CAF50',
                      borderRadius: '12px',
                      color: '#4CAF50',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    {PlusIcon} Ajouter un membre
                  </button>
                )}

                {/* Boutons Sauvegarder / Annuler */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: COLORS.white,
                      border: `2px solid ${COLORS.cardBorder}`,
                      borderRadius: '12px',
                      color: COLORS.textLight,
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: `linear-gradient(135deg, ${COLORS.success} 0%, #66BB6A 100%)`,
                      border: 'none',
                      borderRadius: '12px',
                      color: COLORS.white,
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Sauvegarder
                  </button>
                </div>
              </div>
            ) : (
              /* Mode affichage */
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {equipe.membres.map((membre, i) => (
                  <span key={i} style={{ background: COLORS.secondary, color: COLORS.primaryDark, padding: '8px 14px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600' }}>{membre}</span>
                ))}
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: '#E8F5E9', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: COLORS.success }}>{equipe.budget}€</div>
              <div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Budget</div>
            </div>
            <div style={{ background: '#E3F2FD', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: COLORS.primary }}>{equipe.reputation}</div>
              <div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Réputation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PAGE AIDE
// ============================================
const AidePage = ({ onBack }) => {
  const helpItems = [
    { title: '🎮 Comment jouer ?', content: 'Votre équipe doit résoudre des problèmes scientifiques sur la digestion. Achetez des ressources pour avancer dans vos recherches !' },
    { title: '⭐ Gagner de la réputation', content: 'Votre enseignant vous attribue des points de Découverte (🔍) et de Raisonnement (🧠). Accumulez 5 points pour passer au niveau suivant !' },
    { title: '📈 Progression des niveaux', content: 'Niveau 1 (Stagiaire): 100€ • Niveau 2 (Interne): 200€ • Niveau 3 (Résident): 500€ • Niveau 4 (Spécialiste): 1000€' },
    { title: '🔓 Débloquer des ressources', content: 'Chaque niveau débloque de nouvelles catégories de ressources plus avancées et plus détaillées.' },
    { title: '💡 Conseil', content: 'Gérez bien votre budget ! Certaines ressources coûtent cher mais sont très utiles pour résoudre les problèmes.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Aide & Règles du Jeu</h1>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {helpItems.map((item, i) => (
          <div key={i} style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${COLORS.cardBorder}` }}>
            <h3 style={{ color: COLORS.primaryDark, fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
            <p style={{ color: COLORS.textLight, fontSize: '0.9rem', lineHeight: '1.5' }}>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// APPLICATION PRINCIPALE
// ============================================
export default function StudentApp() {
  const [step, setStep] = useState('select-class');
  const [selectedClass, setSelectedClass] = useState(null);
  const [equipeId, setEquipeId] = useState(null);
  const [page, setPage] = useState('home');
  const [equipe, setEquipe] = useState(null);
  const [classeInfo, setClasseInfo] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!equipeId) return;
    const gameStore = getGameStore();
    const loadData = () => {
      const e = gameStore.getEquipe(equipeId);
      setEquipe(e);
      if (e) setClasseInfo(gameStore.getClasseInfo(e.classeId));
    };
    loadData();
    return gameStore.subscribe(loadData);
  }, [equipeId]);

  const handleSelectClass = (classe) => {
    setSelectedClass(classe);
    setStep('select-team');
  };

  const handleSelectTeam = (teamId) => {
    setEquipeId(teamId);
    setStep('app');
  };

  const handleLogout = () => {
    setStep('select-class');
    setSelectedClass(null);
    setEquipeId(null);
    setEquipe(null);
    setPage('home');
  };

  const handlePurchase = (resourceId) => {
    const gameStore = getGameStore();
    const result = gameStore.purchaseResource(equipeId, resourceId);
    if (result.success) {
      setNotification({ type: 'success', message: `"${result.resource.title}" acheté !` });
    } else {
      setNotification({ type: 'error', message: result.error });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateMembres = (newMembres) => {
    const gameStore = getGameStore();
    gameStore.updateEquipe(equipeId, { membres: newMembres });
  };

  if (step === 'select-class') {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Nunito', 'Segoe UI', sans-serif", boxShadow: '0 0 60px rgba(0,0,0,0.1)' }}>
        <ClassSelectionPage onSelectClass={handleSelectClass} />
      </div>
    );
  }

  if (step === 'select-team') {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Nunito', 'Segoe UI', sans-serif", boxShadow: '0 0 60px rgba(0,0,0,0.1)' }}>
        <TeamSelectionPage classe={selectedClass} onSelectTeam={handleSelectTeam} onBack={() => setStep('select-class')}/>
      </div>
    );
  }

  if (!equipe) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: COLORS.textLight }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Nunito', 'Segoe UI', sans-serif", position: 'relative', boxShadow: '0 0 60px rgba(0,0,0,0.1)' }}>
      {notification && (
        <div className="notification" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: notification.type === 'success' ? COLORS.success : COLORS.error, color: COLORS.white, padding: '14px 28px', borderRadius: '14px', fontWeight: '700', zIndex: 1000, boxShadow: '0 8px 30px rgba(0,0,0,0.25)', fontSize: '0.95rem', maxWidth: '90%', textAlign: 'center' }}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}

      {page === 'home' && <HomePage equipe={equipe} classeInfo={classeInfo} onNavigate={setPage} onLogout={handleLogout} />}
      {page === 'catalogue' && <CataloguePage equipe={equipe} onBack={() => setPage('home')} onPurchase={handlePurchase} />}
      {page === 'mes-ressources' && <MesRessourcesPage equipe={equipe} onBack={() => setPage('home')} />}
      {page === 'fiche' && <FichePage equipe={equipe} classeInfo={classeInfo} onBack={() => setPage('home')} onUpdateMembres={handleUpdateMembres} />}
      {page === 'aide' && <AidePage onBack={() => setPage('home')} />}
    </div>
  );
}
