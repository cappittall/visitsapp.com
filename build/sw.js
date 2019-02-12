importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! XXX Workbox didn't load 😬`);
}
workbox.strategies.cacheFirst({
    cacheName: 'allAsset',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 30 Days
      }),
    ],
 });

workbox.core.setCacheNameDetails({
  prefix: 'visitApp',
  suffix: 'v1'
});
workbox.precaching.precacheAndRoute([]);