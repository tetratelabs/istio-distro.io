---
title: "Community"
date: 2018-12-29T11:02:05+06:00
icon: "ti-notepad"
description: "Contributing to the community"
# type dont remove or customize
type : "docs"
---
We welcome contributions from the community. Please read the following guidelines carefully to maximize the chances of your PR being merged.

### Run linter

Here we use `golang-ci` for static analysis, so make sure that you have it installed.

To run linter, simply execute:

```
make lint
```

### Run unittests

Running unittests does not require any k8s cluster, and it can be done by

```
make unit-test
```

### Run e2e tests

Running end-to-end tests requires you to have a valid k8s context. Please note that e2e will use your default kubeconfig and default context there.

In order to run e2e tests, execute: 

```
make e2e-test
e2e-test:
```
