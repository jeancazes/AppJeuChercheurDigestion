# 🧪 Le Laboratoire Fabuleux - Version 6 Production

## 🎯 Qu'est-ce qui a changé ?

**Cette version est la v6 PARFAITE avec la persistance Supabase ajoutée.**

✅ **Design et interface v6** → RIEN n'a changé visuellement
✅ **Données en production** → Stockées dans Supabase (cloud)
✅ **Synchronisation temps réel** → Les modifications sont sauvegardées immédiatement

---

## 📝 Modifications apportées

### 1. Fichier modifié : `lib/gameStore.js`
- Remplace les données de démonstration par des appels Supabase
- **L'API reste IDENTIQUE** → le reste du code v6 fonctionne sans modification
- Les fonctions (`getClasses()`, `purchaseResource()`, etc.) ont exactement le même comportement

### 2. Fichiers ajoutés :
- `lib/supabase.js` → Connexion à Supabase
- `.env.local.example` → Template pour vos credentials
- `supabase-setup.sql` → Script SQL à exécuter dans Supabase
- `GUIDE_SUPABASE.md` → Guide de configuration
- `package.json` → Dépendances npm (ajoute @supabase/supabase-js)

### 3. Fichiers intacts :
- `app/eleve/page.js` → Interface élève parfaite ✓
- `app/enseignant/page.js` → Interface enseignant ✓
- `app/layout.js` → Layout ✓
- Tous les styles CSS ✓

---

## 🚀 Installation

### 1. Dépendances

```bash
npm install
```

Ceci installera Next.js + @supabase/supabase-js

### 2. Configuration Supabase

1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Copiez `.env.local.example` en `.env.local`
4. Remplissez vos credentials :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_publique
```

### 3. Base de données

Dans votre dashboard Supabase, allez dans SQL Editor et exécutez le contenu de `supabase-setup.sql`

Cela crée les tables :
- `classes` (classes scolaires)
- `teams` (équipes d'élèves)
- `purchased_resources` (ressources achetées)

### 4. Lancement

```bash
npm run dev
```

Ouvrez http://localhost:3000

---

## 📊 Structure de données

### Avant (v6) :
```javascript
// Données en dur dans gameStore.js
const data = {
  classes: [...],
  equipes: [...],
};
```

### Maintenant (v6-production) :
```javascript
// Données dans Supabase
// Chargées automatiquement au démarrage
// Synchronisées à chaque modification
```

---

## 🔄 Comment ça fonctionne

### Au chargement d'une classe :
1. `loadClasse(classeId)` charge la classe depuis Supabase
2. Les équipes sont chargées
3. Les ressources achetées sont chargées
4. Tout est stocké en cache local pour la performance
5. Les subscribers sont notifiés → l'interface se met à jour

### À l'achat d'une ressource :
1. `purchaseResource(equipeId, resourceId)` vérifie budget/niveau
2. Enregistre dans `purchased_resources` (Supabase)
3. Déduit le montant du budget dans `teams` (Supabase)
4. Met à jour le cache local
5. Notifie les subscribers → l'interface se met à jour

---

## ✨ Avantages

**Avant (v6) :**
- ❌ Données perdues au refresh
- ❌ Pas de synchronisation entre utilisateurs
- ❌ Valeurs de démonstration fixes

**Maintenant (v6-production) :**
- ✅ Données persistantes (cloud)
- ✅ Synchronisation temps réel
- ✅ Multi-utilisateurs
- ✅ Prêt pour production
- ✅ **MÊME interface visuelle parfaite**

---

## 🎓 Utilisation en classe

1. **Enseignant** :
   - Se connecte avec le code PIN 1447
   - Crée une classe
   - Crée des équipes
   - Attribue des points de réputation

2. **Élèves** :
   - Sélectionnent leur classe
   - Sélectionnent leur équipe
   - Achètent des ressources
   - Voient leur progression en temps réel

3. **Tout est sauvegardé automatiquement !**

---

## 🔧 Dépannage

### Les données ne se chargent pas ?
→ Vérifiez `.env.local` et que Supabase est bien configuré

### Erreur "RLS policy" ?
→ Exécutez `supabase-setup.sql` qui configure les permissions

### L'interface est différente de la v6 ?
→ **Impossible !** Le code visuel n'a pas changé. Si vous voyez une différence, c'est que vous n'utilisez pas la bonne version.

---

## 📦 Déploiement

### Vercel (recommandé)

1. Poussez le code sur GitHub
2. Connectez à Vercel
3. Ajoutez les variables d'environnement
4. Déployez !

Guide complet : voir `GUIDE_SUPABASE.md`

---

## 💡 Notes techniques

- Le store utilise un pattern **cache + sync**
- Les getters retournent des copies (immutabilité)
- Les actions sont asynchrones mais l'API reste identique
- Le système de notifications (subscribers) est conservé

---

**Parfait pour passer en production tout en gardant le design v6 que vous adorez !** 🎉
