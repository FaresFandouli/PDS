# Guide de Test - Application Multi-Rôles

## Avant de commencer

1. Assurez-vous que le backend Spring Boot est en cours d'exécution
2. Vérifiez que l'API Gateway est accessible sur `http://localhost:8081`
3. Vérifiez que Keycloak est configuré avec les utilisateurs de test

## Démarrage de l'application

```bash
cd pds-frontend
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Utilisateurs de test

### 1. Patient
```
Email: patient@pds.com
Password: patient123
Rôle: PATIENT
```

**À tester:**
- ✅ Connexion
- ✅ Affichage du Patient Dashboard
- ✅ Bouton "Prendre un rendez-vous"
- ✅ Accès à "Mes dossiers médicaux"
- ✅ Vue des consultations récentes
- ✅ Impossible d'accéder à `/patients` (redirection vers /unauthorized)
- ✅ Menu latéral affiche uniquement: Rendez-vous, Consultations, Dossiers

### 2. Docteur
```
Email: doctor@pds.com
Password: doctor123
Rôle: DOCTOR
```

**À tester:**
- ✅ Connexion
- ✅ Affichage du Doctor Dashboard
- ✅ Bouton "Nouveau patient"
- ✅ Accès à la liste des patients
- ✅ Affichage des RDV d'aujourd'hui
- ✅ Consultations récentes avec détails patient
- ✅ Menu latéral affiche: Patients, Rendez-vous, Consultations, Dossiers

### 3. Admin
```
Email: admin@pds.com
Password: admin123
Rôle: ADMIN
```

**À tester:**
- ✅ Connexion
- ✅ Affichage du Admin Dashboard
- ✅ Graphiques d'activité
- ✅ Statistiques globales
- ✅ État du système (tous services opérationnels)
- ✅ Accès complet aux patients, RDV, consultations
- ✅ Menu latéral affiche tous les menus

## Scénarios de test

### Test 1: Authentification

**Patient:**
1. Allez sur `http://localhost:5173/login`
2. Entrez `patient@pds.com` et `patient123`
3. Cliquez sur "Se connecter"
4. Devriez voir le Patient Dashboard

**Docteur:**
1. Cliquez sur le profil → Déconnexion
2. Entrez `doctor@pds.com` et `doctor123`
3. Devriez voir le Doctor Dashboard

**Admin:**
1. Déconnectez-vous
2. Entrez `admin@pds.com` et `admin123`
3. Devriez voir l'Admin Dashboard

### Test 2: Protection des routes

**En tant que Patient:**
1. Connectez-vous avec le compte patient
2. Essayez d'accéder directement à `http://localhost:5173/patients`
3. Devriez être redirigé vers `/unauthorized`
4. Cliquez sur "Retour au tableau de bord"
5. Retour au Patient Dashboard

### Test 3: Menu dynamique

**Pour chaque rôle:**
1. Vérifiez que le menu latéral affiche les bonnes options
2. Cliquez sur chaque option de menu
3. Les pages doivent charger correctement

**Patient:**
- Dashboard ✅
- Rendez-vous ✅
- Consultations ✅
- Dossiers Médicaux ✅

**Docteur:**
- Dashboard ✅
- Patients ✅
- Rendez-vous ✅
- Consultations ✅
- Dossiers Médicaux ✅

**Admin:**
- Dashboard ✅
- Patients ✅
- Rendez-vous ✅
- Consultations ✅
- Dossiers Médicaux ✅
- Statistiques ✅

### Test 4: Données dynamiques

Vérifiez que les données se chargent correctement:

**Patient Dashboard:**
- [x] Nombre de rendez-vous
- [x] Nombre de consultations
- [x] Rendez-vous à venir (max 3)
- [x] Consultations récentes (max 3)

**Doctor Dashboard:**
- [x] Nombre de patients
- [x] Nombre de RDV aujourd'hui
- [x] Total RDV
- [x] Total consultations
- [x] RDV d'aujourd'hui affichés
- [x] Consultations récentes

**Admin Dashboard:**
- [x] Statistiques globales (4 cartes)
- [x] Graphique de tendance (lignes)
- [x] Graphique de distribution (barres)
- [x] État du système (3 services)

### Test 5: Déconnexion

**Pour chaque rôle:**
1. Connectez-vous
2. Cliquez sur le menu utilisateur (coin supérieur droit)
3. Cliquez sur "Déconnexion"
4. Devriez être redirigé vers `/login`
5. Les tokens devraient être supprimés du localStorage

### Test 6: Erreurs d'authentification

1. Allez sur la page de login
2. Entrez un email invalide (ex: `invalide@test.com`)
3. Entrez un mot de passe incorrect
4. Devriez voir: "Erreur de connexion. Veuillez vérifier vos identifiants."

## Tests de sécurité

### Test 7: Accès non authentifié

1. Ouvrez une nouvelle fenêtre privée/incognito
2. Allez sur `http://localhost:5173/dashboard`
3. Devriez être redirigé vers `/login`

### Test 8: Token expiré

1. Attendez l'expiration du token (vérifiez le JWT)
2. Essayez d'accéder à une route protégée
3. Devriez être redirigé vers `/login`
4. Les données dans localStorage devraient être supprimées

### Test 9: Permissions insuffisantes

**En tant que Patient:**
1. Connectez-vous avec le compte patient
2. Essayez d'accéder à `/patients/new` (créer patient)
3. Devriez être redirigé vers `/unauthorized`

## Checks de performance

### Bundle Size

```bash
npm run build
```

Vérifiez que le bundle ne dépasse pas 500KB (gzip):
- Actuellement: ~282KB (gzip) ✅
- Cible: < 500KB

### Temps de chargement

1. Ouvrez les DevTools (F12)
2. Allez sur l'onglet "Network"
3. Rafraîchissez la page
4. Vérifiez le temps de chargement total
5. Cible: < 3 secondes

### Memory Usage

1. Ouvrez DevTools → Performance
2. Démarrez l'enregistrement
3. Naviguez entre les pages
4. Arrêtez l'enregistrement
5. Vérifiez que la mémoire ne croît pas indefiniment

## Points de contrôle (Checklist)

### Authentification
- [ ] Login fonctionne pour tous les rôles
- [ ] Tokens sont stockés correctement
- [ ] Logout fonctionne
- [ ] Les erreurs d'authentification sont affichées

### Dashboards
- [ ] Patient Dashboard affiche les bonnes infos
- [ ] Doctor Dashboard affiche les bonnes infos
- [ ] Admin Dashboard affiche les bonnes infos
- [ ] Les données se chargent sans erreurs

### Routing
- [ ] Routes protégées redirigent vers /login si non authentifié
- [ ] Routes avec requiredRoles redirigent vers /unauthorized
- [ ] Menu s'adapte au rôle
- [ ] Liens de navigation fonctionnent

### Sécurité
- [ ] Token JWT est validé
- [ ] Tokens expirés déconnectent l'utilisateur
- [ ] CORS fonctionne correctement
- [ ] Pas d'exposition de données sensibles

### Erreurs
- [ ] Messages d'erreur clairs et utiles
- [ ] Pas d'erreurs console JavaScript
- [ ] Les erreurs API sont gérées correctement

## Commandes utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualisation du build
npm run preview

# Lint le code
npm run lint

# Consulter les logs du navigateur
# Ouvrez DevTools (F12) → Console
```

## Signaler des bugs

Si vous trouvez un bug:

1. **Décrivez le comportement attendu**
2. **Décrivez le comportement actuel**
3. **Indiquez les étapes pour reproduire**
4. **Vérifiez la console pour les erreurs**
5. **Notez votre rôle/email utilisé**

Exemple:
```
Titre: Patient Dashboard n'affiche pas les RDV
Rôle: PATIENT
Email: patient@pds.com
Étapes:
1. Connectez-vous en tant que patient
2. Allez au dashboard
3. Vérifiez la section "Rendez-vous à venir"

Erreur console:
GET http://localhost:8081/api/clinic/appointments 404

Comportement attendu:
Les RDV à venir devraient s'afficher
```

## Support

Consultez les fichiers:
- `IMPLEMENTATION.md` - Architecture et fichiers créés
- `BACKEND_INTEGRATION.md` - Endpoints et API requise
- `README.md` - Documentation du projet
