---
title: "Istio 速查表"
date: 2018-12-29T11:02:05+06:00
icon: "ti-notepad"
description: "管理 Istio 所需的重要命令。"
# type dont remove or customize
type : "docs"
weight: 7
# set these 2 to make it featured in homepage
featured: true
featureOrder: 3
altLink: "/istio-cheatsheet/cheatsheet/"
---

### 设置

- 在安装 Istio 之后，请务必进行事前检查和事后检查。通过 [GetIstio](/download/) 安装 Istio 时，默认情况下启用此功能。
- 作为最佳实践，请安装[发行版镜像](https://istio.io/latest/docs/ops/configuration/security/harden-docker-images/)。
- Istio Operator [API](https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/)。
- [高级定制](https://istio.io/latest/docs/setup/install/istioctl/#advanced-install-customization)。
- 为平台[搭建](https://istio.io/latest/docs/setup/platform-setup/)。
- 不同的云提供商对启用 Istio CNI 的配置要求不同。要启用 CNI，必须在`--network-plugin azure`添加了标志的情况下创建 AKS 集群。[单击此处](https://istio.io/latest/docs/setup/additional-setup/cni/#hosted-kubernetes-settings)了解更多详细信息。
- 从 Istio 1.8 开始，默认情况下，Istio 会通过收集 prometheus.io 批注将应用程序指标合并到 Istio 指标中。在应用程序度量标准数据被认为是敏感的情况下，这可能不合适。可以`--set meshConfig.enablePrometheusMerge=false`在安装过程中通过在网格级别禁用此默认合并。或者，可以通过`prometheus.istio.io/merge-metrics: "false"`在窗格上添加注释来针对每个工作负载禁用此功能。[单击此处](https://istio.io/latest/docs/ops/integrations/prometheus/)了解更多详细信息。
- 要在命名空间级别启用自动sidecar注入，请设置 `kubectl label <namespace> default istio-injection=enabled`

### Istio 官方[常见问题解答](https://istio.io/latest/faq/)

### 应用

- Istio 对应用程序服务关联，Pod 标签等进行了一些假设，这些假设可以使网格正常运行。可以在[这里](https://istio.io/latest/docs/ops/deployment/requirements/)找到详细信息。
- 资源注释——虽然 pod [注释](https://istio.io/latest/docs/reference/config/annotations/)提供了改变 Istio sidecar 行为的有用手段，但允许应用团队使用 pod 注释必须是在特殊的基础上，因为它开辟了绕过网格级别设置的途径，并带来了安全风险。
- 应谨慎使用基于 HTTP 和 TCP 的就绪探针，因为它们需要允许从 kubelet 到 pod 的非 mTLS 流量。而是使用在 pod 内执行命令的基于命令的探针，而不是向 pod 发送请求。
- 集群中的每个无头服务必须使用唯一的端口。如果两个无头服务共享同一端口，则系统的行为是不确定的。
- 使用 ServiceEntries 代替 ExternalName 服务。
- Istio 中的[协议选择](https://istio.io/latest/docs/ops/configuration/traffic-management/protocol-selection/#explicit-protocol-selection)。

### 常见问题

- **使用 Istio CNI 的初始化容器**
  由于 Istio CNI 甚至在应用程序 Pod 启动之前就设置了流量重定向，因此可能会导致与应用程序初始化容器不兼容。请参阅[此处](https://istio.io/latest/docs/setup/additional-setup/cni/#compatibility-with-application-init-containers)了解更多详细信息和解决方法。
- **Istio 入口网关的空回复**
  通常，Istio 入口网关 Pod 是通过云提供商负载平衡器或其他 GTM / LTM 到达的。如果 TLS 在负载均衡器处终止，并重新建立到 Istio 入口网关，并且未设置下游 SNI 标头字段，则 Istio Ingress 网关将无法基于 SNI 标头终止 TLS。这将导致 Istio 网关的响应为空。为避免这种情况，提供程序负载平衡器必须设置 SNI 标头，否则 Istio 入口网关应为所有具有通配符 dns cert 的主机提供服务。如果是后者，则可以通过 HTTP'Authority' 标头进一步路由到应用程序服务。
- **禁止来自 Istio Ingress Gateway 的响应**
  对于未应用授权策略的工作负载，Istio 不会实施允许所有请求的访问控制。当授权策略适用于工作负载时，默认情况下拒绝对工作负载的访问。网关工作负载也是如此。当将命名空间级别的策略应用于控制对集群内部流量的访问时，该策略也将应用于该命名空间中的 Ingress 网关，从而可以阻止到网关的外部流量。这是常见的陷阱之一。在这种情况下，请向入口工作负载添加其他授权以允许外部流量。有关如何使流量进入 Kubernetes 和 Istio 以及基于 IP 的白 / 黑清单的详细信息，请参阅[文档](https://istio.io/latest/docs/tasks/security/authorization/authz-ingress/)
- **EKS VM 集成**
  EKS 集群的服务负载平衡器通常使用 Ingress.Hostname 而不是默认的 Ingress.IP。从 Istio 1.8.2 开始，在运行`istioctl experimental workload entry configure`用于将 VM 集成到网格中的命令时，需要在 EKS 集群上传递的`--ingressIP`标志`eastwestgateway`。否则，网关地址将为空，并且 VM 将无法连接至控制平面。通常，当使用具有类似行为的 EKS 或发行版时，依赖 Ingress.IP 的应用程序必须更改为使用 Ingress.Hostname。
- [Istio 网络](https://istio.io/latest/docs/ops/common-problems/network-issues/)
- [Istio 安全](https://istio.io/latest/docs/ops/common-problems/security-issues/)
- [Istio 可观察性](https://istio.io/latest/docs/ops/common-problems/observability-issues/)
- [Sidecar 注入问题](https://istio.io/latest/docs/ops/common-problems/injection/)
- [配置验证问题](https://istio.io/latest/docs/ops/common-problems/validation/)

### Istio 网络

- Istio 网络[文档的](https://istio.io/latest/docs/ops/best-practices/traffic-management/)最佳做法
- 服务进入
  - 必须严密监视服务条目的添加，以确保不向用户命名空间提供任意外部访问。
  - 主机名
    - 给定主机名只能有一个服务条目。同一主机名的多个服务条目将导致未定义的行为。
    - 主机名上不得有两个服务条目重叠。例如，两个带有主机 * .example.com 和 * .com 的服务条目将在运行时导致未定义的行为。
    - 主机名只能使用完全限定的域名。简称，不带 “。” 不应该使用。
  - 地址
    - 服务条目中的地址字段等同于 Kubernetes 服务的 ClusterIP 字段。没有地址字段的服务条目等同于无头服务。因此，除了使用 HTTP 或 HTTPS / TLS 协议的服务条目外，所有对无头服务的限制都在这里适用。当且仅当所有服务条目都使用相同协议时，才允许在同一端口上使用多个无地址服务条目。在这种情况下，协议可以是 HTTP 或 TLS 之一。在使用 HTTP 的情况下，使用 HTTP Host 标头区分目标服务。对于 TLS，使用 TLS 连接中的 SNI 值来区分目标服务。请参阅地址字段为空时 Istio 智能 DNS 代理如何[解决此问题](https://istio.io/latest/blog/2020/dns-proxy/#external-tcp-services-without-vips)。
    - 除非地址字段具有 CIDR 块，否则请避免使用 NONE 解析模式。没有地址字段且分辨率为 NONE 的服务条目将允许流量访问该服务条目中指定的端口上的任何 IP，从而造成潜在的安全问题。
- 虚拟服务
  - 对于给定的主机名，应该只有一个虚拟服务。多个虚拟服务将导致不良行为。避免使用短名称来引用虚拟服务中的主机，因为解释受运行时上下文的约束，从而产生了不希望的歧义。
  - 对于 HTTP 规则，与正则表达式相比，首选完全匹配或前缀 URL 匹配。除非精心设计，否则基于正则表达式的匹配速度很慢并且具有意想不到的副作用。
  - 虚拟服务不能被继承。因此，主机 * .example.com 的虚拟服务的设置独立于主机 * .com 的 VirtualService 的设置。如果具有不同通配符主机的多个虚拟服务与给定的主机名匹配，则只有最特定的虚拟服务中的设置才会在运行时应用。
- 目的地规则
  - 在创建用于流量转移的子集时，在创建带有子集的目标规则与创建引用这些子集的虚拟服务之间要留出几秒钟的延迟。延迟可确保当飞行员发送引用那些子集的路由配置时，该子集的 Envoy 上游配置就位。
  - 可以使用通配符目标规则跨主机范围指定单个目标规则。例如，istio-config 根命名空间中的全局目标规则使用相互 TLS 配置与 * .local 主机名匹配的所有服务。当为更特定的主机名（例如 * .ns1.svc.cluster.local 或 svc1.ns1.svc.cluster.local）创建目标规则时，将选择最特定的目标规则。其他通配符目标规则的设置不会被继承。因此，重要的是任何用户编写的目标规则都应携带在全局目标规则中设置的所有必需设置，例如相互 TLS，异常检测值（如果有）等。
- 虚拟服务范围和目的地
  - 除非严格控制配置访问，否则客户端仍然可以通过在客户端命名空间中使用 exportTo 值为 '。编写规则来覆盖服务器指定的目标规则和虚拟服务。服务的目标规则和虚拟服务（在 Kubernetes 或服务条目中）会影响与该服务进行对话的所有 Sidecar。异常检测，重试策略等设置在客户端sidecar上执行。虽然可能很容易让每个使用者命名空间编写自己的虚拟服务和其他命名空间服务的目标规则，但如果无法限制此类自定义配置的可见性，则可能导致未定义的行为。
- sidecar
  - 除非严格控制配置访问，否则命名空间所有者可以使用整个命名空间范围的 Sidecar 覆盖全局指定的 Sidecar，从而通过声明对 egress.hosts 部分中的*/ 的*依赖来导致与没有 Sidecar 的系统相同的行为。即使是从具有潜在冲突配置的多个命名空间导入服务和配置。
  - 建议在 Istio 中使用 Sidecar API 来限制每个工作负载对系统中其他工作负载的依赖性。仅使用一个 Sidecar 资源即可用于整个命名空间，而无需工作负载选择器来配置整个命名空间范围的默认值就足够了。每个 Sidecar 资源都指定命名空间中工作负载所需的主机。这些主机与 Kubernetes 服务，Istio 服务条目和 Istio VirtualServices 中的主机名相对应。根据导入的服务主机名，还将从服务的命名空间中自动导入相应的目标规则。
  - sidecar在本`egress.hosts`节中声明对其他命名空间中服务的依赖。声明对主机名的依赖关系（带或不带通配符）将使 Pilot 尝试搜索存在该主机的所有命名空间，并从所有匹配的命名空间中导入。例如，

```
出口： 
-主机： 
-“ * / *”
```

**或者**

```
出口： 
-主机： 
-foo.example.com＃从任何导出该主机的命名空间中导入 
-.fun.com＃从任何与此模式匹配的命名空间中导入所有主机
```

需要注意的是，如果在多个命名空间中存在与同一主机冲突的服务条目，或者在多个命名空间中具有与同一主机冲突的虚拟服务（带有`exportTo: *`），则特定资源的选择取决于这些资源的创建顺序。这种行为可能会在生产中引起意想不到的后果，因为这通常对开发人员而言并不明显。

- sidecar不支持继承。如果命名空间声明了 Sidecar 资源，则命名空间本地 Sidecar 优先于全局默认 Sidecar。
- 当多个 Sidecar 具有重叠的工作负载选择器时，为吊舱选择 Sidecar 资源是任意的。因此，必须注意确保在使用工作负载选择器创作 Sidecar 时，每个 Sidecar 在其命名空间中都针对一组独特的 pod。

### Istio 安全

- [Istio 安全](https://istio.io/latest/docs/ops/best-practices/security/)最佳实践
- Kubernetes CSR API 需要 Kubernetes 1.18 + 版本。某些 Kubernetes 发行版`legacy-unknown`甚至在较早版本的 Kubernetes 中都支持 Kubernetes 签名者，并且所有 X509 扩展都得到了认可。由于这不是一个普遍的事实，因此在选择`legacy-unknown`签名者时，请注意较低的 Kubernetes 版本。

### Istio 可观察性

[Istio 可观察性](https://istio.io/latest/docs/ops/best-practices/observability/)的最佳实践。

### 调试

- 要检查 Istio 集群配置以及尚未应用的 Istio 配置是否有效，请运行`getistio config-validate` [命令](/config-validation/)。
- 很多时候，默认特使日志提供了大量有关流量的信息。使用[此链接](https://preliminary.istio.io/latest/docs/tasks/observability/logs/access-log/#default-access-log-format)可获得默认的特使日志格式详细信息。
- 为了更好地了解网格，istio-proxy 和控制平面窗格，Istio 提供了基于 istioctl 和 UI 的仪表板功能。详情[在这里](https://istio.io/latest/docs/ops/diagnostic-tools/)。

### 有用的链接

- [GetIstio CLI](https://getistio.io/getistio-cli/reference/getistio/)
- [Kubectl](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
- [本地 Kubernetes（种类，microk8s，minikube，dockerdesktop）](https://kubernetes.io/docs/tasks/tools/)

### 整合方式

- [Skywalking（日志聚合和可视化）](https://getistio.io/istio-in-practice/install-skywalking/)：使用开源工具分析平台，该工具通过日志聚合提供对多集群和多云环境的图形分析
- [Zipkin（跟踪）](https://istio.io/latest/docs/ops/integrations/zipkin/)：跟踪和分析分布式事务的路径，性能和延迟
- [Prometheus（监视器）](https://istio.io/latest/docs/ops/integrations/prometheus/#Configuration)：记录指标以跟踪 Istio 和网格中应用程序的运行状况
- [Grafana（可视化）](https://istio.io/latest/docs/ops/integrations/grafana/)：连接到各种数据源并使用图表，表格和热图可视化数据
- [Kiali](https://istio.io/latest/docs/ops/integrations/kiali/)：使用此服务网格可视化工具执行基本的故障排除

### 文献资料

- [GetIstio](https://getistio.io/getistio-cli/)
- [GetEnvoy](https://www.getenvoy.io/reference/getenvoy/)
- [交互式学习 Istio 概念](https://tetrate-academy.thinkific.com/enrollments)
- [Envoy 文件](https://www.envoyproxy.io/docs/envoy/latest/configuration/configuration)
- Istio 详细信息：
  - [流量管理](https://istio.io/latest/docs/tasks/traffic-management/)
  - [安全构造](https://istio.io/latest/docs/tasks/security/)
  - [可观察性](https://istio.io/latest/docs/tasks/observability/)