---
title: "Istio Cheatsheet"
date: 2018-12-29T11:02:05+06:00
icon: "ti-notepad"
description: "Important commands that you'll need to manage your Istio."
# type dont remove or customize
type : "docs"
weight: 1
---

Istio cheat sheet covers the essential concepts and offers guidance for managing Istio cluster

### Initial Deployment

For installing *kubectl* use [this instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

#### Install GetIstio and fetch Istio
<pre>
# install getistio with the following command

curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
</pre>

<pre>
# fetch latest Istio version with getistio

getistio fetch
</pre>

<pre>
# istioctl version 1.8 allows users to check compatibility with precheck command

getistio istioctl x precheck
</pre>
For the specific platform Istio deployments refer to the [this page](https://istio.io/latest/docs/setup/platform-setup/) for the details

For Istio install using operator follow [the link](https://istio.io/latest/docs/setup/install/operator/#install) to install istioctl and refer to [installation page](https://istio.io/latest/docs/setup/additional-setup/config-profiles/) for more information. Remember to use `default profile` if deploying in production environment.

#### Verify Istio install
<pre>
# verify install will check on whether all Istio CRDs and istiod control plane installed in a correct way

getistio istioctl verify-install
</pre>

#### Uninstall 
<pre>
# delete control plane using Istio operator

kubectl delete istiooperators.install.istio.io -n istio-system example-istiocontrolplane
</pre>
<pre>
# remove operator

getistio istioctl operator remove
</pre>

#### Observability tools

There is multiple tools that can be used for Istio monitoring and observability:
- [Prometheus](https://istio.io/latest/docs/ops/integrations/prometheus/#Configuration) (monitor): record metrics to track the health of Istio and application in the mesh
- [Grafana](https://istio.io/latest/docs/ops/integrations/grafana/) (visualization): connect to various data sources and visualize the data use graphs, tables and heatmaps
- [Zipkin](https://istio.io/latest/docs/ops/integrations/zipkin/) (tracing): track and analyze path, performance and latency of distributed transactions
- [kiali](https://istio.io/latest/docs/ops/integrations/kiali/): perform basic troubleshooting with this service mesh visualization tool
- [Skywalking](/istio-tutorials/install-skywalking) (log aggregation and visualization): analyze your platform with open source tool that provides graphical analysis of multi-cluster and multi-cloud environment via log aggregation

### Troubleshooting
[`getistio config-validate`](/getistio-cli/reference/getistio_config-validate) single command allows the operator to validate Istio configuration against checks from three different sources of istioctl, kiali and getistio libraries

Additional troubleshooting commands - also more details on troubleshooting steps in this [blog post](https://www.tetrate.io/blog/debugging-your-istio-networking-configuration/):
<pre>
# to verify your configurations parse correctly (included as subset to `getistio config-validate` command)

istioctl analyze 
</pre>

<pre>
# confirm that the config is pushed to the proxies

istioctl proxy-status POD_NAME -n POD_NAMESPACE
</pre>

<pre>
# check the Istio related configuration impacting a Pod or a Service in the Runtime using experimental describe feature

istioctl x describe pod POD_NAME.POD_NAMESPACE
</pre>

<pre>
# collect very useful data from Envoy’s admin endpoints not only /config_dump output

istioctl proxy-config type POD_NAME -n POD_NAMESPACE
</pre>

<pre>
# check VirtualService HTTP rules manifest in form of Envoy routes

istioctl proxy-config routes POD_NAME -n POD_NAMESPACE
</pre>

<pre>
# inspect envoy logs

kubectl logs POD_NAME -c istio-proxy -n POD_NAMESPACE
</pre>

<pre>
# inspect istiod logs

istioctl dashboard controlz $(kubectl -n istio-system get pods -l app=istiod -o jsonpath='.items[0].metadata.name').istio-system
</pre>


### Useful links
Istio details ([sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/) is required for the all applications to allow secure, observe and manage incoming and outgoing traffic):
- [Application requirement when deploying Istio]( https://istio.io/latest/docs/ops/deployment/requirements/)
- [Common Traffic management issues with Istio](https://istio.io/latest/docs/ops/common-problems/network-issues/)
- [Traffic management ](https://istio.io/latest/docs/tasks/traffic-management/)
- [Security constructs](https://istio.io/latest/docs/tasks/security/)
- [Observability](https://istio.io/latest/docs/tasks/observability/)
- [Learn Istio concepts interactively](https://tetrate-academy.thinkific.com/enrollments)

Envoy:

- [Istio and Envoy Architecture](https://istio.io/latest/docs/ops/deployment/architecture/)
- [Logs details](https://www.envoyproxy.io/docs/envoy/latest/configuration/observability/observability)
- [Sharing data between filters](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/advanced/data_sharing_between_filters)

Observability platforms:

- [Prometheus](https://prometheus.io/)
- [Kiali](https://kiali.io/documentation/)
- [Skywalking](https://skywalking.apache.org/docs/)
- [Zipkin](https://zipkin.io/pages/architecture.html)
- [Grafana](https://grafana.com/docs/)
