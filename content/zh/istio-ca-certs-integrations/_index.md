---
title: "Istio CA Certs 集成"
date: 2021-01-25T13:00:00+07:00
description: "GCP CAS 集成"
# type dont remove or customize
type : "docs"
weight: 3
---

Istio 提供了不同的机制来签署 mTLS 功能的工作负载证书。如：

1. Istio CA 使用自签的根证书。
2. Istio CA 使用管理员指定的证书和密钥以及管理员指定的根证书。
3. 自定义 CA 发行的密钥和证书文件安装到 sidecar 上。 
4. 实验性自定义 CA 集成使用 Kubernetes CSR API（Kubernetes 1.18+）。
5. 外部 CA 使用 Istio CA gRPC API（通过 Istiod RA 模型或直接验证工作负载和验证 SAN）。

GetMesh 与 AWS 证书管理器、GCP 证书授权服务（CAS）和 cert-manager 的私有 CA 集成，以签署工作负载证书。