---
title: "将 AWS Cloud Map 与 Istio 集成"
date: 2021-02-01T00:00:00+00:00
weight: 7
draft: false
---

本教程描述了如何将 [AWS Cloud Map](https://aws.amazon.com/cloud-map/) 与 Istio 服务网格集成。

## 概述

[AWS Cloud Map](https://aws.amazon.com/cloud-map/) 是 Amazon Web Services（AWS）提供的托管服务注册表。如果您在 Istio 网格中的应用程序需要访问在 Cloud Map 中注册的外部服务，那么您可能要利用 Cloud Map 中的终结点信息。通过创建 在 Cloud Map 中保存端点信息的 [ServiceEntry](https://istio.io/latest/docs/reference/config/networking/service-entry/) 资源，我们可以很好地控制和观察服务的出口。但是，Istio 不提供将 ServiceEntries 与 Cloud Map 中的相应记录自动同步的功能。这就是 [Istio Cloud Map Operator](https://github.com/tetratelabs/istio-cloud-map) 发挥作用的地方。

Istio Cloud Map Operator 旨在通过将 ServiceEntry 推送到 Kube API 服务器来将 Cloud Map 数据同步到 Istio。它会定期检查 AWS 中的 Cloud Map 资源，并且如果信息中有任何更新，则它将在 k8s 集群中创建 / 更新 ServiceEntry 资源。

## 先决条件

在继续之前，请确保您已经安装了 Istio 的 Kubernetes 集群。

您可以按照[先决条件](http://localhost:1313/istio-in-practice/prerequisites)获取有关如何安装和设置 Istio 的说明。

## 部署 Istio Cloud Map Operator

首先，我们需要下载并部署 Istio Cloud Map Operator：

1. 下载位于[此处](https://github.com/tetratelabs/istio-cloud-map/tree/v0.2.0/kubernetes)的清单。

2. 创建对操作员具有对 AWS Cloud Map 的读取访问权的 AWS IAM 身份。

3. 修改 YAML 文件`aws-config.yaml`，如下所示：

   1. 通过更新密钥中的值来设置操作员使用的访问密钥。

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: aws-creds
   type: Opaque
   data:
     access-key-id: <base64-encoded-IAM-access-key-id> # EDIT ME
     secret-access-key: <base64-encoded-IAM-secret-access-key> # EDIT ME
   ```

   1. 设置目标 AWS 区域。

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: aws-config
   data:
     aws-region: us-west-2 # EDIT ME
   ```

4. 使用 Kubernetes CLI 应用修改后的清单。

## 验证部署

假设您的 AWS Cloud Map 中包含以下数据，

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

然后，您可以通过检查是否已创建 ServiceEntry 来验证 Kubernetes 部署，该 ServiceEntry 包含与 AWS Cloud Map 中完全相同的终端节点信息。

您可以运行以下命令以获取资源的 YAML 表示形式：

```sh
kubectl get serviceentries.networking.istio.io cloudmap-getmesh-external-service.my-namespace -o yaml
```

上面命令的输出如下所示：

```yaml
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

请注意，主机名`getmesh-external-service.my-namespace`采用以下格式：`${Cloud Map's service name}.${service namespace}`。