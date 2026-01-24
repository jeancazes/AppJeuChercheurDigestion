# 🔒 Système de Code PIN pour Équipes

## 🎯 Objectif

Sécuriser l'accès aux fiches d'équipes avec un code PIN à 4 chiffres que chaque équipe doit entrer avant d'accéder à ses informations.

---

## 🔐 Fonctionnement

### Pour l'Enseignant

L'enseignant gère les codes PIN de chaque équipe depuis l'interface de gestion :

**Création d'équipe :**
1. Créer une nouvelle équipe
2. Définir le code PIN (4 chiffres)
3. Par défaut : `0000` si non défini

**Modification d'équipe :**
1. Cliquer sur ✏️ (modifier)
2. Changer le code PIN
3. Le nouveau code prend effet immédiatement

**Visualisation :**
- **Desktop** : Colonne "Code PIN" dans le tableau
- **Mobile** : Ligne "Code PIN" dans chaque carte

### Pour l'Élève

L'élève doit entrer le code PIN de son équipe pour accéder :

**Flux de connexion :**
```
1. Sélectionner la classe
2. Sélectionner l'équipe
3. ⭐ Entrer le code PIN (4 chiffres)
4. Accéder à la fiche équipe
```

**Écran de Vérification PIN :**
- Affichage nom de l'équipe
- Affichage des membres
- Clavier numérique tactile
- 4 ronds pour visualiser le code
- Vérification automatique

---

## 📱 Interface Élève - Écran PIN

### Aperçu de l'Écran

```
╔═══════════════════════════════════════╗
║          🔒 CODE PIN                  ║
║                                       ║
║          Équipe 1                     ║
║     Alice, Bob, Charlie               ║
╠═══════════════════════════════════════╣
║                                       ║
║      [○] [○] [○] [○]                ║
║                                       ║
╠═══════════════════════════════════════╣
║                                       ║
║      [1]  [2]  [3]                    ║
║      [4]  [5]  [6]                    ║
║      [7]  [8]  [9]                    ║
║      [C]  [0]  [⌫]                    ║
║                                       ║
║                                       ║
║      [← Changer d'équipe]            ║
╚═══════════════════════════════════════╝
```

### Éléments de l'Écran

**En-tête :**
- 🔒 Icône cadenas
- "Code PIN" en titre
- Numéro d'équipe
- Liste des membres

**Affichage du Code :**
- 4 ronds (cercles)
- Vides au départ
- Se remplissent quand on tape
- Bordure rouge si erreur

**Clavier Numérique :**
- Grille 3×4
- Chiffres 0-9
- Bouton `C` (Clear - tout effacer)
- Bouton `⌫` (Delete - effacer dernier)

**Navigation :**
- Lien "← Changer d'équipe" en bas

---

## 🔧 Détails Techniques

### Base de Données

**Table `teams` :**
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes(id),
  team_number INTEGER,
  members JSONB,
  level INTEGER,
  budget INTEGER,
  discovery_points INTEGER,
  reasoning_points INTEGER,
  pin_code TEXT DEFAULT '0000',  ← NOUVEAU
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### gameStore

**Conversion Supabase → v6 :**
```javascript
const convertTeamFromSupabase = (team) => ({
  id: team.id,
  numero: team.team_number,
  membres: JSON.parse(team.members),
  level: team.level,
  budget: team.budget,
  reputationDecouvertes: team.discovery_points,
  reputationRaisonnement: team.reasoning_points,
  pinCode: team.pin_code || '0000',  ← NOUVEAU
  // ...
});
```

**Création d'équipe :**
```javascript
createEquipe(classeId, numero, membres, pinCode = '0000') {
  supabase.from('teams').insert({
    class_id: classeId,
    team_number: numero,
    members: JSON.stringify(membres),
    pin_code: pinCode,  ← NOUVEAU
    // ...
  });
}
```

**Mise à jour d'équipe :**
```javascript
updateEquipe(equipeId, updates) {
  if (updates.pinCode !== undefined) {
    supabaseUpdates.pin_code = updates.pinCode;  ← NOUVEAU
  }
  // ...
}
```

---

## 🎨 Interface Enseignant

### Vue Desktop

**Tableau avec colonne PIN :**
```
┌────┬──────────┬───────┬────────┬──────────┬─────────────┬──────────────┬─────────┐
│ N° │ Membres  │ Level │ Budget │ Code PIN │ Découvertes │ Raisonnement │ Actions │
├────┼──────────┼───────┼────────┼──────────┼─────────────┼──────────────┼─────────┤
│ 1  │ Alice... │ Stag. │  100€  │ 🔒 1234  │   [−] 2 [+] │   [−] 1 [+]  │ [📄][✏️]│
│ 2  │ Bob...   │ Ass.  │  200€  │ 🔒 5678  │   [−] 5 [+] │   [−] 3 [+]  │ [📄][✏️]│
└────┴──────────┴───────┴────────┴──────────┴─────────────┴──────────────┴─────────┘
```

**Style PIN :**
- Fond bleu clair
- Police monospace (code)
- Icône 🔒
- 4 chiffres visibles

### Vue Mobile

**Carte avec PIN :**
```
╔═════════════════════════════════════╗
║  Équipe 1          [📄] [✏️] [🗑️]  ║
║  Alice, Bob                         ║
╠═════════════════════════════════════╣
║  NIVEAU         │  CODE PIN         ║
║  [Stagiaire]    │  🔒 1234          ║
╠═════════════════════════════════════╣
║  BUDGET                             ║
║  [−10]  100€  [+10]                ║
╠═════════════════════════════════════╣
║  🔬 DÉCOUVERTES                     ║
║     [−]    2    [+]                 ║
╠═════════════════════════════════════╣
║  🧠 RAISONNEMENT                    ║
║     [−]    1    [+]                 ║
╚═════════════════════════════════════╝
```

### Modal d'Édition

**Formulaire avec PIN :**
```
┌─────────────────────────────────────┐
│  Modifier l'équipe           [×]    │
├─────────────────────────────────────┤
│  Numéro de l'équipe                 │
│  [  1  ]                            │
│                                     │
│  Membres                            │
│  [ Alice Dupont        ]            │
│  [ Bob Martin          ]            │
│  [+ Ajouter un membre]              │
│                                     │
│  🔒 Code PIN (4 chiffres)           │
│  [ 1234 ]                           │
│  Code requis pour l'accès élève     │
│                                     │
│  [Annuler]  [✓ Enregistrer]        │
└─────────────────────────────────────┘
```

**Validation :**
- Seulement des chiffres
- Exactement 4 caractères
- Message d'erreur si invalide

---

## 🔄 Flux Utilisateur

### Scénario 1 : Enseignant Crée Équipe avec PIN

```
1. Enseignant → Gestion des Équipes
2. Clic "Nouvelle Équipe"
3. Remplir numéro : 1
4. Ajouter membres : Alice, Bob
5. Définir PIN : 1234
6. Clic "Enregistrer"
7. ✅ Équipe créée avec PIN 1234
```

### Scénario 2 : Élève Se Connecte avec PIN

```
1. Élève → Interface élève
2. Sélectionner classe : 5ème A
3. Sélectionner équipe : Équipe 1
4. 🔒 Écran PIN s'affiche
5. Taper sur clavier : 1, 2, 3, 4
6. Vérification automatique
7. ✅ PIN correct → Accès fiche équipe
```

### Scénario 3 : PIN Incorrect

```
1. Élève tape : 1, 2, 3, 5 (mauvais)
2. ❌ Bordure devient rouge
3. Message "Code incorrect"
4. Attente 1 seconde
5. Code se vide automatiquement
6. Élève peut réessayer
```

### Scénario 4 : Enseignant Change PIN

```
1. Enseignant → Gestion des Équipes
2. Clic ✏️ sur Équipe 1
3. Changer PIN : 1234 → 5678
4. Clic "Enregistrer"
5. ✅ PIN mis à jour
6. Les élèves doivent maintenant utiliser 5678
```

---

## 🛡️ Sécurité

### Niveau de Sécurité

**Protection basique :**
- Code PIN à 4 chiffres
- 10 000 combinaisons possibles
- Adapté pour un contexte scolaire

**Limitations volontaires :**
- Pas de verrouillage après X tentatives
- Pas de timeout
- Les élèves peuvent réessayer indéfiniment

**Pourquoi ?**
- Contexte éducatif (pas financier)
- Éviter de bloquer les élèves
- L'enseignant peut changer le PIN si problème

### Bonnes Pratiques

**Pour l'enseignant :**
1. Choisir des codes différents par équipe
2. Ne pas utiliser 0000 (trop évident)
3. Éviter 1234, 1111, etc.
4. Noter les codes quelque part
5. Changer si suspicion de partage

**Pour les élèves :**
1. Ne pas partager le code
2. Le mémoriser
3. Ne pas le noter visiblement
4. Prévenir l'enseignant si oublié

---

## 📊 Codes Par Défaut

| Situation | Code PIN | Action |
|-----------|----------|--------|
| Nouvelle équipe | 0000 | Recommandé : changer |
| Import depuis v6 | 0000 | Ajouter les codes |
| Code oublié | - | Enseignant le voit |
| Code perdu | - | Enseignant peut changer |

---

## 🎯 Avantages du Système

### Pour l'Enseignant

1. **Contrôle d'accès** : Seuls les membres accèdent
2. **Personnalisation** : Code unique par équipe
3. **Flexibilité** : Changement facile si besoin
4. **Visibilité** : Codes affichés dans tableau

### Pour les Élèves

1. **Sécurité** : Autres équipes ne peuvent pas accéder
2. **Responsabilité** : Doivent garder le code secret
3. **Simplicité** : Seulement 4 chiffres
4. **UX** : Clavier tactile facile

### Pour le Système

1. **Traçabilité** : Savoir qui accède
2. **Authentification** : Vérifier l'identité équipe
3. **Protection** : Éviter modifications non autorisées

---

## 🔧 Migration Données Existantes

### Ajout Colonne pin_code

**Script SQL :**
```sql
-- Si la table existe déjà sans pin_code
ALTER TABLE teams 
ADD COLUMN pin_code TEXT DEFAULT '0000';

-- Mettre à jour toutes les équipes
UPDATE teams 
SET pin_code = '0000' 
WHERE pin_code IS NULL;
```

### Équipes Existantes

Toutes les équipes existantes auront :
- PIN par défaut : `0000`
- L'enseignant devra les personnaliser

---

## 💡 Cas d'Usage

### Utilisation en Classe

**Début d'année :**
1. Créer les équipes
2. Définir un PIN unique pour chaque
3. Donner le PIN à chaque équipe (oral)
4. Les élèves le notent (cahier)

**En cours d'année :**
- Les élèves utilisent leur PIN pour accéder
- L'enseignant peut consulter tous les PIN
- Changement si un élève quitte l'équipe

**Problèmes Possibles :**
- Élève oublie le PIN → Enseignant le lui redonne
- PIN partagé → Enseignant change le code
- Équipe perdue → Réinitialiser à 0000

---

## ✅ Checklist Implémentation

**Base de données :**
- ✅ Colonne `pin_code` ajoutée
- ✅ Valeur par défaut '0000'
- ✅ Type TEXT (4 caractères)

**gameStore :**
- ✅ createEquipe accepte pinCode
- ✅ updateEquipe gère pinCode
- ✅ convertTeamFromSupabase inclut pinCode

**Interface Enseignant :**
- ✅ Colonne PIN dans tableau desktop
- ✅ Ligne PIN dans cartes mobile
- ✅ Champ PIN dans modal édition
- ✅ Validation 4 chiffres
- ✅ Styles pinCode et pinCodeMobile

**Interface Élève :**
- ✅ Page PinCodePage complète
- ✅ Clavier numérique tactile
- ✅ Affichage 4 ronds
- ✅ Vérification automatique
- ✅ Gestion erreurs
- ✅ Step 'verify-pin' dans flux

---

## 🚀 Résultat Final

**Une authentification simple et efficace pour les équipes d'élèves !**

- 🔒 **Sécurisé** : Accès protégé par code
- 📱 **Mobile-friendly** : Clavier tactile
- 👨‍🏫 **Gérable** : Enseignant contrôle tout
- 👥 **Pratique** : Élèves retiennent facilement
- 🎯 **Pédagogique** : Responsabilisation des équipes

**Prêt à l'emploi en classe !** 📚✨
