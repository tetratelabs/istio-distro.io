---
title: "Istio 1.8: A Virtual Machine Integration Odyssey"
date: "2020-01-21"
# page title background image
bg_image: "images/backgrounds/page-title.jpg"
# meta description
description : "Get Istio 1.0.0 Released With Transparent Proxying For VMs & New Retry Policy"
# thumbnail
---

![Shipyard](https://www.tetrate.io/wp-content/uploads/2020/12/shipyard.jpg)

  You may have heard that DNS functionality was added in Istio 1.8, but you might not have thought about the impact it has. It solves some key issues that exist within Istio and allows you to expand your mesh architecture to include multiple clusters and virtual machines. An excellent explanation of the features can be found on the    [  Istio website   ](https://preliminary.istio.io/latest/blog/2020/dns-proxy/)  . In short, it enables seamless integration across multiple clusters and Virtual Machines. In this article, we’ll test out the new features and hopefully explain more about what is happening under the hood.   


  If you are new to Istio or wondering why Istio DNS proxy is such a big deal, check out    [  What’s new in Istio 1.8 (DNS Proxy)   ](https://www.tetrate.io/blog/whats-new-in-istio-1-8-dns-proxy-helps-expand-mesh-to-vms-and-multicluster/)  .   

**Enabling Istio’s DNS Proxy**

  This feature is currently in Alpha but can be enabled in the IstioOperator config.   


<script src="https://gist.github.com/a48da9335100efd35a204395030aa4f7.js?file=istio-operator.yaml"></script>
<link rel="stylesheet" href="https://github.githubassets.com/assets/gist-embed-21306e514d0307507dff9aa80b8f393d.css">

<div id="gist106855905" class="gist">
   <div class="gist-file">
      <div class="gist-data">
         <div class="js-gist-file-update-container js-task-list-container file-box">
            <div id="file-istio-operator-yaml" class="file my-2">
               <div itemprop="text" class="Box-body p-0 blob-wrapper data type-yaml  ">
                  <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip="">
                     <tbody>
                        <tr>
                           <td id="file-istio-operator-yaml-L1" class="blob-num js-line-number" data-line-number="1"></td>
                           <td id="file-istio-operator-yaml-LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-ent">apiVersion</span>: <span class="pl-s">install.istio.io/v1alpha1</span></td>
                        </tr>
                        <tr>
                           <td id="file-istio-operator-yaml-L2" class="blob-num js-line-number" data-line-number="2"></td>
                           <td id="file-istio-operator-yaml-LC2" class="blob-code blob-code-inner js-file-line"><span class="pl-ent">kind</span>: <span class="pl-s">IstioOperator</span></td>
                        </tr>
                        <tr>
                           <td id="file-istio-operator-yaml-L3" class="blob-num js-line-number" data-line-number="3"></td>
                           <td id="file-istio-operator-yaml-LC3" class="blob-code blob-code-inner js-file-line"><span class="pl-ent">spec</span>:</td>
                        </tr>
                        <tr>
                           <td id="file-istio-operator-yaml-L4" class="blob-num js-line-number" data-line-number="4"></td>
                           <td id="file-istio-operator-yaml-LC4" class="blob-code blob-code-inner js-file-line"> <span class="pl-ent">meshConfig</span>:</td>
                        </tr>
                        <tr>
                           <td id="file-istio-operator-yaml-L5" class="blob-num js-line-number" data-line-number="5"></td>
                           <td id="file-istio-operator-yaml-LC5" class="blob-code blob-code-inner js-file-line">   <span class="pl-ent">defaultConfig</span>:</td>
                        </tr>
                        <tr>
                           <td id="file-istio-operator-yaml-L6" class="blob-num js-line-number" data-line-number="6"></td>
                           <td id="file-istio-operator-yaml-LC6" class="blob-code blob-code-inner js-file-line">     <span class="pl-ent">proxyMetadata</span>:</td>
                        </tr>
                        <tr>
                           <td id="file-istio-operator-yaml-L7" class="blob-num js-line-number" data-line-number="7"></td>
                           <td id="file-istio-operator-yaml-LC7" class="blob-code blob-code-inner js-file-line">       <span class="pl-ent">ISTIO_META_DNS_CAPTURE</span>: <span class="pl-s"><span class="pl-pds">"</span>true<span class="pl-pds">"</span></span></td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <div class="gist-meta">
         <a href="https://gist.github.com/nmnellis/a48da9335100efd35a204395030aa4f7/raw/5f23dd336dd499d00bb47aad85a5ef73cb883380/istio-operator.yaml" style="float:right">view raw</a>
         <a href="https://gist.github.com/nmnellis/a48da9335100efd35a204395030aa4f7#file-istio-operator-yaml">istio-operator.yaml</a>
         hosted with ❤ by <a href="https://github.com">GitHub</a>
      </div>
   </div>
</div>

<div id="gist106855905" class="gist">
    <div class="gist-file">
      <div class="gist-data">
        <div class="js-gist-file-update-container js-task-list-container file-box">
  <div id="file-service-entry1-yaml" class="file my-2">
    

  <div itemprop="text" class="Box-body p-0 blob-wrapper data type-yaml  ">
      
<table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip="">
      <tbody><tr>
        <td id="file-service-entry1-yaml-L1" class="blob-num js-line-number" data-line-number="1"></td>
        <td id="file-service-entry1-yaml-LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-ent">apiVersion</span>: <span class="pl-s">networking.istio.io/v1beta1</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L2" class="blob-num js-line-number" data-line-number="2"></td>
        <td id="file-service-entry1-yaml-LC2" class="blob-code blob-code-inner js-file-line"><span class="pl-ent">kind</span>: <span class="pl-s">ServiceEntry</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L3" class="blob-num js-line-number" data-line-number="3"></td>
        <td id="file-service-entry1-yaml-LC3" class="blob-code blob-code-inner js-file-line"><span class="pl-ent">metadata</span>:</td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L4" class="blob-num js-line-number" data-line-number="4"></td>
        <td id="file-service-entry1-yaml-LC4" class="blob-code blob-code-inner js-file-line"> <span class="pl-ent">name</span>: <span class="pl-s">istio-io</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L5" class="blob-num js-line-number" data-line-number="5"></td>
        <td id="file-service-entry1-yaml-LC5" class="blob-code blob-code-inner js-file-line"><span class="pl-ent">spec</span>:</td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L6" class="blob-num js-line-number" data-line-number="6"></td>
        <td id="file-service-entry1-yaml-LC6" class="blob-code blob-code-inner js-file-line"> <span class="pl-ent">hosts</span>:</td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L7" class="blob-num js-line-number" data-line-number="7"></td>
        <td id="file-service-entry1-yaml-LC7" class="blob-code blob-code-inner js-file-line"> - <span class="pl-s">istio.io</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L8" class="blob-num js-line-number" data-line-number="8"></td>
        <td id="file-service-entry1-yaml-LC8" class="blob-code blob-code-inner js-file-line"> <span class="pl-ent">location</span>: <span class="pl-s">MESH_EXTERNAL</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L9" class="blob-num js-line-number" data-line-number="9"></td>
        <td id="file-service-entry1-yaml-LC9" class="blob-code blob-code-inner js-file-line"> <span class="pl-ent">ports</span>:</td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L10" class="blob-num js-line-number" data-line-number="10"></td>
        <td id="file-service-entry1-yaml-LC10" class="blob-code blob-code-inner js-file-line"> - <span class="pl-ent">number</span>: <span class="pl-c1">443</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L11" class="blob-num js-line-number" data-line-number="11"></td>
        <td id="file-service-entry1-yaml-LC11" class="blob-code blob-code-inner js-file-line">   <span class="pl-ent">name</span>: <span class="pl-s">https</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L12" class="blob-num js-line-number" data-line-number="12"></td>
        <td id="file-service-entry1-yaml-LC12" class="blob-code blob-code-inner js-file-line">   <span class="pl-ent">protocol</span>: <span class="pl-s">TLS</span></td>
      </tr>
      <tr>
        <td id="file-service-entry1-yaml-L13" class="blob-num js-line-number" data-line-number="13"></td>
        <td id="file-service-entry1-yaml-LC13" class="blob-code blob-code-inner js-file-line"> <span class="pl-ent">resolution</span>: <span class="pl-s">DNS</span></td>
      </tr>
</tbody></table>


  </div>

  </div>
</div>
      </div>
      <div class="gist-meta">
        <a href="https://gist.github.com/nmnellis/a48da9335100efd35a204395030aa4f7/raw/5f23dd336dd499d00bb47aad85a5ef73cb883380/service-entry1.yaml" style="float:right">view raw</a>
        <a href="https://gist.github.com/nmnellis/a48da9335100efd35a204395030aa4f7#file-service-entry1-yaml">service-entry1.yaml</a>
        hosted with ❤  by <a href="https://github.com">GitHub</a>
      </div>
    </div>
    
</div>