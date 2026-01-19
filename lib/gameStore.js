// gameStore.js - Store complet avec ressources et gestion des achats
// En production, connecter à Firebase/Supabase pour synchronisation temps réel

// Configuration des niveaux
const LEVEL_CONFIG = {
  1: { title: 'Stagiaire', budget: 100, access: 'Observations et livres', repRequired: 0 },
  2: { title: 'Interne', budget: 200, access: 'Dissections et expériences', repRequired: 5 },
  3: { title: 'Résident', budget: 500, access: 'Analyses et Doc Médical', repRequired: 10 },
  4: { title: 'Spécialiste', budget: 1000, access: 'Synthèses', repRequired: 15 },
};

// Calcul du niveau et budget en fonction de la réputation
const calculateLevelAndBudget = (reputation) => {
  let level = 1;
  let budget = 100;
  
  if (reputation >= 15) {
    level = 4;
    budget = 1000;
  } else if (reputation >= 10) {
    level = 3;
    budget = 500;
  } else if (reputation >= 5) {
    level = 2;
    budget = 200;
  }
  
  return { level, budget };
};

// Ressources du jeu (basées sur le CSV)
const RESOURCES = [
  // === NIVEAU 1 ===
  // Ressources anatomiques
  { id: 'r1', level: 1, type: 'Ressources anatomique', title: 'Modèle anatomique 3D', description: "Un site pour l'anatomie humaine en 3D", price: 50, linkTitle: 'Zygote Body', link: 'https://zygotebody.com/', inClass: false },
  { id: 'r2', level: 1, type: 'Ressources anatomique', title: 'AIDE 3D : Système digestif', description: "Aide : que le système digestif", price: 200, linkTitle: 'AIDE 3D : Système digestif', link: 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u', inClass: false },
  { id: 'r3', level: 1, type: 'Ressources anatomique', title: 'AIDE 3D : Bile Pancréas', description: "Aide : pour mieux comprendre le trajet de la bile et des sucs pancréatiques", price: 200, linkTitle: 'AIDE 3D : Bile Pancréas', link: 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u', inClass: false },
  { id: 'r4', level: 1, type: 'Ressources anatomique', title: 'Modèle anatomique (plastique)', description: "Utiliser le modèle en plastique présent dans la salle", price: 20, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r5', level: 1, type: 'Ressources anatomique', title: 'Squelette', description: "Utiliser le squelette présent dans la salle", price: 20, linkTitle: 'En classe', link: '', inClass: true },
  
  // Ressources pour observations
  { id: 'r6', level: 1, type: 'Ressources pour observations', title: 'Microscope et préparations microscopiques', description: "Microscope et préparations microscopiques (lames minces) pour l'observation de diverses parties du corps", price: 70, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r7', level: 1, type: 'Ressources pour observations', title: 'Loupes binoculaires', description: "Loupes binoculaires pour observations", price: 50, linkTitle: 'En classe', link: '', inClass: true },
  { id: 'r8', level: 1, type: 'Ressources pour observations', title: 'Dissection (poulet, lapin, …)', description: "Attention une requête doit être formulée une semaine avant …", price: 150, linkTitle: 'Dissections virtuelles', link: 'https://tube-sciences-technologies.apps.education.fr/w/cSTMHDW3XVuPbp2fLvj8zH', inClass: false },
  { id: 'r9', level: 1, type: 'Ressources pour observations', title: 'Observation de selles animales', description: "Photographie commentée de comparaisons de selles animales", price: 20, linkTitle: 'Aide Selles animales', link: 'https://drive.google.com/file/d/18T_L__BbwAa7huC0I7XsAkPOvBDo2vqi/view?usp=sharing', inClass: false },
  { id: 'r10', level: 1, type: 'Ressources pour observations', title: 'Observations quotidiennes sur la digestion', description: "Des notes rédigées par des personnes sur leurs soucis de digestion", price: 10, linkTitle: 'Observations quotidiennes', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/ObsQuot.pdf', inClass: false },
  
  // Ressources historiques
  { id: 'r11', level: 1, type: 'Ressources historiques', title: 'Expériences historiques (Réaumur, Spallanzani, Beaumont)', description: "Un fichier regroupant des expériences historiques sur la digestion", price: 70, linkTitle: 'Lien vers les documents', link: 'https://www.pedagogie.ac-nantes.fr/medias/fichier/experiences_1459779287861-pdf?INLINE=FALSE', inClass: false },
  
  // Ressources documentaires niveau 1
  { id: 'r12', level: 1, type: 'Ressources documentaires', title: 'Articles de presse sur les selles', description: "Un article grand public qui permet de tester sa santé en observant l'état de ses selles", price: 10, linkTitle: 'Lien article', link: 'https://www.livi.fr/en-bonne-sante/selles/', inClass: false },
  { id: 'r13', level: 1, type: 'Ressources documentaires', title: 'Analyse de composition des aliments', description: "L'analyse des étiquettes alimentaires pour trouver les 7 nutriments", price: 10, linkTitle: 'Échantillons donnés par l\'enseignant', link: '', inClass: true },
  { id: 'r14', level: 1, type: 'Ressources documentaires', title: 'Article de presse de divertissement', description: "Comment avoir un ventre plat ! Microbiote et prébiotiques", price: 10, linkTitle: 'Article Elle', link: 'https://www.elle.fr/Minceur/News/Nutrition-Sante/Microbiote-Comment-les-prebiotiques-equilibrent-la-flore-intestinale-3735125', inClass: false },
  
  // Aides niveau 1
  { id: 'r15', level: 1, type: 'Aides', title: 'Comment faire une copie d\'écran', description: "Une aide pour comprendre comment faire une copie d'écran", price: 10, linkTitle: 'Faire copie écran', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/CopieEcran.pdf', inClass: false },
  { id: 'r16', level: 1, type: 'Aides', title: 'Rappel sur la démarche scientifique', description: "Une aide pour retrouver les étapes de la démarche scientifique", price: 10, linkTitle: 'La démarche scientifique', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/DemSc.pdf', inClass: false },
  
  // === NIVEAU 2 ===
  // Examens médicaux (vidéos)
  { id: 'r17', level: 2, type: 'Examens médicaux (vidéos)', title: 'Vidéo de déglutition - radiographie', description: "On observe une personne qui mâche et avale aux rayons X", price: 50, linkTitle: 'Radiographie déglutition', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/X-ray_%20Swallow.flv', inClass: false },
  { id: 'r18', level: 2, type: 'Examens médicaux (vidéos)', title: 'Vidéo de déglutition - endoscopie', description: "Une caméra descend dans le pharynx, on observe la déglutition", price: 50, linkTitle: 'Endoscopie déglutition', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Deglutition.avi', inClass: false },
  { id: 'r19', level: 2, type: 'Examens médicaux (vidéos)', title: 'Endoscopie partie supérieure système digestif', description: "Une caméra descend dans le tube digestif", price: 50, linkTitle: 'Endoscopie supérieure', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Endoscopie-SortieduDuodenumEstomacOesophage.flv', inClass: false },
  { id: 'r20', level: 2, type: 'Examens médicaux (vidéos)', title: 'Vidéo rayon X tube digestif en fonctionnement', description: "Observation d'une personne digérant une pâte opaque aux rayons X", price: 70, linkTitle: 'Radiographie parcours aliments', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Trajetdesaliments.flv', inClass: false },
  { id: 'r21', level: 2, type: 'Examens médicaux (vidéos)', title: 'Divers examens de l\'estomac', description: "Extrait de vidéo documentaire sur l'estomac", price: 100, linkTitle: 'Vidéos estomac', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Estomac.flv', inClass: false },
  { id: 'r22', level: 2, type: 'Examens médicaux (vidéos)', title: 'Divers examens de l\'intestin grêle', description: "Extrait de vidéo documentaire sur l'intestin grêle", price: 100, linkTitle: 'Vidéos intestin grêle', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/IntestinGrele.flv', inClass: false },
  { id: 'r23', level: 2, type: 'Examens médicaux (vidéos)', title: 'Divers examens du gros intestin', description: "Extrait de vidéo documentaire sur le colon", price: 100, linkTitle: 'Vidéos Gros intestin', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/GrosIntestin.flv', inClass: false },
  { id: 'r24', level: 2, type: 'Examens médicaux (vidéos)', title: 'Divers examens au niveau de la bouche', description: "Extrait de vidéo documentaire sur la bouche", price: 100, linkTitle: 'Vidéos Bouche', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Bouche.flv', inClass: false },
  
  // Ressources pour observations niveau 2
  { id: 'r25', level: 2, type: 'Ressources pour observations', title: 'Lames minces bactéries flore intestinale', description: "Frottis de contenu intestinal coloré pour détecter les Bactéries", price: 100, linkTitle: 'En classe', link: '', inClass: true },
  
  // Ressources expérimentales niveau 2
  { id: 'r26', level: 2, type: 'Ressources expérimentales', title: 'Protocole + kit Digestion in-vitro', description: "Matériel et fiche pour une expérience de digestion in-vitro (à demander une semaine avant)", price: 150, linkTitle: 'En classe (sur protocole une semaine en avance)', link: '', inClass: true },
  { id: 'r27', level: 2, type: 'Ressources expérimentales', title: 'Résultats de dissection système digestif', description: "Photos commentées des étapes de la dissection d'une souris", price: 200, linkTitle: 'Vidéo de dissection', link: 'https://echapot.wixsite.com/svtaubrac/copie-de-la-digestion', inClass: false },
  { id: 'r28', level: 2, type: 'Ressources expérimentales', title: 'Expérience de digestion par des micro-organismes', description: "Matériel et fiche pour une expérience où des micro-organismes digèrent des aliments", price: 150, linkTitle: 'En classe (sur protocole une semaine en avance)', link: '', inClass: true },
  
  // Résultats d'analyses niveau 2
  { id: 'r29', level: 2, type: 'Résultats d\'analyses médicales', title: 'Analyse des liquides', description: "Différentes étiquettes de composition de boissons", price: 20, linkTitle: 'Analyse liquides', link: 'https://drive.google.com/file/d/1sVQvDo0hxTbQ_zeJlJB37IB-j3tgyuVI/view?usp=sharing', inClass: false },
  { id: 'r30', level: 2, type: 'Résultats d\'analyses médicales', title: 'Analyse composition des aliments', description: "Différentes étiquettes de composition d'aliments", price: 20, linkTitle: 'Analyse composition aliments', link: 'http://www.lanutrition.fr/les-aliments-a-la-loupe.html?layout=advanced', inClass: false },
  
  // Aides niveau 2
  { id: 'r31', level: 2, type: 'Aides', title: 'Rappel sur les surfaces d\'échanges', description: "Vous regardez dans vos anciens cours pour vous souvenir ce qu'est une surface d'échanges", price: 10, linkTitle: 'Document papier', link: '', inClass: true },
  { id: 'r32', level: 2, type: 'Aides', title: 'Aides calcul surface intestin', description: "Aide d'un collègue de labo doué pour les questions de Math", price: 50, linkTitle: 'Document papier', link: '', inClass: true },
  { id: 'r33', level: 2, type: 'Aides', title: 'Aide sur simplification des glucides', description: "Anciens cours de chimie sur comment les aliments sont simplifiés en nutriments solubles", price: 10, linkTitle: 'Schéma glucides SVT', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/SchémaGlucidesSVT.pdf', inClass: false },
  { id: 'r34', level: 2, type: 'Aides', title: 'Aides sur les enzymes', description: "Anciens cours de biochimie pour comprendre comment les enzymes agissent", price: 20, linkTitle: 'Aide enzymes PDF', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/AIDE-Enzymes.pdf', inClass: false },
  
  // Ressources documentaires niveau 2
  { id: 'r35', level: 2, type: 'Ressources documentaires', title: 'Fiche sur les maladies en rapport avec la bile', description: "Fiche avec des informations sur les maladies en rapport avec la bile", price: 30, linkTitle: 'Maladie Bile', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/MaladieBile.pdf', inClass: false },
  
  // Ressources anatomiques niveau 2
  { id: 'r36', level: 2, type: 'Ressources anatomique', title: 'Fiche anatomique pancréas et vésicule biliaire', description: "Schéma pour retrouver le fonctionnement du pancréas et de la vésicule biliaire", price: 30, linkTitle: 'Pancréas Anat', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/pancreas-anat.jpg', inClass: false },
  { id: 'r37', level: 2, type: 'Ressources anatomique', title: 'Fiche anatomique organes système digestif', description: "Schéma très dense en information sur les noms des différents organes", price: 20, linkTitle: 'Planche anat syst digestif', link: 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/planche-Anat-Syst-Dig.pdf', inClass: false },
  
  // === NIVEAU 3 ===
  // Résultats d'analyses niveau 3
  { id: 'r38', level: 3, type: 'Résultats d\'analyses médicales', title: 'Pack d\'analyses : urine et sang', description: "Documents relatant les résultats d'analyse de sang et d'urine", price: 50, linkTitle: 'Analyse urine et sang', link: 'https://drive.google.com/file/d/1sBl1LLbC_BhH-ZOyGP008mBh8n5klUtD/view?usp=sharing', inClass: false },
  { id: 'r39', level: 3, type: 'Résultats d\'analyses médicales', title: 'Comparaison concentration sucre avant/après intestin grêle', description: "Résultat d'expérience et graphique", price: 100, linkTitle: 'Analyse sucre intestin', link: 'https://drive.google.com/file/d/0Bzssu-9nqRWyNDlWRVlZS2xjc2c/view?usp=sharing&resourcekey=0-AWgsNgAwurPIEkMdoQeW7Q', inClass: false },
  { id: 'r40', level: 3, type: 'Résultats d\'analyses médicales', title: 'Mesure chimique nutriments tout le long du tube digestif', description: "Schéma d'interprétation de résultats", price: 300, linkTitle: 'Sur tablette enseignant', link: '', inClass: true },
  
  // === NIVEAU 4 ===
  // Ressources documentaires niveau 4
  { id: 'r41', level: 4, type: 'Ressources documentaires', title: 'Recherche documentaire (livre, internet, …)', description: "Le sujet de recherche doit être très précis et différent du problème à résoudre", price: 300, linkTitle: 'Recherche Internet', link: 'https://www.ecosia.org/?c=fr', inClass: false },
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
      // 5ème A
      { id: 'e1', classeId: '5a', numero: 1, membres: ['Marie Curie', 'Louis Pasteur'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e2', classeId: '5a', numero: 2, membres: ['Albert Einstein', 'Isaac Newton', 'Galilée'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e3', classeId: '5a', numero: 3, membres: ['Charles Darwin', 'Gregor Mendel'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e4', classeId: '5a', numero: 4, membres: ['Marie Sklodowska', 'Rosalind Franklin', 'Ada Lovelace'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 5ème B
      { id: 'e5', classeId: '5b', numero: 1, membres: ['Nikola Tesla', 'Thomas Edison'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e6', classeId: '5b', numero: 2, membres: ['Stephen Hawking', 'Carl Sagan', 'Neil Tyson'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e7', classeId: '5b', numero: 3, membres: ['Jane Goodall', 'David Attenborough'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 5ème C
      { id: 'e8', classeId: '5c', numero: 1, membres: ['Alan Turing', 'Grace Hopper'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e9', classeId: '5c', numero: 2, membres: ['Léonard de Vinci', 'Michel-Ange', 'Raphaël'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 4ème A
      { id: 'e10', classeId: '4a', numero: 1, membres: ['Antoine Lavoisier', 'Joseph Priestley'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      { id: 'e11', classeId: '4a', numero: 2, membres: ['Dmitri Mendeleïev', 'Marie Curie'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
      // 4ème B
      { id: 'e12', classeId: '4b', numero: 1, membres: ['Claude Bernard', 'Louis Pasteur'], level: 1, budget: 100, reputation: 0, reputationDecouvertes: 0, reputationRaisonnement: 0, purchasedResources: [] },
    ],
    resources: RESOURCES,
  };

  // Système de subscription pour la réactivité
  let subscribers = [];
  
  const subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(cb => cb !== callback);
    };
  };
  
  const notify = () => {
    subscribers.forEach(callback => callback(data));
  };

  return {
    // ==========================================
    // GETTERS
    // ==========================================
    getClasses: () => [...data.classes],
    
    getClasseInfo: (classeId) => {
      return data.classes.find(c => c.id === classeId);
    },
    
    getEquipe: (equipeId) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      return equipe ? { ...equipe } : null;
    },
    
    getEquipesByClasse: (classeId) => {
      return data.equipes
        .filter(e => e.classeId === classeId)
        .map(e => ({ ...e }))
        .sort((a, b) => a.numero - b.numero);
    },
    
    getAllResources: () => [...data.resources],
    
    getResource: (resourceId) => {
      return data.resources.find(r => r.id === resourceId);
    },
    
    getResourcesByLevel: (level) => {
      return data.resources.filter(r => r.level === level);
    },
    
    getResourceTypes: () => {
      const types = [...new Set(data.resources.map(r => r.type))];
      return types.sort();
    },
    
    getPurchasedResources: (equipeId) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return [];
      return data.resources.filter(r => equipe.purchasedResources.includes(r.id));
    },
    
    getLevelConfig: (level) => LEVEL_CONFIG[level] || LEVEL_CONFIG[1],

    // ==========================================
    // GESTION DES POINTS DE RÉPUTATION
    // ==========================================
    addReputationPoint: (equipeId, type) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return false;
      
      if (type === 'decouverte') {
        equipe.reputationDecouvertes += 1;
      } else if (type === 'raisonnement') {
        equipe.reputationRaisonnement += 1;
      }
      
      equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;
      
      // Calcul du nouveau niveau et budget
      const oldLevel = equipe.level;
      const oldBudget = LEVEL_CONFIG[oldLevel].budget;
      const { level, budget } = calculateLevelAndBudget(equipe.reputation);
      
      // Calculer combien l'équipe a déjà dépensé
      const spent = oldBudget - equipe.budget;
      
      // Mettre à jour le niveau et le budget
      equipe.level = level;
      equipe.budget = budget - spent;
      
      notify();
      return true;
    },
    
    removeReputationPoint: (equipeId, type) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return false;
      
      if (type === 'decouverte' && equipe.reputationDecouvertes > 0) {
        equipe.reputationDecouvertes -= 1;
      } else if (type === 'raisonnement' && equipe.reputationRaisonnement > 0) {
        equipe.reputationRaisonnement -= 1;
      }
      
      equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;
      
      // Recalculer niveau et budget
      const { level, budget } = calculateLevelAndBudget(equipe.reputation);
      equipe.level = level;
      equipe.budget = Math.min(equipe.budget, budget);
      
      notify();
      return true;
    },

    // ==========================================
    // ACHAT DE RESSOURCES
    // ==========================================
    purchaseResource: (equipeId, resourceId) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      const resource = data.resources.find(r => r.id === resourceId);
      
      if (!equipe || !resource) {
        return { success: false, error: 'Équipe ou ressource introuvable' };
      }
      
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
    
    // Vérifier si une ressource est accessible
    canAccessResource: (equipeId, resourceId) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      const resource = data.resources.find(r => r.id === resourceId);
      
      if (!equipe || !resource) {
        return { canAccess: false, reason: 'not_found' };
      }
      
      if (equipe.purchasedResources.includes(resourceId)) {
        return { canAccess: true, reason: 'purchased' };
      }
      
      if (equipe.level < resource.level) {
        return { canAccess: false, reason: 'level_required', required: resource.level };
      }
      
      if (equipe.budget < resource.price) {
        return { canAccess: false, reason: 'insufficient_budget', missing: resource.price - equipe.budget };
      }
      
      return { canAccess: true, reason: 'can_purchase' };
    },

    // ==========================================
    // GESTION DES ÉQUIPES
    // ==========================================
    updateEquipeMembres: (equipeId, membres) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return false;
      
      equipe.membres = membres;
      notify();
      return true;
    },
    
    updateEquipe: (equipeId, updates) => {
      const equipeIndex = data.equipes.findIndex(e => e.id === equipeId);
      if (equipeIndex === -1) return false;
      
      data.equipes[equipeIndex] = { ...data.equipes[equipeIndex], ...updates };
      notify();
      return true;
    },
    
    // Ajouter une nouvelle équipe à une classe
    addEquipe: (classeId, membres = []) => {
      const equipesClasse = data.equipes.filter(e => e.classeId === classeId);
      const maxNumero = equipesClasse.length > 0 
        ? Math.max(...equipesClasse.map(e => e.numero)) 
        : 0;
      
      const newId = 'equipe_' + Date.now();
      const newEquipe = {
        id: newId,
        classeId: classeId,
        numero: maxNumero + 1,
        membres: membres.length > 0 ? membres : ['Élève 1', 'Élève 2'],
        level: 1,
        budget: 100,
        reputation: 0,
        reputationDecouvertes: 0,
        reputationRaisonnement: 0,
        purchasedResources: [],
      };
      
      data.equipes.push(newEquipe);
      notify();
      return newEquipe;
    },
    
    // Supprimer une équipe
    deleteEquipe: (equipeId) => {
      const equipeIndex = data.equipes.findIndex(e => e.id === equipeId);
      if (equipeIndex === -1) return false;
      
      data.equipes.splice(equipeIndex, 1);
      notify();
      return true;
    },

    // ==========================================
    // FONCTIONS DE RÉINITIALISATION
    // ==========================================
    
    // Remise à zéro de TOUTES les équipes (points, budget ET noms des membres)
    resetAllEquipes: () => {
      data.equipes.forEach(equipe => {
        equipe.level = 1;
        equipe.budget = 100;
        equipe.reputation = 0;
        equipe.reputationDecouvertes = 0;
        equipe.reputationRaisonnement = 0;
        equipe.purchasedResources = [];
        equipe.membres = ['Élève 1', 'Élève 2']; // ← EFFACEMENT DES NOMS
      });
      notify();
      return true;
    },
    
    // Remise à zéro d'une classe spécifique (points, budget ET noms des membres)
    resetClasseEquipes: (classeId) => {
      data.equipes.forEach(equipe => {
        if (equipe.classeId === classeId) {
          equipe.level = 1;
          equipe.budget = 100;
          equipe.reputation = 0;
          equipe.reputationDecouvertes = 0;
          equipe.reputationRaisonnement = 0;
          equipe.purchasedResources = [];
          equipe.membres = ['Élève 1', 'Élève 2']; // ← EFFACEMENT DES NOMS
        }
      });
      notify();
      return true;
    },

    // ==========================================
    // GESTION DES CLASSES
    // ==========================================
    addClass: (name, anneeScolaire) => {
      const newId = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '_' + Date.now();
      const newClasse = {
        id: newId,
        name: name,
        anneeScolaire: anneeScolaire || '2024-2025',
      };
      
      data.classes.push(newClasse);
      notify();
      return newClasse;
    },
    
    deleteClasse: (classeId) => {
      const classeIndex = data.classes.findIndex(c => c.id === classeId);
      if (classeIndex === -1) return false;
      
      // Supprimer toutes les équipes de cette classe
      data.equipes = data.equipes.filter(e => e.classeId !== classeId);
      
      // Supprimer la classe
      data.classes.splice(classeIndex, 1);
      notify();
      return true;
    },

    // ==========================================
    // SUBSCRIPTION
    // ==========================================
    subscribe,
  };
};

// Singleton pattern pour partager le store
let gameStoreInstance = null;

export const getGameStore = () => {
  if (typeof window !== 'undefined') {
    // Côté client, utiliser window pour persister entre les re-renders
    if (!window.__gameStore) {
      window.__gameStore = createGameStore();
    }
    return window.__gameStore;
  }
  
  // Côté serveur, utiliser une instance simple
  if (!gameStoreInstance) {
    gameStoreInstance = createGameStore();
  }
  return gameStoreInstance;
};

// Hook React pour utiliser le store
export const useGameStore = () => {
  const [, forceUpdate] = React.useState({});
  const store = getGameStore();
  
  React.useEffect(() => {
    return store.subscribe(() => forceUpdate({}));
  }, [store]);
  
  return store;
};

// Export des constantes
export { LEVEL_CONFIG, RESOURCES };

// Export par défaut
export default getGameStore();
