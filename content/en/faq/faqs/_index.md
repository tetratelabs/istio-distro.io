---
title: "FAQ"
date: 2018-12-28T11:02:05+06:00
icon: "ti-settings" # themify icon pack : https://themify.me/themify-icons
description: "GetIstio frequently asked questions."
# type dont remove or customize
type : "docs"
weight: 8
---

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


[Project overview](#project-overview)
- [Are you creating a fork of the Istio project?](#are-you-creating-a-fork-of-the-istio-project)
- [Does the GetIstio impact the performance of my application and in what ways?](#does-the-getistio-impact-the-performance-of-my-application-and-in-what-ways)
- [Is there a cost for using GetIstio?](#is-there-a-cost-for-using-getistio)
- [How often do you plan to add new features to GetIstio from the upstream Istio project?](#how-often-do-you-plan-to-add-new-features-to-getistio-from-the-upstream-istio-project)
- [How do I request new features for GetIstio?](#how-do-i-request-new-features-for-getistio)
- [Can we contribute to the work done on GetIstio?](#can-we-contribute-to-the-work-done-on-getistio)

##### What is GetIstio?
Today, we are launching GetIstio, a distribution for Istio upstream components which are tested, optimized, secured and supported by Tetrate. GetIstio provides vetted native versions of Istio for different K8s environments and makes Istio lifecycle management simple and safe.  The initial release is vetted for EKS, EKS-D and provides native integration into AWS KMS. We will incrementally add support for new K8s flavors and new KMS backends. GetIstio will support the last 3 versions as per its support policy and also offers a FIPS compliant version of Istio for FedRAMP environments.

##### Why should I use GetIstio?
You should use GetIstio if you are adopting Istio and need a reliable, and secure distribution to run in AWS, Azure or GCP environment 

##### Is it free?
Yes. GetIstio is a free (as in speech and as in beer) open source project and we welcome community participation and contribution. 

##### What are the supported versions of GetIstio?
Point to the supported platforms page on GitHub project.

##### What are the different components of the GetIstio and how do they compare to Istio upstream?
GetIstio is a distribution of upstream Istio which consists of a CLI, an agent and integration APIs. More details [GetIstio CLI Command Reference](/getistio-cli/reference/getistio), [Cert Integration](/istio-ca-certs-integrations) and [Security Patches](/download).

##### I am using Istio OSS. How do I switch to using getistio?
GetIstio is an upstream distribution of Istio.      

##### I am new to Istio. Where should I start?
We recommend you start with a vetted build for your environment from GetIsito. You get all the features of Isito and peace of mind with it.

##### I am a platform admin trying to streamline Istio binaries in my organization. How should I use GetIstio?
There are multiple ways to leverage GetIstio - please refer to the [command reference](/getistio-cli/reference/getistio) and [tutorials](/istio-tutorials).

##### How will I know if my Istio has CVEs?
If you have [subscribed to community updates](/), GetIstio will notify you of CVEs and Zero day Vulnerabilities.

##### Can GetIstio help me upgrade Istio?
Yes. GetIstio enables seamless upgrades via `getistio upgrade` command. 

### Project overview

#####  Are you creating a fork of the Istio project?
No, we are not creating a fork of the Istio project. We are creating a distribution of the upstream. Any enhancements we make to Istio will be made to the upstream.

##### Does GetIstio impact the performance of my application and in what ways?
No. As an upstream distribution, GetIstio has no performance impact on Istio.

##### How often do you plan to add new features to GetIstio from the upstream Istio project?
GetIstio will make new versions of Istio available as soon as they are available in upstream Istio.

##### How do I request new features for GetIstio?
Our roadmap is public. Please create a feature request and vote for features on the roadmap.

##### Can we contribute to the work done on GetIstio?
Yes, GetIstio is open source and under the Apache License. You can [contribute](/community/building-and-testing) to any components of the GetIstio.

