# 🔐 Système de Code PIN pour les Équipes

## 🎯 Fonctionnalité Ajoutée

Un système de code PIN à 4 chiffres sécurise maintenant l'accès de chaque équipe à leur fiche personnelle.

---

## 📋 Vue d'Ensemble

### Pour les Enseignants
- **Définir le PIN** de chaque équipe lors de la création/modification
- **Voir le PIN** dans le tableau de gestion (colonne "Code PIN")
- **Modifier le PIN** à tout moment

### Pour les Élèves
- **Entrer le PIN** après avoir sélectionné leur équipe
- **Digicode tactile** avec interface intuitive
- **Vérification automatique** dès 4 chiffres saisis
- **Compteur de tentatives** visible

---

## 🎨 Interface Digicode Élève

```
╔══════════════════════════════╗
║     🔒 Code PIN              ║
║     Équipe 1                 ║
║  Alice Dupont, Bob Martin    ║
╠══════════════════════════════╣
║                              ║
║   ●  ●  ●  ○                ║
║   (3 chiffres saisis)        ║
║                              ║
╠══════════════════════════════╣
║   [1]  [2]  [3]             ║
║   [4]  [5]  [6]             ║
║   [7]  [8]  [9]             ║
║   [C]  [0]  [⌫]             ║
╠══════════════════════════════╣
║   Tentatives : 2             ║
║                              ║
║  ← Retour à la sélection     ║
╚══════════════════════════════╝
```

---

## 📖 Guide d'Utilisation

### Enseignant : Créer/Modifier PIN

1. Aller dans "Gestion des Équipes"
2. Créer ou éditer une équipe
3. Champ "Code PIN (4 chiffres)"
4. Entrer 4 chiffres (ex: 1234)
5. Enregistrer

### Élève : Entrer PIN

1. Sélectionner sa classe
2. Sélectionner son équipe
3. **Digicode s'affiche**
4. Taper les 4 chiffres
5. Vérification automatique
6. Accès à la fiche !

---

## 🔧 Modifications Techniques

### Base de Données
```sql
ALTER TABLE teams ADD COLUMN pin_code TEXT DEFAULT '0000';
```

### Fonctions Modifiées
- `createEquipe` : Accepte pinCode
- `updateEquipe` : Gère pinCode
- `convertTeamFromSupabase` : Inclut pinCode

### Composants Ajoutés
- **PinCodePage** : Interface digicode élève

### Flow Navigation Élève
```
Classe → Équipe → 🆕 PIN → Fiche
```

---

## ✅ Fonctionnalités

### Digicode
- Clavier 3×4 (0-9, C, ⌫)
- Boutons 70px (tactile)
- 4 cercles indicateurs
- Vérification auto
- Messages d'erreur
- Compteur tentatives

### Affichage Enseignant
- **Desktop** : Colonne "Code PIN"
- **Mobile** : Section dans carte
- **Format** : 🔒 1234

---

## 🎯 Cas d'Usage

### Première Utilisation
```
1. Enseignant crée Équipe 1, PIN: 1234
2. Informe élèves : "Code = 1234"
3. Élèves tapent 1234 sur digicode
4. Accès autorisé ✅
```

### Code Oublié
```
1. Élève ne sait plus le code
2. Demande à enseignant
3. Enseignant consulte tableau
4. Communique le code
```

### Changement PIN
```
1. Enseignant édite équipe
2. Change PIN (1234 → 5678)
3. Sauvegarde
4. Informe élèves
```

---

## 🔒 Sécurité

**Niveau** : Basique (contexte scolaire)

- Code 4 chiffres (10 000 combinaisons)
- Pas de limite tentatives
- Stockage texte clair
- Visible par enseignant

**Recommandations** :
- Codes simples (1234, 1111, etc.)
- Informer les élèves
- Changer si besoin

---

## 💾 Migration

### Équipes Existantes
```sql
-- Toutes les équipes reçoivent PIN = 0000
-- L'enseignant doit les personnaliser
```

### Réinitialisation
```sql
UPDATE teams SET pin_code = '0000';
```

---

## 📊 Résumé

| Aspect | Description |
|--------|-------------|
| **Code** | 4 chiffres |
| **Défaut** | 0000 |
| **Interface** | Digicode tactile |
| **Validation** | Automatique |
| **Sécurité** | Basique |
| **Gestion** | Enseignant |

---

## 🎉 Avantages

✅ Contrôle d'accès entre équipes  
✅ Interface tactile intuitive  
✅ Gestion facile par enseignant  
✅ Responsabilisation des élèves  
✅ Protection suffisante  

---

**Fichiers modifiés** :
- `supabase-INSTALLATION-PROPRE.sql`
- `lib/gameStore.js`
- `app/enseignant/page.js`
- `app/eleve/page.js`
