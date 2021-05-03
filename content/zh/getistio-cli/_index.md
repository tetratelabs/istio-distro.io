---
title: "GetIstio 概览"
icon: "ti-panel"
description: "了解更多关于 GetIstio CLI，如何安装和管理它。"
# type dont remove or customize
type : "docs"
weight: 1
# set these 2 to make it featured in homepage
featured: true
featureOrder: 1
---

GetIstio 是开始使用 Istio 最简单的方法，并确保您使用的是受信任和支持的 Istio 版本。安装和更新 GetIstio 非常简单，只需发出以下命令即可。

```sh
curl -sL https://dl.getistio.io/public/raw/files/download.sh | bash
```

### 为什么使用 CLI?

GetIstio CLI 简化了 Istio 的安装、管理和升级，使您可以最大限度地利用服务网格和开源的优势。

GetIsio CLI 工具满足企业级需求，因为它：

- 强制获取 Istio 的认证版本，并只允许安装 Istio 的兼容版本。
- 允许在多个 istioctl 版本之间无缝切换。
- 符合 FIPS 标准。
- 通过整合多个来源的验证库，提供基于平台的 Istio 配置验证。
- 使用一些云提供商证书管理系统来创建 Istio CA 证书，用于签署服务网格管理工作负载。
- 提供附加的与云提供商多个集成点。

对于企业生命周期和变更管理实践来说，Istio 的发布时间表可能非常激进。GetIstio 通过针对不同的 Kubernetes 发行版测试所有 Istio 版本的功能完整性来解决这一问题。GetIstio 的 Istio 版本积极支持安全补丁和其他 bug 更新，比上游 Istio 提供的支持寿命要长得多。

### 符合 FIPS 标准的版本

有些服务网格客户需要支持更高的安全要求。GetIstio 通过提供两种 Istio 发行版来解决合规性问题。

- *tetrate* 跟踪上游 Istio，并可能应用额外的补丁。
- *tetratefips* 是符合 FIPS 标准的版本。

上述功能是通过一种优雅的透明方法实现的，现有的设置和工具被充分利用，以提供额外的功能和企业所需的特性集和控制。

- GetIstio 连接到默认 Kubernetes 配置文件所指向的 Kubernetes 集群。如果设置了 KUBECONFIG 环境变量，则以其为优先。
- 配置验证是针对两个目标进行的。
  - 集群当前的配置，可能包含多个 Istio 配置结构
  - 此外，GetIstio 还验证了清单 yaml 文件（尚未应用于集群的文件）
- 为 Istio 创建 CA 证书时，假设已经设置好了发行中间 CA 证书的提供商。这是可选的，默认情况下，Istio 为工作负载证书提供自签名证书。
