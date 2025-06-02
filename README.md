# KubeVisualizer - End-to-End DevOps Project with GitHub Actions, Docker, Kubernetes, Terraform, and AWS

Welcome to **KubeVisualizer**, a full-stack DevOps project built to simulate real-world infrastructure and CI/CD pipelines. This project demonstrates modern DevOps practices using containerized microservices, Kubernetes orchestration, cloud infrastructure provisioning, and automated CI/CD workflows.

## 🎯 Project Overview

KubeVisualizer is a demo app (frontend + backend) packaged in Docker, deployed on Kubernetes, and hosted on AWS. The infrastructure is provisioned using Terraform, and GitHub Actions is used for CI/CD.

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

- ✅ Dockerized fullstack app (frontend & backend)
- ✅ GitHub Actions pipeline for Docker build & push
- ✅ Kubernetes deployments with YAML (Minikube for local, k3s for cloud)
- ✅ Terraform automation to provision AWS infrastructure
- ✅ End-to-end CI/CD from GitHub to Kubernetes cluster
- ✅ Scalable, production-ready architecture

## 📸 Application Architecture
![image](https://github.com/user-attachments/assets/dcf9c5f3-8a99-4c8d-848d-bb022a7740cd)


 
## Project Structure

- ├── .github/workflows # GitHub Actions CI/CD pipelines
- ├── k8s/ # Kubernetes manifests for frontend & backend
- ├── terraform/ # Terraform scripts to provision AWS EC2 + SG
- ├── frontend/ # React app (Dockerized)
- ├── backend/ # Express API (Dockerized)
- ├── README.md # This file

## Step-by-Step Setup Guide

### Phase 1: Local DevOps Workflow

1. **Clone the repository**
   ```bash
   git clone https://github.com/akansha3550/DevOpsShowcase.git
   cd DevOpsShowcase

2. **Build Docker images**
   ```bash
   docker build -t your-dockerhub/frontend ./frontend
   docker build -t your-dockerhub/backend ./backend

3. **Run locally using Minikube**
   ```bash
   minikube start
   kubectl apply -f k8s/

4. **Access the App**
   ```bash
   minikube service frontend-service

**Phase 2: Cloud Infrastructure on AWS**

✅ Requirements
* AWS Free-Tier account
* Terraform installed
* SSH Key pair (use ssh-keygen)

🔨 Terraform Setup (in terraform/ folder)

1. **Initialize & apply Terraform scripts**
   ```bash  
   cd terraform
   terraform init
   terraform apply

2. **Outputs:**

- EC2 instance with Ubuntu 20.04
- Open ports (SSH, 3000, 5000, 80)
- k3s auto-installed via provisioner

3. **SSH into your instance**
   ```bash
   ssh -i ~/.ssh/id_rsa ubuntu@<EC2_PUBLIC_IP>

4. **Deploy App on Kubernetes**
   ```bash
   scp -i ~/.ssh/id_rsa -r ../k8s ubuntu@<EC2_PUBLIC_IP>:~/k8s
   ssh ubuntu@<EC2_PUBLIC_IP>
   kubectl apply -f ~/k8s/

🔄 GitHub Actions: CI/CD Deployment
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

🌐 Accessing the App
Once deployed, you can access the app using your EC2 public IP on port 30000 (or whichever NodePort is used in your frontend service.yaml).

Example:
http://<EC2_PUBLIC_IP>:30000

👨‍💼 About Me
I'm a DevOps enthusiast building end-to-end workflows with cloud-native tools.
This project was built to simulate real-world DevOps pipelines and strengthen hands-on knowledge in CI/CD, containerization, Kubernetes, and cloud automation.
