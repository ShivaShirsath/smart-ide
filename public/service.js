const cacheName = "chacheide";
const filesToCache = [
  ".",
  "%PUBLIC_URL%/index.html",
];

//^^^^^^^^| helper functions |^^^^^^^^//
function filesAreCached(){

    Promise.all([
        getFileArray( "%PUBLIC_URL%" ),
        getFileArray( "%PUBLIC_URL%/static/css" ),
        getFileArray( "%PUBLIC_URL%/static/js" )
    ])
    .then( promiseArray => {
        let promisedFiles = [];
        promiseArray.forEach( array => {
            promisedFiles = promisedFiles.concat( array ) ;
        } );
        return promisedFiles;
    })
    .then( promisedFiles => {
        filesToCache = filesToCache.concat( promisedFiles );
        console.log( "Cached files:", filesToCache  );
        return self.caches.open( cacheName );
    })
    .then( cache => cache.addAll( filesToCache ) );
}
//^^^^^^^^| helper functions |^^^^^^^^//

self.addEventListener("install", async (e) => {
  e.waitUntil( filesAreCached() );
  return self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", async (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
