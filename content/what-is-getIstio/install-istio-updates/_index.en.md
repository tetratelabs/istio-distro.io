---
title: "Install Istio Updates"
date: 2021-01-25T13:00:00+07:00
description: "Detailed Istio update instructions."
# type dont remove or customize
type : "docs"
---

Versions of Istio that are delivered through GetIstio are supported longer than upstream versions and are actively patched for key bug fixes and security updates. To check if your running Istio versions are up to date or if they miss any key security patches run the check-upgrade command. This command connects to the cluster (defined by the kubernetes config of the operator workstation) to verify existing Istio installations, compares those with the latest available GetIstio certified versions and recommends the user with the suggested upgrades. To check for upgrades, run:

```
getistio check-upgrade
```

Output would be something like

> $ getistio check-upgrade<br>
> [General information about your Istio mesh]<br>
> client version: 1.7.6-distro-v0<br>
> control plane version: 1.8.2-distro-v0<br>
> data plane version: 1.8.2-distro-v0 (2 proxies)<br>
> <br>
> [GetIstio Check]<br>
>  1.8.2-distro-v0 is the latest version in 1.8-distro
