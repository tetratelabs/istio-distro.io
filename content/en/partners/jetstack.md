---

# the name of the partner

title: "Jetstack"

# a quick blurb of what the partner does

description: "Jetstack helps businesses to build and operate modern cloud native infrastructure with Kubernetes"

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

Jetstack helps businesses to build and operate modern cloud native infrastructure with Kubernetes. We’ve been
contributing to the Kubernetes ecosystem since the beginning. We started
[cert-manager](https://github.com/jetstack/cert-manager) as an open source project to improve automation of certificate
management within Kubernetes. Cert-manager builds natively on top of the Kubernetes API and has become the de facto
solution for issuing and renewing certificates from popular public and private certificate issuers.

![Jetstack Secure](/images/jetstack-secure-logo.svg)

[Jetstack Secure](https://jetstack.io/jetstack-secure) builds on top of the
successful cert-manager open source project, now part of the CNCF Sandbox, to
meet the clear need to provide enterprise-grade automation and management of
certificates in Kubernetes and OpenShift cloud native environments. It provides
full visibility of machine identities across multiple clusters and clouds,
providing a detailed view of the cloud native enterprise security posture.
Furthermore, it proactively identifies operational issues based on cert-manager
instance status and health, as well as insecure X.509 certificate configuration.

Working with the Istio community, Jetstack developed
['istio-csr'](https://github.com/cert-manager/istio-csr) to integrate Istio
directly with cert-manager. This open source integration enables workloads in a
mesh to be issued certificates from the wide array of certificate authorities
and providers that the cert-manager community supports, including Venafi, Google
Certificate Authority Service (CAS) and more.

Jetstack Secure extends istio-csr and provides the ability to use externally
issued and managed intermediate CAs for workload signing in the mesh, enabling
certificates to be rooted in an enterprise chain of trust, under the control and
visibility of InfoSec.

### Important Links

- [cert-manager](https://marketplace.venafi.com/details/jetstack-cert-manager/)
- [Jetstack Secure](https://jetstack.io/jetstack-secure)
- [cert-manager + Istio for Gateway](https://istio.io/latest/docs/ops/integrations/certmanager/)
- [cert-manager + Istio for mTLS](https://github.com/cert-manager/istio-csr)
