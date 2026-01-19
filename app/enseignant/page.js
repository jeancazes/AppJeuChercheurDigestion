'use client';

import React, { useState, useEffect } from 'react';
import { getGameStore, COLORS, LEVEL_CONFIG } from '@/lib/gameStore';

const PinCodePage = ({ onSuccess, onBack }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const correctPin = '1447';
  const maxAttempts = 3;
  const lockDuration = 20 * 60 * 1000;

  useEffect(() => {
    const storedLockTime = localStorage.getItem('teacherLockTime');
    if (storedLockTime) {
      const lockEndTime = parseInt(storedLockTime);
      if (Date.now() < lockEndTime) { setLocked(true); setLockTime(lockEndTime); }
      else { localStorage.removeItem('teacherLockTime'); localStorage.removeItem('teacherAttempts'); }
    }
    const storedAttempts = localStorage.getItem('teacherAttempts');
    if (storedAttempts) setAttempts(parseInt(storedAttempts));
  }, []);

  useEffect(() => {
    if (locked && lockTime) {
      const interval = setInterval(() => {
        const remaining = lockTime - Date.now();
        if (remaining <= 0) { setLocked(false); setLockTime(null); setAttempts(0); localStorage.removeItem('teacherLockTime'); localStorage.removeItem('teacherAttempts'); }
        else setRemainingTime(Math.ceil(remaining / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [locked, lockTime]);

  const handleKeyPress = (digit) => {
    if (locked) return;
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        if (newPin === correctPin) { localStorage.removeItem('teacherAttempts'); onSuccess(); }
        else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          localStorage.setItem('teacherAttempts', newAttempts.toString());
          if (newAttempts >= maxAttempts) { const lockEndTime = Date.now() + lockDuration; setLocked(true); setLockTime(lockEndTime); localStorage.setItem('teacherLockTime', lockEndTime.toString()); setError(''); }
          else setError(`Code incorrect (${maxAttempts - newAttempts} essai${maxAttempts - newAttempts > 1 ? 's' : ''} restant${maxAttempts - newAttempts > 1 ? 's' : ''})`);
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => { if (!locked) { setPin(pin.slice(0, -1)); setError(''); } };
  const formatTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs.toString().padStart(2, '0')}`; };

  return (
    <div style={{ minHeight: '100vh', background: locked ? `linear-gradient(180deg, #FFEBEE 0%, #FFCDD2 100%)` : `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: locked ? '#C62828' : COLORS.primaryDark, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>← Retour</button>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👨‍🏫</div>
        <h1 style={{ color: locked ? '#C62828' : COLORS.primaryDark, fontSize: '1.5rem', fontWeight: '800' }}>Espace Enseignant</h1>
        <p style={{ color: locked ? '#B71C1C' : COLORS.textLight, marginTop: '8px' }}>{locked ? 'Accès temporairement bloqué' : 'Entrez votre code PIN'}</p>
      </div>
      {locked ? (
        <div style={{ background: '#C62828', borderRadius: '20px', padding: '30px', color: 'white', textAlign: 'center', boxShadow: '0 8px 30px rgba(198, 40, 40, 0.4)', maxWidth: '300px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>Accès bloqué</h2>
          <p style={{ opacity: 0.9, marginBottom: '20px' }}>Trop de tentatives échouées. Veuillez patienter.</p>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '16px', fontSize: '2rem', fontWeight: '800' }}>{formatTime(remainingTime)}</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: '50px', height: '50px', borderRadius: '12px', border: `3px solid ${pin.length > i ? COLORS.primary : COLORS.cardBorder}`, background: pin.length > i ? COLORS.primary : COLORS.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                {pin.length > i && <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: COLORS.white }} />}
              </div>
            ))}
          </div>
          {error && <div style={{ background: COLORS.error, color: COLORS.white, padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600', fontSize: '0.9rem' }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '280px', width: '100%' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((item, i) => (
              item === null ? <div key={i} /> : (
                <button key={i} onClick={() => item === 'del' ? handleDelete() : handleKeyPress(item.toString())} style={{ width: '80px', height: '80px', borderRadius: '50%', border: 'none', background: item === 'del' ? 'transparent' : COLORS.white, color: item === 'del' ? COLORS.textLight : COLORS.primaryDark, fontSize: item === 'del' ? '1.5rem' : '1.8rem', fontWeight: '700', cursor: 'pointer', boxShadow: item === 'del' ? 'none' : '0 4px 15px rgba(0,0,0,0.1)' }}>{item === 'del' ? '⌫' : item}</button>
              )
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MainMenuPage = ({ onSelectOption, onLogout }) => (
  <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
    <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, padding: '24px 20px', borderRadius: '0 0 30px 30px', boxShadow: '0 8px 30px rgba(79, 195, 247, 0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ color: COLORS.white, fontSize: '1.5rem', fontWeight: '800' }}>Espace Enseignant</h1><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '4px' }}>Le Laboratoire Fabuleux</p></div>
        <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '10px 16px', color: COLORS.white, fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>🚪 Déconnexion</button>
      </div>
    </div>
    <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={() => onSelectOption('classes')} style={{ background: COLORS.white, border: `2px solid ${COLORS.cardBorder}`, borderRadius: '20px', padding: '24px', cursor: 'pointer', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>👥</div>
        <div><div style={{ color: COLORS.textDark, fontWeight: '700', fontSize: '1.1rem' }}>Gestion des Équipes</div><div style={{ color: COLORS.textLight, fontSize: '0.85rem', marginTop: '4px' }}>Attribuer des points de réputation</div></div>
      </button>
      <button onClick={() => onSelectOption('resources')} style={{ background: COLORS.white, border: `2px solid ${COLORS.cardBorder}`, borderRadius: '20px', padding: '24px', cursor: 'pointer', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>📚</div>
        <div><div style={{ color: COLORS.textDark, fontWeight: '700', fontSize: '1.1rem' }}>Gestion des Ressources</div><div style={{ color: COLORS.textLight, fontSize: '0.85rem', marginTop: '4px' }}>Voir les ressources disponibles</div></div>
      </button>
    </div>
  </div>
);

const ClassSelectionPage = ({ onSelectClass, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingClasse, setEditingClasse] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const gameStore = getGameStore();
  const [classes, setClasses] = useState(gameStore.getClasses());
  useEffect(() => gameStore.subscribe(() => setClasses(gameStore.getClasses())), []);

  const handleReset = () => { gameStore.resetAllEquipes(); setShowResetConfirm(false); };
  const handleAddClass = () => { const newClasse = gameStore.addClass('Nouvelle classe', '2024-2025'); setEditingClasse({ ...newClasse, isNew: true }); };
  const handleSaveClasse = () => { if (editingClasse) { gameStore.updateClasse(editingClasse.id, { name: editingClasse.name, anneeScolaire: editingClasse.anneeScolaire }); setEditingClasse(null); } };
  const handleDeleteClasse = (classeId) => { if (confirm('Supprimer cette classe et toutes ses équipes ?')) { gameStore.deleteClasse(classeId); setEditingClasse(null); } };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      {showResetConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: COLORS.white, borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ color: COLORS.error, fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>⚠️ Remise à zéro générale</h3>
            <p style={{ color: COLORS.textLight, marginBottom: '20px', lineHeight: '1.5' }}>Cette action va réinitialiser <strong>TOUTES</strong> les équipes :<br/>• Niveau → 1<br/>• Budget → 100€<br/>• Points → 0<br/>• Ressources → supprimées<br/>• <strong style={{ color: COLORS.error }}>Noms des membres → effacés</strong></p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `2px solid ${COLORS.cardBorder}`, background: COLORS.white, color: COLORS.textLight, fontWeight: '600', cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleReset} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: COLORS.error, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
      {editingClasse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: COLORS.white, borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>{editingClasse.isNew ? 'Nouvelle classe' : 'Modifier la classe'}</h3>
            <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', color: COLORS.textLight, fontSize: '0.85rem', marginBottom: '6px' }}>Nom</label><input type="text" value={editingClasse.name} onChange={(e) => setEditingClasse({ ...editingClasse, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `2px solid ${COLORS.cardBorder}`, fontSize: '1rem', outline: 'none' }}/></div>
            <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: COLORS.textLight, fontSize: '0.85rem', marginBottom: '6px' }}>Année scolaire</label><input type="text" value={editingClasse.anneeScolaire} onChange={(e) => setEditingClasse({ ...editingClasse, anneeScolaire: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `2px solid ${COLORS.cardBorder}`, fontSize: '1rem', outline: 'none' }}/></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setEditingClasse(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `2px solid ${COLORS.cardBorder}`, background: COLORS.white, color: COLORS.textLight, fontWeight: '600', cursor: 'pointer' }}>Annuler</button>
              {!editingClasse.isNew && <button onClick={() => handleDeleteClasse(editingClasse.id)} style={{ padding: '14px 20px', borderRadius: '12px', border: 'none', background: COLORS.error, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>🗑</button>}
              <button onClick={handleSaveClasse} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary, fontSize: '1.2rem' }}>←</button>
          <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Gestion des Classes</h1>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} style={{ background: isEditing ? COLORS.primary : COLORS.secondary, border: 'none', borderRadius: '10px', padding: '8px 16px', color: isEditing ? COLORS.white : COLORS.primaryDark, fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>{isEditing ? '✓ Terminer' : '✏️ Modifier'}</button>
      </div>
      <div style={{ padding: '20px' }}>
        {isEditing && <button onClick={handleAddClass} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: `2px dashed ${COLORS.primary}`, background: 'transparent', color: COLORS.primary, fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>+ Ajouter une classe</button>}
        {classes.map(classe => {
          const equipes = gameStore.getEquipesByClasse(classe.id);
          return (
            <button key={classe.id} onClick={() => isEditing ? setEditingClasse(classe) : onSelectClass(classe)} style={{ width: '100%', background: COLORS.white, border: `2px solid ${COLORS.cardBorder}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontSize: '1.3rem' }}>🏫</div>
                <div><div style={{ color: COLORS.textDark, fontSize: '1.1rem', fontWeight: '700' }}>{classe.name}</div><div style={{ color: COLORS.textLight, fontSize: '0.85rem' }}>{classe.anneeScolaire} • {equipes.length} équipes</div></div>
              </div>
              <div style={{ color: COLORS.primary, fontSize: '1.5rem' }}>{isEditing ? '✏️' : '→'}</div>
            </button>
          );
        })}
        <div style={{ marginTop: '30px', padding: '16px', background: '#FFEBEE', borderRadius: '16px', border: '2px solid #FFCDD2' }}>
          <h3 style={{ color: '#C62828', fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>🔄 Remise à zéro générale</h3>
          <p style={{ color: '#B71C1C', fontSize: '0.85rem', marginBottom: '12px' }}>Réinitialise toutes les équipes (niveaux, budgets, points, ressources ET noms des membres)</p>
          <button onClick={() => setShowResetConfirm(true)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#C62828', color: COLORS.white, fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>Réinitialiser toutes les équipes</button>
        </div>
      </div>
    </div>
  );
};

const TeamManagementPage = ({ classe, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const gameStore = getGameStore();
  const [equipes, setEquipes] = useState(gameStore.getEquipesByClasse(classe.id));
  useEffect(() => gameStore.subscribe(() => setEquipes(gameStore.getEquipesByClasse(classe.id))), [classe.id]);
  const abbreviateName = (name) => { const parts = name.trim().split(' '); return parts.length >= 2 ? `${parts[0]} ${parts[parts.length-1][0]}.` : name; };
  const handleAddPoint = (equipeId, type) => gameStore.addReputation(equipeId, type, 1);
  const handleRemovePoint = (equipeId, type) => gameStore.addReputation(equipeId, type, -1);
  const handleAddEquipe = () => gameStore.addEquipe(classe.id);
  const handleDeleteEquipe = (equipeId) => { if (confirm('Supprimer cette équipe ?')) gameStore.deleteEquipe(equipeId); };
  const totalPoints = equipes.reduce((sum, e) => sum + e.reputation, 0);
  const avgLevel = equipes.length > 0 ? (equipes.reduce((sum, e) => sum + e.level, 0) / equipes.length).toFixed(1) : 0;

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary, fontSize: '1.2rem' }}>←</button>
          <div><h1 style={{ color: COLORS.primaryDark, fontSize: '1.2rem', fontWeight: '800' }}>{classe.name}</h1><p style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>{classe.anneeScolaire}</p></div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} style={{ background: isEditing ? COLORS.primary : COLORS.secondary, border: 'none', borderRadius: '10px', padding: '8px 16px', color: isEditing ? COLORS.white : COLORS.primaryDark, fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>{isEditing ? '✓ Terminer' : '✏️ Modifier'}</button>
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: '14px', padding: '12px', textAlign: 'center', boxShadow: `0 4px 15px ${COLORS.cardShadow}` }}><div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Points totaux</div><div style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>{totalPoints}</div></div>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: '14px', padding: '12px', textAlign: 'center', boxShadow: `0 4px 15px ${COLORS.cardShadow}` }}><div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Niveau moyen</div><div style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>{avgLevel}</div></div>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: '14px', padding: '12px', textAlign: 'center', boxShadow: `0 4px 15px ${COLORS.cardShadow}` }}><div style={{ color: COLORS.textLight, fontSize: '0.8rem' }}>Équipes</div><div style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>{equipes.length}</div></div>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        {isEditing && <button onClick={handleAddEquipe} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `2px dashed ${COLORS.primary}`, background: 'transparent', color: COLORS.primary, fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>+ Ajouter une équipe</button>}
        {equipes.map(equipe => {
          const levelInfo = LEVEL_CONFIG[equipe.level];
          return (
            <div key={equipe.id} style={{ background: COLORS.white, borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: `0 4px 15px ${COLORS.cardShadow}`, border: `2px solid ${COLORS.cardBorder}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: COLORS.primaryDark, fontWeight: '700', fontSize: '1.1rem' }}>Équipe {equipe.numero}</span><span style={{ background: COLORS.secondary, color: COLORS.primaryDark, padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600' }}>{levelInfo.title}</span></div>
                  <div style={{ color: COLORS.textLight, fontSize: '0.85rem', marginTop: '4px' }}>{equipe.membres.map(m => abbreviateName(m)).join(' • ')}</div>
                </div>
                {isEditing && <button onClick={() => handleDeleteEquipe(equipe.id)} style={{ background: COLORS.error, color: COLORS.white, border: 'none', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1rem' }}>🗑</button>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, background: COLORS.secondary, borderRadius: '12px', padding: '10px' }}>
                  <div style={{ color: COLORS.textLight, fontSize: '0.75rem', textAlign: 'center', marginBottom: '6px' }}>🔍 Découvertes</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <button onClick={() => handleRemovePoint(equipe.id, 'decouvertes')} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: COLORS.error, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>-</button>
                    <span style={{ color: COLORS.primaryDark, fontWeight: '800', fontSize: '1.2rem', minWidth: '30px', textAlign: 'center' }}>{equipe.reputationDecouvertes}</span>
                    <button onClick={() => handleAddPoint(equipe.id, 'decouvertes')} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: COLORS.success, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
                <div style={{ flex: 1, background: COLORS.secondary, borderRadius: '12px', padding: '10px' }}>
                  <div style={{ color: COLORS.textLight, fontSize: '0.75rem', textAlign: 'center', marginBottom: '6px' }}>🧠 Raisonnement</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <button onClick={() => handleRemovePoint(equipe.id, 'raisonnement')} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: COLORS.error, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>-</button>
                    <span style={{ color: COLORS.primaryDark, fontWeight: '800', fontSize: '1.2rem', minWidth: '30px', textAlign: 'center' }}>{equipe.reputationRaisonnement}</span>
                    <button onClick={() => handleAddPoint(equipe.id, 'raisonnement')} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: COLORS.success, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
                <div style={{ background: COLORS.primary, borderRadius: '12px', padding: '10px', minWidth: '70px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', textAlign: 'center', marginBottom: '6px' }}>Total</div>
                  <div style={{ color: COLORS.white, fontWeight: '800', fontSize: '1.4rem', textAlign: 'center' }}>{equipe.reputation}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResourceManagementPage = ({ onBack }) => {
  const gameStore = getGameStore();
  const [resources, setResources] = useState(gameStore.getResources());
  const [sortBy, setSortBy] = useState('level');
  useEffect(() => gameStore.subscribe(() => setResources(gameStore.getResources())), []);
  const sortedResources = [...resources].sort((a, b) => sortBy === 'level' ? a.level - b.level : sortBy === 'price' ? a.price - b.price : a.type.localeCompare(b.type));
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)` }}>
      <div style={{ background: COLORS.white, padding: '16px 20px', borderBottom: `2px solid ${COLORS.cardBorder}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: COLORS.primary, fontSize: '1.2rem' }}>←</button>
        <h1 style={{ color: COLORS.primaryDark, fontSize: '1.3rem', fontWeight: '800' }}>Ressources</h1>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: '10px', border: `2px solid ${COLORS.cardBorder}`, fontSize: '0.85rem', background: COLORS.white }}>
          <option value="level">Par niveau</option><option value="price">Par prix</option><option value="type">Par type</option>
        </select>
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{ color: COLORS.textLight, marginBottom: '16px', fontSize: '0.9rem' }}>{resources.length} ressources disponibles</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedResources.map(resource => (
            <div key={resource.id} style={{ background: COLORS.white, borderRadius: '12px', padding: '12px', boxShadow: `0 2px 10px ${COLORS.cardShadow}`, border: `1px solid ${COLORS.cardBorder}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ background: COLORS.primary, color: COLORS.white, padding: '2px 6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>Niv.{resource.level}</span>
                    <span style={{ color: COLORS.primaryDark, fontWeight: '600', fontSize: '0.9rem' }}>{resource.title}</span>
                  </div>
                  <div style={{ color: COLORS.textLight, fontSize: '0.75rem' }}>{resource.type}</div>
                </div>
                <span style={{ color: COLORS.primaryDark, fontWeight: '700' }}>{resource.price}€</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function TeacherApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('menu');
  const [selectedClass, setSelectedClass] = useState(null);
  const handleLogout = () => { setIsAuthenticated(false); setCurrentView('menu'); setSelectedClass(null); };
  if (!isAuthenticated) return <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Nunito', 'Segoe UI', sans-serif", boxShadow: '0 0 60px rgba(0,0,0,0.1)' }}><PinCodePage onSuccess={() => setIsAuthenticated(true)} onBack={() => window.location.href = '/'} /></div>;
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Nunito', 'Segoe UI', sans-serif", position: 'relative', boxShadow: '0 0 60px rgba(0,0,0,0.1)' }}>
      {currentView === 'menu' && <MainMenuPage onSelectOption={(option) => setCurrentView(option)} onLogout={handleLogout} />}
      {currentView === 'classes' && !selectedClass && <ClassSelectionPage onSelectClass={setSelectedClass} onBack={() => setCurrentView('menu')} />}
      {currentView === 'classes' && selectedClass && <TeamManagementPage classe={selectedClass} onBack={() => setSelectedClass(null)} />}
      {currentView === 'resources' && <ResourceManagementPage onBack={() => setCurrentView('menu')} />}
    </div>
  );
}
