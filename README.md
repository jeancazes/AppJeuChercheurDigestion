# Modification du bouton de réinitialisation - v7

## 📋 Résumé de la modification

Cette version ajoute la réinitialisation des noms des membres d'équipe lors de l'utilisation du bouton "Réinitialiser toutes les équipes".

### ⚡ Changements effectués

**Fichier modifié :** `lib/gameStore.js`

**Fonctions modifiées :**
1. `resetAllEquipes()` - Ligne ajoutée : `equipe.membres = [];`
2. `resetClasseEquipes(classeId)` - Ligne ajoutée : `equipe.membres = [];`

## 🔧 Installation

### Option 1 : Remplacement complet du fichier

1. Localisez le fichier `lib/gameStore.js` dans votre projet actuel
2. Remplacez-le par le fichier `lib/gameStore.js` fourni dans ce dossier
3. Testez l'application

### Option 2 : Modification manuelle

Si vous préférez modifier votre fichier existant :

1. Ouvrez `lib/gameStore.js`
2. Trouvez la fonction `resetAllEquipes` (vers la ligne 280-290)
3. Ajoutez la ligne `equipe.membres = [];` après `equipe.purchasedResources = [];`
4. Faites la même chose dans la fonction `resetClasseEquipes` (vers la ligne 295-310)

**Avant :**
```javascript
resetAllEquipes: () => {
  data.equipes.forEach(equipe => {
    equipe.level = 1;
    equipe.budget = 100;
    equipe.reputation = 0;
    equipe.reputationDecouvertes = 0;
    equipe.reputationRaisonnement = 0;
    equipe.purchasedResources = [];
  });
  notify();
  return true;
},
```

**Après :**
```javascript
resetAllEquipes: () => {
  data.equipes.forEach(equipe => {
    equipe.level = 1;
    equipe.budget = 100;
    equipe.reputation = 0;
    equipe.reputationDecouvertes = 0;
    equipe.reputationRaisonnement = 0;
    equipe.purchasedResources = [];
    equipe.membres = [];  // ← LIGNE AJOUTÉE
  });
  notify();
  return true;
},
```

## ✅ Test de la modification

1. Lancez l'application enseignant
2. Créez une classe et ajoutez des équipes avec des noms de membres
3. Attribuez des points de réputation
4. Cliquez sur le bouton "🔄 Réinitialiser toutes les équipes"
5. Confirmez l'action
6. Vérifiez que :
   - Les équipes sont revenues au niveau 1
   - Le budget est à 100€
   - Les points de réputation sont à 0
   - **Les noms des membres ont été effacés** ✨

## 📁 Structure du projet

```
laboratoire-fabuleux-v7/
├── lib/
│   └── gameStore.js          ← Fichier principal modifié
├── MODIFICATION_RESET.md     ← Documentation détaillée
└── README.md                 ← Ce fichier
```

## 🎯 Impact de la modification

### Comportement après réinitialisation

| Élément | Avant | Après modification |
|---------|-------|-------------------|
| Niveau | ✅ Réinitialisé à 1 | ✅ Réinitialisé à 1 |
| Budget | ✅ Réinitialisé à 100€ | ✅ Réinitialisé à 100€ |
| Réputation | ✅ Réinitialisé à 0 | ✅ Réinitialisé à 0 |
| Ressources achetées | ✅ Effacées | ✅ Effacées |
| **Noms des membres** | ❌ Conservés | **✅ Effacés** |

### Ce que les enseignants devront faire après une réinitialisation

- Reconfigurer les noms des membres de chaque équipe
- Les autres données (numéro d'équipe, classe) restent intactes

## 📞 Support

Pour toute question sur cette modification, référez-vous au fichier `MODIFICATION_RESET.md` qui contient des informations plus détaillées.

## 🔄 Versions

- **v6** : Sans réinitialisation des membres
- **v7** : Avec réinitialisation des membres (version actuelle)
