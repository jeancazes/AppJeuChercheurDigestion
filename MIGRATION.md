# Guide de Migration : v6 → v7

Ce guide vous aide à migrer de la version 6 (localStorage) vers la version 7 (Supabase).

---

## 📊 Comparaison des versions

| Fonctionnalité | v6 (localStorage) | v7 (Supabase) |
|----------------|-------------------|---------------|
| Persistance | Local uniquement | Cloud synchronisé |
| Multi-appareils | ❌ Non | ✅ Oui |
| Collaboration temps réel | ❌ Non | ✅ Oui |
| Sauvegarde automatique | ❌ Non | ✅ Oui |
| Récupération de données | ❌ Difficile | ✅ Facile |
| Scalabilité | ❌ Limitée | ✅ Excellente |

---

## 🎯 Objectifs de la migration

1. ✅ Migrer les données de localStorage vers Supabase
2. ✅ Adapter le code pour utiliser les nouvelles méthodes asynchrones
3. ✅ Configurer Supabase
4. ✅ Déployer sur Vercel

---

## 📋 Prérequis

Avant de commencer :
- [ ] Sauvegardez vos données localStorage existantes
- [ ] Créez un compte Supabase
- [ ] Installez les nouvelles dépendances

---

## 🔄 Étape 1 : Sauvegarder vos données v6

### 1.1 Exporter les données localStorage

Créez un fichier `export-data.html` et ouvrez-le dans votre navigateur où vous utilisez l'app v6 :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Export données v6</title>
</head>
<body>
    <h1>Export des données Le Laboratoire Fabuleux v6</h1>
    <button onclick="exportData()">Exporter les données</button>
    <pre id="output"></pre>

    <script>
        function exportData() {
            const data = localStorage.getItem('labo-fabuleux-data');
            if (data) {
                document.getElementById('output').textContent = data;
                
                // Télécharger en JSON
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'laboratoire-fabuleux-backup.json';
                a.click();
                
                alert('Données exportées !');
            } else {
                alert('Aucune donnée trouvée');
            }
        }
    </script>
</body>
</html>
```

Vous obtiendrez un fichier `laboratoire-fabuleux-backup.json`.

---

## 🆕 Étape 2 : Installer la v7

### 2.1 Télécharger et extraire

1. Extrayez le ZIP `laboratoire-fabuleux-v7.zip`
2. Ouvrez un terminal dans ce dossier

### 2.2 Installer les dépendances

```bash
npm install
```

### 2.3 Configurer Supabase

Suivez le **GUIDE_SUPABASE.md** pour :
1. Créer votre projet Supabase
2. Exécuter le script SQL
3. Obtenir vos clés API

### 2.4 Créer .env.local

```bash
cp .env.local.example .env.local
```

Remplissez avec vos identifiants Supabase.

---

## 📥 Étape 3 : Importer vos données dans Supabase

### 3.1 Créer un script d'import

Créez un fichier `import-from-v6.js` :

```javascript
// import-from-v6.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'VOTRE_SUPABASE_URL',
  'VOTRE_SUPABASE_KEY'
);

async function importData() {
  // Lire le fichier de backup
  const backup = JSON.parse(
    fs.readFileSync('./laboratoire-fabuleux-backup.json', 'utf8')
  );

  console.log('📦 Données à importer:', backup);

  // 1. Créer la classe
  if (backup.selectedClass) {
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .insert([{
        school_year: backup.selectedClass.schoolYear || '2024-2025',
        class_name: backup.selectedClass.className || 'Classe importée',
      }])
      .select()
      .single();

    if (classError) {
      console.error('❌ Erreur création classe:', classError);
      return;
    }

    console.log('✅ Classe créée:', classData.id);

    // 2. Créer les équipes
    if (backup.teams && backup.teams.length > 0) {
      for (const team of backup.teams) {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .insert([{
            class_id: classData.id,
            team_number: team.teamNumber,
            team_name: team.teamName,
            members: team.members,
            level: team.level,
            budget: team.budget,
            discovery_points: team.discoveryPoints || 0,
            reasoning_points: team.reasoningPoints || 0,
            avatar_url: team.avatarUrl,
          }])
          .select()
          .single();

        if (teamError) {
          console.error('❌ Erreur création équipe:', teamError);
          continue;
        }

        console.log('✅ Équipe créée:', teamData.team_name);

        // 3. Importer les ressources achetées
        const teamResources = backup.purchasedResources?.[team.id] || [];
        for (const resource of teamResources) {
          await supabase
            .from('purchased_resources')
            .insert([{
              team_id: teamData.id,
              resource_data: resource,
            }]);
        }

        console.log(`✅ ${teamResources.length} ressources importées`);
      }
    }

    console.log('🎉 Import terminé !');
  } else {
    console.log('⚠️ Aucune classe à importer');
  }
}

importData();
```

### 3.2 Exécuter l'import

```bash
node import-from-v6.js
```

---

## 🔄 Étape 4 : Adapter votre code

### 4.1 Changements dans GameStore

**Avant (v6)** :
```javascript
// Méthode synchrone
gameStore.createTeam(teamData);
```

**Après (v7)** :
```javascript
// Méthode asynchrone
await gameStore.createTeam(teamData);
```

### 4.2 Changements dans les composants

**Avant (v6)** :
```javascript
const handleCreateTeam = () => {
  gameStore.createTeam(teamData);
};
```

**Après (v7)** :
```javascript
const handleCreateTeam = async () => {
  try {
    await gameStore.createTeam(teamData);
    alert('Équipe créée !');
  } catch (error) {
    alert('Erreur : ' + error.message);
  }
};
```

### 4.3 Gestion du loading et des erreurs

Ajoutez des états pour le loading :

```javascript
const [state, setState] = useState({
  loading: false,
  error: null,
});

useEffect(() => {
  const unsubscribe = gameStore.subscribe(setState);
  return unsubscribe;
}, []);

// Dans votre JSX
{state.loading && <p>Chargement...</p>}
{state.error && <p>Erreur : {state.error}</p>}
```

---

## 🧪 Étape 5 : Tester la migration

### 5.1 Tests locaux

```bash
npm run dev
```

Testez :
- [ ] Chargement de la classe importée
- [ ] Affichage des équipes
- [ ] Affichage des ressources achetées
- [ ] Création d'une nouvelle équipe
- [ ] Attribution de points
- [ ] Achat d'une ressource

### 5.2 Tests multi-appareils

1. Ouvrez l'app sur votre ordinateur
2. Ouvrez l'app sur votre téléphone
3. Modifiez des données sur un appareil
4. Vérifiez que les changements apparaissent sur l'autre

---

## 🚀 Étape 6 : Déployer sur Vercel

Suivez le **VERCEL.md** pour déployer votre application.

---

## 📊 Étape 7 : Vérification finale

### 7.1 Checklist de migration

- [ ] Toutes les classes sont dans Supabase
- [ ] Toutes les équipes sont importées
- [ ] Les niveaux et budgets sont corrects
- [ ] Les points de réputation sont exacts
- [ ] Les ressources achetées sont présentes
- [ ] L'application fonctionne en local
- [ ] L'application est déployée sur Vercel
- [ ] La synchronisation multi-appareils fonctionne

### 7.2 Nettoyer localStorage (optionnel)

Une fois la migration réussie, vous pouvez supprimer les anciennes données :

```javascript
localStorage.removeItem('labo-fabuleux-data');
```

---

## 🔄 Retour en arrière (si problème)

Si vous rencontrez des problèmes, vous pouvez revenir à la v6 :

1. Gardez votre backup JSON
2. Réinstallez la v6
3. Importez les données avec le script inverse

---

## 📝 Différences principales à connaître

### Méthodes devenues asynchrones

| Méthode | v6 | v7 |
|---------|-----|-----|
| `createClass()` | Synchrone | `async/await` |
| `loadClass()` | Synchrone | `async/await` |
| `createTeam()` | Synchrone | `async/await` |
| `updateTeam()` | Synchrone | `async/await` |
| `addReputationPoints()` | Synchrone | `async/await` |
| `purchaseResource()` | Synchrone | `async/await` |

### Nouvelles fonctionnalités

- ✅ `listClasses()` - Lister toutes les classes
- ✅ `subscribeToChanges()` - Temps réel
- ✅ `testConnection()` - Vérifier la connexion

---

## 🆘 Problèmes courants

### "Cannot read property of undefined"

**Cause** : Données non chargées encore

**Solution** : Vérifiez que vous attendez bien le chargement :
```javascript
if (state.loading) return <div>Chargement...</div>;
```

### "Row Level Security policy violation"

**Cause** : Politiques RLS trop strictes

**Solution** : Vérifiez dans Supabase que les policies permettent l'accès

### Les données ne s'importent pas

**Cause** : Format de données incompatible

**Solution** : Vérifiez le format de votre backup JSON et adaptez le script d'import

---

## 📞 Support

Si vous rencontrez des difficultés :
1. Consultez les logs dans la console (F12)
2. Vérifiez les logs Supabase
3. Relisez le GUIDE_SUPABASE.md
4. Testez une requête simple dans Supabase SQL Editor

---

## 🎉 Migration réussie !

Une fois la migration terminée, vous bénéficiez de :
- 🔄 Synchronisation automatique
- 📱 Accès multi-appareils
- 💾 Sauvegardes automatiques
- 🚀 Scalabilité illimitée
- ✨ Temps réel

**Félicitations pour cette migration ! 🎊**
