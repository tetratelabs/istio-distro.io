---
title: "Install Istio Updates"
date: 2021-01-25T13:00:00+07:00
description: "Detailed Istio update instructions."
# type dont remove or customize
type : "docs"
---

Versions of Istio that are delivered through Tetrate Istio Distro are supported longer than upstream versions and are actively patched for key bug fixes and security updates. To check if you’re running Istio versions that are up to date or if they’re missing any key security patches, run the [check-upgrade command](/getmesh-cli/reference/getmesh_check-upgrade). This command connects to the cluster (defined by the Kubernetes config of the operator workstation) to verify existing Istio installations, compares those with the latest available Tetrate Istio Distro certified versions, and recommends suggested upgrades. To check for upgrades, run:

```sh
getmesh check-upgrade
```

Output would be something like

```text
$ getmesh check-upgrade
[Summary of your Istio mesh]
active istioctl version: 1.13.2-tetratefips-v0
data plane version: 1.13.2-tetratefips-v0 (9 proxies)
control plane version: 1.13.2

[GetMesh Check]
[WARNING] the upstream istio distributions are not supported by check-upgrade command: 1.13.2. Please install distributions with tetrate flavor listed in `getmesh list` command
- There is the available patch for the minor version 1.13-tetratefips. We recommend upgrading all 1.13-tetratefips versions -> 1.13.3-tetratefips-v0
```

Fetch the latest istio version

```sh
getmesh fetch --version 1.13.3 --flavor tetratefips
```

Output would be something like

```text
$ getmesh fetch --version 1.13.3 --flavor tetratefips
fallback to the flavor 0 version which is the latest one in 1.13.3-tetratefips
1.13.3-tetratefips-v0 already fetched: download skipped
For more information about 1.13.3-tetratefips-v0, please refer to the release notes:
- https://istio.io/latest/news/releases/1.13.x/announcing-1.13.3/

istioctl switched to 1.13.3-tetratefips-v0 now
```

Upgrade istio control plane and gateway proxies

```sh
getmesh istioctl upgrade  --set profile=demo --set hub=containers.istio.tetratelabs.com --set tag=1.13.3-tetratefips-v0-distroless
```

Output would be something like

```text
$ getmesh istioctl upgrade  --set profile=demo --set hub=containers.istio.tetratelabs.com --set tag=1.13.3-tetratefips-v0-distroless
WARNING: Istio control planes installed: 1.13.2.
WARNING: A newer installed version of Istio has been detected. Running this command will overwrite it.
This will install the Istio 1.13.3 demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) y
✔ Istio core installed
✔ Istiod installed
✔ Egress gateways installed
✔ Ingress gateways installed
✔ Installation complete
```

Manually update all the application sidecar proxies to new release

```sh
kubectl rollout restart deployment <application deployment name>  -n <namespace>
```

Output would be something like

```text
$ kubectl rollout restart deployment productpage-v1 ratings-v1 reviews-v1 reviews-v2 reviews-v3  -n bookinfo
deployment.apps/productpage-v1 restarted
deployment.apps/ratings-v1 restarted
deployment.apps/reviews-v1 restarted
deployment.apps/reviews-v2 restarted
deployment.apps/reviews-v3 restarted
```

