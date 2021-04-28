---
title: "Install Istio Updates"
date: 2021-01-25T13:00:00+07:00
description: "Detailed Istio update instructions."
# type dont remove or customize
type : "docs"
---

Versions of Istio that are delivered through Tetrate Istio Distro are supported longer than upstream versions and are actively patched for key bug fixes and security updates. To check if you’re running Istio versions that are up to date or if they’re missing any key security patches, run the [check-upgrade command](/getistio-cli/reference/getistio_check-upgrade). This command connects to the cluster (defined by the Kubernetes config of the operator workstation) to verify existing Istio installations, compares those with the latest available Tetrate Istio Distro certified versions, and recommends suggested upgrades. To check for upgrades, run:

```sh
getistio check-upgrade
```

Output would be something like

```text
$ getistio check-upgrade
[Summary of your Istio mesh]
active istioctl version: 1.8.1-tetrate-v0
data plane version: 1.8.2-tetrate-v0 (2 proxies)
control plane version: 1.8.2-tetrate-v0
[GetIstio Check]

- 1.8.2-tetrate-v0 is the latest version in 1.8-tetrate
```