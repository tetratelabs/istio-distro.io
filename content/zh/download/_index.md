---
title: "下载"
date: 2018-12-28T11:02:05+06:00
icon: "ti-credit-card" # themify icon pack : https://themify.me/themify-icons
description: "下载列表。"
# type dont remove or customize
type : "docs"
---

目前 **GetIstio** 可以运行在 Linux 和 MacOS 上，要部署 GetIstio，你只需要一个简单的命令：

```sh
curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
```

请按照 [GetIstio 安装和更新页面](/getistio-cli/install-and-update-of-getistio)，了解下载和后续步骤的详细说明，以使 GetIstio 在您的机器上运行。

## 支持的 Istio 版本

GetIstio 跟踪 Istio 上游版本。作为 GetIstio 构建管道的一部分，我们会运行一系列测试以确保 Istio 发行版在底层 Kubernetes 平台上运行良好。

GetIstio 认证的 Istio 发行版已经针对以下 Kubernetes 发行版进行了测试。

- EKS - 1.18, 1.17, 1.16
- GKE - 1.18, 1.17, 1.16
- AKS - 1.18, 1.17, 1.16

目前正在进行添加其他 Kubernetes 发行版和最新版本 Kubernetes 的工作。

虽然 Istio 的核心功能已经在不同的 Kubernetes 发行版上进行了测试和认证，但建议用户认识到，Istio 的某些功能规定了最低的 Kubernetes 版本（例如，Kubernetes CSR API 签署 Istio 工作负载需要 Kubernetes 1.18+），而某些其他功能则需要设置特定的供应商配置（例如，启用 Istio CNI 插件）。

你可以在本页找到其他下载的 Istio 发行版和 istioctl 二进制文件，适用于 Linux、MacOS 和 Windows。我们建议使用 GetIsio 来获取所需文件。

{{< versions_supported >}}

### Istio 二进制下载

#### Linux Istio 发行版

以下是获取 Istio 和 istioctl 发行版的链接。

{{< downloads linux >}}

#### MacOSS Istio 发行版

以下是获取 Istio 和 istioctl 发行版的链接。

{{< downloads osx >}}

#### Windows Istio 发行版

以下是获取 Istio 和 istioctl 发行版的链接。

{{< downloads windows >}}