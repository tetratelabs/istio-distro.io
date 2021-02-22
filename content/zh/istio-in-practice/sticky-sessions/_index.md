---
title: "如何使用粘性会话"
date: 2021-01-01T11:02:05+06:00
weight: 4
draft: false
---

## 什么是粘性会话？

粘性会话背后的想法是将对特定会话的请求路由到服务第一个请求的同一端点。通过粘性会话，您可以基于 HTTP 标头或 cookie 将服务实例与调用者相关联。如果您的服务在第一个请求上执行昂贵的操作，但为所有后续调用缓存该值，则可能要使用粘性会话。这样，如果同一用户发出请求，将不会执行昂贵的操作，并且将使用缓存中的值。

## 先决条件

您可以按照[先决条件](../prerequisites)获取有关如何安装和设置 Istio 的说明。

## 如何在 Istio 中使用粘性会话？

为了演示粘性会话的功能，我们将使用一个名为*sticky-svc*的示例服务。调用时，此服务检查*x-user*标头的存在。如果标题存在，它将尝试在内部缓存中查找标题值。在使用新*x 用户的*任何第一个请求中，该值将不在缓存中，因此该服务将休眠 5 秒钟（模拟昂贵的操作），然后，该值将被缓存。具有相同*x-user*标头值的所有后续请求都将立即返回。这是来自服务源代码的此简单逻辑的代码段：

```go
var (
  cache = make(map[string]bool)
)

func process(userHeaderValue string) {
  if cache[userHeaderValue] {
    return
  }

  cache[userHeaderValue] = true
  time.Sleep(5 * time.Second)
}
```

要查看活动中的粘性会话，我们将需要部署该服务的多个副本。这样，当我们启用粘性会话时，具有相同*x 用户*头值的请求将始终被定向到最初为该请求提供相同*x 用户*值的 pod 。我们发出的第一个请求仍然需要 5 秒钟。但是，任何后续请求都是即时的。

让我们继续先创建 Kubernetes 部署和服务。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sticky-svc
  namespace: default
  labels:
    app: sticky-svc
    version: v1
spec:
  replicas: 5
  selector:
    matchLabels:
      app: sticky-svc
      version: v1
  template:
    metadata:
      labels:
        app: sticky-svc
        version: v1
    spec:
      containers:
        - image: gcr.io/tetratelabs/sticky-svc:1.0.0
          imagePullPolicy: Always
          name: svc
          ports:
            - containerPort: 8080
---
kind: Service
apiVersion: v1
metadata:
  name: sticky-svc
  namespace: default
  labels:
    app: sticky-svc
spec:
  selector:
    app: sticky-svc
  ports:
    - port: 8080
      name: http
复制
```

将上面的 YAML 保存到`sticky-deployment.yaml`并运行`kubectl apply -f sticky-deployment.yaml`以创建 Deployment and Service。

要从外部 IP 访问服务，我们还需要一个网关资源：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - '*'
```

将上述 YAML 保存到`gateway.yaml`并使用进行部署`kubectl apply -f gateway.yaml`。

接下来，我们可以部署 VirtualService 并将其附加到网关。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: sticky-svc
  namespace: default
spec:
  hosts:
    - '*'
  gateways:
    - gateway
  http:
    - route:
      - destination:
          host: sticky-svc.default.svc.cluster.local
          port:
            number: 8080
```

将上述 YAML 保存到`sticky-vs.yaml`并使用创建`kubectl apply -f sticky-vs.yaml`

让我们通过设置标头值`/ping`几次调用端点，确保无需配置粘性会话即可正常运行`x-user`：

```text
$ curl -H "x-user: ricky" http://localhost/ping

Call was processed by host sticky-svc-689b4b7876-cv5t9 for user ricky and it took 5.0002721s
```

第一个请求（按预期）将花费 5 秒。如果再进行几个请求，您会发现其中一些请求也将花费 5 秒，而其中一些请求（定向到以前的 Pod）将花费更少的时间，也许是 500 微秒。

通过创建粘性会话，我们希望实现所有后续请求都在几微秒内完成，而不是花费 5 秒。粘性会话设置可以在服务的目标规则中配置。

在较高级别上，有两个选项可以选择负载均衡器设置。第一个选项称为简单，我们只能选择下表中所示的一种负载平衡算法。

| 名称        | 描述                                                   |
| :---------- | :----------------------------------------------------- |
| ROUND_ROBIN | 循环负载均衡算法（默认）                               |
| LEAST_CONN  | 该算法选择两个随机的健康主机，并选择活动请求较少的主机 |
| 随机的      | 随机选择一个主机                                       |
| 通行证      | 在没有任何负载平衡的情况下将连接转发到请求的 IP 地址   |

例如，此代码段会将负载平衡算法设置为`LEAST_CONN`：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: sticky-svc
    namespace: default
spec:
    host: sticky-service.default.svc.cluster.local
    trafficPolicy:
      loadBalancer:
        simple: LEAST_CONN
```

设置负载均衡器设置的第二个选项是使用名为的字段`consistentHash`。此选项使我们能够基于 HTTP 标头（`httpHeaderName`），Cookie（`httpCookie`）或其他属性（例如，使用`useSourceIp: true`设置的源 IP）提供会话亲缘关系。

让我们使用*x-user*标头名称在目标规则中定义一致的哈希算法并进行部署：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: sticky-svc
    namespace: default
spec:
    host: sticky-svc.default.svc.cluster.local
    trafficPolicy:
      loadBalancer:
        consistentHash:
          httpHeaderName: x-user
复制
```

将上述 YAML 保存到`sticky-dr-hash.yaml`并使用进行部署`kubectl apply -f sticky-dr-hash.yaml`。

在测试之前，让我们重新启动所有 Pod，以便获得一个干净的状态并清除内存中的缓存。首先，我们将部署缩减为 0 个副本，然后将其缩减为 5 个副本：

```sh
kubectl scale deploy sticky-svc --replicas=0
kubectl scale deploy sticky-svc --replicas=5
复制
```

所有副本都运行后，尝试向端点发出第一个请求：

```text
$ curl -H "x-user: ricky" http://localhost/ping
Call was processed by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 5.0003232s
```

不出所料，第一个请求需要 5 秒钟。但是，任何后续请求都将发送到同一实例，并且所需的时间要少得多：

```text
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 47.4µs
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 53.7µs
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 46.1µs
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 76.5µs
```

这是一个棘手的环节！如果我们与其他用户发送请求，则最初会花费 5 秒钟，但随后它将再次发送到同一 pod。