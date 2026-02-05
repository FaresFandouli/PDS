# Guide de Test de l'Authentification

Ce guide vous montre comment tester complètement le système d'authentification JWT.

## 📋 Prérequis

- Les 3 services backend en cours d'exécution:
  - Eureka (port 8761)
  - Auth Service (port 8082)
  - Gateway Service (port 8982)
- MySQL en cours d'exécution (port 3306)
- Frontend en cours d'exécution (port 5173)
- Postman ou cURL installé

## 🚀 Démarrage des Services

### Terminal 1: Eureka Service
```bash
cd eureka-service
mvn spring-boot:run
```
Attendre: `Eureka Server started`

### Terminal 2: Auth Service
```bash
cd auth-service
# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres (au minimum JWT_SECRET)
mvn spring-boot:run
```
Attendre: `Started AuthServiceApplication`

### Terminal 3: Gateway Service
```bash
cd gateway-service
mvn spring-boot:run
```
Attendre: `Mapped "/api/**" to HandlerMapping`

### Terminal 4: Frontend
```bash
cd pds-frontend
npm install
npm run dev
```

## 🧪 Scénarios de Test

### Test 1: Health Check

Vérifier que les services sont accessibles.

**cURL:**
```bash
curl http://localhost:8982/api/auth/health
```

**Réponse attendue (200):**
```json
{
  "message": "Auth service is running"
}
```

---

### Test 2: Enregistrement (Register)

Créer un nouveau compte utilisateur.

**cURL:**
```bash
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePass123!",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "PATIENT",
    "phone": "+33612345678",
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "zipCode": "75001",
    "dateOfBirth": "1990-05-15",
    "gender": "M"
  }'
```

**Réponse attendue (201):**
```json
{
  "id": 1,
  "email": "patient@example.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "avatar": null,
  "emailVerified": false
}
```

**Points à vérifier:**
- ✅ `token` retourné (JWT access token)
- ✅ `refreshToken` retourné (JWT refresh token)
- ✅ `emailVerified` = false (email non vérifié)
- ✅ HTTP 201 Created

**Tester les erreurs:**

Email déjà utilisé:
```bash
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePass123!",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "PATIENT"
  }'
```
Réponse: `400 Bad Request` - "Cet email est déjà utilisé"

Mot de passe trop court:
```bash
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "123",
    "firstName": "Test",
    "lastName": "User",
    "role": "PATIENT"
  }'
```
Réponse: `400 Bad Request` - "Le mot de passe doit avoir au minimum 6 caractères"

---

### Test 3: Login

Se connecter avec un compte existant.

**cURL:**
```bash
curl -X POST http://localhost:8982/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePass123!"
  }'
```

**Réponse attendue (200):**
```json
{
  "id": 1,
  "email": "patient@example.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "avatar": null,
  "emailVerified": false
}
```

**Points à vérifier:**
- ✅ Même utilisateur retourné
- ✅ Nouveaux tokens générés
- ✅ HTTP 200 OK

**Tester les erreurs:**

Mot de passe incorrect:
```bash
curl -X POST http://localhost:8982/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "WrongPassword"
  }'
```
Réponse: `401 Unauthorized` - "Email ou mot de passe invalide"

Email inexistant:
```bash
curl -X POST http://localhost:8982/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "AnyPassword123!"
  }'
```
Réponse: `401 Unauthorized` - "Email ou mot de passe invalide"

---

### Test 4: Récupérer le Profil (Requête Authentifiée)

Accéder à une route protégée avec le JWT.

**Étape 1: Récupérer le token du Test 3**
```
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Étape 2: Faire la requête avec le token**
```bash
curl http://localhost:8982/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Réponse attendue (200):**
```json
{
  "id": 1,
  "email": "patient@example.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "avatar": null,
  "emailVerified": false
}
```

**Tester sans token:**
```bash
curl http://localhost:8982/api/auth/profile
```
Réponse: `401 Unauthorized`

**Tester avec token invalide:**
```bash
curl http://localhost:8982/api/auth/profile \
  -H "Authorization: Bearer invalid.token.here"
```
Réponse: `401 Unauthorized`

---

### Test 5: Refresh Token

Renouveler le JWT après son expiration.

**cURL:**
```bash
curl -X POST http://localhost:8982/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Réponse attendue (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Points à vérifier:**
- ✅ Nouveau token retourné
- ✅ Ancien token invalide après refresh
- ✅ HTTP 200 OK

**Tester avec refresh token invalide:**
```bash
curl -X POST http://localhost:8982/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid.refresh.token"
  }'
```
Réponse: `401 Unauthorized` - "Token invalide"

---

### Test 6: Logout

Se déconnecter (nettoyer les tokens côté frontend).

**cURL:**
```bash
curl -X POST http://localhost:8982/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Réponse attendue (200):**
```json
{
  "message": "Déconnexion réussie"
}
```

---

## 🔐 Tests Frontend

### 1. Ouvrir le Frontend

Naviguer vers: `http://localhost:5173`

### 2. Page de Connexion

**Tester la connexion:**
- Email: `patient@example.com`
- Mot de passe: `SecurePass123!`
- Cliquer sur "Se connecter"

**Vérifications:**
- ✅ Page se charge (pas d'erreur CORS)
- ✅ Tokens stockés dans localStorage (`pds_token`, `pds_refresh_token`)
- ✅ Utilisateur peut accéder aux pages protégées
- ✅ Redirection automatique au tableau de bord

### 3. Vérifier localStorage

Ouvrir la console du navigateur (F12) et exécuter:
```javascript
// Vérifier les tokens
console.log('Access Token:', localStorage.getItem('pds_token'))
console.log('Refresh Token:', localStorage.getItem('pds_refresh_token'))
console.log('User Data:', JSON.parse(localStorage.getItem('pds_user')))
```

**Résultat attendu:**
```
Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Refresh Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User Data: {
  id: 1,
  email: "patient@example.com",
  firstName: "Jean",
  lastName: "Dupont",
  role: "PATIENT"
}
```

### 4. Tester le Logout

- Cliquer sur "Déconnexion"

**Vérifications:**
- ✅ localStorage vidé
- ✅ Redirection vers `/login`
- ✅ Pas d'erreur dans la console

### 5. Tester le Refresh Token Automatique

**Simuler l'expiration du token:**

1. Ouvrir la console (F12)
2. Modifier le token pour le rendre invalide:
```javascript
localStorage.setItem('pds_token', 'invalid.token.here')
```

3. Essayer de faire une requête (naviguer vers le dashboard)

**Comportement attendu:**
- ✅ Le frontend détecte le token expiré (401)
- ✅ Utilise automatiquement le refresh token
- ✅ Obtient un nouveau token
- ✅ Réessaie la requête originale
- ✅ Aucun rechargement visible pour l'utilisateur

---

## 📊 Tests de Tokens JWT

### Décoder un JWT

Visiter: https://jwt.io

**Coller votre token** dans "Encoded" pour voir:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "1",
  "email": "patient@example.com",
  "role": "PATIENT",
  "iat": 1707120000,
  "exp": 1707206400
}
```

**Vérifications:**
- ✅ Algorithm = HS256
- ✅ `iat` = timestamp d'émission
- ✅ `exp` = iat + 24h (86400 secondes)
- ✅ Email et role corrects

---

## 🚨 Troubleshooting Tests

### Erreur: "Cannot GET /api/auth/register"

**Cause:** Gateway Service ne route pas correctement
```bash
# Solution: Vérifier que Gateway est en cours d'exécution
curl http://localhost:8982/health
```

### Erreur: "Connection refused"

**Cause:** Services ne sont pas démarrés
```bash
# Vérifier les services:
curl http://localhost:8761  # Eureka
curl http://localhost:8082/swagger-ui.html  # Auth Service
curl http://localhost:8982/health  # Gateway
```

### Erreur: "Database connection failed"

**Cause:** MySQL n'est pas connecté
```bash
# Vérifier MySQL:
mysql -u root -p -e "USE pds_auth; SELECT COUNT(*) FROM users;"
# Vérifier .env:
grep DB_ auth-service/.env
```

### Erreur: "Email sending failed"

**Cause:** Configuration mail invalide
```bash
# Vérifier les logs:
grep -i "mail" /tmp/auth-service.log
# Vérifier .env:
grep MAIL_ auth-service/.env
```

### Token non stocké dans localStorage

**Cause:** Problème CORS
```bash
# Vérifier CORS dans les headers de réponse:
curl -v http://localhost:8982/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
# Chercher: Access-Control-Allow-Origin
```

---

## ✅ Checklist de Test Complet

- [ ] Health check passe (Test 1)
- [ ] Enregistrement crée un utilisateur (Test 2)
- [ ] Login retourne les tokens (Test 3)
- [ ] Profile récupéré avec token valide (Test 4)
- [ ] Profile échoue sans token (Test 4 erreur)
- [ ] Refresh token génère nouveau JWT (Test 5)
- [ ] Logout se déroule sans erreur (Test 6)
- [ ] Frontend connexion fonctionne
- [ ] Tokens stockés dans localStorage
- [ ] Refresh token automatique fonctionne
- [ ] Logout vide localStorage
- [ ] JWT décodable avec contenu correct

---

## 📚 Ressources Additionnelles

- **Swagger API:** http://localhost:8082/swagger-ui.html
- **JWT.io:** https://jwt.io (décoder les tokens)
- **Postman Collection:** Créez une collection avec les endpoints ci-dessus
- **Logs:** Vérifiez `pds/auth-service/logs/` pour les erreurs détaillées

---

**Tous les tests réussis = Authentification opérationnelle! 🎉**
