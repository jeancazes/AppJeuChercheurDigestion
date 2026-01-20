import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gameStore } from '../../stores/GameStore';

export default function TeacherDashboard() {
  const router = useRouter();
  const [state, setState] = useState({
    selectedClass: null,
    teams: [],
    loading: false,
    error: null,
  });
  
  const [showClassModal, setShowClassModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [classes, setClasses] = useState([]);

  // S'abonner au store
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(setState);
    loadClasses();
    return unsubscribe;
  }, []);

  const loadClasses = async () => {
    try {
      const classList = await gameStore.listClasses();
      setClasses(classList);
    } catch (error) {
      console.error('Erreur chargement classes:', error);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const newClass = await gameStore.createClass(
        formData.get('schoolYear'),
        formData.get('className')
      );
      await gameStore.loadClass(newClass.id);
      setShowClassModal(false);
      loadClasses();
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  const handleSelectClass = async (classId) => {
    try {
      await gameStore.loadClass(classId);
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!state.selectedClass) return;
    
    const formData = new FormData(e.target);
    const members = [
      formData.get('member1'),
      formData.get('member2'),
      formData.get('member3'),
      formData.get('member4'),
    ].filter(m => m && m.trim());

    try {
      await gameStore.createTeam({
        classId: state.selectedClass.id,
        teamNumber: state.teams.length + 1,
        teamName: formData.get('teamName'),
        members,
        avatarUrl: `/avatars/doctor-${(state.teams.length % 5) + 1}.png`,
      });
      setShowTeamModal(false);
      e.target.reset();
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  const handleAddPoints = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    
    const formData = new FormData(e.target);
    const discovery = parseInt(formData.get('discovery') || 0);
    const reasoning = parseInt(formData.get('reasoning') || 0);

    try {
      await gameStore.addReputationPoints(selectedTeam.id, discovery, reasoning);
      setShowPointsModal(false);
      setSelectedTeam(null);
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🧪 Dashboard Professeur</h1>
        <button onClick={() => router.push('/')} style={styles.logoutButton}>
          Déconnexion
        </button>
      </header>

      {/* Sélection de classe */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2>📚 Classe</h2>
          <button onClick={() => setShowClassModal(true)} style={styles.addButton}>
            + Nouvelle classe
          </button>
        </div>

        {state.selectedClass ? (
          <div style={styles.classInfo}>
            <h3>{state.selectedClass.class_name}</h3>
            <p>Année : {state.selectedClass.school_year}</p>
            <button onClick={() => gameStore.reset()} style={styles.changeButton}>
              Changer de classe
            </button>
          </div>
        ) : (
          <div style={styles.classList}>
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => handleSelectClass(cls.id)}
                style={styles.classButton}
              >
                <strong>{cls.class_name}</strong>
                <br />
                <small>{cls.school_year}</small>
              </button>
            ))}
            {classes.length === 0 && (
              <p style={styles.emptyMessage}>Aucune classe. Créez-en une !</p>
            )}
          </div>
        )}
      </div>

      {/* Liste des équipes */}
      {state.selectedClass && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>👥 Équipes ({state.teams.length})</h2>
            <button onClick={() => setShowTeamModal(true)} style={styles.addButton}>
              + Nouvelle équipe
            </button>
          </div>

          <div style={styles.teamsGrid}>
            {state.teams.map(team => (
              <div key={team.id} style={styles.teamCard}>
                <h3>Équipe {team.team_number}</h3>
                <p><strong>{team.team_name}</strong></p>
                <div style={styles.teamStats}>
                  <div>Niveau: <strong>{team.level}</strong></div>
                  <div>Budget: <strong>{team.budget}€</strong></div>
                </div>
                <div style={styles.teamStats}>
                  <div>🔍 Découverte: {team.discovery_points}</div>
                  <div>🧠 Raisonnement: {team.reasoning_points}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowPointsModal(true);
                  }}
                  style={styles.pointsButton}
                >
                  + Ajouter des points
                </button>
              </div>
            ))}
            {state.teams.length === 0 && (
              <p style={styles.emptyMessage}>Aucune équipe. Créez-en une !</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Nouvelle Classe */}
      {showClassModal && (
        <Modal onClose={() => setShowClassModal(false)}>
          <h2>Créer une classe</h2>
          <form onSubmit={handleCreateClass} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Année scolaire</label>
              <input name="schoolYear" placeholder="2024-2025" required />
            </div>
            <div style={styles.formGroup}>
              <label>Nom de la classe</label>
              <input name="className" placeholder="3ème A" required />
            </div>
            <div style={styles.formActions}>
              <button type="button" onClick={() => setShowClassModal(false)}>
                Annuler
              </button>
              <button type="submit" style={styles.submitButton}>
                Créer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Nouvelle Équipe */}
      {showTeamModal && (
        <Modal onClose={() => setShowTeamModal(false)}>
          <h2>Créer une équipe</h2>
          <form onSubmit={handleCreateTeam} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Nom de l'équipe</label>
              <input name="teamName" placeholder="Les Scientifiques" required />
            </div>
            <div style={styles.formGroup}>
              <label>Membre 1</label>
              <input name="member1" placeholder="Prénom Nom" required />
            </div>
            <div style={styles.formGroup}>
              <label>Membre 2</label>
              <input name="member2" placeholder="Prénom Nom" required />
            </div>
            <div style={styles.formGroup}>
              <label>Membre 3 (optionnel)</label>
              <input name="member3" placeholder="Prénom Nom" />
            </div>
            <div style={styles.formGroup}>
              <label>Membre 4 (optionnel)</label>
              <input name="member4" placeholder="Prénom Nom" />
            </div>
            <div style={styles.formActions}>
              <button type="button" onClick={() => setShowTeamModal(false)}>
                Annuler
              </button>
              <button type="submit" style={styles.submitButton}>
                Créer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Ajouter Points */}
      {showPointsModal && selectedTeam && (
        <Modal onClose={() => { setShowPointsModal(false); setSelectedTeam(null); }}>
          <h2>Ajouter des points</h2>
          <p><strong>{selectedTeam.team_name}</strong></p>
          <form onSubmit={handleAddPoints} style={styles.form}>
            <div style={styles.formGroup}>
              <label>🔍 Points de Découverte</label>
              <input type="number" name="discovery" min="0" max="10" defaultValue="0" />
            </div>
            <div style={styles.formGroup}>
              <label>🧠 Points de Raisonnement</label>
              <input type="number" name="reasoning" min="0" max="10" defaultValue="0" />
            </div>
            <div style={styles.formActions}>
              <button type="button" onClick={() => { setShowPointsModal(false); setSelectedTeam(null); }}>
                Annuler
              </button>
              <button type="submit" style={styles.submitButton}>
                Valider
              </button>
            </div>
          </form>
        </Modal>
      )}

      {state.loading && (
        <div style={styles.loading}>Chargement...</div>
      )}
    </div>
  );
}

// Composant Modal
function Modal({ children, onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: '20px',
  },
  header: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    color: '#667eea',
  },
  logoutButton: {
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  section: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  classInfo: {
    padding: '15px',
    background: '#f9fafb',
    borderRadius: '8px',
  },
  changeButton: {
    marginTop: '10px',
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  classList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
  },
  classButton: {
    padding: '20px',
    background: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  teamsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  teamCard: {
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
  },
  teamStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontSize: '0.9rem',
  },
  pointsButton: {
    marginTop: '15px',
    width: '100%',
    padding: '10px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
  modalOverlay: {
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
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  form: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  submitButton: {
    background: '#667eea',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  loading: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px 40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
};
