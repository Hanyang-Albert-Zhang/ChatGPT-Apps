// No offline response cache: private records always come from the authenticated server.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>event.waitUntil((async()=>{
 let unread=1;try{const r=await fetch('/api/social',{credentials:'include',cache:'no-store'});if(r.ok){const d=await r.json();unread=Number(d.unread)||0;if(!unread)return;}}catch{}
 await self.registration.showNotification('Seediva · Time to move!',{body:'A friend sent you a Punch workout reminder.',icon:'/icons/icon-192.png',badge:'/icons/icon-192.png',tag:'seediva-punch',data:{url:'/#Trophies'}});
 if(self.navigator.setAppBadge)try{await self.navigator.setAppBadge(unread);}catch{}
})()));
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of clients)if(new URL(client.url).origin===self.location.origin){await client.navigate('/#Trophies');await client.focus();return;}await self.clients.openWindow('/#Trophies');})());});
