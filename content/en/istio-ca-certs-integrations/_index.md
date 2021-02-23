---
title: "Istio CA Certs Integration"
date: 2021-01-25T13:00:00+07:00
description: "Integration with GCP CAS"
# type dont remove or customize
type : "docs"
weight: 3
---

Istio provides different mechanisms to sign workload certificates for the purpose of mutual TLS (mTLS). Here are some of the options:

1. Istio Certificate Authority (CA) uses a self-signed root certificate
1. Istio CA uses an administrator-specified certificate and key with an administrator-specified root certificate
1. Custom CA issues keys and certificate files mounted into the sidecars
1. Experimental Custom CA integration uses Kubernetes CSR API (Kubernetes 1.18+)
1. External CA uses Istio CA gRPC API (either through the Istiod Registration Authority (RA) model or directly authenticating workloads and validating Subject Altenrative Name (SAN))

GetIstio integrates with the Private CA from AWS Certificate Manager, the GCP Certificate Authority Service (CAS), and cert-manager to sign the workload certificates.
