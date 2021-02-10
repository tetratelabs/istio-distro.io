---
title: "GCP CA Integration"
date: 2021-01-25T13:00:00+07:00
description: "GCP CA Integration"
# type dont remove or customize
type : "docs"
---

Instead of using a self-signed root certificate, here we get an intermediary Istio certificate authority (CA) from GCP CAS (Certificate Authority Service) to sign the workload certificates.

This approach enables the same root of trust for the root CA's workloads in GCP CAS. As Istio signs the workload certs, the latency for getting workload certs issued is far less than directly getting the certs signed by ACM Private CA itself.

The [`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) command furnishes the options to connect to ACM Private CA and get the intermediary CA cert signed. It uses the certificate details thus obtained to create the **cacerts** Kubernetes secret for Istio to use to sign workload certs. Istio, at startup, checks for the presence of the secret **cacerts** to decide if it needs to use this cert for signing workload certificates.


## Prerequisites

- A CA set up in GCP CAS
- GCP credentials file and the environment variable `GOOGLE_APPLICATION_CREDENTIALS` pointed to the crednetials to get the CSR with CA set signed by the GCP CAS. Refer to the [Getting started with authentication](https://cloud.google.com/docs/authentication/getting-started) documentation on how to setup the GCP credentials.

## Configuration setup 

We can supply parameters related to connecting to GCP CAS and CSR creation through a YAML config file or command-line options. Creating a config file is recommended.

Here's an example of a YAML config file with explained parameters.

```yaml
providerName: "gcp"
providerConfig:
  gcp:
    #This will hold the full CA name for the certificate authority you created on GCP
    casCAName: "projects/{project-id}/locations/{location}/certificateAuthorities/{YourCA}"

certificateParameters:
  secretOptions:
    # Namespace where 'cacerts' Kubernetes secret is created on your target cluster
    istioCANamespace: "istio-system"
    # SecretFilePath is the file path used to store the Kubernetes Secret in yaml format
    secretFilePath:
    # Force flag when enabled forcefully deletes the `cacerts` secret
    # in istioNamespace, and creates a new one.
    force: true
  caOptions:
    # ValidityDays represents the number of validity days before the CA expires.
    validityDays: 365
    # KeyLength is the length(bits) of Key to be created
    keyLength: 2048
    # This is x509.CertificateRequest. Only a few fields are shown below
    certSigningRequestParams:
      subject:
        commonname: "getistio.example.io"
        country:
          - "US"
        locality:
          - "Sunnyvale"
        organization:
          - "Istio"
        organizationunit:
          - "engineering"
      emailaddresses:
        - "youremail@example.io"
```


Once we have the prerequisites satisfied and the config file created, we can run the [`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) command to create the **cacerts** Kubernetes secret. Additoonally, GetIstio  also creates a local YAML file with the secret. GetIstio uses the Kubernetes context to connect to the cluster.

Assuming we saved the above YAML configuration to `gcp-cas-config.yaml`, we can run the following command:

```sh
getistio gen-ca --config-file gcp-cas-config.yaml
```

The GetIstio CLI creates a under `~/.getistio/secret/` and a **cacerts** secret in the Istio's root namespace (`istio-system`).

When `istiod` starts, it will use the certificate from the **cacerts** secret to sign the workload certificates. If you installed Istio before creating the **cacerts** secret, you would have to restart the `istiod` pod.

For a practical walkthrough, refer to the [How to use custom certificate authority? (GCP)](/istio-in-practice/custom-ca-gcp).