const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/hls-jPpvGmsk.js","assets/index-CJFMW4U5.js","assets/index-C9bg5rei.css"])))=>i.map(i=>d[i]);
import{r as g,u as R,s as I,V as G,_ as V,I as S,M as O,a as k,g as F,c as L,b as E,v as z,e as B,O as X,d as P,T as K,B as W,S as Y,F as C,f as Z,j as i,R as T,h as Q,C as q,E as H,G as J,i as ee,k as te,N as se,P as ne,L as re,l as ie}from"./index-CJFMW4U5.js";var D,A;const oe=typeof window<"u"&&typeof((D=window.document)==null?void 0:D.createElement)=="function"&&typeof((A=window.navigator)==null?void 0:A.userAgent)=="string";let v=null;async function ae(s,t){if(oe&&s.pathname.endsWith(".m3u8")){var e;if((e=v)!==null&&e!==void 0||(v=await V(()=>import("./hls-jPpvGmsk.js").then(n=>n.h),__vite__mapDeps([0,1,2]))),v.default.isSupported())return new v.default({...t})}return null}function ce(s,{unsuspend:t="loadedmetadata",start:e=!0,crossOrigin:n="anonymous",muted:u=!0,loop:r=!0,hls:o={},...c}={}){const l=new URL(typeof s=="string"?s:"",window.location.href),a=g.useRef(null),x=g.useRef(null),y=R(h=>h.gl),f=I(()=>new Promise(async h=>{const d=Object.assign(document.createElement("video"),{src:typeof s=="string"&&s||void 0,srcObject:s instanceof MediaStream&&s||void 0,crossOrigin:n,loop:r,muted:u,...c});if(x.current=d,typeof s=="string"){const p=a.current=await ae(l,o);p?(p.attachMedia(d),p.on("hlsMediaAttached",()=>{p.loadSource(s)})):d.src=s}else s instanceof MediaStream&&(d.srcObject=s);const m=new G(d);"colorSpace"in m?m.colorSpace=y.outputColorSpace:m.encoding=y.outputEncoding,d.addEventListener(t,()=>h(m))}),[s]);return g.useEffect(()=>(e&&f.image.play(),()=>{a.current&&(a.current.destroy(),a.current=null)}),[f,e]),f}function le(s){let t=[],e="";const n=L(s,{chained:!0,customRewriter({vertexShader:r,fragmentShader:o}){let c=[],l=[],a=[],x=E(r),y=E(o);return t.forEach(f=>{let h=x[f],d=y[f];const m=h||d;if(m){const p=new RegExp(`\\buniform\\s+${m}\\s+${f}\\s*;`,"g"),j=new RegExp(`\\b${f}\\b`,"g"),_=`troika_attr_${f}`,M=`troika_vary_${f}`;if(c.push(`attribute ${m} ${_};`),h&&(r=r.replace(p,""),r=r.replace(j,_)),d){o=o.replace(p,""),o=o.replace(j,M);let b=`varying ${d} ${M};`;c.push(b),a.push(b),l.push(`${M} = ${_};`)}}}),r=`${c.join(`
`)}
${r.replace(z,`
$&
${l.join(`
`)}`)}`,a.length&&(o=`${a.join(`
`)}
${o}`),{vertexShader:r,fragmentShader:o}}});n.setUniformNames=function(r){t=r||[];const o=t.sort().join("|");o!==e&&(e=o,this.needsUpdate=!0)};const u=n.customProgramCacheKey();return n.customProgramCacheKey=function(){return u+"|"+e},n.isInstancedUniformsMaterial=!0,n}class ue extends S{constructor(t,e,n){super(t,e,n),this._maxCount=n,this._instancedUniformNames=[]}get geometry(){let t=this._derivedGeometry;const e=this._baseGeometry;return(!t||t.baseGeometry!==e)&&(t=this._derivedGeometry=Object.create(e),t.baseGeometry=e,t.attributes=Object.create(e.attributes),e.addEventListener("dispose",function n(){e.removeEventListener("dispose",n),t.dispose()})),t}set geometry(t){this._baseGeometry=t}get material(){let t=this._derivedMaterial;const e=this._baseMaterial||this._defaultMaterial||(this._defaultMaterial=new O);return(!t||t.baseMaterial!==e)&&(t=this._derivedMaterial=le(e),e.addEventListener("dispose",function n(){e.removeEventListener("dispose",n),t.dispose()})),t.setUniformNames(this._instancedUniformNames),t}set material(t){if(Array.isArray(t))throw new Error("InstancedUniformsMesh does not support multiple materials");for(;t&&t.isInstancedUniformsMaterial;)t=t.baseMaterial;this._baseMaterial=t}get customDepthMaterial(){return this.material.getDepthMaterial()}get customDistanceMaterial(){return this.material.getDistanceMaterial()}setUniformAt(t,e,n){const u=this.geometry.attributes,r=`troika_attr_${t}`;let o=u[r];if(!o){const c=fe(this._baseMaterial,t),l=de(c);if(o=u[r]=new k(new Float32Array(l*this._maxCount),l),c!==null)for(let a=0;a<this._maxCount;a++)$(o,a,c);this._instancedUniformNames=[...this._instancedUniformNames,t]}$(o,e,n),o.needsUpdate=!0}unsetUniform(t){this.geometry.deleteAttribute(`troika_attr_${t}`),this._instancedUniformNames=this._instancedUniformNames.filter(e=>e!==t)}}function $(s,t,e){let n=s.itemSize;n===1?s.setX(t,e):n===2?s.setXY(t,e.x,e.y):n===3?e.isColor?s.setXYZ(t,e.r,e.g,e.b):s.setXYZ(t,e.x,e.y,e.z):n===4?s.setXYZW(t,e.x,e.y,e.z,e.w):e.toArray?e.toArray(s.array,t*n):s.set(e,t*n)}function fe(s,t){let e=s.uniforms;return e&&e[t]||(e=F(s).uniforms,e&&e[t])?e[t].value:null}function de(s){return s==null?0:typeof s=="number"?1:s.isVector2?2:s.isVector3||s.isColor?3:s.isVector4||s.isQuaternion?4:s.elements?s.elements.length:Array.isArray(s)?s.length:0}B({InstancedUniformsMesh:ue});const w=new X,N=new P,me=`
  varying vec2 vUv;
  uniform vec2 uUv;
  uniform sampler2D uTex;

  void main() {
    vUv = uv;
    vec4 mvPosition = vec4( position, 1.0 );

    #ifdef USE_INSTANCING
      mvPosition = instanceMatrix * mvPosition;
    #endif

    vec3 color = texture(uTex, vec2(uUv.x, 1.-uUv.y)).rgb;
    float gray1 = dot(color, vec3(0.299, 0.587, 0.114));
    float gray2 = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
    float gray3 = max(max(color.r, color.g), color.b);

    float contrast = 0.5;
    float gray = (1.0 + contrast) * (gray1 - 0.5) + 0.5;

    mvPosition.y += -gray;
    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
  }
`,pe=`
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uUv;
  uniform sampler2D uTex;

  void main() {
    vec3 color = texture(uTex, vec2(uUv.x, 1.-uUv.y)).rgb;
    gl_FragColor = vec4(vec3(color), 1.);
    #include <tonemapping_fragment>
    // #include <encodings_fragment>
  }
`,U={uTime:{value:1},uUv:{value:new P(0,0)},uTex:{value:new K}},ge=new W(.88,2,.88),he=new Y({uniforms:U,side:C,vertexShader:me,fragmentShader:pe}),ye=s=>{const t=g.useRef(),{resolution:e}=s,n=({src:u})=>{const r=ce(u);return r.wrapS=T,r.wrapT=T,U.uTex.value=r,i.jsx("meshStandardMaterial",{side:C,map:r,toneMapped:!1,transparent:!0,opacity:.4})};return Z(u=>{if(!t.current)return;const r=u.clock.getElapsedTime();U.uTime.value=r;let o=0;for(let c=0;c<e;c++)for(let l=0;l<e;l++){const a=o++;N.set(l/e,c/e),w.position.set(-e/2+l,0,-e/2+c),w.updateMatrix(),t.current.setMatrixAt(a,w.matrix),t.current.setUniformAt("uUv",a,N)}t.current.instanceMatrix.needsUpdate=!0}),i.jsxs(i.Fragment,{children:[i.jsxs("mesh",{position:[-e/2-7,0,0],rotation:[-Math.PI/2,0,0],children:[i.jsx("planeGeometry",{args:[8,8]}),i.jsx(n,{src:"/r3f-instancing/kunkun.mp4"})]}),i.jsx("instancedUniformsMesh",{ref:t,args:[ge,he,e*e]})]})},_e=()=>{const{resolution:s}=Q({resolution:{value:30,options:[10,20,30,40,50,60,70,80,100]}});return i.jsxs(i.Fragment,{children:[i.jsx(g.Suspense,{children:i.jsxs(q,{dpr:[1,2],camera:{position:[-8,32,40],fov:45},children:[i.jsx("directionalLight",{position:[0,5,0],intensity:4}),i.jsx(H,{files:"./sunset.hdr",environmentIntensity:1}),i.jsx(ye,{resolution:s}),i.jsx(J,{renderOrder:-1,position:[0,-2,0],infiniteGrid:!0,cellSize:.6,cellThickness:.6,sectionSize:3.3,sectionThickness:1.5,sectionColor:"#181818",fadeDistance:1e3}),i.jsx(ee,{makeDefault:!0,enabled:!0,maxPolarAngle:Math.PI/3,minDistance:20,maxDistance:180}),i.jsx(ve,{}),i.jsx(te,{children:i.jsx(se,{distanceFalloff:1,aoRadius:2,intensity:1})}),i.jsx(ne,{position:"top-left"})]})}),i.jsx(re,{})]})},ve=()=>{const s=R(),[t,e]=g.useState(!1);return g.useEffect(()=>{t&&(console.log("degrade!"),s.setDpr(1))},[t]),i.jsx(ie,{onDecline:()=>e(!0)})};export{_e as default};
