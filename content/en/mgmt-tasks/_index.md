---
title: "Common Management Tasks"
date: 2021-01-25T13:00:00+07:00
description: "Using GetMesh to perform common management tasks"
# type dont remove or customize
type : "docs"
weight: 12
featured: true
featureOrder: 1
---

GetMesh simplifies the management of Istio clusters. It is used by platform operators to quickly and reliably maintain an installation, apply upgrades and perform quick troubleshooting operations.

In this section, you'll discover how to:

- [Apply Upgrades](./install-istio-updates): Inspect a running Istio installation on a Kubernetes cluster to determine if there are applicable upgrades.  You can then acquire the updated Istio binaries and apply the upgrade using GetMesh;
- [Manage Multiple Clusters and Versions](./install-istio-and-manage-multiple-istioctl): Use a single GetMesh instance to manage multiple clusters, and to switch quickly and safely between different `istioctl` clients.  GetMesh will always check version compatibility to avoid user errors;
- [Validate Istio Configurations](./config-validation): Use `getmesh config-validate` to check both applied configuration and pending changes, using a broad set of validation checks

