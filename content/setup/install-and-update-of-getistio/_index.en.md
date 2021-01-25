---
title: "Install and Update of GetIstio"
date: 2021-01-25T13:00:00+07:00
description: "How to install and update GetIstio"
# type dont remove or customize
type : "docs"
---

As previously discussed GetIstio can be obtained by issuingthe following command:

```
curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
```

This by default downloads the latest version of GetIstio and certified Istio. To check if the download was successful, run the version command

```
getistio version
```

or

```
getistio version --remote=false #only the client version details
```

An output of the form below suggests that GetIstio was installed successfully

```
GetIstio version: 0.3.0 ...
```

To know the list of commands available with GetIstio and the supported features, run:

```
getistio --help
```

Once GetIstio is downloaded, it can be self-updated to the latest version by running the command:

```
getistio upgrade
```

While we recommend always using the latest GetIstio, for testing or other reasons if the user wants to download a different version of GetIstio, they could do so with the following command:

```
export GETISTIO_VERSION=<your_version> ##say 0.2.0 for example
curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
```

This would overwrite the existing version of GetIstio to the one just downloaded.
