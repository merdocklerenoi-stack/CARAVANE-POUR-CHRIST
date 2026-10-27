# CARAVANE POUR CHRIST — 365 Jours avec Dieu

> *« Un jour à la fois, plus près de Christ. »*

Application chrétienne de méditations quotidiennes conçue pour accompagner chaque croyant dans une marche spirituelle vivante, persévérante et paisible tout au long des 365 jours de l'année.

---

## 🌟 Identité & Mission

- **Nom officiel :** CARAVANE POUR CHRIST
- **Programme phare :** 365 jours avec Dieu
- **Slogan :** « Un jour à la fois, plus près de Christ. »
- **Valeurs transmises :** Paix, Foi, Espérance, Amour, Pardon, Croissance spirituelle, Communion intime avec Dieu.

---

## 🚀 Fonctionnalités Opérationnelles

### 1. 📖 Programme complet des 365 jours
- Catalogue exhaustif et structuré des 365 jours avec références bibliques réelles (Louis Segond 1910).
- Filtrage par **15 thèmes spirituels** : *La foi, La prière, L’amour, Le pardon, La gratitude, L’espérance, L’obéissance, La sagesse, La paix intérieure, La persévérance, Le service, La famille, La vie avec le Saint-Esprit, Le caractère chrétien, La connaissance de Jésus-Christ*.
- Filtrage par statut (Tous, Terminés, À découvrir) et par trimestre (T1, T2, T3, T4).

### 2. 🕊️ Espace de Lecture & Recueillement
- Affichage clair et aéré du passage biblique, de la méditation, des questions de cœur, de la prière et de l'action pratique.
- **Synthèse vocale (Audio / Text-to-speech) :** écoute mains libres de la méditation.
- **Ajustement de la taille de texte :** Normale (A), Grande (A+), Très grande (A++).
- Copie en un clic du verset biblique et partage via l'API Web Share.
- Marqueur « Terminé » avec célébration de grâce (confetti spirituel).

### 3. 🔔 Notifications & Push du Verset du Jour (Même application fermée !)
- **Service Worker PWA (`public/sw.js`) :** enregistre les notifications système et écoute les événements push.
- **Rappels programmés :** choix de l'heure matinale souhaitée (ex: 07:00).
- **Bouton de test immédiat :** déclenche directement la notification push du verset biblique du jour avec vibration, actions et icône officielle.
- Support pour Android (PWA autonome), iOS (iOS 16.4+ via « Sur l'écran d'accueil ») et PC/Mac.

### 4. 📅 Calendrier Spirituel Interactif
- Navigation mois par mois avec taux de complétion mensuelle.
- Repérage du jour d'aujourd'hui et des jours médités.
- **Approche bienveillante et sans culpabilité :** possibilité de rattraper n'importe quelle journée antérieure avec amour.

### 5. ✍️ Journal Spirituel Personnel & Privé
- Carnet intime pour consigner ses réflexions, sujets de prières et ressentis (*Paix, Gratitude, Joie, Épreuve, Recherche, Louange*).
- Relié optionnellement au jour de méditation.
- Recherche dans les notes et export complet au format Markdown / JSON.

### 6. ⭐ Favoris & 🔍 Recherche Intelligente
- Sauvegarde de vos passages et méditations préférées.
- Recherche multi-critères : titres, versets, mots-clés de méditation et notes du journal (gestion insensible aux accents et à la casse).

### 7. 🏆 Profil & Jalons Spirituels (Badges)
- Statistiques réelles : jours achevés, % annuel, série consécutive (streak), nombre de notes.
- Badges spirituels : *Premier Pas, Semaine de Fidélité, Scribe du Cœur, Guerrier dans la Prière, Un Mois de Grâce, Caravane Céleste, Couronne de Gloire*.

### 8. 🛡️ Administration du Contenu
- Interface sécurisée par code PIN (démonstration : `777`).
- Création et modification de méditations.
- Analyseur de cohérence : détection des doublons et des jours manquants sur 365.
- Importation et exportation de tout le catalogue en JSON.

---

## 🛠️ Architecture Technique

- **Frontend :** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **PWA :** Manifeste Web (`manifest.json`), Service Worker (`sw.js`), gestion du mode hors ligne.
- **Backend / Serveur :** Node.js avec Express et TypeScript (`server.ts`).
- **Base de données & Auth :** Compatible Supabase (PostgreSQL + RLS) avec fallback local offline-first (LocalStorage).

---

## 🗄️ Configuration de Supabase (Optionnel)

L'application est **100% fonctionnelle immédiatement en mode autonome hors ligne**. Si vous souhaitez activer la synchronisation multi-appareils via Supabase :

1. Créez un projet sur [Supabase](https://supabase.com).
2. Dans le SQL Editor de Supabase, collez et exécutez le script fourni dans le projet :
   ```
   supabase/migrations/20261027_init_caravane.sql
   ```
3. Renseignez votre URL Supabase et votre clé anonyme dans les **Paramètres** de l'application ou dans le fichier `.env` :
   ```env
   VITE_SUPABASE_URL="https://votre-projet.supabase.co"
   VITE_SUPABASE_ANON_KEY="votre-anon-key"
   ```

---

## 📦 Installation & Démarrage Local

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement full-stack (port 3000)
npm run dev

# 3. Compiler pour la production
npm run build

# 4. Démarrer en production
npm run start
```

---

## 📱 Installation de la PWA sur Mobile

- **Android :** Ouvrez le site dans Chrome et appuyez sur **« Installer l'app »** dans la barre supérieure.
- **iPhone / iPad :** Ouvrez dans Safari, appuyez sur le bouton **Partager** (icône avec flèche vers le haut), puis sélectionnez **« Sur l’écran d’accueil »**.
