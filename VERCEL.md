# Guide de Déploiement sur Vercel

## 📋 Prérequis

Avant de déployer sur Vercel, assurez-vous d'avoir :
- ✅ Un compte GitHub
- ✅ Un projet Supabase configuré
- ✅ Vos clés API Supabase (URL + anon key)
- ✅ Votre code poussé sur un repository GitHub

---

## 🚀 Étape 1 : Préparer votre code

### 1.1 Vérifier le fichier .gitignore

Assurez-vous que `.env.local` est dans `.gitignore` :

```
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 1.2 Committer votre code

```bash
git add .
git commit -m "Version 7.0 avec Supabase"
git push origin main
```

---

## 🌐 Étape 2 : Créer un compte Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

---

## 📦 Étape 3 : Importer votre projet

### 3.1 Créer un nouveau projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Sélectionnez votre repository **"laboratoire-fabuleux"**
3. Cliquez sur **"Import"**

### 3.2 Configurer le projet

**Framework Preset** : Next.js (détecté automatiquement)

**Build and Output Settings** :
- Build Command : `npm run build` (par défaut)
- Output Directory : `.next` (par défaut)
- Install Command : `npm install` (par défaut)

✅ Laissez les valeurs par défaut

---

## 🔐 Étape 4 : Configurer les variables d'environnement

### 4.1 Ajouter les variables Supabase

Dans la section **"Environment Variables"**, ajoutez :

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votre-projet.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `votre_clé_publique_ici` |

**Important** :
- Copiez ces valeurs depuis Supabase > Project Settings > API
- Ne mettez PAS de guillemets autour des valeurs
- Ne laissez PAS d'espace avant ou après

### 4.2 Appliquer aux environnements

Cochez les cases :
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🎯 Étape 5 : Déployer

1. Cliquez sur **"Deploy"**
2. ⏳ Attendez 2-3 minutes pendant le build
3. ✅ Une fois terminé, vous verrez "Congratulations!"

Vercel vous donnera une URL de type :
- Production : `laboratoire-fabuleux.vercel.app`
- Avec domaine personnalisé : `votredomaine.com`

---

## ✅ Étape 6 : Vérifier le déploiement

### 6.1 Tester l'application

1. Cliquez sur **"Visit"** ou ouvrez l'URL dans votre navigateur
2. Testez l'interface professeur (PIN: 1447)
3. Créez une classe de test
4. Créez une équipe de test

### 6.2 Vérifier la connexion Supabase

1. Ouvrez la console du navigateur (F12)
2. Vérifiez qu'il n'y a pas d'erreurs
3. Dans Supabase, allez dans **Table Editor**
4. Vérifiez que vos données apparaissent dans les tables

---

## 🔄 Étape 7 : Déploiements automatiques

Vercel déploie automatiquement à chaque push sur GitHub :

- **Push sur `main`** → Déploiement en Production
- **Push sur autre branche** → Déploiement Preview
- **Pull Request** → Déploiement Preview automatique

---

## 🌍 Étape 8 : Domaine personnalisé (Optionnel)

### 8.1 Ajouter votre domaine

1. Allez dans **Settings** > **Domains**
2. Cliquez sur **"Add"**
3. Entrez votre domaine (ex: `laboratoire.votreecole.fr`)
4. Suivez les instructions pour configurer votre DNS

### 8.2 Configuration DNS

Ajoutez un enregistrement CNAME :
- **Name** : `laboratoire` (ou `www`)
- **Value** : `cname.vercel-dns.com`

---

## 📊 Étape 9 : Monitoring

### 9.1 Analytics Vercel

Vercel fournit des analytics gratuits :
- Nombre de visiteurs
- Temps de chargement
- Géolocalisation

### 9.2 Logs

Pour voir les logs :
1. Sélectionnez votre projet
2. Allez dans **"Deployments"**
3. Cliquez sur un déploiement
4. Cliquez sur **"Functions"** ou **"Runtime Logs"**

---

## 🔧 Étape 10 : Mise à jour de l'application

Pour mettre à jour votre application :

```bash
# Faites vos modifications
git add .
git commit -m "Description de vos modifications"
git push origin main
```

Vercel redéploiera automatiquement ! 🎉

---

## 🚨 Résolution de problèmes

### Erreur : "Failed to fetch"

**Cause** : Variables d'environnement mal configurées

**Solution** :
1. Vérifiez dans Settings > Environment Variables
2. Assurez-vous qu'il n'y a pas d'espace dans les valeurs
3. Redéployez : Deployments > ... > Redeploy

### Erreur : "Build failed"

**Cause** : Dépendances manquantes

**Solution** :
1. Vérifiez que `package.json` contient `@supabase/supabase-js`
2. Vérifiez les logs de build
3. Testez localement : `npm run build`

### L'application charge mais les données ne s'affichent pas

**Cause** : Problème de connexion Supabase

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs
3. Vérifiez que RLS est bien configuré dans Supabase
4. Testez les requêtes dans Supabase SQL Editor

---

## 💡 Bonnes pratiques

### Variables d'environnement

- ✅ Utilisez toujours `NEXT_PUBLIC_` pour les variables côté client
- ✅ Ne commitez JAMAIS `.env.local` sur GitHub
- ✅ Documentez vos variables dans `.env.local.example`

### Performance

- ✅ Activez la compression d'images
- ✅ Utilisez le cache Vercel
- ✅ Minimisez les requêtes Supabase

### Sécurité

- ✅ Activez Row Level Security dans Supabase
- ✅ Ne partagez jamais votre clé `service_role`
- ✅ Utilisez des politiques de sécurité strictes

---

## 📞 Support

**Vercel** :
- Documentation : [https://vercel.com/docs](https://vercel.com/docs)
- Discord : [https://discord.gg/vercel](https://discord.gg/vercel)

**Supabase** :
- Documentation : [https://supabase.com/docs](https://supabase.com/docs)
- Discord : [https://discord.supabase.com](https://discord.supabase.com)

---

## ✨ Félicitations !

Votre application Le Laboratoire Fabuleux est maintenant en ligne ! 🎉

**URL de production** : https://votre-app.vercel.app

Partagez cette URL avec vos collègues et élèves !

---

## 📝 Checklist finale

Avant de considérer le déploiement terminé :

- [ ] L'application se charge correctement
- [ ] L'interface professeur fonctionne (PIN 1447)
- [ ] Je peux créer une classe
- [ ] Je peux créer une équipe
- [ ] Je peux attribuer des points
- [ ] L'interface élève affiche les données
- [ ] Les achats de ressources fonctionnent
- [ ] Les données se synchronisent entre appareils
- [ ] J'ai testé sur mobile
- [ ] J'ai partagé l'URL avec mes collègues

---

**Bonne mise en production ! 🚀**
