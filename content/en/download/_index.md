---
title: "Downloads"
date: 2022-09-06T11:02:05+06:00
icon: "ti-credit-card" # themify icon pack : https://themify.me/themify-icons
description: "Downloads list"
# type dont remove or customize
type : "docs"
weight: 40
---


Currently <strong>Tetrate Istio Distro</strong> runs on Linux and MacOS. To deploy Tetrate Istio Distro, all you need is this one simple command:

```sh
curl -sL https://istio.tetratelabs.io/getmesh/install.sh | bash
```

Please follow [GetMesh and Istio](/getmesh-cli/install) for detailed instruction on downloading and subsequent steps to have Tetrate Istio Distro up and running in your machine.

### Supported Istio Versions
Tetrate Istio Distro tracks Istio upstream releases. As part of Tetrate Istio Distro build pipeline, a series of tests are run to ensure the Istio distro works well on the underlying Kubernetes platform.

Tetrate Istio Distro certified Istio distro has been tested against the following Kubernetes distros (exact support varies on version of Istio used):
- EKS - 1.22 - 1.16
- GKE - 1.22 - 1.16
- AKS - 1.22 - 1.16

While the core features of Istio have been tested and certified against different Kubernetes distros, users are advised to recognize that certain features of Istio stipulate a minimum Kubernetes version (for example K8S CSR API to sign istio workload needs Kubernetes 1.18+) and certain other features would need provider specific configurations to be set (for example enabling Istio CNI plugin)

There are additional download of **Istio distributions and istioctl** binaries for [Linux](#linux-istio-distros), [MacOS]({{< relref "#macos-istio-distros" >}}) and [Windows]({{< relref "#windows-istio-distros" >}}) that you can find in this page. We recommend using GetMesh to obtain the required files.

{{< versions_supported >}}

### Istio Binaries Download

#### Linux Istio Distros

Below you can find direct URL for Istio and istioctl distros: 

[Need a FIPS compliant distribution?](/fips-request/)

{{< downloads linux >}}

#### MacOS Istio Distros

Below you can find direct URL for Istio and istioctl distros: 
{{< downloads osx >}}

#### Windows Istio Distros

Below you can find direct URL for Istio and istioctl distros: 
{{< downloads windows >}}

