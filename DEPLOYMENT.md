# PDS E-Health - Guide de Deploiement Complet

## Pre-requis

### Logiciels requis
- Terraform >= 1.0.0
- AWS CLI configure
- kubectl
- Git

### Comptes necessaires
- Compte AWS avec acces programmatique
- Compte Docker Hub
- Compte GitHub
- Compte DuckDNS (gratuit)

---

## PHASE 1 : Integration Continue (CI)

### Configuration des Secrets GitHub

Dans votre repository GitHub, allez dans Settings > Secrets and variables > Actions et ajoutez :

```
DOCKERHUB_USERNAME=votre-username-dockerhub
DOCKERHUB_TOKEN=votre-token-dockerhub
```

### Workflow CI

Le workflow `.github/workflows/ci-build.yml` se declenche automatiquement lors d'une Pull Request vers `main`.

Il effectue :
1. Build de tous les microservices
2. Execution des tests unitaires (bloquants)
3. Build des images Docker
4. Push sur Docker Hub avec tag `1.0.0-RC1`

---

## PHASE 2 : Promotion de Release

### Workflow Release

Le workflow `.github/workflows/release-approve.yml` se declenche lors du merge d'une PR vers `main`.

Il effectue :
1. Pull de l'image `1.0.0-RC1`
2. Retag en `1.0.0` (sans rebuild)
3. Push sur Docker Hub
4. Creation du tag Git `v1.0.0`
5. Creation d'une GitHub Release

---

## PHASE 3 : Infrastructure AWS & Kubernetes

### Etape 1 : Provisionnement Terraform

```bash
cd terraform

# Creer une paire de cles SSH
aws ec2 create-key-pair --key-name pds-k8s-key --query 'KeyMaterial' --output text > ~/.ssh/pds-k8s-key.pem
chmod 400 ~/.ssh/pds-k8s-key.pem

# Initialiser Terraform
terraform init

# Verifier le plan
terraform plan

# Appliquer
terraform apply
```

### Etape 2 : Initialisation du Master Kubernetes

```bash
# Connexion au master
ssh -i ~/.ssh/pds-k8s-key.pem ubuntu@<MASTER_PUBLIC_IP>

# Attendre que cloud-init termine
cloud-init status --wait

# Initialiser le cluster
chmod +x /tmp/scripts/01-init-master.sh
/tmp/scripts/01-init-master.sh
```

### Etape 3 : Joindre les Workers

Sur chaque worker node :

```bash
# Connexion au worker
ssh -i ~/.ssh/pds-k8s-key.pem ubuntu@<WORKER_PUBLIC_IP>

# Attendre que cloud-init termine
cloud-init status --wait

# Joindre le cluster (commande fournie par le master)
sudo kubeadm join <MASTER_IP>:6443 --token <TOKEN> --discovery-token-ca-cert-hash <HASH>
```

### Etape 4 : Verification

Sur le master :

```bash
kubectl get nodes
```

Resultat attendu :
```
NAME      STATUS   ROLES           AGE   VERSION
master    Ready    control-plane   5m    v1.31.0
worker1   Ready    <none>          3m    v1.31.0
worker2   Ready    <none>          3m    v1.31.0
```

---

## PHASE 4 : Deploiement GitOps avec Argo CD

### Etape 1 : Installation d'Argo CD

```bash
# Sur le master
chmod +x k8s-gitops/argocd/install-argocd.sh
./k8s-gitops/argocd/install-argocd.sh
```

### Etape 2 : Configuration du Repository GitOps

1. Creer un nouveau repository GitHub `pds-k8s-gitops`
2. Copier le contenu du dossier `k8s-gitops/` dans ce repository
3. Mettre a jour les variables dans les fichiers YAML :
   - Remplacer `${DOCKERHUB_USERNAME}` par votre username
   - Remplacer `${GITHUB_USERNAME}` par votre username

### Etape 3 : Configuration d'Argo CD

1. Acceder a l'interface Argo CD : `https://<NODE_IP>:30443`
2. Se connecter avec les credentials affiches lors de l'installation
3. Ajouter le repository GitOps :
   - Settings > Repositories > Connect Repo
   - URL : `https://github.com/<username>/pds-k8s-gitops.git`

4. Creer l'application :
```bash
kubectl apply -f k8s-gitops/argocd/project.yaml
kubectl apply -f k8s-gitops/argocd/application.yaml
```

### Etape 4 : Configuration DuckDNS

1. Creer un compte sur https://www.duckdns.org
2. Creer un sous-domaine (ex: `pds-ehealth`)
3. Mettre a jour le script `setup-duckdns.sh` avec votre token
4. Executer le script :

```bash
chmod +x k8s-gitops/argocd/setup-duckdns.sh
./k8s-gitops/argocd/setup-duckdns.sh
```

### Etape 5 : Verification du Deploiement

```bash
# Verifier les pods
kubectl get pods -n pds

# Verifier les services
kubectl get svc -n pds

# Verifier l'ingress
kubectl get ingress -n pds
```

---

## URLs d'Acces

| Service | URL |
|---------|-----|
| API Gateway | http://pds-ehealth.duckdns.org:30081 |
| Keycloak Admin | http://pds-ehealth.duckdns.org:30080 |
| Argo CD | https://pds-ehealth.duckdns.org:30443 |
| Eureka Dashboard | http://pds-ehealth.duckdns.org:30761 |

---

## Depannage

### Les pods ne demarrent pas

```bash
# Voir les logs
kubectl logs <pod-name> -n pds

# Voir les evenements
kubectl describe pod <pod-name> -n pds
```

### Probleme de pull d'image

```bash
# Verifier le secret Docker
kubectl get secret docker-registry-secret -n pds -o yaml

# Recreer le secret
kubectl delete secret docker-registry-secret -n pds
kubectl create secret docker-registry docker-registry-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=<username> \
  --docker-password=<token> \
  --docker-email=<email> \
  -n pds
```

### Probleme de connexion entre services

```bash
# Verifier le DNS interne
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup discovery-service.pds.svc.cluster.local
```

---

## Nettoyage

### Supprimer le deploiement Kubernetes

```bash
kubectl delete namespace pds
kubectl delete namespace argocd
```

### Supprimer l'infrastructure AWS

```bash
cd terraform
terraform destroy
```
