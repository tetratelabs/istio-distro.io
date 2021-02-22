---
title: "如何执行零停机时间发布"
date: 2021-01-01T11:02:05+06:00
weight: 2
draft: false
---

零停机时间发行的目的是在不影响用户的情况下发行该应用程序的新版本。如果您正在运行网站，则意味着您可以发布新版本而无需关闭网站。这意味着您可以在发布新应用程序的同时向该应用程序发出连续请求，而应用程序用户将永远不会收到可怕的 504 Service Unavailable 响应。

您可能想知道，如果 Kubernetes 选项更加简单，为什么我们将使用 Istio 进行滚动更新。是的，如果零停机时间部署是您唯一要使用的平台，则可能不应该使用 Istio。您可以使用 Istio 实现相同的行为。但是，您可以更好地控制如何以及何时将流量路由到特定版本。

## 先决条件

您可以按照[先决条件](../prerequisites)获取有关如何安装和设置 Istio 的说明。

## Kubernetes 部署需要进行版本控制

服务的每个部署都需要进行版本控制——您需要一个名为`version: v1`（或`release: prod`类似名称的标签）以及该部署的名称，因此很清楚它代表哪个版本（例如`helloworld-v1`）。通常，每个部署上至少要设置以下两个标签：

```yaml
labels:
    app: helloworld
    version: v1
```

如果有意义的话，您还可以包括许多其他标签，但是您应该有一个标签来标识您的组件及其版本。

## Kubernetes 服务需要通用

无需在 Kubernetes 服务选择器中放置版本标签。带有应用程序 / 组件名称的标签就足够了。另外，请记住以下几点：

1. 从包含当前正在运行的版本的目标规则开始，并确保使其保持同步。最终不需要包含许多未使用或过时的子集的目标规则。
2. 如果使用**匹配和条件**，请始终在 VirtualService 资源中定义 “后备” 路由。如果您不这样做，那么任何不符合条件的请求都将落入数字天堂，并且不会得到满足。

让我们来看下面的例子：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
    name: my-service
spec:
    hosts:
      - my-service.default.svc.cluster.local
    http:
      - match:
        - headers:
            my-header:
              regex: '.*debug.*'
        route:
          - destination:
              host: my-service.default.svc.cluster.local
            port:
              number: 3000
            subset: debug
```

上面的 VirtualService 缺少 “备用” 路由。如果请求不匹配（`my-header: debug`例如，缺少），则 Istio 将不知道将流量路由到何处。要解决此问题，请始终定义一个在所有匹配项都不为 true 时适用的路由。这是相同的 VirtualService，但具有到的子集的后备路由`prod`。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
    name: my-service
spec:
    hosts:
      - my-service.default.svc.cluster.local
    http:
      - match:
        - headers:
            my-header:
              regex: '.*debug.*'
        route:
          - destination:
              host: my-service.default.svc.cluster.local
            port:
              number: 3000
            subset: debug
      - route:
        - destination:
            host: my-service.default.svc.cluster.local
            port:
                number: 3000
            subset: prod
```

牢记这些准则，这是使用 Istio 进行零停机时间部署的大致过程。我们从名为 Kubernetes 的部署开始`helloworld-v1`，该目标规则包含一个子集（`v1`）和一个 VirtualService 资源，该资源将所有流量路由到该`v1`子集。这是 DestinationRule 资源的样子：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: helloworld
spec:
  host: helloworld.default.svc.cluster.local
  subsets:
    - name: v1
      labels:
        version: v1
```

以及相应的 VirtualService：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: helloworld
spec:
  hosts:
    - helloworld
  http:
    - route:
      - destination:
          host: helloworld
          port:
            number: 3000
          subset: v1
        weight: 100
```

部署这两个资源后，所有流量都将路由到该`v1`子集。

## 推出第二版

在部署第二个版本之前，您需要做的第一件事就是修改 DestinationRule 并添加一个代表第二个版本的子集。

1. 部署修改后的目标规则，以添加新的子集：

   ```yaml
   apiVersion: networking.istio.io/v1alpha3
   kind: DestinationRule
   metadata:
     name: helloworld
   spec:
     host: helloworld.default.svc.cluster.local
     subsets:
       - name: v1
         labels:
           version: v1
       - name: v2
         labels:
           version: v2
   ```

2. 创建 / 部署`helloworld-v2` Kubernetes 部署。

3. 更新虚拟服务并重新部署它。在虚拟服务中，您可以配置到子集`v1`的流量的百分比和到新子集的流量的百分比`v2`。

您可以通过多种方式执行此操作 - 您可以逐步路由更多流量`v2`（例如，以 10％的增量），或者可以在版本之间进行直接的 50/50 分割，甚至可以将 100％的流量路由到新的`v2`子集。

最后，将所有流量路由到最新 / 最新子集后，您可以按照以下顺序进行操作，以删除先前的`v1`部署和子集：

1. `v1`从 VirtualService 中删除该子集，然后重新部署它。这将导致所有流量都进入`v2`子集。
2. `v1`从 DestinationRule 中删除该子集，然后重新部署它。
3. 最后，`v1`由于不再发送任何流量，您现在可以安全地删除 Kubernetes 部署。

如果到了这一部分，所有流量现在都在流向`v2`子集，并且您不再有任何`v1`工件在运行。