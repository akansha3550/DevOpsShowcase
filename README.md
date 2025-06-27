# KubeVisualizer - End-to-End DevOps Project

Welcome to KubeVisualizer, an end-to-end DevOps showcase project that integrates frontend, backend, cloud infrastructure, and observability tools. This project simulates real-world DevOps workflows, including CI/CD pipelines, container orchestration, infrastructure automation, and centralized logging.

## 🌟 Project Overview

KubeVisualizer is a full-stack application (React frontend + Node.js backend) deployed on a Kubernetes cluster (k3s on AWS EC2). The infrastructure is provisioned using Terraform, container images are built via Docker, and the entire pipeline is automated using GitHub Actions. Logs are centralized and visualized in Kibana using the ELK stack.

## 🧰 Tech Stack Used

| Layer             | Technology                          |
|------------------ |-------------------------------------|
| Frontend          | React (Dockerized)                  |
| Backend           | Node.js/Express (Dockerized)        |
| Containerization  | Docker                              |
| Orchestration     | Kubernetes (Minikube → k3s on EC2)  |
| CI/CD             | GitHub Actions                      |
| Cloud Hosting     | AWS EC2                             |
| Infrastructure    | Terraform (IaC)                     |
| Monitoring        | ELK Stack                           |
---

## 🛠️ Features Implemented

- ✅ Dockerized full-stack app (React frontend, Node backend)
- ✅ GitHub Actions CI/CD pipeline for Docker image build and push
- ✅ Kubernetes manifests for deployment, service, ingress, HPA
- ✅ Terraform automation to provision AWS EC2 + Security Groups
- ✅ k3s lightweight Kubernetes on EC2 with app auto-deployment
- ✅ Ingress with Traefik for routing and load balancing
- ✅ Centralized logging with Filebeat and ELK stack
- ✅ Live pod status visualization in frontend via K8s API

## Project Structure
.
- ├── .github/workflows/         # GitHub Actions CI/CD pipelines
- ├── terraform/                 # Terraform scripts for AWS EC2
- ├── k8s/                       # Kubernetes manifests (YAMLs)
- ├── frontend/                  # React app (Dockerized)
- ├── backend/                   # Node.js backend (Dockerized)
- ├── logging/                   # Filebeat/ELK configurations
- ├── rbac/                      # RBAC configs for secure K8s API access
- └── README.md                  # This file

## 🔄 Local Development (Minikube)
```bash
    git clone https://github.com/akansha3550/DevOpsShowcase.git
    cd DevOpsShowcase

# Build Docker images
```bash
    docker build -t <your-dockerhub>/frontend ./frontend
    docker build -t <your-dockerhub>/backend ./backend

# Start Minikube
```bash
    minikube start
    kubectl apply -f k8s/

# Access app
```bash
    minikube service frontend-service

## ☁️Cloud Deployment on AWS EC2

# Requirements

- AWS account
- Terraform installed
- SSH key pair

## Terraform Setup (in terraform/ folder)
 ```bash
     cd terraform
     terraform init
     terraform apply

Outputs:

- EC2 instance with open ports (22, 3000, 5000, 80, 30080)
- k3s auto-installed with a startup script

**SSH into your instance**
   ```bash
       ssh -i ~/.ssh/id_rsa ubuntu@<EC2_PUBLIC_IP>

🚀 GitHub Actions CI/CD
1. **CI Workflow**

- On code push, builds Docker image
- Pushes to Docker Hub

2. **CD Workflow (via SSH)**

- Connects to EC2
- Pulls updated YAML / images
- Runs kubectl apply to update services

3. **Secrets Required in GitHub**

- DOCKER_USERNAME
- DOCKER_PASSWORD
- EC2_HOST
- EC2_SSH_KEY (private key)

🚧 **Logging & Observability with ELK**

## Steps ##

- Deploy ELK stack (via manifests under logging/)
- Deploy Filebeat as DaemonSet
- Filebeat reads pod logs and ships to Elasticsearch
- Visualize logs in Kibana

**Kibana Search Example**
```bash
    kubernetes.labels.app : "frontend"
    kubernetes.labels.app : "backend"

🌐 Accessing the App
Once deployed, you can access the app using your EC2 public IP on port 30000 (or whichever NodePort is used in your frontend service.yaml).

Example:
http://<EC2_PUBLIC_IP>:30000

👨‍💼 About Me
I'm a DevOps enthusiast building end-to-end workflows with cloud-native tools.
This project was built to simulate real-world DevOps pipelines and strengthen hands-on knowledge in CI/CD, containerization, Kubernetes, and cloud automation.
