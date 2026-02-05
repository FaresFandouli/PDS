# 📋 Résumé - Testing de l'Authentification

## 🎯 Objectif
Vous avez 4 guides pour tester votre système d'authentification JWT.

---

## 📚 Guides Disponibles

### 1. **QUICK_TEST.md** ⚡
**Pour:** Les impatients (5 minutes)
- Setup rapide
- Commandes cURL simples
- Import Postman en 2 clics
- Checklist succès

**Commencez ici si c'est votre première fois!**

### 2. **TESTING_AUTHENTICATION.md** 📖
**Pour:** Les tests détaillés
- 6 scénarios de test complets
- Erreurs à tester
- Requêtes/réponses complètes
- Tests frontend
- Tests JWT
- Troubleshooting

**Utilisez-le pour valider complètement votre API**

### 3. **PDS-Auth-API.postman_collection.json** 🚀
**Pour:** Utilisateurs Postman
- Collection complète prête à l'emploi
- Variables auto-remplissantes
- Tous les endpoints inclus
- Gestion automatique des tokens

**Import:** File → Import → Sélectionner le fichier JSON

### 4. **test-auth.sh** 🤖
**Pour:** Tests automatisés
- Script bash complet
- Teste tous les endpoints en ordre
- Sortie colorée
- Gestion des erreurs

**Commande:** `bash test-auth.sh` ou `./test-auth.sh`

---

## 🚀 Démarrage Recommandé

### Étape 1: Configuration (2 min)
```bash
# Backend
cd auth-service
cp .env.example .env
# Éditer .env: JWT_SECRET et credentials DB

# Frontend
cd pds-frontend
cp .env.example .env
# Déjà configuré ✅
```

### Étape 2: Démarrer les services (3 min)

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
cd pds-frontend && npm install && npm run dev
```

### Étape 3: Tester (5-30 min selon la méthode)

**Option A - Très Rapide (5 min):**
Lire `QUICK_TEST.md` → Copier les commandes cURL

**Option B - Postman (10 min):**
Importer `PDS-Auth-API.postman_collection.json` → Cliquer les endpoints

**Option C - Automatisé (2 min):**
```bash
bash test-auth.sh
```

**Option D - Complet (30 min):**
Suivre `TESTING_AUTHENTICATION.md` étape par étape

---

## ✅ Tests Essentiels

| Test | Endpoint | Méthode | Succès =
|------|----------|---------|----------
| Health | `/auth/health` | GET | 200 ✓
| Register | `/auth/register` | POST | 201 ✓ + tokens
| Login | `/auth/login` | POST | 200 ✓ + tokens
| Profile | `/auth/profile` | GET | 200 ✓ + user data
| Refresh | `/auth/refresh` | POST | 200 ✓ + new token
| Logout | `/auth/logout` | POST | 200 ✓

---

## 📝 Exemple Simple (2 min)

```bash
# 1. Health Check
curl http://localhost:8982/api/auth/health
# Attendu: {"message":"Auth service is running"}

# 2. Register
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Pass123!",
    "firstName":"John",
    "lastName":"Doe",
    "role":"PATIENT"
  }'
# Attendu: 201 + tokens

# 3. Login (copier le token de l'étape 2)
TOKEN="votre-token-ici"
curl http://localhost:8982/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
# Attendu: 200 + user data
```

---

## 🔍 Points de Vérification

### Backend
- ✅ Base de données crée automatiquement sur le premier démarrage
- ✅ JWT secrèt externalisé dans `.env`
- ✅ Email non vérifié à l'inscription (emailVerified = false)
- ✅ Tokens: access 24h, refresh 7d
- ✅ CORS configuré pour localhost:5173

### Frontend
- ✅ Tokens stockés dans localStorage
- ✅ Requêtes incluent le Bearer token
- ✅ Refresh token automatique sur 401
- ✅ Déconnexion vide le localStorage
- ✅ Aucune erreur CORS

### JWT
- ✅ Algorithm: HS256
- ✅ Contient: userId, email, role
- ✅ Expiration correcte (24h pour access)
- ✅ Décodable avec jwt.io

---

## 🚨 Erreurs Fréquentes

### "Connection refused"
→ Vérifier qu'un service n'est pas démarré
→ Lire la section Troubleshooting de `QUICK_TEST.md`

### "Database connection failed"
→ MySQL n'est pas en cours d'exécution
→ Vérifier credentials dans `.env`

### CORS error
→ Gateway n'est pas démarré
→ Vérifier que le port 8982 est libre

### "Invalid token"
→ Token expiré (24h)
→ Utiliser refresh token pour en obtenir un nouveau

---

## 🎓 Ordre d'Apprentissage Recommandé

1. Lire: `QUICK_TEST.md` (comprendre les concepts)
2. Tester: Commandes cURL simples
3. Approfondir: `TESTING_AUTHENTICATION.md`
4. Automatiser: `test-auth.sh`
5. Utiliser: `PDS-Auth-API.postman_collection.json`

---

## 🔐 Sécurité - Avant Production

- [ ] JWT_SECRET: minimum 64 caractères aléatoires
- [ ] HTTPS activé
- [ ] Email vérification obligatoire
- [ ] Rate limiting sur login
- [ ] CORS: domaines spécifiés (pas *)
- [ ] Token blacklist on logout
- [ ] Audit logging

---

## 📊 Ressources

| Ressource | Lieu |
|-----------|------|
| Tests rapides | `QUICK_TEST.md` |
| Tests complets | `TESTING_AUTHENTICATION.md` |
| Postman | `PDS-Auth-API.postman_collection.json` |
| Auto-test | `test-auth.sh` |
| Configuration | `README.md` |
| Swagger API | http://localhost:8082/swagger-ui.html |
| Eureka | http://localhost:8761 |
| JWT.io | https://jwt.io |

---

## 💡 Tips

**Pour déboguer rapidement:**
```bash
# Voir les logs du service
tail -f auth-service/logs/*.log

# Tester la connexion DB
mysql -u root -p -e "USE pds_auth; SELECT COUNT(*) FROM users;"

# Vérifier les ports
lsof -i :8082  # Auth Service
lsof -i :8982  # Gateway
```

**Pour tester le refresh automatique:**
```javascript
// Dans la console du navigateur:
localStorage.setItem('pds_token', 'invalid.token.here')
// Naviguer vers une page protégée
// Devrait utiliser refresh token automatiquement
```

---

## ❓ Questions Fréquentes

**Q: Les mails de vérification ne s'envoient pas?**
A: Configurer MAIL_USERNAME et MAIL_PASSWORD dans `.env`

**Q: Le token ne se refresh pas?**
A: Vérifier que le refresh token est stocké dans localStorage

**Q: Pourquoi 401 sur profile?**
A: Token expiré ou invalide - utiliser refresh token

**Q: Comment changer le mot de passe?**
A: Utiliser `/auth/forgot-password` + `/auth/reset-password`

---

## ✨ Prochaines Étapes

Après avoir testé l'authentification:
1. Intégrer avec d'autres services (clinic, medical, etc.)
2. Ajouter des rôles supplémentaires (DOCTOR, ADMIN)
3. Implémenter le contrôle d'accès basé sur les rôles
4. Ajouter la vérification d'email obligatoire
5. Configurer le logging d'audit

---

**Status: ✅ Authentification prête à être testée!**

Commencez avec `QUICK_TEST.md` maintenant! 🚀
