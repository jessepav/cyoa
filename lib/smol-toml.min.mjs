var P=/^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i,x=class b extends Date{#n=!1;#i=!1;#e=null;constructor(n){let i=!0,t=!0,r="Z";if(typeof n=="string"){let f=n.match(P);f?(f[1]||(i=!1,n=`0000-01-01T${n}`),t=!!f[2],t&&n[10]===" "&&(n=n.replace(" ","T")),f[2]&&+f[2]>23?n="":(r=f[3]||null,n=n.toUpperCase(),!r&&t&&(n+="Z"))):n=""}super(n),isNaN(this.getTime())||(this.#n=i,this.#i=t,this.#e=r)}isDateTime(){return this.#n&&this.#i}isLocal(){return!this.#n||!this.#i||!this.#e}isDate(){return this.#n&&!this.#i}isTime(){return this.#i&&!this.#n}isValid(){return this.#n||this.#i}toISOString(){let n=super.toISOString();if(this.isDate())return n.slice(0,10);if(this.isTime())return n.slice(11,23);if(this.#e===null)return n.slice(0,-1);if(this.#e==="Z")return n;let i=+this.#e.slice(1,3)*60+ +this.#e.slice(4,6);return i=this.#e[0]==="-"?i:-i,new Date(this.getTime()-i*6e4).toISOString().slice(0,-1)+this.#e}static wrapAsOffsetDateTime(n,i="Z"){let t=new b(n);return t.#e=i,t}static wrapAsLocalDateTime(n){let i=new b(n);return i.#e=null,i}static wrapAsLocalDate(n){let i=new b(n);return i.#i=!1,i.#e=null,i}static wrapAsLocalTime(n){let i=new b(n);return i.#n=!1,i.#e=null,i}};function L(e,n){let i=e.slice(0,n).split(/\r\n|\n|\r/g);return[i.length,i.pop().length+1]}function C(e,n,i){let t=e.split(/\r\n|\n|\r/g),r="",f=(Math.log10(n+1)|0)+1;for(let l=n-1;l<=n+1;l++){let u=t[l-1];u&&(r+=l.toString().padEnd(f," "),r+=":  ",r+=u,r+=`
`,l===n&&(r+=" ".repeat(f+i+2),r+=`^
`))}return r}var c=class extends Error{line;column;codeblock;constructor(e,n){const[i,t]=L(n.toml,n.ptr),r=C(n.toml,i,t);super(`Invalid TOML document: ${e}

${r}`,n),this.line=i,this.column=t,this.codeblock=r}},j=/^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/,R=/^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/,Z=/^[+-]?0[0-9_]/;function D(e,n){let i=e[n++],t=i,r=i==="'",f=i===e[n]&&i===e[n+1];f&&(e[n+=2]===`
`?n++:e[n]==="\r"&&e[n+1]===`
`&&(n+=2));let l="",u=n,a=0;for(let o=n;o<e.length;o++)if(i=e[o],f&&(i===`
`||i==="\r"&&e[o+1]===`
`))a=a&&3;else{if(i<" "&&i!=="	"||i==="\x7F")throw new c("control characters are not allowed in strings",{toml:e,ptr:o});if((!a||a===3)&&i===t&&(!f||e[o+1]===t&&e[o+2]===t))return f&&(e[o+3]===t&&o++,e[o+3]===t&&o++),[a?l:l+e.slice(u,o),o+(f?3:1)];if(!a)!r&&i==="\\"&&(l+=e.slice(u,u=o),a=1);else if(a===1)if(i==="x"||i==="u"||i==="U"){let s=0,h=i==="x"?2:i==="u"?4:8;for(let w=0;w<h;w++,o++){let d=e.charCodeAt(o+1),m=d>=48&&d<=57?d-48:d>=65&&d<=70?d-65+10:d>=97&&d<=102?d-97+10:-1;if(m<0)throw new c("invalid non-hex character in unicode escape",{toml:e,ptr:o+1});s=s<<4|m}if(s<0||s>1114111||s>=55296&&s<=57343)throw new c("invalid unicode escape",{toml:e,ptr:o});l+=String.fromCodePoint(s),u=o+1,a=0}else if(i===" "||i==="	")a=2;else{if(i==="b")l+="\b";else if(i==="t")l+="	";else if(i==="n")l+=`
`;else if(i==="f")l+="\f";else if(i==="r")l+="\r";else if(i==="e")l+="\x1B";else if(i==='"')l+='"';else if(i==="\\")l+="\\";else throw new c("unrecognized escape sequence",{toml:e,ptr:o});u=o+1,a=0}else if(i!==" "&&i!=="	"){if(a===2)throw new c("invalid escape: only line-ending whitespace may be escaped",{toml:e,ptr:u});a=!r&&i==="\\"?1:0,u=o}}throw new c("unfinished string",{toml:e,ptr:n})}function z(e,n,i,t){if(e==="true")return!0;if(e==="false")return!1;if(e==="-inf")return-1/0;if(e==="inf"||e==="+inf")return 1/0;if(e==="nan"||e==="+nan"||e==="-nan")return NaN;if(e==="-0")return t?0n:0;let r=j.test(e);if(r||R.test(e)){if(Z.test(e))throw new c("leading zeroes are not allowed",{toml:n,ptr:i});e=e.replace(/_/g,"");let l=+e;if(isNaN(l))throw new c("invalid number",{toml:n,ptr:i});if(r){if((r=!Number.isSafeInteger(l))&&!t)throw new c("integer value cannot be represented losslessly",{toml:n,ptr:i});(r||t===!0)&&(l=BigInt(e))}return l}const f=new x(e);if(!f.isValid())throw new c("invalid value",{toml:n,ptr:i});return f}function k(e,n=0,i=e.length){let t=e.indexOf(`
`,n);return e[t-1]==="\r"&&t--,t<=i?t:-1}function T(e,n){for(let i=n;i<e.length;i++){let t=e[i];if(t===`
`)return i;if(t==="\r"&&e[i+1]===`
`)return i+1;if(t<" "&&t!=="	"||t==="\x7F")throw new c("control characters are not allowed in comments",{toml:e,ptr:n})}return e.length}function g(e,n,i,t){let r;for(;;){for(;(r=e[n])===" "||r==="	"||!i&&(r===`
`||r==="\r"&&e[n+1]===`
`);)n++;if(t||r!=="#")break;n=T(e,n)}return n}function V(e,n,i,t,r=!1){if(!t)return n=k(e,n),n<0?e.length:n;for(let f=n;f<e.length;f++){let l=e[f];if(l==="#")f=k(e,f);else{if(l===i)return f+1;if(l===t||r&&(l===`
`||l==="\r"&&e[f+1]===`
`))return f}}throw new c("cannot find end of structure",{toml:e,ptr:n})}function M(e,n,i){let t=e.slice(n,i),r=t.indexOf("#");return r>-1&&(T(e,r),t=t.slice(0,r)),[t.trimEnd(),r]}function E(e,n,i,t,r){if(t===0)throw new c("document contains excessively nested structures. aborting.",{toml:e,ptr:n});let f=e[n];if(f==="["||f==="{"){let[a,o]=f==="["?U(e,n,t,r):G(e,n,t,r);if(i){if(o=g(e,o),e[o]===",")o++;else if(e[o]!==i)throw new c("expected comma or end of structure",{toml:e,ptr:o})}return[a,o]}if(f==='"'||f==="'"){let[a,o]=D(e,n);if(i){if(o=g(e,o),e[o]&&e[o]!==","&&e[o]!==i&&e[o]!==`
`&&e[o]!=="\r")throw new c("unexpected character encountered",{toml:e,ptr:o});e[o]===","&&o++}return[a,o]}let l=V(e,n,",",i),u=M(e,n,l-(e[l-1]===","?1:0));if(!u[0])throw new c("incomplete key-value declaration: no value specified",{toml:e,ptr:n});return i&&u[1]>-1&&(l=g(e,n+u[1]),e[l]===","&&l++),[z(u[0],e,n,r),l]}var F=/^[a-zA-Z0-9-_]+[ \t]*$/;function O(e,n,i="="){let t=n-1,r=[],f=e.indexOf(i,n);if(f<0)throw new c("incomplete key-value: cannot find end of key",{toml:e,ptr:n});do{let l=e[n=++t];if(l!==" "&&l!=="	")if(l==='"'||l==="'"){if(l===e[n+1]&&l===e[n+2])throw new c("multiline strings are not allowed in keys",{toml:e,ptr:n});let[u,a]=D(e,n);t=e.indexOf(".",a);let o=e.slice(a,t<0||t>f?f:t),s=k(o);if(s>-1)throw new c("newlines are not allowed in keys",{toml:e,ptr:n+t+s});if(o.trimStart())throw new c("found extra tokens after the string part",{toml:e,ptr:a});if(f<a&&(f=e.indexOf(i,a),f<0))throw new c("incomplete key-value: cannot find end of key",{toml:e,ptr:n});r.push(u)}else{t=e.indexOf(".",n);let u=e.slice(n,t<0||t>f?f:t);if(!F.test(u))throw new c("only letter, numbers, dashes and underscores are allowed in keys",{toml:e,ptr:n});r.push(u.trimEnd())}}while(t+1&&t<f);return[r,g(e,f+1,!0,!0)]}function G(e,n,i,t){let r={},f=new Set,l;for(n++;(l=e[n++])!=="}"&&l;){if(l===",")throw new c("expected value, found comma",{toml:e,ptr:n-1});if(l==="#")n=T(e,n);else if(l!==" "&&l!=="	"&&l!==`
`&&l!=="\r"){let u,a=r,o=!1,[s,h]=O(e,n-1);for(let m=0;m<s.length;m++){if(m&&(a=o?a[u]:a[u]={}),u=s[m],(o=Object.hasOwn(a,u))&&(typeof a[u]!="object"||f.has(a[u])))throw new c("trying to redefine an already defined value",{toml:e,ptr:n});!o&&u==="__proto__"&&Object.defineProperty(a,u,{enumerable:!0,configurable:!0,writable:!0})}if(o)throw new c("trying to redefine an already defined value",{toml:e,ptr:n});let[w,d]=E(e,h,"}",i-1,t);f.add(w),a[u]=w,n=d}}if(!l)throw new c("unfinished table encountered",{toml:e,ptr:n});return[r,n]}function U(e,n,i,t){let r=[],f;for(n++;(f=e[n++])!=="]"&&f;){if(f===",")throw new c("expected value, found comma",{toml:e,ptr:n-1});if(f==="#")n=T(e,n);else if(f!==" "&&f!=="	"&&f!==`
`&&f!=="\r"){let l=E(e,n-1,"]",i-1,t);r.push(l[0]),n=l[1]}}if(!f)throw new c("unfinished array encountered",{toml:e,ptr:n});return[r,n]}function N(e,n,i,t){let r=n,f=i,l,u=!1,a;for(let o=0;o<e.length;o++){if(o){if(r=u?r[l]:r[l]={},f=(a=f[l]).c,t===0&&(a.t===1||a.t===2))return null;if(a.t===2){let s=r.length-1;r=r[s],f=f[s].c}}if(l=e[o],(u=Object.hasOwn(r,l))&&f[l]?.t===0&&f[l]?.d)return null;u||(l==="__proto__"&&(Object.defineProperty(r,l,{enumerable:!0,configurable:!0,writable:!0}),Object.defineProperty(f,l,{enumerable:!0,configurable:!0,writable:!0})),f[l]={t:o<e.length-1&&t===2?3:t,d:!1,i:0,c:{}})}if(a=f[l],a.t!==t&&!(t===1&&a.t===3)||(t===2&&(a.d||(a.d=!0,r[l]=[]),r[l].push(r={}),a.c[a.i++]=a={t:1,d:!1,i:0,c:{}}),a.d))return null;if(a.d=!0,t===1)r=u?r[l]:r[l]={};else if(t===0&&u)return null;return[l,r,a.c]}function I(e,{maxDepth:n=1e3,integersAsBigInt:i}={}){let t={},r={},f=t,l=r;for(let u=g(e,0);u<e.length;){if(e[u]==="["){let a=e[++u]==="[",o=O(e,u+=+a,"]");if(a){if(e[o[1]-1]!=="]")throw new c("expected end of table declaration",{toml:e,ptr:o[1]-1});o[1]++}let s=N(o[0],t,r,a?2:1);if(!s)throw new c("trying to redefine an already defined table or value",{toml:e,ptr:u});l=s[2],f=s[1],u=o[1]}else{let a=O(e,u),o=N(a[0],f,l,0);if(!o)throw new c("trying to redefine an already defined table or value",{toml:e,ptr:u});let s=E(e,a[1],void 0,n,i);o[1][o[0]]=s[0],u=s[1]}if(u=g(e,u,!0),e[u]&&e[u]!==`
`&&e[u]!=="\r")throw new c("each key-value declaration must be followed by an end-of-line",{toml:e,ptr:u});u=g(e,u)}return t}var v=/^[a-z0-9-_]+$/i;function y(e){let n=typeof e;if(n==="object"){if(Array.isArray(e))return"array";if(e instanceof Date)return"date"}return n}function K(e){for(let n=0;n<e.length;n++)if(y(e[n])!=="object")return!1;return e.length!=0}function _(e){return JSON.stringify(e).replace(/\x7f/g,"\\u007f")}function S(e,n,i,t){if(i===0)throw new Error("Could not stringify the object: maximum object depth exceeded");if(n==="number")return isNaN(e)?"nan":e===1/0?"inf":e===-1/0?"-inf":Number.isInteger(e)&&(t||!Number.isSafeInteger(e))?e.toFixed(1):e.toString();if(n==="bigint"||n==="boolean")return e.toString();if(n==="string")return _(e);if(n==="date"){if(isNaN(e.getTime()))throw new TypeError("cannot serialize invalid date");return e.toISOString()}if(n==="object")return X(e,i,t);if(n==="array")return Y(e,i,t)}function X(e,n,i){let t=Object.keys(e);if(t.length===0)return"{}";let r="{ ";for(let f=0;f<t.length;f++){let l=t[f];f&&(r+=", "),r+=v.test(l)?l:_(l),r+=" = ",r+=S(e[l],y(e[l]),n-1,i)}return r+" }"}function Y(e,n,i){if(e.length===0)return"[]";let t="[ ";for(let r=0;r<e.length;r++){if(r&&(t+=", "),e[r]===null||e[r]===void 0)throw new TypeError("arrays cannot contain null or undefined values");t+=S(e[r],y(e[r]),n-1,i)}return t+" ]"}function p(e,n,i,t){if(i===0)throw new Error("Could not stringify the object: maximum object depth exceeded");let r="";for(let f=0;f<e.length;f++)r+=`${r&&`
`}[[${n}]]
`,r+=$(0,e[f],n,i,t);return r}function $(e,n,i,t,r){if(t===0)throw new Error("Could not stringify the object: maximum object depth exceeded");let f="",l="",u=Object.keys(n);for(let a=0;a<u.length;a++){let o=u[a];if(n[o]!==null&&n[o]!==void 0){let s=y(n[o]);if(s==="symbol"||s==="function")throw new TypeError(`cannot serialize values of type '${s}'`);let h=v.test(o)?o:_(o);if(s==="array"&&K(n[o]))l+=(l&&`
`)+p(n[o],i?`${i}.${h}`:h,t-1,r);else if(s==="object"){let w=i?`${i}.${h}`:h;l+=(l&&`
`)+$(w,n[o],w,t-1,r)}else f+=h,f+=" = ",f+=S(n[o],s,t,r),f+=`
`}}return e&&(f||!l)&&(f=f?`[${e}]
${f}`:`[${e}]`),f&&l?`${f}
${l}`:f||l}function A(e,{maxDepth:n=1e3,numbersAsFloat:i=!1}={}){if(y(e)!=="object")throw new TypeError("stringify can only be called with an object");let t=$(0,e,"",n,i);return t[t.length-1]!==`
`?t+`
`:t}var q={parse:I,stringify:A,TomlDate:x,TomlError:c};/*! Bundled license information:

smol-toml/dist/date.js:
smol-toml/dist/error.js:
smol-toml/dist/primitive.js:
smol-toml/dist/util.js:
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
*/export{x as TomlDate,c as TomlError,q as default,I as parse,A as stringify};
