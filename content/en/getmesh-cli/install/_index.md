---
title: "Install GetMesh and Istio"
date: 2021-01-25T13:00:00+07:00
description: "Installing getmesh and Istio"
# type dont remove or customize
type : "docs"
weight: 21
---

In this section, you'll learn how to install `getmesh` on your local client, and install an Istio distribution of your choice on a Kubernetes cluster:

1. [`getmesh`](./getmesh-install-and-update): Install `getmesh`, the TID tool that performs the management and maintenance of Istio instances.  A single `getmesh` instance can manage multiple Istio instances across multiple Kubernetes clusters.
1. [**Istio**](./install-istio): Use `getmesh` to discover which Istio variants can be deployed on your target cluster, select one and perform a safe, validated installation operation.
1. [**EKS Addon**](./install-istio/install-istio-in-eks-with-addon): On Amazon EKS, you don't need to use `getmesh` to install a Tetrate Istio distribution.  You can install directly from the AWS console, using the Tetrate Istio EKS Addon.
1. [**Validate the Install**](./post-install-validation): Once you've installed an Istio instance, you can use `getmesh` to check the install and validate the Istio configuration
