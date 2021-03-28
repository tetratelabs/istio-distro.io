---
title: "Cert Manager"
date: 2021-01-25T13:00:00+07:00
description: "在 Istio 中集成 Cert Manager。"
---

> 这篇文章最初发表在 [Istio 官方文档](https://istio.io/latest/docs/ops/integrations/certmanager/)。

[cert-manager](https://cert-manager.io/) 是一个自动管理证书的工具。它可以与 Istio 网关集成，管理 TLS 证书。

## 配置

请查阅 [cert-manager 安装文档](https://cert-manager.io/docs/installation/kubernetes/)以开始使用。无需特殊更改即可与 Istio 一起使用。

## 用法

### Istio Gateway

cert-manager 可以用于向 Kubernetes 写入机密，然后网关可以引用它。首先`Certificate`，请按照[cert-manager 文档](https://cert-manager.io/docs/usage/certificate/)配置资源。本`Certificate`应在相同的命名空间创建`istio-ingressgateway`部署。例如，a`Certificate`可能看起来像：

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: ingress-cert
  namespace: istio-system
spec:
  secretName: ingress-cert
  commonName: my.example.com
  dnsNames:
  - my.example.com
  ...
```

一旦我们创建了证书，我们应该看到在 `istio-system` 命名空间中创建的 secret。然后，这可以在 tls 配置中，在 `credentialName` 下的 Gateway 中引用：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: ingress-cert # 这应该与证书的 secretName 相匹配。
    hosts:
    - my.example.com # 这应该与证书中的 DNS 名称相匹配。
```

### Kubernetes Ingress

cert-manager 通过在 [Ingress 对象上](https://cert-manager.io/docs/usage/ingress/)配置[注释](https://cert-manager.io/docs/usage/ingress/)来提供与 Kubernetes Ingress 的直接集成。如果使用此方法，则 Ingress 必须位于与 `istio-ingressgateway` 部署相同的命名空间中，因为 secret 只能在同一命名空间中读取。

或者，`Certificate` 可以按照 [Istio Gateway ](#istio-gateway)所述创建一个，然后在该 `Ingress` 对象中引用：

```yaml
apiVersion: networking.k8s.io/v1beta1
Kind: Ingress
metadata:
  name: ingress
  annotations:
    kubernetes.io/ingress.class: istio
spec:
  rules:
  - host: my.example.com
    http: ...
  tls:
  - hosts:
    - my.example.com # 这应该与证书中的 DNS 名称相匹配。
    secretName: ingress-cert # 这应该与证书的 secretName 相匹配。
```