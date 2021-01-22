Integration with Apache SkyWalking https://skywalking.apache.org/:

For the detailed steps please refer to the blog article on Skywalking web site - https://skywalking.apache.org/blog/2020-12-03-obs-service-mesh-with-sw-and-als/ 

That document document provides tutorial on how to deploy Skywalking in your environment (if it’s not deployed yet and integrate your Istio distribution with it).

To highlight the essential integration steps:

Install getistio per documentation - https://getistio.io/installing-getistio-cli
Deploy Istio using getistio command and enable Access Log Service (ALS)  https://www.envoyproxy.io/docs/envoy/latest/api-v2/service/accesslog/v2/als.proto using the following command:
getistio istioctl install --set profile=demo \
               --set meshConfig.enableEnvoyAccessLogService=true \
               --set meshConfig.defaultConfig.envoyAccessLogService.address=skywalking-oap.istio-system:11800

Label the application namespace with “kubectl label namespace <namespace> istio-injection=enabled”
Deploy Apache SkyWaliking and the Application per the blog post https://skywalking.apache.org/blog/2020-12-03-obs-service-mesh-with-sw-and-als/ 
Monitor your application via SkyWalking WebUI
