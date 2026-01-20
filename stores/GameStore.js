import { writable } from 'svelte/store';
import { supabase } from '../lib/supabase';

// Clé pour localStorage (fallback si Supabase est indisponible)
const STORAGE_KEY = 'labo-fabuleux-fallback';

// État initial
const initialState = {
  selectedClass: null,
  teams: [],
  purchasedResources: {},
  loading: false,
  error: null,
  useSupabase: true, // Flag pour savoir si on utilise Supabase ou localStorage
};

function createGameStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,

    // =========================================
    // GESTION DES CLASSES
    // =========================================

    async createClass(schoolYear, className) {
      update(state => ({ ...state, loading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('classes')
          .insert([{ 
            school_year: schoolYear, 
            class_name: className 
          }])
          .select()
          .single();

        if (error) throw error;

        update(state => ({ 
          ...state, 
          selectedClass: data,
          loading: false 
        }));

        console.log('✅ Classe créée:', data);
        return data;
      } catch (error) {
        console.error('❌ Erreur création classe:', error);
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error.message 
        }));
        throw error;
      }
    },

    async loadClass(classId) {
      update(state => ({ ...state, loading: true, error: null }));

      try {
        // Récupérer la classe
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();

        if (classError) throw classError;

        // Récupérer les équipes de cette classe
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .eq('class_id', classId)
          .order('team_number', { ascending: true });

        if (teamsError) throw teamsError;

        // Récupérer les ressources achetées pour toutes les équipes
        const teamIds = teams.map(t => t.id);
        const { data: resources, error: resourcesError } = teamIds.length > 0
          ? await supabase
              .from('purchased_resources')
              .select('*')
              .in('team_id', teamIds)
          : { data: [], error: null };

        if (resourcesError) throw resourcesError;

        // Organiser les ressources par équipe
        const purchasedResources = {};
        resources.forEach(r => {
          if (!purchasedResources[r.team_id]) {
            purchasedResources[r.team_id] = [];
          }
          purchasedResources[r.team_id].push(r.resource_data);
        });

        set({
          selectedClass: classData,
          teams: teams || [],
          purchasedResources,
          loading: false,
          error: null,
          useSupabase: true,
        });

        console.log('✅ Classe chargée:', classData.class_name, '- Équipes:', teams.length);
        return classData;
      } catch (error) {
        console.error('❌ Erreur chargement classe:', error);
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error.message 
        }));
        throw error;
      }
    },

    async listClasses() {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ Classes récupérées:', data.length);
        return data;
      } catch (error) {
        console.error('❌ Erreur liste classes:', error);
        throw error;
      }
    },

    // =========================================
    // GESTION DES ÉQUIPES
    // =========================================

    async createTeam(teamData) {
      update(state => ({ ...state, loading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('teams')
          .insert([{
            class_id: teamData.classId,
            team_number: teamData.teamNumber,
            team_name: teamData.teamName,
            members: teamData.members,
            level: 1,
            budget: 100,
            discovery_points: 0,
            reasoning_points: 0,
            avatar_url: teamData.avatarUrl,
          }])
          .select()
          .single();

        if (error) throw error;

        update(state => ({
          ...state,
          teams: [...state.teams, data],
          loading: false,
        }));

        console.log('✅ Équipe créée:', data.team_name);
        return data;
      } catch (error) {
        console.error('❌ Erreur création équipe:', error);
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error.message 
        }));
        throw error;
      }
    },

    async updateTeam(teamId, updates) {
      try {
        const { data, error } = await supabase
          .from('teams')
          .update(updates)
          .eq('id', teamId)
          .select()
          .single();

        if (error) throw error;

        update(state => ({
          ...state,
          teams: state.teams.map(t => t.id === teamId ? data : t),
        }));

        console.log('✅ Équipe mise à jour:', teamId);
        return data;
      } catch (error) {
        console.error('❌ Erreur mise à jour équipe:', error);
        throw error;
      }
    },

    async deleteTeam(teamId) {
      try {
        const { error } = await supabase
          .from('teams')
          .delete()
          .eq('id', teamId);

        if (error) throw error;

        update(state => ({
          ...state,
          teams: state.teams.filter(t => t.id !== teamId),
          purchasedResources: {
            ...state.purchasedResources,
            [teamId]: undefined,
          },
        }));

        console.log('✅ Équipe supprimée:', teamId);
      } catch (error) {
        console.error('❌ Erreur suppression équipe:', error);
        throw error;
      }
    },

    // =========================================
    // GESTION DES POINTS DE RÉPUTATION
    // =========================================

    async addReputationPoints(teamId, discoveryPoints = 0, reasoningPoints = 0) {
      try {
        // Récupérer l'équipe actuelle
        const { data: currentTeam, error: fetchError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();

        if (fetchError) throw fetchError;

        // Calculer les nouveaux totaux
        const newDiscovery = currentTeam.discovery_points + discoveryPoints;
        const newReasoning = currentTeam.reasoning_points + reasoningPoints;
        const totalPoints = newDiscovery + newReasoning;

        // Calculer le nouveau niveau (tous les 5 points, on passe au niveau suivant)
        const newLevel = Math.min(Math.floor(totalPoints / 5) + 1, 4); // Max niveau 4

        // Calculer l'augmentation de budget selon les règles
        let budgetIncrease = 0;
        if (newLevel > currentTeam.level) {
          const levelDiff = newLevel - currentTeam.level;
          for (let i = 0; i < levelDiff; i++) {
            const nextLevel = currentTeam.level + i + 1;
            if (nextLevel === 2) budgetIncrease += 100;
            else if (nextLevel === 3) budgetIncrease += 300;
            else if (nextLevel === 4) budgetIncrease += 500;
          }
        }

        const newBudget = currentTeam.budget + budgetIncrease;

        // Mettre à jour dans Supabase
        const { data, error: updateError } = await supabase
          .from('teams')
          .update({
            discovery_points: newDiscovery,
            reasoning_points: newReasoning,
            level: newLevel,
            budget: newBudget,
          })
          .eq('id', teamId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Mettre à jour le store local
        update(state => ({
          ...state,
          teams: state.teams.map(t => t.id === teamId ? data : t),
        }));

        console.log(`✅ Points ajoutés (D:${discoveryPoints}, R:${reasoningPoints}) - Nouveau niveau: ${newLevel}`);
        return data;
      } catch (error) {
        console.error('❌ Erreur ajout points:', error);
        throw error;
      }
    },

    // =========================================
    // GESTION DES RESSOURCES
    // =========================================

    async purchaseResource(teamId, resource) {
      try {
        // Récupérer l'équipe
        const { data: team, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();

        if (teamError) throw teamError;

        // Vérifier le budget
        if (team.budget < resource.price) {
          throw new Error('Budget insuffisant');
        }

        // Vérifier le niveau requis
        const requiredLevel = this.getRequiredLevel(resource.level);
        if (team.level < requiredLevel) {
          throw new Error(`Niveau ${requiredLevel} requis`);
        }

        // Déduire le prix du budget
        const { data: updatedTeam, error: updateError } = await supabase
          .from('teams')
          .update({ budget: team.budget - resource.price })
          .eq('id', teamId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Enregistrer l'achat
        const { error: purchaseError } = await supabase
          .from('purchased_resources')
          .insert([{
            team_id: teamId,
            resource_data: resource,
          }]);

        if (purchaseError) throw purchaseError;

        // Mettre à jour le store local
        update(state => ({
          ...state,
          teams: state.teams.map(t => t.id === teamId ? updatedTeam : t),
          purchasedResources: {
            ...state.purchasedResources,
            [teamId]: [...(state.purchasedResources[teamId] || []), resource],
          },
        }));

        console.log('✅ Ressource achetée:', resource.title);
        return updatedTeam;
      } catch (error) {
        console.error('❌ Erreur achat ressource:', error);
        throw error;
      }
    },

    // Helper pour convertir les niveaux de ressources en numéros
    getRequiredLevel(resourceLevel) {
      const levelMap = {
        'LEVEL 1': 1,
        'LEVEL 2': 2,
        'LEVEL 3': 3,
        'LEVEL 4': 4,
      };
      return levelMap[resourceLevel] || 1;
    },

    // =========================================
    // TEMPS RÉEL (OPTIONNEL)
    // =========================================

    subscribeToChanges(classId) {
      // S'abonner aux changements en temps réel sur les équipes
      const channel = supabase
        .channel('team-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'teams',
            filter: `class_id=eq.${classId}`,
          },
          (payload) => {
            console.log('🔔 Changement détecté:', payload);
            // Recharger les données
            this.loadClass(classId);
          }
        )
        .subscribe();

      // Retourner une fonction pour se désabonner
      return () => {
        supabase.removeChannel(channel);
      };
    },

    // =========================================
    // FALLBACK LOCAL STORAGE
    // =========================================

    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        const state = writable(initialState);
        state.subscribe(value => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            selectedClass: value.selectedClass,
            teams: value.teams,
            purchasedResources: value.purchasedResources,
          }));
        });
      }
    },

    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const data = JSON.parse(stored);
            set({
              ...initialState,
              ...data,
              useSupabase: false,
            });
            console.log('⚠️ Chargé depuis localStorage (mode hors-ligne)');
          } catch (e) {
            console.error('Erreur chargement localStorage:', e);
          }
        }
      }
    },

    // =========================================
    // UTILITAIRES
    // =========================================

    clearError() {
      update(state => ({ ...state, error: null }));
    },

    reset() {
      set(initialState);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  };
}

export const gameStore = createGameStore();
