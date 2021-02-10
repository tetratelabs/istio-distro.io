---
title: "FAQs"
date: 2018-12-28T11:02:05+06:00
icon: "ti-settings" # themify icon pack : https://themify.me/themify-icons
description: "GetIstio frequently asked questions."
# type dont remove or customize
type : "docs"
weight: 8
---
### General FAQ

- [What is GetIstio?](#what-is-getistio)
- [Why should I use GetIstio?](#why-should-i-use-getistio)
- [Is it free?](#is-it-free)
- [What are the supported versions of GetIstio?](#what-are-the-supported-versions-of-getistio)
- [What are the different components of the GetIstio and how do they compare to Istio upstream?](#what-are-the-different-components-of-the-getistio-and-how-do-they-compare-to-istio-upstream)
- [What will be free and what will be paid?](#what-will-be-free-and-what-will-be-paid)
- [I am using Istio OSS. How do I switch to using getistio?](#i-am-using-istio-oss-how-do-i-switch-to-using-getistio)
- [I am new to Istio. Where should I start?](#i-am-new-to-istio-where-should-i-start)
- [I am a platform admin trying to streamline Istio binaries in my organization. How should I use GetIstio?](#i-am-a-platform-admin-trying-to-streamline-istio-binaries-in-my-organization-how-should-i-use-getistio)
- [How will I know that my Istio has CVEs?](#how-will-i-know-that-my-istio-has-cves)
- [If my upgrade fails, how will Tetrate help me?](#if-my-upgrade-fails-how-will-tetrate-help-me)
  
### Project FAQ
- [Are you creating a fork of the Istio project?](#are-you-creating-a-fork-of-the-istio-project)
- [Does the GetIstio impact the performance of my application and in what ways?](#does-the-getistio-impact-the-performance-of-my-application-and-in-what-ways)
- [Is there a cost for using GetIstio?](#is-there-a-cost-for-using-getistio)
- [How often do you plan to add new features to GetIstio from the upstream Istio project?](#how-often-do-you-plan-to-add-new-features-to-getistio-from-the-upstream-istio-project)
- [How do I request new features for GetIstio?](#how-do-i-request-new-features-for-getistio)
- [Can we contribute to the work done on GetIstio?](#can-we-contribute-to-the-work-done-on-getistio)

##### What is GetIstio?
GetIstio is:

* An open source project from Tetrate that aims to make adopting, managing, and updating Istio safe and easy.

* Distros of upstream Istio that are tested and optimized for specific platforms by Tetrate. GetIstio provides 
  vetted native versions of Istio for different K8s environments and makes Istio lifecycle management simple and safe.  
  
  The initial release is vetted for EKS, EKS-D and provides native integration into AWS KMS. We will continuously add 
  support for new K8s flavors and new KMS backends. GetIstio will support the last 3 versions as per its support policy. 
  GetIstio also offers a FIPS compliant Istio builds for FedRAMP environments.

* [A CLI](/getistio-cli) that facilitates acquiring, installing, and configuring multiple GetIstio distros for multiple 
   environments.

* [A community of Istio contributors and users](/community) dedicated to helping each other make the practical use of 
  Istio a joy. 

##### Why should I use GetIstio?
You should use GetIstio if need an Istio distro tested for use in AWS, Azure, or GCP and an easy way to install, 
manage, and update Istio in those environments.

##### Is it free?
Yes. GetIstio is an [Apache 2 licenced](https://www.apache.org/licenses/LICENSE-2.0) open source project and 
all of the builds are available for free. We welcome community participation and contribution. Join our 
[community](/community) for updates on new releases, notifications, and regular community events with Istio 
contributors and practitioners.

##### What are the supported versions of GetIstio?
See the [download](/download) page for the current supported distributions.

##### What are the different components of the GetIstio and how do they compare to Istio upstream?
GetIstio is a distribution of upstream Istio which consists of a CLI, an agent and integration APIs. See the following
for more details:

* [GetIstio CLI Command Reference](/getistio-cli/reference/getistio)
* [Cert Integration](/istio-ca-certs-integrations)
* [Security Patches](/download).

##### I am currently using the default distros of Istio. How do I switch to using GetIstio?
GetIstio offers [distros of upstream Istio](/download) in multiple flavors that may be installed using your existing
tooling. You may also use the [`getistio` CLI](/getistio-cli) to view the available distros, acquire them, and easily 
manage installation, configuration, and upgrade.

##### I am new to Istio. Where should I start?
* Start by downloading the [`getistio` CLI](/getistio-cli). This will give you instant access to all of the GetIstio 
  builds for the platforms you need.

* The documentation will introduce you to the fundamentals of installing and configuring Istio.

* To get up to speed on Istio quickly, we offer free training at 
  [Tetrate Academy](https://academy.tetrate.io/courses/istio-fundamentals)
  
* To get insights from top Istio contributors and practitioners, [join the GetIstio community](/community) and meet up
  at our regular GetIstio events.
  
##### I am a platform admin trying to streamline Istio binaries in my organization. How should I use GetIstio?
There are multiple ways to leverage GetIstio - please refer to the 
[command reference](/getistio-cli/reference/getistio) and [tutorials](/istio-tutorials).

##### How can I be alerted to vulnerabilities in my Istio deployments?
[Join the GetIstio community](/community) for updates on CVEs and zero-day vulnerabilities.

##### Can GetIstio help me upgrade Istio?
Yes. GetIstio enables seamless upgrades via the [`getistio upgrade`](/getistio-cli/reference/getistio_update) command. 

### Project FAQ

#####  Are you creating a fork of the Istio project?
No. We provide distributions of upstream tested for specific environments. Any enhancements we make to Istio are applied 
to upstream.

##### Does GetIstio have a performance impact?
No. As an upstream distribution, GetIstio has no performance impact on Istio.

##### How often are GetIstio distros updated?
We make new GetIstio builds available as soon as they are available in upstream Istio.

##### How do I request features?
Create a feature requests and vote for features on [GitHub](https://github.com/tetratelabs/getistio).

##### Can we contribute to the work done on GetIstio?
Yes. GetIstio is an [Apache 2 licenced](https://www.apache.org/licenses/LICENSE-2.0) open source project. You can 
[contribute](/community/contributing) to any components of GetIstio.

