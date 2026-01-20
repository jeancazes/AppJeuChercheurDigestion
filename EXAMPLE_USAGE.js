// EXEMPLE D'UTILISATION DU GAMESTORE AVEC SUPABASE
// Copiez ce code dans vos pages React/Next.js

import { useEffect, useState } from 'react';
import { gameStore } from '../stores/GameStore';

export default function ExamplePage() {
  const [state, setState] = useState({
    selectedClass: null,
    teams: [],
    loading: false,
    error: null,
  });

  // S'abonner au store
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(setState);
    return unsubscribe;
  }, []);

  // ========================================
  // EXEMPLE 1 : CRÉER UNE CLASSE
  // ========================================
  const handleCreateClass = async () => {
    try {
      const newClass = await gameStore.createClass('2024-2025', '3ème A');
      console.log('Classe créée:', newClass);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ========================================
  // EXEMPLE 2 : CHARGER UNE CLASSE
  // ========================================
  const handleLoadClass = async (classId) => {
    try {
      await gameStore.loadClass(classId);
      console.log('Classe chargée');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ========================================
  // EXEMPLE 3 : CRÉER UNE ÉQUIPE
  // ========================================
  const handleCreateTeam = async () => {
    if (!state.selectedClass) {
      alert('Sélectionnez d\'abord une classe');
      return;
    }

    try {
      const newTeam = await gameStore.createTeam({
        classId: state.selectedClass.id,
        teamNumber: state.teams.length + 1,
        teamName: 'Les Scientifiques',
        members: ['Alice Dupont', 'Bob Martin'],
        avatarUrl: '/avatars/doctor-1.png',
      });
      console.log('Équipe créée:', newTeam);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ========================================
  // EXEMPLE 4 : AJOUTER DES POINTS DE RÉPUTATION
  // ========================================
  const handleAddPoints = async (teamId) => {
    try {
      // Ajouter 2 points de Découverte et 1 point de Raisonnement
      await gameStore.addReputationPoints(teamId, 2, 1);
      console.log('Points ajoutés');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ========================================
  // EXEMPLE 5 : ACHETER UNE RESSOURCE
  // ========================================
  const handlePurchaseResource = async (teamId) => {
    const resource = {
      level: 'LEVEL 1',
      type: 'Observation',
      title: 'Observation de cellules',
      price: 30,
      description: 'Une ressource éducative',
    };

    try {
      await gameStore.purchaseResource(teamId, resource);
      console.log('Ressource achetée');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ========================================
  // EXEMPLE 6 : LISTER TOUTES LES CLASSES
  // ========================================
  const handleListClasses = async () => {
    try {
      const classes = await gameStore.listClasses();
      console.log('Classes disponibles:', classes);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ========================================
  // EXEMPLE 7 : ACTIVER LE TEMPS RÉEL
  // ========================================
  useEffect(() => {
    if (state.selectedClass) {
      // S'abonner aux changements en temps réel
      const unsubscribe = gameStore.subscribeToChanges(state.selectedClass.id);
      
      // Se désabonner au démontage
      return unsubscribe;
    }
  }, [state.selectedClass]);

  // ========================================
  // RENDU DE L'INTERFACE
  // ========================================
  return (
    <div style={{ padding: '20px' }}>
      <h1>Exemple d'utilisation du GameStore</h1>

      {state.loading && <p>Chargement...</p>}
      {state.error && <p style={{ color: 'red' }}>Erreur : {state.error}</p>}

      <div style={{ marginTop: '20px' }}>
        <h2>Classes</h2>
        <button onClick={handleCreateClass}>Créer une classe</button>
        <button onClick={handleListClasses}>Lister les classes</button>
        
        {state.selectedClass && (
          <div>
            <h3>Classe actuelle : {state.selectedClass.class_name}</h3>
            <p>Année : {state.selectedClass.school_year}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Équipes</h2>
        <button onClick={handleCreateTeam} disabled={!state.selectedClass}>
          Créer une équipe
        </button>

        {state.teams.map(team => (
          <div key={team.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{team.team_name}</h3>
            <p>Niveau : {team.level} | Budget : {team.budget}€</p>
            <p>Points Découverte : {team.discovery_points}</p>
            <p>Points Raisonnement : {team.reasoning_points}</p>
            
            <button onClick={() => handleAddPoints(team.id)}>
              Ajouter des points
            </button>
            <button onClick={() => handlePurchaseResource(team.id)}>
              Acheter une ressource
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// UTILISATION DANS UNE PAGE NEXT.JS
// ========================================

// pages/exemple.js
// import ExamplePage from '../components/ExamplePage';
// export default ExamplePage;
