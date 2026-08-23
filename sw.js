'use strict';
const CACHE_PREFIX='fiscalizacion-v01-mejorada-20260822-';
const CACHE=CACHE_PREFIX+'v01.0.0';
const CORE=[
  './','./index.html','./app.js','./styles.css','./manifest.webmanifest',
  './icon-192.png','./icon-512.png','./icon-maskable-192.png','./icon-maskable-512.png',
  './apple-touch-icon.png','./favicon-48.png','./escudo-sarapiqui.png',
  './machotes/Informe_Fiscalizacion_V01_MACHOTE_FINAL.docx',
  './machotes/MS-FBI-RD-01-2026_RECTIFICACION_FINAL.docx'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      if(res&&res.ok)caches.open(CACHE).then(c=>c.put('./index.html',res.clone()));
      return res;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
    if(res&&res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone()));
    return res;
  })));
});
