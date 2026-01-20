# 🧪 Le Laboratoire Fabuleux - Version 8 Hybride

## 🎯 Ce qui a changé

Cette version **v8-hybrid** combine le meilleur des deux mondes :

✅ **Design et UX de la v6** (conservé à 100%)
- Interface médical ludique blanc/bleu
- Icônes SVG personnalisées
- Animations et interactions fluides
- Police Fredoka One pour les titres
- Cartes avec ombres et bordures arrondies

✅ **Intégration Supabase de la v7** (fonctionnelle)
- Base de données cloud avec synchronisation temps réel
- Persistance des données entre sessions
- Multi-utilisateurs supporté

---

## 📁 Structure du projet

```
v8-hybrid/
├── pages/
│   ├── index.js              # Page d'accueil (design v6 + test Supabase)
│   ├── student/
│   │   ├── index.js          # Sélection classe/équipe (design v6)
│   │   └── team.js           # Interface élève complète (design v6)
│   └── teacher/
│       ├── index.js          # Connexion enseignant
│       └── dashboard.js      # Dashboard enseignant
│
├── components/
│   └── MedicalIcons.jsx      # Icônes SVG médicales
│
├── lib/
│   ├── theme.js              # Couleurs et constantes (v6)
│   └── supabase.js           # Configuration Supabase
│
├── stores/
│   └── GameStore.js          # Store avec Supabase (v7)
│
└── data/
    └── resources.js          # Ressources éducatives (CSV converti)
```

---

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd v8-hybrid
npm install
```

### 2. Configuration Supabase

Créez un fichier `.env.local` à la racine :

```bash
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

### 3. Base de données

Exécutez le script SQL dans Supabase :

```sql
-- Voir le fichier supabase-setup.sql
```

### 4. Lancement

```bash
npm run dev
```

Ouvrez http://localhost:3000

---

## 🎨 Différences visuelles v6 vs v7

### v7 (avant) ❌
- Gradient violet/rose générique
- Pas d'icônes personnalisées
- Style basique et peu engageant
- Thème sombre

### v8 (maintenant) ✅
- Gradient bleu clair médical
- Icônes SVG médicales dessinées à la main
- Design ludique et professionnel
- Thème blanc/bleu apaisant

---

## 🔧 Points techniques

### Design système
- **Couleurs** : définies dans `lib/theme.js`
- **Police** : Nunito (corps) + Fredoka One (titres)
- **Icônes** : SVG personnalisées dans `components/MedicalIcons.jsx`

### Intégration Supabase
- GameStore utilise le pattern store Svelte
- Toutes les opérations sont async
- Synchronisation automatique entre utilisateurs

### Pages élèves
Toutes les pages ont le design v6 :
- 🏠 Accueil : fiche d'équipe + navigation
- 🧪 Catalogue : achat de ressources avec filtres
- 📚 Mes ressources : ressources achetées
- 👥 Mon équipe : édition des membres
- ❓ Aide : règles du jeu

---

## 📝 Notes importantes

1. **Ressources** : Le CSV a été converti en `data/resources.js`
2. **Niveaux** : La logique de progression est conservée (5 pts = level up)
3. **Budget** : Le système de budget est identique à la v6
4. **Code PIN enseignant** : toujours `1447`

---

## 🔜 Prochaines étapes suggérées

- [ ] Ajouter l'interface enseignant avec le design v6
- [ ] Implémenter la page de gestion des points de réputation
- [ ] Créer une page statistiques pour le prof
- [ ] Ajouter des animations de transition entre pages

---

## 💡 Support

Si vous rencontrez des problèmes :
1. Vérifiez que Supabase est bien configuré (voir GUIDE_SUPABASE.md)
2. Vérifiez les credentials dans .env.local
3. Regardez la console du navigateur pour les erreurs

---

**Développé avec ❤️ pour l'enseignement des SVT**
