---
title: "How to do Zero-Downtime Releases"
date: 2021-01-01T11:02:05+06:00
weight: 2
draft: false
---

The purpose of the zero-downtime release is to release a new version of the application without affecting its users. If you have a website running, this means that you can release a new version without taking the website down. It means that you can make continuous requests to that application while releasing a new application, and the application users will never get that dreaded 504 Service Unavailable response.

You might wonder why we would use Istio to do rolling updates if the Kubernetes option is much simpler. That's true, and you probably shouldn't be using Istio if zero-downtime deployments are the only thing you're going to use it for. You can achieve the same behavior with Istio. However, you have way more control over how and when the traffic gets routed to a specific version.

#### Prerequisites

You can follow the [prerequisites](/istio-in-practice/prerequisites) for instructions on how to install and setup Istio.

#### Kubernetes Deployments need to be versioned

Each deployment of the service needs to be versioned - you need a label called `version: v1` (or `release: prod` or anything similar to that), as well as name the deployment, so it's clear which version it represents (e.g. `helloworld-v1`). Usually, you'd have at minimum these two labels set on each deployment:

```yaml
labels:
    app: helloworld
    version: v1
```

You could also include many other labels if it makes sense, but you should have a label that identifies your component and its version.

#### Kubernetes Service needs to be generic

There's no need to put a version label in the Kubernetes Service selector. The label with the app/component name is enough. Also, keep the following in mind:

1. Start with a destination rule that contains versions you are currently running, and make sure you keep it in sync. There's no need to end up with a destination rule with many unused or obsolete subsets. 

2. If you are using **matching and conditions**, always define a "fallback" route in the VirtualService resource. If you don't, any requests not matching the conditions will end up in digital heaven and won't get served.

Let's take the following example:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
    name: my-service
spec:
    hosts:
      - my-service.default.svc.cluster.local
    http:
      - match:
        - headers:
            my-header:
              regex: '.*debug.*'
        route:
          - destination:
              host: my-service.default.svc.cluster.local
            port:
              number: 3000
            subset: debug
```

The above VirtualService is missing a "fallback" route. In case the request doesn't match (i.e., missing `my-header: debug`, for example), Istio won't know where to route the traffic to. To fix this, always define a route that applies if none of the matches evaluates to true. Here's the same VirtualService, with a fallback route to the subset called `prod`.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
    name: my-service
spec:
    hosts:
      - my-service.default.svc.cluster.local
    http:
      - match:
        - headers:
            my-header:
              regex: '.*debug.*'
        route:
          - destination:
              host: my-service.default.svc.cluster.local
            port:
              number: 3000
            subset: debug
      - route:
        - destination:
            host: my-service.default.svc.cluster.local
            port:
                number: 3000
            subset: prod
```


With these guidelines in mind, here's a rough process of doing a zero-downtime deployment using Istio. We are starting with Kubernetes deployment called `helloworld-v1`, a destination rule with one subset (`v1`) and a VirtualService resource that routes all traffic to the `v1` subset. Here's how the DestinationRule resource looks like:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: helloworld
spec:
  host: helloworld.default.svc.cluster.local
  subsets:
    - name: v1
      labels:
        version: v1
```

And the corresponding virtual service:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: helloworld
spec:
  hosts:
    - helloworld
  http:
    - route:
      - destination:
          host: helloworld
          port:
            number: 3000
          subset: v1
        weight: 100
```

Once you deployed these two resources, all traffic is routed to the `v1` subset. 

#### Rolling out the second version

Before you deploy the second version, the first thing you need to do is to modify the DestinationRule and add a subset that represents the second version.

1. Deploy the modified destination rule that adds the new subset:

    ```yaml
    apiVersion: networking.istio.io/v1alpha3
    kind: DestinationRule
    metadata:
      name: helloworld
    spec:
      host: helloworld.default.svc.cluster.local
      subsets:
        - name: v1
          labels:
            version: v1
        - name: v2
          labels:
            version: v2
    ```

1. Create/deploy the `helloworld-v2` Kubernetes deployment.
1. Update the virtual service and re-deploy it. In the virtual service, you can configure a percentage of the traffic to the subset `v1` and a percentage of the traffic to the new subset `v2`. 

There are multiple ways you can do this - you can gradually route more traffic to `v2` (e.g., in 10% increments, for example), or you can do a straight 50/50 split between versions, or even route 100% of the traffic to the new `v2` subset.

Finally, once you routed all traffic to the newest/latest subset, you can follow the steps in this order to remove the previous `v1` deployment and subset: 

1. Remove the `v1` subset from the VirtualService and re-deploy it. This will cause all traffic to go to `v2` subset.
1. Remove the `v1` subset from the DestinationRule and re-deploy it.
1. Finally, you can now safely delete the `v1` Kubernetes deployment, as no traffic is being sent to it anymore.

If you got to this part, all traffic is now flowing to the `v2` subset, and you don't have any `v1` artifacts running anymore.