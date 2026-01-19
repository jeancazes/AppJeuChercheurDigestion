'use client';

import React, { useState, useEffect } from 'react';
import { getGameStore, COLORS, LEVEL_CONFIG } from '@/lib/gameStore';

const MedicalIcons = {
  microscope: (<svg width="24" height="24" viewBox="0 0 100 100" fill="none"><circle cx="35" cy="25" r="15" stroke="currentColor" strokeWidth="6" fill="none"/><line x1="35" y1="40" x2="35" y2="70" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/><line x1="20" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/><line x1="35" y1="70" x2="35" y2="85" stroke="currentColor" strokeWidth="6"/></svg>),
  dna: (<svg width="24" height="24" viewBox="0 0 100 100" fill="none"><path d="M30 10 Q50 30 70 10" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M30 35 Q50 55 70 35" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M30 60 Q50 80 70 60" stroke="currentColor" strokeWidth="5" fill="none"/><line x1="30" y1="10" x2="30" y2="85" stroke="currentColor" strokeWidth="4"/><line x1="70" y1="10" x2="70" y2="85" stroke="currentColor" strokeWidth="4"/></svg>),
  heart: (<svg width="24" height="24" viewBox="0 0 100 100" fill="none"><path d="M50 85 C20 60 10 40 25 25 C35 15 50 20 50 35 C50 20 65 15 75 25 C90 40 80 60 50 85" stroke="currentColor" strokeWidth="5" fill="none"/></svg>),
  flask: (<svg width="24" height="24" viewBox="0 0 100 100" fill="none"><path d="M35 10 L35 40 L15 80 Q10 90 20 90 L80 90 Q90 90 85 80 L65 40 L65 10" stroke="currentColor" strokeWidth="5" fill="none"/><line x1="30" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="5"/></svg>),
  back: (<svg width="24" height="24" viewBox="0 0 100 100" fill="none"><path d="M60 20 L30 50 L60 80" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

const ClassSelectionPage = ({ onSelectClass, onBack }) => {
  const gameStore = getGameStore();
  const classes = gameStore.getClasses();
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
        <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Choisir ma classe</h1>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {classes.map(classe => (
          <button key={classe.id} onClick={() => onSelectClass(classe.id)} style={{ background: COLORS.white, border: `2px solid ${COLORS.cardBorder}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white }}>{MedicalIcons.flask}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: COLORS.textDark, fontSize: '1.1rem', fontWeight: '700' }}>{classe.name}</div>
                <div style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>{classe.anneeScolaire}</div>
              </div>
            </div>
            <div style={{ color: COLORS.primary, fontSize: '1.5rem' }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const TeamSelectionPage = ({ classeId, onSelectTeam, onBack }) => {
  const gameStore = getGameStore();
  const classeInfo = gameStore.getClasseInfo(classeId);
  const equipes = gameStore.getEquipesByClasse(classeId);
  const abbreviateName = (name) => { const parts = name.trim().split(' '); return parts.length >= 2 ? `${parts[0]} ${parts[parts.length-1][0]}.` : name; };
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
        <div><h1 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '800' }}>Choisir mon équipe</h1><p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>{classeInfo?.name}</p></div>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {equipes.map(equipe => (
          <button key={equipe.id} onClick={() => onSelectTeam(equipe.id)} style={{ background: COLORS.white, border: `2px solid ${COLORS.cardBorder}`, borderRadius: '16px', padding: '16px', cursor: 'pointer', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: COLORS.primaryDark, fontWeight: '700', fontSize: '1.1rem' }}>Équipe {equipe.numero}</span>
              <span style={{ background: COLORS.secondary, color: COLORS.primaryDark, padding: '4px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600' }}>{LEVEL_CONFIG[equipe.level].title}</span>
            </div>
            <div style={{ color: COLORS.textLight, fontSize: '0.9rem' }}>{equipe.membres.map(m => abbreviateName(m)).join(' • ')}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const HomePage = ({ equipe, classeInfo, onNavigate, onLogout }) => {
  const levelInfo = LEVEL_CONFIG[equipe.level];
  const avatars = ['👨‍⚕️', '👩‍⚕️', '🧑‍🔬', '👨‍🔬', '👩‍🔬'];
  const randomAvatar = avatars[equipe.numero % avatars.length];
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, padding: '24px 20px', borderRadius: '0 0 30px 30px', boxShadow: '0 8px 30px rgba(79, 195, 247, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '4px' }}>{classeInfo?.name} - Équipe {equipe.numero}</p><h1 style={{ color: COLORS.white, fontSize: '1.5rem', fontWeight: '800' }}>Bienvenue !</h1></div>
          <div style={{ fontSize: '3rem' }}>{randomAvatar}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}><div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Niveau</div><div style={{ color: COLORS.white, fontSize: '1.3rem', fontWeight: '800' }}>{levelInfo.title}</div></div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}><div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Budget</div><div style={{ color: COLORS.white, fontSize: '1.3rem', fontWeight: '800' }}>{equipe.budget}€</div></div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}><div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Réputation</div><div style={{ color: COLORS.white, fontSize: '1.3rem', fontWeight: '800' }}>{equipe.reputation} pts</div></div>
        </div>
      </div>
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[{ id: 'catalogue', icon: MedicalIcons.flask, label: 'Catalogue', desc: 'Acheter des ressources', color: COLORS.primary },
          { id: 'mes-ressources', icon: MedicalIcons.microscope, label: 'Mes Ressources', desc: 'Consulter mes achats', color: '#4CAF50' },
          { id: 'fiche', icon: MedicalIcons.heart, label: 'Mon Équipe', desc: 'Voir ma fiche', color: '#FF7043' },
          { id: 'aide', icon: MedicalIcons.dna, label: 'Aide', desc: 'Règles du jeu', color: '#AB47BC' }
        ].map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{ background: COLORS.white, border: `2px solid ${COLORS.cardBorder}`, borderRadius: '20px', padding: '20px', cursor: 'pointer', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, textAlign: 'left' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${item.color}20`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>{item.icon}</div>
            <div style={{ color: COLORS.textDark, fontWeight: '700', fontSize: '1rem' }}>{item.label}</div>
            <div style={{ color: COLORS.textLight, fontSize: '0.8rem', marginTop: '4px' }}>{item.desc}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <button onClick={onLogout} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `2px solid ${COLORS.cardBorder}`, background: COLORS.white, color: COLORS.textLight, fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>🔄 Changer d'équipe</button>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource, equipe, onPurchase }) => {
  const isOwned = equipe.purchasedResources.includes(resource.id);
  const isLocked = resource.level > equipe.level;
  const canAfford = resource.price <= equipe.budget;
  return (
    <div style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${isOwned ? COLORS.success : isLocked ? '#E0E0E0' : COLORS.cardBorder}`, opacity: isLocked ? 0.6 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{ color: COLORS.primaryDark, fontSize: '0.95rem', fontWeight: '700', flex: 1 }}>{resource.title}</h4>
        {isOwned && <span style={{ background: COLORS.success, color: COLORS.white, padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>✓ Acquis</span>}
      </div>
      <p style={{ color: COLORS.textLight, fontSize: '0.8rem', marginBottom: '12px', lineHeight: '1.4' }}>{resource.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: COLORS.primaryDark, fontWeight: '700' }}>{resource.price}€</span>
        {!isOwned && !isLocked && <button onClick={() => onPurchase(resource.id)} disabled={!canAfford} style={{ background: canAfford ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)` : '#E0E0E0', color: COLORS.white, border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', cursor: canAfford ? 'pointer' : 'not-allowed' }}>{canAfford ? 'Acheter' : 'Budget insuffisant'}</button>}
        {isOwned && resource.link && <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ background: COLORS.success, color: COLORS.white, borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>Accéder</a>}
        {isOwned && resource.inClass && <span style={{ background: '#FF9800', color: COLORS.white, borderRadius: '10px', padding: '8px 12px', fontSize: '0.8rem', fontWeight: '700' }}>📍 En classe</span>}
      </div>
    </div>
  );
};

const CataloguePage = ({ equipe, onBack, onPurchase }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const gameStore = getGameStore();
  const resources = gameStore.getResources();
  const types = gameStore.getResourceTypes();
  const filteredResources = resources.filter(r => (selectedType === 'all' || r.type === selectedType) && (selectedLevel === 'all' || r.level === parseInt(selectedLevel)));
  const groupedByLevel = [1, 2, 3, 4].map(level => ({ level, title: LEVEL_CONFIG[level].title, resources: filteredResources.filter(r => r.level === level) })).filter(g => g.resources.length > 0);
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
          <div><h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Catalogue</h1><p style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>Budget : {equipe.budget}€</p></div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ padding: '8px 12px', borderRadius: '10px', border: `2px solid ${COLORS.cardBorder}`, fontSize: '0.85rem', background: COLORS.white, flex: 1, minWidth: '150px' }}>
            <option value="all">Tous les types</option>
            {types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} style={{ padding: '8px 12px', borderRadius: '10px', border: `2px solid ${COLORS.cardBorder}`, fontSize: '0.85rem', background: COLORS.white }}>
            <option value="all">Tous niveaux</option>
            <option value="1">Niveau 1</option><option value="2">Niveau 2</option><option value="3">Niveau 3</option><option value="4">Niveau 4</option>
          </select>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {groupedByLevel.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textLight }}><p>Aucune ressource trouvée</p></div> : groupedByLevel.map(({ level, title, resources: levelResources }) => {
          const isLocked = level > equipe.level;
          return (
            <div key={level} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '10px 14px', background: isLocked ? '#F5F5F5' : COLORS.secondary, borderRadius: '12px', border: `2px solid ${isLocked ? '#E0E0E0' : COLORS.cardBorder}` }}>
                <span style={{ background: isLocked ? '#E0E0E0' : COLORS.primary, color: isLocked ? '#9E9E9E' : COLORS.white, padding: '4px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700' }}>{isLocked && '🔒 '}Niv. {level}</span>
                <span style={{ color: COLORS.primaryDark, fontWeight: '600', flex: 1 }}>{title}</span>
                <span style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>{levelResources.length} ressource{levelResources.length > 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{levelResources.map(resource => <ResourceCard key={resource.id} resource={resource} equipe={equipe} onPurchase={onPurchase}/>)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MesRessourcesPage = ({ equipe, onBack }) => {
  const gameStore = getGameStore();
  const purchasedResources = equipe.purchasedResources.map(id => gameStore.getResource(id)).filter(Boolean);
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Mes Ressources</h1>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {purchasedResources.length === 0 ? <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.textLight }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div><p>Vous n'avez pas encore acheté de ressources.</p></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {purchasedResources.map(resource => (
              <div key={resource.id} style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${COLORS.success}` }}>
                <h4 style={{ color: COLORS.primaryDark, fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px' }}>{resource.title}</h4>
                <p style={{ color: COLORS.textLight, fontSize: '0.8rem', marginBottom: '12px' }}>{resource.description}</p>
                {resource.link ? <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: COLORS.success, color: COLORS.white, borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>🔗 Accéder</a> : <span style={{ display: 'inline-block', background: '#FF9800', color: COLORS.white, borderRadius: '10px', padding: '8px 12px', fontSize: '0.8rem', fontWeight: '700' }}>📍 En classe</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FichePage = ({ equipe, classeInfo, onBack, onUpdateMembres }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMembres, setEditedMembres] = useState([...equipe.membres]);
  const [notification, setNotification] = useState(null);
  const levelInfo = LEVEL_CONFIG[equipe.level];
  const avatars = ['👨‍⚕️', '👩‍⚕️', '🧑‍🔬', '👨‍🔬', '👩‍🔬'];
  const randomAvatar = avatars[equipe.numero % avatars.length];
  const handleSave = () => {
    const filteredMembres = editedMembres.filter(m => m.trim() !== '');
    if (filteredMembres.length === 0) { setNotification({ type: 'error', message: "L'équipe doit avoir au moins un membre !" }); setTimeout(() => setNotification(null), 3000); return; }
    onUpdateMembres(filteredMembres);
    setIsEditing(false);
    setNotification({ type: 'success', message: 'Membres mis à jour !' });
    setTimeout(() => setNotification(null), 3000);
  };
  useEffect(() => { setEditedMembres([...equipe.membres]); }, [equipe.membres]);
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      {notification && <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: notification.type === 'success' ? COLORS.success : COLORS.error, color: COLORS.white, padding: '12px 24px', borderRadius: '12px', fontWeight: '700', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>{notification.type === 'success' ? '✓' : '✕'} {notification.message}</div>}
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Fiche Équipe</h1>
        </div>
        {!isEditing && <button onClick={() => setIsEditing(true)} style={{ background: COLORS.secondary, border: 'none', borderRadius: '10px', padding: '8px 16px', color: COLORS.primaryDark, fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>✏️ Modifier</button>}
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, borderRadius: '24px', padding: '24px', color: COLORS.white, marginBottom: '20px', boxShadow: '0 8px 30px rgba(79, 195, 247, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div><p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{classeInfo?.name} • {classeInfo?.anneeScolaire}</p><h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>Équipe {equipe.numero}</h2></div>
            <div style={{ fontSize: '4rem' }}>{randomAvatar}</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}><div style={{ opacity: 0.8, fontSize: '0.8rem' }}>Niveau</div><div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{levelInfo.title}</div></div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}><div style={{ opacity: 0.8, fontSize: '0.8rem' }}>Budget</div><div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{equipe.budget}€</div></div>
          </div>
        </div>
        <div style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', marginBottom: '16px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${COLORS.cardBorder}` }}>
          <h3 style={{ color: COLORS.primaryDark, fontWeight: '700', marginBottom: '12px' }}>Points de Réputation</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, background: COLORS.secondary, borderRadius: '12px', padding: '12px', textAlign: 'center' }}><div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>🔍 Découvertes</div><div style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>{equipe.reputationDecouvertes}</div></div>
            <div style={{ flex: 1, background: COLORS.secondary, borderRadius: '12px', padding: '12px', textAlign: 'center' }}><div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>🧠 Raisonnement</div><div style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>{equipe.reputationRaisonnement}</div></div>
            <div style={{ flex: 1, background: COLORS.primary, borderRadius: '12px', padding: '12px', textAlign: 'center' }}><div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Total</div><div style={{ color: COLORS.white, fontSize: '1.3rem', fontWeight: '800' }}>{equipe.reputation}</div></div>
          </div>
        </div>
        <div style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${COLORS.cardBorder}` }}>
          <h3 style={{ color: COLORS.primaryDark, fontWeight: '700', marginBottom: '12px' }}>Membres de l'équipe</h3>
          {isEditing ? (
            <div>
              {editedMembres.map((membre, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input type="text" value={membre} onChange={(e) => { const updated = [...editedMembres]; updated[index] = e.target.value; setEditedMembres(updated); }} placeholder={`Membre ${index + 1}`} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${COLORS.cardBorder}`, fontSize: '0.95rem', outline: 'none' }}/>
                  {editedMembres.length > 1 && <button onClick={() => setEditedMembres(editedMembres.filter((_, i) => i !== index))} style={{ background: COLORS.error, color: COLORS.white, border: 'none', borderRadius: '10px', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1rem' }}>🗑</button>}
                </div>
              ))}
              {editedMembres.length < 5 && <button onClick={() => setEditedMembres([...editedMembres, ''])} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `2px dashed ${COLORS.cardBorder}`, background: 'transparent', color: COLORS.textLight, fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' }}>+ Ajouter un membre</button>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button onClick={() => { setEditedMembres([...equipe.membres]); setIsEditing(false); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${COLORS.cardBorder}`, background: COLORS.white, color: COLORS.textLight, fontWeight: '600', cursor: 'pointer' }}>Annuler</button>
                <button onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>Enregistrer</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {equipe.membres.map((membre, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: COLORS.secondary, borderRadius: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{['👨‍⚕️', '👩‍⚕️', '🧑‍🔬', '👨‍🔬', '👩‍🔬'][index % 5]}</span>
                  <span style={{ color: COLORS.textDark, fontWeight: '600' }}>{membre}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AidePage = ({ onBack }) => (
  <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
    <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary }}>{MedicalIcons.back}</button>
        <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Aide & Règles</h1>
      </div>
    </div>
    <div style={{ padding: '20px' }}>
      {[{ title: '🎯 Objectif', content: 'Résoudre des problèmes de digestion en achetant et utilisant des ressources scientifiques.' },
        { title: '💰 Budget', content: 'Votre équipe commence avec 100€. Gérez-le bien pour acheter les ressources nécessaires !' },
        { title: '⭐ Réputation', content: 'Gagnez des points de Découverte (🔍) et de Raisonnement (🧠). Chaque 5 points = niveau supérieur !' },
        { title: '📈 Niveaux', content: 'Niveau 1: 100€ • Niveau 2: 200€ • Niveau 3: 500€ • Niveau 4: 1000€' },
        { title: '🔓 Ressources', content: 'Chaque niveau débloque de nouvelles catégories de ressources plus avancées.' }
      ].map((item, i) => (
        <div key={i} style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${COLORS.cardBorder}` }}>
          <h3 style={{ color: COLORS.primaryDark, fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
          <p style={{ color: COLORS.textLight, fontSize: '0.9rem', lineHeight: '1.5' }}>{item.content}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function StudentApp() {
  const [step, setStep] = useState('classe');
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [equipeId, setEquipeId] = useState(null);
  const [page, setPage] = useState('home');
  const [equipe, setEquipe] = useState(null);
  const [classeInfo, setClasseInfo] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!equipeId) return;
    const gameStore = getGameStore();
    const loadData = () => { const e = gameStore.getEquipe(equipeId); setEquipe(e); if (e) setClasseInfo(gameStore.getClasseInfo(e.classeId)); };
    loadData();
    return gameStore.subscribe(loadData);
  }, [equipeId]);

  const handleSelectClass = (classeId) => { setSelectedClasse(classeId); setStep('equipe'); };
  const handleSelectTeam = (teamId) => { setEquipeId(teamId); setStep('app'); setPage('home'); };
  const handleLogout = () => { setStep('classe'); setSelectedClasse(null); setEquipeId(null); setEquipe(null); setPage('home'); };
  const handlePurchase = (resourceId) => {
    const gameStore = getGameStore();
    const result = gameStore.purchaseResource(equipeId, resourceId);
    setNotification(result.success ? { type: 'success', message: `"${result.resource.title}" acheté !` } : { type: 'error', message: result.error });
    setTimeout(() => setNotification(null), 3000);
  };
  const handleUpdateMembres = (newMembres) => { const gameStore = getGameStore(); gameStore.updateEquipe(equipeId, { membres: newMembres }); };

  if (step === 'classe') return <ClassSelectionPage onSelectClass={handleSelectClass} onBack={() => window.location.href = '/'} />;
  if (step === 'equipe') return <TeamSelectionPage classeId={selectedClasse} onSelectTeam={handleSelectTeam} onBack={() => setStep('classe')} />;
  if (!equipe) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div><p style={{ color: COLORS.textLight }}>Chargement...</p></div></div>;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Nunito', 'Segoe UI', sans-serif", position: 'relative', boxShadow: '0 0 60px rgba(0,0,0,0.1)' }}>
      {notification && <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: notification.type === 'success' ? COLORS.success : COLORS.error, color: COLORS.white, padding: '14px 28px', borderRadius: '14px', fontWeight: '700', boxShadow: '0 8px 30px rgba(0,0,0,0.25)', fontSize: '0.95rem', maxWidth: '90%', textAlign: 'center' }}>{notification.type === 'success' ? '✓' : '✕'} {notification.message}</div>}
      {page === 'home' && <HomePage equipe={equipe} classeInfo={classeInfo} onNavigate={setPage} onLogout={handleLogout} />}
      {page === 'catalogue' && <CataloguePage equipe={equipe} onBack={() => setPage('home')} onPurchase={handlePurchase} />}
      {page === 'mes-ressources' && <MesRessourcesPage equipe={equipe} onBack={() => setPage('home')} />}
      {page === 'fiche' && <FichePage equipe={equipe} classeInfo={classeInfo} onBack={() => setPage('home')} onUpdateMembres={handleUpdateMembres} />}
      {page === 'aide' && <AidePage onBack={() => setPage('home')} />}
    </div>
  );
}
