# 📊 Tableau d'Évaluations pour les Élèves

## 🎯 Objectif

Permettre aux élèves de consulter leurs notes personnelles et celles de leurs coéquipiers sur la page d'accueil de leur équipe.

---

## 📋 Vue d'Ensemble

### Principe

Chaque équipe peut voir un **tableau récapitulatif** affichant :
- Les notes de tous les membres de l'équipe
- Les 6 séances d'évaluation
- Les statuts ABS (absent) et NN (non noté)

### Emplacement

Le tableau apparaît sur la **page d'accueil de l'équipe**, entre :
- La carte d'information de l'équipe (niveau, budget, réputation)
- Le menu principal (Catalogue, Mes Ressources, etc.)

---

## 🖥️ Interface

### Vue Complète

```
┌──────────────────────────────────────────┐
│ 📊 Vos Évaluations                       │
├──────────────────────────────────────────┤
│ Membre    │ S1│ S2│ S3│ S4│ S5│ S6│     │
├───────────┼───┼───┼───┼───┼───┼───┤     │
│ Alice     │ 3 │ 4 │ 5 │ABS│ 3 │ 4 │     │
│ Bob       │NN │ 3 │ 4 │ 5 │ 3 │ 4 │     │
│ Charlie   │ 4 │ABS│ 3 │ 4 │ 5 │ 5 │     │
└───────────┴───┴───┴───┴───┴───┴───┘     │
│ Légende : 0-5 = Note • ABS = Absent      │
│           NN = Non Noté                  │
└──────────────────────────────────────────┘
```

### Détails Visuels

**En-tête du tableau :**
- Fond bleu clair (COLORS.secondary)
- Texte bleu foncé
- Séparation avec ligne bleue (2px)

**Lignes alternées :**
- Ligne paire : Fond blanc
- Ligne impaire : Fond gris très clair (#F5F5F5)

**Coloration des notes :**
- **Notes 0-5** : Bleu (COLORS.primary)
- **ABS** : Rouge (#FF6B6B) avec fond rose clair (#FFE5E5)
- **NN** : Gris (#95A5A6) avec fond gris clair (#ECF0F1)
- **-** (pas de note) : Gris clair

**Légende :**
- Fond bleu très clair (#F0F8FF)
- Texte petit (0.75rem)
- Explication des codes

---

## 📱 Responsive Mobile

### Optimisations

**Scroll horizontal :**
- Le tableau peut défiler horizontalement si trop large
- Propriété `overflowX: 'auto'`

**Tailles adaptées :**
- Police réduite (0.85rem pour le tableau)
- Colonnes séances compactes (S1-S6)
- Padding optimisé pour mobile

**Touch-friendly :**
- Tableau lisible sur petit écran
- Pas de hover (mobile)

---

## 🔄 Flux Utilisateur

### Scénario 1 : Consultation de ses notes

```
1. Élève se connecte à son équipe
2. PIN validé → Page d'accueil
3. Voir immédiatement le tableau d'évaluations
4. Repérer sa ligne (son nom)
5. Consulter ses notes S1 à S6
6. Identifier les absences (ABS) ou non notés (NN)
```

### Scénario 2 : Comparaison dans l'équipe

```
1. Élève consulte le tableau
2. Compare ses notes avec ses coéquipiers
3. Identifie qui a été absent
4. Voit la progression de l'équipe
5. Motivation collective
```

### Scénario 3 : Aucune évaluation

```
1. Élève accède à la page
2. Tableau affiche "Aucune évaluation pour le moment"
3. Message informatif
4. Pas de tableau vide
```

---

## 💾 Données Affichées

### Source

**Table** : `team_member_sessions`

**Champs** :
- `team_id` : ID de l'équipe
- `member_name` : Nom du membre
- `session_1` à `session_6` : Notes des 6 séances

### Chargement

```javascript
useEffect(() => {
  const loadEvaluations = async () => {
    const sessions = await gameStore.getMemberSessions(equipe.id);
    // Conversion en objet pour accès facile
    const sessionsMap = {};
    sessions.forEach(session => {
      sessionsMap[session.member_name] = {
        session_1: session.session_1 || '-',
        session_2: session.session_2 || '-',
        // ... session_3 à session_6
      };
    });
    setMemberSessions(sessionsMap);
  };
  
  loadEvaluations();
}, [equipe?.id]);
```

### Affichage

**Pour chaque membre** de l'équipe :
1. Récupérer les données dans `memberSessions[membre]`
2. Afficher S1 à S6
3. Si pas de donnée : Afficher "-"

---

## 🎨 Détails de Style

### Couleurs Spéciales

```javascript
// Note ABS
color: '#FF6B6B'      // Rouge
background: '#FFE5E5' // Rose clair

// Note NN
color: '#95A5A6'      // Gris
background: '#ECF0F1' // Gris clair

// Note numérique (0-5)
color: COLORS.primary // Bleu

// Pas de note (-)
color: COLORS.textLight // Gris clair
```

### Tableau

```javascript
table: {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.85rem',
}

th: {
  padding: '10px 8px',
  textAlign: 'left' (pour Membre) ou 'center' (pour S1-S6),
  borderBottom: '2px solid blue',
}

td: {
  padding: '12px 6px',
  textAlign: 'center',
  borderBottom: '1px solid gris',
}
```

---

## ✅ États du Tableau

### État 1 : Chargement

```
┌──────────────────────────┐
│ 📊 Vos Évaluations       │
├──────────────────────────┤
│   Chargement...          │
└──────────────────────────┘
```

### État 2 : Avec données

```
┌──────────────────────────────────┐
│ 📊 Vos Évaluations               │
├──────────────────────────────────┤
│ Membre │ S1│ S2│ S3│ S4│ S5│ S6│ │
│ Alice  │ 3 │ 4 │ 5 │ 2 │ 3 │ 4 │ │
│ Bob    │ 2 │ 3 │ 4 │ 5 │ 3 │ 4 │ │
└──────────────────────────────────┘
```

### État 3 : Aucune évaluation

```
┌────────────────────────────────────┐
│ 📊 Vos Évaluations                 │
├────────────────────────────────────┤
│ Aucune évaluation pour le moment   │
└────────────────────────────────────┘
```

---

## 🔍 Détection des Notes

### Logique d'Affichage

```javascript
const value = memberSessions[membre]?.[`session_${num}`] || '-';
const isABS = value === 'ABS';
const isNN = value === 'NN';
const isNumeric = !isABS && !isNN && value !== '-';
```

**Puis application du style selon le type :**
- `isABS` → Rouge + fond rose
- `isNN` → Gris + fond gris
- `isNumeric` → Bleu
- Autre → Gris clair

---

## 📊 Exemple Complet

### Équipe avec Variété de Notes

```
┌──────────────────────────────────────────┐
│ 📊 Vos Évaluations                       │
├──────────────────────────────────────────┤
│ Membre    │ S1│ S2│ S3│ S4│ S5│ S6│     │
├───────────┼───┼───┼───┼───┼───┼───┤     │
│ Alice D.  │ 3 │ 4 │ 5 │ABS│ 3 │ 4 │     │
│ Bob M.    │NN │ 3 │ 4 │ 5 │ 3 │ 4 │     │
│ Charlie N.│ 4 │ABS│ 3 │ 4 │ 5 │ 5 │     │
│ David L.  │ 2 │ 3 │ - │ 2 │ 4 │ 3 │     │
└───────────┴───┴───┴───┴───┴───┴───┘     │
│                                          │
│ Légende :                                │
│ 0-5 = Note • ABS = Absent • NN = Non Noté│
└──────────────────────────────────────────┘
```

**Observations :**
- Alice : 1 absence (S4)
- Bob : 1 non noté (S1)
- Charlie : 1 absence (S2)
- David : 1 séance pas encore évaluée (S3)

---

## 🎯 Avantages Pédagogiques

### Pour les Élèves

**Transparence :**
- ✅ Voir ses propres notes
- ✅ Comprendre sa progression
- ✅ Identifier les absences

**Motivation :**
- ✅ Comparer (sainement) avec coéquipiers
- ✅ Voir les notes de l'équipe
- ✅ Encouragement collectif

**Suivi :**
- ✅ Repérer les séances non notées
- ✅ Anticiper la moyenne
- ✅ Conscience des absences

### Pour l'Enseignant

**Autonomie :**
- ✅ Élèves consultent eux-mêmes
- ✅ Moins de questions "Quelle est ma note ?"
- ✅ Accès immédiat aux infos

**Communication :**
- ✅ Transparence totale
- ✅ Pas de surprise au bulletin
- ✅ Suivi continu

---

## 💡 Cas d'Usage

### Cas 1 : Élève Vérifie sa Progression

```
Alice connecte son équipe
→ Voit tableau d'évaluations
→ Repère sa ligne
→ Constate : S1=3, S2=4, S3=5
→ "Je progresse !"
```

### Cas 2 : Élève Découvre une Absence

```
Bob consulte le tableau
→ Voit "ABS" en S4
→ Se souvient : "Ah oui, j'étais malade"
→ Note mentale : "Je dois rattraper"
```

### Cas 3 : Équipe Se Motive

```
Équipe 3 regarde ensemble
→ Charlie : "J'ai eu 5 en S6 !"
→ David : "Moi aussi !"
→ Émulation positive
→ Motivation collective
```

### Cas 4 : Élève Anticipe sa Moyenne

```
Alice calcule mentalement
→ "J'ai 3, 4, 5, 3, 4 = moyenne 3.8"
→ "Ça fait environ 15/20"
→ "Pas mal !"
```

---

## 🛠️ Détails Techniques

### État React

```javascript
const [memberSessions, setMemberSessions] = useState({});
const [loadingEvals, setLoadingEvals] = useState(true);
```

### Chargement Asynchrone

```javascript
useEffect(() => {
  const loadEvaluations = async () => {
    setLoadingEvals(true);
    const sessions = await gameStore.getMemberSessions(equipe.id);
    // Traitement...
    setLoadingEvals(false);
  };
  
  if (equipe?.id) {
    loadEvaluations();
  }
}, [equipe?.id]);
```

### Fonction gameStore

**Utilisée :** `getMemberSessions(equipeId)`

**Retourne :**
```javascript
[
  {
    member_name: 'Alice',
    session_1: '3',
    session_2: '4',
    // ... session_3 à session_6
  },
  // ... autres membres
]
```

---

## ✅ Checklist Implémentation

### Code

- ✅ useState pour memberSessions
- ✅ useState pour loadingEvals
- ✅ useEffect pour chargement
- ✅ Appel getMemberSessions
- ✅ Tableau HTML complet
- ✅ Styles inline CSS
- ✅ Gestion états (loading, vide, avec données)
- ✅ Légende explicative

### Interface

- ✅ Titre "📊 Vos Évaluations"
- ✅ En-tête tableau (Membre, S1-S6)
- ✅ Lignes alternées
- ✅ Coloration ABS (rouge)
- ✅ Coloration NN (gris)
- ✅ Coloration notes (bleu)
- ✅ Légende en bas
- ✅ Responsive (scroll horizontal)

### États

- ✅ État "Chargement..."
- ✅ État "Aucune évaluation"
- ✅ État avec données

---

## 🚀 Installation

### Déjà Inclus

Cette fonctionnalité est déjà incluse dans le package !

```bash
1. npm install
2. npm run dev
3. Se connecter en tant qu'élève
4. ✅ Tableau visible sur page d'accueil
```

---

## 📱 Exemple Mobile

```
┌──────────────────────┐
│ 📊 Vos Évaluations   │
├──────────────────────┤
│ [Scroll horizontal →]│
├──────────────────────┤
│ Membre │ S1│ S2│ S3│...
│ Alice  │ 3 │ 4 │ 5 │...
│ Bob    │NN │ 3 │ 4 │...
├────────┴───┴───┴───┴...
│ Légende : 0-5 = Note │
│ ABS = Absent         │
│ NN = Non Noté        │
└──────────────────────┘
```

---

## 🎉 Résumé

**Les élèves peuvent maintenant voir leurs évaluations !**

✅ **Tableau complet** : Toutes les notes visibles  
✅ **Pour toute l'équipe** : Chaque membre  
✅ **6 séances** : S1 à S6  
✅ **Codes clairs** : ABS, NN, 0-5  
✅ **Coloré** : Rouge pour ABS, gris pour NN  
✅ **Légende** : Explication des codes  
✅ **Responsive** : Mobile-friendly  
✅ **Temps réel** : Mise à jour automatique  

**Transparence totale pour les élèves !** 📊🎓✨
