---
title: "Download"
date: 2021-01-25T13:00:00+07:00
description: "GetIstio download guide"
# type dont remove or customize
type : "docs"
---

The command below obtains a shell script that downloads and installs GetIstio binary that corresponds to the OS distribution detected by the script (currently MacOS and Linux are supported). Additionally the most recent supported version of Istio is downloaded. Also script adds GetIstio location to PATH variable (re-login is required to get PATH populated)

```
curl -sL https://tetrate.bintray.com/getistio/download.sh | bash
```

Output example:

```
$ curl -sL https://tetrate.bintray.com/getistio/download.sh | bash

Downloading GetIstio from https://tetrate.bintray.com/getistio/getistio_linux_amd64_v0.3.0 ...
GetIstio Download Complete!

Updating user profile (/home/user/.bashrc)...
The following two lines are added into your profile (/home/user/.bashrc):

export GETISTIO_HOME="$HOME/.getistio"
export PATH="$GETISTIO_HOME/bin:$PATH"

Downloading latest istio ...

Downloading 1.8.2-distro-v0 from https://tetrate.bintray.com/getistio/istioctl-1.8.2-distro-v0-linux-amd64.tar.gz ...

Istio 1.8.2 Download Complete!

Istio has been successfully downloaded into your system.

Finished installation. Open a new terminal to start using getistio!
```