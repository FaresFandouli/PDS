# 🚀 Quick Start - Test Rapide de l'Authentification

Guide en 5 minutes pour tester l'authentification JWT.

## 📋 Prérequis

- MySQL en cours d'exécution
- Ports libres: 8761, 8082, 8982, 5173

## 🔧 Setup Configuration

### 1. Backend (.env)

```bash
cd auth-service
cp .env.example .env
```

**Éditer `auth-service/.env` (MINIMUM):**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=my-super-secret-key-minimum-64-characters-long-for-hs256-1234567890
```

### 2. Frontend (.env)

```bash
cd pds-frontend
cp .env.example .env
# Le fichier est déjà configuré avec les bonnes valeurs
```

---

## 🚀 Lancer les Services

### Terminal 1: Eureka
```bash
cd eureka-service
mvn spring-boot:run
# Attendre: "Eureka Server started"
```

### Terminal 2: Auth Service
```bash
cd auth-service
mvn spring-boot:run
# Attendre: "Started AuthServiceApplication"
```

### Terminal 3: Gateway
```bash
cd gateway-service
mvn spring-boot:run
# Attendre: "Mapped "/api/**""
```

### Terminal 4: Frontend
```bash
cd pds-frontend
npm install
npm run dev
# Attendre: "Local: http://localhost:5173"
```

---

## 🧪 Tests Rapides

### Option 1: Avec cURL (Terminal 5)

```bash
# 1. Health Check
curl http://localhost:8982/api/auth/health

# 2. Register
EMAIL="user$(date +%s)@example.com"
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"Pass123!\",
    \"firstName\": \"John\",
    \"lastName\": \"Doe\",
    \"role\": \"PATIENT\"
  }"

# 3. Login (copier l'email du step 2)
curl -X POST http://localhost:8982/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"Pass123!\"
  }"
# Copier le "token" du résultat
```

**Sauvegarder le token:**
```bash
TOKEN="your-token-here-from-step-3"

# 4. Get Profile avec le token
curl http://localhost:8982/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# ✅ Si vous recevez les données utilisateur = succès!
```

### Option 2: Avec Postman

1. **Importer la collection:**
   - Ouvrir Postman
   - Cliquer "Import"
   - Sélectionner `PDS-Auth-API.postman_collection.json`
   - Cliquer "Import"

2. **Configurer les variables:**
   - Cliquer l'onglet "Variables"
   - Vérifier `base_url` = `http://localhost:8982/api`

3. **Tester dans l'ordre:**
   - Cliquer "Health Check" → "Send"
   - Cliquer "Register User" → "Send"
   - Cliquer "Login" → "Send"
   - Cliquer "Get Profile" → "Send"
   - Cliquer "Refresh Token" → "Send"
   - Cliquer "Logout" → "Send"

### Option 3: Script Bash (Tous les tests)

```bash
# Sur Linux/macOS
chmod +x test-auth.sh
./test-auth.sh

# Sur Windows (Git Bash ou WSL)
bash test-auth.sh
```

---

## 🌐 Tests Frontend

### 1. Ouvrir le Frontend
- Naviguer vers: `http://localhost:5173`

### 2. Se Connecter
- Email: `user@example.com` (l'email créé ci-dessus)
- Mot de passe: `Pass123!`
- Cliquer "Se connecter"

### 3. Vérifier dans la Console (F12)

```javascript
// Dans la console du navigateur, taper:
localStorage.getItem('pds_token')
localStorage.getItem('pds_refresh_token')
JSON.parse(localStorage.getItem('pds_user'))
```

**Résultat attendu:**
```
// Token (commencera par "eyJ...")
// Refresh Token (commencera par "eyJ...")
// {id: 1, email: "...", firstName: "...", role: "PATIENT"}
```

---

## ✅ Checklist Succès

- [ ] Eureka affiche les services enregistrés
- [ ] Auth Service démarre sans erreur
- [ ] Gateway démarre et route `/api/*`
- [ ] Frontend démarre sur http://localhost:5173
- [ ] Health check répond 200
- [ ] Register crée un utilisateur
- [ ] Login retourne tokens
- [ ] Profile accessible avec token
- [ ] Tokens dans localStorage
- [ ] Frontend page charge sans erreur CORS

---

## 🚨 Problèmes Courants

### "Cannot GET /api/auth/register"
**Solution:** Gateway n'est pas en cours d'exécution
```bash
cd gateway-service && mvn spring-boot:run
```

### "Connection refused"
**Solution:** Vérifier tous les services
```bash
curl http://localhost:8761    # Eureka
curl http://localhost:8082    # Auth
curl http://localhost:8982    # Gateway
```

### "Database connection failed"
**Solution:** MySQL n'est pas démarré
```bash
# Linux/macOS
mysql.server start

# Windows (avec MySQL installé)
net start MySQL80
```

### "Module not found" (Frontend)
**Solution:** Réinstaller les dépendances
```bash
cd pds-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Eureka | 8761 | http://localhost:8761 |
| Auth Service | 8082 | http://localhost:8082 |
| Gateway | 8982 | http://localhost:8982 |
| MySQL | 3306 | localhost:3306 |

---

## 📚 Documentation Complète

- **Détails des tests:** `TESTING_AUTHENTICATION.md`
- **Configuration:** `README.md`
- **Collection Postman:** `PDS-Auth-API.postman_collection.json`

---

**🎯 Si tous les tests passent = Authentification opérationnelle! 🎉**
