---
title: "cert-manager CA Integration"
date: 2021-02-17T13:00:00+0
description: "cert-manager CA Integration"
# type dont remove or customize
type : "docs"
---

This task shows how to provision Control Plane and Workload Certificates with an
external Certificate Authority using [cert-manager](https://cert-manager.io).
[cert-manager](https://cert-manager.io) is a x509 certificate operator for
Kubernetes that supports a number of
[Issuers](https://cert-manager.io/docs/configuration/), representing Certificate
Authorities that can sign certificates.

The [istio-csr](https://github.com/cert-manager/istio-csr) project installs an
agent that is responsible for verifying incoming certificate signing requests
from Istio mesh workloads, and signs them through cert-manager via a configured
Issuer.

## Installing istio-csr

First, cert-manager must be [installed on the
cluster](https://cert-manager.io/docs/installation/kubernetes/) using your
preferred method.

```bash
$ helm repo add jetstack https://charts.jetstack.io
$ helm repo update
$ kubectl create namespace cert-manager
$ helm install -n cert-manager cert-manager jetstack/cert-manager --set installCRDs=true
```

Next, an [Issuer](https://cert-manager.io/docs/configuration/) should be created
in the `istio-system` namespace that you would like to sign the certificates for
your Istio installation. In this case, we will be using a self signed
certificate generated through cert-manager, though any Issuer that is
appropriate for an internal PKI system can be used.  [Compatible external
Issuers](https://cert-manager.io/docs/configuration/external/) can also be used
in this installation.

> Note that publicly trusted certificates are strongly discouraged from being
> used, including [ACME
> certificates](https://cert-manager.io/docs/configuration/acme/).

```bash
$ kubectl create namespace istio-system
$ kubectl apply -n istio-system -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: istio-ca
spec:
  isCA: true
  duration: 2160h # 90d
  secretName: istio-ca
  commonName: istio-ca
  subject:
    organizations:
    - cert-manager
  issuerRef:
    name: selfsigned
    kind: Issuer
    group: cert-manager.io
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: istio-ca
spec:
  ca:
    secretName: istio-ca
EOF

$ kubectl get issuers -n istio-system
NAME         READY   AGE
istio-ca     True    12m
```

Once the Issuer has become ready,
[istio-csr](https://github.com/cert-manager/istio-csr) can be installed into the
cluster.

```bash
$ helm install -n cert-manager cert-manager-istio-csr jetstack/cert-manager-istio-csr
```
Verify that istio-csr is running, and that the istiod Certificate is in a ready
state.

```bash
$ kubectl get pods -n cert-manager
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-756bb56c5-cdvln               1/1     Running   0          111s
cert-manager-cainjector-86bc6dc648-bjnrp   1/1     Running   0          111s
cert-manager-istio-csr-5b9cd98696-v4f6j    1/1     Running   0          12s
cert-manager-webhook-66b555bb5-4s7qb       1/1     Running   0          111s
$ kubectl get certificates -n istio-system
NAME       READY   SECRET       AGE
istiod     True    istiod-tls   28s
```

---

## Installing to a new Istio cluster
When installing a new Istio cluster, it must be configured to use istio-csr as
the CA server by both the Istio control plane and workloads. The following
configuration should be used when installing:

```bash
$ cat << EOF > config.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
spec:
  values:
    global:
      caAddress: cert-manager-istio-csr.cert-manager.svc:443
  components:
    pilot:
      k8s:
        env:
          # Disable istiod CA Sever functionality
        - name: ENABLE_CA_SERVER
          value: "false"
        overlays:
        - apiVersion: apps/v1
          kind: Deployment
          name: istiod
          patches:

            # Mount istiod serving and webhook certificate from Secret mount
          - path: spec.template.spec.containers.[name:discovery].args[7]
            value: "--tlsCertFile=/etc/cert-manager/tls/tls.crt"
          - path: spec.template.spec.containers.[name:discovery].args[8]
            value: "--tlsKeyFile=/etc/cert-manager/tls/tls.key"
          - path: spec.template.spec.containers.[name:discovery].args[9]
            value: "--caCertFile=/etc/cert-manager/ca/root-cert.pem"

          - path: spec.template.spec.containers.[name:discovery].volumeMounts[6]
            value:
              name: cert-manager
              mountPath: "/etc/cert-manager/tls"
              readOnly: true
          - path: spec.template.spec.containers.[name:discovery].volumeMounts[7]
            value:
              name: ca-root-cert
              mountPath: "/etc/cert-manager/ca"
              readOnly: true

          - path: spec.template.spec.volumes[6]
            value:
              name: cert-manager
              secret:
                secretName: istiod-tls
          - path: spec.template.spec.volumes[7]
            value:
              name: ca-root-cert
              configMap:
                secretName: istiod-tls
                defaultMode: 420
                name: istio-ca-root-cert
EOF
$ getistio istioctl install -f config.yaml
```

The installation should complete, and the Istio control plane should become in a
ready state.

```bash
$ kubectl get pods -n istio-system
NAME                                   READY   STATUS    RESTARTS   AGE
istio-ingressgateway-9ddfd475f-47ssj   1/1     Running   0          45s
istiod-6ff8d84d66-tvdl2                1/1     Running   0          71s
```

All workload certificates will now be requested through cert-manager using the
configured Issuer.
