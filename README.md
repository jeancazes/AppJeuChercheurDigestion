# Le Laboratoire Fabuleux v7.0 🧪

Plateforme de gaming éducatif pour cours de SVT (Sciences de la Vie et de la Terre) avec système de réputation, budget et progression par niveaux.

## ✨ Nouveautés de la v7

- 🔄 **Persistance cloud** avec Supabase
- 🌐 **Multi-appareils** : synchronisation automatique
- 📊 **Base de données PostgreSQL** robuste et performante
- 🔒 **Sécurité** : Row Level Security (RLS)
- ⚡ **Temps réel** : mises à jour instantanées entre appareils

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration Supabase

Suivez le **GUIDE_SUPABASE.md** pour :
- Créer votre projet Supabase
- Configurer les tables
- Obtenir vos clés API

### 3. Configuration locale

Créez un fichier `.env.local` à partir de `.env.local.example` :

```bash
cp .env.local.example .env.local
```

Remplissez avec vos identifiants Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_publique
```

### 4. Lancer en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📦 Structure du projet

```
laboratoire-fabuleux-v7/
├── lib/
│   └── supabase.js           # Configuration Supabase
├── stores/
│   └── GameStore.js          # État global avec Supabase
├── pages/
│   ├── index.js              # Page d'accueil
│   ├── teacher/              # Interface professeur
│   └── student/              # Interface élève
├── .env.local.example        # Exemple de configuration
├── GUIDE_SUPABASE.md         # Guide complet Supabase
└── README.md                 # Ce fichier
```

## 🎮 Fonctionnalités

### Interface Professeur (PIN: 1447)
- ✅ Créer et gérer des classes
- ✅ Créer et gérer des équipes
- ✅ Attribuer des points de réputation (Découverte & Raisonnement)
- ✅ Suivre la progression des équipes

### Interface Élève
- ✅ Consulter la fiche personnage de l'équipe
- ✅ Acheter des ressources éducatives
- ✅ Suivre le budget et le niveau

### Système de progression
- **Niveau 1** : 100€ - Accès Observations et Livres
- **Niveau 2** : +100€ - Accès Dissections et Expériences
- **Niveau 3** : +300€ - Accès Analyses et Doc Médical
- **Niveau 4** : +500€ - Accès Synthèses

## 🚢 Déploiement sur Vercel

1. Pushez votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Importez votre repository
4. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Déployez !

## 📚 Documentation complète

- **[GUIDE_SUPABASE.md](GUIDE_SUPABASE.md)** - Guide complet d'installation et configuration Supabase

## 🆘 Support

En cas de problème :
1. Consultez le [GUIDE_SUPABASE.md](GUIDE_SUPABASE.md)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez les logs Supabase

## 📝 License

Projet éducatif - Usage libre pour enseignants

## 🙏 Crédits

Développé pour l'enseignement des SVT
Version 7.0 - Janvier 2025
