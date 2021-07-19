---
title: 'Integration with Apache SkyWalking'
date: 2020-01-22
weight: 9
draft: false
---

This is a quick start for Istio integration with [Apache Skywalking](https://skywalking.apache.org/) in your environment .

For the detailed steps please refer to the [blog article](https://skywalking.apache.org/blog/2020-12-03-obs-service-mesh-with-sw-and-als/) on Apache Skywalking website.

To highlight the essential integration steps:

- Install getmesh per [documentation](https://https://istio.tetratelabs.io/getmesh-cli/install-and-update-of-getistio/)
- Deploy Istio using `getmesh` command and enable [Access Log Service (ALS)](https://www.envoyproxy.io/docs/envoy/latest/api-v2/service/accesslog/v2/als.proto) using the following command:

```sh
getmesh istioctl install --set profile=demo \
               --set meshConfig.enableEnvoyAccessLogService=true \
               --set meshConfig.defaultConfig.envoyAccessLogService.address=skywalking-oap.istio-system:11800
```

- Label the application namespace with

```sh
kubectl label namespace <namespace> istio-injection=enabled
```

- Deploy Apache SkyWalking and the Application per the [blog post](https://skywalking.apache.org/blog/2020-12-03-obs-service-mesh-with-sw-and-als/)
- Monitor your application via SkyWalking _WebUI_
