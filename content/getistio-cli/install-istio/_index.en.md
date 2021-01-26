---
title: "Install Istio"
date: 2021-01-25T13:00:00+07:00
description: "How to install Istio with GetIstio CLI"
# type dont remove or customize
type : "docs"
---
As explained earlier, GetIstio by default communicates to the cluster defined by your Kubernetes configuration. Please make sure you’re connected to the correct cluster before proceeding with the installation steps.

The most common example is to install the demo profile of Istio, That can be done with following command:
```
getistio istioctl install --set profile=demo
```

Output: <pre>
$ getistio istioctl install --set profile=demo
This will install the Istio demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) Y
✔ Istio core installed
✔ Istiod installed
✔ Ingress gateways installed
✔ Egress gateways installed
✔ Installation complete </pre>
After the previous step is completed, the validation can be done by confirming the GetIstio and Istio versions installed:
```
getistio version
```
Output:<pre>
$ getistio version
GetIstio version: 0.3.0
Active istioctl: 1.8.2-distro-v0
client version: 1.8.2-distro-v0
control plane version: 1.8.2-distro-v0
data plane version: 1.8.2-distro-v0 (2 proxies)</pre>

In addition  to the version output, a user can confirm that config validation is functioning as expected by issuing the following command:
```
getistio config-validate
```
With fresh install of Kubernetes cluster and Istio, the output will look similar to the below:
<pre>$ getistio config-validate
Running the config validator. This may take some time...

NAMESPACE       NAME    RESOURCE TYPE   ERROR CODE      SEVERITY        MESSAGE
default         default Namespace       IST0102         Info            The namespace is not enabled for Istio injection. Run 'kubectl label namespace default istio-injection=enabled' to
                                                                        enable it, or 'kubectl label namespace default istio-injection=disabled' to explicitly mark it as not needing injection.

The error codes of the found issues are prefixed by 'IST' or 'KIA'. For the detailed explanation, please refer to
- https://istio.io/latest/docs/reference/config/analysis/ for 'IST' error codes
- https://kiali.io/documentation/latest/validations/ for 'KIA' error codes
</pre>
