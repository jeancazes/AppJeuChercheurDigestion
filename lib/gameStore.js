// lib/gameStore.js - Store partagé pour la synchronisation des données
// En production, connecter à Firebase, Supabase ou une autre BDD temps réel

// Données des ressources issues du CSV
const RESOURCES = [
  { id: 'r1', level: 2, type: 'examens médicaux (vidéos)', title: 'Vidéo de déglutition - radiographie', description: 'On observe une personne qui mâche et avale aux rayons X (radiographie)', price: 50, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/X-ray_%20Swallow.flv' },
  { id: 'r2', level: 2, type: 'examens médicaux (vidéos)', title: 'Vidéo de déglutition - endoscopie', description: 'Une caméra descend dans le pharynx, on observe la déglutition. + modèle explicatif', price: 50, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Deglutition.avi' },
  { id: 'r3', level: 2, type: 'examens médicaux (vidéos)', title: 'Endoscopie de la partie supérieure du système digestif', description: 'Une caméra descend dans le tube digestif, on observe la partie supérieure du système digestif.', price: 50, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Endoscopie-SortieduDuodenumEstomacOesophage.flv' },
  { id: 'r4', level: 2, type: 'examens médicaux (vidéos)', title: 'Vidéo au rayon X du tube digestif en fonctionnement', description: 'On observe une personne qui digère aux rayons X (radiographie) une pâte opaque aux rayons.', price: 70, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Trajetdesaliments.flv' },
  { id: 'r5', level: 2, type: 'examens médicaux (vidéos)', title: 'Divers examens de l\'estomac', description: 'Extrait de vidéo documentaire sur l\'estomac', price: 100, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Estomac.flv' },
  { id: 'r6', level: 2, type: 'examens médicaux (vidéos)', title: 'Divers examens de l\'intestin grêle', description: 'Extrait de vidéo documentaire sur l\'intestin grêle.', price: 100, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/IntestinGrele.flv' },
  { id: 'r7', level: 2, type: 'examens médicaux (vidéos)', title: 'Divers examens du gros intestin', description: 'Extrait de vidéo documentaire sur le colon', price: 100, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/GrosIntestin.flv' },
  { id: 'r8', level: 2, type: 'examens médicaux (vidéos)', title: 'Divers examens au niveau de la bouche', description: 'Extrait de vidéo documentaire sur la bouche', price: 100, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Bouche.flv' },
  { id: 'r9', level: 1, type: 'Ressources anatomique', title: 'Modèle anatomique 3D', description: 'Un site pour l\'anatomie humaine en 3D', price: 50, link: 'https://zygotebody.com/' },
  { id: 'r10', level: 1, type: 'Ressources anatomique', title: 'AIDE 3D : Système digestif', description: 'aide : que le système digestif', price: 200, link: 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u' },
  { id: 'r11', level: 1, type: 'Ressources anatomique', title: 'AIDE 3D : Bile Pancréas', description: 'aide : "pour mieux comprendre le trajet de la bile et des sucs pancréatiques"', price: 200, link: 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u' },
  { id: 'r12', level: 1, type: 'Ressources anatomique', title: 'Modèle anatomique (plastique)', description: 'Utiliser le modèle en plastique présent dans la salle', price: 20, link: '', inClass: true },
  { id: 'r13', level: 1, type: 'Ressources anatomique', title: 'Squelette', description: 'Utiliser le squelette présent dans la salle', price: 20, link: '', inClass: true },
  { id: 'r14', level: 1, type: 'Ressources pour observations', title: 'Microscope et préparations microscopiques', description: 'Microscope et préparations microscopiques (lames minces) pour l\'observation de diverses parties du corps (peau, foie, pancréas, intestins, …)', price: 70, link: '', inClass: true },
  { id: 'r15', level: 1, type: 'Ressources pour observations', title: 'Loupes binoculaires', description: '', price: 50, link: '', inClass: true },
  { id: 'r16', level: 1, type: 'Ressources pour observations', title: 'Dissection (poulet, lapin, …)', description: 'Attention une requête doit être formulée une semaine avant …', price: 150, link: 'https://tube-sciences-technologies.apps.education.fr/w/cSTMHDW3XVuPbp2fLvj8zH' },
  { id: 'r17', level: 1, type: 'Ressources pour observations', title: 'Observation de selles animales', description: 'Photographie commentée de comparaisons de selles animales', price: 20, link: 'https://drive.google.com/file/d/18T_L__BbwAa7huC0I7XsAkPOvBDo2vqi/view?usp=sharing' },
  { id: 'r18', level: 2, type: 'Ressources pour observations', title: 'Lames minces de bactéries de la flore intestinales (microbiote)', description: 'Frottis de contenu intestinal coloré pour détecter les Bactéries', price: 100, link: '', inClass: true },
  { id: 'r19', level: 1, type: 'Ressources historiques', title: 'Expériences historiques Réaumur, Spallanzani, Beaumont', description: 'Un fichier regroupant des expériences historiques sur la digestion (contexte, expériences, résultats obtenus …)', price: 70, link: 'https://www.pedagogie.ac-nantes.fr/medias/fichier/experiences_1459779287861-pdf?INLINE=FALSE' },
  { id: 'r20', level: 2, type: 'Ressources expérimentales', title: 'Protocole + kit Digestion in-vitro', description: 'Du matériel et une fiche permettant de faire une expérience de digestion in-vitro. ** A demander une semaine avant **', price: 150, link: '', inClass: true },
  { id: 'r21', level: 2, type: 'Ressources expérimentales', title: 'Résultats de dissection de système digestif', description: 'Un site où vous retrouverez des photos commentées des étapes de la dissection d\'une souris.', price: 200, link: 'https://echapot.wixsite.com/svtaubrac/copie-de-la-digestion' },
  { id: 'r22', level: 2, type: 'Ressources expérimentales', title: 'Expérience de digestion par des micro-organismes', description: 'Du matériel et une fiche permettant de faire une expérience où des micro-organismes digèrent des aliments.', price: 150, link: '', inClass: true },
  { id: 'r23', level: 3, type: 'Résultats d\'analyses médicales', title: 'Pack d\'analyses : analyse d\'urine et analyse de sang', description: 'Des documents relatant les résultats d\'analyse de sang et d\'analyses d\'urine - un tableau comparatif peut être imprimé', price: 50, link: 'https://drive.google.com/file/d/1sBl1LLbC_BhH-ZOyGP008mBh8n5klUtD/view?usp=sharing' },
  { id: 'r24', level: 2, type: 'Résultats d\'analyses médicales', title: 'Analyse des liquides (eau minérale, jus de fruit, ...)', description: 'Différentes étiquettes de composition de boissons.', price: 20, link: 'https://drive.google.com/file/d/1sVQvDo0hxTbQ_zeJlJB37IB-j3tgyuVI/view?usp=sharing' },
  { id: 'r25', level: 3, type: 'Résultats d\'analyses médicales', title: 'Comparaison de la concentration en sucre avant et après l\'intestin grêle', description: 'Résultat d\'expérience et graphique', price: 100, link: 'https://drive.google.com/file/d/0Bzssu-9nqRWyNDlWRVlZS2xjc2c/view?usp=sharing&resourcekey=0-AWgsNgAwurPIEkMdoQeW7Q' },
  { id: 'r26', level: 3, type: 'Résultats d\'analyses médicales', title: 'Mesure chimique des quantités de nutriments tout le long du tube digestif', description: 'Schéma d\'interprétation de résultats', price: 300, link: '', inClass: true },
  { id: 'r27', level: 2, type: 'Résultats d\'analyses médicales', title: 'Analyse de la composition des aliments', description: 'Différentes étiquettes de composition d\'aliments.', price: 20, link: 'http://www.lanutrition.fr/les-aliments-a-la-loupe.html?layout=advanced' },
  { id: 'r28', level: 1, type: 'Ressources documentaires', title: 'Articles de presse sur les selles', description: 'Un article grand public qui permet de tester sa santé en observant l\'état de ses selles.', price: 10, link: 'https://www.livi.fr/en-bonne-sante/selles/' },
  { id: 'r29', level: 1, type: 'Ressources documentaires', title: 'Analyse de composition des aliments', description: 'L\'analyse des étiquettes alimentaires devrait permettre de trouver de quoi sont composé les aliments ou quels sont les 7 nutriments.', price: 10, link: '', inClass: true },
  { id: 'r30', level: 4, type: 'Ressources documentaires', title: 'Recherche documentaire (livre, internet, …)', description: 'Sur la fiche de requête, le sujet de recherche doit être très précis et différent du problème à résoudre.', price: 300, link: 'https://www.ecosia.org/?c=fr' },
  { id: 'r31', level: 2, type: 'Aides', title: 'Rappel sur les surfaces d\'échanges', description: 'Vous regardez dans vos anciens cours pour vous souvenir ce qu\'est une surface d\'échanges.', price: 10, link: '', inClass: true },
  { id: 'r32', level: 2, type: 'Aides', title: 'Aides calcul surface intestin', description: 'Vous demandez de l\'aide à un collègue de labo qui est plutôt doué pour ces questions de Math…', price: 50, link: '', inClass: true },
  { id: 'r33', level: 1, type: 'Ressources documentaires', title: 'Article de presse de divertissement', description: 'Comment avoir un ventre plat !', price: 10, link: 'https://www.elle.fr/Minceur/News/Nutrition-Sante/Microbiote-Comment-les-prebiotiques-equilibrent-la-flore-intestinale-3735125' },
  { id: 'r34', level: 1, type: 'Ressources pour observations', title: 'Observations quotidiennes sur la digestion', description: 'Des notes rédigées par des personnes sur leurs soucis de digestion', price: 10, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/ObsQuot.pdf' },
  { id: 'r35', level: 2, type: 'Aides', title: 'Aide sur simplification des glucides', description: 'Vous plongez dans vos anciens cours de chimie pour retrouver comment les aliments sont simplifiés en nutriments solubles', price: 10, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/SchémaGlucidesSVT.pdf' },
  { id: 'r36', level: 2, type: 'Aides', title: 'Aides sur les enzymes', description: 'Vous retrouvez vos anciens cours de biochimie pour comprendre comment les enzymes agissent.', price: 20, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/AIDE-Enzymes.pdf' },
  { id: 'r37', level: 1, type: 'Aides', title: 'Comment faire une copie d\'écran', description: 'Une aide pour comprendre comment faire une copie d\'écran et pouvoir ajouter l\'impression sur le carnet d\'investigation', price: 10, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/CopieEcran.pdf' },
  { id: 'r38', level: 1, type: 'Aides', title: 'Rappel sur la démarche scientifique', description: 'Une aide pour retrouver les étapes de la démarche scientifique et comment remplir le livret d\'investigation', price: 10, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/DemSc.pdf' },
  { id: 'r39', level: 2, type: 'Ressources documentaires', title: 'Fiche sur les maladies en rapport avec la bile', description: 'Une fiche avec des informations sur les maladies en rapport avec la bile', price: 30, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/MaladieBile.pdf' },
  { id: 'r40', level: 2, type: 'Ressources anatomique', title: 'Une fiche anatomique sur le pancréas et la vésicule biliaire', description: 'Un schéma pour retrouver le fonctionnement du pancréas et de la vésicule biliaire', price: 30, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/pancreas-anat.jpg' },
  { id: 'r41', level: 2, type: 'Ressources anatomique', title: 'Une fiche anatomique des organes du système digestif', description: 'Un schéma très dense en information sur les noms des différents organes', price: 20, link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/planche-Anat-Syst-Dig.pdf' },
];

// Configuration des niveaux
const LEVEL_CONFIG = {
  1: { title: 'Stagiaire', budget: 100, access: 'Observations et livres', repRequired: 0 },
  2: { title: 'Interne', budget: 200, access: 'Dissections et expériences', repRequired: 5 },
  3: { title: 'Résident', budget: 500, access: 'Analyses et Doc Médical', repRequired: 10 },
  4: { title: 'Spécialiste', budget: 1000, access: 'Synthèses', repRequired: 15 },
};

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
      // 5ème A
      { id: 'e1', classeId: '5a', numero: 1, membres: ['Marie Curie', 'Louis Pasteur'], level: 2, budget: 180, reputation: 6, reputationDecouvertes: 3, reputationRaisonnement: 3, purchasedResources: ['r10', 'r41'] },
      { id: 'e2', classeId: '5a', numero: 2, membres: ['Albert Einstein', 'Isaac Newton', 'Galilée'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e3', classeId: '5a', numero: 3, membres: ['Charles Darwin', 'Gregor Mendel'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e4', classeId: '5a', numero: 4, membres: ['Marie Sklodowska', 'Rosalind Franklin', 'Ada Lovelace'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 5ème B
      { id: 'e5', classeId: '5b', numero: 1, membres: ['Archimède', 'Pythagore'], level: 1, budget: 100, reputation: 2, reputationDecouvertes: 1, reputationRaisonnement: 1, purchasedResources: [] },
      { id: 'e6', classeId: '5b', numero: 2, membres: ['Hippocrate', 'Avicenne', 'Galien'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 5ème C
      { id: 'e7', classeId: '5c', numero: 1, membres: ['Claude Bernard', 'Antoine Lavoisier'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 4ème A
      { id: 'e8', classeId: '4a', numero: 1, membres: ['James Watson', 'Francis Crick'], level: 3, budget: 400, reputation: 12, reputationDecouvertes: 6, reputationRaisonnement: 6, purchasedResources: ['r9', 'r19', 'r23'] },
      { id: 'e9', classeId: '4a', numero: 2, membres: ['Linus Pauling', 'Barbara McClintock'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 4ème B
      { id: 'e10', classeId: '4b', numero: 1, membres: ['Alexander Fleming', 'Jonas Salk', 'Edward Jenner'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
    ],
    resources: RESOURCES,
  };

  let subscribers = [];

  const notify = () => {
    subscribers.forEach(cb => cb());
  };

  const subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(cb => cb !== callback);
    };
  };

  const calculateLevel = (reputation) => {
    if (reputation >= 15) return 4;
    if (reputation >= 10) return 3;
    if (reputation >= 5) return 2;
    return 1;
  };

  const calculateBudget = (level, purchasedResources) => {
    const baseBudget = LEVEL_CONFIG[level].budget;
    const spent = purchasedResources.reduce((total, resId) => {
      const resource = RESOURCES.find(r => r.id === resId);
      return total + (resource ? resource.price : 0);
    }, 0);
    return baseBudget - spent;
  };

  return {
    // Getters
    getClasses: () => [...data.classes],
    
    getEquipesByClasse: (classeId) => data.equipes.filter(e => e.classeId === classeId),
    
    getEquipe: (equipeId) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      return equipe ? { ...equipe } : null;
    },
    
    getClasseInfo: (classeId) => {
      const classe = data.classes.find(c => c.id === classeId);
      return classe ? { ...classe } : null;
    },
    
    getResources: () => [...RESOURCES],
    
    getResourcesByLevel: (level) => RESOURCES.filter(r => r.level <= level),
    
    getResource: (resourceId) => RESOURCES.find(r => r.id === resourceId),
    
    getLevelConfig: () => ({ ...LEVEL_CONFIG }),

    // Actions
    addReputation: (equipeId, type, amount = 1) => {
      const equipeIndex = data.equipes.findIndex(e => e.id === equipeId);
      if (equipeIndex === -1) return false;

      const equipe = data.equipes[equipeIndex];
      
      if (type === 'decouvertes') {
        equipe.reputationDecouvertes += amount;
      } else if (type === 'raisonnement') {
        equipe.reputationRaisonnement += amount;
      }
      
      equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;
      
      const newLevel = calculateLevel(equipe.reputation);
      if (newLevel !== equipe.level) {
        equipe.level = newLevel;
        equipe.budget = calculateBudget(newLevel, equipe.purchasedResources);
      }

      notify();
      return true;
    },

    removeReputation: (equipeId, type, amount = 1) => {
      const equipeIndex = data.equipes.findIndex(e => e.id === equipeId);
      if (equipeIndex === -1) return false;

      const equipe = data.equipes[equipeIndex];
      
      if (type === 'decouvertes') {
        equipe.reputationDecouvertes = Math.max(0, equipe.reputationDecouvertes - amount);
      } else if (type === 'raisonnement') {
        equipe.reputationRaisonnement = Math.max(0, equipe.reputationRaisonnement - amount);
      }
      
      equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;
      
      const newLevel = calculateLevel(equipe.reputation);
      if (newLevel !== equipe.level) {
        equipe.level = newLevel;
        equipe.budget = calculateBudget(newLevel, equipe.purchasedResources);
      }

      notify();
      return true;
    },

    purchaseResource: (equipeId, resourceId) => {
      const equipeIndex = data.equipes.findIndex(e => e.id === equipeId);
      if (equipeIndex === -1) return { success: false, error: 'Équipe non trouvée' };

      const equipe = data.equipes[equipeIndex];
      const resource = RESOURCES.find(r => r.id === resourceId);
      
      if (!resource) return { success: false, error: 'Ressource non trouvée' };
      if (equipe.purchasedResources.includes(resourceId)) {
        return { success: false, error: 'Ressource déjà achetée' };
      }
      if (resource.level > equipe.level) {
        return { success: false, error: 'Niveau insuffisant' };
      }
      if (resource.price > equipe.budget) {
        return { success: false, error: 'Budget insuffisant' };
      }

      equipe.purchasedResources.push(resourceId);
      equipe.budget -= resource.price;
      
      notify();
      return { success: true, resource };
    },

    updateEquipe: (equipeId, updates) => {
      const equipeIndex = data.equipes.findIndex(e => e.id === equipeId);
      if (equipeIndex === -1) return false;

      data.equipes[equipeIndex] = { ...data.equipes[equipeIndex], ...updates };
      notify();
      return true;
    },

    // Subscription
    subscribe,
  };
};

// Singleton pattern
let gameStoreInstance = null;

export const getGameStore = () => {
  if (typeof window !== 'undefined') {
    if (!window.__gameStore) {
      window.__gameStore = createGameStore();
    }
    return window.__gameStore;
  }
  
  if (!gameStoreInstance) {
    gameStoreInstance = createGameStore();
  }
  return gameStoreInstance;
};

export const COLORS = {
  primary: '#0288D1',
  primaryLight: '#4FC3F7',
  primaryDark: '#01579B',
  secondary: '#B3E5FC',
  background: '#E1F5FE',
  white: '#FFFFFF',
  text: '#263238',
  textLight: '#546E7A',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF5350',
  cardBorder: '#B3E5FC',
  cardShadow: 'rgba(2, 136, 209, 0.1)',
};

export { LEVEL_CONFIG, RESOURCES };
