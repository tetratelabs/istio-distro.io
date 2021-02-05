---
title: "配置验证"
date: 2018-12-29T11:02:05+06:00
description: "Istio 配置验证。"
# type dont remove or customize
type : "docs"
weight: 2
---

Istio 配置是由一组多个对象和对象类型定义的，很容易出现操作者错误或架构疏忽。[getistio config-validate](/getistio-cli/reference/getistio_config-validate) 命令对集群的当前配置和尚未应用的 yaml 清单进行验证。

该命令使用外部资源（如上游 Istio 验证、Kiali 库和 GetIstio 自定义配置检查）调用一系列验证。然后组合的验证输出将被发送到 stdout。我们一直在积极添加自定义配置验证检查。