---
title: Prerequisites
date: 2021-01-01T11:02:05+06:00
draft: false
weight: 1
---

To go through the Istio in practice tutorials we will need a running instance of a Kubernetes cluster and Istio.

#### 1. Kubernetes Cluster

All cloud providers have managed Kubernete scluster offering we can use to install Istio service mesh.

We can also run a Kubernetes cluster locally on your computer using one of the following platforms:

- [Minikube](https://istio.io/latest/docs/setup/platform-setup/minikube/)
- [Docker Desktop](https://istio.io/latest/docs/setup/platform-setup/docker/)
- [kind](https://istio.io/latest/docs/setup/platform-setup/kind/)
- [MicroK8s](https://istio.io/latest/docs/setup/platform-setup/microk8s/)

When using a local Kubernetes cluster, make sure your computer meets the minimum requirements for Istio installation (e.g. 16384 MB RAM and 4 CPUs). Also, ensure the Kubernetes cluster version is v1.19.0 or higher.

##### Install Kubernetes CLI

If you need to install the Kubernetes CLI, follow [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

We can run `kubectl version` to check if the CLI is installed. You should see the output similar to this one:

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.2", GitCommit:"f5743093fd1c663cb0cbc89748f730662345d44d", GitTreeState:"clean", BuildDate:"2020-09-16T21:51:49Z", GoVersion:"go1.15.2", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.0", GitCommit:"e19964183377d0ec2052d1f1fa930c4d7575bd50", GitTreeState:"clean", BuildDate:"2020-08-26T14:23:04Z", GoVersion:"go1.15", Compiler:"gc", Platform:"linux/amd64"}
```

#### 2. Install Istio with GetIstio 

GetIstio is the easiest way to get started with Istio. After you've set up your Kubernetes cluster, you can download [GetIstio](https://getistio.io):

```sh
curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
```

Finally, to install the demo profile of Istio, use the following command:

```sh
getistio istioctl install --set profile=demo
```