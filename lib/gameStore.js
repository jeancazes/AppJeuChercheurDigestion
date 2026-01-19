// lib/gameStore.js - Store partagé pour la synchronisation des données
// En production, connecter à Firebase, Supabase ou une autre BDD temps réel

import React from 'react';

// Couleurs du thème médical
export const COLORS = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  secondary: '#E3F2FD',
  background: '#F8FCFF',
  white: '#FFFFFF',
  textDark: '#1A365D',
  textLight: '#64748B',
  success: '#4CAF50',
  error: '#EF5350',
  warning: '#FFC107',
  cardShadow: 'rgba(79, 195, 247, 0.15)',
  cardBorder: '#B3E5FC',
};

// Configuration des niveaux
export const LEVEL_CONFIG = {
  1: { title: 'Stagiaire', budget: 100, access: 'Observations et livres', repRequired: 0 },
  2: { title: 'Interne', budget: 200, access: 'Dissections et expériences', repRequired: 5 },
  3: { title: 'Résident', budget: 500, access: 'Analyses et Doc Médical', repRequired: 10 },
  4: { title: 'Spécialiste', budget: 1000, access: 'Synthèses', repRequired: 15 },
};

// Calcul du niveau et budget en fonction de la réputation
const calculateLevelAndBudget = (reputation) => {
  let level = 1;
  let budget = 100;
  
  if (reputation >= 15) { level = 4; budget = 1000; }
  else if (reputation >= 10) { level = 3; budget = 500; }
  else if (reputation >= 5) { level = 2; budget = 200; }
  
  return { level, budget };
};

// Ressources du jeu (basées sur le CSV)
export const RESOURCES = [
  // === NIVEAU 1 ===
  { id: 'r1', level: 1, type: 'Ressources anatomique', title: 'Modèle anatomique 3D', description: "Un site pour l'anatomie humaine en 3D", price: 50, linkTitle: 'Zygote Body', link: 'https://zygotebody.com/', inClass: false },
  { id: 'r2', level: 1, type: 'Ressources anatomique', title: 'AIDE 3D : Système digestif', description: "En plus de la planche d'anatomie précédente", price: 200, linkTitle: 'AIDE 3D', link: 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u', inClass: false },
  { id: 'r3', level: 1, type: 'Ressources anatomique', title: 'AIDE 3D : Bile Pancréas', description: "Aide pour mieux comprendre le trajet de la bile", price: 200, linkTitle: 'AIDE 3D', link: 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u', inClass: false },
  { id: 'r4', level: 1, type: 'Ressources anatomique', title: 'Modèle anatomique (plastique)', description: "Utiliser le modèle en plastique présent dans la salle", price: 20, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r5', level: 1, type: 'Ressources anatomique', title: 'Squelette', description: "Utiliser le squelette présent dans la salle", price: 20, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r6', level: 1, type: 'Ressources pour observations', title: 'Microscope et préparations', description: "Microscope et préparations pour l'observation", price: 70, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r7', level: 1, type: 'Ressources pour observations', title: 'Loupes binoculaires', description: "Loupes binoculaires pour observations", price: 50, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r8', level: 1, type: 'Ressources pour observations', title: 'Dissection (virtuelle)', description: "Dissections virtuelles disponibles", price: 150, linkTitle: 'Dissections virtuelles', link: 'https://tube-sciences-technologies.apps.education.fr/w/cSTMHDW3XVuPbp2fLvj8zH', inClass: false },
  { id: 'r9', level: 1, type: 'Ressources pour observations', title: 'Observation de selles animales', description: "Photographie commentée de comparaisons", price: 20, linkTitle: 'Aide Selles animales', link: 'https://drive.google.com/file/d/18T_L__BbwAa7huC0I7XsAkPOvBDo2vqi/view?usp=sharing', inClass: false },
  { id: 'r10', level: 1, type: 'Ressources historiques', title: 'Expériences historiques', description: "Expériences historiques sur la digestion", price: 70, linkTitle: 'Documents', link: 'https://www.pedagogie.ac-nantes.fr/medias/fichier/experiences_1459779287861-pdf?INLINE=FALSE', inClass: false },
  { id: 'r11', level: 1, type: 'Ressources documentaires', title: 'Articles sur les selles', description: "Article grand public sur la santé", price: 10, linkTitle: 'Livi.fr', link: 'https://www.livi.fr/en-bonne-sante/selles/', inClass: false },
  { id: 'r12', level: 1, type: 'Ressources documentaires', title: 'Analyse composition aliments', description: "Analyse des étiquettes alimentaires", price: 10, linkTitle: 'Échantillons', link: '', inClass: true },
  { id: 'r13', level: 1, type: 'Ressources documentaires', title: 'Article divertissement', description: "Comment avoir un ventre plat", price: 10, linkTitle: 'Article Elle', link: 'https://www.elle.fr/Minceur/News/Nutrition-Sante/Microbiote-Comment-les-prebiotiques-equilibrent-la-flore-intestinale-3735125', inClass: false },
  { id: 'r38', level: 1, type: 'Ressources pour observations', title: 'Observations quotidiennes', description: "Notes sur les soucis de digestion", price: 10, linkTitle: 'Observations', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/ObsQuot.pdf', inClass: false },
  { id: 'r41', level: 1, type: 'Aides', title: 'Comment faire une copie écran', description: "Aide pour faire une copie d'écran", price: 10, linkTitle: 'Copie ecran', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/CopieEcran.pdf', inClass: false },
  { id: 'r42', level: 1, type: 'Aides', title: 'Rappel démarche scientifique', description: "Aide pour la démarche scientifique", price: 10, linkTitle: 'Démarche', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/DemSc.pdf', inClass: false },
  // === NIVEAU 2 ===
  { id: 'r14', level: 2, type: 'Examens médicaux (vidéos)', title: 'Vidéo déglutition - radiographie', description: "Observation aux rayons X", price: 50, linkTitle: 'Radiographie', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/X-ray_%20Swallow.flv', inClass: false },
  { id: 'r15', level: 2, type: 'Examens médicaux (vidéos)', title: 'Vidéo déglutition - endoscopie', description: "Caméra dans le pharynx", price: 50, linkTitle: 'Endoscopie', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Deglutition.avi', inClass: false },
  { id: 'r16', level: 2, type: 'Examens médicaux (vidéos)', title: 'Endoscopie partie supérieure', description: "Observation partie supérieure", price: 50, linkTitle: 'Endoscopie', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Endoscopie-SortieduDuodenumEstomacOesophage.flv', inClass: false },
  { id: 'r17', level: 2, type: 'Examens médicaux (vidéos)', title: 'Rayon X tube digestif', description: "Observation de la digestion aux rayons X", price: 70, linkTitle: 'Radiographie', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Trajetdesaliments.flv', inClass: false },
  { id: 'r18', level: 2, type: 'Examens médicaux (vidéos)', title: 'Examens estomac', description: "Documentaire sur l'estomac", price: 100, linkTitle: 'Vidéos estomac', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Estomac.flv', inClass: false },
  { id: 'r19', level: 2, type: 'Examens médicaux (vidéos)', title: 'Examens intestin grêle', description: "Documentaire intestin grêle", price: 100, linkTitle: 'Vidéos intestin', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/IntestinGrele.flv', inClass: false },
  { id: 'r20', level: 2, type: 'Examens médicaux (vidéos)', title: 'Examens gros intestin', description: "Documentaire sur le colon", price: 100, linkTitle: 'Vidéos colon', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/GrosIntestin.flv', inClass: false },
  { id: 'r21', level: 2, type: 'Examens médicaux (vidéos)', title: 'Examens bouche', description: "Documentaire sur la bouche", price: 100, linkTitle: 'Vidéos bouche', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Bouche.flv', inClass: false },
  { id: 'r22', level: 2, type: 'Ressources pour observations', title: 'Lames bactéries microbiote', description: "Frottis de contenu intestinal", price: 100, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r23', level: 2, type: 'Ressources expérimentales', title: 'Kit Digestion in-vitro', description: "Expérience digestion in-vitro", price: 150, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r24', level: 2, type: 'Ressources expérimentales', title: 'Résultats dissection', description: "Photos commentées dissection souris", price: 200, linkTitle: 'Vidéo dissection', link: 'https://echapot.wixsite.com/svtaubrac/copie-de-la-digestion', inClass: false },
  { id: 'r25', level: 2, type: 'Ressources expérimentales', title: 'Digestion micro-organismes', description: "Expérience avec micro-organismes", price: 150, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r26', level: 2, type: 'Résultats analyses', title: 'Analyse des liquides', description: "Étiquettes de composition boissons", price: 20, linkTitle: 'Analyse liquides', link: 'https://drive.google.com/file/d/1sVQvDo0hxTbQ_zeJlJB37IB-j3tgyuVI/view?usp=sharing', inClass: false },
  { id: 'r27', level: 2, type: 'Résultats analyses', title: 'Composition aliments', description: "Étiquettes composition aliments", price: 20, linkTitle: 'Analyse', link: 'http://www.lanutrition.fr/les-aliments-a-la-loupe.html?layout=advanced', inClass: false },
  { id: 'r28', level: 2, type: 'Aides', title: 'Rappel surfaces échanges', description: "Rappel sur les surfaces d'échanges", price: 10, linkTitle: 'Document', link: '', inClass: true },
  { id: 'r29', level: 2, type: 'Aides', title: 'Aide calcul surface', description: "Aide pour calculs mathématiques", price: 50, linkTitle: 'Document', link: '', inClass: true },
  { id: 'r30', level: 2, type: 'Aides', title: 'Aide glucides', description: "Simplification des glucides", price: 10, linkTitle: 'Schéma glucides', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/SchémaGlucidesSVT.pdf', inClass: false },
  { id: 'r31', level: 2, type: 'Aides', title: 'Aide enzymes', description: "Comment les enzymes agissent", price: 20, linkTitle: 'Aide enzymes', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/AIDE-Enzymes.pdf', inClass: false },
  { id: 'r35', level: 2, type: 'Ressources documentaires', title: 'Fiche maladies bile', description: "Informations sur les maladies", price: 30, linkTitle: 'Maladie Bile', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/MaladieBile.pdf', inClass: false },
  { id: 'r36', level: 2, type: 'Ressources anatomique', title: 'Fiche pancréas vésicule', description: "Schéma pancréas et vésicule", price: 30, linkTitle: 'Pancréas Anat', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/pancreas-anat.jpg', inClass: false },
  { id: 'r37', level: 2, type: 'Ressources anatomique', title: 'Fiche organes système digestif', description: "Schéma dense en information", price: 20, linkTitle: 'Planche anat', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/planche-Anat-Syst-Dig.pdf', inClass: false },
  // === NIVEAU 3 ===
  { id: 'r32', level: 3, type: 'Résultats analyses', title: 'Pack analyses urine et sang', description: "Résultats analyse sang et urine", price: 50, linkTitle: 'Analyse', link: 'https://drive.google.com/file/d/1sBl1LLbC_BhH-ZOyGP008mBh8n5klUtD/view?usp=sharing', inClass: false },
  { id: 'r33', level: 3, type: 'Résultats analyses', title: 'Comparaison sucre intestin', description: "Concentration sucre avant/après", price: 100, linkTitle: 'Analyse sucre', link: 'https://drive.google.com/file/d/0Bzssu-9nqRWyNDlWRVlZS2xjc2c/view?usp=sharing&resourcekey=0-AWgsNgAwurPIEkMdoQeW7Q', inClass: false },
  { id: 'r34', level: 3, type: 'Résultats analyses', title: 'Mesure nutriments tube digestif', description: "Schéma interprétation résultats", price: 300, linkTitle: 'Tablette enseignant', link: '', inClass: true },
  // === NIVEAU 4 ===
  { id: 'r40', level: 4, type: 'Ressources documentaires', title: 'Recherche documentaire', description: "Recherche précise et différente", price: 300, linkTitle: 'Recherche Internet', link: 'https://www.ecosia.org/?c=fr', inClass: false },
];

const createGameStore = () => {
  let data = {
    classes: [
      { id: '5a', name: '5ème A', anneeScolaire: '2024-2025' },
      { id: '5b', name: '5ème B', anneeScolaire: '2024-2025' },
      { id: '5c', name: '5ème C', anneeScolaire: '2024-2025' },
      { id: '4a', name: '4ème A', anneeScolaire: '2024-2025' },
      { id: '4b', name: '4ème B', anneeScolaire: '2024-2025' },
    ],
    equipes: [
      { id: 'e1', classeId: '5a', numero: 1, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e2', classeId: '5a', numero: 2, membres: ['Élève 1', 'Élève 2', 'Élève 3'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e3', classeId: '5a', numero: 3, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e4', classeId: '5a', numero: 4, membres: ['Élève 1', 'Élève 2', 'Élève 3'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e5', classeId: '5b', numero: 1, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e6', classeId: '5b', numero: 2, membres: ['Élève 1', 'Élève 2', 'Élève 3'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e7', classeId: '5b', numero: 3, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e8', classeId: '5c', numero: 1, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e9', classeId: '5c', numero: 2, membres: ['Élève 1', 'Élève 2', 'Élève 3'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e10', classeId: '4a', numero: 1, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e11', classeId: '4a', numero: 2, membres: ['Élève 1', 'Élève 2', 'Élève 3'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e12', classeId: '4b', numero: 1, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e13', classeId: '4b', numero: 2, membres: ['Élève 1', 'Élève 2'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
    ],
    resources: RESOURCES,
  };

  const listeners = new Set();
  const notify = () => listeners.forEach(fn => fn());
  const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

  return {
    getClasses: () => [...data.classes],
    getClasseInfo: (classeId) => data.classes.find(c => c.id === classeId) || null,
    getEquipesByClasse: (classeId) => data.equipes.filter(e => e.classeId === classeId),
    getEquipe: (equipeId) => { const e = data.equipes.find(eq => eq.id === equipeId); return e ? { ...e } : null; },
    getResource: (resourceId) => data.resources.find(r => r.id === resourceId) || null,
    getResources: () => [...data.resources],
    getResourcesByLevel: (level) => data.resources.filter(r => r.level <= level),
    getResourceTypes: () => [...new Set(data.resources.map(r => r.type))].sort(),

    updateEquipe: (equipeId, updates) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return false;
      Object.assign(equipe, updates);
      notify();
      return true;
    },

    addReputation: (equipeId, type, amount = 1) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return false;
      if (type === 'decouvertes') equipe.reputationDecouvertes += amount;
      else if (type === 'raisonnement') equipe.reputationRaisonnement += amount;
      equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;
      const { level, budget } = calculateLevelAndBudget(equipe.reputation);
      const previousLevel = equipe.level;
      equipe.level = level;
      if (level > previousLevel) {
        const budgetDiff = budget - LEVEL_CONFIG[previousLevel].budget;
        equipe.budget += budgetDiff;
      }
      notify();
      return true;
    },

    purchaseResource: (equipeId, resourceId) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      const resource = data.resources.find(r => r.id === resourceId);
      if (!equipe || !resource) return { success: false, error: 'Équipe ou ressource introuvable' };
      if (equipe.purchasedResources.includes(resourceId)) return { success: false, error: 'Ressource déjà achetée' };
      if (resource.level > equipe.level) return { success: false, error: 'Niveau insuffisant' };
      if (resource.price > equipe.budget) return { success: false, error: 'Budget insuffisant' };
      equipe.budget -= resource.price;
      equipe.purchasedResources.push(resourceId);
      notify();
      return { success: true, resource };
    },

    addClass: (name, anneeScolaire) => {
      const newId = 'classe_' + Date.now();
      const newClasse = { id: newId, name, anneeScolaire };
      data.classes.push(newClasse);
      notify();
      return newClasse;
    },

    updateClasse: (classeId, updates) => {
      const classe = data.classes.find(c => c.id === classeId);
      if (!classe) return false;
      Object.assign(classe, updates);
      notify();
      return true;
    },

    deleteClasse: (classeId) => {
      const classeIndex = data.classes.findIndex(c => c.id === classeId);
      if (classeIndex === -1) return false;
      data.equipes = data.equipes.filter(e => e.classeId !== classeId);
      data.classes.splice(classeIndex, 1);
      notify();
      return true;
    },

    addEquipe: (classeId, membres = []) => {
      const equipesClasse = data.equipes.filter(e => e.classeId === classeId);
      const maxNumero = equipesClasse.length > 0 ? Math.max(...equipesClasse.map(e => e.numero)) : 0;
      const newId = 'equipe_' + Date.now();
      const newEquipe = {
        id: newId, classeId, numero: maxNumero + 1,
        membres: membres.length > 0 ? membres : ['Élève 1', 'Élève 2'],
        level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [],
      };
      data.equipes.push(newEquipe);
      notify();
      return newEquipe;
    },

    deleteEquipe: (equipeId) => {
      const equipeIndex = data.equipes.findIndex(e => e.id === equipeId);
      if (equipeIndex === -1) return false;
      data.equipes.splice(equipeIndex, 1);
      notify();
      return true;
    },

    // ★★★ REMISE À ZÉRO AVEC EFFACEMENT DES NOMS ★★★
    resetAllEquipes: () => {
      data.equipes.forEach(equipe => {
        equipe.level = 1;
        equipe.budget = 100;
        equipe.reputation = 0;
        equipe.reputationDecouvertes = 0;
        equipe.reputationRaisonnement = 0;
        equipe.purchasedResources = [];
        equipe.membres = ['Élève 1', 'Élève 2']; // Efface les noms
      });
      notify();
      return true;
    },

    resetClasseEquipes: (classeId) => {
      data.equipes.forEach(equipe => {
        if (equipe.classeId === classeId) {
          equipe.level = 1;
          equipe.budget = 100;
          equipe.reputation = 0;
          equipe.reputationDecouvertes = 0;
          equipe.reputationRaisonnement = 0;
          equipe.purchasedResources = [];
          equipe.membres = ['Élève 1', 'Élève 2']; // Efface les noms
        }
      });
      notify();
      return true;
    },

    subscribe,
  };
};

let gameStoreInstance = null;

export const getGameStore = () => {
  if (typeof window !== 'undefined') {
    if (!window.__gameStore) window.__gameStore = createGameStore();
    return window.__gameStore;
  }
  if (!gameStoreInstance) gameStoreInstance = createGameStore();
  return gameStoreInstance;
};

export const useGameStore = () => {
  const [, forceUpdate] = React.useState({});
  const store = getGameStore();
  React.useEffect(() => store.subscribe(() => forceUpdate({})), [store]);
  return store;
};

export default getGameStore();
