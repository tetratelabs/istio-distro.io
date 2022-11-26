---
title: "Install Istio in EKS with add-on"
date: 2021-04-19T13:00:00+07:00
description: "How to use EKS Istio add-on."
# type dont remove or customize
type : "docs"
---
AWS offers EKS addon installation. Which is streamlined process that can be done via AWS web UI or AWS cli.

Check that add-on is available (the AWS Marketplace subscription is required before for TID addon to be deployed in AWS account)

```sh
aws eks describe-addon-versions --addon-name tetrate-io_istio-distro 
```

Deploy TID add-on to the cluster in AWS EKS

```sh
aws eks create-addon --addon-name tetrate-io_istio-distro --cluster-name <CLUSTER_NAME>
```

The installation will take around 2 minutes. To get the current state use the following command. 

```sh
aws eks describe-addon --addon-name tetrate-io_istio-distro --cluster-name  <CLUSTER_NAME>
```

When the add-on is in Active state - you can proceed with deploying applications in Istio-enabled EKS cluster.
