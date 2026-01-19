# Modification du bouton de réinitialisation

## Fichier à modifier
`lib/gameStore.js` (ou `utils/gameStore.js` selon la structure du projet)

## Fonction à modifier
`resetAllEquipes`

## Modification à effectuer

### Code actuel :
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

### Code modifié (avec réinitialisation des membres) :
```javascript
resetAllEquipes: () => {
  data.equipes.forEach(equipe => {
    equipe.level = 1;
    equipe.budget = 100;
    equipe.reputation = 0;
    equipe.reputationDecouvertes = 0;
    equipe.reputationRaisonnement = 0;
    equipe.purchasedResources = [];
    equipe.membres = [];  // ← LIGNE AJOUTÉE : Vide les noms des membres
  });
  notify();
  return true;
},
```

## Alternative (avec membres par défaut)

Si vous préférez réinitialiser avec des membres par défaut plutôt que de vider complètement :

```javascript
resetAllEquipes: () => {
  data.equipes.forEach(equipe => {
    equipe.level = 1;
    equipe.budget = 100;
    equipe.reputation = 0;
    equipe.reputationDecouvertes = 0;
    equipe.reputationRaisonnement = 0;
    equipe.purchasedResources = [];
    equipe.membres = ['Élève 1', 'Élève 2'];  // ← Réinitialise avec 2 membres par défaut
  });
  notify();
  return true;
},
```

## Également modifier la fonction resetClasseEquipes

Pour rester cohérent, il faut aussi modifier la fonction `resetClasseEquipes` de la même manière :

```javascript
resetClasseEquipes: (classeId) => {
  data.equipes.forEach(equipe => {
    if (equipe.classeId === classeId) {
      equipe.level = 1;
      equipe.budget = 100;
      equipe.reputation = 0;
      equipe.reputationDecouvertes = 0;
      equipe.reputationRaisonnement = 0;
      equipe.purchasedResources = [];
      equipe.membres = [];  // ← LIGNE AJOUTÉE
    }
  });
  notify();
  return true;
},
```

## Instructions d'application

1. Ouvrez le fichier `lib/gameStore.js` (ou `utils/gameStore.js`)
2. Trouvez la fonction `resetAllEquipes`
3. Ajoutez la ligne `equipe.membres = [];` après la ligne `equipe.purchasedResources = [];`
4. Faites la même modification dans la fonction `resetClasseEquipes`
5. Sauvegardez le fichier
6. Testez la fonctionnalité de réinitialisation

## Impact

Après cette modification :
- Le bouton "Réinitialiser toutes les équipes" effacera également les noms des membres
- Les équipes seront complètement réinitialisées : niveau 1, budget 100€, aucun point de réputation, aucune ressource achetée, ET aucun membre
- Les enseignants devront reconfigurer les noms des membres après une réinitialisation
