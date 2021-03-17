---
title: "Hands-on walkthrough of traffic management in Istio Part 2"
description: "This blog is the second part of Istio's hands-on traffic management practice. "
date: "2021-02-23T13:15:00"
author: "[Peter Jausovec](https://www.peterj.dev/)"
# thumbnail
thumbnail: "/images/blog/traffic.jpg"
tags: ["istio"]
---

This blog is the second part of Istio's hands-on traffic management practice. See the [Hands-on walkthrough of traffic management in Istio Part 1](../istio-traffic-management-walkthrough-p1/). I will show you how to do more advanced with match conditions on request parameters (e.g. URL, headers). Finally, I will talk about mirroring production traffic to a newly deployed service without impacting end-users.

## Advanced Traffic Splitting

Sometimes splitting requests by weight might not be enough, and luckily Istio supports doing more advanced request matching. You can match the requests based on the URL, headers, or method before you decide where the requests will get routed.

For example, you are splitting traffic between two versions, but in addition to that, you only want traffic from the Firefox browsers to go to v2, while requests from other browsers go to v2 version. Or, you can route all `GET` requests to one version, and route other requests to another version. If you combine this functionality with the ability to rewrite the URLs or do HTTP redirects, you can cover a lot of different scenarios.

In this section, we will show examples of how to match requests with Istio and how to redirect and rewrite them. All this gets defined as part of the `VirtualService` resource.

### Request Matching

Istio allows you to use certain parts of the incoming request and match them to the values you define. If the value matches, the request gets routed to the destination specified in the virtual service.
The tables below show all request properties that can get matched to user-provided values and the different ways they can get compared:

| Property  | Description                                                  |
| --------- | ------------------------------------------------------------ |
| uri       | Match the request URI to specified value                     |
| schema    | Match the request schema (HTTP, HTTPS, ...)                  |
| method    | Match the request method (GET, POST, ...)                    |
| authority | Match the request authority header                           |
| headers   | Match the request headers. Headers need to be provided in lower-case and separated by hyphens (e.g. `x-my-request-id`). Note: if headers get used for matching, other properties (`uri`, `schema`, `method`, `authority`) will be ignored |

| Match type | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| exact      | Property needs to be an exact match to the provided value. For example: `exact: Hello` will only match if the property value is `Hello` - it's not going to match if the value is `HELLO` or `hello`) |
| prefix     | Only prefix of the property will get matched. For example: `prefix: Hello` will match if the value is `HelloWorld`, `Hello`. |
| regex      | Value will get matched based on the regex. For example: `regex: '.*Firefox.*'` will match if the value is `Hello Firefox World`. |

In addition to the matching properties, one can also define `sourceLabels` to further constrain the rules to services with specified labels only (e.g. we could specify `app: myapp` to only apply the matching to requests coming from services that have those labels specified)

Let's see how the matching works in practice. We will be using the same Hello Web and both versions of the Greeter service. 

As a first example, we are deploying an updated virtual service, that routes all requests coming from the Firefox browser to the v2 version of greeter service.

```sh
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: greeter-service
spec:
  hosts:
    - greeter-service.default.svc.cluster.local
  http:
    - match:
        - headers:
            user-agent:
              regex: '.*Firefox.*'
      route:
        - destination:
            host: greeter-service.default.svc.cluster.local
            port:
              number: 3000
            subset: v2
    - route:
        - destination:
            host: greeter-service.default.svc.cluster.local
            port:
                number: 3000
            subset: v1
EOF
```

The above YAML defines two routes, but only the first one starts with a match condition. This condition does a check against the incoming request and tries to match the `User-Agent` header against a defined Regex `.*Firefox.*`.

> This is straightforward matching for the browsers' user agent. We look for the `Firefox` string in the header. However, there is a variety of other things we could be matching on.

If the regex gets matched, the requests get routed to the v2 subset. If you remember from earlier, this subset defines the `version: v2` label which corresponds to the v2 version of the greeter service. If we can't match the incoming request, we end up routing to the second route, which is the v1 version of the service.

To try this out, you can open the gateway URL in two different browsers - Firefox and another one. In the non-Firefox browser and you'll see only v1 responses, and from the Firefox browser, the responses will be coming from the v2 version of the service.

In case you don't have the Firefox browser installed, you can replace `Firefox` with something else, use same ModHeader extension we mentioned earlier and add another header called `User-Agent` with the value `Firefox`. Alternatively, you can also use `curl`:

```sh
$ curl -A "Firefox" -H "Host: helloweb.dev" $GATEWAY
<link rel="stylesheet" type="text/css" href="css/style.css" />

<pre>frontend: 1.0.0</pre>
<pre>service: 2.0.0</pre>

<div class="container">
    <h1>🔥🔥 !!HELLO!! 🔥🔥</h1>
</div>
```

Just like you matched the `User-Agent` header, you could match any other headers as well. For example, you could provide an opt-in mechanism for your users that would give them access to new, unreleased features. As part of this, you'd also be setting a special header to all requests (e.g. `x-beta-optin: true`) and then do request routing based on that header value like this:

```yaml
...
http:
  - match:
    - headers:
        x-beta-optin:
            exact: 'true'
    route:
      - destination:
          host: greeter-service.default.svc.cluster.local
          port:
            number: 3000
          subset: beta-version
...
```


### Redirects and Rewrites

Matching on headers can be useful, but sometimes you might need to match the requests by the values in the request URI.

At the moment, greeter service uses the `/hello` URI to return the message, but we would like to change that be `/greeting` instead. That way, any service or users requesting `/greeting` endpoint would get the same response as if they are making requests to `/hello` endpoint.

One way we could do this is to create a second endpoint in the greeter service source code and then maintain both endpoints. However, that doesn't sound too practical, especially since there's a more natural way to do this using a service mesh.

Depending on what you want to do - either an HTTP rewrite or an HTTP redirect, Istio has you covered. Here's an example of how to do an HTTP re-write and rewrite all requests that have `/greeting` in the URI to go to the `/hello` endpoint on the v2 version and any other requests go to the v1 subset:

```sh
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: greeter-service
spec:
  hosts:
    - greeter-service.default.svc.cluster.local
  http:
    - match:
      - uri:
          prefix: /greeting
      rewrite:
        uri: /hello
      route:
        - destination:
            host: greeter-service.default.svc.cluster.local
            port:
              number: 3000
            subset: v2
    - route:
        - destination:
            host: greeter-service.default.svc.cluster.local
            port:
              number: 3000
            subset: v1
EOF
```

Don't forget to include the other route destination at the end, so any request that doesn't match the `/greeting` will be routed correctly as well. If you forget to add that last route, Istio won't know where to route the traffic if the match condition evaluates to false.

Try deploying the above YAML and then open the `$GATEWAY/greeting` URL. When the request gets matched, the `/greeting` prefix is detected, the URL gets rewritten to `/hello` and it gets routed to the defined destination.

Similarly, you could use an HTTP redirect as well:

```sh
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: greeter-service
spec:
  hosts:
    - greeter-service.default.svc.cluster.local
  http:
    - match:
      - uri:
          prefix: /greeting
      redirect:
         uri: /hello
         authority: greeter-service.default.svc.cluster.local:3000
    - route:
        - destination:
            host: greeter-service.default.svc.cluster.local
            port:
              number: 3000
EOF
```

Usually, you'd use the HTTP redirect if you want to redirect the call to a completely different service. Let's say we had another service called `better-greeter-service` and we tried to redirect traffic to that service instead. In that case, you can update the `authority` to `better-greeter-service` and the traffic will get redirected to that service.

Just like you've defined a single match condition for one destination, we could also define multiple match conditions for each route OR add more conditions to a single match. If we build on the previous example, you can add additional match that would check if there's a specific value in the headers:

```yaml
...
http:
    - match:
          - uri:
                prefix: /greeting
            headers:
                x-my-header:
                    exact: something
      redirect:
          uri: /hello
          authority: greeter-service.default.svc.cluster.local:3000
...
```

In the above case we redirect requests to `/hello` endpoint if both match conditions are satisfied (`AND` semantics). Similarly, you could add an additional match entry:

```yaml
...
http:
  - match:
    - uri:
        prefix: /greeting
    redirect:
      uri: /hello
      authority: greeter-service.default.svc.cluster.local:3000
  - match:
    - uri:
      headers:
        x-my-header:
          exact: something
    redirect:
      uri: /blah
      authority: greeter-service.default.svc.cluster.local:3000
...
```

## Dark Traffic (Mirroring)

Most of this blog talked about routing requests and traffic between different versions based on some requirements and in all cases, the end-users would have a different experience, depending on how the requirements get met. However, sometimes we don't want to release the new version and expose users to it, but we'd still like to deploy it and observe how the new service works, get telemetry and compare the performance and functionality of the existing service with the new service.

> Difference between deployment and release?
>
> **Deploying** a service to production is merely moving the code to live in production, but not sending any production traffic to it. **Releasing** a service involves taking a deployed service and routing production traffic to it.

In one of the previous sections, we deployed a v2 service and then we were gradually releasing it by sending a higher percentage of traffic to it. Doing this involves risks as the v2 service might not behave correctly and end-users will be impacted by it.

The idea behind traffic mirroring is to minimize the risk of exposing users to potentially buggy service. Instead of releasing the service as per the definition above, we deploy the new service and then mirror the traffic that gets sent to the released version of the service. Service receiving mirrored traffic can then get observed for errors without impacting any production traffic. In addition to running a variety of tests on the deployed version of the service, you can now also use actual production traffic and increase the testing coverage which could give you more confidence and minimize the risk of releasing a buggy service.

Here's how to turn on the service mirroring: 

```sh
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: greeter-service
spec:
  hosts:
    - greeter-service.default.svc.cluster.local
  http:
    - route:
      - destination:
          host: greeter-service.default.svc.cluster.local
          port:
            number: 3000
          subset: v1
        weight: 100
      mirror:
        host: greeter-service.default.svc.cluster.local
        port:
          number: 3000
        subset: v2
      mirror_percent: 100
EOF
```

The virtual service above is routing 100% of the traffic to the greeter service v1, while also mirroring 100% of the traffic to the v2 version of the service. You can control the percentage of traffic mirrored to the service by setting the `mirror_percent` value. 

The easiest way to see this in action is to watch the logs from the v2 service and then open the gateway URL and reload the page a couple of times. The responses you will see on the web page will be coming from the v1 version of the service; however, you'll also see the request being sent to the v2 version:

```sh
$ kubectl logs greeter-service-v2-78fc64b995-krzf7 -c svc -f

> greeter-service@2.0.0 start /app
> node server.js

Listening on port 3000
GET /hello 200 9.303 ms - 59
GET /hello 200 0.811 ms - 59
GET /hello 200 0.254 ms - 59
GET /hello 200 3.563 ms - 59
...
```

## Sidecar Proxy

An Envoy sidecar proxy that gets injected to every Kubernetes deployment is configured in such a way that it accepts traffic on all ports and can reach any service in the mesh when it forwards traffic. In some cases, you might want to change this configuration and configure the proxy, so it can only use specific ports and access certain services. To do that, you can use a *sidecar* resource in Istio. A sidecar resource can be deployed to one or more namespaces inside the Kubernetes cluster, but there can only be one sidecar resource per namespace if there's not workload selector defined. 

Three parts make up the sidecar resource, a workload selector, an ingress listener, and an egress listener. 

### Workload selector

The sidecar resource uses a workload selector to determine which workloads will be affected by the sidecar configuration. You can decide to control all sidecars within a namespace, regardless of the workload, or provide a workload selector to apply the configuration only to specific services.

Just like other resources in Istio and Kubernetes, a set of labels is used to select the workloads. For example, the snippet below will apply to all proxies that live inside the `default` namespace:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Sidecar
metadata:
  name: default-sidecar
  namespace: default
spec:
  egress:
  - hosts:
    - "default/*"
    - "istio-system/*"
    - "staging/*"
```

Additionally, with the egress section, you are specifying that the proxies will have access to services running in the `default`, `istio-system` and `staging` namespaces. To only select certain workloads, you can add the `workloadSelector` key. The snippet below only applies to the workloads that have the label `version` set to `v1`:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Sidecar
metadata:
  name: default-sidecar
  namespace: default
spec:
  workloadSelector:
    labels:
      version: v1
  egress:
  - hosts:
    - "default/*"
    - "istio-system/*"
    - "staging/*"
```

### Ingress listener

With an ingress listener, you can define which inbound traffic will be accepted. Each ingress listener needs to have a port set - this is the port where the traffic will be received (e.g. `5000` example below), and a default endpoint. The default endpoint can either be a loopback IP endpoint or a Unix domain socket - this is where the traffic will be forwarded to, for example `127.0.0.1:8080`. The snippet below shows an example of an ingress listener that listens on port `5000` and forwards traffic to the loopback IP on port `8080` - this is where your service would be listening to.

```yaml
...
  ingress:
  - port:
      number: 5000
      protocol: HTTP
      name: somename
    defaultEndpoint: 127.0.0.1:8080
...
```

You can also use a field called `captureMode` to configure how traffic will be captured (or not). By default, the capture mode defined by the environment will be used; you can also use `IPTABLES` as a valid setting to specify that the traffic will be captured using IPtables redirection. The last option is to use `NONE` - this means that is no traffic capture. 

With the `bind` field, you can specify an IP address or domain socket for incoming traffic. You'd set this if you only want to listen on a specific address for the incoming traffic.

Similarly, instead of using an IP for the default endpoint, you could forward the traffic to Unix domain socket - e.g. `unix://some/path`, and have your service listen for connection on that socket. If you are using a Unix domain socket, use `0` as the port number. Also, the capture mode needs to be either set to `DEFAULT` or `NONE`.

### Egress listener

An egress listener is used to define the properties for outbound traffic on the sidecar proxy. It has similar fields as the ingress listener, with the addition of the `hosts` field. With the `hosts` field you can specify service hosts in the `namespace/dnsName` (e.g. `myservice.default` or `default/*`). Services in the `hosts` field can either be actual services from the registry (all services registered in the mesh) or services defined with a ServiceEntry (external services) or with virtual services.

```yaml
  egress:
  - port:
      number: 8080
      protocol: HTTP
    bind: 127.0.0.1
    hosts:
    - "*/my-api.example.com"
```

The snippet above allows your application to communicate with an API that's listening on `127.0.0.1:8080` with the additional service entry, you can then proxy everything from `127.0.0.1:8080` to an external API.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: external-api-example-com
spec:
  hosts:
  - my-api.example.com
  ports:
  - number: 3000
    protocol: HTTP
  location: MESH_EXTERNAL
  resolution: DNS
```

## Conclusion

This blog gave you an overview of request/traffic routing features that Istio provides. You familiarized yourself with the five essential resources in Istio: `Gateway`, `VirtualService`, `DestinationRule`, `ServiceEntry`, and `Sidecar`.

Using the Hello Web and Greeter service examples, you learned how to set up a gateway and allow traffic to enter the cluster and route it to Hello web. Similarly, you went through an exercise to enable a service to reach outside of the cluster to call an existing public API. You've learned how to split the traffic based on different conditions and rules as well as redirect and rewrite the URL requests. Finally, we showed how to deploy a service to production and mirror traffic to it to minimize the risk to users.
