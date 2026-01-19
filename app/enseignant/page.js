'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGameStore, COLORS, LEVEL_CONFIG } from '@/lib/gameStore';

// ============================================
// ICÔNE RETOUR
// ============================================
const BackIcon = (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
    <path d="M60 20 L30 50 L60 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// ============================================
// PAGE SÉLECTION DE CLASSE
// ============================================
const ClassSelectionPage = ({ onSelectClass }) => {
  const gameStore = getGameStore();
  const classes = gameStore.getClasses();

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
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 10px 30px ${COLORS.cardShadow}`,
        }}>
          <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
            <rect x="15" y="25" width="70" height="50" rx="5" fill="white"/>
            <rect x="25" y="35" width="30" height="4" rx="2" fill={COLORS.primaryLight}/>
            <rect x="25" y="45" width="50" height="3" rx="1.5" fill="#B3E5FC"/>
            <rect x="25" y="53" width="40" height="3" rx="1.5" fill="#B3E5FC"/>
            <rect x="25" y="61" width="45" height="3" rx="1.5" fill="#B3E5FC"/>
            <circle cx="70" cy="40" r="12" fill={COLORS.primaryLight}/>
            <path d="M66 40 L69 43 L75 37" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: '1.8rem',
          color: COLORS.primaryDark,
          marginBottom: '8px',
        }}>
          Espace Enseignant
        </h1>
        <p style={{ color: COLORS.textLight, fontSize: '0.95rem' }}>
          Sélectionnez une classe pour gérer les équipes
        </p>
      </div>

      {/* Liste des classes */}
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
// CARTE ÉQUIPE
// ============================================
const EquipeCard = ({ equipe, onAddRep, onRemoveRep }) => {
  const levelInfo = LEVEL_CONFIG[equipe.level];
  const nextLevel = equipe.level < 4 ? LEVEL_CONFIG[equipe.level + 1] : null;
  const progressToNext = nextLevel 
    ? ((equipe.reputation - levelInfo.repRequired) / (nextLevel.repRequired - levelInfo.repRequired)) * 100
    : 100;

  // Abréger les noms
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
      {/* En-tête */}
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

      {/* Barre de progression */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: COLORS.textLight }}>
            {equipe.reputation} / {nextLevel ? nextLevel.repRequired : levelInfo.repRequired} pts
          </span>
          {nextLevel && (
            <span style={{ fontSize: '0.7rem', color: COLORS.primaryLight }}>
              → {nextLevel.title}
            </span>
          )}
        </div>
      </div>

      {/* Boutons de points */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Découvertes */}
        <div style={{
          flex: 1,
          background: '#E3F2FD',
          borderRadius: '12px',
          padding: '10px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '0.75rem', color: COLORS.primary, fontWeight: '600' }}>
              🔍 Découverte
            </span>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: '800', 
              color: COLORS.primary,
              minWidth: '24px',
              textAlign: 'center',
            }}>
              {equipe.reputationDecouvertes}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onRemoveRep(equipe.id, 'decouvertes')}
              disabled={equipe.reputationDecouvertes === 0}
              style={{
                flex: 1,
                padding: '8px',
                background: equipe.reputationDecouvertes > 0 ? COLORS.white : '#E0E0E0',
                border: `2px solid ${equipe.reputationDecouvertes > 0 ? COLORS.primary : '#BDBDBD'}`,
                borderRadius: '8px',
                color: equipe.reputationDecouvertes > 0 ? COLORS.primary : '#9E9E9E',
                fontWeight: '800',
                fontSize: '1.1rem',
                cursor: equipe.reputationDecouvertes > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              −
            </button>
            <button
              onClick={() => onAddRep(equipe.id, 'decouvertes')}
              style={{
                flex: 1,
                padding: '8px',
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                border: 'none',
                borderRadius: '8px',
                color: COLORS.white,
                fontWeight: '800',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Raisonnement */}
        <div style={{
          flex: 1,
          background: '#F3E5F5',
          borderRadius: '12px',
          padding: '10px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#7B1FA2', fontWeight: '600' }}>
              🧠 Raisonnement
            </span>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: '800', 
              color: '#7B1FA2',
              minWidth: '24px',
              textAlign: 'center',
            }}>
              {equipe.reputationRaisonnement}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onRemoveRep(equipe.id, 'raisonnement')}
              disabled={equipe.reputationRaisonnement === 0}
              style={{
                flex: 1,
                padding: '8px',
                background: equipe.reputationRaisonnement > 0 ? COLORS.white : '#E0E0E0',
                border: `2px solid ${equipe.reputationRaisonnement > 0 ? '#7B1FA2' : '#BDBDBD'}`,
                borderRadius: '8px',
                color: equipe.reputationRaisonnement > 0 ? '#7B1FA2' : '#9E9E9E',
                fontWeight: '800',
                fontSize: '1.1rem',
                cursor: equipe.reputationRaisonnement > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              −
            </button>
            <button
              onClick={() => onAddRep(equipe.id, 'raisonnement')}
              style={{
                flex: 1,
                padding: '8px',
                background: 'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)',
                border: 'none',
                borderRadius: '8px',
                color: COLORS.white,
                fontWeight: '800',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              +
            </button>
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
      message: `+1 ${type === 'decouvertes' ? '🔍 Découverte' : '🧠 Raisonnement'} pour l'équipe ${equipe.numero}`,
    });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleRemoveRep = (equipeId, type) => {
    gameStore.removeReputation(equipeId, type);
    const equipe = gameStore.getEquipe(equipeId);
    setNotification({
      type: 'info',
      message: `-1 ${type === 'decouvertes' ? '🔍 Découverte' : '🧠 Raisonnement'} pour l'équipe ${equipe.numero}`,
    });
    setTimeout(() => setNotification(null), 2000);
  };

  const totalRep = equipes.reduce((sum, e) => sum + e.reputation, 0);
  const avgLevel = equipes.length > 0 
    ? (equipes.reduce((sum, e) => sum + e.level, 0) / equipes.length).toFixed(1)
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
    }}>
      {/* Header sticky */}
      <div style={{
        background: COLORS.white,
        padding: '16px 20px',
        borderBottom: `2px solid ${COLORS.cardBorder}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button onClick={onBack} style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: COLORS.primary,
          }}>
            {BackIcon}
          </button>
          <div>
            <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>
              {classe.name}
            </h1>
            <p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>
              {classe.anneeScolaire}
            </p>
          </div>
        </div>

        {/* Stats de la classe */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            flex: 1,
            background: COLORS.secondary,
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.primary }}>
              {totalRep}
            </div>
            <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>pts total</div>
          </div>
          <div style={{
            flex: 1,
            background: '#E8F5E9',
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.success }}>
              {avgLevel}
            </div>
            <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>niv. moyen</div>
          </div>
          <div style={{
            flex: 1,
            background: '#FFF3E0',
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.warning }}>
              {equipes.length}
            </div>
            <div style={{ fontSize: '0.7rem', color: COLORS.textLight }}>équipes</div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'success' ? COLORS.success : COLORS.primary,
          color: COLORS.white,
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          zIndex: 200,
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          animation: 'slideDown 0.3s ease-out',
        }}>
          {notification.message}
        </div>
      )}

      {/* Liste des équipes */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {equipes.map(equipe => (
            <EquipeCard
              key={equipe.id}
              equipe={equipe}
              onAddRep={handleAddRep}
              onRemoveRep={handleRemoveRep}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// APPLICATION PRINCIPALE
// ============================================
export default function TeacherApp() {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '100vh',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      position: 'relative',
      boxShadow: '0 0 60px rgba(0,0,0,0.1)',
    }}>
      {selectedClass ? (
        <TeamManagementPage
          classe={selectedClass}
          onBack={() => setSelectedClass(null)}
        />
      ) : (
        <ClassSelectionPage onSelectClass={setSelectedClass} />
      )}
    </div>
  );
}
