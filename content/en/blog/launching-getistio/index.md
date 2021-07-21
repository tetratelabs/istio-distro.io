---
title: 'Introducing GetIstio: the easiest way to get Istio'
description: 'GetIstio is an integration and lifecycle management CLI tool that ensures the use of supported and vetted versions of Istio.'
date: '2021-02-10'
author: '[Varun Talwar](https://www.linkedin.com/in/varuntalwar/)'
# meta description
# thumbnail
thumbnail: '/images/introducing-getistio.png'
alias: '/blog/launching-getisio'
tags: ['getistio']
---

Istio is one of the most popular and <a href="https://octoverse.github.com/2019/" target="_blank">fast growing</a> open-source projects in the
cloud-native world; while this growth speaks volumes about the value users get from Istio, its rapid release cadence can
also be a challenge for users who may be managing several different versions of Istio clusters at the same time and
manually configuring CA certificates for cloud platforms.

### Overview

We launched a new open-source project called GetIstio today, offering users the easiest way to install and upgrade
Istio. GetIstio provides a vetted, upstream distribution of Istio -- a hardened image of Istio with continued support
that is simpler to install, manage, and upgrade. It will have integrations with cloud native and popular on-prem
certificate managers (e.g., AWS ACM, Venafi, etc). This launch includes:

- GetIstio CLI, the easiest way to install, operate, and upgrade Istio. GetIstio provides a safe, vetted, upstream Istio
  distro, tested against AKS, EKS, and GKE.
- A free, online course on Istio Fundamentals, that is available now at [Tetrate Academy](https://academy.tetrate.io/).
- A new community to bring together Istio and Envoy users and technology partners.

### GetIstio CLI

GetIstio is an integration and lifecycle management CLI tool that ensures the use of supported and vetted versions of
Istio. Enterprises require the ability to control Istio versioning, support multiple versions of Istio, easily move
between the versions, integrate with cloud providers’ certification systems, and centralize config management and
validation. The GetIstio CLI tool supports these enterprise-level requirements as it:

- enforces fetching certified versions of Istio and enables only compatible versions of Istio installation
- allows seamlessly switching between multiple istioctl versions
- Includes a FIPS-compliant flavor
- delivers Istio configuration validations platform based by integrating validation libraries from multiple sources
- uses a number of cloud provider certificate management systems to create Istio CA certs that are used for signing
  Service-Mesh managed workloads, and
- provides multiple additional integration points with cloud providers

### Quick start

The command below obtains a shell script that downloads and installs the GetIstio binary that corresponds to the OS
distribution detected by the script (currently macOS and Linux are supported). Additionally, the most recent supported
version of Istio is downloaded. Also, the script adds the GetIstio location to the PATH variable (re-login is required
to get PATH populated)

```bash
 curl -sL https://istio.tetratelabs.io/getmesh/install.sh | bash
```

The following video shows the basic use of the GetIstio command line tool.

<script src="https://asciinema.org/a/390274.js" id="asciicast-390274" data-size="11px" data-speed="2" async></script>

### Get involved

As part of GetIstio we are also launching a new community for developers, end users and technology partners of Istio,
Envoy, and service mesh. Community is open to all. The GetIstio.io website also includes
[practical tutorials](/istio-in-practice/) for using Istio.

If you want to take your learning to the next level, we have also prepared a free <a href="https://certifications.tetrate.io/" target="_blank">Learn Istio Fundamentals course</a> as part of Tetrate Academy. It is a self-paced
course that has 8 modules with theoretical lessons where we explain the theory and concepts, practical lessons which
consist of labs, and quizzes so you can check your knowledge. Join our weekly meetings, file issues, or ask questions in
Slack. No contribution is too small and your opinions and contributions matter!

### GetIstio Subscription

Tetrate provides commercial support for GetIstio for direct access to Istio experts, priority bug fixes and 24/7
support. More details <a href="https://www.tetrate.io/getistio" target="_blank">here</a>.

Related links:

- func-e: <a href="https://func-e.io" target="_blank">func-e.io</a>
- GitHub: <a href="https://github.com/tetratelabs/getistio" target="_blank">github.com/tetratelabs/getistio</a>
- Join the <a href="https://istio.slack.com" target="_blank">Istio Slack</a> and search for the **GetIstio** channel to contact us
- Get certified on the "Fundamentals of Istio": <a href="https://academy.tetrate.io" target="_blank">academy.tetrate.io</a>
- GetIstio Subscription: <a href="https://www.tetrate.io/getistio" target="_blank">tetrate.io/getistio</a>[]()
