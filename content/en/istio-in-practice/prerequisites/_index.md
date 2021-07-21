---
title: Prerequisites
date: 2021-01-01T11:02:05+06:00
draft: false
weight: 1
---

To go through the Istio in practice tutorials we will need a running instance of a Kubernetes cluster and Istio.

## 1. Kubernetes Cluster

All cloud providers have managed Kubernete scluster offering we can use to install Istio service mesh.

We can also run a Kubernetes cluster locally on your computer using one of the following platforms:

- [Minikube](https://istio.io/latest/docs/setup/platform-setup/minikube/)
- [Docker Desktop](https://istio.io/latest/docs/setup/platform-setup/docker/)
- [kind](https://istio.io/latest/docs/setup/platform-setup/kind/)
- [MicroK8s](https://istio.io/latest/docs/setup/platform-setup/microk8s/)

When using a local Kubernetes cluster, make sure your computer meets the minimum requirements for Istio installation (e.g. 16384 MB RAM and 4 CPUs). Also, ensure the Kubernetes cluster version is v1.19.0 or higher.

### Install Kubernetes CLI

If you need to install the Kubernetes CLI, follow [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

We can run `kubectl version` to check if the CLI is installed. You should see the output similar to this one:

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.2", GitCommit:"f5743093fd1c663cb0cbc89748f730662345d44d", GitTreeState:"clean", BuildDate:"2020-09-16T21:51:49Z", GoVersion:"go1.15.2", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.0", GitCommit:"e19964183377d0ec2052d1f1fa930c4d7575bd50", GitTreeState:"clean", BuildDate:"2020-08-26T14:23:04Z", GoVersion:"go1.15", Compiler:"gc", Platform:"linux/amd64"}
```

## 2. Install Istio with Tetrate Istio Distro

Tetrate Istio Distro is the easiest way to get started with Istio. After you've set up your Kubernetes cluster, you can download [Tetrate Istio Distro](https://istio.tetratelabs.io):

```sh
curl -sL https://istio.tetratelabs.io/getmesh/install.sh | bash
```

Finally, to install the demo profile of Istio, use the following command:

```sh
getmesh istioctl install --set profile=demo
```

## 3. Label the namespace for Istio sidecar injection

We need to label the namespace where we want Istio to inject the sidecar proxies to Kubernetes deployments automatically.

To label the namepace, we can use the `kubectl label` command and label the namespace (`default` in our case) with a label called `istio-injection=enabled`:

```sh
kubectl label namespace default istio-injection=enabled
```

## 4. Install Hello world application (OPTIONAL)

As a sample to deploy on your cluster, you can use the Hello World Web application. You can pull the image from `gcr.io/tetratelabs/hello-world:1.0.0`, and use the commands below to create a Kubernetes deployment and Service.

```sh
kubectl create deploy helloworld --image=gcr.io/tetratelabs/hello-world:1.0.0 --port=3000
```

Copy the below YAML to `helloworld-svc.yaml` and deploy it using `kubectl apply -f helloworld-svc.yaml`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: helloworld
  labels:
    app: helloworld
spec:
  ports:
    - name: http
      port: 80
      targetPort: 3000
  selector:
    app: helloworld
```

To access the service from an external IP, we also need a Gateway resource:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: public-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - '*'
```

Save the above YAML to `gateway.yaml` and deploy it using `kubectl apply -f gateway.yaml`.

We can now access the deployed Hello World web application through the external IP address. You can get the IP address using this command:

```sh
kubectl get svc istio-ingressgateway -n istio-system  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```
