---
title: "管理多个 istioctl"
date: 2021-01-25T13:00:00+07:00
description: "如何安装 Istio 和管理多个 istioctl。"
# type dont remove or customize
type : "docs"
---

下载并[安装](/getistio-cli/install-istio)了最新的 GetIstio 和 Istio 的可信版本后，我们建议使用 `getistio` 来调用 `istioctl`。我们建议始终使用 `getistio` 来调用 `istioctl`。GetIstio 可以轻松地在多个版本的 `istioctl` 之间切换，并进行版本兼容性和配置检查，以确保只部署经过认证的 Istio。

参考 [Istio 文档](https://istio.io/latest/docs/reference/commands/istioctl)，了解最新的 `istioctl` 命令和选项。

现实生活中的需求往往决定了使用不同版本的 `istioctl` (而不是最新版本) 或由于自定义配置而利用多个版本的 `istioctl`。下面介绍实现的步骤。

通过 GetIstio 使用 [show 命令](/getistio-cli/reference/getistio_show)列出当前下载的 Istio 版本。

```sh
getmesh show
```

Example output would be

```text
1.7.6-distro-v0
1.8.1-distro-v0
1.8.2-distro-v0 (Active)
```

如果还没有下载到所需的 Istio 版本，操作者可以先通过 [list 命令](/getistio-cli/reference/getistio_list)查询可信的 Istio 版本列表。

```sh
getmesh list
```

输出示例为：

```text
 ISTIO VERSION   FLAVOR  FLAVOR VERSION   K8S VERSIONS  
    *1.8.2       tetrate       0         1.16,1.17,1.18  
     1.8.1       tetrate       1         1.16,1.17,1.18  
     1.7.6       tetratefips   2         1.16,1.17,1.18  
     1.7.5       tetratefips   3         1.16,1.17,1.18  
     1.7.4       tetrate       0         1.16,1.17,1.18  
```

以下是利用 [fetch 命令](/getistio-cli/reference/getistio_fetch)获取 Istio 1.8.1 版本的例子。

```sh
getmesh fetch --version 1.8.1 --flavor tetrate --flavor-version 0 
```

在上面的例子中，`Flavor tetrate` 映射到上游 Istio，并添加了可能的补丁，`Flavor tetratefips` 是符合 FIPS 标准的 `Flavor tetrate` 版本。

使用 [show 命令](/getistio-cli/reference/getistio_show) `getmesh show` 交叉检查是否下载了 Istio 版本，输出将列出所有版本并标记活动版本。

```text
$ getmesh show
1.7.4-distro-v0
1.7.6-distro-v0
1.8.1-distro-v0 (Active)
1.8.2-distro-v0
```

要切换到不同版本的 istioctl，请运行 [switch 命令](/getistio-cli/reference/getistio_switch)，例如：

```sh
getmesh switch --version 1.8.1 --flavor tetrate --flavor-version=0
```

输出示例为：

```sh
istioctl switched to 1.8.1-tetrate-v0 now
```

