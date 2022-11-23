---
title: "Install Istio in EKS"
date: 2021-04-19T13:00:00+07:00
description: "How to install Istio in Amazon EKS."
# type dont remove or customize
weight: 2
type : "docs"
---
To install Istio in EKS, you will need to set up the Kubernetes context before.

If you create your cluster from the command line, Kubernetes context will be automatically set. Download and configure [ekscli](https://aws.amazon.com/blogs/opensource/eksctl-eks-cluster-one-command/) and [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html). Now create your cluster. For example:

```sh
eksctl create cluster --nodes 3
```

This will deploy a EKS cluster with three nodes on it in your default region.

If you have created your cluster using AWS web UI, you are going to need to set the context manually. Ensure your [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) is properly configured. Then, run the following command:


```sh
aws eks --region <region-code> update-kubeconfig --name <cluster_name>
```

Where <region-code> is the region where you have deployed your cluster and <cluster_name> is the name of your cluster.

Verify your cluster if properly configure in your system:

```sh
$ kubectl get svc
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.100.0.1   <none>        443/TCP   3d18h
```


When your Kubernetes context is set you are ready to [use EKS add-on](/getmesh-cli/install-istio/install-istio-in-eks-with-addon/) or [install Istio using CLI](/getmesh-cli/install-istio/).
