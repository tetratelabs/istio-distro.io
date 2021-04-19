---
title: "安装和更新 GetIstio"
date: 2021-01-25T13:00:00+07:00
description: "如何安装和跟新 GetIstio。"
# type dont remove or customize
type : "docs"
---

GetIstio 可以通过以下命令获得。

```sh
curl -sL https://dl.getistio.io/public/raw/download.sh | bash
```

默认情况下，这将下载最新版本的 GetIstio 和认证的 Istio。要检查下载是否成功，运行  [version 命令](/getistio-cli/reference/getistio_version)。

```sh
getistio version
```

或者

```sh
getistio version --remote=false #只有客户端版本的详细信息
```

以下表格的输出表明 GetIstio 已成功安装。

```text
getistio version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
```

要查看 GetIstio 及其支持的功能的可用命令列表，运行 [help 命令](/getistio-cli/reference/getistio_help)。

```sh
getistio --help
```

下载 GetIstio 后，可以通过运行 [update 命令](/getistio-cli/reference/getistio_update)自我更新到最新版本。

```sh
getistio update
```

虽然我们建议始终使用最新的 GetIstio，但如果用户出于测试或其他原因想下载不同版本的GetIstio，可以使用以下命令。


```sh
export GETISTIO_VERSION=<your_version> # 比如说0.5.0
curl -sL https://dl.getistio.io/public/raw/download.sh | bash
```

这将把现有的 GetIstio 版本覆盖到刚刚下载的版本。

