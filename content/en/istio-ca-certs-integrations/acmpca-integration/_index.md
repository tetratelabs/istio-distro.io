---
title: "AWS CA Integration"
date: 2021-01-25T13:00:00+07:00
description: "AWS CA Integration"
# type dont remove or customize
type : "docs"
---

Instead of using a self-signed root certificate, here we get an intermediary Istio certificate authority (CA) from AWS ACM (Amazon Certificate Manager) Private CA service to sign the workload certificates.

This approach enables the same root of trust for the root CA's workloads in ACM Private CA. As Istio signs the workload certs, the latency for getting workload certs issued is far less than directly getting the certs signed by ACM Private CA itself.

The [`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) command furnishes the options to connect to ACM Private CA and get the intermediary CA cert signed. It uses the certificate details thus obtained to create the **cacerts** Kubernetes secret for Istio to use to sign workload certs. Istio, at startup, checks for the presence of the secret **cacerts** to decide if it needs to use this cert for signing workload certificates.

## Prerequisites

- A CA set up in AWS ACM Private CA and the Amazon Resource Name (ARN) of the CA
- AWS credentials with the `AWSCertificateManagerPrivateCAFullAccess` and `AWSCertificateManagerFullAccess` policy attached. Refer to the [Configuring  the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) documentation on how to set up the credentials.

## Configuration setup

We can supply parameters related to connecting to ACM Private CA and CSR creation through a YAML config file or command-line options. Creating a config file is recommended.

Here's an example of a YAML config file with explained parameters.

```yaml
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
```

Once we have the prerequisites satisfied and the config file created, we can run the [`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) command to create the **cacerts** Kubernetes secret. Additionally, GetIstio also creates a local YAML file with the secret. GetIstio uses the current Kubernetes context to connect to the cluster.

Assuming we saved the above YAML configuration to `acm-ca-config.yaml`, we can run the following command:

```sh
getistio gen-ca --config-file acm-ca-config.yaml
```

The GetIstio CLI creates a under `~/.getistio/secret/` and a **cacerts** secret in the Istio's root namespace (`istio-system`).

When `istiod` starts, it will use the certificate from the **cacerts** secret to sign the workload certificates. If you installed Istio before creating the **cacerts** secret, you would have to restart the `istiod` pod.

For a practical walkthrough, refer to the [How to use custom certificate authority? (ACM)](/istio-in-practice/custom-ca-aws).