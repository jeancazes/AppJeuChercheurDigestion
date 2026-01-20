import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gameStore } from '../../stores/GameStore';

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [team, setTeam] = useState(null);
  const [purchasedResources, setPurchasedResources] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTeam();
    }
  }, [id]);

  const loadTeam = async () => {
    try {
      // S'abonner au store pour obtenir les données de l'équipe
      const unsubscribe = gameStore.subscribe((state) => {
        const foundTeam = state.teams.find(t => t.id === id);
        if (foundTeam) {
          setTeam(foundTeam);
          setPurchasedResources(state.purchasedResources[id] || []);
          
          // Charger les ressources disponibles selon le niveau
          loadAvailableResources(foundTeam.level);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const loadAvailableResources = async (teamLevel) => {
    try {
      const resources = await gameStore.getResourcesByLevel(teamLevel);
      setAvailableResources(resources);
    } catch (error) {
      console.error('Erreur chargement ressources:', error);
      // Si erreur (table vide), afficher un message
      setAvailableResources([]);
    }
  };

  const handlePurchase = async (resource) => {
    if (!team) return;

    if (team.budget < resource.price) {
      alert('Budget insuffisant !');
      return;
    }

    const confirm = window.confirm(
      `Acheter "${resource.title}" pour ${resource.price}€ ?\n\nBudget actuel: ${team.budget}€\nBudget après achat: ${team.budget - resource.price}€`
    );

    if (confirm) {
      try {
        await gameStore.purchaseResource(id, resource);
        alert('Ressource achetée avec succès ! ✅');
      } catch (error) {
        alert('Erreur : ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          Équipe non trouvée.
          <br />
          <button onClick={() => router.push('/student')} style={styles.button}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  const totalPoints = team.discovery_points + team.reasoning_points;
  const progressToNextLevel = totalPoints % 5;

  return (
    <div style={styles.container}>
      {/* Carte de personnage */}
      <div style={styles.characterCard}>
        <div style={styles.cardHeader}>
          <h1 style={styles.teamTitle}>Équipe {team.team_number}</h1>
          <button onClick={() => router.push('/student')} style={styles.backButton}>
            ← Retour
          </button>
        </div>

        <div style={styles.cardContent}>
          <div style={styles.avatar}>
            <div style={styles.avatarCircle}>🧪</div>
          </div>

          <div style={styles.teamInfo}>
            <h2 style={styles.teamName}>{team.team_name}</h2>
            
            <div style={styles.members}>
              <strong>Membres :</strong>
              <div style={styles.membersList}>
                {(JSON.parse(team.members || '[]')).map((member, i) => (
                  <div key={i} style={styles.memberBadge}>{member}</div>
                ))}
              </div>
            </div>

            <div style={styles.stats}>
              <div style={styles.stat}>
                <div style={styles.statLabel}>Niveau</div>
                <div style={styles.statValue}>{team.level}</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statLabel}>Budget</div>
                <div style={styles.statValue}>{team.budget}€</div>
              </div>
            </div>

            <div style={styles.reputation}>
              <h3>Points de réputation</h3>
              <div style={styles.reputationGrid}>
                <div style={styles.reputationItem}>
                  <span>🔍 Découverte:</span>
                  <strong>{team.discovery_points}</strong>
                </div>
                <div style={styles.reputationItem}>
                  <span>🧠 Raisonnement:</span>
                  <strong>{team.reasoning_points}</strong>
                </div>
                <div style={styles.reputationItem}>
                  <span>📊 Total:</span>
                  <strong>{totalPoints}</strong>
                </div>
              </div>
              <div style={styles.progress}>
                <div style={styles.progressLabel}>
                  Progression vers niveau {team.level + 1}: {progressToNextLevel}/5
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${(progressToNextLevel / 5) * 100}%`}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boutique de ressources */}
      <div style={styles.shop}>
        <h2 style={styles.shopTitle}>🛒 Ressources disponibles</h2>
        
        {availableResources.length === 0 ? (
          <div style={styles.emptyResources}>
            <p style={styles.emptyTitle}>📦 Catalogue de ressources vide</p>
            <p style={styles.emptyText}>
              La table des ressources dans Supabase est vide.
              <br />
              Pour remplir le catalogue :
            </p>
            <ol style={styles.emptySteps}>
              <li>Ouvrez Supabase SQL Editor</li>
              <li>Exécutez le fichier <code>supabase-resources.sql</code></li>
              <li>Rechargez cette page</li>
            </ol>
            <p style={styles.emptyNote}>
              ℹ️ Ce fichier se trouve dans le ZIP à la racine du projet
            </p>
          </div>
        ) : (
          <div style={styles.resourcesGrid}>
            {availableResources.map((resource, index) => {
              const canAfford = team.budget >= resource.price;
              return (
                <div key={index} style={{
                  ...styles.resourceCard,
                  opacity: canAfford ? 1 : 0.6,
                }}>
                  <div style={styles.resourceHeader}>
                    <span style={styles.resourceType}>{resource.type}</span>
                    <span style={styles.resourceLevel}>{resource.level}</span>
                  </div>
                  <h3 style={styles.resourceTitle}>{resource.title}</h3>
                  <div style={styles.resourceFooter}>
                    <span style={styles.resourcePrice}>{resource.price}€</span>
                    <button
                      onClick={() => handlePurchase(resource)}
                      disabled={!canAfford}
                      style={{
                        ...styles.buyButton,
                        opacity: canAfford ? 1 : 0.5,
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {canAfford ? 'Acheter' : 'Trop cher'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ressources achetées */}
      {purchasedResources.length > 0 && (
        <div style={styles.purchased}>
          <h2 style={styles.purchasedTitle}>✅ Ressources achetées ({purchasedResources.length})</h2>
          <div style={styles.purchasedList}>
            {purchasedResources.map((resource, index) => (
              <div key={index} style={styles.purchasedItem}>
                <span style={styles.purchasedType}>{resource.type}</span>
                <span style={styles.purchasedName}>{resource.title}</span>
                <span style={styles.purchasedPrice}>{resource.price}€</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  characterCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  teamTitle: {
    margin: 0,
    color: '#667eea',
  },
  backButton: {
    padding: '10px 20px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#667eea',
  },
  cardContent: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: '30px',
  },
  avatar: {
    textAlign: 'center',
  },
  avatarCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    margin: '0 auto',
  },
  teamInfo: {},
  teamName: {
    marginTop: 0,
    color: '#333',
  },
  members: {
    marginBottom: '20px',
  },
  membersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  memberBadge: {
    padding: '6px 12px',
    background: '#e5e7eb',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  stat: {
    padding: '15px',
    background: '#f9fafb',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  reputation: {
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '8px',
  },
  reputationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '15px',
  },
  reputationItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  progress: {
    marginTop: '15px',
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '8px',
  },
  progressBar: {
    height: '20px',
    background: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s',
  },
  shop: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  shopTitle: {
    marginTop: 0,
    color: '#667eea',
  },
  emptyResources: {
    textAlign: 'center',
    padding: '60px 40px',
    background: '#fff3cd',
    borderRadius: '10px',
    border: '2px solid #ffc107',
  },
  emptyTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: '15px',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#856404',
    marginBottom: '20px',
  },
  emptySteps: {
    textAlign: 'left',
    display: 'inline-block',
    margin: '20px auto',
    padding: '20px 40px',
    background: 'white',
    borderRadius: '8px',
    fontSize: '1rem',
    lineHeight: '1.8',
  },
  emptyNote: {
    fontSize: '0.9rem',
    color: '#856404',
    marginTop: '20px',
  },
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  resourceCard: {
    padding: '20px',
    background: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    transition: 'all 0.2s',
  },
  resourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  resourceType: {
    padding: '4px 10px',
    background: '#667eea',
    color: 'white',
    borderRadius: '6px',
    fontSize: '0.8rem',
  },
  resourceLevel: {
    padding: '4px 10px',
    background: '#e5e7eb',
    borderRadius: '6px',
    fontSize: '0.8rem',
  },
  resourceTitle: {
    fontSize: '1rem',
    marginBottom: '15px',
    minHeight: '48px',
  },
  resourceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourcePrice: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#10b981',
  },
  buyButton: {
    padding: '8px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
  purchased: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  purchasedTitle: {
    marginTop: 0,
    color: '#10b981',
  },
  purchasedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  purchasedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#f0fdf4',
    borderRadius: '8px',
  },
  purchasedType: {
    padding: '4px 10px',
    background: '#10b981',
    color: 'white',
    borderRadius: '6px',
    fontSize: '0.8rem',
    minWidth: '100px',
    textAlign: 'center',
  },
  purchasedName: {
    flex: 1,
    marginLeft: '15px',
  },
  purchasedPrice: {
    fontWeight: 'bold',
    color: '#10b981',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    background: 'white',
    borderRadius: '15px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '60px',
    background: 'white',
    borderRadius: '15px',
    color: '#ef4444',
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
