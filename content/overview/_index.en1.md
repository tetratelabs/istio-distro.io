---
title: "GetIstio Overview"
date: 2018-12-29T11:02:05+06:00
description: "GetIstio overview"
# type dont remove or customize
type : "docs"
---

An integration, and lifecycle management CLI tool that ensures the use of supported and trusted versions of Istio. The enterprises require ability to control istio versioning, support multiple versions of istio, ability to easily move between the versions, integration with cloud providers certification systems and centralized config management and validation. 

The GetIsio CLI tool supports these enterprise level requirements via:

- enforcement of fetching certified versions of Istio and enables only compatible versions of Istio installation
- allows seamlessly switching between multiple istioctl versions
- includes FIPS compliant flavor
- delivers Istio configuration validations platform based by integrating validation libraries from multiple sources
- uses number of cloud provider certificate management systems to create Istio CA certs that are used for signing Service-Mesh managed workloads 
- also provides multiple additional integration points with cloud providers

Istio release schedule can be very aggressive for the enterprise life-cycle and change management practices - GetIstio addresses this concern by testing all Istio versions against different kubernetes distributions for functional integrity. The getistio supported versions of Istio are actively supported for security patches and other bug updates and have much longer support life than provided by upstream Istio.

Considering that some of Service-Mesh customers needs to support elevated security requirements - GetIstio addresses the compliance restriction by offering two flavors of Istio distribution:

- _tetrate_ tracks the upstream Istio and may have additional patches applied
- _tetratefips_ a FIPS compliant version of tetrate flavor

The above functionality is achieved via elegant transparent approach, where the existing setup and tools are fully leveraged to provide additional functionality and enterprise desired feature sets and controls:

- GetIstio connects to the kubernetes cluster pointed to by the default kubernetes config file. If KUBECONFIG environment variable is set, then takes precedence.
- Config validation is done against two targets:
cluster current config that might include multiple istio configuration constructs
in addition GetIstio validates the manifest yaml files (that are not applied yet to the cluster)
- Creation of CA cert for Istio assumes the provider set up to issue intermediary CA cert is already done. This is optional and the default is self signed cert by Istio for workload certificates
