---
title: "FAQ"
date: 2018-12-28T11:02:05+06:00
icon: "ti-settings" # themify icon pack : https://themify.me/themify-icons
description: "Tetrate Istio Distro 常见问题。"
# type dont remove or customize
type : "docs"
weight: 8
---

##### Tetrate Istio Distro 是什么？

今天，我们推出了 Tetrate Istio Distro，这是一个 Istio 上游组件的发行版，经过 Tetrate 的测试、优化、保护和支持。Tetrate Istio Distro 为不同的 Kubernetes 环境提供经过审核的 Istio 原生版本，使 Istio 生命周期管理变得简单而安全。初始版本已通过 EKS、EKS-D 的审核，并提供与 AWS KMS 的本地集成。我们将逐步增加对新的 Kubernetes 版本和新的 KMS 后端的支持。Tetrate Istio Distro 将根据其支持政策支持最新的 3 个版本，并为 FedRAMP 环境提供符合 FIPS 标准的 Istio 版本。

##### 为什么使用 Tetrate Istio Distro？

如果您正在采用 Istio，并且需要一个可靠、安全的发行版来运行在 AWS、Azure 或 GCP 环境中，您应该使用 Tetrate Istio Distro。

##### 它是免费的吗？

是的。Tetrate Istio Distro 是一个免费（如语音和啤酒）的开源项目，我们欢迎社区参与和贡献。

##### Tetrate Istio Distro 的支持版本有哪些？

请点击 Github 项目上的支持平台页面。

##### Tetrate Istio Distro 有哪些不同的组件，与上游的 Istio 相比如何？

Tetrate Istio Distro 是上游 Istio 的发行版，它由一个 CLI、一个代理和集成 API 组成。 更多细节请查看 [Tetrate Istio Distro CLI 命令参考](/getmesh-cli/reference/getmesh)、[Cert 集成](/istio-ca-certs-integrations) 和[安全补丁](/download)。

##### 我正在使用 Istio OSS，如何切换到 getmesh？

Tetrate Istio Distro 是 Istio 的上游发行版。

##### 我是 Istio 的新手，应该从何处着手？

我们建议你从 Tetrate Istio Distro 的经审核的环境开始。你可以安心地使用 Isito 的所有功能。

##### 我是一个平台管理员，试图在我的组织中简化 Istio 二进制文件。我应该如何使用 Tetrate Istio Distro？

有多种方法可以利用 Tetrate Istio Distro。请参考[命令参考](/getmesh-cli/reference/getmesh)和[教程](/istio-tutorials)。

##### 我如何知道我的 Istio 是否有 CVE？

如果您已经[订阅了社区更新](/)，Tetrate Istio Distro 将通知您 CVE 和零日漏洞。

##### Tetrate Istio Distro 可以帮助我升级 Istio 吗？

可以，Tetrate Istio Distro 可以帮助我升级 Istio。Tetrate Istio Distro 可以通过 getmesh 升级命令实现无缝升级。

#### 项目概述

##### 你们是在创建 Istio 项目的分叉吗？

不，我们不是在创建 Istio 项目的分叉。我们是在创建一个上游的发行版。我们对 Istio 的任何改进都会在上游进行。

##### Tetrate Istio Distro 是否会影响我的应用程序的性能，影响的方式是什么？

不会。作为上游发行版，Tetrate Istio Distro 对 Istio 的性能没有影响。

##### 你们计划多长时间从上游 Istio 项目中为 Tetrate Istio Distro 添加一次新功能？

一旦上游 Istio 有新版本，Tetrate Istio Distro 会尽快提供新版本的 Istio。

##### 我如何申请 Tetrate Istio Distro 的新功能？

我们的路线图是公开的。请创建一个功能请求，并对路线图上的功能进行投票。

##### 我们可以为 Tetrate Istio Distro 的工作做贡献吗？

是的，Tetrate Istio Distro 是开源的，并且采用 Apache 许可证。您可以对 Tetrate Istio Distro 的任何组件做出[贡献](/community/building-and-testing)。