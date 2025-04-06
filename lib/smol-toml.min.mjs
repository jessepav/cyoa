function R(e,n){let i=e.slice(0,n).split(/\r\n|\n|\r/g);return[i.length,i.pop().length+1]}function Z(e,n,i){let t=e.split(/\r\n|\n|\r/g),r="",l=(Math.log10(n+1)|0)+1;for(let o=n-1;o<=n+1;o++){let f=t[o-1];f&&(r+=o.toString().padEnd(l," "),r+=":  ",r+=f,r+=`
`,o===n&&(r+=" ".repeat(l+i+2),r+=`^
`))}return r}var c=class extends Error{line;column;codeblock;constructor(e,n){const[i,t]=R(n.toml,n.ptr),r=Z(n.toml,i,t);super(`Invalid TOML document: ${e}

${r}`,n),this.line=i,this.column=t,this.codeblock=r}};function g(e,n=0,i=e.length){let t=e.indexOf(`
`,n);return e[t-1]==="\r"&&t--,t<=i?t:-1}function b(e,n){for(let i=n;i<e.length;i++){let t=e[i];if(t===`
`)return i;if(t==="\r"&&e[i+1]===`
`)return i+1;if(t<" "&&t!=="	"||t==="\x7F")throw new c("control characters are not allowed in comments",{toml:e,ptr:n})}return e.length}function s(e,n,i,t){let r;for(;(r=e[n])===" "||r==="	"||!i&&(r===`
`||r==="\r"&&e[n+1]===`
`);)n++;return t||r!=="#"?n:s(e,b(e,n),i)}function S(e,n,i,t,r=!1){if(!t)return n=g(e,n),n<0?e.length:n;for(let l=n;l<e.length;l++){let o=e[l];if(o==="#")l=g(e,l);else{if(o===i)return l+1;if(o===t)return l;if(r&&(o===`
`||o==="\r"&&e[l+1]===`
`))return l}}throw new c("cannot find end of structure",{toml:e,ptr:n})}function D(e,n){let i=e[n],t=i===e[n+1]&&e[n+1]===e[n+2]?e.slice(n,n+3):i;n+=t.length-1;do n=e.indexOf(t,++n);while(n>-1&&i!=="'"&&e[n-1]==="\\"&&e[n-2]!=="\\");return n>-1&&(n+=t.length,t.length>1&&(e[n]===i&&n++,e[n]===i&&n++)),n}var j=/^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}:\d{2}(?:\.\d+)?)?(Z|[-+]\d{2}:\d{2})?$/i,y=class h extends Date{#n=!1;#i=!1;#e=null;constructor(n){let i=!0,t=!0,r="Z";if(typeof n=="string"){let l=n.match(j);l?(l[1]||(i=!1,n=`0000-01-01T${n}`),t=!!l[2],l[2]&&+l[2]>23?n="":(r=l[3]||null,n=n.toUpperCase(),!r&&t&&(n+="Z"))):n=""}super(n),isNaN(this.getTime())||(this.#n=i,this.#i=t,this.#e=r)}isDateTime(){return this.#n&&this.#i}isLocal(){return!this.#n||!this.#i||!this.#e}isDate(){return this.#n&&!this.#i}isTime(){return this.#i&&!this.#n}isValid(){return this.#n||this.#i}toISOString(){let n=super.toISOString();if(this.isDate())return n.slice(0,10);if(this.isTime())return n.slice(11,23);if(this.#e===null)return n.slice(0,-1);if(this.#e==="Z")return n;let i=+this.#e.slice(1,3)*60+ +this.#e.slice(4,6);return i=this.#e[0]==="-"?i:-i,new Date(this.getTime()-i*6e4).toISOString().slice(0,-1)+this.#e}static wrapAsOffsetDateTime(n,i="Z"){let t=new h(n);return t.#e=i,t}static wrapAsLocalDateTime(n){let i=new h(n);return i.#e=null,i}static wrapAsLocalDate(n){let i=new h(n);return i.#i=!1,i.#e=null,i}static wrapAsLocalTime(n){let i=new h(n);return i.#n=!1,i.#e=null,i}},z=/^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/,F=/^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/,V=/^[+-]?0[0-9_]/,M=/^[0-9a-f]{4,8}$/i,v={b:"\b",t:"	",n:`
`,f:"\f",r:"\r",'"':'"',"\\":"\\"};function I(e,n=0,i=e.length){let t=e[n]==="'",r=e[n++]===e[n]&&e[n]===e[n+1];r&&(i-=2,e[n+=2]==="\r"&&n++,e[n]===`
`&&n++);let l=0,o,f="",a=n;for(;n<i-1;){let u=e[n++];if(u===`
`||u==="\r"&&e[n]===`
`){if(!r)throw new c("newlines are not allowed in strings",{toml:e,ptr:n-1})}else if(u<" "&&u!=="	"||u==="\x7F")throw new c("control characters are not allowed in strings",{toml:e,ptr:n-1});if(o){if(o=!1,u==="u"||u==="U"){let d=e.slice(n,n+=u==="u"?4:8);if(!M.test(d))throw new c("invalid unicode escape",{toml:e,ptr:l});try{f+=String.fromCodePoint(parseInt(d,16))}catch{throw new c("invalid unicode escape",{toml:e,ptr:l})}}else if(r&&(u===`
`||u===" "||u==="	"||u==="\r")){if(n=s(e,n-1,!0),e[n]!==`
`&&e[n]!=="\r")throw new c("invalid escape: only line-ending whitespace may be escaped",{toml:e,ptr:l});n=s(e,n)}else if(u in v)f+=v[u];else throw new c("unrecognized escape sequence",{toml:e,ptr:l});a=n}else!t&&u==="\\"&&(l=n-1,o=!0,f+=e.slice(a,l))}return f+e.slice(a,i-1)}function G(e,n,i){if(e==="true")return!0;if(e==="false")return!1;if(e==="-inf")return-1/0;if(e==="inf"||e==="+inf")return 1/0;if(e==="nan"||e==="+nan"||e==="-nan")return NaN;if(e==="-0")return 0;let t;if((t=z.test(e))||F.test(e)){if(V.test(e))throw new c("leading zeroes are not allowed",{toml:n,ptr:i});let l=+e.replace(/_/g,"");if(isNaN(l))throw new c("invalid number",{toml:n,ptr:i});if(t&&!Number.isSafeInteger(l))throw new c("integer value cannot be represented losslessly",{toml:n,ptr:i});return l}let r=new y(e);if(!r.isValid())throw new c("invalid value",{toml:n,ptr:i});return r}function K(e,n,i,t){let r=e.slice(n,i),l=r.indexOf("#");l>-1&&(b(e,l),r=r.slice(0,l));let o=r.trimEnd();if(!t){let f=r.indexOf(`
`,o.length);if(f>-1)throw new c("newlines are not allowed in inline tables",{toml:e,ptr:n+f})}return[o,l]}function E(e,n,i,t){if(t===0)throw new c("document contains excessively nested structures. aborting.",{toml:e,ptr:n});let r=e[n];if(r==="["||r==="{"){let[f,a]=r==="["?B(e,n,t):X(e,n,t),u=S(e,a,",",i);if(i==="}"){let d=g(e,a,u);if(d>-1)throw new c("newlines are not allowed in inline tables",{toml:e,ptr:d})}return[f,u]}let l;if(r==='"'||r==="'"){l=D(e,n);let f=I(e,n,l);if(i){if(l=s(e,l,i!=="]"),e[l]&&e[l]!==","&&e[l]!==i&&e[l]!==`
`&&e[l]!=="\r")throw new c("unexpected character encountered",{toml:e,ptr:l});l+=+(e[l]===",")}return[f,l]}l=S(e,n,",",i);let o=K(e,n,l-+(e[l-1]===","),i==="]");if(!o[0])throw new c("incomplete key-value declaration: no value specified",{toml:e,ptr:n});return i&&o[1]>-1&&(l=s(e,n+o[1]),l+=+(e[l]===",")),[G(o[0],e,n),l]}var U=/^[a-zA-Z0-9-_]+[ \t]*$/;function x(e,n,i="="){let t=n-1,r=[],l=e.indexOf(i,n);if(l<0)throw new c("incomplete key-value: cannot find end of key",{toml:e,ptr:n});do{let o=e[n=++t];if(o!==" "&&o!=="	")if(o==='"'||o==="'"){if(o===e[n+1]&&o===e[n+2])throw new c("multiline strings are not allowed in keys",{toml:e,ptr:n});let f=D(e,n);if(f<0)throw new c("unfinished string encountered",{toml:e,ptr:n});t=e.indexOf(".",f);let a=e.slice(f,t<0||t>l?l:t),u=g(a);if(u>-1)throw new c("newlines are not allowed in keys",{toml:e,ptr:n+t+u});if(a.trimStart())throw new c("found extra tokens after the string part",{toml:e,ptr:f});if(l<f&&(l=e.indexOf(i,f),l<0))throw new c("incomplete key-value: cannot find end of key",{toml:e,ptr:n});r.push(I(e,n,f))}else{t=e.indexOf(".",n);let f=e.slice(n,t<0||t>l?l:t);if(!U.test(f))throw new c("only letter, numbers, dashes and underscores are allowed in keys",{toml:e,ptr:n});r.push(f.trimEnd())}}while(t+1&&t<l);return[r,s(e,l+1,!0,!0)]}function X(e,n,i){let t={},r=new Set,l,o=0;for(n++;(l=e[n++])!=="}"&&l;){if(l===`
`)throw new c("newlines are not allowed in inline tables",{toml:e,ptr:n-1});if(l==="#")throw new c("inline tables cannot contain comments",{toml:e,ptr:n-1});if(l===",")throw new c("expected key-value, found comma",{toml:e,ptr:n-1});if(l!==" "&&l!=="	"){let f,a=t,u=!1,[d,P]=x(e,n-1);for(let m=0;m<d.length;m++){if(m&&(a=u?a[f]:a[f]={}),f=d[m],(u=Object.hasOwn(a,f))&&(typeof a[f]!="object"||r.has(a[f])))throw new c("trying to redefine an already defined value",{toml:e,ptr:n});!u&&f==="__proto__"&&Object.defineProperty(a,f,{enumerable:!0,configurable:!0,writable:!0})}if(u)throw new c("trying to redefine an already defined value",{toml:e,ptr:n});let[A,C]=E(e,P,"}",i-1);r.add(A),a[f]=A,n=C,o=e[n-1]===","?n-1:0}}if(o)throw new c("trailing commas are not allowed in inline tables",{toml:e,ptr:o});if(!l)throw new c("unfinished table encountered",{toml:e,ptr:n});return[t,n]}function B(e,n,i){let t=[],r;for(n++;(r=e[n++])!=="]"&&r;){if(r===",")throw new c("expected value, found comma",{toml:e,ptr:n-1});if(r==="#")n=b(e,n);else if(r!==" "&&r!=="	"&&r!==`
`&&r!=="\r"){let l=E(e,n-1,"]",i-1);t.push(l[0]),n=l[1]}}if(!r)throw new c("unfinished array encountered",{toml:e,ptr:n});return[t,n]}function $(e,n,i,t){let r=n,l=i,o,f=!1,a;for(let u=0;u<e.length;u++){if(u){if(r=f?r[o]:r[o]={},l=(a=l[o]).c,t===0&&(a.t===1||a.t===2))return null;if(a.t===2){let d=r.length-1;r=r[d],l=l[d].c}}if(o=e[u],(f=Object.hasOwn(r,o))&&l[o]?.t===0&&l[o]?.d)return null;f||(o==="__proto__"&&(Object.defineProperty(r,o,{enumerable:!0,configurable:!0,writable:!0}),Object.defineProperty(l,o,{enumerable:!0,configurable:!0,writable:!0})),l[o]={t:u<e.length-1&&t===2?3:t,d:!1,i:0,c:{}})}if(a=l[o],a.t!==t&&!(t===1&&a.t===3)||(t===2&&(a.d||(a.d=!0,r[o]=[]),r[o].push(r={}),a.c[a.i++]=a={t:1,d:!1,i:0,c:{}}),a.d))return null;if(a.d=!0,t===1)r=f?r[o]:r[o]={};else if(t===0&&f)return null;return[o,r,a.c]}function N(e,n){let i=n?.maxDepth??1e3,t={},r={},l=t,o=r;for(let f=s(e,0);f<e.length;){if(e[f]==="["){let a=e[++f]==="[",u=x(e,f+=+a,"]");if(a){if(e[u[1]-1]!=="]")throw new c("expected end of table declaration",{toml:e,ptr:u[1]-1});u[1]++}let d=$(u[0],t,r,a?2:1);if(!d)throw new c("trying to redefine an already defined table or value",{toml:e,ptr:f});o=d[2],l=d[1],f=u[1]}else{let a=x(e,f),u=$(a[0],l,o,0);if(!u)throw new c("trying to redefine an already defined table or value",{toml:e,ptr:f});let d=E(e,a[1],void 0,i);u[1][u[0]]=d[0],f=d[1]}if(f=s(e,f,!0),e[f]&&e[f]!==`
`&&e[f]!=="\r")throw new c("each key-value declaration must be followed by an end-of-line",{toml:e,ptr:f});f=s(e,f)}return t}var k=/^[a-z0-9-_]+$/i;function w(e){let n=typeof e;if(n==="object"){if(Array.isArray(e))return"array";if(e instanceof Date)return"date"}return n}function Y(e){for(let n=0;n<e.length;n++)if(w(e[n])!=="object")return!1;return e.length!=0}function T(e){return JSON.stringify(e).replace(/\x7f/g,"\\u007f")}function O(e,n,i){if(i===0)throw new Error("Could not stringify the object: maximum object depth exceeded");if(n==="number")return isNaN(e)?"nan":e===1/0?"inf":e===-1/0?"-inf":e.toString();if(n==="bigint"||n==="boolean")return e.toString();if(n==="string")return T(e);if(n==="date"){if(isNaN(e.getTime()))throw new TypeError("cannot serialize invalid date");return e.toISOString()}if(n==="object")return q(e,i);if(n==="array")return J(e,i)}function q(e,n){let i=Object.keys(e);if(i.length===0)return"{}";let t="{ ";for(let r=0;r<i.length;r++){let l=i[r];r&&(t+=", "),t+=k.test(l)?l:T(l),t+=" = ",t+=O(e[l],w(e[l]),n-1)}return t+" }"}function J(e,n){if(e.length===0)return"[]";let i="[ ";for(let t=0;t<e.length;t++){if(t&&(i+=", "),e[t]===null||e[t]===void 0)throw new TypeError("arrays cannot contain null or undefined values");i+=O(e[t],w(e[t]),n-1)}return i+" ]"}function H(e,n,i){if(i===0)throw new Error("Could not stringify the object: maximum object depth exceeded");let t="";for(let r=0;r<e.length;r++)t+=`[[${n}]]
`,t+=_(e[r],n,i),t+=`

`;return t}function _(e,n,i){if(i===0)throw new Error("Could not stringify the object: maximum object depth exceeded");let t="",r="",l=Object.keys(e);for(let o=0;o<l.length;o++){let f=l[o];if(e[f]!==null&&e[f]!==void 0){let a=w(e[f]);if(a==="symbol"||a==="function")throw new TypeError(`cannot serialize values of type '${a}'`);let u=k.test(f)?f:T(f);if(a==="array"&&Y(e[f]))r+=H(e[f],n?`${n}.${u}`:u,i-1);else if(a==="object"){let d=n?`${n}.${u}`:u;r+=`[${d}]
`,r+=_(e[f],d,i-1),r+=`

`}else t+=u,t+=" = ",t+=O(e[f],a,i),t+=`
`}}return`${t}
${r}`.trim()}function L(e,n){if(w(e)!=="object")throw new TypeError("stringify can only be called with an object");let i=n?.maxDepth??1e3;return _(e,"",i)}var Q={parse:N,stringify:L,TomlDate:y,TomlError:c};/*! Bundled license information:

smol-toml/dist/error.js:
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

smol-toml/dist/util.js:
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

smol-toml/dist/date.js:
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

smol-toml/dist/primitive.js:
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

smol-toml/dist/extract.js:
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

smol-toml/dist/struct.js:
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

smol-toml/dist/parse.js:
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

smol-toml/dist/stringify.js:
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
*/export{y as TomlDate,c as TomlError,Q as default,N as parse,L as stringify};
