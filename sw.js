/* App da Sociedade Arcádia.
   Este service worker NÃO guarda as páginas do site: tudo vem sempre da internet,
   então o que for publicado aparece na hora. Ele só guarda uma página "sem internet"
   para mostrar quando o celular estiver sem conexão. */
const CACHE='arcadia-offline-v1';
const OFFLINE='/offline.html';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([OFFLINE,'/selo-arcadia.png'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.mode!=='navigate')return; /* imagens, scripts e Firebase: o navegador cuida normalmente */
  e.respondWith(fetch(r).catch(()=>caches.match(OFFLINE)));
});
