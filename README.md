# SVT Digestion - Système de Jeu Éducatif

## Description
Système de jeu éducatif gamifié pour l'enseignement de la digestion en SVT.

## Structure des fichiers
- `index.html` - Page d'accueil avec navigation vers les différents modules
- `student.html` - Interface pour les élèves (catalogue de ressources, profil d'équipe)
- `teacher.html` - Interface pour les enseignants (gestion des classes et équipes)
- `admin-resources.html` - Interface d'administration des ressources pédagogiques
- `vercel.json` - Configuration pour le déploiement sur Vercel

## Déploiement sur Vercel

### Méthode 1 : Via l'interface web Vercel
1. Créez un compte sur [Vercel](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre projet (depuis GitHub, GitLab, ou upload manuel du ZIP)
4. Vercel détectera automatiquement la configuration
5. Cliquez sur "Deploy"

### Méthode 2 : Via la CLI Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
cd svt-digestion-deploy
vercel
```

## Fonctionnalités

### Interface Élève
- Catalogue de ressources filtrable par niveau et type
- Système d'achat avec budget virtuel
- Suivi des ressources possédées
- Profil d'équipe avec statistiques

### Interface Enseignant
- Sélection de classe et année scolaire
- Gestion des équipes
- Attribution de points (Découverte et Raisonnement)
- Suivi automatique du niveau et budget des équipes

### Interface Administration
- Ajout, modification et suppression de ressources
- Filtrage et recherche avancée
- Statistiques sur les ressources
- Persistance des données via localStorage

## Système de progression
- **LEVEL 1** (100€) : Accès aux Observations et Livres
- **LEVEL 2** (+100€) : Accès aux Dissections et Expériences
- **LEVEL 3** (+300€) : Accès aux Analyses et Documents Médicaux
- **LEVEL 4** (+500€) : Accès aux Synthèses

Les équipes progressent en accumulant 5 points de réputation (combinaison de points Découverte et Raisonnement).

## Design
- Thème médical avec couleurs pastel sobres
- Interface responsive (mobile, tablette, desktop)
- Animations fluides et discrètes
- Accessibilité optimisée

## Technologies utilisées
- HTML5
- CSS3 (animations, gradients, grid/flexbox)
- JavaScript vanilla (pas de dépendances)
- LocalStorage pour la persistance des données

## Support
Pour toute question ou problème, contactez l'administrateur du système.
