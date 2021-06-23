---
title: "Installation and Update"
date: 2021-01-25T13:00:00+07:00
description: "How to install and update Tetrate Istio Distro"
# type dont remove or customize
type : "docs"
---

Tetrate Istio Distro can be obtained by issuing the following command:

```sh
curl -sL https://istio.tetratelabs.io/getmesh/install.sh | bash
```

This, by default, downloads the latest version of Tetrate Istio Distro and certified Istio. To check if the download was successful, run the [version command](/getmesh-cli/reference/getmesh_version):

```sh
getmesh version
```

or

```sh
getmesh version --remote=false #only the client version details
```

An output of the form below suggests that Tetrate Istio Distro was installed successfully.
<pre>getmesh version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
</pre>

<br />
To see the list of commands available with Tetrate Istio Distro and its supported features, run the [help command](/getmesh-cli/reference/getmesh_help):

```sh
getmesh --help
```

<br />

