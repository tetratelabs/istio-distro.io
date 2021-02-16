---
title: "GCP CAS 集成"
date: 2021-01-25T13:00:00+07:00
description: "GCP CAS 的 Istio CA 证书"
# type dont remove or customize
type : "docs"
---

在这里，我们不使用自签的根证书，而是从 GCP CAS 服务中获得一个中间的 Istio CA，再由它来签署工作负载证书。这种方法使工作负载的信任根与 GCP CAS 中的根 CA 所提供的相同。由于 Istio 自己签署工作负载证书，与直接获得 GCP CAS 本身签署的证书相比，获得工作负载证书的延迟要少得多。

[`getistio gen-ca`](/getistio-cli/reference/getistio_gen-ca) 命令提供了连接到 GCP CAS 并获得中间 CA 证书签名的选项。它使用这样获得的证书细节来创建 `cacerts` Kubernetes secret，供 Istio 用来签署工作负载证书。Istio 在启动时，会检查 `cacerts` secret 的存在，以决定是否需要使用这个 cert 来签署工作负载证书。

## 前提条件

- 在 GCP CAS 中设立了一个 CA
- 环境变量 `GOOGLE_APPLICATION_CREDENTIALS` 所指向的 GCP 凭证文件，以获取由 GCP CAS 签名的 CA 位设置的 CSR。这里给出了获取凭证文件的详细方法。

## 配置设置

与连接到 GCP CAS 和创建 CSR 相关的参数可以通过文件或命令行选项提供。建议创建一个配置文件。
下面给出了一个配置文件的例子，参数是不言自明的。

*gcp-cas-config.yaml*

```yaml
providerName: "gcp"
providerConfig:
  gcp:
    # 这将保存你在 GCP 上创建的证书颁发机构的完整 CA 名称。
    casCAName: "projects/{project-id}/locations/{location}/certificateAuthorities/{YourCA}"

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
getistio gen-ca --config-file gcp-cas-config.yaml
```

运行完该命令，你会发现在 `~/.getistio/secret/` 下创建了一个文件，并且在 `istio-system` 命名空间中创建了 `cacerts` secret。`istiod` 启动后会使用这个证书来签署工作负载证书。
