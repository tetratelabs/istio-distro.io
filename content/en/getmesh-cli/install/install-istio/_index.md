---
title: "Install Istio"
date: 2022-11-26T06:33:01+0700
description: "How to install Istio with GetMesh CLI"
---
Tetrate Istio Distro by default communicates to the cluster defined by your Kubernetes configuration. 

Before proceeding, please:

- make sure your current `kubernetes context` points to the correct cluster
- the required `version` and `flavor` of Istio version are set. The chosen version/flavor will be applied to the all following commands. Below is the example of the command sequence.
  - first list available versions using [getmesh list](/getmesh-cli/reference/getmesh_list) command, output of the command will list all the versions available and highlights the current version with asterix (__*__)

    ```sh
    getmesh list
    ```

    ```pre
    ISTIO VERSION     FLAVOR        FLAVOR VERSION     K8S VERSIONS     
    1.16.0         tetrate             0         1.22,1.23,1.24,1.25
    1.16.0       tetratefips           0         1.22,1.23,1.24,1.25
    1.16.0          istio              0         1.22,1.23,1.24,1.25
    1.15.3         tetrate             0         1.22,1.23,1.24,1.25
    1.15.3       tetratefips           0         1.22,1.23,1.24,1.25
    1.15.3          istio              0         1.22,1.23,1.24,1.25
    1.15.1         tetrate             0         1.22,1.23,1.24,1.25
    1.15.1       tetratefips           0         1.22,1.23,1.24,1.25
    1.15.1          istio              0         1.22,1.23,1.24,1.25
    *1.14.5         tetrate             0         1.21,1.22,1.23,1.24
    1.14.5       tetratefips           0         1.21,1.22,1.23,1.24
    1.14.5          istio              0         1.21,1.22,1.23,1.24
    ...
    ```

  - Change `getmesh` to the desired version by issuing [getmesh switch](/getmesh-cli/reference/getmesh_list) command. (e.g. to set the desired version to `1.15.3` and flavor to `tetrate` - the following command will be issued:

    ```sh
    getmesh switch --version 1.15.3 --flavor=tetrate    
    ```

    the confirmation will look like the following:

    ```
    istioctl switched to 1.15.3-tetrate-v0 now
    ```

To install the demo profile of Istio, That can be done using [getmesh istioctl](/getmesh-cli/reference/getmesh_istioctl) command

```sh
getmesh istioctl install --set profile=demo
```

Output:
```pre
$ getmesh istioctl install --set profile=demo
This will install the Istio demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) Y
✔ Istio core installed
✔ Istiod installed
✔ Ingress gateways installed
✔ Egress gateways installed
✔ Installation complete
```

By default, istio installation profiles points to normal istio images(distro based), In case users want to install istio with distroless images, this can be done by using the --set hub and tag commands as below.

```sh
getmesh istioctl install --set profile=demo --set hub=containers.istio.tetratelabs.com --set tag=1.12.4-tetratefips-v0-distroless
```

Output:

```pre
$ getmesh istioctl install --set profile=demo --set hub=containers.istio.tetratelabs.com --set tag=1.12.4-tetratefips-v0-distroless
This will install the Istio demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) Y
✔ Istio core installed
✔ Istiod installed
✔ Ingress gateways installed
✔ Egress gateways installed
✔ Installation complete
```

Once this step is completed, the validation can be done by confirming the GetMesh and Istio versions installed, using the [version command](/getmesh-cli/reference/getmesh_version):

```sh
getmesh version
```

Output:
```pre
$ getmesh version
getmesh version: 0.6.0
active istioctl: 1.8.2-tetrate-v0
client version: 1.8.2-tetrate-v0
control plane version: 1.8.2-tetrate-v0
data plane version: 1.8.2-tetrate-v0 (2 proxies)
```

In addition  to the version output, a user can validate the expected functionality by issuing the [config-validate command](/getmesh-cli/reference/getmesh_config-validate) (read more around [config validation](/config-validation)):

```sh
getmesh config-validate
```

With fresh install of Kubernetes cluster and Istio, the output will look similar to the below:

```pre
$ getmesh config-validate
Running the config validator. This may take some time...

NAMESPACE       NAME    RESOURCE TYPE   ERROR CODE      SEVERITY        MESSAGE
default         default Namespace       IST0102         Info          The namespace is not enabled or
                                                                      Istio injection. Run 'kubectl 
                                                                      label namespace default 
                                                                      istio-injection=enabled' to enable it,
                                                                      or 'kubectl label namespace default
                                                                      istio-injection=disabled' to explicitly
                                                                      mark it as not needing injection.

The error codes of the found issues are prefixed by 'IST' or 'KIA'. For the detailed explanation, please refer to
- https://istio.io/latest/docs/reference/config/analysis/ for 'IST' error codes
- https://kiali.io/documentation/latest/validations/ for 'KIA' error codes
```
