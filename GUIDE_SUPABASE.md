# Guide Complet : Migration vers Supabase

## 📋 Table des matières
1. [Création du compte Supabase](#1-création-du-compte-supabase)
2. [Configuration de la base de données](#2-configuration-de-la-base-de-données)
3. [Configuration du projet Next.js](#3-configuration-du-projet-nextjs)
4. [Déploiement sur Vercel](#4-déploiement-sur-vercel)
5. [Test et validation](#5-test-et-validation)
6. [Sécurité et permissions](#6-sécurité-et-permissions)
7. [Maintenance](#7-maintenance)

---

## 1. Création du compte Supabase

### Étape 1.1 : Inscription
1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub (recommandé) ou créez un compte email

### Étape 1.2 : Créer un nouveau projet
1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `laboratoire-fabuleux` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (NOTEZ-LE !)
   - **Region** : Choisissez `Europe (Frankfurt)` ou `Europe (Paris)` pour de meilleures performances
   - **Pricing Plan** : Sélectionnez **"Free"** (gratuit)
3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2-3 minutes que le projet soit créé

---

## 2. Configuration de la base de données

### Étape 2.1 : Accéder au SQL Editor
1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"**

### Étape 2.2 : Créer les tables

**Copiez et collez ce script SQL complet, puis cliquez sur "Run"** :

```sql
-- =====================================================
-- CRÉATION DES TABLES POUR LE LABORATOIRE FABULEUX
-- =====================================================

-- Table des classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_year TEXT NOT NULL,
  class_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des équipes
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  team_number INTEGER NOT NULL,
  team_name TEXT,
  members JSONB NOT NULL DEFAULT '[]',
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 4),
  budget INTEGER DEFAULT 100 CHECK (budget >= 0),
  discovery_points INTEGER DEFAULT 0 CHECK (discovery_points >= 0),
  reasoning_points INTEGER DEFAULT 0 CHECK (reasoning_points >= 0),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, team_number)
);

-- Table des ressources achetées
CREATE TABLE purchased_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  resource_data JSONB NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_teams_class_id ON teams(class_id);
CREATE INDEX idx_purchased_resources_team_id ON purchased_resources(team_id);
CREATE INDEX idx_classes_created_at ON classes(created_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL - À SUPPRIMER EN PRODUCTION)
-- =====================================================

-- Insérer une classe de test
INSERT INTO classes (school_year, class_name)
VALUES ('2024-2025', '3ème A')
RETURNING id;

-- Note: Utilisez l'ID retourné ci-dessus pour créer des équipes de test
-- Exemple (remplacez 'VOTRE-CLASS-ID' par l'ID réel) :
-- INSERT INTO teams (class_id, team_number, team_name, members, level, budget)
-- VALUES ('VOTRE-CLASS-ID', 1, 'Les Scientifiques', '["Alice Dupont", "Bob Martin"]'::jsonb, 1, 100);
```

### Étape 2.3 : Vérifier la création
1. Cliquez sur **"Table Editor"** dans le menu de gauche
2. Vous devriez voir 3 tables : `classes`, `teams`, `purchased_resources`

---

## 3. Configuration du projet Next.js

### Étape 3.1 : Récupérer les clés API

1. Dans Supabase, cliquez sur **"Project Settings"** (icône engrenage en bas à gauche)
2. Cliquez sur **"API"** dans le menu
3. Vous verrez deux informations importantes :
   - **Project URL** (exemple : `https://abcdefgh.supabase.co`)
   - **anon public** key (une longue chaîne de caractères)
4. **COPIEZ CES DEUX VALEURS** - vous en aurez besoin

### Étape 3.2 : Configurer les variables d'environnement

1. Ouvrez le fichier `.env.local.example` dans le ZIP
2. Renommez-le en `.env.local`
3. Remplacez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_publique_ici
```

⚠️ **Important** : Ne commitez JAMAIS le fichier `.env.local` sur Git !

### Étape 3.3 : Installer les dépendances

Dans le terminal, à la racine du projet :

```bash
npm install
```

Cela installera notamment `@supabase/supabase-js`.

### Étape 3.4 : Tester en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) et testez :
1. Créer une nouvelle classe (interface prof avec PIN 1447)
2. Créer une équipe
3. Attribuer des points de réputation
4. Vérifier dans Supabase (Table Editor) que les données apparaissent

---

## 4. Déploiement sur Vercel

### Étape 4.1 : Préparer le projet

1. Assurez-vous que `.env.local` est dans `.gitignore`
2. Commitez vos fichiers sur Git (GitHub recommandé)

### Étape 4.2 : Déployer sur Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New Project"**
4. Importez votre repository
5. **IMPORTANT** : Dans "Environment Variables", ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé publique
6. Cliquez sur **"Deploy"**

### Étape 4.3 : Vérifier le déploiement

1. Une fois déployé, Vercel vous donnera une URL (exemple : `laboratoire-fabuleux.vercel.app`)
2. Testez cette URL pour vérifier que tout fonctionne

---

## 5. Test et validation

### Checklist de tests

- [ ] **Professeur** : Connexion avec PIN 1447
- [ ] **Professeur** : Création d'une classe
- [ ] **Professeur** : Création d'une équipe
- [ ] **Professeur** : Attribution de points de réputation
- [ ] **Professeur** : Vérification de l'augmentation du niveau (5 points → niveau 2)
- [ ] **Professeur** : Vérification de l'augmentation du budget
- [ ] **Élève** : Affichage de la fiche personnage
- [ ] **Élève** : Achat d'une ressource
- [ ] **Élève** : Vérification de la déduction du budget
- [ ] **Multi-appareil** : Ouvrir sur 2 navigateurs différents, vérifier la synchronisation

---

## 6. Sécurité et permissions

### Étape 6.1 : Activer Row Level Security (RLS)

Pour l'instant, votre base est ouverte en lecture/écriture. Pour la production :

1. Dans Supabase, allez dans **"Authentication"** > **"Policies"**
2. Pour chaque table (`classes`, `teams`, `purchased_resources`), activez RLS
3. Créez des politiques de sécurité

**Exemple de politique simple (tous les utilisateurs peuvent lire/écrire)** :

```sql
-- Pour la table classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for now" ON classes
FOR ALL USING (true);

-- Répétez pour teams et purchased_resources
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for now" ON teams FOR ALL USING (true);

ALTER TABLE purchased_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for now" ON purchased_resources FOR ALL USING (true);
```

⚠️ **Note** : Cette politique est très permissive. Pour une vraie production, vous voudrez des règles plus strictes.

### Étape 6.2 : Ajouter une authentification professeur (optionnel)

Pour l'instant, le PIN 1447 est côté client. Pour plus de sécurité :

1. Utilisez Supabase Auth pour créer des comptes professeurs
2. Stockez les classes par professeur
3. Limitez l'accès selon l'utilisateur connecté

---

## 7. Maintenance

### Sauvegarde des données

1. Dans Supabase, allez dans **"Database"** > **"Backups"**
2. Les sauvegardes automatiques sont activées sur le plan gratuit (7 jours de rétention)
3. Vous pouvez faire des sauvegardes manuelles

### Export des données

Pour exporter toutes les données en CSV :

```sql
-- Dans SQL Editor
COPY (SELECT * FROM classes) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM teams) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM purchased_resources) TO STDOUT WITH CSV HEADER;
```

### Monitoring

1. Dans Supabase, allez dans **"Reports"**
2. Surveillez l'utilisation (nombre de requêtes, stockage)
3. Le plan gratuit offre :
   - 500 Mo de stockage
   - 2 Go de bande passante par mois
   - 50 000 requêtes par mois

---

## 🎯 Résumé des étapes essentielles

1. ✅ Créer un projet Supabase
2. ✅ Exécuter le script SQL pour créer les tables
3. ✅ Récupérer l'URL et la clé API
4. ✅ Configurer `.env.local`
5. ✅ Tester en local (`npm run dev`)
6. ✅ Déployer sur Vercel avec les variables d'environnement
7. ✅ Activer RLS pour la sécurité

---

## 🆘 Problèmes courants

### "Failed to fetch" ou erreurs de connexion

- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que l'URL Supabase n'a pas d'espace ou de slash final
- Sur Vercel, vérifiez que les variables sont bien configurées

### "Row Level Security policy violation"

- Vérifiez que vous avez bien créé les policies avec `USING (true)`
- Ou désactivez temporairement RLS pour tester

### Les données ne se synchronisent pas

- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que les requêtes Supabase aboutissent
- Testez une requête simple dans le SQL Editor de Supabase

---

## 📞 Support

- Documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)
- Discord Supabase : [https://discord.supabase.com](https://discord.supabase.com)
- Documentation Next.js : [https://nextjs.org/docs](https://nextjs.org/docs)

---

**Bonne chance avec Le Laboratoire Fabuleux ! 🧪✨**
