---
title: 'Istio Cheatsheet'
date: 2018-12-29T11:02:05+06:00
icon: 'ti-notepad'
description: "Important commands that you'll need to manage your Istio."
# type dont remove or customize
type: 'docs'
weight: 7
# set these 2 to make it featured in homepage
featured: true
featureOrder: 3
---

### Set up

- Always do pre and post checks after Istio installation. This is enabled by default when installing Istio through [Tetrate Istio Distro](/download/).
- As a best practice, install [distroless images](https://istio.io/latest/docs/ops/configuration/security/harden-docker-images/).
- Istio Operator [API](https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/).
- [Advanced customization](https://istio.io/latest/docs/setup/install/istioctl/#advanced-install-customization).
- For platform [set up](https://istio.io/latest/docs/setup/platform-setup/).
- Different cloud providers have different configuration requirements to enable Istio CNI. To have CNI enabled, AKS clusters would have to be created with the `--network-plugin azure` flag added. [Click here](https://istio.io/latest/docs/setup/additional-setup/cni/#hosted-kubernetes-settings) for further details.
- Starting with Istio 1.8, Istio by default would merge application metrics into Istio metrics by scraping prometheus.io annotations. This may not be suitable where application metrics data are considered sensitive. This default merge can be disabled at the mesh level by passing `--set meshConfig.enablePrometheusMerge=false` during installation. Or this feature can be disabled per workload by adding a `prometheus.istio.io/merge-metrics: "false"` annotation on a pod. [Click here](https://istio.io/latest/docs/ops/integrations/prometheus/) for further details.
- To enable automatic sidecar injection at namespace level, set `kubectl label <namespace> default istio-injection=enabled`

### Istio official [FAQ](https://istio.io/latest/faq/)

<br>

### Applications

- Istio makes some assumptions about Application Service association, Pod labels, etc., that are to be satisfied for the mesh to function properly. Details can be found [here](https://istio.io/latest/docs/ops/deployment/requirements/)
- Resource Annotations- While pod [annotations] (https://istio.io/latest/docs/reference/config/annotations/) provide a useful means to alter Istio sidecar behaviour, allowing application teams to use pod annotations has to be on an exceptional basis as it opens the avenue to bypass mesh level settings and pose a security risk.
- HTTP- and TCP-based readiness probes should be used sparingly as they require allowing non-mTLS traffic from the kubelet into the pod. Instead use the command-based probes that execute a Command inside the pod instead of sending a request to the pod.
- Each headless service in the cluster must use a unique port. The behavior of the system is undefined if two headless services share the same port.
- Use ServiceEntries instead of ExternalName services
- [Protocols selection](https://istio.io/latest/docs/ops/configuration/traffic-management/protocol-selection/#explicit-protocol-selection) in Istio.

### Common Problems

- <strong>Init Containers with Istio CNI</strong><br>As Istio CNI sets up traffic redirection even before the application Pod starts up, it could potentially result in incompatibility with the application init containers. Please refer [here](https://istio.io/latest/docs/setup/additional-setup/cni/#compatibility-with-application-init-containers) for further details and workaround.
- <strong>Empty reply from Istio Ingress Gateway</strong><br>Typically Istio ingress gateway pods are reached through either cloud provider load balancers or other GTM/LTMs. If TLS is terminated at the load balancer and re-established again to Istio ingress gateway, and if the downstream SNI header field is not set, the Istio Ingress gateway wouldn’t be able terminate TLS based on the SNI header. This would result in an empty response from the Istio gateway. To prevent this, either the provider load balancer has to set the SNI header, or the Istio ingress gateway should serve all hosts with wildcard dns cert. If the latter, further routing to application services can happen through the HTTP ‘Authority’ header.
- <strong>Forbidden response from Istio Ingress Gateway</strong><br>For workloads without authorization policies applied, Istio doesn’t enforce access control allowing all requests. When an authorization policy is applicable to a workload, then access to the workload is denied by default. This is true for gateway workloads as well. When a policy at the namespace level is applied to control access to cluster’s internal traffic, the policy is also applied to the Ingress gateways in that namespace that in turn can block external traffic to the gateway. This is one of the common pitfalls. In such cases add additional authorization to ingress workload to allow external traffic. For details on how to get traffic into Kubernetes and Istio and IP based white/black listing, refer to [the documentation](https://istio.io/latest/docs/tasks/security/authorization/authz-ingress/)
- <strong>EKS VM Integration</strong><br>EKS Clusters’ Service Loadbalancers typically use Ingress.Hostname as opposed to the default Ingress.IP. As of Istio 1.8.2, while running the `istioctl experimental workload entry configure` command for VM integration into the mesh, on EKS clusters it is needed to pass the `--ingressIP` flag for the `eastwestgateway`. Otherwise, the gateway address would be empty and the VM wouldn’t be able to connect to the control plane. In general, applications relying on the Ingress.IP would have to change to use Ingress.Hostname when using EKS or distros having similar behavior.

- [Istio Networking](https://istio.io/latest/docs/ops/common-problems/network-issues/)
- [Istio Security](https://istio.io/latest/docs/ops/common-problems/security-issues/)
- [Istio Observability](https://istio.io/latest/docs/ops/common-problems/observability-issues/)
- [Sidecar Injection problems](https://istio.io/latest/docs/ops/common-problems/injection/)
- [Config validation problems](https://istio.io/latest/docs/ops/common-problems/validation/)

### Istio Networking

- Best Practice for Istio Networking[Document](https://istio.io/latest/docs/ops/best-practices/traffic-management/)
- <strong>Service Entry</strong><br>
  - The addition of service entries must be closely monitored to ensure that arbitrary external accesses are not provided to user namespaces.
  - Hostname
    - There can be only one service entry for a given hostname. Multiple service entries for the same hostname will result in undefined behavior.
    - No two service entries must overlap on the hostname. For example, two service entries with hosts _.example.com & _.com will cause undefined behavior at runtime.
    - Only fully qualified domain names must be used for hostnames. Short names, without a ‘.’ should not be used.
  - Address
    - The address field in a service entry is equivalent to the ClusterIP field of a Kubernetes service. Service entries without an Address field are equivalent to headless services. Hence, all restrictions for headless services apply here with the exception of service entries using HTTP or HTTPS/TLS protocols. Multiple address-less service entries on the same port are allowed if and only if all the service entries use the same protocol. In this scenario, the protocol can be one of HTTP or TLS. In the case of HTTP, the destination service is distinguished using the HTTP Host header. In the case of TLS, the destination service is distinguished using the SNI value in the TLS connection. Refer to how Istio smart DNS proxy [solves the problem](https://istio.io/latest/blog/2020/dns-proxy/#external-tcp-services-without-vips) when the address field is empty.
    - Avoid using the NONE resolution mode unless the Address field has a CIDR block. A service entry without an Address field with NONE resolution allows traffic to any IP on the ports specified in the service entry - creating a potential security issue.
- <strong>Virtual Services</strong><br>
  - There should be only one virtual service for a given hostname. Multiple virtual services will result in undesirable behavior. Avoid using short names to refer to hosts in the virtual service as the interpretation is subject to runtime context, creating undesirable ambiguity.
  - For HTTP rules, prefer exact or prefix URL matches over regular expressions. Regular expression-based matches are slow and have unintended side effects unless crafted properly.
  - Virtual services cannot be inherited. Hence, the settings for a virtual service for host _.example.com are independent of the settings for a VirtualService for host _.com. If multiple virtual services with different wildcard hosts match a given hostname, only the settings from the most specific virtual service will apply at runtime.
- <strong>Destination Rules</strong><br>
  - When creating subsets for traffic shifting, leave a few seconds of delay between creating a destination rule with subsets and creating a virtual service that refers to those subsets. The delay ensures that the Envoy upstream configuration for the subset is in place when Pilot sends the routing configuration that refers to those subsets.
  - It is possible to specify a single destination rule across a range of hosts using wildcard destination rules. For example, a global destination rule in the istio-config root namespace configures all services matching _.local hostname with mutual TLS. When a destination rule is created for a more specific hostname (e.g., _.ns1.svc.cluster.local or svc1.ns1.svc.cluster.local), the most specific destination rule is chosen. Settings from other wildcard destination rules are not inherited. Hence, it is important that any user-authored destination rule carries all the required settings set in the global destination rule, such as mutual TLS, outlier detection values if any, etc.
- <strong>Scope of Virtual Services & Destination</strong><br>
  - Unless configuration access is tightly controlled, it is still possible for a client to override the server specified destination rule and virtual service by authoring rules in the client namespace with an exportTo value of ‘.’. Destination rules and virtual service for a service (in Kubernetes or Service Entry) impact all sidecars talking to the service. Settings like outlier detection, retry policies, etc., are executed at the client side sidecars. While it may be tempting to let each consumer namespace author its own virtual service and destination rule for another namespace’s service, failure to restrict the visibility of such custom configurations could result in undefined behavior.
- <strong>Sidecar</strong><br> - Unless configuration access is tightly controlled, it is possible for a namespace owner to override the global specified Sidecar with a namespace-wide Sidecar that results in the same behavior as a system with no Sidecar by declaring dependency on _/_ in the egress.hosts section or even by importing services and configs from multiple namespaces with potentially conflicting configurations. - It is recommended to use the Sidecar API in Istio to restrict the dependency of each workload on other workloads in the system. It is sufficient to have a single Sidecar resource for the entire namespace without a workload selector to configure namespace-wide defaults. Each Sidecar resource specifies the hosts that are needed by workloads in the namespace. These hosts correspond to the hostnames in Kubernetes services, Istio service entries, and Istio VirtualServices. Based on the imported service hostnames, the appropriate Destination Rules are also automatically imported from the service’s namespace. - Sidecars declare dependency on services from other namespaces in the `egress.hosts` section. Declaring a dependency on a hostname (with or without wildcards) will cause Pilot to try to search all namespaces where the said host is present and import from all matching namespaces. For example,
<pre>egress:
- hosts:
- “_/_”</pre>
<strong>OR</strong>
<pre>egress:
- hosts:
- foo.example.com # import from any namespace that exports this host
- .fun.com # import all hosts from any namespace that match this pattern
</pre>
The caveat here is that if there are conflicting service entries with the same host in multiple namespaces, or conflicting virtual services with the same host (with `exportTo: *` ) in multiple namespaces, the choice of a specific resource is based on the order of creation of these resources. This behavior can cause unintended consequences in production as it's often not obvious to the developer.
- Sidecars do not support inheritance. If a namespace declares a Sidecar resource, the namespace local Sidecar takes precedence over the global default Sidecar.
- When multiple Sidecars have overlapping workload selectors, the choice of Sidecar resource for a pod is arbitrary. Hence, care must be taken to ensure that when authoring Sidecars with workload selectors, each Sidecar targets a distinct set of pods in its namespace.

### Istio Security

- Best Practice for [Istio Security](https://istio.io/latest/docs/ops/best-practices/security/)
- Kubernetes CSR API requires Kubernetes version 1.18+. Some Kubernetes distros support Kubernetes signer `legacy-unknown` even in earlier versions of Kubernetes with all the X509 Extensions honored. As this is not an universal truth, exercise caution on lower Kubernetes versions while choosing `legacy-unknown` signer.

### Istio Observability

Best Practice for [Istio Obervability](https://istio.io/latest/docs/ops/best-practices/observability/)

### Debugging

- To check if Istio cluster configurations and yet to be applied Istio configurations are valid, run the `getmesh config-validate` [command](/config-validation/).
- Many times, default envoy logs provide a great deal of information about the traffic. Use [this link](https://preliminary.istio.io/latest/docs/tasks/observability/logs/access-log/#default-access-log-format) for the default envoy log format details.
- To get better insight into the mesh, istio-proxy and the control plane pods, Istio provides istioctl and UI based dashboard features. Details [here](https://istio.io/latest/docs/ops/diagnostic-tools/)

### Useful Links

- [Tetrate Istio Distro CLI](https://istio.tetratelabs.io/getmesh-cli/reference/getmesh/)
- [Kubectl](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
- [Local K8s (kind, microk8s, minikube, dockerdesktop)](https://kubernetes.io/docs/tasks/tools/)

### Integrations

- [Skywalking (log aggregation and visualization)](https://istio.tetratelabs.io/istio-in-practice/install-skywalking/): analyze your platform with an open source tool that provides graphical analysis of multi-cluster and multi-cloud environment via log aggregation
- [Zipkin (tracing)](https://istio.io/latest/docs/ops/integrations/zipkin/): track and analyze path, performance, and latency of distributed transactions
- [Prometheus (monitor)](https://istio.io/latest/docs/ops/integrations/prometheus/#Configuration): record metrics to track the health of Istio and applications in the mesh
- [Grafana (visualization)](https://istio.io/latest/docs/ops/integrations/grafana/): connect to various data sources and visualize the data use graphs, tables, and heatmaps
- [Kiali](https://istio.io/latest/docs/ops/integrations/kiali/): perform basic troubleshooting with this service mesh visualization tool

### Documentation

- [Tetrate Istio Distro](https://istio.tetratelabs.io/getmesh-cli/)
- [func-e](https://func-e.io)
- [Learn Istio concepts interactively](https://tetrate-academy.thinkific.com/enrollments)
- [Envoy Docs](https://www.envoyproxy.io/docs/envoy/latest/configuration/configuration)
- Istio details:
  - [Traffic management](https://istio.io/latest/docs/tasks/traffic-management/)
  - [Security constructs](https://istio.io/latest/docs/tasks/security/)
  - [Observability](https://istio.io/latest/docs/tasks/observability/)
