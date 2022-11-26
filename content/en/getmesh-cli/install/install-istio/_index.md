---
title: "Install Istio"
date: 2022-11-26T06:33:01+0700
description: "How to install Istio with GetMesh CLI"
type : "docs"
---
Tetrate Istio Distro by default communicates to the cluster defined by your Kubernetes configuration. Please make sure you’re connected to the correct cluster before proceeding.

To install the demo profile of Istio, That can be done using [getmesh istioctl](/getmesh-cli/reference/getmesh_istioctl) command
```sh
getmesh istioctl install --set profile=demo
```

Output: <pre>
$ getmesh istioctl install --set profile=demo
This will install the Istio demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) Y
✔ Istio core installed
✔ Istiod installed
✔ Ingress gateways installed
✔ Egress gateways installed
✔ Installation complete </pre>

By default, istio installation profiles points to normal istio images(distro based), In case users want to install istio with distroless images, this can be done by using the --set hub and tag commands as below.
```sh
getmesh istioctl install --set profile=demo --set hub=containers.istio.tetratelabs.com --set tag=1.12.4-tetratefips-v0-distroless
```
Output:<pre>
$ getmesh istioctl install --set profile=demo --set hub=containers.istio.tetratelabs.com --set tag=1.12.4-tetratefips-v0-distroless
This will install the Istio demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) Y
✔ Istio core installed
✔ Istiod installed
✔ Ingress gateways installed
✔ Egress gateways installed
✔ Installation complete
</pre>

Once this step is completed, the validation can be done by confirming the GetMesh and Istio versions installed, using the [version command](/getmesh-cli/reference/getmesh_version):
```sh
getmesh version
```
Output:<pre>
$ getmesh version
getmesh version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
client version: 1.8.2-tetrate-v0
control plane version: 1.8.2-tetrate-v0
data plane version: 1.8.2-tetrate-v0 (2 proxies)
</pre>

In addition  to the version output, a user can validate the expected functionality by issuing the [config-validate command](/getmesh-cli/reference/getmesh_config-validate) (read more around [config validation](/config-validation)):
```sh
getmesh config-validate
```
With fresh install of Kubernetes cluster and Istio, the output will look similar to the below:
<pre>$ getmesh config-validate
Running the config validator. This may take some time...

NAMESPACE       NAME    RESOURCE TYPE   ERROR CODE      SEVERITY        MESSAGE
default         default Namespace       IST0102         Info            The namespace is not enabled for Istio injection. Run 'kubectl label namespace default istio-injection=enabled' to
                                                                        enable it, or 'kubectl label namespace default istio-injection=disabled' to explicitly mark it as not needing injection.

The error codes of the found issues are prefixed by 'IST' or 'KIA'. For the detailed explanation, please refer to
- https://istio.io/latest/docs/reference/config/analysis/ for 'IST' error codes
- https://kiali.io/documentation/latest/validations/ for 'KIA' error codes
</pre>
