const C='rias-v3';
const FILES=['./','./index.html','./manifest.json','./logo.png','./icon-192.png'];
const CDN=['cdn.jsdelivr.net','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(CDN.includes(u.hostname)){ // লাইব্রেরি/ফন্ট: ক্যাশ আগে, না থাকলে নেটওয়ার্ক (অফলাইনে অ্যাপ খুলতে লাগে)
    e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;})));return;}
  if(u.origin!==location.origin)return; // Supabase কল সবসময় নেটওয়ার্কে
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request)));
});
