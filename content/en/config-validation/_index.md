---
title: "Config Validation"
date: 2018-12-29T11:02:05+06:00
description: "Istio config validation"
# type dont remove or customize
type : "docs"
weight: 2
---

Istio configuration is defined by a set of multiple objects and object types and is susceptible to operator error or architecture oversight. The [getmesh config-validate command](/getistio-cli/reference/getistio_config-validate) performs validations of the cluster's current config and yaml manifests that are not applied yet. 

The command invokes a series of validations using external sources such as upstream Istio validations, Kiali libraries, and Tetrate Istio Distro custom configuration checks. A combined validation output is then sent to the stdout. Custom configuration validation checks are actively being added all the time.

