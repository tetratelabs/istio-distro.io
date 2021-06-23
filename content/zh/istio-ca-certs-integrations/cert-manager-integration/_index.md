---
title: "cert-manager CA 集成"
date: 2021-02-17T13:00:00+0
description: "cert-manager CA 集成。"
# type dont remove or customize
type : "docs"
---

本任务展示了如何使用 [cert-manager](https://cert-manager.io) 与外部证书授权机构一起提供控制平面和工作负载证书。[cert-manager](https://cert-manager.io) 是 Kubernetes 的 x509 证书操作员，它支持许多 [Issuers](https://cert-manager.io/docs/configuration/)，代表可以签署证书的证书授权机构。

[istio-csr](https://github.com/cert-manager/istio-csr) 项目安装了一个代理，该代理负责验证来自 Istio 服务网格负载的传入证书签名请求，并通过配置的 Issuer 通过 cert-manager 进行签名。

## 安装 istio-csr

首先，必须使用你喜欢的方法[在集群上安装 cert-manager](https://cert-manager.io/docs/installation/kubernetes/)。

```sh
$ helm repo add jetstack https://charts.jetstack.io
$ helm repo update
$ kubectl create namespace cert-manager
$ helm install -n cert-manager cert-manager jetstack/cert-manager --set installCRDs=true
```

接下来，应该在 `istio-system` 命名空间中创建一个 Issuer，以便为你的 Istio 安装签署证书。在这种情况下，我们将使用通过 cert-manager 生成的自签名证书，尽管任何适合内部 PKI 系统的 Issuer 都可以使用。[兼容的外部 Issuer](https://cert-manager.io/docs/configuration/external/) 也可以在此安装中使用。

> 请注意，强烈不鼓励使用公开信任的证书，包括 [ACME 证书](https://cert-manager.io/docs/configuration/acme/)。

```sh
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

一旦 Issuer 准备就绪，[istio-csr](https://github.com/cert-manager/istio-csr) 就可以安装到集群中。

```sh
$ helm install -n cert-manager cert-manager-istio-csr jetstack/cert-manager-istio-csr
```
确认 istio-csr 正在运行，并且 istiod 证书处于就绪状态。

```sh
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

## 安装到新的 Istio 集群
安装新的 Istio 集群时，必须配置成 Istio 控制平面和工作负载都使用 istio-csr 作为 CA 服务器。安装时应使用以下配置：

```sh
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
$ getmesh istioctl install -f config.yaml
```

安装应完成，Istio 控制平面应处于就绪状态。

```sh
$ kubectl get pods -n istio-system
NAME                                   READY   STATUS    RESTARTS   AGE
istio-ingressgateway-9ddfd475f-47ssj   1/1     Running   0          45s
istiod-6ff8d84d66-tvdl2                1/1     Running   0          71s
```

现在，所有的工作负载证书都将通过 cert-manager 使用配置的 Issuer 来请求。
