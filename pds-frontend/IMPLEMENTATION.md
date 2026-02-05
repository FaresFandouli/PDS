# Implémentation Multi-Rôles - PDS Frontend

## Vue d'ensemble

L'application React a été complètement restructurée pour supporter **trois interfaces différentes** basées sur le rôle de l'utilisateur:

- **PATIENT**: Interface simplifiée pour prendre des RDV et consulter ses dossiers
- **DOCTOR**: Interface complète pour gérer les patients et les consultations
- **ADMIN**: Dashboard d'administration avec statistiques et gestion globale

## Architecture mise en place

### 1. Authentification dynamique (AuthContext)

**Fichier**: `src/context/AuthContext.jsx`

Améliorations:
- Connexion au backend Spring Boot (`POST /api/auth/login`)
- Gestion des JWT tokens (Bearer authentication)
- Validation automatique du token au démarrage
- Stockage sécurisé des credentials (localStorage)
- Gestion des erreurs d'authentification

```javascript
// Exemple d'utilisation
const { user, login, logout, isAuthenticated } = useAuth()
// user.role => 'PATIENT' | 'DOCTOR' | 'ADMIN'
```

### 2. API Service (authAPI)

**Fichier**: `src/api/auth.api.js`

Endpoints supportés:
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/profile` - Profil utilisateur
- `POST /api/auth/refresh` - Renouvellement token
- `POST /api/auth/logout` - Déconnexion

### 3. Système de Routing basé sur les rôles

**Fichier**: `src/components/ProtectedRoute.jsx`

```javascript
<Route
  path="/patients"
  element={
    <ProtectedRoute requiredRoles={['DOCTOR', 'ADMIN']}>
      <PatientsList />
    </ProtectedRoute>
  }
/>
```

Chaque route est protégée et ne peut être accédée que par les rôles autorisés.

### 4. Dashboards Séparés

#### Patient Dashboard (`src/pages/Dashboard/PatientDashboard.jsx`)
- Bouton "Prendre un RDV"
- Accès aux dossiers médicaux
- Liste des RDV à venir
- Consultations récentes
- Statistiques personnelles

#### Doctor Dashboard (`src/pages/Dashboard/DoctorDashboard.jsx`)
- Gestion des patients
- RDV du jour
- Création de consultations
- Accès aux dossiers médicaux
- Vue d'ensemble des consultations

#### Admin Dashboard (`src/pages/Dashboard/AdminDashboard.jsx`)
- Statistiques globales du système
- Graphiques d'activité (Recharts)
- État du système
- Gestion des utilisateurs
- Rapports détaillés

### 5. Sidebar Dynamique

**Fichier**: `src/components/layout/Sidebar.jsx`

Le menu latéral s'adapte au rôle:
- **Patient**: Rendez-vous, Consultations, Dossiers médicaux
- **Docteur**: Patients, Rendez-vous, Consultations, Dossiers
- **Admin**: Tous les menus + Statistiques

```javascript
const getNavigationByRole = (role) => {
  // Retourne le menu basé sur le rôle
}
```

## Routes accessibles par rôle

| Route | Patient | Doctor | Admin | Description |
|-------|---------|--------|-------|-------------|
| `/dashboard` | ✅ | ✅ | ✅ | Dashboard personnalisé |
| `/patients` | ❌ | ✅ | ✅ | Gestion patients |
| `/appointments` | ✅ | ✅ | ✅ | RDV (créer pour patient) |
| `/consultations` | ✅ | ✅ | ✅ | Consultations |
| `/medical-records` | ✅ | ✅ | ✅ | Dossiers médicaux |

## Flux d'authentification

```
1. Utilisateur arrive sur /login
   ↓
2. Entre ses credentials (email, password)
   ↓
3. Frontend appelle POST /api/auth/login (Spring Boot)
   ↓
4. Backend valide et retourne {token, user, role}
   ↓
5. Frontend stocke le token et les infos utilisateur
   ↓
6. ProtectedRoute redirige vers le bon dashboard selon le rôle
   ↓
7. Menu latéral affiche les options selon le rôle
```

## Configuration Backend

### URL de l'API Gateway

```javascript
// src/api/axios.config.js
const API_BASE_URL = 'http://localhost:8081/api'
```

### Headers d'authentification

Tous les appels API incluent automatiquement le JWT:

```javascript
Authorization: Bearer {token}
```

Si le token expire (401), l'utilisateur est redirigé vers la page de login.

## Utilisation

### Démarrer le frontend

```bash
cd pds-frontend
npm install  # Si c'est la première fois
npm run dev
```

Accédez à `http://localhost:5173`

### Tester avec différents rôles

Les credentials de test (à créer dans Keycloak):

```
Patient:
  Email: patient@pds.com
  Password: patient123
  Role: PATIENT

Doctor:
  Email: doctor@pds.com
  Password: doctor123
  Role: DOCTOR

Admin:
  Email: admin@pds.com
  Password: admin123
  Role: ADMIN
```

## Fichiers créés/modifiés

### Nouveaux fichiers:
- `src/api/auth.api.js` - Service d'authentification
- `src/components/ProtectedRoute.jsx` - Composant de protection par rôle
- `src/pages/Unauthorized.jsx` - Page d'accès refusé
- `src/pages/Dashboard/PatientDashboard.jsx` - Dashboard patient
- `src/pages/Dashboard/DoctorDashboard.jsx` - Dashboard docteur
- `src/pages/Dashboard/AdminDashboard.jsx` - Dashboard admin
- `IMPLEMENTATION.md` - Ce fichier

### Fichiers modifiés:
- `src/context/AuthContext.jsx` - Intégration backend
- `src/App.jsx` - Routes avec protection par rôle
- `src/pages/Dashboard/Dashboard.jsx` - Routeur de dashboards
- `src/components/layout/Sidebar.jsx` - Menu dynamique par rôle
- `src/pages/Auth/Login.jsx` - Amélioration des messages d'erreur

## Prochaines étapes (optionnel)

1. **Code splitting**: Charger les dashboards dynamiquement pour réduire la taille du bundle
2. **Refresh token**: Implémenter l'auto-refresh du JWT
3. **Offline support**: Stocker les données localement avec IndexedDB
4. **Real-time updates**: WebSocket pour les notifications
5. **Permission granulaires**: Contrôle d'accès plus fin au niveau des endpoints

## Notes de développement

- Tous les appels API utilisent `axios` avec intercepteurs automatiques
- Les erreurs 401 redirigent vers `/login`
- Les erreurs 403 redirigent vers `/unauthorized`
- Les tokens sont stockés en localStorage (à adapter en production)
- Les données sensibles ne sont pas exposées dans l'URL

## Support

Pour toute question ou problème:
1. Vérifiez que le backend Spring Boot est en cours d'exécution
2. Vérifiez l'URL de l'API Gateway dans `src/api/axios.config.js`
3. Vérifiez les credentials d'authentification
4. Consultez la console du navigateur pour les erreurs
