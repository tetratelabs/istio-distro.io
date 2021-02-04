---
title: "ACM Private CA Integration"
date: 2021-01-25T13:00:00+07:00
description: "Integration with ACM Private CA"
# type dont remove or customize
type : "docs"
---

Instead of using a self-signed root certificate, here we get Istio an intermediary CA from AWS ACM Private CA service that would in turn be used to sign workloads certificates. This approach enables the same root of trust for the workloads as provided by the root CA in ACM Private CA. As Istio itself signs the workload certs, the latency for getting workload certs issued is far less as compared to directly getting the certs signed by ACM Private CA itself.

The [`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) command furnishes the options to connect to ACM Private CA and get the intermediary CA cert signed. It uses the certificate details thus obtained to create the 'cacerts' Kubernetes secret for Istio to use to sign workload certs. Istio, at start up, checks for the presence of the secret 'cacerts' to decide if it needs to use this cert for signing workload certificates.

Prerequisites:
- A CA set up in AWS ACM Private CA and the ARN for the CA
- AWS credentials with the `AWSCertificateManagerPrivateCAFullAccess` and `AWSCertificateManagerFullAccess` policy attached

Configuration set up:
Parameters related to connecting to ACM Private CA and CSR creation can be supplied either through a config file or command line options. Creating a config file is recommended.
An example config file is given below and the parameters are self explanatory.

*acmpca-config.yaml*
<pre>
providerName: "aws"
providerConfig:
  aws:
    signingCAArn: {your acmpca CA ARN}
   # template to use for the CSR.
    templateArn: "arn:aws:acm-pca:::template/SubordinateCACertificate_PathLen0/V1"
   # Optional field. If left blank would default to SHA256WITHRSA
   signingAlgorithm: SHA256WITHRSA

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
</pre>

Once we have the prerequisites satisfied and the config file created, we could run the [`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) command to create the 'cacerts' Kubernetes secret as well as a local yaml file of the secret. `getistio` connects to the cluster your Kubernetes configuration  points to.
```sh
getistio gen-ca --config-file acmpca-config.yaml
```

Once the command is run, you will notice a file created under `~/.getistio/secret/` and 'cacerts' secret in istio-system namespace. 'istiod' when started would use this cert to sign workload certificates.

