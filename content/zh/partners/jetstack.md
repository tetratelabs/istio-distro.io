---

# the name of the partner

title: "Jetstack"

# a quick blurb of what the partner does

description: "Jetstack 帮助企业利用 Kubernetes 构建和运营现代云原生基础设施。"

# the partner's image logo

logo: "/images/jetstack_logo.png"

# give this the same name as the partner's directory name in ecosystem-partners.

# example here, partner-a is the same name as the partner-a directory.

# all spaces will be automatically converted into hyphens.

docURL: "/jetstack"

# the partner's website

websiteURL: "https://www.jetstack.io/"
websiteTitle: "Website"
twitter: "https://twitter.com/JetstackHQ"
linkedin: "https://www.linkedin.com/company/jetstack/"
github: "https://github.com/jetstack"

# keep this 2 parameters as is.

layout: partner-single

type: "partners"
---

[Jetstack](https://www.jetstack.io/) 帮助企业利用 Kubernetes 构建和运营现代云原生基础设施。团队从一开始就为 Kubernetes 生态系统做出了贡献，并将 [cert-manager](https://github.com/jetstack/cert-manager) 作为一个开源项目，以提高 Kubernetes 内的证书管理自动化。Cert-manager 建立在 Kubernetes API 之上，已经成为流行的公共和私人证书发行商发行和更新证书的事实解决方案。

![Jetstack Secure](/images/jetstack-secure-logo.svg)

[Jetstack Secure](https://jetstack.io/jetstack-secure) 建立在成功的 cert-manager 开源项目（现在是 CNCF 沙盒的一部分）之上，以满足在 Kubernetes 和 OpenShift 云原生环境中提供企业级自动化和证书管理的明确需求。它提供了跨多个集群和云的机器身份的全面可见性，提供了云原生企业安全态势的详细视图。此外，它还能根据证书管理器实例状态和健康状况，以及不安全的 X.509 证书配置，主动识别操作问题。

Jetstack 与 Istio 社区合作，开发了 [istio-csr](https://github.com/cert-manager/istio-csr)，将 Istio 与 cert-manager 直接集成。这种开源集成使服务网格中的工作负载能够从 cert-manager 社区支持的众多证书颁发机构和提供商处获得证书，包括 Venafi、Google 证书颁发机构服务（CAS）等。

Jetstack Secure 扩展了 istio-csr，并提供了在服务网格中使用外部签发和管理的中间 CA 进行工作负载签名的能力，使证书扎根于企业的信任链中，并在 InfoSec 的控制和可见性下。

### 重要链接

- [cert-manager](https://marketplace.venafi.com/details/jetstack-cert-manager/)
- [cert-manager + Istio for Gateway](https://istio.io/latest/docs/ops/integrations/certmanager/)
- [cert-manager + Istio for mTLS](https://github.com/cert-manager/istio-csr)
