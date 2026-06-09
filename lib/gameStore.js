// lib/gameStore.js — Migré vers API PHP (EX2)
// Remplace toutes les requêtes Supabase par des appels fetch vers l API PHP

const getApiBase = () => process.env.NEXT_PUBLIC_API_URL || 'https://lelaboratoirefabuleux.com/JeuDig/api';
const TEACHER_PIN_KEY = 'teacherPin';
const getStoredPin = () => { if (typeof window === 'undefined') return ''; return localStorage.getItem(TEACHER_PIN_KEY) || ''; };

async function apiRequest(path, options = {}) {
  const url = `${getApiBase()}/${path}`;
  const pin = getStoredPin();
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(pin ? { 'X-Teacher-Pin': pin } : {}), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
  return data;
}

export const LEVEL_CONFIG = {
  1: { title: 'Stagiaire',   budget: 100,  access: 'Observations et livres',    repRequired: 0  },
  2: { title: 'Interne',     budget: 200,  access: 'Dissections et expériences', repRequired: 5  },
  3: { title: 'Résident',    budget: 500,  access: 'Analyses et Doc Médical',   repRequired: 10 },
  4: { title: 'Spécialiste', budget: 1000, access: 'Synthèses',                  repRequired: 15 },
};

export const COLORS = {
  primary: '#0288D1', primaryLight: '#4FC3F7', primaryDark: '#01579B',
  secondary: '#B3E5FC', background: '#E1F5FE', white: '#FFFFFF',
  text: '#263238', textLight: '#546E7A', success: '#4CAF50',
  warning: '#FF9800', error: '#EF5350', cardBorder: '#B3E5FC',
  cardShadow: 'rgba(2, 136, 209, 0.1)',
};

const convertTeam = (team, purchases = []) => {
  const membres = Array.isArray(team.members) ? team.members : JSON.parse(team.members || '[]');
  const level = team.level || 1;
  return {
    id: team.id, classeId: team.class_id || (team.class_name + '_' + team.school_year),
    numero: team.team_number, membres, level,
    budget: team.budget ?? LEVEL_CONFIG[level].budget,
    reputation: (team.discovery_points || 0) + (team.reasoning_points || 0),
    reputationDecouvertes: team.discovery_points || 0,
    reputationRaisonnement: team.reasoning_points || 0,
    pinCode: team.pin_code || '0000', purchasedResources: purchases,
    school_year: team.school_year || '', class_name: team.class_name || '',
  };
};

const convertResource = (r) => ({
  id: r.id, level: r.level, type: r.type, title: r.title,
  description: r.description || '', price: r.price, link: r.link || '', inClass: !r.link,
});

let data = { classes: [], equipes: [], resources: [] };

const createGameStore = () => {
  let subscribers = [];
  const notify = () => subscribers.forEach(cb => cb());
  const subscribe = (callback) => { subscribers.push(callback); return () => { subscribers = subscribers.filter(cb => cb !== callback); }; };

  const verifyTeacherPin = async (pin) => {
    const res = await fetch(`${getApiBase()}/auth.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }) });
    const json = await res.json();
    if (json.valid && typeof window !== 'undefined') localStorage.setItem(TEACHER_PIN_KEY, pin);
    return json.valid === true;
  };

  const loadResources = async () => {
    const resources = await apiRequest('resources.php');
    data.resources = resources.map(convertResource);
    notify();
    return data.resources;
  };

  const createResource = async (resourceData) => {
    const maxId = data.resources.length > 0 ? Math.max(...data.resources.map(r => parseInt(r.id.replace('r', '')) || 0)) : 0;
    const resource = convertResource({ id: `r${maxId + 1}`, level: resourceData.level || 1, type: resourceData.type || '', title: resourceData.title || '', description: resourceData.description || '', price: resourceData.price || 0, link: resourceData.link || '' });
    data.resources.push(resource);
    notify();
    return resource;
  };

  const updateResource = async (resourceId, updates) => {
    const i = data.resources.findIndex(r => r.id === resourceId);
    if (i >= 0) { data.resources[i] = { ...data.resources[i], ...updates }; notify(); }
    return true;
  };

  const deleteResource = async (resourceId) => {
    data.resources = data.resources.filter(r => r.id !== resourceId);
    notify(); return true;
  };

  const loadAllClasses = async () => {
    const teams = await apiRequest('teams.php');
    const classMap = {};
    teams.forEach(t => {
      const key = t.class_name + '_' + t.school_year;
      if (t.class_name && !classMap[key]) classMap[key] = { id: key, name: t.class_name, anneeScolaire: t.school_year };
    });
    data.classes = Object.values(classMap);
    notify();
    return data.classes;
  };

  const createClasse = async (name, anneeScolaire) => {
    const classe = { id: name + '_' + anneeScolaire, name, anneeScolaire };
    if (!data.classes.find(c => c.id === classe.id)) data.classes.push(classe);
    notify();
    return classe;
  };

  const updateClasse = async (classeId, updates) => {
    const i = data.classes.findIndex(c => c.id === classeId);
    if (i >= 0) { data.classes[i] = { ...data.classes[i], ...updates }; notify(); }
    return true;
  };

  const deleteClasse = async (classeId) => {
    const equipes = data.equipes.filter(e => e.classeId === classeId);
    for (const eq of equipes) { try { await apiRequest(`teams.php?id=${eq.id}`, { method: 'DELETE' }); } catch(e) {} }
    data.classes = data.classes.filter(c => c.id !== classeId);
    data.equipes = data.equipes.filter(e => e.classeId !== classeId);
    notify(); return true;
  };

  const loadClasseData = async (classeId) => {
    const [className, ...yearParts] = classeId.split('_');
    const teams = await apiRequest(`teams.php?class=${encodeURIComponent(className)}`);
    const equipes = await Promise.all(teams.map(async (team) => {
      let purchases = [];
      try { const bought = await apiRequest(`purchases.php?team_id=${team.id}`); purchases = bought.map(p => p.resource_id); } catch(e) {}
      return convertTeam({ ...team, class_id: classeId }, purchases);
    }));
    const classe = { id: classeId, name: className, anneeScolaire: yearParts.join('_') };
    const ei = data.classes.findIndex(c => c.id === classeId);
    if (ei >= 0) data.classes[ei] = classe; else data.classes.push(classe);
    data.equipes = data.equipes.filter(e => e.classeId !== classeId);
    data.equipes.push(...equipes);
    notify();
    return classe;
  };

  const createEquipe = async (classeId, numero, membres = [], pinCode = '0000', teamName = '') => {
    const parts = classeId.split('_');
    const className = parts[0];
    const schoolYear = parts.slice(1).join('_') || '2024-2025';
    const newTeam = await apiRequest('teams.php', {
      method: 'POST',
      body: JSON.stringify({ school_year: schoolYear, class_name: className, team_number: numero, members: membres, pin_code: pinCode }),
    });
    const equipe = convertTeam({ ...newTeam, class_id: classeId }, []);
    data.equipes.push(equipe);
    notify();
    return equipe;
  };

  const updateEquipe = async (equipeId, updates) => {
    const equipe = data.equipes.find(e => e.id === equipeId);
    if (!equipe) return false;
    const body = {};
    if (updates.membres)              { body.members     = updates.membres;  equipe.membres = updates.membres; }
    if (updates.budget !== undefined)  { body.budget      = updates.budget;   equipe.budget  = updates.budget; }
    if (updates.level !== undefined)   { body.level       = updates.level;    equipe.level   = updates.level; }
    if (updates.numero !== undefined)  { body.team_number = updates.numero;   equipe.numero  = updates.numero; }
    if (updates.pinCode !== undefined) { body.pin_code    = updates.pinCode;  equipe.pinCode = updates.pinCode; }
    if (Object.keys(body).length > 0) await apiRequest(`teams.php?id=${equipeId}`, { method: 'PUT', body: JSON.stringify(body) });
    notify(); return true;
  };

  const deleteEquipe = async (equipeId) => {
    await apiRequest(`teams.php?id=${equipeId}`, { method: 'DELETE' });
    data.equipes = data.equipes.filter(e => e.id !== equipeId);
    notify(); return true;
  };

  const addReputation = async (equipeId, type, amount = 1) => {
    const category = type === 'decouvertes' ? 'discovery' : 'reasoning';
    try {
      const result = await apiRequest('points.php', { method: 'POST', body: JSON.stringify({ team_id: equipeId, category, amount }) });
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (equipe && result.team) {
        equipe.reputationDecouvertes = result.team.discovery_points;
        equipe.reputationRaisonnement = result.team.reasoning_points;
        equipe.reputation = equipe.reputationDecouvertes + equipe.reputationRaisonnement;
        equipe.level = result.team.level;
        equipe.budget = result.team.budget;
      }
      notify(); return true;
    } catch(e) { console.error('addReputation:', e); return false; }
  };

  const removeReputation = async (equipeId, type, amount = 1) => addReputation(equipeId, type, -amount);

  const purchaseResource = async (equipeId, resourceId) => {
    try {
      const result = await apiRequest('purchases.php', { method: 'POST', body: JSON.stringify({ team_id: equipeId, resource_id: resourceId }) });
      const equipe = data.equipes.find(e => e.id === equipeId);
      if (equipe) { equipe.purchasedResources.push(resourceId); equipe.budget = result.new_budget; }
      const resource = data.resources.find(r => r.id === resourceId);
      notify();
      return { success: true, resource };
    } catch(e) { return { success: false, error: e.message }; }
  };

  const getMemberSessions = async (equipeId) => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`sessions_${equipeId}`);
    return stored ? JSON.parse(stored) : [];
  };

  const updateMemberSession = async (equipeId, memberName, sessionNumber, grade) => {
    if (typeof window === 'undefined') return false;
    const sessions = await getMemberSessions(equipeId);
    const existing = sessions.find(s => s.member_name === memberName);
    if (existing) { existing[`session_${sessionNumber}`] = grade; }
    else { sessions.push({ team_id: equipeId, member_name: memberName, [`session_${sessionNumber}`]: grade }); }
    localStorage.setItem(`sessions_${equipeId}`, JSON.stringify(sessions));
    notify(); return true;
  };

  if (typeof window !== 'undefined') {
    Promise.all([loadAllClasses(), loadResources()]).catch(err => console.error('Init gameStore error:', err));
  }

  return {
    getClasses:          ()           => [...data.classes],
    getEquipesByClasse:  (classeId)   => data.equipes.filter(e => e.classeId === classeId),
    getEquipe:           (equipeId)   => { const e = data.equipes.find(e => e.id === equipeId); return e ? { ...e } : null; },
    getClasseInfo:       (classeId)   => { const c = data.classes.find(c => c.id === classeId); return c ? { ...c } : null; },
    getResources:        ()           => [...data.resources],
    getResourcesByLevel: (level)      => data.resources.filter(r => r.level <= level),
    getResource:         (resourceId) => data.resources.find(r => r.id === resourceId),
    getLevelConfig:      ()           => ({ ...LEVEL_CONFIG }),
    verifyTeacherPin,
    loadClasse: loadClasseData,
    createClasse, updateClasse, deleteClasse, refreshClasses: loadAllClasses,
    createEquipe, updateEquipe, deleteEquipe,
    loadResources, createResource, updateResource, deleteResource,
    addReputation, removeReputation,
    purchaseResource,
    getMemberSessions, updateMemberSession,
    subscribe,
  };
};

let gameStoreInstance = null;
export const getGameStore = () => {
  if (!gameStoreInstance) gameStoreInstance = createGameStore();
  return gameStoreInstance;
};
