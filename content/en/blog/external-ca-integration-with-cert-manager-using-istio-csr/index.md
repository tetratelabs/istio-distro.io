---
title: "External CA integration with cert-manager using istio-csr"
date: "2021-02-09"
author: "[Zhihan Zhang](https://github.com/ZhiHanZ)"
# page title background image
bg_image: "images/backgrounds/page-title.jpg"
# meta description
description : "This blog will show how to integrate cert-manager as an external CA to your Istio service mesh using istio-csr extension. "
# tags
tags : ["security"]
# thumbnail
thumbnail: "/images/blog/security.jpg"
---
In this article we at Tetrate will show how to integrate [cert-manager](https://cert-manager.io/) as an external CA to your Istio service mesh using [istio-csr ](https://github.com/cert-manager/istio-csr)extension. 

###  Background

For key and certificate management, Istio is using its own Certificate Authority (CA) inside `istiod` control plane.

Here, we would use the [cert-manager ](https://cert-manager.io/)provisioned Issuer as the [external CA](https://istio.tetratelabs.io/istio-ca-certs-integrations/) to sign the workload certificates using Istio CSR API with the CSR request directly going from the workloads to the external CA.

### Setting up the Environment

We performed this demo using Kubernetes 1.18 and Istio 1.8:

1. Deploy Kubernetes cluster(>=1.16) with minikube.

   ```sh
   minikube start --memory=10000 --cpus=4 --kubernetes-version=1.18.6
   ```

2. Install helm3 for cert-manager CRD installation.

   ```sh
   curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | sh
   ```

3. Install GetMesh and fetch Istio.

   ```sh
   curl -sL https://istio.tetratelabs.io/getmesh/install.sh | sh
   getmesh fetch
   ```

### Deploy cert-manager

Install cert-manager in cert-manager namespace.

```sh
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.1.0 \
  --set installCRDs=true
```

### Configure cert-manager Issuer

While we could use cert-manager to connect with several Issuers, in this example we would configure cert-manager to create a self-signed CA to issue workload certificates. The `istio-ca` secret would hold the CA key/cert pair.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: istio-ca
spec:
  isCA: true
  duration: 2160h # 90d
  secretName: istio-ca
  commonName: istio-ca
  subject:
    organizations:
    - cluster.local
    - cert-manager
  issuerRef:
    name: selfsigned
    kind: Issuer
    group: cert-manager.io
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: istio-ca
spec:
  ca:
    secretName: istio-ca
```

```sh
kubectl create ns istio-system
kubectl apply -f https://raw.githubusercontent.com/cert-manager/istio-csr/master/hack/demo/cert-manager-bootstrap-resources.yaml -n istio-system
```

### Deploy istio-csr agent for cert-manager

Deploy `istio-csr` through official helm chart. It will use a certificate named `istio-ca` to generate `istio-ca` secret for workload certificate and verification.

```sh
helm repo add https://chart.jetstack.io
helm repo update
helm install -n cert-manager cert-manager-istio-csr jetstack/cert-manager-istio-csr
```

This agent also creates a secret `istod-tls` which holds the tls cert/key for istiod to serve XDS. This newly created cert is signed by `istio-ca`.

### Install and Configure Istio

Initialize Istio operator.

```sh
getmesh istioctl operator init
```

Configure on the `operator yaml`.

- Configure External CA address for workloads
- Disable istiod as the CA Server
- provide TLS certs for istiod from cert-manager

```yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: istio-operator-csr
spec:
  profile: "demo"
  hub: containers.istio.tetratelabs.com
  values:
    global:
      # Change certificate provider to cert-manager istio agent for istio agent
      caAddress: cert-manager-istio-csr.cert-manager.svc:443
  components:
    pilot:
      k8s:
        env:
          # Disable istiod CA Sever functionality
        - name: ENABLE_CA_SERVER
          value: "false"
        overlays:
        - apiVersion: apps/v1
          kind: Deployment
          name: istiod
          patches:

            # Mount istiod serving and webhook certificate from Secret mount
          - path: spec.template.spec.containers.[name:discovery].args[7]
            value: "--tlsCertFile=/etc/cert-manager/tls/tls.crt"
          - path: spec.template.spec.containers.[name:discovery].args[8]
            value: "--tlsKeyFile=/etc/cert-manager/tls/tls.key"
          - path: spec.template.spec.containers.[name:discovery].args[9]
            value: "--caCertFile=/etc/cert-manager/ca/root-cert.pem"

          - path: spec.template.spec.containers.[name:discovery].volumeMounts[6]
            value:
              name: cert-manager
              mountPath: "/etc/cert-manager/tls"
              readOnly: true
          - path: spec.template.spec.containers.[name:discovery].volumeMounts[7]
            value:
              name: ca-root-cert
              mountPath: "/etc/cert-manager/ca"
              readOnly: true

          - path: spec.template.spec.volumes[6]
            value:
              name: cert-manager
              secret:
                secretName: istiod-tls
          - path: spec.template.spec.volumes[7]
            value:
              name: ca-root-cert
              configMap:
                secretName: istiod-tls
                defaultMode: 420
                name: istio-ca-root-cert
```

You could validate on all cert-manager certs in `istio-system` namespace through the following command.

```sh
kubectl get certificates -n istio-system
NAME       READY   SECRET       AGE
istio-ca   True    istio-ca     16m
istiod     True    istiod-tls   16m
```

### Deploy application

Here we deploy a simple workload for certificate verification.

```sh
kubectl create ns foo
kubectl label ns foo istio-injection=enabled
kubectl apply -f samples/sleep/sleep.yaml -n foo

kubectl get pods -n foo
NAME                    READY   STATUS    RESTARTS   AGE
sleep-8f795f47d-vv6hx   2/2     Running   0          42s
```

### Validate mTLS certs issued for workloads

After the workload is running, we could check on the secret in SDS using the istioctl proxy-config command.

```sh
getmesh istioctl pc secret sleep-8f795f47d-vv6hx.foo -o json > proxy_secret
```

Check on the proxy_secret. There should be a field named `ROOTCA` and in `ROOTCA` there should be a field `trustedCA` which is signed by cert-manager `istio-ca`.

Compare the base64 value in `trustedCA` with the `istio-ca` secret `ca.crt` located in `istio-system`. Those two should be the same.

```sh
kubectl get secrets -n istio-system istio-ca -o json > istio-ca
```

### Summary

This article demonstrates how to integrate cert-manager as an external CA for Istio service mesh. The cert-manager/service mesh integration can be successfully implemented in different clouds with brand-new or existing deployments of cert-manager, when the service mesh is introduced during Day 2 implementations stage. In the end, you're getting the best of two worlds: Istio integrating with an external CA of your choice!
