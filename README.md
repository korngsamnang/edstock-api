# EdStock API Deployment Guide

## Overview

EdStock API is a backend service that manages product stock, expenses, and sales data. This repository contains all necessary configurations and scripts to deploy the API to an AWS EKS cluster using Jenkins and Kubernetes.

## Repository Structure

```bash
└── 📁edstock-api
    ├── 📁k8s                # Kubernetes deployment files
    │   ├── api-deployment.yaml
    │   ├── api-service.yaml
    │   ├── secrets.yaml
    ├── 📁prisma             # Database schema and migrations
    │   ├── 📁migrations
    │   ├── schema.prisma
    │   ├── seed.ts
    ├── 📁src                # API source code
    │   ├── app.ts
    │   ├── 📁controllers
    │   ├── 📁routes
    ├── Dockerfile           # Docker build instructions
    ├── Jenkinsfile          # Jenkins pipeline for CI/CD
    ├── package.json         # Node.js dependencies
    ├── tsconfig.json        # TypeScript configuration
```

## Prerequisites

Before deploying the EdStock API, ensure you have the following:

-   AWS Account with IAM permissions for EKS and ECR
-   Jenkins server configured with necessary credentials
-   AWS CLI and kubectl installed
-   Docker installed on the Jenkins agent

## Deployment Process

### 1. GitHub Webhook for Automatic Deployment

This project is configured to automatically deploy whenever a new commit is pushed to the repository.

Webhook Configuration:

1. In your GitHub repository, go to Settings > Webhooks.
2. Click Add webhook.
3. Set the Payload URL to `http://<JENKINS-IP>:8080/github-webhook/`.
4. Choose application/json as the Content type.
5. Select Just the push event.
6. Click Add webhook.

Jenkins Configuration:

1. In Jenkins, install the GitHub Plugin if not already installed.
2. Go to your Jenkins job, then Configure.
3. Under Build Triggers, enable Poll SCM and GitHub hook trigger for GITScm polling.
4. Save the configuration.

With this setup, Jenkins will automatically trigger a build whenever changes are pushed to the GitHub repository.

### 2. Build and Push Docker Image

Jenkins automates the process of building and pushing the API image to AWS ECR.

-   The Jenkinsfile defines the pipeline steps:
    1. Checkout the latest code
    2. Generate a unique image tag
    3. Authenticate with AWS ECR
    4. Build and push the Docker image

### 3. Deploy to EKS

-   The pipeline updates the Kubernetes deployment with the new image:

    1. Configure kubectl to connect to the EKS cluster
    2. Apply Kubernetes secrets
    3. Deploy the new API version to the cluster
    4. Update the deployment image

## Accessing the Application

The API is exposed using a Kubernetes LoadBalancer service. Once deployed, retrie

```bash
kubectl get services api-service
```

You can access the API via the LoadBalancer's external IP:

```bash
curl http://<EXTERNAL-IP>/health
```

## Post-Deployment Verification

After deployment, verify the application is running:

-   Check running pods:

```bash
kubectl get pods
```

-   Check logs:

```bash
kubectl logs -l app=api
```
