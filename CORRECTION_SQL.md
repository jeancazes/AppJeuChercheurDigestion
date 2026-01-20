# 🔧 Correction SQL - Problème résolu

## ❌ Le problème

Le fichier `supabase-setup-complete.sql` contenait une ligne qui causait une erreur :

```sql
TRUNCATE resources CASCADE;
```

**Pourquoi cette erreur ?**
- `TRUNCATE` échoue si la table n'existe pas encore
- Lors de la première installation, les tables sont créées par le script lui-même
- On ne peut pas TRUNCATE une table qui vient d'être créée dans le même script

## ✅ La solution

Remplacé par :

```sql
DELETE FROM purchased_resources;
DELETE FROM resources;
```

**Pourquoi c'est mieux ?**
- `DELETE` fonctionne même si la table vient d'être créée
- Plus sûr pour une première installation
- Supprime d'abord les achats (purchased_resources) avant les ressources (foreign key)

## 🎯 Autres améliorations

1. **Guillemets simplifiés**
   - Ligne r11 : Enlevé les guillemets doubles dans la description
   - Avant : `'aide : "pour mieux comprendre..."'`
   - Après : `'aide : pour mieux comprendre...'`

2. **Script plus robuste**
   - Fonctionne pour première installation
   - Fonctionne pour réinitialisation
   - Pas de conflits de clés étrangères

## 📝 Utilisation

Le fichier corrigé est maintenant : `supabase-setup-complete.sql`

**Installation :**
1. Aller dans Supabase SQL Editor
2. Copier-coller le contenu de `supabase-setup-complete.sql`
3. Exécuter
4. ✅ Vous devriez voir : "Installation terminée !" avec 0 classes, 0 teams, 41 resources

**Le script va :**
1. ✅ Créer les 4 tables (classes, teams, resources, purchased_resources)
2. ✅ Créer les triggers pour updated_at
3. ✅ Activer les policies RLS
4. ✅ Insérer les 41 ressources par défaut
5. ✅ Créer les index pour performance

## 🎉 Résultat

Après exécution, vous aurez :
- ✅ 0 classes (à créer via l'interface enseignant)
- ✅ 0 équipes (à créer via l'interface enseignant)
- ✅ 41 ressources prêtes à l'emploi
- ✅ 0 achats

Vous pouvez maintenant utiliser l'application !
