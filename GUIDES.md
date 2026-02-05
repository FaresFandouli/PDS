# 📚 Index des Guides PDS

Bienvenue! Voici tous les guides disponibles pour votre projet.

---

## 🔐 Authentification (Nouveau!)

### Pour Commencer
1. **[QUICK_TEST.md](./QUICK_TEST.md)** ⚡
   - **Durée:** 5 minutes
   - **Contenu:** Setup rapide et premiers tests
   - **Pour qui:** Tous les niveaux
   - **👉 Commencez ici**

### Pour les Détails
2. **[TESTING_AUTHENTICATION.md](./TESTING_AUTHENTICATION.md)** 📖
   - **Durée:** 30 minutes
   - **Contenu:** 6 scénarios complets avec toutes les erreurs
   - **Pour qui:** Développeurs voulant comprendre en profondeur

### Pour les Outils
3. **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** 📋
   - **Durée:** Référence rapide
   - **Contenu:** Résumé et checklist
   - **Pour qui:** Tous (document de référence)

### Fichiers de Ressources
- **[PDS-Auth-API.postman_collection.json](./PDS-Auth-API.postman_collection.json)** 🚀
  - Collection Postman prête à importer
  - Variables auto-remplissantes

- **[test-auth.sh](./test-auth.sh)** 🤖
  - Script bash pour tests automatisés
  - Résultats en couleurs

---

## 📖 Documentation Principale

- **[README.md](./README.md)** - Configuration et démarrage complet
  - Architecture
  - Quick Start
  - Environment Configuration
  - Troubleshooting

---

## 🎯 Parcours Recommandés

### 🚀 Je veux juste que ça marche (5 min)
1. Lire: `QUICK_TEST.md`
2. Copier: Les commandes cURL
3. Tester: Les 6 endpoints

### 🔬 Je veux comprendre (30 min)
1. Lire: `README.md` - Section Architecture
2. Lire: `TESTING_AUTHENTICATION.md` - Tous les tests
3. Tester: Chaque scénario manuellement
4. Décoder: Les tokens JWT avec jwt.io

### 🛠️ Je veux automatiser (10 min)
1. Lire: `TESTING_SUMMARY.md`
2. Installer: Postman
3. Importer: `PDS-Auth-API.postman_collection.json`
4. Cliquer: Les endpoints dans l'ordre

### 🤖 Je veux tout tester d'un coup (2 min)
1. Configurer: `.env` dans `auth-service/`
2. Démarrer: Les 4 services
3. Exécuter: `bash test-auth.sh`
4. Voir: Les résultats en vert ✅

---

## 📋 Checklist Démarrage

- [ ] Lire `README.md` - section Quick Start
- [ ] Créer `auth-service/.env` de `.env.example`
- [ ] Créer `pds-frontend/.env` de `.env.example`
- [ ] Démarrer Eureka (Terminal 1)
- [ ] Démarrer Auth Service (Terminal 2)
- [ ] Démarrer Gateway (Terminal 3)
- [ ] Démarrer Frontend (Terminal 4)
- [ ] Tester avec `QUICK_TEST.md`
- [ ] Lire `TESTING_SUMMARY.md` pour comprendre les résultats

---

## 🔧 Configuration

### Backend (.env)
**Fichier:** `auth-service/.env`

**Minimum requis:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=my-super-secret-key-minimum-64-characters-long
```

### Frontend (.env)
**Fichier:** `pds-frontend/.env`

**Déjà configuré:** ✅
```env
VITE_API_BASE_URL=http://localhost:8982/api
VITE_ENV=development
```

---

## 🚀 Services

| Service | Port | Terminal | Commande |
|---------|------|----------|----------|
| Eureka | 8761 | 1 | `cd eureka-service && mvn spring-boot:run` |
| Auth | 8082 | 2 | `cd auth-service && mvn spring-boot:run` |
| Gateway | 8982 | 3 | `cd gateway-service && mvn spring-boot:run` |
| Frontend | 5173 | 4 | `cd pds-frontend && npm run dev` |
| MySQL | 3306 | - | `mysql.server start` (macOS) ou `net start MySQL80` (Windows) |

---

## 🌐 Accès URLs

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:8982
- **Auth Swagger:** http://localhost:8082/swagger-ui.html
- **Eureka:** http://localhost:8761
- **Database:** localhost:3306

---

## 🧪 Tests Disponibles

### Avec cURL
```bash
# Tous les exemples dans QUICK_TEST.md
curl http://localhost:8982/api/auth/health
```

### Avec Postman
```
Importer: PDS-Auth-API.postman_collection.json
Cliquer: Health Check → Send
```

### Avec Script
```bash
bash test-auth.sh
```

### Avec Frontend
```
Naviguer: http://localhost:5173
Cliquer: Login
Email: test@example.com
Password: Pass123!
```

---

## 📊 Architecture

```
Frontend (React)
    ↓
axios.config.js (auto refresh)
    ↓
API Gateway (8982)
    ↓
Auth Service (8082)
    ↓
MySQL Database
```

---

## 🔐 Sécurité

**Actuellement (Développement):**
- ✅ JWT (HS256)
- ✅ Refresh token
- ✅ CORS configuré
- ⚠️ Credentials en .env

**À faire avant Production:**
- [ ] JWT secret dans vault sécurisé
- [ ] HTTPS/TLS
- [ ] Email vérification obligatoire
- [ ] Rate limiting
- [ ] Token blacklist
- [ ] Audit logging

---

## 🆘 Aide Rapide

**Erreur "Cannot GET /api"**
→ Gateway n'est pas démarré: `cd gateway-service && mvn spring-boot:run`

**Erreur "Connection refused"**
→ Vérifier tous les services: `curl http://localhost:8761`

**Erreur DB**
→ MySQL n'est pas en cours d'exécution

**Erreur CORS**
→ Frontend port devrait être 5173, pas 3000

**Tests échouent**
→ Lire `TESTING_AUTHENTICATION.md` - section Troubleshooting

---

## 📚 Ressources Externes

- **JWT:** https://jwt.io - Décoder et comprendre les tokens
- **Postman:** https://www.postman.com/ - Client API
- **Spring Boot:** https://spring.io/projects/spring-boot - Framework backend
- **React:** https://react.dev - Framework frontend

---

## 🎓 Ordre d'Apprentissage

1. **Jour 1:** Lire README + QUICK_TEST + tester
2. **Jour 2:** TESTING_AUTHENTICATION + approfondir
3. **Jour 3:** Postman + automatiser
4. **Jour 4+:** Intégrer avec autres services

---

## ✅ Status

| Élément | Status |
|---------|--------|
| Backend | ✅ Opérationnel |
| Frontend | ✅ Configuré |
| Tests | ✅ Documentés |
| Guides | ✅ Complets |
| Sécurité | ⚠️ Dev only |

---

## 🚀 Prochaines Étapes

Après avoir testé l'authentification:
1. Tester les autres services (clinic, medical, consultation)
2. Implémenter les rôles (DOCTOR, ADMIN)
3. Ajouter le contrôle d'accès
4. Mettre en place le logging d'audit
5. Configurer les alertes

---

## 📞 Support

**Questions sur les tests?** → Lire `TESTING_SUMMARY.md` - FAQ

**Erreur non documentée?** → Vérifier les logs:
```bash
tail -f auth-service/logs/*.log
```

**Code ne compile pas?** → Vérifier Java version (17+)
```bash
java -version
```

---

**Prêt à commencer? → Ouvrez [QUICK_TEST.md](./QUICK_TEST.md) 🚀**
