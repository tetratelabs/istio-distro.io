---
title: "Introducing GetIstio"
description: ""
date: "2021-02-10"
author: "Varun Talwar"
# meta description
# thumbnail
thumbnail: "/images/introducing-getistio.png"
tags: ["getisio"]
---
Istio is one of the most popular and [fast-growing](https://octoverse.github.com/2019/) open-source projects in the cloud-native world; while this growth speaks volumes about the value users get from Istio, its rapid release cadence can also be a challenge for users who may be managing several different versions of Istio clusters at the same time and manually configuring CA certificates for cloud platforms.

Tetrate launched a new open-source project called [**GetIstio**](http://www.getistio.io) today, offering users the easiest way to install and upgrade Istio. GetIstio provides a vetted, upstream distribution for Istio — a hardened image of Istio with continued support that is simpler to install, manage, and upgrade. It will have integrations with cloud-native and popular on-prem certificate managers (e.g., AWS ACM, Venafi, etc).

### Overview

GetIstio is an integration and lifecycle management CLI tool that ensures the use of supported and trusted versions of Istio. Enterprises require the ability to control Istio versioning, support multiple versions of Istio, easily move between the versions, integrate with cloud providers’ certification systems, and centralize config management and validation. The GetIsio CLI tool supports these enterprise-level requirements as it:

*   enforces fetching certified versions of Istio and enables only compatible versions of Istio installation
*   allows seamlessly switching between multiple istioctl versions
*   Includes a FIPS-compliant flavor
*   delivers Istio configuration validations platform based by integrating validation libraries from multiple sources
*   uses a number of cloud provider certificate management systems to create Istio CA certs that are used for signing Service-Mesh managed workloads, and
*   provides multiple additional integration points with cloud providers

### Quick start

The command below obtains a shell script that downloads and installs the GetIstio binary that corresponds to the OS distribution detected by the script (currently macOS and Linux are supported). Additionally, the most recent supported version of Istio is downloaded. Also, the script adds the GetIstio location to the PATH variable (re-login is required to get PATH populated)

```bash
curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
```
### Get involved

As part of GetIstio, we are launching a new community for developers and end-users interested in Istio, Envoy, and service mesh, and we welcome anybody and everybody to get involved. The GetIstio.io website includes practical tutorials for using Istio, and we have a new online training on the “Fundamentals of Istio” available at academy.tetrate.io. Join our weekly meetings, file issues, or ask questions in Slack. No contribution is too small– your opinions matter!

GetIstio: [www.getistio.io](http://www.getistio.io)

GetEnvoy: [www.getenvoy.io](http://www.getenvoy.io)

GitHub: [https://github.com/tetratelabs/getistio](https://github.com/tetratelabs/getistio)

Join the [Istio Slack](https://istio.slack.com/) and search for the GetIstio channel to contact us

Get certified on the “Fundamentals of Istio”: [https://academy.tetrate.io](https://academy.tetrate.io)
