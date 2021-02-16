---
title: "ACM Private CA 集成"
date: 2021-01-25T13:00:00+07:00
description: "与 ACM Private CA 集成。"
# type dont remove or customize
type : "docs"
---

在这里，我们不使用自签名的根证书，而是从 AWS ACM Private CA 服务中获得 Istio 这个中介 CA，再由它来签署工作负载证书。这种方法可以为工作负载提供与 ACM Private CA 中的根 CA 相同的信任根。由于 Istio 自己签署工作负载证书，与直接获得 ACM Private CA 本身签署的证书相比，获得工作负载证书的延迟要少得多。

[`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) 命令提供了连接到 ACM Private CA 并获得中间 CA 证书签名的选项。它使用这样获得的证书细节来创建 `cacerts` Kubernetes  secret，供 Istio 用来签署工作负载证书。Istio 在启动时，会检查 `cacerts` secret 的存在，以决定是否需要使用该 cert 来签署工作负载证书。

## 先决条件

- 在 AWS ACM Private CA 中设置的 CA 和 CA的ARN。
- 附带 `AWSCertificateManagerPrivateCAFullAccess` 和 `AWSCertificateManagerFullAccess` 策略的AWS证书。

## 配置设置

与连接 ACM 私有 CA 和创建 CSR 相关的参数可以通过配置文件或命令行选项提供。建议创建一个配置文件。下面给出一个配置文件的例子，参数是不言自明的。

*acmpca-config.yaml*

```yaml
providerName: "aws"
providerConfig:
  aws:
    signingCAArn: {your acmpca CA ARN}
   # 用于 CSR 的模板。
    templateArn: "arn:aws:acm-pca:::template/SubordinateCACertificate_PathLen0/V1"
   # 可选字段。留空将确实为 SHA256WITHRSA。
   signingAlgorithm: SHA256WITHRSA

certificateParameters:
  secretOptions:
    # 在目标集群上创建 "cacerts" Kubernetes secret 的命名空间。
    istioCANamespace: "istio-system"
    # SecretFilePath 是用于以 yaml 格式存储 Kubernetes Secret 的文件路径。
    secretFilePath:
    # 启用 force 标志后，强制删除 istioNamespace 中的 "cacerts" secret，并创建一个新的 secret。
    overrideExistingCACertsSecret: true # 覆盖现有的 “cacerts” secret，用新的 secret 代替。
  caOptions:
    # ValidityDays 表示 CA 过期前的有效天数。
    validityDays: 365
    # KeyLength 是要创建的 key 的比特位数。
    keyLength: 2048
    # 这是 x509.CertificateRequest。下面只显示了几个字段。
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

一旦我们满足了前提条件并创建了配置文件，我们就可以运行 [`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) 命令来创建 `cacerts` Kubernetes secret 以及 secret 的本地 yaml 文件。`getistio` 连接到你的 Kubernetes 配置指向的集群。

```sh
getistio gen-ca --config-file acmpca-config.yaml
```

运行完该命令，你会发现在 `~/.getistio/secret/` 下创建了一个文件，并且在 `istio-system` 命名空间中创建了 `cacerts` secret。`istiod` 启动后会使用这个证书来签署工作负载证书。
