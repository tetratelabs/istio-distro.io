---
title: "Istio CA Certs 集成"
date: 2021-01-25T13:00:00+07:00
description: "Integration with GCP CAS"
# type dont remove or customize
type : "docs"
weight: 3
---

Istio provides different mechanisms to sign workload certificates for mTLS capability. Some of the options are:
<ol>
  <li> Istio CA uses a self-signed root certificate</li>
  <li> Istio CA uses an administrator-specified certificate and key with an administrator-specified root certificate</li>
  <li> Custom CA issues keys & certs files mounted onto the sidecars </li>
  <li> Experimental Custom CA integration uses Kubernetes CSR API (Kubernetes 1.18+)</li>
  <li> External CA uses Istio CA gRPC API (either through Istiod RA model or directly authenticating workloads and validating SAN)</li>
</ol>
GetIstio facilitates the custom CA options by providing various integration choices, including deploying Vendor agents for the purpose.
