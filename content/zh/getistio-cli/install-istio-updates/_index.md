---
title: "安装 Istio 更新"
date: 2021-01-25T13:00:00+07:00
description: "详细的 Istio 更新说明。"
# type dont remove or customize
type : "docs"
---
通过 GetIstio 交付的 Istio 版本比上游版本的支持时间更长，并且会主动为关键的错误修复和安全更新打补丁。要检查你运行的 Istio 版本是否是最新的，或者是否缺少任何关键的安全补丁，请运行 [check-upgrade 命令](/getistio-cli/reference/getistio_check-upgrade)。该命令连接到集群（由 Kubernetes 配置定义），以验证现有的 Istio 安装，将这些安装与最新的可用 GetIstio 认证版本进行比较，并推荐建议的升级。要检查升级，请运行：

```sh
getistio check-upgrade
```

输出将是类似于：

```text
$ getistio check-upgrade
[Summary of your Istio mesh]
active istioctl version: 1.8.1-tetrate-v0
data plane version: 1.8.2-tetrate-v0 (2 proxies)
control plane version: 1.8.2-tetrate-v0

[GetIstio Check]
- 1.8.2-tetrate-v0 is the latest version in 1.8-tetrate
```