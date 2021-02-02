---
title: "Config validation details"
date: 2018-12-29T11:02:05+06:00
description: "Command usage for config validation"
# type dont remove or customize
type : "docs"
---


[`config-validate`](/getistio-cli/reference/getistio_config-validate) command is not limited to Istio versions installed via GetIstio and  works well with all Istio distros, upstream and others.

The command below checks if applying manifest that are defined in my-app.yaml and another-app.yaml will trigger any validation errors. The command reports the findings based on three sources (Istio upstream, Kiali and native GetIsito) without applying any configuration changes. It prevents unnecessary downtime or the preventable issues to affect production workloads:

```sh
# validating a local manifest against the current cluster
getistio config-validate my-app.yaml another-app.yaml
```

For convenience the command can use all manifests from the specified directory instead of operator using individual filenames. The example below takes all manifests from my-manifest-dir and checks if applying those manifests triggers any validation alerts:

```sh
# validating local manifests in a directory against the current cluster in a specific namespace
getistio config-validate -n bookinfo my-manifest-dir/
```

The validation of the currently implemented configuration is also possible - can be done clusterwise or per namespace leveraging the commands below:

```sh
# for all namespaces
getistio config-validate
```

```sh
# for a specific namespace
getistio config-validate -n bookinfo
```

The output would look similar to:
<pre>
NAME                    RESOURCE TYPE           ERROR CODE      SEVERITY        MESSAGE
bookinfo-gateway        Gateway                 IST0101         Error           Referenced selector not found: "app=nonexisting"
bookinfo-gateway        Gateway                 KIA0302         Warning         No matching workload found for gateway selector in this namespace

The error codes of the found issues are prefixed by 'IST' or 'KIA'. For the detailed explanation, please refer to
- https://istio.io/latest/docs/reference/config/analysis/ for 'IST' error codes
- https://kiali.io/documentation/latest/validations/ for 'KIA' error codes
</pre>
