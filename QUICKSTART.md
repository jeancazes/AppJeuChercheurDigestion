# 🚀 Démarrage Rapide - 5 minutes chrono !

## Étape 1 : Supabase (3 min)

1. **Créer un compte** → [supabase.com](https://supabase.com)
2. **Nouveau projet** → Nom : `laboratoire-fabuleux`
3. **SQL Editor** → Copier-coller le fichier `supabase-setup.sql`
4. **Cliquer sur "Run"** ✅
5. **Project Settings → API** → Copier :
   - URL du projet
   - Clé `anon public`

## Étape 2 : Configuration locale (1 min)

```bash
# Installer les dépendances
npm install

# Créer .env.local
cp .env.local.example .env.local

# Éditer .env.local avec vos identifiants Supabase
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Étape 3 : Lancer (30 sec)

```bash
npm run dev
```

Ouvrir → [http://localhost:3000](http://localhost:3000)

## Premier test

1. Cliquez sur **"Interface Professeur"**
2. Entrez le PIN : **1447**
3. Créez une classe : `2024-2025` / `3ème A`
4. Créez une équipe
5. Attribuez des points de réputation
6. Vérifiez dans Supabase → Table Editor → `teams`

✅ **Ça marche ? Parfait !**

---

## Déploiement Vercel (2 min)

1. Push sur GitHub
2. [vercel.com](https://vercel.com) → New Project
3. Import votre repo
4. **Environment Variables** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy ! 🚀

---

## 📚 Guides complets

- **Configuration détaillée** → `GUIDE_SUPABASE.md`
- **Déploiement Vercel** → `VERCEL.md`
- **Migration v6→v7** → `MIGRATION.md`
- **Exemple de code** → `EXAMPLE_USAGE.js`

---

## 🆘 Problème ?

**Erreur de connexion Supabase ?**
- Vérifiez `.env.local`
- Vérifiez que le script SQL est bien exécuté
- Console (F12) pour voir les erreurs

**Besoin d'aide ?**
- Consultez les guides complets
- Vérifiez les logs Supabase

---

**Bon développement ! 🧪✨**
