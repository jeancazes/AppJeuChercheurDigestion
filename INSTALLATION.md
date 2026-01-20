# 🚀 INSTALLATION RAPIDE - Le Laboratoire Fabuleux

## ⚠️ IMPORTANT - Utilisez le bon fichier SQL !

Il y a **3 fichiers SQL** dans ce projet. Voici lequel utiliser :

### ✅ UTILISEZ CE FICHIER :
**`supabase-INSTALLATION-PROPRE.sql`**

Ce fichier :
- ✅ Nettoie tout (DROP tables existantes)
- ✅ Recrée les tables avec les bons types
- ✅ Insère les 41 ressources
- ✅ Configure triggers, policies, index
- ✅ **Fonctionne à tous les coups !**

### ❌ N'UTILISEZ PAS :
- ~~`supabase-setup.sql`~~ (ancien format, incompatible)
- ~~`supabase-setup-complete.sql`~~ (peut échouer si tables existent déjà)

---

## 📋 Installation en 5 étapes

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Créer un projet Supabase
- Aller sur https://supabase.com
- Créer un compte (gratuit)
- Créer un nouveau projet
- Attendre 2 minutes que le projet se crée

### 3️⃣ Configurer .env.local
```bash
# Copier le fichier exemple
cp .env.local.example .env.local

# Éditer .env.local et remplir :
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_publique_anon
```

**Où trouver ces informations ?**
- Dans Supabase → Project Settings → API
- Copier "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
- Copier "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4️⃣ Créer les tables dans Supabase

1. Dans Supabase, aller dans **SQL Editor** (icône ⚡ dans le menu gauche)
2. Cliquer sur **"New query"**
3. Ouvrir le fichier **`supabase-INSTALLATION-PROPRE.sql`**
4. Copier **TOUT** le contenu
5. Coller dans l'éditeur SQL
6. Cliquer sur **"Run"** (ou F5)

**Résultat attendu :**
```
✅ Installation réussie !
classes: 0
teams: 0  
resources: 41
achats: 0
```

### 5️⃣ Lancer l'application
```bash
npm run dev
```

Ouvrir http://localhost:3000

---

## 🎯 Première utilisation

### Interface Enseignant
1. Aller sur `/enseignant`
2. Code PIN : **1447**
3. Créer une classe (ex: "5ème A", "2024-2025")
4. Créer des équipes (numéro + membres)
5. Gérer les points de réputation
6. Les ressources sont déjà là (41 ressources)

### Interface Élève
1. Aller sur `/eleve`
2. Sélectionner votre classe
3. Sélectionner votre équipe
4. Acheter des ressources !

---

## 🆘 Problèmes fréquents

### ❌ "foreign key constraint cannot be implemented"
➡️ **Solution :** Vous avez exécuté le mauvais fichier SQL.
- Utilisez **`supabase-INSTALLATION-PROPRE.sql`** (celui-ci nettoie tout)

### ❌ "relation does not exist"
➡️ **Solution :** Tables pas créées correctement.
- Réexécutez **`supabase-INSTALLATION-PROPRE.sql`**

### ❌ "Invalid API key"
➡️ **Solution :** Mauvaises credentials dans `.env.local`
- Vérifiez que vous avez copié la bonne clé (anon public, pas service_role)
- Redémarrez `npm run dev` après modification

### ❌ Page blanche / Rien ne charge
➡️ **Solution :** Vérifiez la console navigateur (F12)
- Si erreur Supabase → vérifier `.env.local`
- Si erreur de réseau → vérifier que Supabase est bien démarré

---

## ✅ Checklist de vérification

Après installation, vérifiez :

- [ ] Dans Supabase, onglet "Table Editor" :
  - [ ] Table `classes` existe
  - [ ] Table `teams` existe
  - [ ] Table `resources` existe (avec 41 lignes)
  - [ ] Table `purchased_resources` existe

- [ ] Dans l'app :
  - [ ] Page d'accueil charge (`/`)
  - [ ] Interface enseignant accessible (`/enseignant`)
  - [ ] Interface élève accessible (`/eleve`)
  - [ ] Les 41 ressources s'affichent

---

## 🎉 C'est tout !

Votre application est maintenant :
- ✅ Connectée à Supabase
- ✅ Avec 41 ressources prêtes
- ✅ Prête pour la production
- ✅ Multi-utilisateurs

**Bon enseignement !** 🧪👨‍🏫
