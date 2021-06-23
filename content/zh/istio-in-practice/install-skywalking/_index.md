---
title: "集成 Apache SkyWalking"
date: 2020-01-22
weight: 9
draft: false
---

这是在您的环境中将 Istio 与[Apache Skywalking](https://skywalking.apache.org/)集成的快速入门。

有关详细步骤，请参阅 Apache Skywalking 网站上的[博客文章](https://skywalking.apache.org/blog/2020-12-03-obs-service-mesh-with-sw-and-als/)。

要突出基本的集成步骤：

- 根据[文档](/installing-getistio-cli)安装 getistio
- 使用`getistio`命令部署 Istio，并使用以下命令启用[访问日志服务（ALS）](https://www.envoyproxy.io/docs/envoy/latest/api-v2/service/accesslog/v2/als.proto)：

```sh
getmesh istioctl install --set profile=demo \
               --set meshConfig.enableEnvoyAccessLogService=true \
               --set meshConfig.defaultConfig.envoyAccessLogService.address=skywalking-oap.istio-system:11800
```

- 使用标记应用程序命名空间

```sh
kubectl label namespace <namespace> istio-injection=enabled
```

- 根据[博客文章](https://skywalking.apache.org/blog/2020-12-03-obs-service-mesh-with-sw-and-als/)部署 Apache SkyWalking 和应用程序
- 通过 SkyWalking *WebUI* 监视您的应用程序