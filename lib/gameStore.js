// lib/gameStore.js - Store avec Supabase + Gestion complète des ressources
// Version Production avec CRUD complet

import { supabase } from './supabase';

// Configuration des niveaux (reste en dur)
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
    const resource = data.resources.find(r => r.id === resId);
    return total + (resource ? resource.price : 0);
  }, 0);
  return baseBudget - spent;
};

// Convertir ressource Supabase vers format v6
const convertResourceFromSupabase = (r) => ({
  id: r.id,
  level: r.level,
  type: r.type,
  title: r.title,
  description: r.description || '',
  price: r.price,
  link: r.link || '',
  inClass: r.in_class || false,
});

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
    pinCode: team.pin_code || '0000',
    purchasedResources,
  };
};

// Data store global
let data = {
  classes: [],
  equipes: [],
  resources: [], // Maintenant chargées depuis Supabase !
};

// Créer le store
const createGameStore = () => {
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

  // ============================================
  // CHARGEMENT DES RESSOURCES
  // ============================================
  
  const loadResources = async () => {
    try {
      const { data: resources, error } = await supabase
        .from('resources')
        .select('*')
        .order('id');

      if (error) throw error;

      data.resources = resources.map(convertResourceFromSupabase);
      notify();
      return data.resources;
    } catch (error) {
      console.error('Erreur loadResources:', error);
      throw error;
    }
  };

  // ============================================
  // GESTION DES CLASSES
  // ============================================

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

  const createClasse = async (name, anneeScolaire) => {
    try {
      const { data: newClass, error } = await supabase
        .from('classes')
        .insert([{ class_name: name, school_year: anneeScolaire }])
        .select()
        .single();

      if (error) throw error;

      const classe = {
        id: newClass.id,
        name: newClass.class_name,
        anneeScolaire: newClass.school_year,
      };

      data.classes.push(classe);
      notify();
      return classe;
    } catch (error) {
      console.error('Erreur createClasse:', error);
      throw error;
    }
  };

  const updateClasse = async (classeId, updates) => {
    try {
      const supabaseUpdates = {};
      if (updates.name) supabaseUpdates.class_name = updates.name;
      if (updates.anneeScolaire) supabaseUpdates.school_year = updates.anneeScolaire;

      const { error } = await supabase
        .from('classes')
        .update(supabaseUpdates)
        .eq('id', classeId);

      if (error) throw error;

      // Mettre à jour localement
      const index = data.classes.findIndex(c => c.id === classeId);
      if (index >= 0) {
        data.classes[index] = { ...data.classes[index], ...updates };
      }

      notify();
      return true;
    } catch (error) {
      console.error('Erreur updateClasse:', error);
      throw error;
    }
  };

  const deleteClasse = async (classeId) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classeId);

      if (error) throw error;

      // Retirer localement
      data.classes = data.classes.filter(c => c.id !== classeId);
      data.equipes = data.equipes.filter(e => e.classeId !== classeId);

      notify();
      return true;
    } catch (error) {
      console.error('Erreur deleteClasse:', error);
      throw error;
    }
  };

  // ============================================
  // GESTION DES ÉQUIPES
  // ============================================

  const loadClasseData = async (classeId) => {
    try {
      // Charger classe
      const { data: classeData, error: classeError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classeId)
        .single();

      if (classeError) throw classeError;

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

      // Charger ressources achetées
      const teamIds = teams.map(t => t.id);
      const { data: allPurchased, error: purchError } = teamIds.length > 0
        ? await supabase
            .from('purchased_resources')
            .select('resource_id, team_id')
            .in('team_id', teamIds)
        : { data: [], error: null };

      if (purchError) throw purchError;

      // Organiser par équipe
      const purchasedByTeam = {};
      (allPurchased || []).forEach(p => {
        if (!purchasedByTeam[p.team_id]) {
          purchasedByTeam[p.team_id] = [];
        }
        purchasedByTeam[p.team_id].push(p.resource_id);
      });

      // Convertir équipes
      const equipes = teams.map(t => convertTeamFromSupabase(t, purchasedByTeam[t.id] || []));

      // Mettre à jour le store local
      const existingClasseIndex = data.classes.findIndex(c => c.id === classe.id);
      if (existingClasseIndex >= 0) {
        data.classes[existingClasseIndex] = classe;
      } else {
        data.classes.push(classe);
      }

      data.equipes = data.equipes.filter(e => e.classeId !== classeId);
      data.equipes.push(...equipes);

      notify();
      return classe;
    } catch (error) {
      console.error('Erreur loadClasseData:', error);
      throw error;
    }
  };

  const createEquipe = async (classeId, numero, membres = [], pinCode = '0000', teamName = '') => {
    try {
      const { data: newTeam, error } = await supabase
        .from('teams')
        .insert([{
          class_id: classeId,
          team_number: numero,
          team_name: teamName,
          members: JSON.stringify(membres),
          level: 1,
          budget: 100,
          discovery_points: 0,
          reasoning_points: 0,
          pin_code: pinCode,
        }])
        .select()
        .single();

      if (error) throw error;

      const equipe = convertTeamFromSupabase(newTeam, []);
      data.equipes.push(equipe);

      notify();
      return equipe;
    } catch (error) {
      console.error('Erreur createEquipe:', error);
      throw error;
    }
  };

  const updateEquipe = async (equipeId, updates) => {
    try {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return false;

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
      if (updates.numero !== undefined) {
        supabaseUpdates.team_number = updates.numero;
        equipe.numero = updates.numero;
      }
      if (updates.pinCode !== undefined) {
        supabaseUpdates.pin_code = updates.pinCode;
        equipe.pinCode = updates.pinCode;
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
  };

  const deleteEquipe = async (equipeId) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', equipeId);

      if (error) throw error;

      data.equipes = data.equipes.filter(e => e.id !== equipeId);

      notify();
      return true;
    } catch (error) {
      console.error('Erreur deleteEquipe:', error);
      throw error;
    }
  };

  // ============================================
  // GESTION DES RESSOURCES (CRUD COMPLET)
  // ============================================

  const createResource = async (resourceData) => {
    try {
      // Générer un ID unique
      const maxId = data.resources.length > 0 
        ? Math.max(...data.resources.map(r => parseInt(r.id.replace('r', '')))) 
        : 0;
      const newId = `r${maxId + 1}`;

      const { data: newResource, error } = await supabase
        .from('resources')
        .insert([{
          id: newId,
          level: resourceData.level || 1,
          type: resourceData.type || '',
          title: resourceData.title || '',
          description: resourceData.description || '',
          price: resourceData.price || 0,
          link: resourceData.link || '',
          in_class: resourceData.inClass || false,
        }])
        .select()
        .single();

      if (error) throw error;

      const resource = convertResourceFromSupabase(newResource);
      data.resources.push(resource);

      notify();
      return resource;
    } catch (error) {
      console.error('Erreur createResource:', error);
      throw error;
    }
  };

  const updateResource = async (resourceId, updates) => {
    try {
      const supabaseUpdates = {};
      if (updates.level !== undefined) supabaseUpdates.level = updates.level;
      if (updates.type !== undefined) supabaseUpdates.type = updates.type;
      if (updates.title !== undefined) supabaseUpdates.title = updates.title;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.price !== undefined) supabaseUpdates.price = updates.price;
      if (updates.link !== undefined) supabaseUpdates.link = updates.link;
      if (updates.inClass !== undefined) supabaseUpdates.in_class = updates.inClass;

      const { error } = await supabase
        .from('resources')
        .update(supabaseUpdates)
        .eq('id', resourceId);

      if (error) throw error;

      // Mettre à jour localement
      const index = data.resources.findIndex(r => r.id === resourceId);
      if (index >= 0) {
        data.resources[index] = { ...data.resources[index], ...updates };
      }

      notify();
      return true;
    } catch (error) {
      console.error('Erreur updateResource:', error);
      throw error;
    }
  };

  const deleteResource = async (resourceId) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      data.resources = data.resources.filter(r => r.id !== resourceId);

      notify();
      return true;
    } catch (error) {
      console.error('Erreur deleteResource:', error);
      throw error;
    }
  };

  // ============================================
  // GESTION DE LA RÉPUTATION
  // ============================================

  const addReputation = async (equipeId, type, amount = 1) => {
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

      if (type === 'decouvertes') {
        equipe.reputationDecouvertes = newValue;
      } else {
        equipe.reputationRaisonnement = newValue;
      }
      equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;

      const newLevel = calculateLevel(equipe.reputation);
      if (newLevel !== equipe.level) {
        await supabase.from('teams').update({ level: newLevel }).eq('id', equipeId);
        equipe.level = newLevel;
        
        const newBudget = calculateBudget(newLevel, equipe.purchasedResources);
        await supabase.from('teams').update({ budget: newBudget }).eq('id', equipeId);
        equipe.budget = newBudget;
      }

      notify();
      return true;
    } catch (error) {
      console.error('Erreur addReputation:', error);
      return false;
    }
  };

  const removeReputation = async (equipeId, type, amount = 1) => {
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

      if (type === 'decouvertes') {
        equipe.reputationDecouvertes = newValue;
      } else {
        equipe.reputationRaisonnement = newValue;
      }
      equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;

      const newLevel = calculateLevel(equipe.reputation);
      if (newLevel !== equipe.level) {
        await supabase.from('teams').update({ level: newLevel }).eq('id', equipeId);
        equipe.level = newLevel;
        
        const newBudget = calculateBudget(newLevel, equipe.purchasedResources);
        await supabase.from('teams').update({ budget: newBudget }).eq('id', equipeId);
        equipe.budget = newBudget;
      }

      notify();
      return true;
    } catch (error) {
      console.error('Erreur removeReputation:', error);
      return false;
    }
  };

  // ============================================
  // ACHAT DE RESSOURCES
  // ============================================

  const purchaseResource = async (equipeId, resourceId) => {
    try {
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (!equipe) return { success: false, error: 'Équipe non trouvée' };

      const resource = data.resources.find(r => r.id === resourceId);
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

      // Enregistrer l'achat
      const { error: insertError } = await supabase
        .from('purchased_resources')
        .insert([{ team_id: equipeId, resource_id: resourceId }]);

      if (insertError) throw insertError;

      // Déduire du budget
      const newBudget = equipe.budget - resource.price;
      const { error: updateError } = await supabase
        .from('teams')
        .update({ budget: newBudget })
        .eq('id', equipeId);

      if (updateError) throw updateError;

      equipe.purchasedResources.push(resourceId);
      equipe.budget = newBudget;
      
      notify();
      return { success: true, resource };
    } catch (error) {
      console.error('Erreur purchaseResource:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // INITIALISATION
  // ============================================

  if (typeof window !== 'undefined') {
    Promise.all([loadAllClasses(), loadResources()])
      .catch(err => console.error('Init error:', err));
  }

  // ============================================
  // API PUBLIQUE
  // ============================================

  return {
    // Getters
    getClasses: () => [...data.classes],
    getEquipesByClasse: (classeId) => data.equipes.filter(e => e.classeId === classeId),
    getEquipe: (equipeId) => {
      const equipe = data.equipes.find(e => e.id === equipeId);
      return equipe ? { ...equipe } : null;
    },
    getClasseInfo: (classeId) => {
      const classe = data.classes.findIndex(c => c.id === classeId);
      return classe ? { ...classe } : null;
    },
    getResources: () => [...data.resources],
    getResourcesByLevel: (level) => data.resources.filter(r => r.level <= level),
    getResource: (resourceId) => data.resources.find(r => r.id === resourceId),
    getLevelConfig: () => ({ ...LEVEL_CONFIG }),

    // Classes
    loadClasse: loadClasseData,
    createClasse,
    updateClasse,
    deleteClasse,
    refreshClasses: loadAllClasses,

    // Équipes
    createEquipe,
    updateEquipe,
    deleteEquipe,

    // Ressources
    loadResources,
    createResource,
    updateResource,
    deleteResource,

    // Réputation
    addReputation,
    removeReputation,

    // Achats
    purchaseResource,

    // Subscribe
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

export { LEVEL_CONFIG };
