---
title: "FAQ"
date: 2018-12-28T11:02:05+06:00
icon: "ti-settings" # themify icon pack : https://themify.me/themify-icons
description: "Cras at dolor eget urna varius faucibus tempus in elit dolor sit amet."
# type dont remove or customize
type : "docs"
weight: 8
---
# Frequently Asked Questions


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
Today, we are launching GetIstio, a distribution for Istio upstream components which are tested, optimized, secured and supported by Tetrate. GetIstio provides vetted native versions of Istio for different K8s environments and makes Istio management easy.  The initial release is vetted for EKS, EKS-D and provides native integration into AWS KMS. We will incrementally add support for new K8s flavors and new KMS backends. GetIstio will support the last 3 versions as per its support policy and also offers a FIPS compliant version of Istio for FedRAMP environments.

##### Why should I use GetIstio?
You should use GetIstio if you are adopting Istio and need a reliable, and secure distribution to run in AWS, Azure or GCP environment 

##### Is it free?
Yes. GetIstio is an open source project and we welcome community additions. 

##### What are the supported versions of GetIstio?
Point to the supported platforms page on github project.

##### What are the different components of the GetIstio and how do they compare to Istio upstream?
GetIstio is a distribution of upstream Istio which consists of a CLI, an agent and integration APIs.
More details (GetIstio CLI Command Reference)[/getistio-cli/reference/getistio] (Cert Integration)[/istio-ca-certs-integrations] and (Security Patches)[/download]

##### What will be free and what will be paid?
The most recent details are [here](https://www.tetrate.io/getistio).

|                                                                       | OSS | Subscription |
|-----------------------------------------------------------------------|:---:|:------------:|
|                           Istio CLI Install                           |  ✅  |       ✅      |
|             Tested for EKS, EKS-D, GKE, AKS, K8s upstream             |  ✅  |       ✅      |
|                         FIPS Compliant Builds                         |     |       ✅      |
|                     Seamless upgrades (CP and DP)                     |  ✅  |       ✅      |
|                 Security Patches of supported versions                |  ✅  |       ✅      |
|                     Certified for diff K8s flavors                    |  ✅  |       ✅      |
|       KMS/CA Integration (3 cloud provider CAs + Vault, Venafi)       |  ✅  |       ✅      |
|                           Config Validation                           |  ✅  |       ✅      |
|                           Commercial Support                          |     |       ✅      |
|              Add ons instructions - Skywalking/Prometheus             |  ✅  |       ✅      |
|              Backport security fixes for Istio and Envoy              |     |       ✅      |
|                      Access to Tetrate User Group                     |     |       ✅      |
|                  Training Credits & Consulting hours                  |     |       ✅      |
|                Marketplace listings - 3 cloud providers               |  ✅  |       ✅      |
|                   Documentation on getistio.io site                   |     |              |
|                  Email notification for security patches and upgrades |  ✅  |       ✅      |

##### I am using Istio OSS. How do I switch to using getistio?
GetIstio is an upstream distribution of Istio.      

##### I am new to Istio. Where should I start?
We recommend you start with a vetted build for your environment from GetIsito. You get all the features of Isito and peace of mind with it.

##### I am a platform admin trying to streamline Istio binaries in my organization. How should I use GetIstio?
There is multiple ways to leverage for your benefits - please refer to the [command reference](/getistio-cli/reference/getistio) and [tutorials](/istio-tutorials)

##### How will I know that my Istio has CVEs?
If you have signed up with your email, GetIstio will notify you of CVEs and Zero day Vulnerabilities.

##### If my upgrade fails, how will Tetrate help me?
GetIstio enables seamless upgrades via getistio upgrade command. 

### Project overview

#####  Are you creating a fork of the Istio project?
No, we are not creating a fork of the Istio project. We are creating a distribution of the upstream. Any enhancements we make to Istio will be made to the upstream.

##### Does the GetIstio impact the performance of my application and in what ways?
No, it does not. 

##### Is there a cost for using GetIstio?
No, there is no cost in using GetIstio standalone. GetIstio commercial subscription is paid and will offer support, access to Tetrate user group and will be paid and it will be possible to buy on tetrate.io and on cloud marketplaces.

##### How often do you plan to add new features to GetIstio from the upstream Istio project?
GetIstio will make new versions of Istio available as soon as they are available in upstream Istio.

##### How do I request new features for GetIstio?
Our roadmap is public. Please create a feature request and vote for features on the roadmap.

##### Can we contribute to the work done on GetIstio?
Yes, GetIstio is open source and under Apache License. You can [contribute](/community/building-and-testing) to any components of the GetIstio.
