'use client';

import React, { useState, useEffect } from 'react';
import { getGameStore, COLORS, LEVEL_CONFIG } from '@/lib/gameStore';

// ============================================
// CONSTANTES
// ============================================
const SECRET_CODE = '1447';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 20 * 60 * 1000;

// ============================================
// ICÔNES SVG
// ============================================
const Icons = {
  back: (<svg width="24" height="24" viewBox="0 0 100 100" fill="none"><path d="M60 20 L30 50 L60 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>),
  edit: (<svg width="18" height="18" viewBox="0 0 100 100" fill="none"><path d="M70 15 L85 30 L35 80 L15 85 L20 65 Z" stroke="currentColor" strokeWidth="6" fill="none" strokeLinejoin="round"/><path d="M60 25 L75 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/></svg>),
  trash: (<svg width="18" height="18" viewBox="0 0 100 100" fill="none"><path d="M25 30 L75 30 L70 85 L30 85 Z" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M20 30 L80 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M40 20 L60 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M40 45 L40 70 M50 45 L50 70 M60 45 L60 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>),
  plus: (<svg width="20" height="20" viewBox="0 0 100 100" fill="none"><path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/></svg>),
  close: (<svg width="20" height="20" viewBox="0 0 100 100" fill="none"><path d="M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/></svg>),
  check: (<svg width="18" height="18" viewBox="0 0 100 100" fill="none"><path d="M20 55 L40 75 L80 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  users: (<svg width="18" height="18" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="30" r="15" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M20 80 Q50 60 80 80" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/></svg>),
  database: (<svg width="20" height="20" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="25" rx="35" ry="12" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M15 25 L15 75 Q15 87 50 87 Q85 87 85 75 L85 25" stroke="currentColor" strokeWidth="5" fill="none"/><ellipse cx="50" cy="50" rx="35" ry="12" stroke="currentColor" strokeWidth="5" fill="none"/></svg>),
  team: (<svg width="18" height="18" viewBox="0 0 100 100" fill="none"><circle cx="35" cy="35" r="12" stroke="currentColor" strokeWidth="5" fill="none"/><circle cx="65" cy="35" r="12" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M15 70 Q35 55 55 70" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M45 70 Q65 55 85 70" stroke="currentColor" strokeWidth="5" fill="none"/></svg>),
  resource: (<svg width="18" height="18" viewBox="0 0 100 100" fill="none"><rect x="20" y="15" width="60" height="70" rx="5" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M35 35 L65 35 M35 50 L65 50 M35 65 L55 65" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/></svg>),
};

// ============================================
// COMPOSANT : PAGE ENSEIGNANT
// ============================================
export default function EnseignantPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [currentModule, setCurrentModule] = useState(null); // 'classes', 'teams', 'resources'
  const [notification, setNotification] = useState('');

  // Vérifier le lockout
  useEffect(() => {
    const stored = localStorage.getItem('teacherLockout');
    if (stored) {
      const lockTime = parseInt(stored);
      if (Date.now() < lockTime) {
        setLockedUntil(lockTime);
      } else {
        localStorage.removeItem('teacherLockout');
      }
    }
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    
    if (lockedUntil && Date.now() < lockedUntil) {
      const minutes = Math.ceil((lockedUntil - Date.now()) / 60000);
      setError(`Accès bloqué. Réessayez dans ${minutes} min`);
      return;
    }

    if (code === SECRET_CODE) {
      setIsAuthenticated(true);
      setError('');
      setAttempts(0);
      localStorage.removeItem('teacherLockout');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem('teacherLockout', lockTime.toString());
        setLockedUntil(lockTime);
        setError('Trop de tentatives. Accès bloqué pour 20 minutes.');
      } else {
        setError(`Code incorrect (${newAttempts}/${MAX_ATTEMPTS})`);
      }
      setCode('');
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  if (!isAuthenticated) {
    const handleKeypadClick = (digit) => {
      if (code.length < 4 && !(lockedUntil && Date.now() < lockedUntil)) {
        setCode(code + digit);
      }
    };

    const handleDelete = () => {
      setCode(code.slice(0, -1));
    };

    const handleClear = () => {
      setCode('');
    };

    return (
      <div style={styles.container}>
        <div style={styles.authCard}>
          <h1 style={styles.authTitle}>🔒 Espace Enseignant</h1>
          <p style={styles.authSubtitle}>Code PIN requis</p>
          
          <form onSubmit={handleAuth} style={styles.authForm}>
            {/* Affichage du code avec points */}
            <div style={styles.codeDisplay}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  ...styles.codeDot,
                  background: i < code.length ? COLORS.primary : COLORS.secondary,
                }} />
              ))}
            </div>
            
            {error && <div style={styles.error}>{error}</div>}
            
            {/* Clavier numérique */}
            <div style={styles.keypad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadClick(digit.toString())}
                  style={styles.keypadButton}
                  disabled={lockedUntil && Date.now() < lockedUntil}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                style={styles.keypadButtonSecondary}
                disabled={lockedUntil && Date.now() < lockedUntil}
              >
                C
              </button>
              <button
                key={0}
                type="button"
                onClick={() => handleKeypadClick('0')}
                style={styles.keypadButton}
                disabled={lockedUntil && Date.now() < lockedUntil}
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={styles.keypadButtonSecondary}
                disabled={lockedUntil && Date.now() < lockedUntil}
              >
                ⌫
              </button>
            </div>
            
            <button 
              type="submit" 
              style={styles.authButton}
              disabled={lockedUntil && Date.now() < lockedUntil}
            >
              Accéder
            </button>
          </form>

          {/* Lien retour accueil */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/" style={styles.backLink}>
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {notification && (
        <div style={styles.notification}>{notification}</div>
      )}

      {!currentModule ? (
        <div style={styles.mainMenu}>
          <h1 style={styles.mainTitle}>👨‍🏫 Tableau de Bord Enseignant</h1>
          <p style={styles.mainSubtitle}>Gestion complète de vos classes</p>

          <div style={styles.menuGrid}>
            <MenuCard
              icon={Icons.database}
              title="Gestion des Classes"
              description="Créer, modifier, supprimer des classes"
              onClick={() => setCurrentModule('classes')}
            />
            
            <MenuCard
              icon={Icons.team}
              title="Gestion des Équipes"
              description="Créer, modifier, gérer les équipes et leurs points"
              onClick={() => setCurrentModule('teams')}
            />
            
            <MenuCard
              icon={Icons.resource}
              title="Gestion des Ressources"
              description="Ajouter, modifier, supprimer des ressources éducatives"
              onClick={() => setCurrentModule('resources')}
            />
          </div>

          <button 
            style={styles.logoutButton}
            onClick={() => setIsAuthenticated(false)}
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <>
          <div style={styles.header}>
            <button 
              style={styles.backButton}
              onClick={() => setCurrentModule(null)}
            >
              {Icons.back} Retour au menu
            </button>
          </div>

          {currentModule === 'classes' && (
            <ModuleClasses showNotification={showNotification} />
          )}
          {currentModule === 'teams' && (
            <ModuleEquipes showNotification={showNotification} />
          )}
          {currentModule === 'resources' && (
            <ModuleRessources showNotification={showNotification} />
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// COMPOSANT : CARTE MENU
// ============================================
function MenuCard({ icon, title, description, onClick }) {
  return (
    <div style={styles.menuCard} onClick={onClick}>
      <div style={styles.menuCardIcon}>{icon}</div>
      <h3 style={styles.menuCardTitle}>{title}</h3>
      <p style={styles.menuCardDesc}>{description}</p>
    </div>
  );
}

// ============================================
// MODULE : GESTION DES CLASSES
// ============================================
function ModuleClasses({ showNotification }) {
  const gameStore = getGameStore();
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClasse, setEditingClasse] = useState(null);
  const [formData, setFormData] = useState({ name: '', anneeScolaire: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClasses();
    const unsubscribe = gameStore.subscribe(() => {
      setClasses(gameStore.getClasses());
    });
    return unsubscribe;
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      await gameStore.refreshClasses();
      setClasses(gameStore.getClasses());
    } catch (error) {
      showNotification('❌ Erreur de chargement');
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingClasse(null);
    setFormData({ name: '', anneeScolaire: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1) });
    setShowModal(true);
  };

  const handleEdit = (classe) => {
    setEditingClasse(classe);
    setFormData({ name: classe.name, anneeScolaire: classe.anneeScolaire });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.anneeScolaire) {
      showNotification('❌ Tous les champs sont requis');
      return;
    }

    setLoading(true);
    try {
      if (editingClasse) {
        await gameStore.updateClasse(editingClasse.id, formData);
        showNotification('✅ Classe modifiée');
      } else {
        await gameStore.createClasse(formData.name, formData.anneeScolaire);
        showNotification('✅ Classe créée');
      }
      setShowModal(false);
      await loadClasses();
    } catch (error) {
      showNotification('❌ Erreur : ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (classe) => {
    if (!confirm(`Supprimer "${classe.name}" ? Toutes les équipes seront supprimées.`)) return;

    setLoading(true);
    try {
      await gameStore.deleteClasse(classe.id);
      showNotification('✅ Classe supprimée');
      await loadClasses();
    } catch (error) {
      showNotification('❌ Erreur : ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.module}>
      <div style={styles.moduleHeader}>
        <h2 style={styles.moduleTitle}>📚 Gestion des Classes</h2>
        <button style={styles.addButton} onClick={handleCreate}>
          {Icons.plus} Nouvelle Classe
        </button>
      </div>

      {loading && <div style={styles.loading}>Chargement...</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nom de la classe</th>
              <th style={styles.th}>Année scolaire</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(classe => (
              <tr key={classe.id} style={styles.tr}>
                <td style={styles.td}>{classe.name}</td>
                <td style={styles.td}>{classe.anneeScolaire}</td>
                <td style={styles.td}>
                  <button style={styles.iconButton} onClick={() => handleEdit(classe)}>
                    {Icons.edit}
                  </button>
                  <button style={styles.iconButtonDanger} onClick={() => handleDelete(classe)}>
                    {Icons.trash}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editingClasse ? 'Modifier la classe' : 'Nouvelle classe'}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom de la classe</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: 5ème A"
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Année scolaire</label>
            <input
              type="text"
              value={formData.anneeScolaire}
              onChange={(e) => setFormData({ ...formData, anneeScolaire: e.target.value })}
              placeholder="Ex: 2024-2025"
              style={styles.input}
            />
          </div>

          <div style={styles.modalActions}>
            <button style={styles.cancelButton} onClick={() => setShowModal(false)}>
              Annuler
            </button>
            <button style={styles.saveButton} onClick={handleSave}>
              {Icons.check} Enregistrer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// MODULE : GESTION DES ÉQUIPES
// ============================================
function ModuleEquipes({ showNotification }) {
  const gameStore = getGameStore();
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [equipes, setEquipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEquipe, setEditingEquipe] = useState(null);
  const [formData, setFormData] = useState({ numero: '', membres: [''] });
  const [loading, setLoading] = useState(false);
  const [showResources, setShowResources] = useState(null); // ID de l'équipe dont on affiche les ressources
  const [levelAnimations, setLevelAnimations] = useState({}); // Pour les animations de niveau
  const [showEvaluations, setShowEvaluations] = useState(null); // ID de l'équipe dont on affiche les évaluations
  const [memberSessions, setMemberSessions] = useState({}); // {equipeId: {memberName: {session_1: 0, ...}}}

  useEffect(() => {
    loadData();
    const unsubscribe = gameStore.subscribe(() => {
      setClasses(gameStore.getClasses());
      if (selectedClasse) {
        setEquipes(gameStore.getEquipesByClasse(selectedClasse.id));
      }
    });
    return unsubscribe;
  }, [selectedClasse]);

  const loadData = async () => {
    setLoading(true);
    try {
      await gameStore.refreshClasses();
      setClasses(gameStore.getClasses());
    } catch (error) {
      showNotification('❌ Erreur de chargement');
    }
    setLoading(false);
  };

  const selectClasse = async (classe) => {
    setLoading(true);
    setSelectedClasse(classe);
    try {
      await gameStore.loadClasse(classe.id);
      setEquipes(gameStore.getEquipesByClasse(classe.id));
    } catch (error) {
      showNotification('❌ Erreur de chargement');
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingEquipe(null);
    const nextNumero = equipes.length > 0 ? Math.max(...equipes.map(e => e.numero)) + 1 : 1;
    setFormData({ numero: nextNumero, membres: ['', ''], pinCode: '0000' });
    setShowModal(true);
  };

  const handleEdit = (equipe) => {
    setEditingEquipe(equipe);
    setFormData({ numero: equipe.numero, membres: [...equipe.membres], pinCode: equipe.pinCode || '0000' });
    setShowModal(true);
  };

  const handleSave = async () => {
    const membres = formData.membres.filter(m => m.trim());
    if (!formData.numero || membres.length === 0) {
      showNotification('❌ Numéro et au moins un membre requis');
      return;
    }

    const pinCode = formData.pinCode || '0000';
    if (pinCode.length !== 4 || !/^\d{4}$/.test(pinCode)) {
      showNotification('❌ Le code PIN doit contenir 4 chiffres');
      return;
    }

    setLoading(true);
    try {
      if (editingEquipe) {
        await gameStore.updateEquipe(editingEquipe.id, { 
          numero: parseInt(formData.numero), 
          membres,
          pinCode 
        });
        showNotification('✅ Équipe modifiée');
      } else {
        await gameStore.createEquipe(selectedClasse.id, parseInt(formData.numero), membres, pinCode);
        showNotification('✅ Équipe créée');
      }
      setShowModal(false);
      await selectClasse(selectedClasse);
    } catch (error) {
      showNotification('❌ Erreur : ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (equipe) => {
    if (!confirm(`Supprimer l'équipe ${equipe.numero} ?`)) return;

    setLoading(true);
    try {
      await gameStore.deleteEquipe(equipe.id);
      showNotification('✅ Équipe supprimée');
      await selectClasse(selectedClasse);
    } catch (error) {
      showNotification('❌ Erreur : ' + error.message);
    }
    setLoading(false);
  };

  const addReputation = async (equipe, type) => {
    const oldLevel = equipe.level;
    await gameStore.addReputation(equipe.id, type, 1);
    
    // Vérifier si le niveau a changé
    const updatedEquipe = gameStore.getEquipe(equipe.id);
    if (updatedEquipe && updatedEquipe.level > oldLevel) {
      setLevelAnimations({ ...levelAnimations, [equipe.id]: true });
      showNotification(`🎉 Niveau ${updatedEquipe.level} atteint !`);
      setTimeout(() => {
        setLevelAnimations({ ...levelAnimations, [equipe.id]: false });
      }, 2000);
    } else {
      showNotification('✅ +1 point ajouté');
    }
  };

  const removeReputation = async (equipe, type) => {
    await gameStore.removeReputation(equipe.id, type, 1);
    showNotification('✅ -1 point retiré');
  };

  const addBudget = async (equipe, amount) => {
    const newBudget = equipe.budget + amount;
    await gameStore.updateEquipe(equipe.id, { budget: newBudget });
    showNotification(`✅ ${amount > 0 ? '+' : ''}${amount}€`);
  };

  const showResourcesModal = (equipeId) => {
    setShowResources(equipeId);
  };

  // Gestion des évaluations de séances
  const toggleEvaluations = async (equipeId) => {
    if (showEvaluations === equipeId) {
      setShowEvaluations(null);
    } else {
      setShowEvaluations(equipeId);
      await loadMemberSessions(equipeId);
    }
  };

  const loadMemberSessions = async (equipeId) => {
    try {
      const sessions = await gameStore.getMemberSessions(equipeId);
      const sessionsMap = {};
      sessions.forEach(session => {
        sessionsMap[session.member_name] = {
          session_1: session.session_1,
          session_2: session.session_2,
          session_3: session.session_3,
          session_4: session.session_4,
          session_5: session.session_5,
          session_6: session.session_6,
        };
      });
      setMemberSessions(prev => ({ ...prev, [equipeId]: sessionsMap }));
    } catch (error) {
      console.error('Erreur loadMemberSessions:', error);
    }
  };

  const updateSessionGrade = async (equipeId, memberName, sessionNumber, grade) => {
    try {
      await gameStore.updateMemberSession(equipeId, memberName, sessionNumber, grade);
      
      // Mettre à jour le state local
      setMemberSessions(prev => ({
        ...prev,
        [equipeId]: {
          ...prev[equipeId],
          [memberName]: {
            ...prev[equipeId]?.[memberName],
            [`session_${sessionNumber}`]: grade,
          },
        },
      }));
      
      showNotification(`✅ Note enregistrée : ${memberName} - Séance ${sessionNumber}`);
    } catch (error) {
      showNotification('❌ Erreur d\'enregistrement');
    }
  };

  if (!selectedClasse) {
    return (
      <div style={styles.module}>
        <h2 style={styles.moduleTitle}>👥 Sélectionnez une classe</h2>
        <div style={styles.classeGrid}>
          {classes.map(classe => (
            <div key={classe.id} style={styles.classeCard} onClick={() => selectClasse(classe)}>
              <h3>{classe.name}</h3>
              <p>{classe.anneeScolaire}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.module}>
      <div style={styles.moduleHeader}>
        <div>
          <h2 style={styles.moduleTitle}>👥 {selectedClasse.name}</h2>
          <button style={styles.smallButton} onClick={() => setSelectedClasse(null)}>
            ← Changer de classe
          </button>
        </div>
        <button style={styles.addButton} onClick={handleCreate}>
          {Icons.plus} Nouvelle Équipe
        </button>
      </div>

      {loading && <div style={styles.loading}>Chargement...</div>}

      {/* Vue Desktop (tableau) */}
      <div className="desktopView" style={styles.desktopView}>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>N°</th>
                <th style={styles.th}>Membres</th>
                <th style={styles.th}>Level</th>
                <th style={styles.th}>Budget</th>
                <th style={styles.th}>Code PIN</th>
                <th style={styles.th}>Découvertes</th>
                <th style={styles.th}>Raisonnement</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipes.map(equipe => (
                <React.Fragment key={equipe.id}>
                <tr key={equipe.id} style={styles.tr}>
                  <td style={styles.td}>{equipe.numero}</td>
                  <td style={styles.td}>{equipe.membres.join(', ')}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      animation: levelAnimations[equipe.id] ? 'levelUp 0.6s ease-out' : 'none',
                    }}>
                      {LEVEL_CONFIG[equipe.level]?.title || `Level ${equipe.level}`}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.budgetControl}>
                      <button 
                        style={styles.budgetButton} 
                        onClick={() => addBudget(equipe, -10)}
                        disabled={equipe.budget < 10}
                      >
                        -10
                      </button>
                      <span style={styles.budgetValue}>{equipe.budget}€</span>
                      <button 
                        style={styles.budgetButton} 
                        onClick={() => addBudget(equipe, 10)}
                      >
                        +10
                      </button>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.pinCode}>🔒 {equipe.pinCode || '0000'}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.pointsControl}>
                      <button 
                        style={styles.pointsButton} 
                        onClick={() => removeReputation(equipe, 'decouvertes')}
                      >
                        −
                      </button>
                      <span style={styles.pointsValue}>{equipe.reputationDecouvertes}</span>
                      <button 
                        style={styles.pointsButton} 
                        onClick={() => addReputation(equipe, 'decouvertes')}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.pointsControl}>
                      <button 
                        style={styles.pointsButton} 
                        onClick={() => removeReputation(equipe, 'raisonnement')}
                      >
                        −
                      </button>
                      <span style={styles.pointsValue}>{equipe.reputationRaisonnement}</span>
                      <button 
                        style={styles.pointsButton} 
                        onClick={() => addReputation(equipe, 'raisonnement')}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <button 
                      style={styles.resourceButton} 
                      onClick={() => showResourcesModal(equipe.id)}
                      title="Voir les ressources acquises"
                    >
                      {Icons.resource}
                    </button>
                    <button 
                      style={{...styles.iconButton, background: showEvaluations === equipe.id ? COLORS.primary : COLORS.secondary}}
                      onClick={() => toggleEvaluations(equipe.id)}
                      title="Évaluation par séance"
                    >
                      📊
                    </button>
                    <button style={styles.iconButton} onClick={() => handleEdit(equipe)}>
                      {Icons.edit}
                    </button>
                    <button style={styles.iconButtonDanger} onClick={() => handleDelete(equipe)}>
                      {Icons.trash}
                    </button>
                  </td>
                </tr>
                {/* Tableau d'évaluation des séances */}
                {showEvaluations === equipe.id && (
                  <tr>
                    <td colSpan="8" style={{padding: '20px', background: '#F5F5F5'}}>
                      <div style={styles.evaluationPanel}>
                        <h4 style={{marginBottom: '15px', color: COLORS.primaryDark}}>
                          📊 Évaluation par séance - Équipe {equipe.numero}
                        </h4>
                        <table style={styles.evaluationTable}>
                          <thead>
                            <tr>
                              <th style={styles.evalTh}>Membre</th>
                              <th style={styles.evalTh}>Séance 1</th>
                              <th style={styles.evalTh}>Séance 2</th>
                              <th style={styles.evalTh}>Séance 3</th>
                              <th style={styles.evalTh}>Séance 4</th>
                              <th style={styles.evalTh}>Séance 5</th>
                              <th style={styles.evalTh}>Séance 6</th>
                            </tr>
                          </thead>
                          <tbody>
                            {equipe.membres.map((membre, idx) => (
                              <tr key={idx} style={styles.evalTr}>
                                <td style={styles.evalTd}>
                                  <strong>{membre}</strong>
                                </td>
                                {[1, 2, 3, 4, 5, 6].map(sessionNum => (
                                  <td key={sessionNum} style={styles.evalTd}>
                                    <select
                                      value={memberSessions[equipe.id]?.[membre]?.[`session_${sessionNum}`] || '0'}
                                      onChange={(e) => updateSessionGrade(equipe.id, membre, sessionNum, e.target.value)}
                                      style={styles.evalSelect}
                                    >
                                      <option value="0">0</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                      <option value="ABS">ABS</option>
                                      <option value="NN">NN</option>
                                    </select>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vue Mobile (cartes) */}
      <div className="mobileView" style={styles.mobileView}>
        {equipes.map(equipe => (
          <div key={equipe.id} style={styles.equipeCard}>
            {/* En-tête de la carte */}
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderLeft}>
                <div style={styles.equipeNumero}>Équipe {equipe.numero}</div>
                <div style={styles.equipeMembres}>{equipe.membres.join(', ')}</div>
              </div>
              <div style={styles.cardHeaderRight}>
                <button 
                  style={styles.resourceButtonMobile} 
                  onClick={() => showResourcesModal(equipe.id)}
                  title="Ressources"
                >
                  {Icons.resource}
                </button>
                <button 
                  style={{...styles.iconButton, background: showEvaluations === equipe.id ? COLORS.primary : COLORS.secondary, fontSize: '16px'}}
                  onClick={() => toggleEvaluations(equipe.id)}
                  title="Évaluations"
                >
                  📊
                </button>
                <button style={styles.iconButton} onClick={() => handleEdit(equipe)}>
                  {Icons.edit}
                </button>
                <button style={styles.iconButtonDanger} onClick={() => handleDelete(equipe)}>
                  {Icons.trash}
                </button>
              </div>
            </div>

            {/* Niveau et Budget */}
            <div style={styles.cardRow}>
              <div style={styles.cardRowItem}>
                <div style={styles.cardLabel}>Niveau</div>
                <span style={{
                  ...styles.badgeMobile,
                  animation: levelAnimations[equipe.id] ? 'levelUp 0.6s ease-out' : 'none',
                }}>
                  {LEVEL_CONFIG[equipe.level]?.title || `Level ${equipe.level}`}
                </span>
              </div>
              <div style={styles.cardRowItem}>
                <div style={styles.cardLabel}>Code PIN</div>
                <span style={styles.pinCodeMobile}>🔒 {equipe.pinCode || '0000'}</span>
              </div>
            </div>

            {/* Budget */}
            <div style={styles.cardSection}>
              <div style={styles.cardLabel}>Budget</div>
              <div style={styles.budgetControlMobile}>
                <button 
                  style={styles.budgetButtonMobile} 
                  onClick={() => addBudget(equipe, -10)}
                  disabled={equipe.budget < 10}
                >
                  −10
                </button>
                <span style={styles.budgetValueMobile}>{equipe.budget}€</span>
                <button 
                  style={styles.budgetButtonMobile} 
                  onClick={() => addBudget(equipe, 10)}
                >
                  +10
                </button>
              </div>
            </div>

            {/* Points Découvertes */}
            <div style={styles.cardSection}>
              <div style={styles.cardLabel}>🔬 Découvertes</div>
              <div style={styles.pointsControlMobile}>
                <button 
                  style={styles.pointsButtonMobile} 
                  onClick={() => removeReputation(equipe, 'decouvertes')}
                >
                  −
                </button>
                <span style={styles.pointsValueMobile}>{equipe.reputationDecouvertes}</span>
                <button 
                  style={styles.pointsButtonMobile} 
                  onClick={() => addReputation(equipe, 'decouvertes')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Points Raisonnement */}
            <div style={styles.cardSection}>
              <div style={styles.cardLabel}>🧠 Raisonnement</div>
              <div style={styles.pointsControlMobile}>
                <button 
                  style={styles.pointsButtonMobile} 
                  onClick={() => removeReputation(equipe, 'raisonnement')}
                >
                  −
                </button>
                <span style={styles.pointsValueMobile}>{equipe.reputationRaisonnement}</span>
                <button 
                  style={styles.pointsButtonMobile} 
                  onClick={() => addReputation(equipe, 'raisonnement')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Panneau d'évaluation des séances (Mobile) */}
            {showEvaluations === equipe.id && (
              <div style={styles.evaluationPanelMobile}>
                <h4 style={{marginBottom: '12px', color: COLORS.primaryDark, fontSize: '16px'}}>
                  📊 Évaluation par séance
                </h4>
                {equipe.membres.map((membre, idx) => (
                  <div key={idx} style={styles.memberEvalCard}>
                    <div style={{fontWeight: 'bold', marginBottom: '8px', color: COLORS.primaryDark}}>
                      {membre}
                    </div>
                    <div style={styles.sessionsGrid}>
                      {[1, 2, 3, 4, 5, 6].map(sessionNum => (
                        <div key={sessionNum} style={styles.sessionItem}>
                          <label style={styles.sessionLabel}>S{sessionNum}</label>
                          <select
                            value={memberSessions[equipe.id]?.[membre]?.[`session_${sessionNum}`] || '0'}
                            onChange={(e) => updateSessionGrade(equipe.id, membre, sessionNum, e.target.value)}
                            style={styles.evalSelectMobile}
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="ABS">ABS</option>
                            <option value="NN">NN</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modale d'édition équipe */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editingEquipe ? 'Modifier l\'équipe' : 'Nouvelle équipe'}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Numéro de l'équipe</label>
            <input
              type="number"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Code PIN (4 chiffres)</label>
            <input
              type="text"
              value={formData.pinCode || '0000'}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setFormData({ ...formData, pinCode: value });
              }}
              placeholder="0000"
              maxLength="4"
              style={styles.input}
            />
            <small style={{ color: COLORS.textLight, fontSize: '12px' }}>
              Code à 4 chiffres pour sécuriser l'accès de l'équipe
            </small>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Membres</label>
            {formData.membres.map((membre, idx) => (
              <div key={idx} style={styles.membreRow}>
                <input
                  type="text"
                  value={membre}
                  onChange={(e) => {
                    const newMembres = [...formData.membres];
                    newMembres[idx] = e.target.value;
                    setFormData({ ...formData, membres: newMembres });
                  }}
                  placeholder={`Membre ${idx + 1}`}
                  style={styles.input}
                />
                {idx > 0 && (
                  <button
                    style={styles.removeButton}
                    onClick={() => {
                      const newMembres = formData.membres.filter((_, i) => i !== idx);
                      setFormData({ ...formData, membres: newMembres });
                    }}
                  >
                    {Icons.trash}
                  </button>
                )}
              </div>
            ))}
            <button
              style={styles.addMemberButton}
              onClick={() => setFormData({ ...formData, membres: [...formData.membres, ''] })}
            >
              + Ajouter un membre
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>🔒 Code PIN (4 chiffres)</label>
            <input
              type="text"
              value={formData.pinCode || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setFormData({ ...formData, pinCode: value });
              }}
              placeholder="0000"
              maxLength="4"
              style={styles.input}
            />
            <small style={{ color: COLORS.textLight, fontSize: '12px' }}>
              Code requis pour que les élèves accèdent à leur fiche
            </small>
          </div>

          <div style={styles.modalActions}>
            <button style={styles.cancelButton} onClick={() => setShowModal(false)}>
              Annuler
            </button>
            <button style={styles.saveButton} onClick={handleSave}>
              {Icons.check} Enregistrer
            </button>
          </div>
        </Modal>
      )}

      {/* Modale ressources acquises */}
      {showResources && (
        <ResourcesModal 
          equipeId={showResources}
          onClose={() => setShowResources(null)}
          gameStore={gameStore}
        />
      )}

      <style>{`
        @keyframes levelUp {
          0% {
            transform: scale(1);
            background: ${COLORS.primary};
          }
          50% {
            transform: scale(1.3);
            background: ${COLORS.success};
            box-shadow: 0 0 20px ${COLORS.success};
          }
          100% {
            transform: scale(1);
            background: ${COLORS.primary};
          }
        }

        @media (max-width: 768px) {
          .desktopView {
            display: none !important;
          }
          .mobileView {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// MODULE : GESTION DES RESSOURCES
// ============================================
function ModuleRessources({ showNotification }) {
  const gameStore = getGameStore();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    level: 1,
    type: '',
    title: '',
    description: '',
    price: 0,
    link: '',
    inClass: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    loadResources();
    const unsubscribe = gameStore.subscribe(() => {
      const res = gameStore.getResources();
      setResources(res);
      applyFilters(res);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    applyFilters(resources);
  }, [searchTerm, filterLevel, resources]);

  const loadResources = async () => {
    setLoading(true);
    try {
      await gameStore.loadResources();
      const res = gameStore.getResources();
      setResources(res);
      applyFilters(res);
    } catch (error) {
      showNotification('❌ Erreur de chargement');
    }
    setLoading(false);
  };

  const applyFilters = (res) => {
    let filtered = res;
    
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterLevel !== 'all') {
      filtered = filtered.filter(r => r.level === parseInt(filterLevel));
    }
    
    setFilteredResources(filtered);
  };

  const handleCreate = () => {
    setEditingResource(null);
    setFormData({
      level: 1,
      type: '',
      title: '',
      description: '',
      price: 0,
      link: '',
      inClass: false,
    });
    setShowModal(true);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      level: resource.level,
      type: resource.type,
      title: resource.title,
      description: resource.description,
      price: resource.price,
      link: resource.link,
      inClass: resource.inClass,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.type) {
      showNotification('❌ Titre et type requis');
      return;
    }

    setLoading(true);
    try {
      if (editingResource) {
        await gameStore.updateResource(editingResource.id, formData);
        showNotification('✅ Ressource modifiée');
      } else {
        await gameStore.createResource(formData);
        showNotification('✅ Ressource créée');
      }
      setShowModal(false);
      await loadResources();
    } catch (error) {
      showNotification('❌ Erreur : ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (resource) => {
    if (!confirm(`Supprimer "${resource.title}" ?`)) return;

    setLoading(true);
    try {
      await gameStore.deleteResource(resource.id);
      showNotification('✅ Ressource supprimée');
      await loadResources();
    } catch (error) {
      showNotification('❌ Erreur : ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.module}>
      <div style={styles.moduleHeader}>
        <h2 style={styles.moduleTitle}>📦 Gestion des Ressources</h2>
        <button style={styles.addButton} onClick={handleCreate}>
          {Icons.plus} Nouvelle Ressource
        </button>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          style={styles.select}
        >
          <option value="all">Tous les niveaux</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4</option>
        </select>
        <div style={styles.count}>{filteredResources.length} ressource(s)</div>
      </div>

      {loading && <div style={styles.loading}>Chargement...</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Titre</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Level</th>
              <th style={styles.th}>Prix</th>
              <th style={styles.th}>En classe</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map(resource => (
              <tr key={resource.id} style={styles.tr}>
                <td style={styles.td}>{resource.id}</td>
                <td style={styles.td}>{resource.title}</td>
                <td style={styles.td}>{resource.type}</td>
                <td style={styles.td}>
                  <span style={styles.levelBadge}>{resource.level}</span>
                </td>
                <td style={styles.td}>{resource.price}€</td>
                <td style={styles.td}>{resource.inClass ? '✓' : '-'}</td>
                <td style={styles.td}>
                  <button style={styles.iconButton} onClick={() => handleEdit(resource)}>
                    {Icons.edit}
                  </button>
                  <button style={styles.iconButtonDanger} onClick={() => handleDelete(resource)}>
                    {Icons.trash}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editingResource ? 'Modifier la ressource' : 'Nouvelle ressource'}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Ex: Ressources anatomique"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={styles.textarea}
              rows="3"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Level requis</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                style={styles.select}
              >
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Prix (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Lien (URL)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              style={styles.input}
            />
          </div>

          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={formData.inClass}
              onChange={(e) => setFormData({ ...formData, inClass: e.target.checked })}
              id="inClass"
            />
            <label htmlFor="inClass">Ressource disponible en classe uniquement</label>
          </div>

          <div style={styles.modalActions}>
            <button style={styles.cancelButton} onClick={() => setShowModal(false)}>
              Annuler
            </button>
            <button style={styles.saveButton} onClick={handleSave}>
              {Icons.check} Enregistrer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// COMPOSANT : MODAL
// ============================================
function Modal({ children, onClose, title }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.closeButton} onClick={onClose}>
            {Icons.close}
          </button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// ============================================
// COMPOSANT : MODALE RESSOURCES ACQUISES
// ============================================
function ResourcesModal({ equipeId, onClose, gameStore }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = () => {
      const equipe = gameStore.getEquipe(equipeId);
      if (!equipe) {
        setLoading(false);
        return;
      }

      const allResources = gameStore.getResources();
      const purchasedIds = equipe.purchasedResources || [];
      const purchased = allResources.filter(r => purchasedIds.includes(r.id));
      
      setResources(purchased);
      setLoading(false);
    };

    loadResources();
  }, [equipeId, gameStore]);

  const totalCost = resources.reduce((sum, r) => sum + r.price, 0);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>📦 Ressources Acquises</h3>
          <button style={styles.closeButton} onClick={onClose}>
            {Icons.close}
          </button>
        </div>
        <div style={styles.modalBody}>
          {loading && <p style={{ textAlign: 'center', color: COLORS.textLight }}>Chargement...</p>}
          
          {!loading && resources.length === 0 && (
            <p style={{ textAlign: 'center', color: COLORS.textLight, padding: '40px' }}>
              Aucune ressource achetée pour le moment
            </p>
          )}

          {!loading && resources.length > 0 && (
            <>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.primary }}>
                  Total dépensé : {totalCost}€
                </span>
              </div>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {resources.map(resource => (
                  <div key={resource.id} style={styles.resourceItem}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={styles.resourceId}>{resource.id}</span>
                        <h4 style={{ color: COLORS.primaryDark, fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                          {resource.title}
                        </h4>
                      </div>
                      
                      <p style={{ color: COLORS.textLight, fontSize: '14px', margin: '5px 0' }}>
                        {resource.description}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                        <span style={styles.resourceType}>{resource.type}</span>
                        <span style={styles.resourceLevel}>Level {resource.level}</span>
                        {resource.inClass && (
                          <span style={styles.resourceInClass}>En classe</span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.primary }}>
                        {resource.price}€
                      </div>
                      {resource.link && (
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: COLORS.primary, textDecoration: 'none' }}
                        >
                          {Icons.link} Lien
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
    padding: '20px',
  },
  
  // Auth
  authCard: {
    maxWidth: '400px',
    margin: '100px auto',
    background: COLORS.white,
    borderRadius: '16px',
    padding: '40px',
    boxShadow: `0 8px 32px ${COLORS.cardShadow}`,
    border: `2px solid ${COLORS.cardBorder}`,
  },
  authTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: '10px',
  },
  authSubtitle: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: '30px',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  codeDisplay: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    margin: '20px 0',
  },
  codeDot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    transition: 'all 0.3s',
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '15px',
  },
  keypadButton: {
    padding: '20px',
    fontSize: '22px',
    fontWeight: 'bold',
    background: COLORS.white,
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: COLORS.primary,
  },
  keypadButtonSecondary: {
    padding: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    background: COLORS.secondary,
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: COLORS.text,
  },
  authButton: {
    padding: '12px',
    background: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  backLink: {
    color: COLORS.textLight,
    textDecoration: 'none',
    fontSize: '14px',
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: '14px',
  },

  // Menu principal
  mainMenu: {
    maxWidth: '1000px',
    margin: '40px auto',
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '10px',
  },
  mainSubtitle: {
    color: COLORS.textLight,
    fontSize: '18px',
    marginBottom: '40px',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  menuCard: {
    background: COLORS.white,
    borderRadius: '16px',
    padding: '30px',
    border: `2px solid ${COLORS.cardBorder}`,
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: `0 4px 12px ${COLORS.cardShadow}`,
  },
  menuCardIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    color: COLORS.primary,
  },
  menuCardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '10px',
  },
  menuCardDesc: {
    color: COLORS.textLight,
    fontSize: '14px',
  },
  logoutButton: {
    background: COLORS.error,
    color: COLORS.white,
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  // Header modules
  header: {
    marginBottom: '20px',
  },
  backButton: {
    background: COLORS.white,
    color: COLORS.primary,
    padding: '10px 20px',
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Modules
  module: {
    maxWidth: '1400px',
    margin: '0 auto',
    background: COLORS.white,
    borderRadius: '16px',
    padding: '30px',
    boxShadow: `0 4px 12px ${COLORS.cardShadow}`,
    border: `2px solid ${COLORS.cardBorder}`,
  },
  moduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  moduleTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addButton: {
    background: COLORS.success,
    color: COLORS.white,
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  smallButton: {
    background: COLORS.secondary,
    color: COLORS.text,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '8px',
  },

  // Filters
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    flex: '1',
    minWidth: '200px',
    padding: '10px',
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
  },
  select: {
    padding: '10px',
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
    background: COLORS.white,
  },
  count: {
    color: COLORS.textLight,
    fontSize: '14px',
    fontWeight: 'bold',
  },

  // Tables
  tableContainer: {
    overflowX: 'auto',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: COLORS.secondary,
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: COLORS.text,
    borderBottom: `2px solid ${COLORS.cardBorder}`,
  },
  tr: {
    borderBottom: `1px solid ${COLORS.cardBorder}`,
  },
  td: {
    padding: '12px',
    color: COLORS.text,
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: COLORS.primary,
    padding: '8px',
  },
  iconButtonDanger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: COLORS.error,
    padding: '8px',
  },
  badge: {
    background: COLORS.primary,
    color: COLORS.white,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  levelBadge: {
    background: COLORS.secondary,
    color: COLORS.text,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },

  // Points control
  // Points control (plus gros boutons pour mobile)
  pointsControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pointsButton: {
    background: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    touchAction: 'manipulation', // Meilleur pour mobile
  },
  pointsValue: {
    minWidth: '40px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },

  // Budget control
  budgetControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  budgetButton: {
    background: COLORS.success,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    touchAction: 'manipulation',
  },
  budgetValue: {
    minWidth: '60px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },

  // Resource button
  resourceButton: {
    background: COLORS.secondary,
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginRight: '4px',
  },

  // Resource modal items
  resourceItem: {
    background: COLORS.white,
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    transition: 'all 0.2s',
  },
  resourceId: {
    background: COLORS.secondary,
    color: COLORS.primary,
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  resourceType: {
    background: COLORS.background,
    color: COLORS.text,
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
  },
  resourceLevel: {
    background: COLORS.primary,
    color: COLORS.white,
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  resourceInClass: {
    background: COLORS.warning,
    color: COLORS.white,
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },

  // Responsive Views
  desktopView: {
    display: 'block',
  },
  mobileView: {
    display: 'none',
  },

  // Mobile Cards (Cartes équipes)
  equipeCard: {
    background: COLORS.white,
    border: `3px solid ${COLORS.cardBorder}`,
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: `0 4px 15px ${COLORS.cardShadow}`,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${COLORS.secondary}`,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardHeaderRight: {
    display: 'flex',
    gap: '8px',
  },
  equipeNumero: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: '4px',
  },
  equipeMembres: {
    fontSize: '14px',
    color: COLORS.textLight,
  },
  cardRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  cardRowItem: {
    flex: 1,
  },
  cardLabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  cardSection: {
    marginBottom: '16px',
  },
  badgeMobile: {
    display: 'inline-block',
    background: COLORS.primary,
    color: COLORS.white,
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  
  // Mobile Controls
  budgetControlMobile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'center',
  },
  budgetButtonMobile: {
    background: COLORS.success,
    color: COLORS.white,
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    touchAction: 'manipulation',
    minWidth: '60px',
  },
  budgetValueMobile: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    minWidth: '70px',
    textAlign: 'center',
  },
  pointsControlMobile: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'center',
  },
  pointsButtonMobile: {
    background: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '12px',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    fontSize: '28px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    touchAction: 'manipulation',
    boxShadow: `0 2px 8px ${COLORS.cardShadow}`,
  },
  pointsValueMobile: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    minWidth: '50px',
    textAlign: 'center',
  },
  resourceButtonMobile: {
    background: COLORS.secondary,
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  // PIN Code
  pinCode: {
    background: COLORS.secondary,
    color: COLORS.primaryDark,
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  pinCodeMobile: {
    display: 'inline-block',
    background: COLORS.secondary,
    color: COLORS.primaryDark,
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  // Évaluation des séances
  evaluationPanel: {
    background: COLORS.white,
    borderRadius: '12px',
    padding: '20px',
    border: `2px solid ${COLORS.cardBorder}`,
  },
  evaluationTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  evalTh: {
    background: COLORS.primary,
    color: COLORS.white,
    padding: '10px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
    border: `1px solid ${COLORS.primaryDark}`,
  },
  evalTr: {
    borderBottom: `1px solid ${COLORS.cardBorder}`,
  },
  evalTd: {
    padding: '12px 8px',
    textAlign: 'center',
    border: `1px solid ${COLORS.cardBorder}`,
  },
  evalSelect: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: `2px solid ${COLORS.primary}`,
    background: COLORS.white,
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    cursor: 'pointer',
    width: '60px',
    textAlign: 'center',
  },
  
  // Évaluation Mobile
  evaluationPanelMobile: {
    background: '#F0F8FF',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
    border: `2px solid ${COLORS.primary}`,
  },
  memberEvalCard: {
    background: COLORS.white,
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    border: `1px solid ${COLORS.cardBorder}`,
  },
  sessionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  sessionItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sessionLabel: {
    fontSize: '11px',
    color: COLORS.textLight,
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  evalSelectMobile: {
    padding: '8px',
    borderRadius: '8px',
    border: `2px solid ${COLORS.primary}`,
    background: COLORS.white,
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
  },


  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: COLORS.white,
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: `0 8px 32px ${COLORS.cardShadow}`,
  },
  modalHeader: {
    padding: '20px',
    borderBottom: `2px solid ${COLORS.cardBorder}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: COLORS.textLight,
  },
  modalBody: {
    padding: '20px',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: `1px solid ${COLORS.cardBorder}`,
  },
  cancelButton: {
    background: COLORS.secondary,
    color: COLORS.text,
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  saveButton: {
    background: COLORS.success,
    color: COLORS.white,
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Forms
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  input: {
    width: '100%',
    padding: '10px',
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  membreRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  removeButton: {
    background: COLORS.error,
    color: COLORS.white,
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
  },
  addMemberButton: {
    background: COLORS.secondary,
    color: COLORS.text,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '8px',
  },

  // Classe selection
  classeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  classeCard: {
    background: COLORS.white,
    border: `2px solid ${COLORS.cardBorder}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
  },

  // Loading & notification
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: COLORS.success,
    color: COLORS.white,
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: `0 4px 12px ${COLORS.cardShadow}`,
    zIndex: 2000,
    fontWeight: 'bold',
  },
};
