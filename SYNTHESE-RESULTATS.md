# 📊 Module Synthèse des Résultats

## 🎯 Objectif

Consulter les moyennes de tous les élèves d'une classe et exporter les résultats en PDF.

---

## 📋 Fonctionnalités

### 1. Affichage des Résultats

**Deux modes d'affichage :**
- 📝 **Par ordre alphabétique** : Tous les élèves triés de A à Z
- 👥 **Par équipe** : Élèves regroupés par équipe (ordre numérique)

### 2. Calcul des Moyennes

**Moyenne sur 20** calculée automatiquement pour chaque élève :
- Notes numériques (0-5) → Convertie sur 20
- **ABS** (absent) → Exclu du calcul
- **NN** (non noté) → Exclu du calcul

**Formule :**
```
Moyenne = (Somme des notes valides / Nombre de notes valides) × 4
```

### 3. Export PDF

**Export complet** au format PDF :
- Titre du document
- Nom de la classe
- Mode d'affichage
- Date d'export
- Tableau complet des résultats

---

## 🖥️ Interface

### Menu Principal

Dans la partie enseignant, nouvelle carte :

```
┌──────────────────────────────┐
│ 📊 Synthèse des Résultats    │
│                              │
│ Consulter et exporter        │
│ les moyennes des élèves      │
└──────────────────────────────┘
```

### Page de Sélection

```
┌────────────────────────────────────────┐
│ 📊 Synthèse des Résultats              │
├────────────────────────────────────────┤
│ Sélectionnez une classe pour           │
│ consulter les résultats                │
│                                        │
│  ┌──────────┐  ┌──────────┐           │
│  │ 5ème A   │  │ 4ème B   │           │
│  │ 2024-25  │  │ 2024-25  │           │
│  └──────────┘  └──────────┘           │
└────────────────────────────────────────┘
```

### Page de Résultats

```
┌─────────────────────────────────────────────────────┐
│ 📊 Synthèse - 5ème A                                │
├─────────────────────────────────────────────────────┤
│ [📝 Par ordre alphabétique] [👥 Par équipe]         │
│                                   [📄 Exporter PDF] │
├─────────────────────────────────────────────────────┤
│ Nom      │ Équipe │ S1│ S2│ S3│ S4│ S5│ S6│ Moy/20│
├──────────┼────────┼───┼───┼───┼───┼───┼───┼───────┤
│ Alice    │   1    │ 3 │ 4 │ 5 │ABS│ 3 │ 4 │ 15.20 │
│ Bob      │   1    │NN │ 3 │ 4 │ 5 │ 3 │ 4 │ 15.20 │
│ Charlie  │   2    │ 4 │ABS│ 3 │ 4 │ 5 │ 5 │ 16.80 │
└──────────┴────────┴───┴───┴───┴───┴───┴───┴───────┘
```

---

## 🔢 Calcul de Moyenne - Détails

### Exemple 1 : Moyenne Standard

**Élève : Alice**
- S1 = 3
- S2 = 4
- S3 = 5
- S4 = 2
- S5 = 3
- S6 = 4

**Calcul :**
```
Somme = 3 + 4 + 5 + 2 + 3 + 4 = 21
Nombre de notes = 6
Moyenne /5 = 21 / 6 = 3.5
Moyenne /20 = 3.5 × 4 = 14.00
```

### Exemple 2 : Avec Absences (ABS)

**Élève : Bob**
- S1 = 3
- S2 = 4
- S3 = ABS (exclu)
- S4 = 5
- S5 = ABS (exclu)
- S6 = 4

**Calcul :**
```
Somme = 3 + 4 + 5 + 4 = 16
Nombre de notes valides = 4
Moyenne /5 = 16 / 4 = 4.0
Moyenne /20 = 4.0 × 4 = 16.00
```

### Exemple 3 : Avec Non Notés (NN)

**Élève : Charlie**
- S1 = NN (exclu)
- S2 = 3
- S3 = 4
- S4 = 5
- S5 = NN (exclu)
- S6 = 5

**Calcul :**
```
Somme = 3 + 4 + 5 + 5 = 17
Nombre de notes valides = 4
Moyenne /5 = 17 / 4 = 4.25
Moyenne /20 = 4.25 × 4 = 17.00
```

### Exemple 4 : Mélange ABS et NN

**Élève : David**
- S1 = 2
- S2 = ABS (exclu)
- S3 = 3
- S4 = NN (exclu)
- S5 = 4
- S6 = ABS (exclu)

**Calcul :**
```
Somme = 2 + 3 + 4 = 9
Nombre de notes valides = 3
Moyenne /5 = 9 / 3 = 3.0
Moyenne /20 = 3.0 × 4 = 12.00
```

---

## 📄 Export PDF

### Contenu du PDF

**En-tête :**
```
Synthèse des Résultats

Classe : 5ème A
Mode : Par ordre alphabétique
Date : 24/01/2026
```

**Tableau :**
- Colonnes : Nom, (Équipe si mode par équipe), S1-S6, Moyenne /20
- Toutes les lignes d'élèves
- Format professionnel

### Nom du Fichier

```
resultats_[classe]_[mode]_[date].pdf
```

**Exemples :**
- `resultats_5eme_A_alphabetical_2026-01-24.pdf`
- `resultats_4eme_B_byTeam_2026-01-24.pdf`

---

## 🔄 Flux Utilisateur

### Scénario 1 : Consultation Alphabétique

```
1. Enseignant → Menu principal
2. Clic "Synthèse des Résultats"
3. Sélectionner "5ème A"
4. Mode "Par ordre alphabétique" (par défaut)
5. Consulter toutes les moyennes
6. Identifier les élèves en difficulté
```

### Scénario 2 : Consultation Par Équipe

```
1. Enseignant → Synthèse des Résultats
2. Sélectionner classe
3. Clic "Par équipe"
4. Voir résultats groupés par équipe
5. Comparer performances entre équipes
```

### Scénario 3 : Export PDF Alphabétique

```
1. Enseignant → Synthèse
2. Sélectionner classe
3. Mode "Par ordre alphabétique"
4. Clic "📄 Exporter en PDF"
5. ✅ PDF téléchargé
6. Imprimer ou partager le PDF
```

### Scénario 4 : Export PDF Par Équipe

```
1. Enseignant → Synthèse
2. Sélectionner classe
3. Mode "Par équipe"
4. Clic "📄 Exporter en PDF"
5. ✅ PDF téléchargé avec groupement par équipe
```

---

## 🎯 Cas d'Usage

### Conseil de Classe

**Besoin :** Présenter les résultats de tous les élèves

**Solution :**
1. Exporter PDF par ordre alphabétique
2. Imprimer le document
3. Présenter au conseil de classe
4. Discuter des cas individuels

### Bulletin Scolaire

**Besoin :** Note pour bulletin trimestriel

**Utilisation :**
1. Consulter synthèse
2. Relever la moyenne /20 de chaque élève
3. Reporter sur bulletin
4. Conserver PDF comme justificatif

### Comparaison Équipes

**Besoin :** Voir quelle équipe performe le mieux

**Utilisation :**
1. Mode "Par équipe"
2. Comparer moyennes entre équipes
3. Identifier équipes en difficulté
4. Adapter accompagnement

### Archive de Fin d'Année

**Besoin :** Conserver trace des résultats

**Utilisation :**
1. Export PDF alphabétique
2. Export PDF par équipe
3. Archiver les 2 versions
4. Disponible pour consultation ultérieure

---

## 💾 Données Utilisées

### Sources

**1. Équipes** : Liste des équipes de la classe
**2. Membres** : Tous les élèves de chaque équipe
**3. Évaluations** : Notes de toutes les séances (table `team_member_sessions`)

### Traitement

```javascript
Pour chaque classe :
  Pour chaque équipe :
    Pour chaque membre :
      - Récupérer notes S1 à S6
      - Exclure ABS et NN
      - Calculer moyenne /5
      - Convertir sur /20
      - Stocker résultat
```

### Tri

**Mode alphabétique :**
```javascript
résultats.sort((a, b) => a.nom.localeCompare(b.nom))
```

**Mode par équipe :**
```javascript
résultats.sort((a, b) => {
  if (a.equipe !== b.equipe) return a.equipe - b.equipe;
  return a.nom.localeCompare(b.nom);
})
```

---

## 🛠️ Technique

### Bibliothèques

**jsPDF** : Génération de PDF
```bash
npm install jspdf
```

**jspdf-autotable** : Tableaux dans PDF
```bash
npm install jspdf-autotable
```

### Import Dynamique

```javascript
const { default: jsPDF } = await import('jspdf');
await import('jspdf-autotable');
```

### Configuration PDF

```javascript
const doc = new jsPDF();
doc.autoTable({
  head: headers,
  body: tableData,
  startY: 50,
  styles: { fontSize: 9 },
  headStyles: { fillColor: [2, 136, 209] },
});
```

---

## ✅ Checklist Implémentation

### Code

- ✅ Module ModuleSynthese créé
- ✅ Carte menu ajoutée
- ✅ Sélection classe
- ✅ Toggle alphabétique/équipe
- ✅ Calcul moyennes
- ✅ Exclusion ABS et NN
- ✅ Conversion /20
- ✅ Affichage tableau
- ✅ Export PDF

### Dépendances

- ✅ jspdf ajouté au package.json
- ✅ jspdf-autotable ajouté
- ✅ Import dynamique configuré

### Styles

- ✅ syntheseControls
- ✅ viewToggle
- ✅ toggleButton
- ✅ toggleButtonActive
- ✅ exportButton

---

## 🚀 Installation

### Nouvelle Installation

```bash
1. Extraire le ZIP
2. npm install  # Installe jspdf et jspdf-autotable
3. npm run dev
4. Tester !
```

### Mise à Jour

Si vous avez déjà l'application :

```bash
1. npm install jspdf jspdf-autotable
2. npm run dev
3. Menu enseignant → "Synthèse des Résultats"
```

---

## 📊 Exemple de Sortie PDF

```
═══════════════════════════════════════════════
        Synthèse des Résultats
═══════════════════════════════════════════════

Classe : 5ème A
Mode : Par ordre alphabétique
Date : 24/01/2026

┌─────────────────────────────────────────────┐
│ Nom      │ S1│ S2│ S3│ S4│ S5│ S6│ Moy /20 │
├──────────┼───┼───┼───┼───┼───┼───┼─────────┤
│ Alice D. │ 3 │ 4 │ 5 │ABS│ 3 │ 4 │  15.20  │
│ Bob M.   │NN │ 3 │ 4 │ 5 │ 3 │ 4 │  15.20  │
│ Charlie N│ 4 │ABS│ 3 │ 4 │ 5 │ 5 │  16.80  │
│ David L. │ 2 │ 3 │ 3 │ 2 │ 4 │ 3 │  10.80  │
│ Emma S.  │ 5 │ 5 │ 4 │ 5 │ 5 │ 4 │  18.40  │
└──────────┴───┴───┴───┴───┴───┴───┴─────────┘
```

---

## 💡 Conseils d'Utilisation

### Pour les Moyennes

**Communiquer aux élèves :**
- Comment ABS et NN sont traités
- Impact sur la moyenne
- Possibilité de rattrapage

**Politique suggérée :**
- ABS justifié → Rattrapage possible
- NN → Sera noté ultérieurement
- Moyenne calculée sur notes présentes

### Pour l'Export

**Quand exporter :**
- Fin de trimestre
- Conseils de classe
- Demande administration
- Archive personnelle

**Formats disponibles :**
- Alphabétique : Pour bulletins
- Par équipe : Pour analyse pédagogique

---

## 🎉 Résumé

**Nouvelle page complète pour consulter et exporter les résultats !**

✅ **Deux modes d'affichage** : Alphabétique ou par équipe  
✅ **Moyenne automatique** : Calcul sur /20  
✅ **Gestion ABS/NN** : Exclus intelligemment  
✅ **Export PDF** : Professionnel et complet  
✅ **Interface claire** : Tableau lisible  
✅ **Responsive** : Desktop optimisé  

**Parfait pour les conseils de classe et bulletins !** 📊📄✨
