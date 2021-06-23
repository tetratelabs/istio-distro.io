---
title: 先决条件
date: 2021-01-01T11:02:05+06:00
draft: false
weight: 1
---

要在实践教程中遍历 Istio，我们将需要 Kubernetes 集群和 Istio 的运行实例。

## 1. Kubernetes 集群

所有云提供商都已管理了 Kubernete 集群产品，我们可以用来安装 Istio 服务网格。

我们还可以使用以下平台之一在您的计算机上本地运行 Kubernetes 集群：

- [迷你库](https://istio.io/latest/docs/setup/platform-setup/minikube/)
- [Docker 桌面](https://istio.io/latest/docs/setup/platform-setup/docker/)
- [种类](https://istio.io/latest/docs/setup/platform-setup/kind/)
- [MicroK8s](https://istio.io/latest/docs/setup/platform-setup/microk8s/)

使用本地 Kubernetes 群集时，请确保您的计算机满足 Istio 安装的最低要求（例如 16384 MB RAM 和 4 个 CPU）。此外，请确保 Kubernetes 集群版本为 v1.19.0 或更高版本。

### 安装 Kubernetes CLI

如果您需要安装 Kubernetes CLI，请按照[以下说明进行操作](https://kubernetes.io/docs/tasks/tools/install-kubectl/)。

我们可以运行 `kubectl version` 以检查是否已安装 CLI。您应该看到类似于以下内容的输出：

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.2", GitCommit:"f5743093fd1c663cb0cbc89748f730662345d44d", GitTreeState:"clean", BuildDate:"2020-09-16T21:51:49Z", GoVersion:"go1.15.2", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.0", GitCommit:"e19964183377d0ec2052d1f1fa930c4d7575bd50", GitTreeState:"clean", BuildDate:"2020-08-26T14:23:04Z", GoVersion:"go1.15", Compiler:"gc", Platform:"linux/amd64"}
```

## 2. 使用 GetIstio 安装 Istio

GetIstio 是开始使用 Istio 的最简单方法。设置 Kubernetes 集群后，可以下载 [GetIstio](https://getistio.io/)：

```sh
curl -sL https://istio.tetratelabs.io/getmesh/install.sh | bash
```

最后，要安装 Istio 的演示配置文件，请使用以下命令：

```sh
getistio istioctl install --set profile=demo
```

## 3. 标记用于 Istio 边车注入的命名空间

我们需要标记希望 Istio 自动将 Sidecar 代理注入 Kubernetes 部署的命名空间。

要标记 `kubectl label` 命名空间，我们可以使用命令并`default`用名为的标签标记命名空间（在我们的示例中）`istio-injection=enabled`：

```sh
kubectl label namespace default istio-injection=enabled
```

## 4. 安装 Hello world 应用程序（可选）

作为要在群集上部署的示例，您可以使用 Hello World Web 应用程序。您可以从中提取镜像 `gcr.io/tetratelabs/hello-world:1.0.0`，并使用以下命令创建 Kubernetes 部署和服务。

```sh
kubectl create deploy helloworld --image=gcr.io/tetratelabs/hello-world:1.0.0 --port=3000
```

将以下 YAML 复制到 `helloworld-svc.yaml` 并使用进行部署 `kubectl apply -f helloworld-svc.yaml`。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: helloworld
  labels:
    app: helloworld
spec:
  ports:
  - name: http
    port: 80
    targetPort: 3000
  selector:
    app: helloworld
```

要从外部 IP 访问服务，我们还需要一个网关资源：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: public-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - '*'
```

将上述 YAML 保存到 `gateway.yaml` 并使用进行部署 `kubectl apply -f gateway.yaml`。

现在，我们可以通过外部 IP 地址访问已部署的 Hello World Web 应用程序。您可以使用以下命令获取 IP 地址：

```sh
kubectl get svc istio-ingressgateway -n istio-system  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

[
](http://localhost:1313/zh/istio-in-practice/)
