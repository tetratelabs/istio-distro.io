---
title: "Once you've installed Istio"
date: 2021-01-25T13:00:00+07:00
description: "Post-install checks with getmesh"
---

Once you have installed Istio, you can use `getmesh` to verify that the installation is operating correctly.

Confirm the `getmesh` and Istio versions using [`getmesh version`](/getmesh-cli/reference/getmesh_version):

```sh
getmesh version
```
Output:<pre>
$ getmesh version
getmesh version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
client version: 1.8.2-tetrate-v0
control plane version: 1.8.2-tetrate-v0
data plane version: 1.8.2-tetrate-v0 (2 proxies)
</pre>

Verify that the Istio configuration is correctly applied, using [`getmesh config-validate`](/getmesh-cli/reference/getmesh_config-validate):

```sh
# for all namespaces
getmesh config-validate
```