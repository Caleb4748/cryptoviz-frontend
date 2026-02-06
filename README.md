# CryptoViz Frontend 📊

Application de dashboard crypto en temps réel, construite avec Next.js 15, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

CryptoViz offre une vue d'ensemble complète du marché crypto avec des analyses avancées :

- **Vue d'Ensemble (Dashboard)** :
  - Flux de données en temps réel via des KPIs dynamiques (Flux actifs, Latence, Data points).
  - Graphiques de mentions sur les dernières 60 minutes.
  - Liste des événements récents en direct.
  - **Nouveau** : Analyse de sentiment (Répartition global Positif/Neutre/Négatif).
  - **Nouveau** : Widget des tendances (Top Mentions & Top Gainers).
  - **Nouveau** : Tableau de marché complet.
- **Historique** : 
  - Analyse approfondie sur 30 jours (Volume news vs mentions).
  - Export des données (CSV/JSON).
  - KPIs historiques (Volume moyen, Heure de pointe).
- **Interface Moderne** :
  - Design sombre (Dark mode) par défaut.
  - Composants réactifs et interactifs (Recharts, Shadcn/UI).
  - Gestion automatique des erreurs et reconnexions.

## 🛠️ Stack Technique

- **Framework** : [Next.js 15 (App Router)](https://nextjs.org/)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS
- **UI Components** : [shadcn/ui](https://ui.shadcn.com/) (basé sur Radix UI)
- **Icônes** : Lucide React
- **Graphiques** : Recharts
- **Notifications** : Sonner
- **Gestion d'état** : Hooks personnalisés (`useAutoRefresh`)

## 📦 Installation

1. **Prérequis** : Node.js 18+ installé.

2. **Installation des dépendances** :
   ```bash
   npm install
   ```

3. **Configuration** :
   Le projet utilise un fichier `.env.local` pour définir l'URL de l'API backend.
   Par défaut, il pointe vers le serveur de démo, mais vous pouvez le modifier.

   Exemple de `.env.local` :
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

## ▶️ Lancement

Pour lancer le serveur de développement :

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 📂 Structure du Projet

```
types/          # Définitions TypeScript (API responses, etc.)
lib/            # Utilitaires et client API
components/     
  ui/           # Composants de base (shadcn)
  charts/       # Graphiques Recharts customs (Sentiment, Trends...)
  dashboard/    # Widgets spécifiques (KPICard, TrendingWidget...)
app/            # Pages (Next.js App Router)
  page.tsx      # Dashboard principal
  history/      # Page d'historique
hooks/          # Custom hooks (useAutoRefresh)
```

## 🧪 Développement

### Commandes utiles

- `npm run lint` : Vérification du code (ESLint).
- `npm run build` : Build de production.
- `npm run start` : Lancer la production.

### Bonnes Pratiques

- **Typage** : Toutes les réponses API sont typées dans `types/api.ts`.
- **Composants** : Privilégier la composition et l'utilisation des composants UI existants.
- **Performance** : Le hook `useAutoRefresh` gère le polling intelligent pour éviter de surcharger le navigateur si l'onglet est inactif.
