# Guide d'Intégration Frontend-Backend

## Vue d'ensemble

Ce guide explique comment le frontend React se connecte aux microservices Spring Boot et ce qui est attendu de chaque endpoint.

## Architecture générale

```
Frontend React (Port 5173)
        ↓ (HTTP Requests)
API Gateway (Port 8081)
        ↓
Auth Service (Port 8082)
├─ Clinic Service (Port 8083)
├─ Medical Service (Port 8084)
└─ Consultation Service (Port 8085)
```

## Endpoints requis

### 1. Authentication Service (`/api/auth`)

#### POST `/api/auth/login`
Login avec email et password.

**Request:**
```json
{
  "email": "doctor@pds.com",
  "password": "doctor123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "doctor@pds.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DOCTOR",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "avatar": null
}
```

#### GET `/api/auth/profile`
Récupère le profil de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "doctor@pds.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DOCTOR",
  "avatar": null
}
```

#### POST `/api/auth/logout`
Déconnexion (invalide le token côté serveur).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### POST `/api/auth/refresh`
Renouvelle le token d'accès.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Clinic Service (`/api/clinic`)

#### GET `/api/clinic/patients`
Liste tous les patients (DOCTOR et ADMIN uniquement).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@example.com",
      "dateOfBirth": "1990-05-15",
      "gender": "F",
      "phone": "0612345678",
      "address": "123 Rue de Paris",
      "city": "Paris",
      "zipCode": "75001"
    }
  ]
}
```

#### POST `/api/clinic/patients`
Crée un nouveau patient.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "firstName": "Jean",
  "lastName": "Martin",
  "email": "jean@example.com",
  "dateOfBirth": "1985-03-20",
  "gender": "M",
  "phone": "0698765432",
  "address": "456 Avenue Lyon",
  "city": "Lyon",
  "zipCode": "69000"
}
```

**Response (201):**
```json
{
  "id": 2,
  "firstName": "Jean",
  "lastName": "Martin",
  ...
}
```

#### GET `/api/clinic/appointments`
Liste les RDV de l'utilisateur.

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "patientId": 1,
      "doctorId": 2,
      "date": "2024-02-20T14:30:00",
      "status": "CONFIRMED",
      "reason": "Consultation générale",
      "notes": "Patient se plaint de fatigue"
    }
  ]
}
```

#### POST `/api/clinic/appointments`
Crée un nouveau RDV.

**Request:**
```json
{
  "patientId": 1,
  "doctorId": 2,
  "date": "2024-02-20T14:30:00",
  "reason": "Consultation générale",
  "notes": ""
}
```

**Response (201):**
```json
{
  "id": 1,
  "patientId": 1,
  "doctorId": 2,
  "date": "2024-02-20T14:30:00",
  "status": "PENDING",
  "reason": "Consultation générale"
}
```

### 3. Medical Service (`/api/medical`)

#### GET `/api/medical/records`
Liste les dossiers médicaux.

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "patientId": 1,
      "doctorId": 2,
      "date": "2024-02-15",
      "diagnosis": "Grippe",
      "treatment": "Repos et hydratation",
      "notes": "Consultation de suivi"
    }
  ]
}
```

#### POST `/api/medical/records`
Crée un nouveau dossier médical.

**Request:**
```json
{
  "patientId": 1,
  "doctorId": 2,
  "date": "2024-02-15",
  "diagnosis": "Grippe",
  "treatment": "Repos",
  "notes": "Consultation"
}
```

### 4. Consultation Service (`/api/consultation`)

#### GET `/api/consultation/consultations`
Liste les consultations.

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "patientId": 1,
      "doctorId": 2,
      "date": "2024-02-15T10:00:00",
      "notes": "Consultation générale",
      "status": "COMPLETED"
    }
  ]
}
```

#### POST `/api/consultation/consultations`
Crée une consultation.

**Request:**
```json
{
  "patientId": 1,
  "doctorId": 2,
  "date": "2024-02-15T10:00:00",
  "notes": "Consultation générale"
}
```

## Gestion des erreurs

Le frontend s'attend à des réponses d'erreur avec des codes HTTP standards:

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Email invalide",
  "errors": {
    "email": "Format email incorrect"
  }
}
```

### 401 Unauthorized
```json
{
  "status": 401,
  "message": "Token invalide ou expiré"
}
```

Le frontend redirige automatiquement vers `/login` en cas de 401.

### 403 Forbidden
```json
{
  "status": 403,
  "message": "Vous n'avez pas les permissions requises"
}
```

Le frontend redirige vers `/unauthorized`.

### 404 Not Found
```json
{
  "status": 404,
  "message": "Ressource non trouvée"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "Erreur serveur"
}
```

## Intercepteurs Axios

Le frontend utilise des intercepteurs pour:

1. **Request Interceptor**: Ajoute le token d'authentification
```javascript
Authorization: Bearer {token}
```

2. **Response Interceptor**: Gère les erreurs 401/403
```javascript
- 401 → Redirige vers /login
- 403 → Redirige vers /unauthorized
```

## CORS Configuration

Le backend doit autoriser les requêtes depuis le frontend:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and()...
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## Authentification JWT

Le frontend envoie le token dans chaque requête:

```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...
```

Le backend doit:
1. Valider le signature du JWT
2. Vérifier que le token n'a pas expiré
3. Extraire le `role` du token

Exemple du payload JWT:
```json
{
  "sub": "1",
  "email": "doctor@pds.com",
  "role": "DOCTOR",
  "iat": 1516239022,
  "exp": 1516242622
}
```

## Variables d'environnement Frontend

Créez un fichier `.env` à la racine du projet:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

## Checklist d'intégration

- [ ] Endpoint d'authentification (`POST /api/auth/login`)
- [ ] Endpoint de profil (`GET /api/auth/profile`)
- [ ] Endpoints patients (`GET/POST /api/clinic/patients`)
- [ ] Endpoints RDV (`GET/POST /api/clinic/appointments`)
- [ ] Endpoints consultations (`GET/POST /api/consultation/consultations`)
- [ ] Endpoints dossiers médicaux (`GET/POST /api/medical/records`)
- [ ] CORS configuré correctement
- [ ] JWT dans les réponses d'authentification
- [ ] Gestion des erreurs (400, 401, 403, 404, 500)
- [ ] Roles dans le token (`PATIENT`, `DOCTOR`, `ADMIN`)

## Troubleshooting

### Erreur 401 même après login
- Vérifiez que le token est bien retourné par l'API
- Vérifiez que le token est stocké correctement dans localStorage
- Vérifiez que l'en-tête `Authorization` est envoyé

### Erreur CORS
- Vérifiez la configuration CORS du backend
- Vérifiez que `http://localhost:5173` est dans `allowedOrigins`
- Vérifiez que `Content-Type` est autorisé

### Routes refusées (403)
- Vérifiez que le rôle dans le token correspond aux rôles attendus
- Vérifiez que le `case` dans le switch du Dashboard correspond aux rôles

### Dashboard vide
- Vérifiez que les endpoints de données retournent bien les données
- Vérifiez les réponses dans la console réseau
- Vérifiez les messages d'erreur dans la console du navigateur
