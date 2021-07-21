---
title: "配置验证详情"
date: 2018-12-29T11:02:05+06:00
description: "配置验证的命令用法"
# type dont remove or customize
type : "docs"
---

[`config-validate`](/getmesh-cli/reference/getmesh_config-validate) 命令不限于通过 GetMesh 安装的 Istio 版本，而且适用于所有 Istio 发行版、上游和其他版本。

下面的命令检查应用在 `my-app.yaml` 和 `another-app.yaml` 中定义的 manifest 是否会触发任何验证错误。该命令基于三个来源（Istio 上游、Kiali 和本地 GetMesh）报告结果，而无需应用任何配置更改。它可以防止不必要的停机或可预防的问题影响生产工作负载。

```sh
# 根据当前集群验证本地 manifest
getmesh config-validate my-app.yaml another-app.yaml
```

为方便起见，该命令可以使用指定目录中的所有 manifest，而不是像 operator 那样使用单个文件名。下面的示例从 `my-manifest-dir` 中提取所有 manifest，并检查应用这些 manifest 是否会触发任何验证警报。

```sh
# 根据特定 namespace 中的当前集群验证目录中的本地 manifest
getmesh config-validate -n bookinfo my-manifest-dir/
```

当前实现的配置的验证也是可能的——可以利用下面的命令对集群或每个 namespace 进行验证。

```sh
# 对所有 namespace
getmesh config-validate
```

```sh
# 对特定 namespace
getmesh config-validate -n bookinfo
```

其输出结果将类似于：

```text
NAME                    RESOURCE TYPE           ERROR CODE      SEVERITY        MESSAGE
bookinfo-gateway        Gateway                 IST0101         Error           Referenced selector not found: "app=nonexisting"
bookinfo-gateway        Gateway                 KIA0302         Warning         No matching workload found for gateway selector in this namespace

The error codes of the found issues are prefixed by 'IST' or 'KIA'. For the detailed explanation, please refer to
- https://istio.io/latest/docs/reference/config/analysis/ for 'IST' error codes
- https://kiali.io/documentation/latest/validations/ for 'KIA' error codes
```

