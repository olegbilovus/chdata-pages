'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"canvaskit/chromium/canvaskit.js": "96ae916cd2d1b7320fff853ee22aebb0",
"canvaskit/chromium/canvaskit.wasm": "1165572f59d51e963a5bf9bdda61e39b",
"canvaskit/canvaskit.js": "bbf39143dfd758d8d847453b120c8ebb",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/canvaskit.wasm": "19d8b35640d13140fe4e6f3b8d450f04",
"canvaskit/skwasm.wasm": "d1fde2560be92c0b07ad9cf9acb10d05",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/assets/json/itemList.json": "620f974eeef59984fe2a152cc488b465",
"assets/assets/json/mobList.json": "d534a57844ef6bec00c66b409c8138f5",
"assets/assets/json/zoneMapList.json": "17580b407374bf5d49d179c592cce2df",
"assets/assets/images/zones/z12_map.png": "42cd8a6dba14001e298d36b392cc623f",
"assets/assets/images/zones/z3_map.png": "d249eb3f89f4a3fef03159c1965e4c4a",
"assets/assets/images/zones/z10_map.png": "a1ee8ca6349fb4fbe51cd5d11f3a5770",
"assets/assets/images/zones/z18_map.png": "08fb5130880ce07028424fa0e829345d",
"assets/assets/images/zones/z22_map.png": "490e7b8b05ccd5598655cddd4ee2d514",
"assets/assets/images/zones/z11_map.png": "c6daa4ef916d228ac7a5055352608150",
"assets/assets/images/zones/z8_map.png": "b8609acc470d1a93b37da30ec3e5982e",
"assets/assets/images/zones/z7_map.png": "ad71432aa78e6b17b29f5ae976d385d3",
"assets/assets/images/zones/z17_map.png": "6aee96f832e8d47dd6da26121f11aa53",
"assets/assets/images/zones/z15_map.png": "89ac1c72c2f500c655bf784444f1c5b4",
"assets/assets/images/zones/z19_map.png": "000b74d8e061bf6448e37b19417a2de4",
"assets/assets/images/zones/z4_map.png": "75022f2988624135a952850d32c04fee",
"assets/assets/images/zones/z93_map.png": "696b60783c61edaddfa03b10da6d7a25",
"assets/assets/images/zones/z24_map.png": "4947a6ef2595e4d2f7b0aaeb857eed7b",
"assets/assets/images/zones/z6_map.png": "c3b91e4c2e76b334e9ee3d57a21b3df6",
"assets/assets/images/zones/z9_map.png": "53a14fa95a88fe2d8979f1a8293e6507",
"assets/assets/images/zones/z5_map.png": "cf0b6c668603cd694059d4cdb895802e",
"assets/assets/images/zones/z2_map.png": "9f2e41404f03b4a3aeaf649a4487a4d0",
"assets/assets/images/zones/z16_map.png": "c291f24aa360ab3bf922e191f173a36b",
"assets/assets/images/zones/z20_map.png": "862e6db4d5cd17a3ce0cd6b3ab684709",
"assets/assets/images/zones/z13_map.png": "f8c4dedf5ddbe3adb37393d387c832e4",
"assets/AssetManifest.json": "4476c8a53bd546ed7fb9f3eb3f1aa757",
"assets/NOTICES": "67d41995cf7c57c3e40a3cb331bfaa37",
"assets/AssetManifest.bin": "f1cd11621c0b552262f304e6ed169dbf",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/fonts/MaterialIcons-Regular.otf": "d9a0680c20e9a2b2f9d57e429af6fdaa",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"version.json": "331d036955213f22e09494bc6e187a04",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"index.html": "f8275f10bb792bb852eca47e5829d46f",
"/": "f8275f10bb792bb852eca47e5829d46f",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "97384a9434dbb27f3793bb39a802b5ab",
"manifest.json": "c351d2efd8011fe7203ce5ac5cc466ca"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
