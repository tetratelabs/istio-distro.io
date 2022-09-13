---
title: 'FAQs'
date: 2018-12-28T11:02:05+06:00
icon: 'ti-settings' # themify icon pack : https://themify.me/themify-icons
description: 'Tetrate Istio Distro frequently asked questions.'
# type dont remove or customize
type: 'docs'
weight: 8
---

### General FAQ

- [What is Tetrate Istio Distro?](#what-is-tetrate-istio-distro)
- [Why should I use Tetrate Istio Distro?](#why-should-i-use-tetrate-istio-distro)
- [Is it free?](#is-it-free)
- [What are the supported versions of Tetrate Istio Distro?](#what-are-the-supported-versions-of-tetrate-istio-distro)
- [What are the components of the Tetrate Istio Distro and how do they compare to Istio upstream?](#what-are-the-components-of-tetrate-istio-distro-and-how-do-they-compare-to-istio-upstream)
- [I am currently using the default distros of Istio. How do I switch to using Tetrate Istio Distro?](#i-am-currently-using-the-default-distros-of-istio-how-do-i-switch-to-using-tetrate-istio-distro)
- [I am new to Istio. Where should I start?](#i-am-new-to-istio-where-should-i-start)
- [I am a platform admin trying to streamline Istio binaries in my organization. How should I use Tetrate Istio Distro?](#i-am-a-platform-admin-trying-to-streamline-istio-binaries-in-my-organization-how-should-i-use-tetrate-istio-distro)
- [How can I be alerted to vulnerabilities in my Istio deployments](#how-can-i-be-alerted-to-vulnerabilities-in-my-istio-deployments)
- [Can Tetrate Istio Distro help me upgrade Istio?](#can-tetrate-istio-distro-help-me-upgrade-istio)

### Project FAQ

- [Are you creating a fork of the Istio project?](#are-you-creating-a-fork-of-the-istio-project)
- [Do Tetrate Istio Distro builds have a performance impact?](#do-tetrate-istio-distro-builds-have-a-performance-impact)
- [How often is Tetrate Istio Distro updated?](#how-often-is-tetrate-istio-distro-updated)
- [How do I request features?](#how-do-i-request-features)
- [Can Icontribute to the work done on Tetrate Istio Distro?](#can-i-contribute-to-the-work-done-on-tetrate-istio-distro)

##### What is Tetrate Istio Distro?

Tetrate Istio Distro is:

- An open source project from Tetrate that aims to make adopting, managing, and updating Istio safe and easy.

- [Distros of upstream Istio](/download) that are tested and optimized for specific platforms by Tetrate. Tetrate Istio Distro provides
  vetted builds of Istio for different K8s environments and makes Istio lifecycle management simple and safe.

  We continuously add support for new K8s flavors and new KMS backends. We support the latest three Istio versions per our support policy.
  Tetrate Istio Distro also offers FIPS compliant Istio builds for FedRAMP environments.

- [A CLI](/getmesh-cli) that facilitates acquiring, installing, and configuring multiple Tetrate Istio Distro distros for multiple
  environments.

- [A community of Istio contributors and users](/community) dedicated to helping each other make the practical use of
  Istio a joy.

##### Why should I use Tetrate Istio Distro?

You should use Tetrate Istio Distro if need an Istio distro tested for use in AWS, Azure, or GCP and an easy way to install,
manage, and update Istio in those environments.

##### Is it free?

Yes. Tetrate Istio Distro is an [Apache 2 licenced](https://www.apache.org/licenses/LICENSE-2.0) open source project and
all of the builds are available for free. We welcome community participation and contribution. Join our
[community](/community) for updates on new releases, notifications, and regular community events with Istio
contributors and practitioners.

##### What are the supported versions of Tetrate Istio Distro?

See the [download](/download) page for the current supported distributions.

##### What are the components of Tetrate Istio Distro and how do they compare to Istio upstream?

Tetrate Istio Distro is a distribution of upstream Istio which consists of a CLI, an agent and integration APIs. See the following
for more details:

- [Tetrate Istio Distro CLI Command Reference](/getmesh-cli/reference/getmesh)
- [Cert Integration](/istio-ca-certs-integrations)
- [Security Patches](/download).

##### I am currently using the default distros of Istio. How do I switch to using Tetrate Istio Distro?

Tetrate Istio Distro offers [distros of upstream Istio](/download) in multiple flavors that may be installed using your existing
tooling. You may also use the [`getmesh` CLI](/getmesh-cli) to view the available distros, acquire them, and easily
manage installation, configuration, and upgrade.

##### I am new to Istio. Where should I start?

- Start by downloading the [`getmesh` CLI](/getmesh-cli). This will give you instant access to all of the Tetrate Istio Distro
  builds for the platforms you need.
- The documentation will introduce you to the fundamentals of installing and configuring Istio.
- To get up to speed on Istio quickly, we offer free training at
  [Tetrate Academy](https://academy.tetrate.io/courses/istio-fundamentals)
- To get insights from top Istio contributors and practitioners, [join the Tetrate Istio Distro community](/community) and meet up
  at our regular Tetrate Istio Distro events.

##### I am a platform admin trying to streamline Istio binaries in my organization. How should I use Tetrate Istio Distro?

There are multiple ways to leverage Tetrate Istio Distro. Please see the [command reference](/getmesh-cli/reference/getmesh) and [tutorials](/istio-in-practice).

##### How can I be alerted to vulnerabilities in my Istio deployments?

[Join the Tetrate Istio Distro community](/community) for updates on CVEs and zero-day vulnerabilities.

##### Can Tetrate Istio Distro help me upgrade Istio?

Yes. Tetrate Istio Distro helps you check for available upgrades via the [`getmesh check-upgrade`](/getmesh-cli/reference/getmesh_check-upgrade/) command.

### Project FAQ

##### Are you creating a fork of the Istio project?

No. We provide distributions of upstream tested for specific environments. Any enhancements we make to Istio are applied
to upstream.

##### Do Tetrate Istio Distro builds have a performance impact?

No. As an upstream distribution, Tetrate Istio Distro has no performance impact on Istio.

##### How often is Tetrate Istio Distro updated?

We aim to release TID versions within two weeks of an upstream release.  This is because it takes time to create the extra build types (such as FIPS, arm64 etc) that TID provides and to complete testing.  Where a release contains critical security fixes we apply our best effort to ship the release as soon as possible, starting with the most recent version of Istio.

##### How do I request features?

Create a feature requests and vote for features on [GitHub](https://github.com/tetratelabs/getmesh).

##### Can I contribute to the work done on Tetrate Istio Distro?

Yes. Tetrate Istio Distro is an [Apache 2 licenced](https://www.apache.org/licenses/LICENSE-2.0) open source project. You can
[contribute](/community/contributing) to any component of Tetrate Istio Distro.

#### What is the CMVP number for the FIPS verison of TID?

The FIPS verison of TID embeds BoringCrypto, [cerficiate number 3678](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/3678).

##### How was the FIPS build of TID validated?

The FIPS version of TID was tested by a third party NVLAP accredited lab and shown to faithfully implement its cryptographic and signing functions using the above library.  A letter from the lab is available to customers with a valid support contract, please [contact sales](https://www.tetrate.io/contact-us-sales/) for more details.

