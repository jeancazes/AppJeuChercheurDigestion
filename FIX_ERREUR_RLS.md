# ⚡ SOLUTION RAPIDE - Erreur RLS

## 🚨 Erreur rencontrée

```
Erreur : new row violates row-level security policy for table "classes"
```

## 📖 Explication

**Row Level Security (RLS)** est activé sur la table `classes`, mais les politiques de sécurité empêchent l'insertion de nouvelles lignes.

---

## ✅ Solution en 2 minutes

### Étape 1 : Ouvrir Supabase SQL Editor

1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Menu de gauche → **SQL Editor**
4. Cliquez sur **New query**

### Étape 2 : Exécuter ce script

**Copiez-collez et exécutez :**

```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow public read access" ON classes;
DROP POLICY IF EXISTS "Allow public write access" ON classes;
DROP POLICY IF EXISTS "Allow public read access" ON teams;
DROP POLICY IF EXISTS "Allow public write access" ON teams;
DROP POLICY IF EXISTS "Allow public read access" ON purchased_resources;
DROP POLICY IF EXISTS "Allow public write access" ON purchased_resources;

-- Créer de nouvelles politiques COMPLÈTES
CREATE POLICY "Enable all for classes"
ON classes FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for teams"
ON teams FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for purchased_resources"
ON purchased_resources FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Enable read for resources"
ON resources FOR SELECT TO public
USING (true);
```

### Étape 3 : Tester

Retournez dans votre application et essayez de créer une classe.

✅ **Ça devrait fonctionner maintenant !**

---

## 🔍 Pourquoi cette erreur ?

Les politiques RLS initiales manquaient **`WITH CHECK (true)`** qui autorise les INSERT et UPDATE.

**Avant (❌ ne marche pas)** :
```sql
CREATE POLICY "Allow public write access" 
ON classes FOR ALL 
USING (true);  -- Manque WITH CHECK !
```

**Après (✅ fonctionne)** :
```sql
CREATE POLICY "Enable all for classes"
ON classes FOR ALL TO public
USING (true)      -- Permet SELECT et DELETE
WITH CHECK (true); -- Permet INSERT et UPDATE
```

---

## 🎯 Script automatique

Un script complet est fourni dans le ZIP : **`fix-rls-policies.sql`**

Il contient :
- ✅ Correction des politiques RLS
- ✅ Tests de vérification
- ✅ Explications détaillées

---

## 🔄 Alternative : Désactiver RLS (temporaire)

**Si vous voulez juste tester rapidement** :

```sql
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
```

⚠️ **Attention** : Cette solution désactive complètement la sécurité. 
Ne l'utilisez que pour tester en développement !

Pour réactiver :
```sql
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
-- etc.
```

---

## 📊 Vérifier les politiques actives

Pour voir toutes vos politiques :

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

Vous devriez voir :
```
classes          | Enable all for classes          | ALL
teams            | Enable all for teams            | ALL
purchased_resources | Enable all for purchased_resources | ALL
resources        | Enable read for resources       | SELECT
```

---

## ✅ Checklist de résolution

- [ ] Ouvrir Supabase SQL Editor
- [ ] Exécuter le script de correction
- [ ] Vérifier que les politiques sont créées
- [ ] Tester la création d'une classe dans l'app
- [ ] ✅ Succès !

---

## 🆘 Toujours un problème ?

**Vérifiez que RLS est bien activé** :
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Toutes les tables doivent avoir `rowsecurity = true`.

**Si vous voyez d'autres erreurs RLS** sur d'autres tables, appliquez le même correctif en remplaçant le nom de la table.

---

## 📝 Script mis à jour

Le nouveau `supabase-setup.sql` dans le ZIP inclut déjà ces correctifs.

Si vous réexécutez le script complet, les bonnes politiques seront créées automatiquement.

---

**Avec `WITH CHECK (true)`, tout devrait fonctionner ! 🎉**
