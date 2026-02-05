# 🔐 Authentification Simplifiée - Username/Password

Votre système d'authentification est maintenant simplifié avec **username et password uniquement**.

---

## ✅ Changements Effectués

- ✅ **Email supprimé** - N'utilise plus l'email
- ✅ **Username** - Identifiant unique (au lieu de l'email)
- ✅ **Vérification email supprimée** - Inscription directe
- ✅ **Mot de passe oublié supprimé** - Pas de reset par email
- ✅ **Configuration mail supprimée** - Plus besoin de Gmail
- ✅ **Code nettoyé** - Moins de dépendances

---

## 📋 Schéma Simple

```
Inscription:  username + password + rôle → Créer utilisateur
Login:        username + password → Vérifier → Tokens JWT
Profile:      token JWT → Retourner utilisateur
Logout:       Effacer tokens localStorage
```

---

## 🚀 Configuration Minimale

### 1. Backend (.env)

```bash
cd auth-service
cp .env.example .env
```

**Éditer `.env`:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=ma-cle-secrete-minimum-64-caracteres-pour-hs256
```

### 2. Frontend (.env)

Déjà configuré, rien à faire ✅

---

## 🧪 Tests Rapides

### Exemple 1: Inscription

```bash
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john123",
    "password": "Pass1234!",
    "role": "PATIENT"
  }'
```

**Réponse (201):**
```json
{
  "id": 1,
  "username": "john123",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Exemple 2: Connexion

```bash
curl -X POST http://localhost:8982/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john123",
    "password": "Pass1234!"
  }'
```

**Réponse (200):**
```json
{
  "id": 1,
  "username": "john123",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Exemple 3: Récupérer Profil

```bash
# Copier le token de la réponse login
TOKEN="votre-token-ici"

curl http://localhost:8982/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Endpoints

| Endpoint | Méthode | Paramètres | Authentifié |
|----------|---------|-----------|------------|
| `/auth/register` | POST | username, password, role | Non |
| `/auth/login` | POST | username, password | Non |
| `/auth/profile` | GET | token en header | ✅ Oui |
| `/auth/refresh` | POST | refreshToken | Non |
| `/auth/logout` | POST | token en header | ✅ Oui |
| `/auth/health` | GET | - | Non |

---

## 🎯 Base de Données

Table `users` simplifiée:

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

**Champs disponibles:**
- `id` - Identifiant unique
- `username` - Nom d'utilisateur (unique)
- `password` - Mot de passe hashé (BCrypt)
- `role` - Rôle utilisateur
- `active` - Compte actif/désactivé
- `created_at` - Date d'inscription
- `updated_at` - Dernière modification
- `last_login` - Dernière connexion

---

## 🔑 Rôles Disponibles

```
- PATIENT   (Patient)
- DOCTOR    (Médecin)
- ADMIN     (Administrateur)
```

Exemple:
```bash
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr_martin",
    "password": "DocPass123!",
    "role": "DOCTOR"
  }'
```

---

## 🧩 Frontend Integration

### 1. Afficher Formulaire Inscription

```jsx
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [role, setRole] = useState('PATIENT')

const register = async () => {
  const response = await fetch('http://localhost:8982/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  })
  const data = await response.json()
  localStorage.setItem('pds_token', data.token)
}
```

### 2. Afficher Formulaire Login

```jsx
const login = async () => {
  const response = await fetch('http://localhost:8982/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const data = await response.json()
  localStorage.setItem('pds_token', data.token)
  localStorage.setItem('pds_refresh_token', data.refreshToken)
}
```

### 3. Utiliser Token dans Requêtes

```jsx
const response = await fetch('http://localhost:8982/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('pds_token')}`
  }
})
```

---

## ✅ Checklist Test

- [ ] Eureka démarre (port 8761)
- [ ] Auth Service démarre (port 8082)
- [ ] Gateway démarre (port 8982)
- [ ] Frontend démarre (port 5173)
- [ ] Health check répond: `curl http://localhost:8982/api/auth/health`
- [ ] Inscription fonctionne (POST register)
- [ ] Login fonctionne (POST login)
- [ ] Token stocké dans localStorage
- [ ] Profile accessible avec token
- [ ] Frontend connexion fonctionne
- [ ] Déconnexion vide localStorage

---

## 🔒 Sécurité

**Implémenté:**
- ✅ Hashage BCrypt des mots de passe
- ✅ JWT tokens (HS256)
- ✅ Refresh tokens automatiques
- ✅ CORS configuré
- ✅ Validation des entrées

**À ajouter avant production:**
- Rate limiting
- HTTPS/TLS
- Token blacklist
- Audit logging

---

## 📝 Notes Importantes

1. **Pas de réinitialisation de mot de passe**
   - L'utilisateur doit configurer un nouveau compte si mot de passe oublié
   - Ou implémenter soi-même via SMS/autre

2. **Pas de vérification email**
   - Inscription directe sans confirmation
   - L'utilisateur peut utiliser n'importe quel username

3. **Pas de 2FA**
   - Authentification simple
   - À implémenter si besoin

4. **Jetons simples**
   - Access token: 24h
   - Refresh token: 7j

---

## 🚀 Démarrage Complet

**Terminal 1:**
```bash
cd eureka-service && mvn spring-boot:run
```

**Terminal 2:**
```bash
cd auth-service && mvn spring-boot:run
```

**Terminal 3:**
```bash
cd gateway-service && mvn spring-boot:run
```

**Terminal 4:**
```bash
cd pds-frontend && npm run dev
```

---

## 🎯 Prochaines Étapes

1. Tester inscription/login via cURL
2. Intégrer formulaires au frontend
3. Tester flow complet sur le navigateur
4. Ajouter réinitialisation mot de passe (optionnel)
5. Ajouter vérification email (optionnel)

---

**Votre système d'auth est prêt! Commencez par inscrire un utilisateur. 🎉**
