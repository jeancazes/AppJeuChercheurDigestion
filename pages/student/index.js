import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gameStore } from '../../stores/GameStore';

export default function StudentHome() {
  const router = useRouter();
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
      
      // Récupérer les équipes
      gameStore.subscribe((state) => {
        setTeams(state.teams);
      });
    } catch (error) {
      alert('Erreur : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = (team) => {
    router.push(`/student/team?id=${team.id}`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>👩‍🎓 Interface Élève</h1>
        <p style={styles.subtitle}>Le Laboratoire Fabuleux</p>
      </header>

      <main style={styles.main}>
        {!selectedClass ? (
          // Sélection de classe
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Sélectionnez votre classe</h2>
            
            {loading ? (
              <p style={styles.loading}>Chargement...</p>
            ) : (
              <div style={styles.classList}>
                {classes.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls)}
                    style={styles.classCard}
                  >
                    <div style={styles.classIcon}>📚</div>
                    <h3>{cls.class_name}</h3>
                    <p>{cls.school_year}</p>
                  </button>
                ))}
                {classes.length === 0 && (
                  <p style={styles.emptyMessage}>
                    Aucune classe disponible.
                    <br />
                    Demandez à votre professeur de créer une classe.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          // Sélection d'équipe
          <div style={styles.section}>
            <div style={styles.breadcrumb}>
              <button onClick={() => setSelectedClass(null)} style={styles.backButton}>
                ← Changer de classe
              </button>
              <span>{selectedClass.class_name}</span>
            </div>

            <h2 style={styles.sectionTitle}>Sélectionnez votre équipe</h2>

            {loading ? (
              <p style={styles.loading}>Chargement...</p>
            ) : (
              <div style={styles.teamsList}>
                {teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleSelectTeam(team)}
                    style={styles.teamCard}
                  >
                    <div style={styles.teamHeader}>
                      <h3>Équipe {team.team_number}</h3>
                      <div style={styles.levelBadge}>Niveau {team.level}</div>
                    </div>
                    <p style={styles.teamName}>{team.team_name}</p>
                    <div style={styles.teamMembers}>
                      {JSON.parse(team.members || '[]').map((member, i) => (
                        <div key={i} style={styles.memberTag}>{member}</div>
                      ))}
                    </div>
                    <div style={styles.teamStats}>
                      <span>💰 {team.budget}€</span>
                      <span>📊 Points: {team.discovery_points + team.reasoning_points}</span>
                    </div>
                  </button>
                ))}
                {teams.length === 0 && (
                  <p style={styles.emptyMessage}>
                    Aucune équipe dans cette classe.
                    <br />
                    Demandez à votre professeur de créer des équipes.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div style={styles.footer}>
          <button onClick={() => router.push('/')} style={styles.homeButton}>
            ← Retour à l'accueil
          </button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: {
    background: 'rgba(255,255,255,0.95)',
    padding: '30px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#667eea',
    fontSize: '2.5rem',
  },
  subtitle: {
    margin: 0,
    color: '#666',
    fontSize: '1.2rem',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  section: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    marginBottom: '20px',
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#667eea',
    marginBottom: '30px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #eee',
  },
  backButton: {
    padding: '8px 16px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#667eea',
  },
  classList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  classCard: {
    padding: '30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  classIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  teamsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  teamCard: {
    padding: '25px',
    background: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  levelBadge: {
    padding: '4px 12px',
    background: '#667eea',
    color: 'white',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  teamName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  teamMembers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '15px',
  },
  memberTag: {
    padding: '4px 10px',
    background: '#e5e7eb',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  teamStats: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999',
    gridColumn: '1 / -1',
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
  },
  homeButton: {
    padding: '12px 24px',
    background: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#667eea',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
};
