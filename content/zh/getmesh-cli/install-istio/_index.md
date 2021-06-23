---
title: "安装 Istio"
date: 2021-01-25T13:00:00+07:00
description: "如何使用 GetIstio CLI 安装 Istio。"
# type dont remove or customize
type : "docs"
---
GetIstio 默认与你的 Kubernetes 配置所定义的集群进行通信。在继续之前，请确保你连接到了正确的集群。

要安装 Istio 的 demo profile，可以使用 [`getmesh istioctl`](/getistio-cli/reference/getistio_istioctl) 命令来完成。

```sh
getmesh istioctl install --set profile=demo
```

输出：

```text
$ getmesh istioctl install --set profile=demo
This will install the Istio demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) Y
✔ Istio core installed
✔ Istiod installed
✔ Ingress gateways installed
✔ Egress gateways installed
✔ Installation complete </pre>
Once this step is completed, the validation can be done by confirming the GetIstio and Istio versions installed, using the [version command](/getistio-cli/reference/getistio_version):
```

```sh
getmesh version
```

输出：

```text
$ getmesh version
getmesh version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
client version: 1.8.2-tetrate-v0
control plane version: 1.8.2-tetrate-v0
data plane version: 1.8.2-tetrate-v0 (2 proxies)
```

除了版本输出之外，用户还可以通过发出 [config-validate 命令](/getistio-cli/reference/getistio_config-validate) 来验证预期的功能（阅读更多关于 [config 验证](/config-validation))。

```sh
getmesh config-validate
```

在重新安装 Kubernetes 集群和 Istio 的情况下，输出结果会类似于下面的样子：

```text
$ getmesh config-validate
Running the config validator. This may take some time...

NAMESPACE       NAME    RESOURCE TYPE   ERROR CODE      SEVERITY        MESSAGE
default         default Namespace       IST0102         Info            The namespace is not enabled for Istio injection. Run 'kubectl label namespace default istio-injection=enabled' to
                                                                        enable it, or 'kubectl label namespace default istio-injection=disabled' to explicitly mark it as not needing injection.

The error codes of the found issues are prefixed by 'IST' or 'KIA'. For the detailed explanation, please refer to
- https://istio.io/latest/docs/reference/config/analysis/ for 'IST' error codes
- https://kiali.io/documentation/latest/validations/ for 'KIA' error codes
```
