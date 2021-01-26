---
title: "GCP CAS Integration"
date: 2021-01-25T13:00:00+07:00
description: "Istio CA Certificate from GCP CAS"
# type dont remove or customize
type : "docs"
---

Instead of using a self-signed root certificate, here we get an intermediary Istio CA from the GCP CAS service that would in turn be used to sign workloads certificates. This approach enables the same root of trust for the workloads as provided by the root CA in GCP CAS. As Istio itself signs the workload certs, the latency for getting workload certs issued is far less as compared to directly getting the certs signed by GCP CAS itself.<br><br>
The `getistio gen-ca` utility furnishes the options to connect to GCP CAS and get the intermediary CA cert signed. It uses the certificate details thus obtained to create 'cacerts' Kubernetes secret for Istio to use to sign workload certs. Istio, at start up, checks for the presence of the secret 'cacerts' to decide if it needs to use this cert for signing workload certificates.

Prerequisites:
- A CA set up in GCP CAS
- GCP credentials file as pointed by the environment variable "GOOGLE_APPLICATION_CREDENTIALS" to get the CSR with CA bit set signed by GCP CAS. Details on how to obtain the credential file are given here.


Configuration set up:

Parameters related to connecting to GCP CAS and CSR creation can be supplied either through a file or command line options. Creating a config file is recommended.
An example config file is given below and the parameters are self explanatory.

*gcp-cas-config.yaml*
```
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
Once we have the prerequisites satisfied and the config file created, we could run the GetIstio gen-ca command to create 'cacerts' Kubernetes secret as well as a local yaml file of the secret. `getistio` connects to the cluster your Kubernetes configuration points to.

`getistio gen-ca --config-file gcp-cas-config.yaml`

Once the command is run, you will notice a file created under `~/.getistio/secret/` and 'cacerts' secret in istio-system namespace. 'istiod' when started would use this cert to sign workload certificates.

