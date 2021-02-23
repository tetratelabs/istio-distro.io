---
title: "getistio"
url: /zh/getistio-cli/reference/getistio/
---

GetIstio 是一个 Istio 集成和生命周期管理的命令行工具，它可以确保使用 Istio 的支持和可信版本。

#### 选项

```
  -h, --help                help for getistio
  -c, --kubeconfig string   Kubernetes configuration file
```

#### 参考

* [getistio check-upgrade](/zh/getistio-cli/reference/getistio_check-upgrade/)：检查当前次要版本中是否有可用的补丁、
* [getistio config-validate](/zh/getistio-cli/reference/getistio_config-validate/)：验证集群中当前的 Istio 配置。
* [getistio fetch](/zh/getistio-cli/reference/getistio_fetch/)：在 `getistio list` 命令中获取指定版本的 istioctl。
* [getistio gen-ca](/zh/getistio-cli/reference/getistio_gen-ca/)：生成中间 CA。
* [getistio istioctl](/zh/getistio-cli/reference/getistio_istioctl/)：使用指定参数执行 istioctl。
* [getistio list](/zh/getistio-cli/reference/getistio_list/)：由 Tetrate 构建的可用 Istio 发行版列表。
* [getistio prune](/zh/getistio-cli/reference/getistio_prune/)：移除已安装的特定 istioctl，或全部，除了活动的那个。
* [getistio show](/zh/getistio-cli/reference/getistio_show/)：显示获取的 Istio 版本。
* [getistio switch](/zh/getistio-cli/reference/getistio_switch/)：将活动的 istioctl 切换到指定的版本。
* [getistio update](/zh/getistio-cli/reference/getistio_update/)：更新 getistio 本身到最新版本。
* [getistio version](/zh/getistio-cli/reference/getistio_version/)：显示 GetIstio CLI 的版本，运行中的 Istiod、Envoy 和活动的 istioctl。

