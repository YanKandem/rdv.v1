# MyRDV - Système de Gestion de Rendez-vous

## Description

MyRDV est une application moderne de gestion de rendez-vous inspirée de France Visa, construite avec React (Vite, TypeScript, Redux) en frontend et Node.js/Express/MongoDB en backend.

## Fonctionnalités

### Frontend (React)
- **Interface moderne** avec Tailwind CSS et shadcn/ui
- **Gestion d'état** avec Redux Toolkit
- **Formulaires dynamiques** avec support drag-and-drop pour l'administration
- **Responsive design** et accessible
- **Authentification** pour les utilisateurs et administrateurs
- **Prise de rendez-vous** avec ou sans compte utilisateur

### Backend (Node.js/Express)
- **API RESTful** avec TypeScript
- **Base de données** MongoDB avec Mongoose
- **Authentification JWT** sécurisée
- **Gestion des rôles** (admin/utilisateur)
- **CRUD complet** pour formulaires, types de rendez-vous et rendez-vous

### Fonctionnalités Administrateur
- **Constructeur de formulaires** drag-and-drop
- **Gestion des types de rendez-vous**
- **Publication/modification** des formulaires
- **Gestion des créneaux horaires**
- **Suivi des rendez-vous**

### Fonctionnalités Client
- **Visualisation des services** disponibles
- **Sélection de créneaux** disponibles
- **Formulaires dynamiques** selon le type de rendez-vous
- **Prise de rendez-vous** avec ou sans compte

## Structure du Projet

```
rdv.v1/
├── myrdv/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants UI réutilisables
│   │   │   ├── ui/        # Composants de base (Button, Input, etc.)
│   │   │   ├── layout/    # Layout principal
│   │   │   └── forms/     # Composants de formulaires
│   │   ├── features/      # Logique métier Redux
│   │   │   ├── auth/      # Authentification
│   │   │   ├── forms/     # Gestion des formulaires
│   │   │   └── appointments/ # Gestion des rendez-vous
│   │   ├── services/      # Appels API
│   │   ├── pages/         # Pages principales
│   │   ├── lib/           # Utilitaires et configuration
│   │   └── utils/         # Fonctions utilitaires
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── models/        # Modèles MongoDB
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middleware (auth, etc.)
│   │   ├── controllers/   # Contrôleurs
│   │   └── config/        # Configuration
└── README.md
```

## Installation et Démarrage

### Prérequis
- Node.js (v18+)
- MongoDB
- npm ou yarn

### Frontend
```bash
cd myrdv
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurer les variables d'environnement
npm run dev
```

### Variables d'environnement (Backend)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myrdv
JWT_SECRET=your-secret-key-here
```

## Scripts Disponibles

### Frontend (myrdv/)
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run preview` - Aperçu du build

### Backend (backend/)
- `npm run dev` - Démarrage en mode développement avec nodemon
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en production

## Technologies Utilisées

### Frontend
- **React 19** avec TypeScript
- **Vite** pour le build et développement
- **Redux Toolkit** pour la gestion d'état
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **@dnd-kit** pour le drag-and-drop

### Backend
- **Node.js** avec Express
- **TypeScript** pour le typage
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe

## Conventions de Code

### Structure des Composants
- Composants fonctionnels avec hooks React
- Props typées avec TypeScript
- Utilisation de forwardRef pour les composants UI

### Gestion d'État
- Redux slices pour chaque domaine métier
- Thunks pour les appels API asynchrones
- Types TypeScript pour tous les états

### API
- Routes RESTful organisées par domaine
- Middleware d'authentification
- Validation des données d'entrée
- Gestion d'erreurs centralisée

## Développement

### Ajout d'une Nouvelle Fonctionnalité
1. Créer les types TypeScript appropriés
2. Implémenter les modèles backend si nécessaire
3. Créer les routes API
4. Ajouter les actions Redux (slice + thunks)
5. Créer les composants UI
6. Tester la fonctionnalité

### Tests
- Tests unitaires recommandés pour les composants
- Tests d'intégration pour les APIs
- Tests end-to-end pour les workflows critiques

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Licence

Ce projet est sous licence MIT.

## Roadmap

- [ ] Système de notifications
- [ ] Intégration email/SMS
- [ ] Dashboard administrateur avancé
- [ ] API mobile
- [ ] Système de commentaires/évaluations
- [ ] Intégration calendrier externe
- [ ] Rapports et statistiques
- [ ] Multi-tenancy pour plusieurs organisations