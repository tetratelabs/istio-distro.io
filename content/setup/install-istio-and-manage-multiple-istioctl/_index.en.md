---
title: "Install Istio and Manage multiple istioctl"
date: 2021-01-25T13:00:00+07:00
description: "How to install Istio and manage multiple istioctl"
# type dont remove or customize
type : "docs"
---

Downloading GetIstio fetches by default the latest trusted Istio and istioctl. It is recommended to always use getistio to invoke istioctl. getistio not only eases switching between multiple versions of istioctl, but also does version compatibility and configuration checks to ensure only certified Istio is deployed.

With istioctl downloaded, one could go about installing Istio or explore other istioctl commands. For example to install Istio using the demo profile, run the following command:

```
getistio istioctl install --set profile=demo
```

another example would be getting istioctl help (for getistio help use “getistio --help” instead):

```
getistio istioctl --help
```

Refer to [Istio documentation](https://istio.io/latest/docs/reference/commands/istioctl) for the latest istioctl commands and options.

The real life requirements very often dictate the use of a different version of istioctl (than the latest version) or leverage multiple versions of istioctl due custom configuration. Explained below are the steps to achieve that.

List the currently downloaded versions of Istio through GetIstio

```
getistio show
```

Example output would be

```
1.7.6-distro-v0
1.8.1-distro-v0
1.8.2-distro-v0 (Active)
```

If the required version of Istio is not downloaded yet - first the operator can query the list of trusted Istio versions through:

```
getistio list
```

Example output would be

```
ISTIO VERSION   FLAVOR  FLAVOR VERSION   K8S VERSIONS  
   *1.8.2       tetrate       0         1.16,1.17,1.18  
    1.8.1       tetrate       1         1.16,1.17,1.18  
    1.7.6       tetratefips   2         1.16,1.17,1.18  
    1.7.5       tetratefips   3         1.16,1.17,1.18  
    1.7.4       tetrate       0         1.16,1.17,1.18  
```

Below is an example of obtaining version 1..8.1 of Istio:

```
getistio fetch --version 1.8.1 --flavor tetrate --flavor-version 1 
```

In the above, Flavor tetrate maps to upstream Istio with the addition of possible patches and Flavor tetratefips is a FIPS compliant version of tetrate flavor

To learn more about fetch command, run

```
getistio fetch --help
```

Use getistio show to cross check if the Istio version is downloaded and output will list all versions and will mark the active one:

```
$ getistio show
1.7.4-distro-v0
1.7.6-distro-v0
1.8.1-distro-v0 (Active)
1.8.2-distro-v0
```

To switch to a different version of istioctl, run the switch command:

```
getistio switch --version 1.8.1 --flavor tetrate --flavor-version=1
```

Output would be something similar to:

```
istioctl switched to 1.8.1-tetrate-v1 now
```

To learn more about switch command, run

```
getistio switch --help
```