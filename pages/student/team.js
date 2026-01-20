import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gameStore } from '../../stores/GameStore';
import { COLORS, LEVEL_CONFIG } from '../../lib/theme';
import { MedicalIcons } from '../../components/MedicalIcons';
import { RESOURCES } from '../../data/resources';

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [team, setTeam] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [purchasedResources, setPurchasedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadTeamData = (state) => {
      const foundTeam = state.teams.find(t => t.id === id);
      if (foundTeam) {
        setTeam(foundTeam);
        setPurchasedResources(state.purchasedResources[id] || []);
        if (state.selectedClass) {
          setClassInfo(state.selectedClass);
        }
      }
      setLoading(false);
    };

    gameStore.subscribe(loadTeamData);
  }, [id]);

  const handlePurchase = async (resourceId) => {
    const resource = RESOURCES.find(r => r.id === resourceId);
    if (!resource) return;

    // Vérifier si on peut acheter
    if (team.budget < resource.price) {
      setNotification({ type: 'error', message: 'Budget insuffisant !' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (purchasedResources.some(r => r.id === resourceId)) {
      setNotification({ type: 'error', message: 'Déjà acheté !' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      await gameStore.purchaseResource(id, resource);
      setNotification({ type: 'success', message: `"${resource.title}" acheté !` });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUpdateMembers = async (newMembers) => {
    try {
      await gameStore.updateTeam(id, { members: JSON.stringify(newMembers) });
      setNotification({ type: 'success', message: 'Membres mis à jour !' });
      setTimeout(() => setNotification(null), 2000);
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleLogout = () => {
    router.push('/student');
  };

  if (loading || !team) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: COLORS.textLight }}>Chargement...</p>
        </div>
      </div>
    );
  }

  const members = JSON.parse(team.members || '[]');
  const teamData = {
    ...team,
    membres: members,
    reputation: (team.discovery_points || 0) + (team.reasoning_points || 0),
    reputationDecouvertes: team.discovery_points || 0,
    reputationRaisonnement: team.reasoning_points || 0,
    purchasedResources: purchasedResources.map(r => r.id),
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '100vh',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      position: 'relative',
      boxShadow: '0 0 60px rgba(0,0,0,0.1)',
    }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'success' ? COLORS.success : COLORS.error,
          color: COLORS.white,
          padding: '14px 28px',
          borderRadius: '14px',
          fontWeight: '700',
          zIndex: 1000,
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          fontSize: '0.95rem',
          maxWidth: '90%',
          textAlign: 'center',
        }}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}

      {page === 'home' && <HomePage equipe={teamData} classeInfo={classInfo} onNavigate={setPage} onLogout={handleLogout} />}
      {page === 'catalogue' && <CataloguePage equipe={teamData} onBack={() => setPage('home')} onPurchase={handlePurchase} />}
      {page === 'mes-ressources' && <MesRessourcesPage equipe={teamData} purchasedResources={purchasedResources} onBack={() => setPage('home')} />}
      {page === 'fiche' && <FichePage equipe={teamData} classeInfo={classInfo} onBack={() => setPage('home')} onUpdateMembres={handleUpdateMembers} />}
      {page === 'aide' && <AidePage onBack={() => setPage('home')} />}
    </div>
  );
}

// ============================================
// PAGE D'ACCUEIL
// ============================================
function HomePage({ equipe, classeInfo, onNavigate, onLogout }) {
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
        {classeInfo?.class_name} • Équipe {equipe.team_number} • {classeInfo?.school_year}
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
              Équipe {equipe.team_number}
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
}

// ============================================
// CARTE RESSOURCE
// ============================================
function ResourceCard({ resource, equipe, onPurchase }) {
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
}

// ============================================
// PAGE CATALOGUE
// ============================================
function CataloguePage({ equipe, onBack, onPurchase }) {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredResources = RESOURCES.filter(r => {
    if (selectedLevel !== 'all' && r.level !== parseInt(selectedLevel)) return false;
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    return true;
  });

  const resourceTypes = [...new Set(RESOURCES.map(r => r.type))];

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
              Catalogue de Ressources
            </h1>
            <p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>
              {filteredResources.length} ressources disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ padding: '16px 20px', background: COLORS.white, borderBottom: `2px solid ${COLORS.cardBorder}` }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '0.8rem', color: COLORS.textLight, display: 'block', marginBottom: '6px' }}>
            Niveau :
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: `2px solid ${COLORS.cardBorder}`,
              fontSize: '0.9rem',
              fontWeight: '600',
              color: COLORS.text,
            }}
          >
            <option value="all">Tous les niveaux</option>
            <option value="1">Niveau 1 - Stagiaire</option>
            <option value="2">Niveau 2 - Interne</option>
            <option value="3">Niveau 3 - Résident</option>
            <option value="4">Niveau 4 - Spécialiste</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: COLORS.textLight, display: 'block', marginBottom: '6px' }}>
            Catégorie :
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: `2px solid ${COLORS.cardBorder}`,
              fontSize: '0.9rem',
              fontWeight: '600',
              color: COLORS.text,
            }}
          >
            <option value="all">Toutes les catégories</option>
            {resourceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des ressources */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              equipe={equipe}
              onPurchase={onPurchase}
            />
          ))}
          {filteredResources.length === 0 && (
            <div style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
              border: `2px solid ${COLORS.cardBorder}`,
            }}>
              <p style={{ color: COLORS.textLight, fontSize: '1rem' }}>
                Aucune ressource ne correspond à ces filtres.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE MES RESSOURCES
// ============================================
function MesRessourcesPage({ equipe, purchasedResources, onBack }) {
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
              Mes Ressources
            </h1>
            <p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>
              {purchasedResources.length} ressource{purchasedResources.length > 1 ? 's' : ''} achetée{purchasedResources.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Liste des ressources achetées */}
      <div style={{ padding: '20px' }}>
        {purchasedResources.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {purchasedResources.map(resource => (
              <div
                key={resource.id}
                style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
                  border: `2px solid ${COLORS.success}`,
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ color: COLORS.primaryDark, fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>
                    {resource.title}
                  </h4>
                  <p style={{ color: COLORS.textLight, fontSize: '0.8rem', lineHeight: '1.4' }}>
                    {resource.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{
                    background: COLORS.secondary,
                    color: COLORS.primary,
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}>
                    {resource.price}€
                  </div>
                  {resource.link && (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: COLORS.primary,
                      color: COLORS.white,
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}>
                      Ouvrir {MedicalIcons.external}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '40px 30px',
            textAlign: 'center',
            border: `2px solid ${COLORS.cardBorder}`,
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <h3 style={{ color: COLORS.primaryDark, fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
              Aucune ressource achetée
            </h3>
            <p style={{ color: COLORS.textLight, fontSize: '0.9rem' }}>
              Rendez-vous dans le catalogue pour acheter des ressources et progresser dans vos recherches !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// PAGE FICHE ÉQUIPE
// ============================================
function FichePage({ equipe, classeInfo, onBack, onUpdateMembres }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMembers, setEditedMembers] = useState([...equipe.membres]);

  const levelInfo = LEVEL_CONFIG[equipe.level];

  const handleSave = () => {
    const cleanMembers = editedMembers.filter(m => m.trim() !== '');
    onUpdateMembres(cleanMembers);
    setIsEditing(false);
  };

  const handleAddMember = () => {
    setEditedMembers([...editedMembers, '']);
  };

  const handleRemoveMember = (index) => {
    setEditedMembers(editedMembers.filter((_, i) => i !== index));
  };

  const handleChangeMember = (index, value) => {
    const newMembers = [...editedMembers];
    newMembers[index] = value;
    setEditedMembers(newMembers);
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
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>
            Fiche de l'Équipe
          </h1>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px' }}>
        <div style={{
          background: COLORS.white,
          borderRadius: '20px',
          padding: '24px',
          boxShadow: `0 8px 30px ${COLORS.cardShadow}`,
          border: `2px solid ${COLORS.cardBorder}`,
        }}>
          {/* Illustration */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
              <circle cx="35" cy="30" r="12" stroke="white" strokeWidth="5" fill="none"/>
              <circle cx="65" cy="30" r="12" stroke="white" strokeWidth="5" fill="none"/>
              <path d="M15 70 Q15 50 35 50 Q55 50 55 70" stroke="white" strokeWidth="5" fill="none"/>
              <path d="M45 70 Q45 50 65 50 Q85 50 85 70" stroke="white" strokeWidth="5" fill="none"/>
            </svg>
          </div>

          {/* Infos classe et équipe */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ color: COLORS.textLight, fontSize: '0.85rem', marginBottom: '4px' }}>
              {classeInfo?.class_name} • {classeInfo?.school_year}
            </div>
            <h2 style={{ color: COLORS.primaryDark, fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>
              Équipe {equipe.team_number}
            </h2>
            <div style={{
              display: 'inline-block',
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              color: COLORS.white,
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700',
            }}>
              Niveau {equipe.level} - {levelInfo.title}
            </div>
          </div>

          {/* Membres */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}>
              <h3 style={{ color: COLORS.primaryDark, fontSize: '1rem', fontWeight: '700' }}>
                Membres de l'équipe
              </h3>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.primary,
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {isEditing ? '✓ Sauvegarder' : '✏️ Modifier'}
              </button>
            </div>

            {isEditing ? (
              /* Mode édition */
              <div>
                {editedMembers.map((membre, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={membre}
                      onChange={(e) => handleChangeMember(i, e.target.value)}
                      placeholder={`Membre ${i + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: `2px solid ${COLORS.cardBorder}`,
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                      }}
                    />
                    {editedMembers.length > 1 && (
                      <button
                        onClick={() => handleRemoveMember(i)}
                        style={{
                          padding: '8px 12px',
                          background: COLORS.error,
                          color: COLORS.white,
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddMember}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: COLORS.secondary,
                    color: COLORS.primary,
                    border: `2px dashed ${COLORS.primary}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    marginTop: '8px',
                  }}
                >
                  + Ajouter un membre
                </button>
              </div>
            ) : (
              /* Mode affichage */
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {equipe.membres.map((membre, i) => (
                  <span
                    key={i}
                    style={{
                      background: COLORS.secondary,
                      color: COLORS.primaryDark,
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    {membre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: '#E8F5E9', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: COLORS.success }}>
                {equipe.budget}€
              </div>
              <div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Budget</div>
            </div>
            <div style={{ background: '#E3F2FD', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: COLORS.primary }}>
                {equipe.reputation}
              </div>
              <div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Réputation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE AIDE
// ============================================
function AidePage({ onBack }) {
  const helpItems = [
    { title: '🎮 Comment jouer ?', content: 'Votre équipe doit résoudre des problèmes scientifiques sur la digestion. Achetez des ressources pour avancer dans vos recherches !' },
    { title: '⭐ Gagner de la réputation', content: 'Votre enseignant vous attribue des points de Découverte (🔍) et de Raisonnement (🧠). Accumulez 5 points pour passer au niveau suivant !' },
    { title: '📈 Progression des niveaux', content: 'Niveau 1 (Stagiaire): 100€ • Niveau 2 (Interne): 200€ • Niveau 3 (Résident): 500€ • Niveau 4 (Spécialiste): 1000€' },
    { title: '🔓 Débloquer des ressources', content: 'Chaque niveau débloque de nouvelles catégories de ressources plus avancées et plus détaillées.' },
    { title: '💡 Conseil', content: 'Gérez bien votre budget ! Certaines ressources coûtent cher mais sont très utiles pour résoudre les problèmes.' },
  ];

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
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>
            Aide & Règles du Jeu
          </h1>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px' }}>
        {helpItems.map((item, i) => (
          <div
            key={i}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
              border: `2px solid ${COLORS.cardBorder}`,
            }}
          >
            <h3 style={{ color: COLORS.primaryDark, fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>
              {item.title}
            </h3>
            <p style={{ color: COLORS.textLight, fontSize: '0.9rem', lineHeight: '1.5' }}>
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
