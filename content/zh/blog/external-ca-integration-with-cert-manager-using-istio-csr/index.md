---
title: "使用 istio-csr 将外部 CA 与证书管理器集成"
date: "2021-02-09"
author: "[张之晗](https://github.com/ZhiHanZ)"
# page title background image
bg_image: "images/backgrounds/page-title.jpg"
# meta description
description : "这篇博客将展示如何使用 istio-csr 扩展将 cert-manager 作为外部 CA 集成到你的 Istio 服务网格。 "
# tags
tags : ["security"]
# thumbnail
thumbnail: "/images/blog/security.jpg"
---
在本文中，我将展示如何使用 [istio-csr](https://github.com/cert-manager/istio-csr) 扩展将 [cert-manager](https://cert-manager.io/) 作为外部 CA 集成到 Istio 服务网格中。

### 背景

对于密钥和证书管理，Istio 在 `istiod` 控制平面内使用其自己的证书颁发机构（CA）。

在这里，我们将使用 [cert-manager](https://cert-manager.io/) 设置的 Issuer 作为[外部 CA](https://getistio.io/istio-ca-certs-integrations/)，使用 Istio CSR API 签署工作负载证书，并将 CSR 请求直接从工作负载传递到外部 CA。

### 搭建环境

我们使用 Kubernetes 1.18 和 Istio 1.8 进行了此演示：

1. 使用 minikube 部署 Kubernetes 集群（> = 1.16）。

   ```sh
   minikube start --memory=10000 --cpus=4 --kubernetes-version=1.18.6
   ```

2. 安装 helm3 以进行证书管理器 CRD 安装。

   ```sh
   curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | sh
   ```

3. 安装 GetIstio 并获取 Istio。

   ```sh
   curl -sL https://dl.getistio.io/public/raw/download.sh | sh
   getistio fetch
   ```

### 部署证书管理器

在 cert-manager 名称空间中安装 cert-manager。

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

### 配置证书管理者颁发者

虽然我们可以使用 cert-manager 连接多个发行商，但在本示例中，我们将配置 cert-manager 创建一个自签名 CA 来颁发工作负载证书。该 `istio-ca`  secret 将持有 CA 密钥 / 证书对。

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

### 部署 istio-csr 代理以进行证书管理

`istio-csr` 通过官方 helm chart 进行部署。它将使用名为的证书 `istio-ca` 来生成 `istio-ca` 工作负载证书和验证的 secret。

```sh
helm repo add https://chart.jetstack.io
helm repo update
helm install -n cert-manager cert-manager-istio-csr jetstack/cert-manager-istio-csr
```

该代理还创建一个 secret `istod-tls`，该 secret 持有 tls 证书/密钥，以便 istiod 服务 XDS。此新创建的证书由 `istio-ca` 签署。

### 安装和配置 Istio

初始化 Istio operator。

```sh
getistio istioctl operator init
```

在 `operator yaml` 中配置：

- 配置工作负载的外部 CA 地址
- 禁用 isidod 作为 CA 服务器
- 提供来自 cert-manager 的 istiod 的 TLS 证书

```yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: istio-operator-csr
spec:
  profile: "demo"
  hub: tetrate-docker-getistio-docker.bintray.io
  values:
    global:
      # 将 istio 代理的证书提供者改为 cert-manager。
      caAddress: cert-manager-istio-csr.cert-manager.svc:443
  components:
    pilot:
      k8s:
        env:
          # 禁用 istiod CA Sever 功能。
        - name: ENABLE_CA_SERVER
          value: "false"
        overlays:
        - apiVersion: apps/v1
          kind: Deployment
          name: istiod
          patches:

            # 使用 secret 挂载 Istio 服务和 webhook 证书。
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

您可以通过以下命令对 `istio-system` 命名空间的所有 `cert-manager` 证书进行验证。

```sh
kubectl get certificates -n istio-system
NAME       READY   SECRET       AGE
istio-ca   True    istio-ca     16m
istiod     True    istiod-tls   16m
```

### 部署应用

这里我们部署了一个简单的证书验证工作负载。

```sh
kubectl create ns foo
kubectl label ns foo istio-injection=enabled
kubectl apply -f samples/sleep/sleep.yaml -n foo

kubectl get pods -n foo
NAME                    READY   STATUS    RESTARTS   AGE
sleep-8f795f47d-vv6hx   2/2     Running   0          42s
```

### 验证为工作负载发出的 mTLS 证书

工作负载运行后，我们可以使用 `istioctl proxy-config` 命令检查 SDS 中的 secret。

```sh
getistio istioctl pc secret sleep-8f795f47d-vv6hx.foo -o json > proxy_secret
```

检查一下 `proxy_secret`。应该有一个名为 `ROOTCA` 的字段，在 `ROOTCA` 中应该有一个由cert-manager `istio-ca` 签署的 `trustedCA` 字段。

比较 `trustedCA` 中的 base64 值和 `istio-system` 中的 `istio-ca`  secret `ca.crt`。这两个值应该是一样的。

```sh
kubectl get secrets -n istio-system istio-ca -o json > istio-ca
```

### 总结

本文演示了如何将 cert-manager 作为 Istio 服务网格的外部 CA 进行集成。当服务网格在 Day 2实施阶段被引入时，cert-manager/服务网格的集成可以在不同的云中成功实施，并使用 cert-manager 的全新或现有部署。最后，您将获得两个世界中最好的东西：Istio 与您所选择的外部 CA 的集成。
