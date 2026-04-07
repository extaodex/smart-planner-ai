# Smart Planner AI 🚀

Une application de planification intelligente pour étudiants, conçue avec une interface futuriste "Synthetic Luminary" (premium, Dark Mode, Glassmorphism) et propulsée par un moteur d'IA pour optimiser les révisions et combattre la procrastination.

## ✨ Fonctionnalités
- **Dashboard Intelligent** : Vue rapide des cours, tâches urgentes, et suggestions IA.
- **Emploi du Temps Dynamique** : Calendrier de la semaine avec alertes de délais.
- **Gestion de Tâches Avancée** : Liste de tâches interactive avec calcul automatique de priorité et génération de planning.
- **Recommandations IA** :
  - Détection du pic de concentration (Meilleur moment pour réviser)
  - Génération algorithmique de plannings (règle des 25/5 Pomodoro)
  - Alertes Anti-Procrastination
- **Analytique & Stats** : KPI de discipline, Focus par matière, Productivité hebdomadaire et Taux de complétion.

## 🛠️ Stack Technique
- **Frontend** : React 18, Vite, Framer Motion (animations fluides), Lucide React (icônes).
- **Backend** : Node.js, Express, MongoDB (Mongoose).
- **Architecture** : API REST avec connexion Axios. Le backend inclut un "demo mode" (fallback mémoire) si MongoDB n'est pas lancé, rendant l'application testable immédiatement.

## 🚀 Comment lancer le projet ?

### 1. Démarrer le Backend (API)
```bash
cd backend
npm install
npm run dev
# Le serveur démarrera sur http://localhost:5000 (Mode démo actif par défaut)
```

### 2. Démarrer le Frontend (UI)
Ouvrez un **nouveau** terminal à la racine du projet :
```bash
npm install
npm run dev
# Le site sera accessible sur http://localhost:5173
```

> **Astuce Windows** : Si vous obtenez une erreur `UnauthorizedAccess` avec `npm`, utilisez l'Invite de Commande classique (`cmd`) plutôt que PowerShell, ou lancez la commande `cmd /c "npm run dev"`.

---

## 🎨 Design System : *The Synthetic Luminary*
- **Couleurs** : `Void` (#0e0e0e), `Neon Indigo` (#6366f1), `Electric Purple` (#a855f7)
- **Typographie** : `Space Grotesk` (Titres), `Manrope` (Contenu)
- **Effets** : Dark glassmorphism (`rgba(38,38,38,0.55)` + blur 16px)

Créé avec 💙 et de générées par IA.
