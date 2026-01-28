let r={};function o(i,s){return r[i]===void 0&&(r[i]=[]),r[i]=[...r[i],s],function(){r[i]=r[i].filter(u=>u!==s)}}function f(i,s){if(r[i]){const n=r[i].map(u=>u(s));return Promise.all(n)}else return Promise.resolve()}typeof window<"u"&&(window.subscribe=o,window.publish=f);
//# sourceMappingURL=pubsub.js.map
