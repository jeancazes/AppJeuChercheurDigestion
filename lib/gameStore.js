// lib/gameStore.js - Store avec Supabase pour la version production
// API identique à la v6, mais avec persistance Supabase

import { supabase } from './supabase';

// RESOURCES reste en dur (catalogue fixe)
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

// Fonctions utilitaires
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

// Convertir équipe Supabase vers format v6
const convertTeamFromSupabase = (team, purchasedResources = []) => {
  const membres = JSON.parse(team.members || '[]');
  const reputation = (team.discovery_points || 0) + (team.reasoning_points || 0);
  const level = team.level || 1;
  
  return {
    id: team.id,
    classeId: team.class_id,
    numero: team.team_number,
    membres,
    level,
    budget: team.budget || LEVEL_CONFIG[level].budget,
    reputation,
    reputationDecouvertes: team.discovery_points || 0,
    reputationRaisonnement: team.reasoning_points || 0,
    purchasedResources,
  };
};

// Créer le store
const createGameStore = () => {
  let data = {
    classes: [],
    equipes: [],
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

  // Charger une classe depuis Supabase
  const loadClasseData = async (classeId) => {
    try {
      // Charger classe
      const { data: classeData, error: classeError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classeId)
        .single();

      if (classeError) throw classeError;

      // Convertir classe
      const classe = {
        id: classeData.id,
        name: classeData.class_name,
        anneeScolaire: classeData.school_year,
      };

      // Charger équipes
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('class_id', classeId)
        .order('team_number');

      if (teamsError) throw teamsError;

      // Charger ressources achetées pour toutes les équipes
      const teamIds = teams.map(t => t.id);
      const { data: allPurchased, error: purchError } = teamIds.length > 0
        ? await supabase
            .from('purchased_resources')
            .select('*')
            .in('team_id', teamIds)
        : { data: [], error: null };

      if (purchError) throw purchError;

      // Organiser par équipe
      const purchasedByTeam = {};
      (allPurchased || []).forEach(p => {
        if (!purchasedByTeam[p.team_id]) {
          purchasedByTeam[p.team_id] = [];
        }
        purchasedByTeam[p.team_id].push(p.resource_data.id);
      });

      // Convertir équipes avec leurs ressources
      const equipes = teams.map(t => convertTeamFromSupabase(t, purchasedByTeam[t.id] || []));

      // Mettre à jour le store local
      const existingClasseIndex = data.classes.findIndex(c => c.id === classe.id);
      if (existingClasseIndex >= 0) {
        data.classes[existingClasseIndex] = classe;
      } else {
        data.classes.push(classe);
      }

      // Remplacer les équipes de cette classe
      data.equipes = data.equipes.filter(e => e.classeId !== classeId);
      data.equipes.push(...equipes);

      notify();
      return classe;
    } catch (error) {
      console.error('Erreur loadClasseData:', error);
      throw error;
    }
  };

  // Charger toutes les classes
  const loadAllClasses = async () => {
    try {
      const { data: classes, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      data.classes = classes.map(c => ({
        id: c.id,
        name: c.class_name,
        anneeScolaire: c.school_year,
      }));

      notify();
      return data.classes;
    } catch (error) {
      console.error('Erreur loadAllClasses:', error);
      throw error;
    }
  };

  // Initialisation automatique
  if (typeof window !== 'undefined') {
    loadAllClasses().catch(err => console.error('Init error:', err));
  }

  return {
    // Getters - API identique à v6
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

    // Charger explicitement une classe (pour les élèves)
    loadClasse: loadClasseData,

    // Actions - avec Supabase
    addReputation: async (equipeId, type, amount = 1) => {
      try {
        const equipe = data.equipes.find(e => e.id === equipeId);
        if (!equipe) return false;

        const fieldName = type === 'decouvertes' ? 'discovery_points' : 'reasoning_points';
        const currentValue = type === 'decouvertes' ? equipe.reputationDecouvertes : equipe.reputationRaisonnement;
        const newValue = currentValue + amount;

        const { error } = await supabase
          .from('teams')
          .update({ [fieldName]: newValue })
          .eq('id', equipeId);

        if (error) throw error;

        // Mettre à jour localement
        if (type === 'decouvertes') {
          equipe.reputationDecouvertes = newValue;
        } else {
          equipe.reputationRaisonnement = newValue;
        }
        equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;

        // Vérifier changement de niveau
        const newLevel = calculateLevel(equipe.reputation);
        if (newLevel !== equipe.level) {
          await supabase
            .from('teams')
            .update({ level: newLevel })
            .eq('id', equipeId);

          equipe.level = newLevel;
          const newBudget = calculateBudget(newLevel, equipe.purchasedResources);
          
          await supabase
            .from('teams')
            .update({ budget: newBudget })
            .eq('id', equipeId);

          equipe.budget = newBudget;
        }

        notify();
        return true;
      } catch (error) {
        console.error('Erreur addReputation:', error);
        return false;
      }
    },

    removeReputation: async (equipeId, type, amount = 1) => {
      try {
        const equipe = data.equipes.find(e => e.id === equipeId);
        if (!equipe) return false;

        const fieldName = type === 'decouvertes' ? 'discovery_points' : 'reasoning_points';
        const currentValue = type === 'decouvertes' ? equipe.reputationDecouvertes : equipe.reputationRaisonnement;
        const newValue = Math.max(0, currentValue - amount);

        const { error } = await supabase
          .from('teams')
          .update({ [fieldName]: newValue })
          .eq('id', equipeId);

        if (error) throw error;

        // Mettre à jour localement
        if (type === 'decouvertes') {
          equipe.reputationDecouvertes = newValue;
        } else {
          equipe.reputationRaisonnement = newValue;
        }
        equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;

        // Vérifier changement de niveau
        const newLevel = calculateLevel(equipe.reputation);
        if (newLevel !== equipe.level) {
          await supabase
            .from('teams')
            .update({ level: newLevel })
            .eq('id', equipeId);

          equipe.level = newLevel;
          const newBudget = calculateBudget(newLevel, equipe.purchasedResources);
          
          await supabase
            .from('teams')
            .update({ budget: newBudget })
            .eq('id', equipeId);

          equipe.budget = newBudget;
        }

        notify();
        return true;
      } catch (error) {
        console.error('Erreur removeReputation:', error);
        return false;
      }
    },

    purchaseResource: async (equipeId, resourceId) => {
      try {
        const equipe = data.equipes.find(e => e.id === equipeId);
        if (!equipe) return { success: false, error: 'Équipe non trouvée' };

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

        // Enregistrer l'achat dans Supabase
        const { error: insertError } = await supabase
          .from('purchased_resources')
          .insert([{
            team_id: equipeId,
            resource_data: resource
          }]);

        if (insertError) throw insertError;

        // Déduire du budget
        const newBudget = equipe.budget - resource.price;
        const { error: updateError } = await supabase
          .from('teams')
          .update({ budget: newBudget })
          .eq('id', equipeId);

        if (updateError) throw updateError;

        // Mettre à jour localement
        equipe.purchasedResources.push(resourceId);
        equipe.budget = newBudget;
        
        notify();
        return { success: true, resource };
      } catch (error) {
        console.error('Erreur purchaseResource:', error);
        return { success: false, error: error.message };
      }
    },

    updateEquipe: async (equipeId, updates) => {
      try {
        const equipe = data.equipes.find(e => e.id === equipeId);
        if (!equipe) return false;

        // Convertir les updates au format Supabase
        const supabaseUpdates = {};
        if (updates.membres) {
          supabaseUpdates.members = JSON.stringify(updates.membres);
          equipe.membres = updates.membres;
        }
        if (updates.budget !== undefined) {
          supabaseUpdates.budget = updates.budget;
          equipe.budget = updates.budget;
        }
        if (updates.level !== undefined) {
          supabaseUpdates.level = updates.level;
          equipe.level = updates.level;
        }

        if (Object.keys(supabaseUpdates).length > 0) {
          const { error } = await supabase
            .from('teams')
            .update(supabaseUpdates)
            .eq('id', equipeId);

          if (error) throw error;
        }

        notify();
        return true;
      } catch (error) {
        console.error('Erreur updateEquipe:', error);
        return false;
      }
    },

    subscribe,
  };
};

// Export singleton
let gameStoreInstance = null;

export const getGameStore = () => {
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
