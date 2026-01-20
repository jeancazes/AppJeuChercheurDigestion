# 🔧 Guide de Débogage : Vercel ↔ Supabase

## 🚨 Symptômes courants

- ❌ "Failed to fetch" dans la console
- ❌ Les données ne s'affichent pas
- ❌ Erreurs CORS
- ❌ "Invalid API key"

---

## ✅ Checklist de vérification

### 1️⃣ Vérifier les variables d'environnement sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Vérifiez que vous avez EXACTEMENT :

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

⚠️ **Erreurs fréquentes :**
- ❌ Nom de variable incorrect (ex: `SUPABASE_URL` au lieu de `NEXT_PUBLIC_SUPABASE_URL`)
- ❌ Espace avant ou après la valeur
- ❌ Guillemets autour de la valeur
- ❌ Slash final dans l'URL (doit être `https://xxx.supabase.co` sans `/`)

### 2️⃣ Vérifier que les variables sont appliquées à tous les environnements

Cochez les 3 cases :
- ✅ Production
- ✅ Preview
- ✅ Development

### 3️⃣ Redéployer après modification des variables

⚠️ **IMPORTANT** : Les changements de variables d'environnement ne sont appliqués qu'au prochain déploiement !

1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur les 3 points `...`
4. Cliquez sur **Redeploy**

---

## 🔍 Diagnostic étape par étape

### Étape 1 : Tester dans la console du navigateur

Ouvrez votre app sur Vercel, puis :

1. Appuyez sur `F12` (ouvre la console développeur)
2. Allez dans l'onglet **Console**
3. Tapez :

```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

**Résultats attendus :**
- ✅ L'URL doit s'afficher : `https://votre-projet.supabase.co`
- ✅ La clé doit s'afficher : `eyJ...` (longue chaîne)

**Si `undefined` s'affiche :**
- ❌ Les variables ne sont pas configurées correctement
- ❌ Redéployez après avoir ajouté les variables

### Étape 2 : Vérifier la connexion Supabase

Dans la console (F12), tapez :

```javascript
fetch('https://VOTRE-PROJET.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'VOTRE_CLE_ANON',
    'Authorization': 'Bearer VOTRE_CLE_ANON'
  }
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
```

**Si ça fonctionne :**
- ✅ Vous verrez une liste de tables

**Si erreur CORS :**
- ❌ Problème de configuration Supabase

### Étape 3 : Tester une requête simple

```javascript
import { supabase } from './lib/supabase';

// Dans la console ou dans une page test
supabase.from('classes').select('count').then(console.log);
```

**Résultat attendu :**
```javascript
{ data: [{count: X}], error: null }
```

**Si erreur :**
```javascript
{ data: null, error: { message: "..." } }
```

---

## 🛠️ Solutions aux problèmes courants

### Problème : "Missing environment variables"

**Cause :** Variables non configurées ou mal nommées

**Solution :**

1. Vérifiez l'orthographe exacte :
   - `NEXT_PUBLIC_SUPABASE_URL` (pas `SUPABASE_URL`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pas `SUPABASE_KEY`)

2. Sur Vercel, supprimez et recréez les variables

3. Redéployez

### Problème : "Row Level Security policy violation"

**Cause :** Les politiques RLS sont trop strictes

**Solution :**

Dans Supabase SQL Editor, exécutez :

```sql
-- Désactiver RLS temporairement pour tester
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_resources DISABLE ROW LEVEL SECURITY;

-- OU créer des politiques permissives
DROP POLICY IF EXISTS "Allow all for now" ON classes;
CREATE POLICY "Allow all for now" ON classes FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for now" ON teams;
CREATE POLICY "Allow all for now" ON teams FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for now" ON purchased_resources;
CREATE POLICY "Allow all for now" ON purchased_resources FOR ALL USING (true);
```

### Problème : "Invalid API key"

**Cause :** Mauvaise clé API ou clé expirée

**Solution :**

1. Dans Supabase, allez dans **Project Settings** > **API**
2. Vérifiez que vous utilisez la clé **`anon public`** (pas la clé `service_role`)
3. Copiez la clé complète (sans espace)
4. Remplacez sur Vercel
5. Redéployez

### Problème : CORS Error

**Cause :** Domaine Vercel non autorisé

**Solution :**

1. Dans Supabase, allez dans **Authentication** > **URL Configuration**
2. Ajoutez votre URL Vercel dans **Site URL** :
   ```
   https://votre-app.vercel.app
   ```
3. Ajoutez aussi dans **Redirect URLs** :
   ```
   https://votre-app.vercel.app/**
   ```

---

## 📊 Vérification finale

### Test complet de connexion

Créez une page `/pages/test.js` :

```javascript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('Testing...');
  
  useEffect(() => {
    async function test() {
      try {
        // Test 1: Variables d'environnement
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          setStatus('❌ Variables d\'environnement manquantes');
          return;
        }
        
        // Test 2: Connexion
        const { data, error } = await supabase
          .from('classes')
          .select('count');
        
        if (error) {
          setStatus('❌ Erreur: ' + error.message);
          return;
        }
        
        setStatus('✅ Connexion réussie ! ' + JSON.stringify(data));
      } catch (e) {
        setStatus('❌ Exception: ' + e.message);
      }
    }
    
    test();
  }, []);
  
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Test Supabase</h1>
      <p>{status}</p>
      <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '20px' }}>
        URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'}
        <br />
        KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Défini (caché)' : 'undefined'}
      </pre>
    </div>
  );
}
```

Déployez et allez sur `https://votre-app.vercel.app/test`

**Résultat attendu :**
- ✅ Connexion réussie !

---

## 🔐 Vérification Supabase (côté serveur)

1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans **Table Editor**
4. Vérifiez que vous voyez les tables : `classes`, `teams`, `purchased_resources`

Si les tables sont vides, c'est normal au début.

---

## 📞 Encore des problèmes ?

### Logs Vercel

1. Allez dans **Deployments**
2. Cliquez sur votre dernier déploiement
3. Cliquez sur **View Function Logs**
4. Cherchez les erreurs en rouge

### Logs Supabase

1. Dans Supabase, allez dans **Logs** > **API**
2. Regardez les requêtes qui échouent
3. Vérifiez les codes d'erreur

---

## ✅ Checklist finale

Avant de conclure que ça ne fonctionne pas, vérifiez :

- [ ] Variables d'environnement correctement nommées sur Vercel
- [ ] Variables appliquées aux 3 environnements
- [ ] Redéploiement effectué après modification des variables
- [ ] RLS désactivé ou policies permissives créées
- [ ] Clé `anon public` utilisée (pas `service_role`)
- [ ] URL Vercel ajoutée dans Supabase Authentication
- [ ] Tables créées dans Supabase (script SQL exécuté)
- [ ] Test de connexion réussi (/test page)

---

**Si tout est vert et que ça ne marche toujours pas, partagez-moi :**
1. Le message d'erreur exact (console F12)
2. Une capture d'écran de vos variables Vercel
3. Une capture d'écran de votre Table Editor Supabase
