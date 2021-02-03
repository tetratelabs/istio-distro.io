---
title: "How to use Traffic Mirroring"
date: 2021-01-01T11:02:05+06:00
weight: 3
draft: false
---

In addition to more "traditional" traffic routing between different application versions, which can be based on various incoming request properties, such as portions of the URL, header values, request method, etc., Istio also supports **traffic mirroring**.

Traffic mirroring can be used in cases when you don't want to **release** a new version of your application and expose users to it. However, you'd still like to **deploy** it and observe how it works, gather telemetry data, and compare the existing application's performance and functionality with the new application.

You might ask — what is the difference between **deploying** and **releasing** something? When we talk about **deploying** a service to production, we are merely moving the executable code (binaries, containers, whatever form needed for the code to execute) to live in the production environment. However, we are not sending any production traffic to it. The application is there, but it's not affecting any existing applications and services running next to it.

**Releasing** an application involves taking the deployed instance and start routing production traffic to it. At this point, the code we moved to production is running, and it will probably impact other applications and end-users.

Routing traffic between two versions, doing blue-green releases is helpful and useful, but there are risks involved. For example, what if the new application breaks or malfunctions? Even if the new application is receiving only 1% of the production traffic, it can still negatively impact many users.

### What is Traffic Mirroring?

The idea behind **traffic mirroring** is to minimize the risk of exposing users to a potentially broken or buggy application. Instead of deploying, releasing, and routing traffic to the new application, we deploy the new application and mirror the production traffic being sent to the released version of the application.

You can then observe the application receiving mirrored traffic for errors without impacting any production traffic. In addition to running various tests on the deployed version of the application, we can now also use actual production traffic and increase the testing coverage. This gives us more confidence and minimizing the risk of releasing something that doesn't work correctly.

Here's a quick YAML snippet that shows how to enable traffic mirroring with Istio.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-app
spec:
  hosts:
    - my-app
  http:
    - route:
        - destination:
            host: my-app.default.svc.cluster.local
            port:
              number: 3000
            subset: v1
          weight: 100
      mirror:
        host: my-app.default.svc.cluster.local
        port:
          number: 3000
        subset: test-v1
```

The above VirtualService routes 100% of the traffic to the v1 subset while also mirroring the same traffic to the `test-v1` subset. The same request that was sent to the `v1` subset is copied and fired off to the `test-v1` subset.

The quickest way to see this in action is to watch the logs from the `test-v1` application while sending some requests to the application's v1 version.

The response you will get back when you call the application will be coming from the `v1` subset. However, you'll also see the request mirrored to the `test-v1` subset:

"`sh
$ kubectl logs my-app-test-v1–78fc64b995-krzf7 -c svc -f
> my-app@test-1.0.0 start /app
> node server.js
Listening on port 3000
GET /hello 200 9.303 ms — 59
GET /hello 200 0.811 ms — 59
GET /hello 200 0.254 ms — 59
GET /hello 200 3.563 ms — 59
```