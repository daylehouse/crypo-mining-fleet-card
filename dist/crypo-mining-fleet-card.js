/*! For license information please see crypo-mining-fleet-card.js.LICENSE.txt */
var t={d:(e,i)=>{for(var s in i)t.o(i,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:i[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)};(()=>{var e;if("string"==typeof import.meta.url&&(e=import.meta.url),!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/^blob:/,"").replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),t.p=e})();const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},a=(t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}},h=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:p,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:f}=Object,_=globalThis,y=_.trustedTypes,$=y?y.emptyScript:"",m=_.reactiveElementPolyfillSupport,g=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?$:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},A=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:A};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;class E extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=p(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return a(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??A)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[g("elementProperties")]=new Map,E[g("finalized")]=new Map,m?.({ReactiveElement:E}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,S=t=>t,C=w.trustedTypes,x=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,P="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,U="?"+O,M=`<${U}>`,H=document,N=()=>H.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,k=t=>R(t)||"function"==typeof t?.[Symbol.iterator],j="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,L=/>/g,I=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),W=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=q(1),J=(q(2),q(3),Symbol.for("lit-noChange")),K=Symbol.for("lit-nothing"),Z=new WeakMap,G=H.createTreeWalker(H,129);function Q(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=z;for(let e=0;e<i;e++){const i=t[e];let a,h,c=-1,l=0;for(;l<i.length&&(o.lastIndex=l,h=o.exec(i),null!==h);)l=o.lastIndex,o===z?"!--"===h[1]?o=D:void 0!==h[1]?o=L:void 0!==h[2]?(F.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=I):void 0!==h[3]&&(o=I):o===I?">"===h[0]?(o=n??z,c=-1):void 0===h[1]?c=-2:(c=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?I:'"'===h[3]?B:W):o===B||o===W?o=I:o===D||o===L?o=z:(o=I,n=void 0);const p=o===I&&t[e+1].startsWith("/>")?" ":"";r+=o===z?i+M:c>=0?(s.push(a),i.slice(0,c)+P+i.slice(c)+O+p):i+O+(-2===c?e:p)}return[Q(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,c]=X(t,e);if(this.el=Y.createElement(h,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(P)){const e=c[r++],i=s.getAttribute(t).split(O),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?nt:"?"===o[1]?rt:"@"===o[1]?ot:st}),s.removeAttribute(t)}else t.startsWith(O)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(F.test(s.tagName)){const t=s.textContent.split(O),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),G.nextNode(),a.push({type:2,index:++n});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===U)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(O,t+1));)a.push({type:7,index:n}),t+=O.length-1}n++}}static createElement(t,e){const i=H.createElement("template");return i.innerHTML=t,i}}function tt(t,e,i=t,s){if(e===J)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=T(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=tt(t,n._$AS(t,e.values),n,s)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??H).importNode(e,!0);G.currentNode=s;let n=G.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new it(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new at(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=G.nextNode(),r++)}return G.currentNode=H,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class it{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),T(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==J&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):k(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new et(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Y(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new it(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=tt(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==J,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=tt(this,s[i+o],e,o),a===J&&(a=this._$AH[o]),r||=!T(a)||a!==this._$AH[o],a===K?t=K:t!==K&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class nt extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class rt extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class ot extends st{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??K)===J)return;const i=this._$AH,s=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==K&&(i===K||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const ht=w.litHtmlPolyfillSupport;ht?.(Y,it),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;class lt extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new it(e.insertBefore(N(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const pt=ct.litElementPolyfillSupport;pt?.({LitElement:lt});(ct.litElementVersions??=[]).push("4.2.2");const dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:A},ut=(t=dt,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};const ft=t.p+"assets/baselayer.png";var _t=function(t,e,i,s){var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o};let yt=class extends lt{constructor(){super(...arguments),Object.defineProperty(this,"hass",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"_config",{enumerable:!0,configurable:!0,writable:!0,value:void 0})}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Invalid configuration");this._config=t}getCardSize(){return 5}getGridOptions(){return{rows:5,min_rows:3,columns:12}}static getStubConfig(){return{online_miners_entity:"sensor.online_miners",offline_miners_entity:"sensor.miners_offline",fleet_power_entity:"sensor.fleet_power",fleet_energy_efficiency_entity:"sensor.fleet_energy_efficiency"}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"online_miners_entity",selector:{entity:{}}},{name:"fleet_energy_efficiency_entity",selector:{entity:{}}},{name:"fleet_power_entity",selector:{entity:{}}},{name:"offline_miners_entity",selector:{entity:{}}}],computeLabel:t=>"title"===t.name?"Card Title":"online_miners_entity"===t.name?"Online Miners Entity":"fleet_energy_efficiency_entity"===t.name?"Energy Efficiency Entity":"fleet_power_entity"===t.name?"Power Entity":"offline_miners_entity"===t.name?"Miners Offline Entity":void 0,computeHelper:t=>"title"===t.name?"Optional title displayed at the top of the card":"online_miners_entity"===t.name?"Select the entity to display as Online Miners":"fleet_energy_efficiency_entity"===t.name?"Select the entity to display as Energy Efficiency":"fleet_power_entity"===t.name?"Select the entity to display as Power":"offline_miners_entity"===t.name?"Select the entity to display as Miners Offline":void 0}}_getEntityState(t){if(!t)return"--";const e=this.hass?.states?.[t]?.state;return e??"n/a"}_getEntityStateWithUnit(t){const e=this._getEntityState(t);if("--"===e||"n/a"===e)return e;if(!t)return e;const i=this.hass?.states?.[t]?.attributes?.unit_of_measurement;return"string"==typeof i&&i.trim().length>0?`${e} ${i}`:e}_formatPowerState(t){const e=this._getEntityState(t);if("--"===e||"n/a"===e)return e;const i=Number(e);if(!Number.isFinite(i))return this._getEntityStateWithUnit(t);if(i>=1e3){return`${(i/1e3).toFixed(1)} kW`}return`${Math.round(i)} W`}_formatEfficiencyState(t){const e=this._getEntityState(t);if("--"===e||"n/a"===e)return e;const i=Number(e);return Number.isFinite(i)?`${i.toFixed(2)} J/TH`:this._getEntityStateWithUnit(t)}render(){const t=this._config?.title?.trim()||"Crypto Mining Fleet";return V`
      <ha-card>
        <div class="card-shell">
          <img class="card-image" src=${ft} alt="Crypto miner card image" />
          <div class="stage-layer">
            <div class="card-title stage-item">${t}</div>

            <div class="sensor-chip stage-item hud-online">
              <span class="chip-prefix chip-online">ONL</span>
              <span class="chip-label">Online Miners</span>
              <span class="chip-value">${this._getEntityState(this._config?.online_miners_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-efficiency">
              <span class="chip-prefix chip-efficiency">EFF</span>
              <span class="chip-label">Energy Efficiency</span>
              <span class="chip-value"
                >${this._formatEfficiencyState(this._config?.fleet_energy_efficiency_entity)}</span
              >
            </div>

            <div class="sensor-chip stage-item hud-power">
              <span class="chip-prefix chip-power">PWR</span>
              <span class="chip-label">Power</span>
              <span class="chip-value">${this._formatPowerState(this._config?.fleet_power_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-offline">
              <span class="chip-prefix chip-offline">OFF</span>
              <span class="chip-label">Miners Offline</span>
              <span class="chip-value">${this._getEntityState(this._config?.offline_miners_entity)}</span>
            </div>
          </div>
        </div>
      </ha-card>
    `}static get styles(){return o`
      :host {
        margin: 0;
        padding: 0;
        display: block;
      }

      ha-card {
        padding: 0;
        overflow: hidden;
      }

      .card-shell {
        position: relative;
        overflow: hidden;
        aspect-ratio: 16 / 18.9;
      }

      .card-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 35%;
      }

      .stage-layer {
        position: absolute;
        inset: 0;
        background: transparent;
        pointer-events: none;
      }

      .stage-item {
        pointer-events: auto;
        z-index: 2;
      }

      .card-title {
        position: absolute;
        top: 9%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        padding: 6px 12px;
        color: #fff;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        background: rgba(10, 12, 18, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .sensor-chip {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        background: transparent;
        color: #fff;
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 0.75rem;
        line-height: 1;
        transform: translate(-50%, -50%);
      }

      .chip-prefix {
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 0.62rem;
        letter-spacing: 0.04em;
        font-weight: 700;
        color: #fff;
      }

      .chip-label {
        opacity: 0.9;
      }

      .chip-value {
        margin-left: 2px;
        font-weight: 700;
      }

      .chip-online {
        background: rgba(27, 146, 73, 0.9);
      }

      .chip-efficiency {
        background: rgba(57, 102, 195, 0.9);
      }

      .chip-power {
        background: rgba(181, 104, 12, 0.9);
      }

      .chip-offline {
        background: rgba(165, 39, 45, 0.9);
      }

      .hud-online {
        top: 20%;
        left: 24%;
      }

      .hud-efficiency {
        top: 31%;
        left: 58%;
      }

      .hud-power {
        top: 72%;
        left: 70%;
      }

      .hud-offline {
        top: 73%;
        left: 34%;
      }
    `}};_t([function(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}({attribute:!1})],yt.prototype,"hass",void 0),yt=_t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("crypto-miner-card")],yt),window.customCards=window.customCards||[],window.customCards.push({type:"crypto-miner-card",name:"Crypto Miner Card",description:"Custom card for monitoring crypto miner fleet",preview:!0,documentationURL:"https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/"});export{yt as CryptoMinerCard};