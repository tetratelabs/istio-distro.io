---
title: "Install Istio on Azure AKS"
date: 2022-12-12T22:00:40+0700
description: "How to deploy Istio on AKS (step by step instruction)"
weight: 18
---

Azure Container Marketplace also the deployment of Tetrate Istio Distro (TID) on existing AKS clusters, or allows to create Azure AKS cluster with pre-installed TID. (TID is also listed in [Azure Stack HCI Catalog](https://azurehybridpartner.com/isv) as tested and validated Solution).

- Start by selecting the [Tetrate Istio Distro](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/tetrate1598353087553.tetrateistio?tab=Overview) offer on the Azure Marketplace.

![Alt text](./1_AKS_Deploy.png "Azure HCI catalog screen")

- Then choose a plan (the list is constantly changing as newer versions are released):

![Alt text](./2_AKS_Deploy.png "Selecting distro")

- Select between existing cluster and a new cluster creation. Enter the basic info on the first page per figure below:

![Alt text](./3_AKS_Deploy.png "Type of installation and Azure details")

- Select AKS cluster name and Kubernetes version, also the cluster attributes:

![Alt text](./4_AKS_Deploy.png "AKS Cluster Details")

- Let Azure to validate your settings and proceed with cluster creation:

![Alt text](./5_AKS_Deploy.png "Validating settings")

- After the cluster is created, you can begin provisioning your application and Istio will automatically onboard and connect your services:

![Alt text](./6_AKS_Deploy.png "Selecting distro")

When the cluster Deployment is completed - you can proceed with deploying applications in Istio-enabled AKS cluster.
