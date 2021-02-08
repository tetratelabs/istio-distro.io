---
title: "Downloads"
date: 2018-12-28T11:02:05+06:00
icon: "ti-credit-card" # themify icon pack : https://themify.me/themify-icons
description: "Downloads list"
# type dont remove or customize
type : "docs"
---


Currently <strong>GetIstio</strong> runs on Linux and MacOS. Please follow [GetIstio Install and Update Page](/getistio-cli/install-istio-updates/) to deploy the product.

GetIstio tracks Istio upstream releases. As part of GetIstio build pipeline, a series of tests are run to ensure the Istio distro works well on the underlying Kubernetes platform.

GetIstio certified Istio distro has been tested against the following Kubernetes distros:
- EKS - 1.18, 1.17, 1.16
- GKE - 1.18, 1.17, 1.16
- AKS - 1.18, 1.17, 1.16

Work is currently underway to add other kubernetes distributions and the more recent versions of kubernetes.

While the core features of Istio have been tested and certified against different Kubernetes distros, users are advised to recognize that certain features of Istio stipulate a minimum Kubernetes version (for example K8S CSR API to sign istio workload needs Kubernetes 1.18+) and certain other features would need provider specific configurations to be set (for example enabling Istio CNI plugin)

There are additional pages that allow download of <strong>Istio distributions and istioctl</strong> binaries for [Linux](linux), [MacOS](macos), and [Windows](windows). We recommend using GetIsio to obtain the required files.

{{< dwn_getistio >}}

