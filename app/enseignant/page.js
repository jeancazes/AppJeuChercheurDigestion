'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getGameStore, COLORS, LEVEL_CONFIG } from '@/lib/gameStore';

// ============================================
// CODE PIN SECRET
// ============================================
const SECRET_CODE = '1447';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 20 * 60 * 1000;

// ============================================
// ICÔNES
// ============================================
const Icons = {
  back: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path d="M60 20 L30 50 L60 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  edit: (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
      <path d="M70 15 L85 30 L35 80 L15 85 L20 65 Z" stroke="currentColor" strokeWidth="6" fill="none" strokeLinejoin="round"/>
      <path d="M60 25 L75 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  ),
  trash: (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
      <path d="M25 30 L75 30 L70 85 L30 85 Z" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M20 30 L80 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      <path d="M40 20 L60 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      <path d="M40 45 L40 70 M50 45 L50 70 M60 45 L60 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  plus: (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
      <circle cx="42" cy="42" r="25" stroke="currentColor" strokeWidth="6" fill="none"/>
      <path d="M60 60 L80 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  ),
  sort: (
    <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
      <path d="M30 35 L50 15 L70 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M30 65 L50 85 L70 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  sortUp: (
    <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
      <path d="M30 60 L50 30 L70 60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  sortDown: (
    <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
      <path d="M30 40 L50 70 L70 40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  database: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="25" rx="35" ry="12" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M15 25 L15 75 Q15 87 50 87 Q85 87 85 75 L85 25" stroke="currentColor" strokeWidth="5" fill="none"/>
      <ellipse cx="50" cy="50" rx="35" ry="12" stroke="currentColor" strokeWidth="5" fill="none"/>
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <path d="M40 60 L60 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <path d="M45 70 L30 85 Q15 85 15 70 L15 55 Q15 40 30 40 L40 40" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M55 30 L70 15 Q85 15 85 30 L85 45 Q85 60 70 60 L60 60" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  school: (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <path d="M10 40 L50 20 L90 40 L50 60 Z" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M25 50 L25 75 Q50 85 75 75 L75 50" stroke="currentColor" strokeWidth="5" fill="none"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path d="M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    </svg>
  ),
};

// ============================================
// PAGE DE SAISIE DU CODE PIN
// ============================================
const PinCodePage = ({ onSuccess, onBack }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const storedLockout = localStorage.getItem('teacherLockout');
    const storedAttempts = localStorage.getItem('teacherAttempts');
    
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout);
      if (Date.now() < lockoutTime) {
        setIsLocked(true);
        setLockoutEndTime(lockoutTime);
      } else {
        localStorage.removeItem('teacherLockout');
        localStorage.removeItem('teacherAttempts');
      }
    }
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, []);

  useEffect(() => {
    if (!isLocked || !lockoutEndTime) return;

    const updateTimer = () => {
      const remaining = lockoutEndTime - Date.now();
      if (remaining <= 0) {
        setIsLocked(false);
        setLockoutEndTime(null);
        setAttempts(0);
        localStorage.removeItem('teacherLockout');
        localStorage.removeItem('teacherAttempts');
      } else {
        setRemainingTime(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockoutEndTime]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (digit) => {
    if (isLocked) return;
    if (code.length < 4) {
      const newCode = code + digit;
      setCode(newCode);
      setError('');

      if (newCode.length === 4) {
        setTimeout(() => {
          if (newCode === SECRET_CODE) {
            localStorage.removeItem('teacherAttempts');
            onSuccess();
          } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem('teacherAttempts', newAttempts.toString());

            if (newAttempts >= MAX_ATTEMPTS) {
              const lockoutTime = Date.now() + LOCKOUT_DURATION;
              setIsLocked(true);
              setLockoutEndTime(lockoutTime);
              localStorage.setItem('teacherLockout', lockoutTime.toString());
              setError('Trop de tentatives ! Accès bloqué.');
            } else {
              setError(`Code incorrect. ${MAX_ATTEMPTS - newAttempts} essai${MAX_ATTEMPTS - newAttempts > 1 ? 's' : ''} restant${MAX_ATTEMPTS - newAttempts > 1 ? 's' : ''}.`);
            }
            setCode('');
          }
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    if (isLocked) return;
    setCode(code.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    if (isLocked) return;
    setCode('');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isLocked 
        ? 'linear-gradient(180deg, #FFEBEE 0%, #FFCDD2 100%)'
        : `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      padding: '20px',
      transition: 'background 0.5s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <button onClick={onBack} style={{
          background: 'none',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          color: isLocked ? '#C62828' : COLORS.primary,
        }}>
          {Icons.back}
        </button>
        <h1 style={{ 
          color: isLocked ? '#C62828' : COLORS.primaryDark, 
          fontSize: '1.3rem', 
          fontWeight: '800' 
        }}>
          Espace Enseignant
        </h1>
      </div>

      <div style={{ maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 20px',
          background: isLocked 
            ? 'linear-gradient(135deg, #C62828 0%, #E53935 100%)'
            : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isLocked 
            ? '0 10px 30px rgba(198, 40, 40, 0.3)'
            : `0 10px 30px ${COLORS.cardShadow}`,
          transition: 'all 0.3s ease',
        }}>
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
            <rect x="20" y="45" width="60" height="45" rx="8" stroke="white" strokeWidth="6" fill="none"/>
            <path d="M30 45 L30 30 Q30 10 50 10 Q70 10 70 30 L70 45" stroke="white" strokeWidth="6" fill="none"/>
            {!isLocked && <circle cx="50" cy="65" r="8" fill="white"/>}
            {isLocked && (
              <path d="M40 60 L60 75 M60 60 L40 75" stroke="white" strokeWidth="5" strokeLinecap="round"/>
            )}
          </svg>
        </div>

        <h2 style={{ 
          color: isLocked ? '#C62828' : COLORS.primaryDark, 
          fontSize: '1.2rem', 
          fontWeight: '700',
          marginBottom: '8px',
        }}>
          {isLocked ? 'Accès Bloqué' : 'Entrez le code'}
        </h2>

        {isLocked ? (
          <div style={{
            background: '#C62828',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '20px',
          }}>
            <p style={{ fontSize: '0.95rem', marginBottom: '12px' }}>
              ⛔ Trop de tentatives incorrectes.
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              Réessayez dans
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '800', marginTop: '8px' }}>
              {formatTime(remainingTime)}
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: COLORS.textLight, fontSize: '0.9rem', marginBottom: '24px' }}>
              Code à 4 chiffres requis
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}>
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: i < code.length ? COLORS.primary : COLORS.cardBorder,
                    transition: 'all 0.2s ease',
                    transform: i < code.length ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={{
                background: '#FFEBEE',
                color: '#C62828',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: '2px solid #FFCDD2',
              }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '16px',
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit.toString())}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: `3px solid ${COLORS.cardBorder}`,
                    background: COLORS.white,
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: COLORS.primaryDark,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
                    margin: '0 auto',
                  }}
                >
                  {digit}
                </button>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              <button
                onClick={handleClear}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: `3px solid #FFCDD2`,
                  background: '#FFEBEE',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#C62828',
                  cursor: 'pointer',
                  margin: '0 auto',
                }}
              >
                Effacer
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: `3px solid ${COLORS.cardBorder}`,
                  background: COLORS.white,
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: COLORS.primaryDark,
                  cursor: 'pointer',
                  boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
                  margin: '0 auto',
                }}
              >
                0
              </button>
              <button
                onClick={handleDelete}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: `3px solid ${COLORS.cardBorder}`,
                  background: COLORS.white,
                  color: COLORS.textLight,
                  cursor: 'pointer',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                  <path d="M85 25 L85 75 L40 75 L15 50 L40 25 Z" stroke="currentColor" strokeWidth="6" fill="none" strokeLinejoin="round"/>
                  <path d="M55 40 L70 55 M70 40 L55 55" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {!isLocked && attempts > 0 && (
          <p style={{ 
            color: '#FF9800', 
            fontSize: '0.8rem', 
            marginTop: '20px',
            fontWeight: '600',
          }}>
            ⚠️ {MAX_ATTEMPTS - attempts} tentative{MAX_ATTEMPTS - attempts > 1 ? 's' : ''} restante{MAX_ATTEMPTS - attempts > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================
// PAGE MENU PRINCIPAL ENSEIGNANT
// ============================================
const MainMenuPage = ({ onSelectOption, onLogout }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingTop: '10px' }}>
        <div style={{ width: '80px' }}></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 12px',
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 10px 30px ${COLORS.cardShadow}`,
          }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <rect x="15" y="25" width="70" height="50" rx="5" fill="white"/>
              <rect x="25" y="35" width="30" height="4" rx="2" fill={COLORS.primaryLight}/>
              <rect x="25" y="45" width="50" height="3" rx="1.5" fill="#B3E5FC"/>
              <rect x="25" y="53" width="40" height="3" rx="1.5" fill="#B3E5FC"/>
              <circle cx="70" cy="40" r="12" fill={COLORS.primaryLight}/>
              <path d="M66 40 L69 43 L75 37" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: '1.5rem',
            color: COLORS.primaryDark,
          }}>
            Espace Enseignant
          </h1>
        </div>
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
          🔒<br/>Déconnexion
        </button>
      </div>

      {/* Options du menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
        <button
          onClick={() => onSelectOption('classes')}
          style={{
            background: COLORS.white,
            border: `3px solid ${COLORS.cardBorder}`,
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: `0 6px 20px ${COLORS.cardShadow}`,
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.white,
          }}>
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <circle cx="35" cy="30" r="12" stroke="currentColor" strokeWidth="5" fill="none"/>
              <circle cx="65" cy="30" r="12" stroke="currentColor" strokeWidth="5" fill="none"/>
              <path d="M15 70 Q15 50 35 50 Q55 50 55 70" stroke="currentColor" strokeWidth="5" fill="none"/>
              <path d="M45 70 Q45 50 65 50 Q85 50 85 70" stroke="currentColor" strokeWidth="5" fill="none"/>
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>
              Gestion des Équipes
            </h2>
            <p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>
              Attribuer des points de réputation
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelectOption('resources')}
          style={{
            background: COLORS.white,
            border: `3px solid ${COLORS.cardBorder}`,
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: `0 6px 20px ${COLORS.cardShadow}`,
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.white,
          }}>
            {Icons.database}
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>
              Gestion des Ressources
            </h2>
            <p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>
              Ajouter, modifier, supprimer
            </p>
          </div>
        </button>
      </div>

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
// PAGE SÉLECTION DE CLASSE
// ============================================
const ClassSelectionPage = ({ onSelectClass, onBack }) => {
  const gameStore = getGameStore();
  const classes = gameStore.getClasses();

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <button onClick={onBack} style={{
          background: 'none',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          color: COLORS.primary,
        }}>
          {Icons.back}
        </button>
        <div>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>
            Gestion des Équipes
          </h1>
          <p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>
            Sélectionnez une classe
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {classes.map(classe => {
          const equipes = gameStore.getEquipesByClasse(classe.id);
          const totalRep = equipes.reduce((sum, e) => sum + e.reputation, 0);
          
          return (
            <button
              key={classe.id}
              onClick={() => onSelectClass(classe)}
              style={{
                background: COLORS.white,
                border: `2px solid ${COLORS.cardBorder}`,
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
                  {classe.anneeScolaire} • {equipes.length} équipe{equipes.length > 1 ? 's' : ''}
                </p>
              </div>
              <div style={{
                background: COLORS.secondary,
                padding: '10px 16px',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.primary }}>
                  {totalRep}
                </div>
                <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>pts total</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// CARTE ÉQUIPE
// ============================================
const EquipeCard = ({ equipe, onAddRep, onRemoveRep }) => {
  const levelInfo = LEVEL_CONFIG[equipe.level];
  const nextLevel = equipe.level < 4 ? LEVEL_CONFIG[equipe.level + 1] : null;
  const progressToNext = nextLevel 
    ? ((equipe.reputation - levelInfo.repRequired) / (nextLevel.repRequired - levelInfo.repRequired)) * 100
    : 100;

  const shortenName = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return name;
  };

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: '16px',
      padding: '16px',
      boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
      border: `2px solid ${COLORS.cardBorder}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              color: COLORS.white,
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '700',
            }}>
              Équipe {equipe.numero}
            </span>
            <span style={{
              background: COLORS.secondary,
              color: COLORS.primaryDark,
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}>
              Niv. {equipe.level} - {levelInfo.title}
            </span>
          </div>
          <p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>
            {equipe.membres.map(m => shortenName(m)).join(' • ')}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: COLORS.primary }}>
            {equipe.reputation}
          </div>
          <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>pts</div>
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{
          height: '6px',
          background: COLORS.secondary,
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(progressToNext, 100)}%`,
            background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: '3px',
            transition: 'width 0.3s ease',
          }}/>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, background: '#E3F2FD', borderRadius: '12px', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: COLORS.primary, fontWeight: '600' }}>🔍 Découverte</span>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: COLORS.primary }}>{equipe.reputationDecouvertes}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onRemoveRep(equipe.id, 'decouvertes')} disabled={equipe.reputationDecouvertes === 0}
              style={{
                flex: 1, padding: '8px',
                background: equipe.reputationDecouvertes > 0 ? COLORS.white : '#E0E0E0',
                border: `2px solid ${equipe.reputationDecouvertes > 0 ? COLORS.primary : '#BDBDBD'}`,
                borderRadius: '8px',
                color: equipe.reputationDecouvertes > 0 ? COLORS.primary : '#9E9E9E',
                fontWeight: '800', fontSize: '1.1rem',
                cursor: equipe.reputationDecouvertes > 0 ? 'pointer' : 'not-allowed',
              }}>−</button>
            <button onClick={() => onAddRep(equipe.id, 'decouvertes')}
              style={{
                flex: 1, padding: '8px',
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                border: 'none', borderRadius: '8px',
                color: COLORS.white, fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer',
              }}>+</button>
          </div>
        </div>

        <div style={{ flex: 1, background: '#F3E5F5', borderRadius: '12px', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#7B1FA2', fontWeight: '600' }}>🧠 Raisonnement</span>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#7B1FA2' }}>{equipe.reputationRaisonnement}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onRemoveRep(equipe.id, 'raisonnement')} disabled={equipe.reputationRaisonnement === 0}
              style={{
                flex: 1, padding: '8px',
                background: equipe.reputationRaisonnement > 0 ? COLORS.white : '#E0E0E0',
                border: `2px solid ${equipe.reputationRaisonnement > 0 ? '#7B1FA2' : '#BDBDBD'}`,
                borderRadius: '8px',
                color: equipe.reputationRaisonnement > 0 ? '#7B1FA2' : '#9E9E9E',
                fontWeight: '800', fontSize: '1.1rem',
                cursor: equipe.reputationRaisonnement > 0 ? 'pointer' : 'not-allowed',
              }}>−</button>
            <button onClick={() => onAddRep(equipe.id, 'raisonnement')}
              style={{
                flex: 1, padding: '8px',
                background: 'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)',
                border: 'none', borderRadius: '8px',
                color: COLORS.white, fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer',
              }}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PAGE GESTION DES ÉQUIPES
// ============================================
const TeamManagementPage = ({ classe, onBack }) => {
  const gameStore = getGameStore();
  const [equipes, setEquipes] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadEquipes = () => {
      setEquipes(gameStore.getEquipesByClasse(classe.id));
    };
    loadEquipes();
    return gameStore.subscribe(loadEquipes);
  }, [classe.id]);

  const handleAddRep = (equipeId, type) => {
    gameStore.addReputation(equipeId, type);
    const equipe = gameStore.getEquipe(equipeId);
    setNotification({
      type: 'success',
      message: `+1 ${type === 'decouvertes' ? '🔍' : '🧠'} équipe ${equipe.numero}`,
    });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleRemoveRep = (equipeId, type) => {
    gameStore.removeReputation(equipeId, type);
    const equipe = gameStore.getEquipe(equipeId);
    setNotification({
      type: 'info',
      message: `-1 ${type === 'decouvertes' ? '🔍' : '🧠'} équipe ${equipe.numero}`,
    });
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{
        background: COLORS.white,
        padding: '16px 20px',
        borderBottom: `2px solid ${COLORS.cardBorder}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>
            {Icons.back}
          </button>
          <div>
            <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>{classe.name}</h1>
            <p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>{classe.anneeScolaire}</p>
          </div>
        </div>
      </div>

      {notification && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          background: notification.type === 'success' ? COLORS.success : COLORS.primary,
          color: COLORS.white, padding: '12px 24px', borderRadius: '12px',
          fontWeight: '600', zIndex: 200, boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        }}>
          {notification.message}
        </div>
      )}

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {equipes.map(equipe => (
            <EquipeCard key={equipe.id} equipe={equipe} onAddRep={handleAddRep} onRemoveRep={handleRemoveRep} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MODAL ÉDITION RESSOURCE
// ============================================
const ResourceEditModal = ({ resource, onSave, onCancel, onDelete }) => {
  const gameStore = getGameStore();
  const types = gameStore.getResourceTypes();
  
  const [formData, setFormData] = useState({
    level: resource?.level || 1,
    type: resource?.type || '',
    title: resource?.title || '',
    description: resource?.description || '',
    price: resource?.price || 0,
    link: resource?.link || '',
    inClass: resource?.inClass || false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isNew = !resource;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: COLORS.white,
        borderRadius: '24px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: `2px solid ${COLORS.cardBorder}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: COLORS.white,
          borderRadius: '24px 24px 0 0',
        }}>
          <h2 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '800' }}>
            {isNew ? '➕ Nouvelle Ressource' : '✏️ Modifier Ressource'}
          </h2>
          <button onClick={onCancel} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: COLORS.textLight,
          }}>
            {Icons.close}
          </button>
        </div>

        {/* Formulaire */}
        <div style={{ padding: '20px' }}>
          {/* Titre */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: COLORS.text, marginBottom: '6px' }}>
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Titre de la ressource"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: `2px solid ${COLORS.cardBorder}`,
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: COLORS.text, marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la ressource"
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: `2px solid ${COLORS.cardBorder}`,
                fontSize: '0.95rem',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Type */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: COLORS.text, marginBottom: '6px' }}>
              Type / Catégorie
            </label>
            <input
              type="text"
              list="types-list"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              placeholder="Ex: Ressources anatomique, Aides..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: `2px solid ${COLORS.cardBorder}`,
                fontSize: '0.95rem',
              }}
            />
            <datalist id="types-list">
              {types.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>

          {/* Niveau et Prix */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: COLORS.text, marginBottom: '6px' }}>
                Niveau requis
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: `2px solid ${COLORS.cardBorder}`,
                  fontSize: '0.95rem',
                  background: COLORS.white,
                }}
              >
                <option value={1}>Niveau 1 - Stagiaire</option>
                <option value={2}>Niveau 2 - Interne</option>
                <option value={3}>Niveau 3 - Résident</option>
                <option value={4}>Niveau 4 - Spécialiste</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: COLORS.text, marginBottom: '6px' }}>
                Prix (€)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                min="0"
                step="10"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: `2px solid ${COLORS.cardBorder}`,
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          {/* Accès */}
          <div style={{
            background: COLORS.background,
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '16px',
          }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: COLORS.text, marginBottom: '12px' }}>
              Accès à la ressource
            </label>
            
            {/* Checkbox En classe */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.inClass}
                  onChange={(e) => handleChange('inClass', e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.text }}>
                  {Icons.school} Disponible en classe uniquement
                </span>
              </label>
            </div>

            {/* Lien externe */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: COLORS.textLight, marginBottom: '6px' }}>
                Ou lien externe (URL)
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: COLORS.primary }}>{Icons.link}</span>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                  placeholder="https://..."
                  disabled={formData.inClass}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: `2px solid ${COLORS.cardBorder}`,
                    fontSize: '0.9rem',
                    opacity: formData.inClass ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {!isNew && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: '14px 20px',
                  background: '#FFEBEE',
                  border: '2px solid #FFCDD2',
                  borderRadius: '12px',
                  color: '#C62828',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {Icons.trash}
              </button>
            )}
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '14px',
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
              onClick={handleSubmit}
              style={{
                flex: 2,
                padding: '14px',
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                border: 'none',
                borderRadius: '12px',
                color: COLORS.white,
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {isNew ? '➕ Ajouter' : '✓ Sauvegarder'}
            </button>
          </div>
        </div>

        {/* Confirmation suppression */}
        {showDeleteConfirm && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '24px',
          }}>
            <div style={{
              background: COLORS.white,
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              maxWidth: '300px',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
              <h3 style={{ color: COLORS.primaryDark, marginBottom: '8px' }}>Supprimer cette ressource ?</h3>
              <p style={{ color: COLORS.textLight, fontSize: '0.9rem', marginBottom: '20px' }}>
                Cette action est irréversible.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: COLORS.white,
                    border: `2px solid ${COLORS.cardBorder}`,
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#C62828',
                    border: 'none',
                    borderRadius: '10px',
                    color: COLORS.white,
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// PAGE GESTION DES RESSOURCES
// ============================================
const ResourceManagementPage = ({ onBack }) => {
  const gameStore = getGameStore();
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDir, setSortDir] = useState('asc');
  const [filterLevel, setFilterLevel] = useState(0);
  const [editingResource, setEditingResource] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadResources = () => {
      setResources(gameStore.getResources());
    };
    loadResources();
    return gameStore.subscribe(loadResources);
  }, []);

  // Filtrage et tri
  const filteredAndSortedResources = useMemo(() => {
    let result = [...resources];

    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.type.toLowerCase().includes(term)
      );
    }

    // Filtrer par niveau
    if (filterLevel > 0) {
      result = result.filter(r => r.level === filterLevel);
    }

    // Trier
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [resources, searchTerm, sortField, sortDir, filterLevel]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleSaveResource = (data) => {
    if (isAddingNew) {
      gameStore.addResource(data);
      setNotification({ type: 'success', message: 'Ressource ajoutée !' });
    } else {
      gameStore.updateResource(editingResource.id, data);
      setNotification({ type: 'success', message: 'Ressource modifiée !' });
    }
    setEditingResource(null);
    setIsAddingNew(false);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleDeleteResource = () => {
    if (editingResource) {
      gameStore.deleteResource(editingResource.id);
      setNotification({ type: 'info', message: 'Ressource supprimée' });
      setEditingResource(null);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '0.75rem',
        color: sortField === field ? COLORS.primary : COLORS.text,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 0',
      }}
    >
      {label}
      {sortField === field ? (sortDir === 'asc' ? Icons.sortUp : Icons.sortDown) : Icons.sort}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, #fff 100%)` }}>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        padding: '16px 20px',
        borderBottom: `2px solid ${COLORS.cardBorder}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>
              {Icons.back}
            </button>
            <div>
              <h1 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '800' }}>
                Gestion des Ressources
              </h1>
              <p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>
                {resources.length} ressources
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            style={{
              background: `linear-gradient(135deg, ${COLORS.success} 0%, #66BB6A 100%)`,
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              color: COLORS.white,
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {Icons.plus} Ajouter
          </button>
        </div>

        {/* Barre de recherche */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: COLORS.background,
            borderRadius: '10px',
            padding: '10px 14px',
            border: `2px solid ${COLORS.cardBorder}`,
          }}>
            <span style={{ color: COLORS.textLight }}>{Icons.search}</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(parseInt(e.target.value))}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: `2px solid ${COLORS.cardBorder}`,
              fontSize: '0.85rem',
              background: COLORS.white,
            }}
          >
            <option value={0}>Tous niveaux</option>
            <option value={1}>Niveau 1</option>
            <option value={2}>Niveau 2</option>
            <option value={3}>Niveau 3</option>
            <option value={4}>Niveau 4</option>
          </select>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '130px', left: '50%', transform: 'translateX(-50%)',
          background: notification.type === 'success' ? COLORS.success : COLORS.primary,
          color: COLORS.white, padding: '12px 24px', borderRadius: '12px',
          fontWeight: '600', zIndex: 200, boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        }}>
          {notification.message}
        </div>
      )}

      {/* Tableau */}
      <div style={{ padding: '16px', overflowX: 'auto' }}>
        <div style={{
          background: COLORS.white,
          borderRadius: '16px',
          boxShadow: `0 4px 20px ${COLORS.cardShadow}`,
          overflow: 'hidden',
          minWidth: '600px',
        }}>
          {/* En-têtes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 1fr 80px 70px 50px',
            gap: '8px',
            padding: '12px 16px',
            background: COLORS.secondary,
            borderBottom: `2px solid ${COLORS.cardBorder}`,
          }}>
            <SortButton field="level" label="Niv." />
            <SortButton field="title" label="Titre" />
            <SortButton field="type" label="Type" />
            <SortButton field="price" label="Prix" />
            <span></span>
          </div>

          {/* Lignes */}
          {filteredAndSortedResources.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: COLORS.textLight }}>
              Aucune ressource trouvée
            </div>
          ) : (
            filteredAndSortedResources.map((resource, index) => (
              <div
                key={resource.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 80px 70px 50px',
                  gap: '8px',
                  padding: '14px 16px',
                  borderBottom: index < filteredAndSortedResources.length - 1 ? `1px solid ${COLORS.cardBorder}` : 'none',
                  alignItems: 'center',
                  background: index % 2 === 0 ? COLORS.white : '#FAFAFA',
                }}
              >
                <span style={{
                  background: COLORS.primary,
                  color: COLORS.white,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                  {resource.level}
                </span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', color: COLORS.primaryDark, marginBottom: '2px' }}>
                    {resource.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: COLORS.textLight, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {resource.inClass && <span style={{ color: COLORS.primary }}>{Icons.school}</span>}
                    {resource.link && <span style={{ color: COLORS.primary }}>{Icons.link}</span>}
                    {resource.description.substring(0, 50)}{resource.description.length > 50 ? '...' : ''}
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: COLORS.textLight }}>
                  {resource.type.substring(0, 15)}{resource.type.length > 15 ? '...' : ''}
                </span>
                <span style={{ fontWeight: '700', color: COLORS.warning, fontSize: '0.85rem' }}>
                  {resource.price}€
                </span>
                <button
                  onClick={() => setEditingResource(resource)}
                  style={{
                    background: COLORS.secondary,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {Icons.edit}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal d'édition */}
      {(editingResource || isAddingNew) && (
        <ResourceEditModal
          resource={isAddingNew ? null : editingResource}
          onSave={handleSaveResource}
          onCancel={() => { setEditingResource(null); setIsAddingNew(false); }}
          onDelete={handleDeleteResource}
        />
      )}
    </div>
  );
};

// ============================================
// APPLICATION PRINCIPALE
// ============================================
export default function TeacherApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'classes', 'resources'
  const [selectedClass, setSelectedClass] = useState(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('menu');
    setSelectedClass(null);
  };

  // Écran de code PIN
  if (!isAuthenticated) {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '100vh',
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        boxShadow: '0 0 60px rgba(0,0,0,0.1)',
      }}>
        <PinCodePage 
          onSuccess={() => setIsAuthenticated(true)} 
          onBack={() => window.location.href = '/'}
        />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      position: 'relative',
      boxShadow: '0 0 60px rgba(0,0,0,0.1)',
    }}>
      {currentView === 'menu' && (
        <MainMenuPage 
          onSelectOption={(option) => setCurrentView(option)}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'classes' && !selectedClass && (
        <ClassSelectionPage 
          onSelectClass={setSelectedClass}
          onBack={() => setCurrentView('menu')}
        />
      )}
      
      {currentView === 'classes' && selectedClass && (
        <TeamManagementPage
          classe={selectedClass}
          onBack={() => setSelectedClass(null)}
        />
      )}
      
      {currentView === 'resources' && (
        <ResourceManagementPage
          onBack={() => setCurrentView('menu')}
        />
      )}
    </div>
  );
}
