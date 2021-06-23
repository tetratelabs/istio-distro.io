---
title: "Quickstart"
date: 2021-01-25T13:00:00+07:00
description: "GetMesh CLI quickstart"
# type dont remove or customize
type : "docs"
---

<h3>Download</h3>

The command below obtains a shell script that downloads and installs GetMesh CLI binary that corresponds to the OS distribution detected by the script (currently MacOS and Linux are supported). Additionally the most recent supported version of Istio is downloaded. Also script adds GetIstio location to PATH variable (re-login is required to get PATH populated)

```
curl -sL https://istio.tetratelabs.io/getmesh/install.sh | bash
```

Output example:

```
$ curl -sL https://istio.tetratelabs.io/getmesh/install.sh | bash
tetratelabs/getmesh info checking GitHub for latest tag
tetratelabs/getmesh info found version: 1.1.1 for v1.1.1/linux/amd64
tetratelabs/getmesh info installed /home/mathetake/./bin/getmesh
```

<h3>Install Istio</h3>

As explained earlier - GetMesh by default communicates to the cluster defined by your Kubernetes configuration. Please make sure you’re connected to the correct cluster before proceeding with the installation steps.

The most command example is to install the demo profile of Istio - that can be done with following command:

```
getmesh istioctl install --set profile=demo
```

Output:

```
$ getmesh istioctl install --set profile=demo
This will install the Istio demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) Y
✔ Istio core installed
✔ Istiod installed
✔ Ingress gateways installed
✔ Egress gateways installed
✔ Installation complete 
```

After the previous step is completed - the validation can be done by confirming GetMesh and Istio version installed:

```
getmesh version
```

Output:

```
$ getmesh version
GetMesh version: 0.3.0
Active istioctl: 1.8.2-distro-v0
client version: 1.8.2-distro-v0
control plane version: 1.8.2-distro-v0
data plane version: 1.8.2-distro-v0 (2 proxies)
```

Additionally to the version output - a user can confirm that config validation is functioning as expected by issuing the following command:

```
getmesh config-validate
```

With fresh install of Kubernetes cluster and Istio - the output will look similar to the below:

```
$ getmesh config-validate
Running the config validator. This may take some time...

NAMESPACE       NAME    RESOURCE TYPE   ERROR CODE      SEVERITY        MESSAGE
default         default Namespace       IST0102         Info            The namespace is not enabled for Istio injection. Run 'kubectl label namespace default istio-injection=enabled' to
                                                                        enable it, or 'kubectl label namespace default istio-injection=disabled' to explicitly mark it as not needing injection.

The error codes of the found issues are prefixed by 'IST' or 'KIA'. For the detailed explanation, please refer to
- https://istio.io/latest/docs/reference/config/analysis/ for 'IST' error codes
- https://kiali.io/documentation/latest/validations/ for 'KIA' error codes
```
