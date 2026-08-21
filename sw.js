const CACHE='c-visados-3.1.0';
const CORE=[
 './','./index.html','./css/app.css','./js/data.js','./js/app.js','./manifest.webmanifest',
 './assets/icon-192.png','./assets/icon-512.png','./assets/c-visados-app.png','./assets/escudo.png','./assets/sarapiqui.png',
 './assets/templates/APROBACION_BASE_2029.png','./assets/templates/HEADER_2029.png','./assets/templates/BUSINESS_CARD_2029.png',
 './data/requisitos.json','./data/catalogo_rechazos.json'
];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);for(const url of CORE){try{await cache.add(url)}catch(err){console.warn('No se pudo precargar',url,err)}}await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(req.mode==='navigate'){event.respondWith((async()=>{try{const fresh=await fetch(req);const cache=await caches.open(CACHE);cache.put('./index.html',fresh.clone()).catch(()=>{});return fresh}catch{const cached=await caches.match('./index.html');return cached||Response.error()}})());return}if(url.origin===self.location.origin){event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const fresh=await fetch(req);const cache=await caches.open(CACHE);cache.put(req,fresh.clone()).catch(()=>{});return fresh}catch{return Response.error()}})())}});
