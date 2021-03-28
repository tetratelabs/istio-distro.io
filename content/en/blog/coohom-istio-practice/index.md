---
title: "How Coohom Uses Istio to Integrate a New Serverless System into its Existing Self-developed Java System"
description: "Istio practice in Coohom."
author: "Ning Luo"
thumbnail: "/images/kujiale.jpg"
tags: ["Istio"]
date: 2021-02-12T10:03:00+08:00
---

[Coohom](coohom.com) successfully launched its home cloud design platform based on the core technology of distributed parallel computing and multimedia data mining. The platform is committed to the research and development of cloud rendering, cloud design, BIM, VR, AR, AI, and other technologies, in order to achieve the experience of “What You See Is What You Get”. It is an SAAS cloud software service platform that generates a design plan in 5 minutes, a rendering in 10 seconds, and a VR plan with a single click.

### Core Issue

The fast-growing business needs of the company have led to the launch of serverless facilities supporting various languages in six domestic and overseas Kubernetes clusters. However, the company already has a mature Java service management system of its own that contains thousands of services deployed on the Kubernetes / KVM platform. Given that their service management systems are starkly different, the core issue is how to successfully enable service calls between them, such that the serverless platform can help make product research and development more efficient.

### Strategies

The Istio-based Knative is the mature open-source serverless facility used by Coohom. In the Kubernetes cluster, Istio provides flexible and powerful dynamic routing/traffic management functions, coupled with some related gateway facilities. This has skillfully resolved the difficulties in enabling calls between services under different systems, while also maintaining the high flexibility and availability under Coohom’s current system.

### Outcomes

With the help of Istio, serverless platform services are seamlessly integrated into the company’s self-developed service management system in the testing, pre-release, and production environments. Mature businesses using Java services do not need to undergo architectural changes. In respect of new businesses on the serverless platform, through languages NodeJS, Python, C++, and Golang, hundreds of services equipped with features such as rapid release and high flexibility can provide efficient production capacities to dozens of business processes.

## Introducing new technologies on mature and complex service management platforms

With many years of experience in back-end services, Coohom has a mature Dubbo-based Java microservice management framework that has been significantly modified according to the company's business needs. The framework is compatible with the hybrid deployment of Kubernetes and KVM. However, as a medium-large innovative start-up company, Coohom has a large number of new business and new products in various departments, and the technical framework and language requirements of businesses (such as the NodeJS service that integrates product design and display requirements with the browser, and the Python and C++ languages that are required by cloud rendering and scientific research departments) constantly evolve. As a result, the language-based approach of embedding JAR packages for service management is no longer capable of meeting the growing business needs.

Since 2017, Coohom has started to use self-developed or third-party hosted Kubernetes clusters as production-level container facilities, which encompass strong upgrade, maintenance, and problem-solving capabilities. On the Kubernetes platform, Istio uses a sidecar to inject services that are completely decoupled from languages, which is currently the best heterogeneous management plan that uses a multi-development language framework. Next, we will discuss how Istio VirtualService can be used as a bridge of communication between hundreds of serverless services and existing Java microservices.

### The KFaas Solution – Using Istio VirtualService to Bridge Communications with Existing Microservices

In Coohom, all traffic from the main website www.coohom.com must pass through the Java gateway service site-gateway under the existing service management system for JWT authentication, filtering, and forwarding to the services in the corresponding cluster according to the rules. Under the current management system, the only services that can accept traffic forwarding are Java services. Under this environment, serverless services are only deployed in the same Kubernetes, and HTTP requests matching the `/faas/api/` rule are subscribed to using the Java services. Then, use SpringCloud zuul to forward the traffic directly to the gateway service in the Istio cluster. (Note that the configuration for cluster-local-gateway is fundamentally the same as that for istio-ingress-gateway. The only difference is that it only accepts traffic from the intranet and can be dynamically scaled according to load.) Lastly, deploy in the cluster used by the serverless service. In this way, the serverless service can be called by the existing management system.

The following is a business use case of a display platform. The service is deployed in a cluster and consists of two parts.

![Coohom serverless functions](008eGmZEly1gnxmlmtms9j32kx0u0n4c.jpg)

**Part 1**: The Knative service deployed in the `faas-alpha` namespace of the Kubernetes cluster has the same access mode in the cluster as the ordinary Kubernetes service, namely `http://saas-showroom.faas-alpha.svc.cluster.local`

**Part 2**: The routing rules of the Istio VirtualService deployed in the Kubernetes cluster `kfaas-system` namespace are:

 ```yaml
 apiVersion: networking.istio.io/v1alpha3
 kind: VirtualService
 metadata:
  name: faas-alpha-ns-saas-showroom-ksvc-virtualservice
  namespace: kfaas-system
 spec:
  gateways:
  - knative-serving/cluster-local-gateway
  - knative-serving/knative-ingress-gateway
  hosts:
  - faas-alpha-ksvc-gateway.kfaas-system.svc.cluster.local
  http:
  - match:
    - uri:
        prefix: /faas/api/saas/showroom/
    rewrite:
      authority: saas-showroom.faas-alpha.svc.cluster.local
    route:
    - destination:
        host: cluster-local-gateway.istio-system.svc.cluster.local
  weight: 100
 ```

- The HTTP path prefix matches `/faas/api/p/saas/virtual-showroom/` (At present, we use the methods of `prefix` and `exact`, and the `regex` matching function will be provided in the future to avoid routing conflicts.) 
- The HTTP host must be `faas-alpha-ksvc-gateway.kfaas-system.svc.cluster.local` (The Kubernetes service is the `external-service` of `cluster-local-gateway`. In a non-production environment, use multiple external-services and multiple test environments to share a `cluster-local-gateway` service under `istio-system`.) 
- Forward the traffic to the target service `saas-showroom.faas-alpha.svc.cluster.local`.
- Retry, delay, and other rules can be added to improve the robustness of request forwarding in the mesh.
- The percentage set by weight will be used in the future to enhance the traffic management capabilities of blue-green releases.

### Calling Existing Java Microservices Using the Serverless Solution

Another Java export gateway service is used here. Since the forwarding and subscription rules are already found in the existing service management system, they will not be detailed here. The serverless approach to access another microservice management system through the entry and exit gateways is known as the “east-west gateway”. Although the rules, usage and formats differ across various management systems, they can be integrated through gateway services compatible with both sides. Calling across systems is commonly seen in the industry, and is also used by some of Coohom’s new subsidiaries or departments to promote compatibility.

### The KFaas Solution and Version Decoupling between Istio / Knative

In 2018, before the release of Istio’s official version 1.0, we had already started conducting trial runs in the test environment. Since version 1.0, the releases evolved in the following sequence in the production environment: 1.0.6 -> 1.1.7 -> 1.4.6 -> 1.5.4 (partial clusters). As for Knative, its development is as follows: 0.8 -> 0.9 -> 0.14 -> 0.15. New versions of Istio / Knative continue to evolve. However, some of our initial practices, such as writing business-related configurations into the `istio-system` namespace, have posed enormous challenges during the updates of incompatible versions. With this in mind, we have specially designed a KFaas solution that not only relies on Istio / Knative facilities, but also decouples from its fixed version. 

The `kfaas-system` namespace includes:

- East-west gateway service for the serverless entry and exit, which can be elastically scaled according to load 
- VirtualService configured by serverless dynamic routing
- Ingress configuration of domain name certificate for specific business-related use or intranet use

### Business Level of Istio VirtualService in Coohom’s Services

Under the current business level of the testing environment, the number of VirtualServices has reached over 700 by the end of 2020.

![Grafana](008eGmZEly1gnwd57tavtj313q0u0u0x.jpg)

### The Future of Service Mesh with Coohom

Coohom uses the Istio service mesh to integrate service clusters under different service management systems, facilitating the implementation of serverless frameworks. With this powerful set of productivity tools, dozens of business lines of the company, including the products and R&D teams, can now work more efficiently than ever before. Coohom’s success story presents an illustrative use case of the application of cloud-native technologies in an SaaS company.

As Coohom’s diversified business lines continue to grow in 2021, the demands for heterogeneous services with multilingual frameworks, fine-grained service management systems, and better business infrastructure are expected to rise. These cloud-native technologies powered by Kubernetes / Istio are bound to create lasting value for Coohom.

**Author**: Luo Ning (罗宁), Senior Development Engineer, Coohom Advanced Technology Engineering Team