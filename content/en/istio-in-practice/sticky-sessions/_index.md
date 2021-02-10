---
title: "How to use Sticky Sessions"
date: 2021-01-01T11:02:05+06:00
weight: 4
draft: false
---

## What are sticky sessions?

The idea behind sticky sessions is to route the requests for a particular session to the same endpoint that served the first request. With a sticky session, you can associate a service instance with the caller based on HTTP headers or cookies. You might want to use sticky sessions if your service is doing an expensive operation on the first request but cache the value for all subsequent calls. That way, if the same user makes the request, the costly operation will not be performed, and value from the cache will be used.

## Prerequisites

You can follow the [prerequisites](/istio-in-practice/prerequisites) for instructions on how to install and setup Istio.

## How to use sticky sessions with Istio?

To demonstrate the functionality of sticky sessions, we will use a sample service called *sticky-svc*. When called, this service checks for the presence of the *x-user* header. If the header is present, it tries to look up the header value in the internal cache. On any first request with a new *x-user*, the value won't exist in the cache, so the service will sleep for 5 seconds (simulating an expensive operation), and after that, it will cache the value. Any subsequent requests with the same *x-user* header value will return right away. Here's the snippet of this simple logic from the service source code:

```go
var (
  cache = make(map[string]bool)
)

func process(userHeaderValue string) {
  if cache[userHeaderValue] {
    return
  }

  cache[userHeaderValue] = true
  time.Sleep(5 * time.Second)
}
```

To see the sticky sessions in action, we will need to deploy multiple replicas of this service. That way, when we enable sticky sessions, the requests with the same *x-user* header value will always be directed to the pod that initially served the request for the same *x-user* value. The first request we make will still take 5 seconds. However, any subsequent requests will be instantaneous.

Let's go ahead create the Kubernetes deployment and service first.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sticky-svc
  namespace: default
  labels:
    app: sticky-svc
    version: v1
spec:
  replicas: 5
  selector:
    matchLabels:
      app: sticky-svc
      version: v1
  template:
    metadata:
      labels:
        app: sticky-svc
        version: v1
    spec:
      containers:
        - image: gcr.io/tetratelabs/sticky-svc:1.0.0
          imagePullPolicy: Always
          name: svc
          ports:
            - containerPort: 8080
---
kind: Service
apiVersion: v1
metadata:
  name: sticky-svc
  namespace: default
  labels:
    app: sticky-svc
spec:
  selector:
    app: sticky-svc
  ports:
    - port: 8080
      name: http
```

Save the above YAML to `sticky-deployment.yaml` and run `kubectl apply -f sticky-deployment.yaml` to create the Deployment and Service.

To access the service from an external IP, we also need a Gateway resource:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - '*'
```

Save the above YAML to `gateway.yaml` and deploy it using `kubectl apply -f gateway.yaml`.

Next, we can deploy the VirtualService and attach it to the Gateway.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: sticky-svc
  namespace: default
spec:
  hosts:
    - '*'
  gateways:
    - gateway
  http:
    - route:
      - destination:
          host: sticky-svc.default.svc.cluster.local
          port:
            number: 8080
```

Save the above YAML to `sticky-vs.yaml` and create it using `kubectl apply -f sticky-vs.yaml`

Let's make sure everything works fine without configuring sticky sessions by invoking the `/ping` endpoint a couple of times with the `x-user` header value set:

```text
$ curl -H "x-user: ricky" http://localhost/ping

Call was processed by host sticky-svc-689b4b7876-cv5t9 for user ricky and it took 5.0002721s
```

The first request (as expected) will take 5 seconds. If you make a couple of more requests, you will see that some of them will also take 5 seconds, and some of them (being directed to one of the previous pods) will take significantly less, perhaps 500 microseconds.

With the creation of a sticky session, we want to achieve that all subsequent requests finish within a matter of microseconds, instead of taking 5 seconds. The sticky session settings can be configured in a destination rule for the service.

At a high level, there are two options to pick the load balancer settings. The first option is called simple, and we can only pick one of the load balancing algorithms shown in the table below.

| Name | Description |
|:---|:---|
| ROUND_ROBIN | Round Robin load balancing algorithm (default) |
| LEAST_CONN | This algorithm selects two random healthy hosts and picks the one with fewer active requests |
| RANDOM | Randomly selects a host |
| PASSTHROUGH | Forwards the connection to the requested IP address without any load balancing |

For example, this snippet would set the load balancing algorithm to `LEAST_CONN`:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: sticky-svc
    namespace: default
spec:
    host: sticky-service.default.svc.cluster.local
    trafficPolicy:
      loadBalancer:
        simple: LEAST_CONN
```

The second option for setting the load balancer settings is using the field called `consistentHash`. This option allows us to provide session affinity based on the HTTP headers (`httpHeaderName`), cookies (`httpCookie`), or other properties (source IP, for example, using `useSourceIp: true` setting).

Let's define a consistent hash algorithm in the destination rule using the *x-user* header name and deploy it:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: sticky-svc
    namespace: default
spec:
    host: sticky-svc.default.svc.cluster.local
    trafficPolicy:
      loadBalancer:
        consistentHash:
          httpHeaderName: x-user
```
Save the above YAML to `sticky-dr-hash.yaml` and deploy it using `kubectl apply -f sticky-dr-hash.yaml`.

Before we test it out, let's restart all Pods so we get a clean slate and clear the in-memory cache. First, we scaled down the deployment to 0 replicas, and then we scale it back up to 5 replicas:

```sh
kubectl scale deploy sticky-svc --replicas=0
kubectl scale deploy sticky-svc --replicas=5
```

Once all replicas are running, try and make the first request to the endpoint:

```text
$ curl -H "x-user: ricky" http://localhost/ping
Call was processed by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 5.0003232s
```

As expected, the first request takes 5 seconds. However, any subsequent requests will go to the same instance and will take considerably less:

```text
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 47.4µs
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 53.7µs
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 46.1µs
$ curl -H "x-user: ricky" http://localhost/ping
Call was process by host sticky-svc-689b4b7876-cq8hs for user ricky and it took 76.5µs
```

This is a sticky session in action! If we send a request with a different user, it will initially take 5 seconds, but then it will go to the same pod again.
