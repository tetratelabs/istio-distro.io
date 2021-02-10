---
title: "How to use custom certificate authority? (AWS)"
date: 2021-01-01T11:02:05+06:00
weight: 8
draft: false
---

Using GetIstio you can connect to AWS Certificate Manager (ACM) Private CA and get the intermediary CA certs signed.

## Prerequisites

To follow this tutorial, you will need an AWS account and a Kubernetes cluster with Istio installed.

You can follow the [prerequisites](/istio-in-practice/prerequisites) for instructions on how to install and setup Istio.

### Setting up ACM Private CA

The first thing we need is to set up the ACM Private CA in AWS Console. Log in to your AWS account and follow the steps below to create an ACM Private CA instance.

1. From the services dropdown, select **Certificate Manager** under Security, Identity, & Compliance.
1. Click **Get started** button under **Private certificate authority**.
1. Select the **Root CA** on the certificate authority (CA) type step, and click **Next**.
1. Configure the CA name (you can use your values here):
    1. For **Organization (O)**, enter **ACME org**.
    1. You can skip the Organization unit, Country name, State, and Locality name, as they are optional.
    1. For **Common name (CN)**, enter **acmeorg.example.com**.
    1. Click **Next**.
1. Configure the CA key size and algorithm:
    1. Click **Advanced** to expand the options.
    1. Select **RSA 2048**.
    1. Click **Next**.
1. On the "Configure certificate revocation" step, click **Next**.
1. On the "Add tags" step, click **Next**.
1. On the "Configure CA permissions" step, click **Next**.
1. On the "Review" step, select the confirmation check box, and click **Confirm and create** button to create ACM Private CA.
1. Click the **Create** button to create the CAS.

Before ACM Private CA can start issuing certificates, you need to activate by installing a CA certificate. 

1. From the "Private CAs" page, click the **Install a CA certificate to active your CA** link.
1. Change the validity to **364 days**.
1. Click **Next**.
1. Click the **Confirm and install** button to generate, and install the root CA certificate.

The figure below shows the Private CA page.  Note that yours might look different if you configured your own CA subject name.

![Private CA Page](./acm-private-ca.png)

### Configure AWS credentials

Ensure you have AWS credentials set up with the `AWSCertificateManagerPrivateCAFullAccess` and `AWSCertificateManagerFullAccess` policy attached on a machine you're accessing the Kubernetes cluster from. Alternatively, if you installed GetIstio on AWS Cloud Shell, the credentials are already set up.

## Creating ACM Private CA configuration

We will use a YAML configuration to configure ACM. Use the YAML below as a template, and enter the ACM information from the AWS console:
 
```yaml
providerName: "aws"
providerConfig:
  aws:
    # You can get the ARN value from the Details page of your private certificate authority 
    signingCAArn: "arn:aws:acm-pca:us-east-2:859085711342:certificate-authority/4cbb144c-2164-4683-ac9e-eaa25e72b85e"
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
    # Replace with the value selected during CAS creation
    validityDays: 364
    # KeyLength is the length(bits) of Key to be created
    keyLength: 2048
    # This is x509.CertificateRequest. Only a few fields are shown below
    certSigningRequestParams:
      subject:
        commonname: "acmeorg.example.com"
        organization:
          - "ACME org"
        # You can also enter any optional fields if you defined them in CAS
        # organizationunit:
        #   - "engineering"
        # country:
        #   - "US"
        # locality:
        #   - "Sunnyvale"
      emailaddresses:
        - "hello@example.com"
```

Save the above file to `aws-acm-config.yaml` and use `gen-ca` command to create the `cacert`:

```sh
getistio gen-ca --config-file aws-acm-config.yaml
```

The command output should look similar to this:

```text
Kubernetes Secret YAML created successfully in /home/user/.getistio/secret/getistio-740905469.yaml
Kubernetes Secret created successfully with name: cacerts, in namespace: istio-system
```

Before continuing, make sure to delete the `istiod` Pod in the `istio-system` namespace to force it to use the created `cacerts`.

### Try it out

If you've labeled the `default` namespace for automatic sidecar injection (see [Prerequisites](/istio-in-practice/prerequisites)), we can then deploy a sample Hello world application:

```sh
kubectl create deploy helloworld --image=gcr.io/tetratelabs/hello-world:1.0.0
```

Wait for the Pod to start and then get the certificate chain and CA root certificate proxies use for mTLS. We will save them in the `proxy_secret` file:

```sh
getistio istioctl pc secret [pod-name] -o json > proxy_secret
```

The CA root certificate is base64 encoded in the `trustedCA` field. For example:

```text {hl_lines=[11]}
...
{
            "name": "ROOTCA",
            "versionInfo": "2021-02-08 22:42:32.301677034 +0000 UTC m=+0.917666618",
            "lastUpdated": "2021-02-08T22:42:32.310Z",
            "secret": {
                "@type": "type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.Secret",
                "name": "ROOTCA",
                "validationContext": {
                    "trustedCa": {
                        "inlineBytes": "<base64 encoded value>"
                    }
                }
            }
```

Store the decoded value to the `encodedCA.crt` file and then use `openssl` to decrypt the certificate into a more readable form:

```sh
openssl x509 -text -noout -in  encodedCA.crt
```

The output will include the common name, organization and other values we set in the CAS:

```text {hl_lines=[7,11]}
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            94:d9:65:d0:b0:42:ac:31:70:f8:9f:84:02:6b:b1:d7:8d:2e:cb:c8
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: O = ACME org, CN = acmeorg.example.com
        Validity
            Not Before: Feb  8 22:23:59 2021 GMT
            Not After : Jan 27 22:23:59 2031 GMT
        Subject: O = ACME org, CN = acmeorg.example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
...
```