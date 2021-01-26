---
title: "Config Validation"
date: 2018-12-29T11:02:05+06:00
description: "Istio config validation"
# type dont remove or customize
type : "docs"
weight: 2
---

Istio configuration is defined by a set of multiple objects and object types and susceptible for an operator error or architecture oversight - getistio config-validate performs validations of the cluster current config and yaml manifests that are not applied yet. 

The command invokes a series of validations using external sources such as upstream Istio validations, Kiali libraries and GetIstio custom configuration checks. A combined validation output is then sent to the stdout. Custom configuration validation checks are actively being added all the time.

