function L(e,n){let t=e.slice(0,n).split(/\r\n|\n|\r/g);return[t.length,t.pop().length+1]}function R(e,n,t){let i=e.split(/\r\n|\n|\r/g),r="",f=(Math.log10(n+1)|0)+1;for(let l=n-1;l<=n+1;l++){let o=i[l-1];o&&(r+=l.toString().padEnd(f," "),r+=":  ",r+=o,r+=`
`,l===n&&(r+=" ".repeat(f+t+2),r+=`^
`))}return r}var c=class extends Error{line;column;codeblock;constructor(e,n){const[t,i]=L(n.toml,n.ptr),r=R(n.toml,t,i);super(`Invalid TOML document: ${e}

${r}`,n),this.line=t,this.column=i,this.codeblock=r}};function Z(e,n){let t=0;for(;e[n-++t]==="\\";);return--t&&t%2}function E(e,n=0,t=e.length){let i=e.indexOf(`
`,n);return e[i-1]==="\r"&&i--,i<=t?i:-1}function b(e,n){for(let t=n;t<e.length;t++){let i=e[t];if(i===`
`)return t;if(i==="\r"&&e[t+1]===`
`)return t+1;if(i<" "&&i!=="	"||i==="\x7F")throw new c("control characters are not allowed in comments",{toml:e,ptr:n})}return e.length}function h(e,n,t,i){let r;for(;(r=e[n])===" "||r==="	"||!t&&(r===`
`||r==="\r"&&e[n+1]===`
`);)n++;return i||r!=="#"?n:h(e,b(e,n),t)}function j(e,n,t,i,r=!1){if(!i)return n=E(e,n),n<0?e.length:n;for(let f=n;f<e.length;f++){let l=e[f];if(l==="#")f=E(e,f);else{if(l===t)return f+1;if(l===i||r&&(l===`
`||l==="\r"&&e[f+1]===`
`))return f}}throw new c("cannot find end of structure",{toml:e,ptr:n})}function D(e,n){let t=e[n],i=t===e[n+1]&&e[n+1]===e[n+2]?e.slice(n,n+3):t;n+=i.length-1;do n=e.indexOf(i,++n);while(n>-1&&t!=="'"&&Z(e,n));return n>-1&&(n+=i.length,i.length>1&&(e[n]===t&&n++,e[n]===t&&n++)),n}var z=/^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i,T=class g extends Date{#n=!1;#i=!1;#e=null;constructor(n){let t=!0,i=!0,r="Z";if(typeof n=="string"){let f=n.match(z);f?(f[1]||(t=!1,n=`0000-01-01T${n}`),i=!!f[2],i&&n[10]===" "&&(n=n.replace(" ","T")),f[2]&&+f[2]>23?n="":(r=f[3]||null,n=n.toUpperCase(),!r&&i&&(n+="Z"))):n=""}super(n),isNaN(this.getTime())||(this.#n=t,this.#i=i,this.#e=r)}isDateTime(){return this.#n&&this.#i}isLocal(){return!this.#n||!this.#i||!this.#e}isDate(){return this.#n&&!this.#i}isTime(){return this.#i&&!this.#n}isValid(){return this.#n||this.#i}toISOString(){let n=super.toISOString();if(this.isDate())return n.slice(0,10);if(this.isTime())return n.slice(11,23);if(this.#e===null)return n.slice(0,-1);if(this.#e==="Z")return n;let t=+this.#e.slice(1,3)*60+ +this.#e.slice(4,6);return t=this.#e[0]==="-"?t:-t,new Date(this.getTime()-t*6e4).toISOString().slice(0,-1)+this.#e}static wrapAsOffsetDateTime(n,t="Z"){let i=new g(n);return i.#e=t,i}static wrapAsLocalDateTime(n){let t=new g(n);return t.#e=null,t}static wrapAsLocalDate(n){let t=new g(n);return t.#i=!1,t.#e=null,t}static wrapAsLocalTime(n){let t=new g(n);return t.#n=!1,t.#e=null,t}},V=/^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/,M=/^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/,G=/^[+-]?0[0-9_]/,F=/^[0-9a-f]{2,8}$/i,I={b:"\b",t:"	",n:`
`,f:"\f",r:"\r",e:"\x1B",'"':'"',"\\":"\\"};function v(e,n=0,t=e.length){let i=e[n]==="'",r=e[n++]===e[n]&&e[n]===e[n+1];r&&(t-=2,e[n+=2]==="\r"&&n++,e[n]===`
`&&n++);let f=0,l,o="",u=n;for(;n<t-1;){let a=e[n++];if(a===`
`||a==="\r"&&e[n]===`
`){if(!r)throw new c("newlines are not allowed in strings",{toml:e,ptr:n-1})}else if(a<" "&&a!=="	"||a==="\x7F")throw new c("control characters are not allowed in strings",{toml:e,ptr:n-1});if(l){if(l=!1,a==="x"||a==="u"||a==="U"){let d=e.slice(n,n+=a==="x"?2:a==="u"?4:8);if(!F.test(d))throw new c("invalid unicode escape",{toml:e,ptr:f});try{o+=String.fromCodePoint(parseInt(d,16))}catch{throw new c("invalid unicode escape",{toml:e,ptr:f})}}else if(r&&(a===`
`||a===" "||a==="	"||a==="\r")){if(n=h(e,n-1,!0),e[n]!==`
`&&e[n]!=="\r")throw new c("invalid escape: only line-ending whitespace may be escaped",{toml:e,ptr:f});n=h(e,n)}else if(a in I)o+=I[a];else throw new c("unrecognized escape sequence",{toml:e,ptr:f});u=n}else!i&&a==="\\"&&(f=n-1,l=!0,o+=e.slice(u,f))}return o+e.slice(u,t-1)}function U(e,n,t,i){if(e==="true")return!0;if(e==="false")return!1;if(e==="-inf")return-1/0;if(e==="inf"||e==="+inf")return 1/0;if(e==="nan"||e==="+nan"||e==="-nan")return NaN;if(e==="-0")return i?0n:0;let r=V.test(e);if(r||M.test(e)){if(G.test(e))throw new c("leading zeroes are not allowed",{toml:n,ptr:t});e=e.replace(/_/g,"");let l=+e;if(isNaN(l))throw new c("invalid number",{toml:n,ptr:t});if(r){if((r=!Number.isSafeInteger(l))&&!i)throw new c("integer value cannot be represented losslessly",{toml:n,ptr:t});(r||i===!0)&&(l=BigInt(e))}return l}const f=new T(e);if(!f.isValid())throw new c("invalid value",{toml:n,ptr:t});return f}function X(e,n,t){let i=e.slice(n,t),r=i.indexOf("#");return r>-1&&(b(e,r),i=i.slice(0,r)),[i.trimEnd(),r]}function x(e,n,t,i,r){if(i===0)throw new c("document contains excessively nested structures. aborting.",{toml:e,ptr:n});let f=e[n];if(f==="["||f==="{"){let[u,a]=f==="["?q(e,n,i,r):Y(e,n,i,r);if(t){if(a=h(e,a),e[a]===",")a++;else if(e[a]!==t)throw new c("expected comma or end of structure",{toml:e,ptr:a})}return[u,a]}let l;if(f==='"'||f==="'"){l=D(e,n);let u=v(e,n,l);if(t){if(l=h(e,l),e[l]&&e[l]!==","&&e[l]!==t&&e[l]!==`
`&&e[l]!=="\r")throw new c("unexpected character encountered",{toml:e,ptr:l});l+=+(e[l]===",")}return[u,l]}l=j(e,n,",",t);let o=X(e,n,l-+(e[l-1]===","));if(!o[0])throw new c("incomplete key-value declaration: no value specified",{toml:e,ptr:n});return t&&o[1]>-1&&(l=h(e,n+o[1]),l+=+(e[l]===",")),[U(o[0],e,n,r),l]}var K=/^[a-zA-Z0-9-_]+[ \t]*$/;function O(e,n,t="="){let i=n-1,r=[],f=e.indexOf(t,n);if(f<0)throw new c("incomplete key-value: cannot find end of key",{toml:e,ptr:n});do{let l=e[n=++i];if(l!==" "&&l!=="	")if(l==='"'||l==="'"){if(l===e[n+1]&&l===e[n+2])throw new c("multiline strings are not allowed in keys",{toml:e,ptr:n});let o=D(e,n);if(o<0)throw new c("unfinished string encountered",{toml:e,ptr:n});i=e.indexOf(".",o);let u=e.slice(o,i<0||i>f?f:i),a=E(u);if(a>-1)throw new c("newlines are not allowed in keys",{toml:e,ptr:n+i+a});if(u.trimStart())throw new c("found extra tokens after the string part",{toml:e,ptr:o});if(f<o&&(f=e.indexOf(t,o),f<0))throw new c("incomplete key-value: cannot find end of key",{toml:e,ptr:n});r.push(v(e,n,o))}else{i=e.indexOf(".",n);let o=e.slice(n,i<0||i>f?f:i);if(!K.test(o))throw new c("only letter, numbers, dashes and underscores are allowed in keys",{toml:e,ptr:n});r.push(o.trimEnd())}}while(i+1&&i<f);return[r,h(e,f+1,!0,!0)]}function Y(e,n,t,i){let r={},f=new Set,l;for(n++;(l=e[n++])!=="}"&&l;){if(l===",")throw new c("expected value, found comma",{toml:e,ptr:n-1});if(l==="#")n=b(e,n);else if(l!==" "&&l!=="	"&&l!==`
`&&l!=="\r"){let o,u=r,a=!1,[d,s]=O(e,n-1);for(let y=0;y<d.length;y++){if(y&&(u=a?u[o]:u[o]={}),o=d[y],(a=Object.hasOwn(u,o))&&(typeof u[o]!="object"||f.has(u[o])))throw new c("trying to redefine an already defined value",{toml:e,ptr:n});!a&&o==="__proto__"&&Object.defineProperty(u,o,{enumerable:!0,configurable:!0,writable:!0})}if(a)throw new c("trying to redefine an already defined value",{toml:e,ptr:n});let[w,C]=x(e,s,"}",t-1,i);f.add(w),u[o]=w,n=C}}if(!l)throw new c("unfinished table encountered",{toml:e,ptr:n});return[r,n]}function q(e,n,t,i){let r=[],f;for(n++;(f=e[n++])!=="]"&&f;){if(f===",")throw new c("expected value, found comma",{toml:e,ptr:n-1});if(f==="#")n=b(e,n);else if(f!==" "&&f!=="	"&&f!==`
`&&f!=="\r"){let l=x(e,n-1,"]",t-1,i);r.push(l[0]),n=l[1]}}if(!f)throw new c("unfinished array encountered",{toml:e,ptr:n});return[r,n]}function N(e,n,t,i){let r=n,f=t,l,o=!1,u;for(let a=0;a<e.length;a++){if(a){if(r=o?r[l]:r[l]={},f=(u=f[l]).c,i===0&&(u.t===1||u.t===2))return null;if(u.t===2){let d=r.length-1;r=r[d],f=f[d].c}}if(l=e[a],(o=Object.hasOwn(r,l))&&f[l]?.t===0&&f[l]?.d)return null;o||(l==="__proto__"&&(Object.defineProperty(r,l,{enumerable:!0,configurable:!0,writable:!0}),Object.defineProperty(f,l,{enumerable:!0,configurable:!0,writable:!0})),f[l]={t:a<e.length-1&&i===2?3:i,d:!1,i:0,c:{}})}if(u=f[l],u.t!==i&&!(i===1&&u.t===3)||(i===2&&(u.d||(u.d=!0,r[l]=[]),r[l].push(r={}),u.c[u.i++]=u={t:1,d:!1,i:0,c:{}}),u.d))return null;if(u.d=!0,i===1)r=o?r[l]:r[l]={};else if(i===0&&o)return null;return[l,r,u.c]}function A(e,{maxDepth:n=1e3,integersAsBigInt:t}={}){let i={},r={},f=i,l=r;for(let o=h(e,0);o<e.length;){if(e[o]==="["){let u=e[++o]==="[",a=O(e,o+=+u,"]");if(u){if(e[a[1]-1]!=="]")throw new c("expected end of table declaration",{toml:e,ptr:a[1]-1});a[1]++}let d=N(a[0],i,r,u?2:1);if(!d)throw new c("trying to redefine an already defined table or value",{toml:e,ptr:o});l=d[2],f=d[1],o=a[1]}else{let u=O(e,o),a=N(u[0],f,l,0);if(!a)throw new c("trying to redefine an already defined table or value",{toml:e,ptr:o});let d=x(e,u[1],void 0,n,t);a[1][a[0]]=d[0],o=d[1]}if(o=h(e,o,!0),e[o]&&e[o]!==`
`&&e[o]!=="\r")throw new c("each key-value declaration must be followed by an end-of-line",{toml:e,ptr:o});o=h(e,o)}return i}var k=/^[a-z0-9-_]+$/i;function m(e){let n=typeof e;if(n==="object"){if(Array.isArray(e))return"array";if(e instanceof Date)return"date"}return n}function J(e){for(let n=0;n<e.length;n++)if(m(e[n])!=="object")return!1;return e.length!=0}function _(e){return JSON.stringify(e).replace(/\x7f/g,"\\u007f")}function S(e,n,t,i){if(t===0)throw new Error("Could not stringify the object: maximum object depth exceeded");if(n==="number")return isNaN(e)?"nan":e===1/0?"inf":e===-1/0?"-inf":i&&Number.isInteger(e)?e.toFixed(1):e.toString();if(n==="bigint"||n==="boolean")return e.toString();if(n==="string")return _(e);if(n==="date"){if(isNaN(e.getTime()))throw new TypeError("cannot serialize invalid date");return e.toISOString()}if(n==="object")return B(e,t,i);if(n==="array")return H(e,t,i)}function B(e,n,t){let i=Object.keys(e);if(i.length===0)return"{}";let r="{ ";for(let f=0;f<i.length;f++){let l=i[f];f&&(r+=", "),r+=k.test(l)?l:_(l),r+=" = ",r+=S(e[l],m(e[l]),n-1,t)}return r+" }"}function H(e,n,t){if(e.length===0)return"[]";let i="[ ";for(let r=0;r<e.length;r++){if(r&&(i+=", "),e[r]===null||e[r]===void 0)throw new TypeError("arrays cannot contain null or undefined values");i+=S(e[r],m(e[r]),n-1,t)}return i+" ]"}function Q(e,n,t,i){if(t===0)throw new Error("Could not stringify the object: maximum object depth exceeded");let r="";for(let f=0;f<e.length;f++)r+=`${r&&`
`}[[${n}]]
`,r+=$(0,e[f],n,t,i);return r}function $(e,n,t,i,r){if(i===0)throw new Error("Could not stringify the object: maximum object depth exceeded");let f="",l="",o=Object.keys(n);for(let u=0;u<o.length;u++){let a=o[u];if(n[a]!==null&&n[a]!==void 0){let d=m(n[a]);if(d==="symbol"||d==="function")throw new TypeError(`cannot serialize values of type '${d}'`);let s=k.test(a)?a:_(a);if(d==="array"&&J(n[a]))l+=(l&&`
`)+Q(n[a],t?`${t}.${s}`:s,i-1,r);else if(d==="object"){let w=t?`${t}.${s}`:s;l+=(l&&`
`)+$(w,n[a],w,i-1,r)}else f+=s,f+=" = ",f+=S(n[a],d,i,r),f+=`
`}}return e&&(f||!l)&&(f=f?`[${e}]
${f}`:`[${e}]`),f&&l?`${f}
${l}`:f||l}function P(e,{maxDepth:n=1e3,numbersAsFloat:t=!1}={}){if(m(e)!=="object")throw new TypeError("stringify can only be called with an object");let i=$(0,e,"",n,t);return i[i.length-1]!==`
`?i+`
`:i}var W={parse:A,stringify:P,TomlDate:T,TomlError:c};/*! Bundled license information:

smol-toml/dist/error.js:
smol-toml/dist/util.js:
smol-toml/dist/date.js:
smol-toml/dist/primitive.js:
smol-toml/dist/extract.js:
smol-toml/dist/struct.js:
smol-toml/dist/parse.js:
smol-toml/dist/stringify.js:
smol-toml/dist/index.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)
*/export{T as TomlDate,c as TomlError,W as default,A as parse,P as stringify};
