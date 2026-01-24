# 📊 Évaluation avec ABS et NN

## 🎯 Nouvelle Fonctionnalité

En plus des notes de **0 à 5**, vous pouvez maintenant marquer les élèves comme :
- **ABS** : Absent
- **NN** : Non Noté

---

## 📋 Options Disponibles

### Notes Numériques (0-5)

| Note | Signification |
|------|---------------|
| **0** | Aucun travail ou très insuffisant |
| **1** | Travail insuffisant |
| **2** | Travail passable |
| **3** | Travail satisfaisant |
| **4** | Bon travail |
| **5** | Excellent travail |

### Mentions Spéciales

| Code | Signification | Quand l'utiliser |
|------|---------------|------------------|
| **ABS** | Absent | L'élève n'était pas présent à la séance |
| **NN** | Non Noté | L'élève était présent mais pas évalué |

---

## 🖥️ Interface Desktop

### Menu Déroulant

```
┌──────────────┐
│ Séance 1     │
├──────────────┤
│ 0            │
│ 1            │
│ 2            │
│ 3            │
│ 4            │
│ 5            │
│ ABS          │ ← Absent
│ NN           │ ← Non Noté
└──────────────┘
```

### Exemple de Tableau

```
┌────────────────────────────────────────────────┐
│ 📊 Évaluation par séance - Équipe 1           │
├──────────┬──────┬──────┬──────┬──────┬──────┤
│ Membre   │  S1  │  S2  │  S3  │  S4  │  S5  │
├──────────┼──────┼──────┼──────┼──────┼──────┤
│ Alice    │ [3▼] │ [4▼] │ [5▼] │[ABS▼]│ [3▼] │
│ Bob      │[NN▼] │ [3▼] │ [4▼] │ [5▼] │ [3▼] │
│ Charlie  │ [4▼] │[ABS▼]│ [3▼] │ [4▼] │ [5▼] │
└──────────┴──────┴──────┴──────┴──────┴──────┘
```

---

## 📱 Interface Mobile

### Menu Déroulant Mobile

```
╔════════════════╗
║ Alice Dupont   ║
║ ┌────┬────┬────┐
║ │ S1 │ S2 │ S3 │
║ │[3▼]│[4▼]│[5▼]│
║ ├────┼────┼────┤
║ │ S4 │ S5 │ S6 │
║ │[ABS│[NN]│[3▼]│
║ └────┴────┴────┘
╚════════════════╝
```

Chaque menu propose les 8 options :
- 0, 1, 2, 3, 4, 5, ABS, NN

---

## 🗄️ Stockage Base de Données

### Type de Données

**Avant :** `INTEGER` (0-5 uniquement)  
**Maintenant :** `VARCHAR(3)` (peut contenir '0'-'5', 'ABS', 'NN')

### Contrainte CHECK

```sql
CHECK (session_1 IN ('0','1','2','3','4','5','ABS','NN'))
```

### Migration

Si vous avez déjà des données avec INTEGER :

```sql
-- Modifier le type de colonne
ALTER TABLE team_member_sessions 
  ALTER COLUMN session_1 TYPE VARCHAR(3),
  ALTER COLUMN session_2 TYPE VARCHAR(3),
  ALTER COLUMN session_3 TYPE VARCHAR(3),
  ALTER COLUMN session_4 TYPE VARCHAR(3),
  ALTER COLUMN session_5 TYPE VARCHAR(3),
  ALTER COLUMN session_6 TYPE VARCHAR(3);

-- Ajouter les contraintes
ALTER TABLE team_member_sessions
  ADD CONSTRAINT check_session_1 CHECK (session_1 IN ('0','1','2','3','4','5','ABS','NN')),
  ADD CONSTRAINT check_session_2 CHECK (session_2 IN ('0','1','2','3','4','5','ABS','NN')),
  ADD CONSTRAINT check_session_3 CHECK (session_3 IN ('0','1','2','3','4','5','ABS','NN')),
  ADD CONSTRAINT check_session_4 CHECK (session_4 IN ('0','1','2','3','4','5','ABS','NN')),
  ADD CONSTRAINT check_session_5 CHECK (session_5 IN ('0','1','2','3','4','5','ABS','NN')),
  ADD CONSTRAINT check_session_6 CHECK (session_6 IN ('0','1','2','3','4','5','ABS','NN'));
```

---

## 🎯 Cas d'Usage

### Scénario 1 : Élève Absent

```
Contexte : Alice était absente à la Séance 2

Actions :
1. Ouvrir panneau d'évaluation Équipe 1
2. Ligne Alice, colonne Séance 2
3. Sélectionner "ABS" dans le menu
4. ✅ Sauvegarde automatique
5. "ABS" apparaît dans le tableau
```

### Scénario 2 : Élève Non Évalué

```
Contexte : Bob était présent mais vous n'avez pas pu l'évaluer

Actions :
1. Ouvrir panneau d'évaluation Équipe 1
2. Ligne Bob, colonne Séance 3
3. Sélectionner "NN" dans le menu
4. ✅ Sauvegarde automatique
5. "NN" apparaît dans le tableau
```

### Scénario 3 : Correction

```
Contexte : Alice marquée "ABS" mais elle était présente

Actions :
1. Ouvrir panneau d'évaluation
2. Changer "ABS" → "4" (sa vraie note)
3. ✅ Mise à jour automatique
4. La note numérique remplace "ABS"
```

---

## 📊 Calculs et Statistiques

### Traitement des ABS et NN

Lors du calcul de moyennes, vous avez plusieurs options :

#### Option 1 : Exclure ABS et NN
```
Alice : S1=3, S2=4, S3=5, S4=ABS, S5=3, S6=4
Moyenne = (3+4+5+3+4) / 5 = 3.8
```

#### Option 2 : Compter ABS comme 0
```
Alice : S1=3, S2=4, S3=5, S4=ABS, S5=3, S6=4
Moyenne = (3+4+5+0+3+4) / 6 = 3.16
```

#### Option 3 : NN = Non pris en compte, ABS = 0
```
Bob : S1=NN, S2=3, S3=4, S4=ABS, S5=5, S6=3
Moyenne = (3+4+0+5+3) / 5 = 3.0
```

**Recommandation :** Définir votre politique dès le départ et l'expliquer aux élèves.

---

## 💡 Bonnes Pratiques

### Quand Utiliser ABS

✅ **Utiliser ABS quand :**
- L'élève était physiquement absent
- Absence justifiée ou non
- Vous voulez distinguer l'absence du travail non fait

❌ **Ne PAS utiliser ABS pour :**
- Élève présent mais n'ayant rien fait (mettre 0)
- Travail non rendu (mettre 0 ou NN)

### Quand Utiliser NN

✅ **Utiliser NN quand :**
- L'élève était présent mais vous n'avez pas évalué
- Évaluation reportée
- Vous n'avez pas encore corrigé
- Situation particulière (dispense, adaptation...)

❌ **Ne PAS utiliser NN pour :**
- Absence (utiliser ABS)
- Travail non rendu volontairement (mettre 0)

### Cohérence

**Important :** Soyez cohérent dans votre usage de ABS et NN pour faciliter l'exploitation des données.

---

## 📈 Export et Analyse

### Export CSV Hypothétique

```csv
Membre,S1,S2,S3,S4,S5,S6,Moyenne
Alice,3,4,5,ABS,3,4,3.8
Bob,NN,3,4,ABS,5,3,3.75
Charlie,4,ABS,3,4,5,5,4.2
```

### Analyse

Avec un tableur (Excel, Google Sheets), vous pouvez :

1. **Compter les absences** : `=COUNTIF(B2:G2,"ABS")`
2. **Compter les NN** : `=COUNTIF(B2:G2,"NN")`
3. **Calculer moyenne** en excluant ABS/NN :
   ```
   =AVERAGEIF(B2:G2,"<>ABS",B2:G2,"<>NN")
   ```

---

## 🔧 Détails Techniques

### Structure de Données

**Type :** VARCHAR(3)

**Valeurs possibles :**
- '0', '1', '2', '3', '4', '5' (notes numériques)
- 'ABS' (absent)
- 'NN' (non noté)

### Validation

**Côté Base de Données :**
```sql
CHECK (session_X IN ('0','1','2','3','4','5','ABS','NN'))
```

**Côté Application :**
- Menu déroulant limite les choix
- Pas de validation supplémentaire nécessaire

### Sauvegarde

```javascript
// La valeur est passée directement (string)
updateSessionGrade(equipeId, memberName, sessionNum, 'ABS');
// ou
updateSessionGrade(equipeId, memberName, sessionNum, 'NN');
// ou
updateSessionGrade(equipeId, memberName, sessionNum, '4');
```

---

## 🎨 Différenciation Visuelle (Future)

### Idées d'Amélioration

Pour mieux différencier ABS et NN des notes :

**Couleurs :**
- Notes 0-5 : Texte noir
- ABS : Fond orange (#FF9800)
- NN : Fond gris (#9E9E9E)

**Styles :**
```css
.grade-abs {
  background: #FF9800;
  color: white;
  font-weight: bold;
}

.grade-nn {
  background: #9E9E9E;
  color: white;
  font-style: italic;
}
```

**Icônes :**
- ABS → 🚫
- NN → ⏸️

---

## ✅ Checklist Implémentation

### Base de Données
- ✅ Type VARCHAR(3) pour session_1 à session_6
- ✅ Contraintes CHECK avec valeurs valides
- ✅ Migration SQL fournie

### Interface
- ✅ Options ABS et NN dans menus desktop
- ✅ Options ABS et NN dans menus mobile
- ✅ Gestion des strings (pas parseInt)
- ✅ Sauvegarde automatique

### gameStore
- ✅ Fonction updateMemberSession gère les strings
- ✅ Pas de conversion numérique
- ✅ Validation côté DB uniquement

---

## 🚀 Utilisation Rapide

### Marquer un Élève Absent

```
1. Cliquer 📊 sur l'équipe
2. Trouver la ligne de l'élève
3. Sélectionner "ABS" dans la séance
4. ✅ Automatiquement sauvegardé
```

### Marquer un Élève Non Noté

```
1. Cliquer 📊 sur l'équipe
2. Trouver la ligne de l'élève
3. Sélectionner "NN" dans la séance
4. ✅ Automatiquement sauvegardé
```

### Voir les Absences

```
1. Ouvrir le panneau d'une équipe
2. Regarder les colonnes
3. "ABS" = absences
4. Compter visuellement ou exporter
```

---

## 📊 Exemples Réels

### Équipe avec Absences

```
┌──────────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Membre   │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │
├──────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Alice    │  3  │  4  │  5  │ ABS │  3  │  4  │
│ Bob      │  2  │ ABS │  4  │  5  │  3  │  4  │
│ Charlie  │  4  │  5  │ ABS │ ABS │  5  │  5  │
└──────────┴─────┴─────┴─────┴─────┴─────┴─────┘

Observations :
- Alice : 1 absence (Séance 4)
- Bob : 1 absence (Séance 2)
- Charlie : 2 absences (Séances 3 et 4)
```

### Équipe avec NN

```
┌──────────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Membre   │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │
├──────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Alice    │  3  │  4  │  5  │  2  │  3  │  4  │
│ Bob      │ NN  │  3  │  4  │  5  │  3  │  4  │
│ Charlie  │  4  │  5  │  3  │ NN  │  5  │ NN  │
└──────────┴─────┴─────┴─────┴─────┴─────┴─────┘

Observations :
- Bob : NN en S1 (évaluation reportée)
- Charlie : NN en S4 et S6 (non évalué)
```

---

## 💡 Conseils

### Communication avec les Élèves

**Expliquer clairement :**
1. ABS = Absence (impact sur moyenne selon votre politique)
2. NN = Non évalué (ne compte pas dans moyenne)
3. Différence entre 0 (travail insuffisant) et ABS/NN

### Politique d'Évaluation

**Définir en début d'année :**
- Comment les ABS sont traités (0 ou exclus ?)
- Quand utiliser NN (rattrapage possible ?)
- Justificatifs d'absence ?
- Possibilité de rattrapage ?

### Suivi

**Utiliser les ABS/NN pour :**
- Identifier élèves absentéistes
- Repérer élèves en difficulté
- Organiser rattrapages
- Adapter évaluations

---

## 🎉 Résumé

**Vous pouvez maintenant :**
- ✅ Noter de **0 à 5**
- ✅ Marquer **ABS** (absent)
- ✅ Marquer **NN** (non noté)
- ✅ Différencier absence et non-évaluation
- ✅ Adapter vos calculs de moyenne
- ✅ Mieux suivre vos élèves

**Flexibilité totale pour votre évaluation !** 📊✨
