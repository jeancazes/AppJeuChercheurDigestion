# 🚀 Guide Rapide : Remplir la Base de Données

## 📊 Problème : Base de données vide

Après avoir créé votre projet Supabase et exécuté `supabase-setup.sql`, vous avez :
- ✅ Les tables `classes`, `teams`, `purchased_resources`
- ❌ Mais la table `resources` n'existe pas encore !

---

## ✅ Solution : Exécuter le script des ressources

### Étape 1 : Ouvrir Supabase SQL Editor

1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Dans le menu de gauche, cliquez sur **SQL Editor**
4. Cliquez sur **New query**

### Étape 2 : Exécuter le script

1. Ouvrez le fichier **`supabase-resources.sql`** (dans le ZIP)
2. Copiez TOUT le contenu du fichier
3. Collez dans SQL Editor
4. Cliquez sur **Run** (ou `Ctrl+Enter`)

### Étape 3 : Vérifier

Vous devriez voir dans les résultats :

```
LEVEL 1: 4 ressources
LEVEL 2: 4 ressources
LEVEL 3: 4 ressources
LEVEL 4: 3 ressources
TOTAL: 15 ressources
```

---

## 🔍 Vérification manuelle

### Dans Table Editor

1. Cliquez sur **Table Editor** (menu de gauche)
2. Cliquez sur la table **`resources`**
3. Vous devriez voir **15 lignes**

### Exemple de ressource

| level | type | title | price |
|-------|------|-------|-------|
| LEVEL 1 | Observation | Observation de cellules au microscope | 30 |
| LEVEL 1 | Livre | Livre: Les fondamentaux de la digestion | 40 |
| LEVEL 2 | Dissection | Dissection virtuelle: Appareil digestif | 60 |
| ... | ... | ... | ... |

---

## 🎯 Test dans l'application

1. Allez sur votre app (Vercel ou local)
2. Connectez-vous en tant qu'élève
3. Sélectionnez une équipe
4. Vous devriez voir les **ressources disponibles** dans la boutique

**Si vous voyez le message "📦 Catalogue de ressources vide"** :
- ❌ Le script n'a pas été exécuté OU
- ❌ Il y a une erreur de connexion Supabase

---

## 📝 Récapitulatif des scripts SQL

### Pour la structure de base

Fichier : **`supabase-setup.sql`**
- Crée les tables : `classes`, `teams`, `purchased_resources`
- Configure RLS
- Crée les index

### Pour les ressources éducatives

Fichier : **`supabase-resources.sql`**
- Crée la table : `resources`
- Insère 15 ressources éducatives
- Configure RLS

**⚠️ Important : Exécutez les DEUX scripts !**

---

## 🛠️ Personnaliser les ressources

Vous pouvez modifier les ressources directement dans Supabase :

### Ajouter une ressource

```sql
INSERT INTO resources (level, type, title, description, price) VALUES
('LEVEL 1', 'Observation', 'Ma nouvelle ressource', 'Description...', 35);
```

### Modifier une ressource

```sql
UPDATE resources 
SET price = 45, description = 'Nouvelle description'
WHERE title = 'Observation de cellules au microscope';
```

### Supprimer une ressource

```sql
DELETE FROM resources 
WHERE title = 'Ma ressource à supprimer';
```

---

## 🔄 En cas de problème

### "Table resources does not exist"

**Cause** : Le script `supabase-resources.sql` n'a pas été exécuté

**Solution** : Exécutez le script complet dans SQL Editor

### "0 rows returned"

**Cause** : Le script a créé la table mais n'a pas inséré les données

**Solution** : 
1. Vérifiez qu'il n'y a pas d'erreur dans les logs SQL
2. Réexécutez le script complet
3. Si problème persiste, supprimez la table et recommencez :

```sql
DROP TABLE IF EXISTS resources CASCADE;
-- Puis réexécutez supabase-resources.sql
```

### Les ressources ne s'affichent pas dans l'app

**Vérifications** :
1. ✅ Table créée et remplie dans Supabase ?
2. ✅ Variables d'environnement correctes sur Vercel ?
3. ✅ App redéployée après configuration ?
4. ✅ Console navigateur (F12) : pas d'erreur ?

---

## 📊 Statistiques attendues

Après exécution du script :

| Niveau | Nombre de ressources | Prix total |
|--------|---------------------|------------|
| LEVEL 1 | 4 | 145€ |
| LEVEL 2 | 4 | 210€ |
| LEVEL 3 | 4 | 290€ |
| LEVEL 4 | 3 | 310€ |
| **TOTAL** | **15** | **955€** |

---

## ✅ Checklist finale

Avant de conclure que tout fonctionne :

- [ ] Script `supabase-setup.sql` exécuté
- [ ] Script `supabase-resources.sql` exécuté
- [ ] Table `resources` visible dans Table Editor
- [ ] 15 lignes dans la table `resources`
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Application redéployée
- [ ] Les ressources s'affichent dans l'interface élève

---

**Si tout est coché, votre base de données est complète ! 🎉**
