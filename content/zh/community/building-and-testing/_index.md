---
title: "构建和测试"
url: /zh/community/building-and-testing
---

在继续之前，请确保您的机器中具有以下依赖项：

- https://github.com/google/addlicense
- https://github.com/golangci/golangci-lint
- Kubernetes 集群（例如 https://kind.sigs.k8s.io/）

### 运行 linter

在这里，我们使用配置在 `.golangci.yml`中的 `golangci-lint` 进行静态分析，因此请确保已安装。

要运行 linter，只需执行以下命令：

```sh
make lint
```

### 运行单元测试

运行 unittest 不需要任何 Kubernetes 集群，可以通过以下方法完成：

```sh
make unit-test
```

### 编译二进制

```sh
make build
```

### 运行 e2e 测试

运行端到端测试需要您具有有效的 Kubernetes 上下文。请注意，**e2e 将使用默认的 kubeconfig 和默认上下文**。

为了运行 e2e 测试，请执行：

```sh
make e2e-test
```

### 生成自动生成的文档

```sh
make doc-gen
```

### 添加许可证标头

我们要求每个源代码都具有指定的许可证标头。添加标题可以通过： 

```sh
make license
```