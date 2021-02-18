---
title: "GetIstio Overview"
icon: "ti-panel"
description: "Learn more about GetIstio CLI, how to install and manage it."
# type dont remove or customize
type : "docs"
weight: 1
# set these 2 to make it featured in homepage
featured: true
featureOrder: 1
---

GetIstio is the easiest way to get started with Istio and to ensure you're using trusted, supported versions of Istio. Installing and updating GetIstio is as easy as issuing the following command:

```sh
curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
```

### Why Use a CLI?

The GetIstio CLI simplifies installation, management, and upgrades of Istio so that you can get the most of your service mesh and the benefits of open source.

The GetIsio CLI tool supports these enterprise-level requirements as it:
- enforces fetching certified versions of Istio and enables only compatible versions of Istio installation
- allows seamless switching between multiple istioctl versions
- includes a FIPS-compliant flavor
- delivers platform-based Istio configuration validations by integrating validation libraries from multiple sources
- uses a number of cloud provider certificate management systems to create Istio CA certs that are used for signing service mesh managed workloads 
- provides multiple additional integration points with cloud providers

The Istio release schedule can be very aggressive for enterprise lifecycle and change management practices. GetIstio addresses this concern by testing all Istio versions against different Kubernetes distributions for functional integrity. GetIstio’sversions of Istio are actively supported for security patches and other bug updates and have much longer support life than provided by upstream Istio.

## FIPS-Compliant Flavor

Some service mesh customers need to support elevated security requirements. GetIstio addresses compliance by offering two flavors of the Istio distribution:
- *tetrate* tracks the upstream Istio and may have additional patches applied
- *tetratefips* is a FIPS-compliant version of the tetrate flavor

The above functionality is achieved with an elegant transparent approach, where the existing setup and tools are fully leveraged to provide additional functionality and enterprise desired feature sets and controls:
- GetIstio connects to the Kubernetes cluster pointed to by the default Kubernetes config file. If the KUBECONFIG environment variable is set, then it takes precedence.
- Config validation is done against two targets:
    - cluster current config that might include multiple Istio configuration constructs
    - in addition, GetIstio validates the manifest yaml files (that are not applied yet to the cluster)
- Creation of CA cert for Istio assumes the provider set up to issue intermediary CA cert is already done. This is optional and the default is a self signed cert by Istio for workload certificates.
