---
title: "Installation and Update"
date: 2021-01-25T13:00:00+07:00
description: "How to install and update Tetrate Istio Distro"
# type dont remove or customize
type : "docs"
---

Tetrate Istio Distro can be obtained by issuing the following command:

```sh
curl -sL https://dl.getistio.io/public/raw/files/download.sh | bash
```

This, by default, downloads the latest version of Tetrate Istio Distro and certified Istio. To check if the download was successful, run the [version command](/getistio-cli/reference/getistio_version):

```sh
getistio version
```

or

```sh
getistio version --remote=false #only the client version details
```

An output of the form below suggests that Tetrate Istio Distro was installed successfully.
<pre>getistio version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
</pre>

<br />
To see the list of commands available with Tetrate Istio Distro and its supported features, run the [help command](/getistio-cli/reference/getistio_help):

```sh
getistio --help
```

<br />
Once Tetrate Istio Distro is downloaded, it can be self-updated to the latest version by running the [update command](/getistio-cli/reference/getistio_update):

```sh
getistio update
```

<br />
While we recommend always using the latest Tetrate Istio Distro, if the user wants to download a different version of Tetrate Istio Distro for testing or other reasons, they could do so with the following command:
```sh
export GETISTIO_VERSION=<your_version> ##say 0.5.0 for example
curl -sL https://dl.getistio.io/public/raw/files/download.sh | bash
```
This would overwrite the existing version of Tetrate Istio Distro to the one just downloaded.

