# 🔧 Résoudre le conflit Pages Router / App Router

## 🚨 Erreur rencontrée

```
Conflicting app and page file was found, please remove the conflicting files to continue:
  "pages/index.js" - "app/page.js"
```

## 📖 Explication

Next.js propose deux architectures de routing :
- **Pages Router** (Next.js 12 et antérieur) : utilise le dossier `pages/`
- **App Router** (Next.js 13+) : utilise le dossier `app/`

Ce projet utilise **Pages Router** uniquement. Le dossier `app/` ne doit PAS exister.

---

## ✅ Solution rapide

### Étape 1 : Supprimer le dossier app/

**En local :**
```bash
# À la racine du projet
rm -rf app/
```

**Ou manuellement :**
- Supprimez le dossier `app/` s'il existe à la racine du projet

### Étape 2 : Vérifier la structure

Votre projet doit avoir cette structure :

```
laboratoire-fabuleux-v7/
├── pages/              ✅ (à garder)
│   ├── _app.js
│   ├── index.js
│   ├── teacher/
│   └── student/
├── lib/
├── stores/
├── styles/
└── (PAS de dossier app/)  ❌ (à supprimer si présent)
```

### Étape 3 : Nettoyer et relancer

```bash
# Supprimer les caches
rm -rf .next
rm -rf node_modules/.cache

# Relancer
npm run dev
```

---

## 🔍 Vérifications supplémentaires

### Si le problème persiste en local

1. **Vérifier qu'il n'y a vraiment pas de dossier app/** :
   ```bash
   ls -la | grep app
   # Ne devrait PAS afficher de dossier "app"
   ```

2. **Vérifier le .gitignore** :
   Le fichier `.gitignore` doit contenir :
   ```
   .next/
   node_modules/
   ```

3. **Redémarrer le serveur** :
   ```bash
   # Ctrl+C pour arrêter
   npm run dev
   ```

### Si le problème persiste sur Vercel

1. **Aller sur Vercel Dashboard**
2. Sélectionnez votre projet
3. Allez dans **Settings** > **General**
4. Dans **Build & Development Settings** :
   - Framework Preset : **Next.js** ✅
   - Build Command : `npm run build` ✅
   - Output Directory : (laisser vide ou `.next`) ✅

5. **Redéployez** :
   - Allez dans **Deployments**
   - Cliquez sur les 3 points `...` du dernier déploiement
   - Cliquez sur **Redeploy**

---

## 🎯 Pourquoi ce conflit ?

Next.js ne peut pas avoir les deux architectures en même temps :
- Si vous avez `pages/index.js` → utilisez Pages Router
- Si vous avez `app/page.js` → utilisez App Router

**Ce projet est conçu pour Pages Router** car :
- Plus stable et mature
- Compatible avec Next.js 14
- Syntaxe plus simple pour ce cas d'usage

---

## 🔄 Si vous voulez migrer vers App Router (non recommandé)

Si vous tenez vraiment à utiliser App Router, il faudrait :
1. Supprimer le dossier `pages/`
2. Recréer toute la structure dans `app/`
3. Adapter le code (Server Components, Client Components, etc.)

**⚠️ Non recommandé** : cela nécessiterait une réécriture complète du projet.

---

## 📝 Checklist de résolution

- [ ] Supprimer le dossier `app/` s'il existe
- [ ] Vérifier que seul le dossier `pages/` existe
- [ ] Supprimer `.next/` et caches
- [ ] Relancer `npm run dev`
- [ ] Si sur Vercel : redéployer

---

## ✅ Vérification finale

Après résolution, vous devriez pouvoir :
- Lancer `npm run dev` sans erreur
- Voir la page d'accueil sur http://localhost:3000
- Naviguer vers `/teacher` et `/student`

---

## 🆘 Toujours un problème ?

**Vérifiez que vous utilisez bien le bon ZIP :**
- Nom du fichier : `laboratoire-fabuleux-v7-supabase-FIXED.zip`
- Taille : ~49 KB
- Doit contenir `pages/` mais PAS `app/`

**Si le problème persiste :**
1. Supprimez tout le projet
2. Réextrayez le ZIP depuis zéro
3. `npm install`
4. `npm run dev`

---

**Le projet utilise Pages Router exclusivement. Pas de dossier app/ nécessaire !**
