---
title: "Install and Update GetIstio"
date: 2021-01-25T13:00:00+07:00
description: "How to install and update GetIstio"
# type dont remove or customize
type : "docs"
---

GetIstio can be obtained by issuing the following command:

```sh
curl -sL https://dl.getistio.io/public/raw/files/download.sh | bash
```

This, by default, downloads the latest version of GetIstio and certified Istio. To check if the download was successful, run the [version command](/getistio-cli/reference/getistio_version):

```sh
getistio version
```

or

```sh
getistio version --remote=false #only the client version details
```

An output of the form below suggests that GetIstio was installed successfully.
<pre>getistio version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
</pre>

<br />
To see the list of commands available with GetIstio and its supported features, run the [help command](/getistio-cli/reference/getistio_help):

```sh
getistio --help
```

<br />
Once GetIstio is downloaded, it can be self-updated to the latest version by running the [update command](/getistio-cli/reference/getistio_update):

```sh
getistio update
```

<br />
While we recommend always using the latest GetIstio, if the user wants to download a different version of GetIstio for testing or other reasons, they could do so with the following command:
```sh
export GETISTIO_VERSION=<your_version> ##say 0.5.0 for example
curl -sL https://dl.getistio.io/public/raw/files/download.sh | bash
```
This would overwrite the existing version of GetIstio to the one just downloaded.

