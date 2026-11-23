/* Service worker: lưu sẵn khung ứng dụng, mở được khi mất mạng. Đổi V khi muốn ép làm mới bộ nhớ đệm. */
const V='lich-truc-v3';
const ASSETS=['./','index.html','css/style.css','js/lunar.js','js/app.js','js/pwa.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>hit||caches.match('index.html'));return hit||net}))});
