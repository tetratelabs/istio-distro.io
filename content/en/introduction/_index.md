---
title: "Introduction"
icon: "ti-panel"
date: 2022-1126-25T13:00:00+07:00
description: "Introduction to Tetrate Istio Distribution"
# type dont remove or customize
type: "docs"
weight: 10
---

Tetrate Istio Distro is an open source project from Tetrate that provides vetted builds of Istio tested against all major cloud platforms. TID provides extended Istio version support beyond upstream Istio (release date plus 14 months). It also includes the GetMesh lifecycle and change management CLI.

The TID Istio distributions are hardened and performant, and are full distributions of the upstream Istio project. 

#### Why use Tetrate Istio Distro?

Users of Tetrate Istio Distro benefit from:

- **GetMesh**: an easy way to install, manage, and update Istio;
- **Tetrate Istio distributions**: whenever you need an Istio distribution that is tested for use in AWS, Azure, GCP or vanilla Kubernetes;
- **Support from the Tetrate Community**: [our community slack channels](https://tetr8.io/tetrate-community) are managed by Tetrate experts who actively participate in the Istio and Envoy projects

#### What Istio distributions are available?

The Istio distributions managed by TID include:

- **Community Istio distributions** - Istio binaries taken directly from the [community Istio project](https://istio.io/latest/docs/releases/supported-releases/)
- **Tetrate Istio distributions** - based on the community project, the Tetrate binaries benefit from longer support windows and additional release testing.
- **Tetrate Istio distributions (FIPS)** - on request, Tetrate can also provide Istio distributions which contain FIPS-compliant cryptographic modules. TIS subscribers obtain FIPS-validated modules and the corresponding FIPS validation certificate.

#### What Environments are Supported?

Tetrate Istio Distro can install and manage Istio on a range of Kubernetes platforms.  Tetrate tests Istio builds on vanilla Kubernetes, Amazon EKS, Azure AKS and Google GKE:

- **Installation**: Istio installation and updates are performed using [**GetMesh**](../getmesh-cli/install-istio/) or [**EKS Addons**](../getmesh-cli/install/install-istio/eks-addon/) (Amazon EKS only)
- **Management**: Istio management is performed using [**GetMesh**](../getmesh-cli/reference/getmesh)

### Components of Tetrate Istio Distro

#### GetMesh

**GetMesh** simplifies installation, management, and upgrades of Istio to help you get started quickly.  It guides you towards certified, compatible Istio software for your clusters. You get:

- certainty from knowing you're installing certified versions of Istio, tested for compatibility with your production clusters
- flexibility to switch easily between different istioctl versions, allowing you to manage multiple different Istio clusters
- confidence in the correctness of your configuration, provided by Istio validation libraries from multiple sources
- rapid security by integrating quickly with external certificate authorities from cloud providers and cert-manager

... plus multiple additional integration points with cloud providers.  The `getmesh` CLI tool runs on Linux and MacOS.

#### Tetrate Istio distributions

The [Istio release schedule](https://istio.io/latest/docs/releases/supported-releases/#support-policy) can be very aggressive for enterprise lifecycle and change management practices. Releases are issued approximately quarterly. Each release is typically supported for 7 months, after which it no longer receive any security updates. 

Tetrate supports and maintains each Istio release for up to 14 months, providing technical support and security updates. This reduces the burden on Enterprises to frequently upgrade and retest their Istio infrastructure.

| Community Istio Lifecycle | Tetrate Istio Lifecycle |
| --- | --- |
| Support provided until 6 weeks after the following N+2 minor release, after which all security updates cease. | Support provided for the 4 most recent Istio releases. All supported releases benefit from base software security updates; all Istio security updates applied to matching Istio releases. |
| Typical support window: up-to 7 months | Typical support window: up-to 14 months |

The Tetrate-provided Istio distributions are rigorously tested against multiple different Kubernetes distributions to ensure continual functional integrity and smooth upgrade experiences.

For a complete list of the currently-supported Istio versions and the associated Kubernetes versions, refer to the notes on the [Downloads](../download/) documentation.

##### FIPS-Compliant and FIPS-Validated Istio distributions

Istio performs mTLS and other cryptographic operations to encrypt and decrypt data. Some environments require enhanced security assurance, and may require the use of FIPS-validated cryptographic software.

On request, Tetrate can provide a FIPS-compliant implementation of each supported Tetrate Istio distribution. These implementations contain a cryptographic module that complies with the requirements of the FIPS-140-2 standard.

Additionally, where an organization is required to demonstrate their use of FIPS-validated software, Tetrate Istio Subscription (TIS) customers benefit from a FIPS-validated module and validation certificate.
