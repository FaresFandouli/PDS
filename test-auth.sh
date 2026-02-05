#!/bin/bash

# Script de test pour l'authentification PDS
# Usage: ./test-auth.sh

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8982/api"
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="TestPass123!"

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}    Test d'Authentification PDS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}[1/6] Health Check...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/auth/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Health Check réussi${NC}"
    echo "  Réponse: $BODY"
else
    echo -e "${RED}✗ Erreur (HTTP $HTTP_CODE)${NC}"
    echo "  Réponse: $BODY"
    exit 1
fi

echo ""

# Test 2: Register
echo -e "${YELLOW}[2/6] Enregistrement d'un utilisateur...${NC}"
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"role\": \"PATIENT\",
    \"phone\": \"+33612345678\",
    \"address\": \"123 Rue Test\",
    \"city\": \"Paris\",
    \"zipCode\": \"75001\",
    \"dateOfBirth\": \"1990-01-01\",
    \"gender\": \"M\"
  }")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n 1)
BODY=$(echo "$REGISTER_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✓ Enregistrement réussi${NC}"
    ACCESS_TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$BODY" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
    echo "  Email: $TEST_EMAIL"
    echo "  Token (premiers 20 chars): ${ACCESS_TOKEN:0:20}..."
else
    echo -e "${RED}✗ Erreur (HTTP $HTTP_CODE)${NC}"
    echo "  Réponse: $BODY"
    exit 1
fi

echo ""

# Test 3: Login
echo -e "${YELLOW}[3/6] Connexion...${NC}"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Connexion réussie${NC}"
    ACCESS_TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "  Token obtenu"
else
    echo -e "${RED}✗ Erreur (HTTP $HTTP_CODE)${NC}"
    echo "  Réponse: $BODY"
    exit 1
fi

echo ""

# Test 4: Get Profile
echo -e "${YELLOW}[4/6] Récupération du profil...${NC}"
PROFILE_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_CODE=$(echo "$PROFILE_RESPONSE" | tail -n 1)
BODY=$(echo "$PROFILE_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Profil récupéré${NC}"
    EMAIL=$(echo "$BODY" | grep -o '"email":"[^"]*' | cut -d'"' -f4)
    echo "  Email: $EMAIL"
else
    echo -e "${RED}✗ Erreur (HTTP $HTTP_CODE)${NC}"
    echo "  Réponse: $BODY"
    exit 1
fi

echo ""

# Test 5: Refresh Token
echo -e "${YELLOW}[5/6] Renouvellement du token...${NC}"
REFRESH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")

HTTP_CODE=$(echo "$REFRESH_RESPONSE" | tail -n 1)
BODY=$(echo "$REFRESH_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Token renouvelé${NC}"
    NEW_TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "  Nouveau token obtenu"
    ACCESS_TOKEN=$NEW_TOKEN
else
    echo -e "${RED}✗ Erreur (HTTP $HTTP_CODE)${NC}"
    echo "  Réponse: $BODY"
    exit 1
fi

echo ""

# Test 6: Logout
echo -e "${YELLOW}[6/6] Déconnexion...${NC}"
LOGOUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_CODE=$(echo "$LOGOUT_RESPONSE" | tail -n 1)
BODY=$(echo "$LOGOUT_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Déconnexion réussie${NC}"
else
    echo -e "${RED}✗ Erreur (HTTP $HTTP_CODE)${NC}"
    echo "  Réponse: $BODY"
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Tous les tests d'authentification réussis!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Afficher les infos de test
echo -e "\n${YELLOW}Informations de test:${NC}"
echo "  Email testé: $TEST_EMAIL"
echo "  URL API: $BASE_URL"
echo "  Timestamp: $(date)"
