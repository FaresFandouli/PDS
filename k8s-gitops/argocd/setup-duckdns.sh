#!/bin/bash
set -e

# =============================================================================
# DuckDNS Setup Script for PDS E-Health
# This script configures DuckDNS for dynamic DNS
# =============================================================================

# Configuration - REPLACE THESE VALUES
DUCKDNS_DOMAIN="pds-ehealth"
DUCKDNS_TOKEN="YOUR_DUCKDNS_TOKEN"

echo "==================================================================="
echo "DuckDNS Configuration for PDS E-Health"
echo "==================================================================="

# Get public IP
PUBLIC_IP=$(curl -s https://api.ipify.org)
echo "Public IP detected: $PUBLIC_IP"

# Update DuckDNS
echo "Updating DuckDNS record..."
RESPONSE=$(curl -s "https://www.duckdns.org/update?domains=$DUCKDNS_DOMAIN&token=$DUCKDNS_TOKEN&ip=$PUBLIC_IP")

if [ "$RESPONSE" = "OK" ]; then
    echo "DuckDNS updated successfully!"
    echo "Your application will be accessible at: http://$DUCKDNS_DOMAIN.duckdns.org"
else
    echo "Failed to update DuckDNS. Response: $RESPONSE"
    exit 1
fi

# Create cron job to update DuckDNS every 5 minutes
echo ""
echo "Setting up automatic DuckDNS update..."
CRON_JOB="*/5 * * * * curl -s \"https://www.duckdns.org/update?domains=$DUCKDNS_DOMAIN&token=$DUCKDNS_TOKEN&ip=\" > /dev/null 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "duckdns.org/update"; then
    echo "DuckDNS cron job already exists."
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "DuckDNS cron job created."
fi

echo ""
echo "==================================================================="
echo "DUCKDNS CONFIGURATION COMPLETE"
echo "==================================================================="
echo ""
echo "Domain: $DUCKDNS_DOMAIN.duckdns.org"
echo "IP: $PUBLIC_IP"
echo ""
echo "Access your application:"
echo "  API Gateway: http://$DUCKDNS_DOMAIN.duckdns.org:30081"
echo "  Keycloak:    http://$DUCKDNS_DOMAIN.duckdns.org:30080"
echo "  Argo CD:     https://$DUCKDNS_DOMAIN.duckdns.org:30443"
echo ""
echo "==================================================================="
