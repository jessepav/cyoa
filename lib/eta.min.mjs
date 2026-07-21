var _=class extends Error{constructor(e){super(e),this.name="Eta Error"}},F=class extends _{constructor(e){super(e),this.name="EtaParser Error"}},T=class extends _{constructor(e){super(e),this.name="EtaRuntime Error"}},P=class extends _{constructor(e){super(e),this.name="EtaFileResolution Error"}},$=class extends _{constructor(e){super(e),this.name="EtaNameResolution Error"}};function y(e,t,n){const i=t.slice(0,n).split(/\n/),s=i.length,a=i[s-1].length+1;throw e+=" at line "+s+" col "+a+`:

  `+t.split(/\n/)[s-1]+`
  `+Array(a).join(" ")+"^",new F(e)}function O(e,t,n,i){const s=t.split(`
`),a=Math.max(n-3,0),l=Math.min(s.length,n+3),c=i,p=s.slice(a,l).map((h,r)=>{const o=r+a+1;return(o===n?" >> ":"    ")+o+"| "+h}).join(`
`),x=c?c+":"+n+`
`:"line "+n+`
`,u=new T(x+p+`

`+e.message);throw u.name=e.name,u.cause=e,u}var M=(async()=>{}).constructor;function W(e,t){const n=this.config,i=t?.async?M:Function;try{return new i(n.varName,"options",this.compileToString.call(this,e,t))}catch(s){throw s instanceof SyntaxError?new F(`Bad template syntax

`+s.message+`
`+Array(s.message.length+1).join("=")+`
`+this.compileToString.call(this,e,t)+`
`):s}}function C(e,t){const n=this.config,i=t?.async,s=this.compileBody,a=this.parse.call(this,e);let l=`${n.functionHeader}
let include = (__eta_t, __eta_d) => this.render(__eta_t, {...${n.varName}, ...(__eta_d ?? {})}, options);
let includeAsync = (__eta_t, __eta_d) => this.renderAsync(__eta_t, {...${n.varName}, ...(__eta_d ?? {})}, options);

let __eta = {res: "", e: this.config.escapeFunction, f: this.config.filterFunction, blocks: {}${n.debug?', line: 1, templateStr: "'+e.replace(/\\|"/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n")+'"':""}};

function layout(path, data) {
  __eta.layout = path;
  __eta.layoutData = data;
}${n.debug?"try {":""}${n.useWith?"with("+n.varName+"||{}){":""}

function ${n.outputFunctionName}(s){__eta.res+=s;}
function capture(fn){const s=__eta.res;__eta.res='';try{fn();return __eta.res}finally{__eta.res=s;}}
async function captureAsync(fn){const s=__eta.res;__eta.res='';try{await fn();return __eta.res}finally{__eta.res=s;}}
function block(name,fn){if(__eta.layout){if(fn){__eta.blocks[name]=capture(fn);}return '';}const b=${n.varName}.__blocks||{};if(name in b){return b[name];}return fn?capture(fn):'';}
async function blockAsync(name,fn){if(__eta.layout){if(fn){__eta.blocks[name]=await captureAsync(fn);}return '';}const b=${n.varName}.__blocks||{};if(name in b){return b[name];}return fn?await captureAsync(fn):'';}

${s.call(this,a)}
if (__eta.layout) {
  __eta.res = ${i?"await includeAsync":"include"} (__eta.layout, {...${n.varName}, body: __eta.res, ...__eta.layoutData, __blocks: __eta.blocks});
}
${n.useWith?"}":""}${n.debug?"} catch (e) { this.RuntimeErr(e, __eta.templateStr, __eta.line, options.filepath) }":""}
return __eta.res;
`;if(n.plugins)for(let c=0;c<n.plugins.length;c++){const p=n.plugins[c];p.processFnString&&(l=p.processFnString(l,n))}return l}function j(e){const t=this.config;let n=0;const i=e.length;let s="";for(n;n<i;n++){const a=e[n];if(typeof a=="string")s+="__eta.res+='"+a+`';
`;else{const l=a.t;let c=a.val||"";t.debug&&(s+="__eta.line="+a.lineNo+`
`),l==="r"?(t.autoFilter&&(c="__eta.f("+c+")"),s+="__eta.res+="+c+`;
`):l==="i"?(t.autoFilter&&(c="__eta.f("+c+")"),t.autoEscape&&(c="__eta.e("+c+")"),s+="__eta.res+="+c+`;
`):l==="e"?s+=c+`
`:Object.hasOwn(t.customTags,l)&&(s+=`__eta.res+=this.config.customTags[${JSON.stringify(l)}](${JSON.stringify(c)},${t.varName});
`)}}return s}function B(e,t,n,i){let s,a;return Array.isArray(t.autoTrim)?(s=t.autoTrim[1],a=t.autoTrim[0]):s=a=t.autoTrim,(n||n===!1)&&(s=n),(i||i===!1)&&(a=i),!a&&!s?e:s==="slurp"&&a==="slurp"?e.trim():(s==="_"||s==="slurp"?e=e.trimStart():(s==="-"||s==="nl")&&(e=e.replace(/^(?:\r\n|\n|\r)/,"")),a==="_"||a==="slurp"?e=e.trimEnd():(a==="-"||a==="nl")&&(e=e.replace(/(?:\r\n|\n|\r)$/,"")),e)}var L={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function Q(e){return L[e]}function D(e){const t=String(e);return/[&<>"']/.test(t)?t.replace(/[&<>"']/g,Q):t}var A={autoEscape:!0,autoFilter:!1,autoTrim:[!1,"nl"],cache:!1,cacheFilepaths:!0,customTags:{},debug:!1,escapeFunction:D,filterFunction:e=>String(e),outputFunctionName:"output",functionHeader:"",parse:{exec:"",interpolate:"=",raw:"~"},plugins:[],rmWhitespace:!1,tags:["<%","%>"],useWith:!1,varName:"it",defaultExtension:".eta"},v=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,b=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,S=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;function w(e){return e.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&")}function H(e,t){return e.slice(0,t).split(`
`).length}function J(e){const t=this.config;let n=[],i=!1,s=0;const a=t.parse,l=Object.keys(t.customTags);if(t.plugins)for(let r=0;r<t.plugins.length;r++){const o=t.plugins[r];o.processTemplate&&(e=o.processTemplate(e,t))}t.rmWhitespace&&(e=e.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"")),v.lastIndex=0,b.lastIndex=0,S.lastIndex=0;function c(r,o){r&&(r=B(r,t,i,o),r&&(r=r.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),n.push(r)))}const p=[a.exec,a.interpolate,a.raw,...l].reduce((r,o)=>r&&o?r+"|"+w(o):o?w(o):r,""),x=new RegExp(w(t.tags[0])+"(-|_)?\\s*("+p+")?\\s*","g"),u=new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?"+w(t.tags[1])+")","g");let h;for(;h=x.exec(e);){const r=e.slice(s,h.index);s=h[0].length+h.index;const o=h[1],m=h[2]||"";c(r,o),u.lastIndex=s;let f,E=!1;for(;f=u.exec(e);)if(f[1]){const g=e.slice(s,f.index);x.lastIndex=s=u.lastIndex,i=f[2],E={t:m===a.exec?"e":m===a.raw?"r":m===a.interpolate?"i":l.includes(m)?m:"",val:g};break}else{const g=f[0];if(g==="/*"){const d=e.indexOf("*/",u.lastIndex);d===-1&&y("unclosed comment",e,f.index),u.lastIndex=d}else g==="'"?(b.lastIndex=f.index,b.exec(e)?u.lastIndex=b.lastIndex:y("unclosed string",e,f.index)):g==='"'?(S.lastIndex=f.index,S.exec(e)?u.lastIndex=S.lastIndex:y("unclosed string",e,f.index)):g==="`"&&(v.lastIndex=f.index,v.exec(e)?u.lastIndex=v.lastIndex:y("unclosed string",e,f.index))}E?(t.debug&&(E.lineNo=H(e,h.index)),n.push(E)):y("unclosed tag",e,h.index)}if(c(e.slice(s,e.length),!1),t.plugins)for(let r=0;r<t.plugins.length;r++){const o=t.plugins[r];o.processAST&&(n=o.processAST(n,t))}return n}function I(e,t){const n=t?.async?this.templatesAsync:this.templatesSync;if(this.resolvePath&&this.readFile&&!e.startsWith("@")){const i=t.filepath,s=n.get(i);if(this.config.cache&&s)return s;{const a=this.readFile(i),l=this.compile(a,t);return this.config.cache&&n.define(i,l),l}}else{const i=n.get(e);if(i)return i;throw new $(`Failed to get template '${e}'`)}}function N(e,t,n){let i;const s={...n,async:!1};return typeof e=="string"?(this.resolvePath&&this.readFile&&!e.startsWith("@")&&(s.filepath=this.resolvePath(e,s)),i=I.call(this,e,s)):i=e,i.call(this,t,s)}function R(e,t,n){let i;const s={...n,async:!0};typeof e=="string"?(this.resolvePath&&this.readFile&&!e.startsWith("@")&&(s.filepath=this.resolvePath(e,s)),i=I.call(this,e,s)):i=e;const a=i.call(this,t,s);return Promise.resolve(a)}function q(e,t){const n=this.compile(e,{async:!1});return N.call(this,n,t)}function X(e,t){const n=this.compile(e,{async:!0});return R.call(this,n,t)}var k=class{constructor(e){this.cache=e}cache;define(e,t){this.cache[e]=t}get(e){return this.cache[e]}remove(e){delete this.cache[e]}reset(){this.cache={}}load(e){this.cache={...this.cache,...e}}},z=class{constructor(e){e?this.config={...A,...e}:this.config={...A};const t=[this.config.parse.exec,this.config.parse.interpolate,this.config.parse.raw,"-","_"];for(const n of Object.keys(this.config.customTags))if(t.includes(n))throw new _(`Custom tag prefix "${n}" conflicts with a built-in prefix`)}config;RuntimeErr=O;compile=W;compileToString=C;compileBody=j;parse=J;render=N;renderAsync=R;renderString=q;renderStringAsync=X;filepathCache={};templatesSync=new k({});templatesAsync=new k({});resolvePath=null;readFile=null;configure(e){this.config={...this.config,...e}}withConfig(e){return{...this,config:{...this.config,...e}}}loadTemplate(e,t,n){if(typeof t=="string")(n?.async?this.templatesAsync:this.templatesSync).define(e,this.compile(t,n));else{let i=this.templatesSync;(t.constructor.name==="AsyncFunction"||n?.async)&&(i=this.templatesAsync),i.define(e,t)}}},G=class extends z{};export{G as Eta,_ as EtaError,P as EtaFileResolutionError,$ as EtaNameResolutionError,F as EtaParseError,T as EtaRuntimeError};
