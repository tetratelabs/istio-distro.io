---
title: 'Helm Chart Deployment'
date: 2023-01-26T13:00:00+07:00
description: 'Use Helm Charts to deploy Tetrate Istio Distro'
# type dont remove or customize
type: 'docs'
weight: 35
---

### Helm Charts

While there are multiple benefits of using `getmesh` CLI tool, there are use-cases that require a complete automation and repeatable approach. To address this need, Tetrate offers a de-facto standard approach with Helm charts. This page illustrates typical steps to deploy `Tetrate Istio Distro` via Helm.

#### Add Tetrate Helm Repo

Tetrate hosts publicly available Helm Repo that can be accesses via standard Helm commands:

```bash
helm repo add tid https://tetratelabs.github.io/istio-helm/
helm repo update tid
```

  Output:
  
  ```pre
   $ helm repo add tid https://tetratelabs.github.io/istio-helm/
  "tid" has been added to your repositories
   $ helm repo update tid
  Hang tight while we grab the latest from your chart repositories...
  ...Successfully got an update from the "tid" chart repository
  Update Complete. ⎈Happy Helming!⎈
  ```

#### Set variables

To ensure consistency the variables can be set per below:

- Name matches the repo naming pattern:

  ```bash
  export name="tid/tetrate-istio"
  ```

  __FIPS Note__
  if customer has purchased Tetrate FIPS Distro - than the `name` variable should be set to `tid/tetrate-fips`
  
  ```pre
  export name="tid/tetrate-istio"
  ```

- querying the repo, allows to set the latest version as variable:

  ```bash
  export latest_version=$(helm search repo ${name} -o json | jq -r .[].version)
  ```
  
  Make sure the variables are set:

  ```pre
  echo $name $latest_version
  tid/tetrate-istio 1.16.1
  ```

#### Charts installation via Helm

Adding repo and setting up the variables is all prerequisites. Executing the `helm install` command should be run per below example:

```bash
helm install tetrate-istio ${name} \
    --set global.hub=containers.istio.tetratelabs.com \
    --set global.tag=${latest_version}-tetrate-v0 \
    --create-namespace --namespace istio-system
```

__FIPS Note__
  if customer has purchased Tetrate FIPS Distro - than the `tag` should include `-tetratefips-` instead of `-tetrate-`

  ```pre
  helm install tetrate-istio ${name} \
    --set global.hub=containers.istio.tetratelabs.com \
    --set global.tag=${latest_version}-tetratefips-v0 \
    --create-namespace --namespace istio-system
  ```

Output:

```pre
 $ export name="tid/tetrate-istio"
 $ export latest_version=$(helm search repo ${name} -o json | jq -r .[].version)
 $ helm install tetrate-istio ${name} \
>     --set global.hub=containers.istio.tetratelabs.com \
>     --set global.tag=${latest_version}-tetrate-v0 \
>     --create-namespace --namespace istio-system
NAME: tetrate-istio
LAST DEPLOYED: Thu Jan 26 14:29:54 2023
NAMESPACE: istio-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
"TID - Tetrate Distro of Istio 1.16.1-tetrate-v0 successfully installed!"

To learn more about the release, try:
  $ helm status tetrate-istio
  $ helm get all tetrate-istio

More details and feedback [Tetrate Istio Distro](https://istio.tetratelabs.io/)
```

__Gateway Note__ While a separate Envoy Gateway chart is available, it's not necessary to deploy them. The configuration templates deployed with the default chart allow to configure `proxyv2` container to act as standalone gateway pod.

### Verify the Tetrate Istio Distro deployment

Use helm command anytime to get the output similar to install command:

```bash
helm status tetrate-istio -n istio-system
```

Also confirming that all objects are created as expected, use `kubectl` the output should be something similar to below:

```pre
$ kubectl get all -n istio-system
NAME                          READY   STATUS    RESTARTS   AGE
pod/istio-cni-node-4vc9p      1/1     Running   0          21m
pod/istio-cni-node-dhp6v      1/1     Running   0          21m
pod/istiod-56b5bdd674-vssdl   1/1     Running   0          21m

NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                 AGE
service/istiod   ClusterIP   10.100.83.177   <none>        15010/TCP,15012/TCP,443/TCP,15014/TCP   21m

NAME                            DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
daemonset.apps/istio-cni-node   2         2         2       2            2           kubernetes.io/os=linux   21m

NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/istiod   1/1     1            1           21m

NAME                                DESIRED   CURRENT   READY   AGE
replicaset.apps/istiod-56b5bdd674   1         1         1       21m
```



### Next Steps

The cluster is ready for your applications.

Read on for next steps with Tetrate Istio Distro and GetMesh.

For community support, join Tetrate's [#tid-and-getmesh Slack Channel](https://tetr8.io/tetrate-community).
