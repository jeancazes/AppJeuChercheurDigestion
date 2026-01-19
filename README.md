# 🔬 Le Laboratoire Fabuleux

**Serious Game pour l'enseignement de la digestion en SVT**

Un jeu éducatif permettant aux élèves de 5ème d'apprendre la digestion de manière ludique et interactive avec un thème médical.

---

## 📁 Structure du projet

```
laboratoire-fabuleux/
├── app/
│   ├── layout.js          # Layout principal
│   ├── globals.css         # Styles globaux
│   ├── page.js             # Page d'accueil
│   ├── eleve/
│   │   └── page.js         # Application élève
│   └── enseignant/
│       └── page.js         # Application enseignant
├── lib/
│   └── gameStore.js        # Store de données partagé
├── data/
│   └── resources.csv       # Fichier CSV des ressources
├── package.json
├── next.config.js
└── README.md
```

---

## 🚀 Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel (recommandée)

1. **Créez un compte Vercel** sur [vercel.com](https://vercel.com) si ce n'est pas déjà fait

2. **Uploadez le projet sur GitHub/GitLab/Bitbucket**
   - Créez un nouveau repository
   - Uploadez tous les fichiers du projet

3. **Connectez Vercel à votre repository**
   - Allez sur [vercel.com/new](https://vercel.com/new)
   - Cliquez sur "Import Project"
   - Sélectionnez votre repository
   - Vercel détectera automatiquement Next.js

4. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez quelques minutes
   - Votre site sera disponible à `https://votre-projet.vercel.app`

### Méthode 2 : Via la CLI Vercel

1. **Installez la CLI Vercel**
   ```bash
   npm install -g vercel
   ```

2. **Connectez-vous**
   ```bash
   vercel login
   ```

3. **Déployez depuis le dossier du projet**
   ```bash
   cd laboratoire-fabuleux
   vercel
   ```

4. **Pour un déploiement en production**
   ```bash
   vercel --prod
   ```

---

## 🎮 Fonctionnalités

### Espace Élève (`/eleve`)
- Page d'accueil avec statistiques de l'équipe
- Catalogue de ressources filtrable (41 ressources)
- Système d'achat avec gestion du budget
- Mes ressources achetées
- Fiche d'équipe
- Page d'aide avec les règles du jeu

### Espace Enseignant (`/enseignant`)
- Sélection de classe
- Gestion des équipes
- Attribution de points de réputation :
  - 🔍 Points de Découverte
  - 🧠 Points de Raisonnement
- Synchronisation en temps réel

### Système de progression
| Niveau | Titre | Budget | Réputation requise |
|--------|-------|--------|-------------------|
| 1 | Stagiaire | 100€ | 0 pts |
| 2 | Interne | 200€ | 5 pts |
| 3 | Résident | 500€ | 10 pts |
| 4 | Spécialiste | 1000€ | 15 pts |

---

## 🛠️ Développement local

1. **Installez les dépendances**
   ```bash
   npm install
   ```

2. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Ouvrez** [http://localhost:3000](http://localhost:3000)

---

## 📝 Notes importantes

- **Persistance des données** : Actuellement, les données sont stockées en mémoire. En production, il faudrait connecter à une base de données temps réel (Firebase, Supabase, etc.) pour une vraie synchronisation entre les appareils.

- **Authentification** : Pas de système d'authentification pour le moment. À ajouter pour un usage en classe réel.

- **Design responsive** : L'application est optimisée pour mobile, tablette et desktop.

---

## 🎨 Palette de couleurs

- **Primaire** : #0288D1 (bleu médical)
- **Primaire clair** : #4FC3F7
- **Fond** : #E1F5FE → #B3E5FC
- **Succès** : #4CAF50
- **Avertissement** : #FF9800

---

## 📚 Ressources éducatives

Le catalogue contient 41 ressources organisées en catégories :
- Ressources anatomiques
- Observations
- Ressources historiques
- Examens médicaux (vidéos)
- Ressources expérimentales
- Résultats d'analyses médicales
- Ressources documentaires
- Aides

---

## 📄 Licence

Projet éducatif - © 2025
