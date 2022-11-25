---
title: "Manage multiple istioctl"
date: 2021-01-25T13:00:00+07:00
description: "How to install Istio and manage multiple istioctl"
# type dont remove or customize
type : "docs"
---

### Supporting Multiple Clusters

The getmesh tool connects to the kubernetes cluster pointed to by the default kubernetes config file. Switch between these using `kubectl config use-context`.

If the `KUBECONFIG` environment variable is set, that then takes precedence.

### Supporting Multiple istioctl versions

We recommend always using `getmesh` to invoke `istioctl`. 

getmesh eases switching between multiple versions of istioctl, and does version compatibility and configuration checks to ensure that only certified Istio is deployed.

Refer to [Istio documentation](https://istio.io/latest/docs/reference/commands/istioctl) for the latest istioctl commands and options.

Real-life requirements very often dictate the use of a different version of istioctl (than the latest version) or leveraging multiple versions of `istioctl` due custom configuration. The steps to achieve that are explained below.

List the currently downloaded versions of Istio through Tetrate Istio Distro using the [show command](/getmesh-cli/reference/getmesh_show):

```sh
getmesh show
```

Example output would be
<pre>
1.7.6-distro-v0
1.8.1-distro-v0
1.8.2-distro-v0 (Active)
</pre>

If the required version of Istio is not yet downloaded, the operator can first query the list of trusted Istio versions through the [list command](/getmesh-cli/reference/getmesh_list):
```sh
getmesh list
```

Example output would be:
<pre>
 ISTIO VERSION   FLAVOR  FLAVOR VERSION   K8S VERSIONS  
    *1.8.2       tetrate       0         1.16,1.17,1.18  
     1.8.1       tetrate       1         1.16,1.17,1.18  
     1.7.6       tetratefips   2         1.16,1.17,1.18  
     1.7.5       tetratefips   3         1.16,1.17,1.18  
     1.7.4       tetrate       0         1.16,1.17,1.18  
</pre>
Below is an example of obtaining version 1.8.1 of Istio by leveraging the [fetch command](/getmesh-cli/reference/getmesh_fetch):

```sh
getmesh fetch --version 1.8.1 --flavor tetrate --flavor-version 0 
```

In the example above, `Flavor tetrate` maps to upstream Istio with the addition of possible patches and `Flavor tetratefips` is a FIPS-compliant version of the `Flavor tetrate`.

Use the [show command](/getmesh-cli/reference/getmesh_show) `getmesh show` to cross check if the Istio version is downloaded and the output will list all versions and mark the active one:

<pre>
$ getmesh show
1.7.4-distro-v0
1.7.6-distro-v0
1.8.1-distro-v0 (Active)
1.8.2-distro-v0
</pre>

To switch to a different version of istioctl, run the [switch command](/getmesh-cli/reference/getmesh_switch) for example:
```sh
getmesh switch --version 1.8.1 --flavor tetrate --flavor-version=0
```

Output would be something similar to:

```
istioctl switched to 1.8.1-tetrate-v0 now
```

