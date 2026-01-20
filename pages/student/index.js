import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gameStore } from '../../stores/GameStore';
import { COLORS, LEVEL_CONFIG } from '../../lib/theme';
import { MedicalIcons } from '../../components/MedicalIcons';

export default function StudentHome() {
  const router = useRouter();
  const [step, setStep] = useState('select-class');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const classList = await gameStore.listClasses();
      setClasses(classList);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async (cls) => {
    setLoading(true);
    try {
      await gameStore.loadClass(cls.id);
      setSelectedClass(cls);
      
      // S'abonner aux changements
      gameStore.subscribe((state) => {
        setTeams(state.teams || []);
        setLoading(false);
      });
    } catch (error) {
      alert('Erreur : ' + error.message);
      setLoading(false);
    }
  };

  const handleSelectTeam = (team) => {
    router.push(`/student/team?id=${team.id}`);
  };

  const handleBack = () => {
    setSelectedClass(null);
    setStep('select-class');
  };

  if (loading && step === 'select-class') {
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
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      minHeight: '100vh', 
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      boxShadow: '0 0 60px rgba(0,0,0,0.1)'
    }}>
      {!selectedClass ? (
        // Page de sélection de classe
        <ClassSelectionPage 
          classes={classes}
          onSelectClass={handleSelectClass}
        />
      ) : (
        // Page de sélection d'équipe
        <TeamSelectionPage
          classe={selectedClass}
          teams={teams}
          loading={loading}
          onSelectTeam={handleSelectTeam}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

// ============================================
// PAGE DE SÉLECTION DE CLASSE
// ============================================
function ClassSelectionPage({ classes, onSelectClass }) {
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

      {/* Liste des classes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
        {classes.map(classe => {
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
                  {classe.class_name}
                </h2>
                <p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>
                  {classe.school_year}
                </p>
              </div>
              <div style={{
                background: COLORS.secondary,
                padding: '10px 12px',
                borderRadius: '12px',
                color: COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                {MedicalIcons.school}
              </div>
            </button>
          );
        })}
        {classes.length === 0 && (
          <div style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center',
            border: `2px solid ${COLORS.cardBorder}`,
          }}>
            <p style={{ color: COLORS.textLight, fontSize: '1rem' }}>
              Aucune classe disponible.
              <br />
              <br />
              Demande à ton enseignant de créer une classe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// PAGE DE SÉLECTION D'ÉQUIPE
// ============================================
function TeamSelectionPage({ classe, teams, loading, onSelectTeam, onBack }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: COLORS.primary,
            }}
          >
            {MedicalIcons.back}
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>
              {classe.class_name}
            </h1>
            <p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>
              {classe.school_year}
            </p>
          </div>
        </div>
        <p style={{ color: COLORS.primary, fontSize: '0.95rem', fontWeight: '600' }}>
          Sélectionne ton équipe
        </p>
      </div>

      {/* Liste des équipes */}
      <div style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: COLORS.textLight }}>Chargement...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
            {teams.map(team => {
              const members = JSON.parse(team.members || '[]');
              const totalRep = (team.discovery_points || 0) + (team.reasoning_points || 0);
              const level = team.level || 1;
              const levelInfo = LEVEL_CONFIG[level];

              return (
                <button
                  key={team.id}
                  onClick={() => onSelectTeam(team)}
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
                  {/* Numéro et niveau */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '800' }}>
                      Équipe {team.team_number}
                    </h3>
                    <div style={{
                      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                      color: COLORS.white,
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                    }}>
                      {levelInfo.title}
                    </div>
                  </div>

                  {/* Membres */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {members.map((member, i) => (
                        <span
                          key={i}
                          style={{
                            background: COLORS.secondary,
                            color: COLORS.primaryDark,
                            padding: '6px 12px',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                          }}
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{
                      background: '#E8F5E9',
                      padding: '10px',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: COLORS.success }}>
                        {team.budget}€
                      </div>
                      <div style={{ color: COLORS.textLight, fontSize: '0.7rem' }}>Budget</div>
                    </div>
                    <div style={{
                      background: '#E3F2FD',
                      padding: '10px',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: COLORS.primary }}>
                        {totalRep}
                      </div>
                      <div style={{ color: COLORS.textLight, fontSize: '0.7rem' }}>Réputation</div>
                    </div>
                  </div>
                </button>
              );
            })}
            {teams.length === 0 && (
              <div style={{
                background: COLORS.white,
                borderRadius: '16px',
                padding: '30px',
                textAlign: 'center',
                border: `2px solid ${COLORS.cardBorder}`,
              }}>
                <p style={{ color: COLORS.textLight, fontSize: '1rem' }}>
                  Aucune équipe dans cette classe.
                  <br />
                  <br />
                  Demande à ton enseignant de créer des équipes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
