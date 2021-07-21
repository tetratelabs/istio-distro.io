---
title: 'Integrate AWS Cloud Map with Istio'
date: 2021-02-01T00:00:00+00:00
weight: 7
draft: false
---

This tutorial describes how to integrate [AWS Cloud Map](https://aws.amazon.com/cloud-map/) with your Istio service mesh.

## Overview

[AWS Cloud Map](https://aws.amazon.com/cloud-map/) is a managed service registry provided by Amazon Web Services(AWS).
If your applications in Istio mesh require accessing to an external service registered in Cloud Map,
then you might want to utilize the endpoint information in Cloud Map. By creating [ServiceEntry](https://istio.io/latest/docs/reference/config/networking/service-entry/)
resources holding the endpoint information in Cloud Map, we can finely control and observe egresses to the service.
However, Istio does not provide the functionality to automatically sync ServiceEntries with the corresponding records in
Cloud Map. That's where [Istio Cloud Map Operator](https://github.com/tetratelabs/istio-cloud-map) comes into play.

Istio Cloud Map Operator is designed for syncing Cloud Map data into Istio by pushing ServiceEntry to the Kube API server.
It periodically checks the Cloud Map resources in AWS, and if there's any update in the information, then it creates/updates
a ServiceEntry resource in the k8s cluster.

## Prerequisites

Before proceeding, make sure you have a Kubernetes cluster with Istio installed.

You can follow the [prerequisites](/istio-in-practice/prerequisites) for instructions on how to install and setup Istio.

## Deploying Istio Cloud Map Operator

To get started we need to download and deploy Istio Cloud Map Operator:

1. Download the manifests located [here](https://github.com/tetratelabs/istio-cloud-map/tree/v0.2.0/kubernetes).

1. Create an AWS IAM identity with read access to AWS Cloud Map for the operator.

1. Modify the YAML file `aws-config.yaml` as follows:

   1. Set the access key used by the operator by updating the values in the secret.

   ```yaml {hl_lines=[7,8]}
   apiVersion: v1
   kind: Secret
   metadata:
     name: aws-creds
   type: Opaque
   data:
     access-key-id: <base64-encoded-IAM-access-key-id> # EDIT ME
     secret-access-key: <base64-encoded-IAM-secret-access-key> # EDIT ME
   ```

   2. Set the target AWS region.

   ```yaml {hl_lines=[6]}
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: aws-config
   data:
     aws-region: us-west-2 # EDIT ME
   ```

1. Apply the modified manifest using Kubernetes CLI.

## Verify the deployment

Assuming that you have the following data in you AWS Cloud Map,

```sh
# list the service in Cloud Map
$ aws servicediscovery list-services | jq '.Services[] | "Name: \(.Name), Id: \(.Id)"'
"Name: getmesh-external-service, Id: srv-ou6hvfmjpls2lev6"

# check namespace of your service
$ aws servicediscovery get-namespace --id $(aws servicediscovery get-service --id srv-ou6hvfmjpls2lev6 | jq -r '.Service.NamespaceId') | jq '.Namespace.Name'
"my-namespace"

# list endpoints
$ aws servicediscovery list-instances --service-id srv-ou6hvfmjpls2lev6 | jq '.Instances[] | .Attributes'
{
  "AWS_INSTANCE_IPV4": "52.192.72.89"
}
```

Then, you can verify the Kubernetes deployment by checking that a ServiceEntry is created, and it contains exactly the same endpoint information as in the AWS Cloud Map.

You can run the following command to get the YAML representation of the resource:

```sh
kubectl get serviceentries.networking.istio.io cloudmap-getmesh-external-service.my-namespace -o yaml
```

Here's how the output from the command above should look like:

```yaml {hl_lines=[13]}
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
spec:
  addresses:
    - 52.192.72.89
  endpoints:
    - address: 52.192.72.89
      ports:
        http: 80
        https: 443
  hosts:
    - getmesh-external-service.my-namespace
  ports:
    - name: http
      number: 80
      protocol: HTTP
    - name: https
      number: 443
      protocol: HTTPS
  resolution: STATIC
```

Note that the host name `getmesh-external-service.my-namespace` is in the follow format: `${Cloud Map's service name}.${service namespace}`.
