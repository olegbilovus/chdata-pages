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
"assets/assets/json/itemList.json": "955497718d659a3069083da8545d3f0e",
"assets/assets/json/mobList.json": "490ad7dbdc4976c29a0610e24654838e",
"assets/assets/json/zoneMapList.json": "054f3bc61364d2abba22183b51cf884f",
"assets/assets/images/zones/z12_map.png": "6fd4b2b5f71318980302547295839535",
"assets/assets/images/zones/z3_map.png": "71b5f93db87992135e66238aab675c3a",
"assets/assets/images/zones/z10_map.png": "cc898e5e2f1ad13566a14436768015d8",
"assets/assets/images/zones/z18_map.png": "b83de2a1fdbf523d08a6f232525c3362",
"assets/assets/images/zones/z22_map.png": "c9382745ab5dd10650510ccf3a60a5e2",
"assets/assets/images/zones/z11_map.png": "a865103a4e841d4637f1199fafb1b29d",
"assets/assets/images/zones/z8_map.png": "bd04c15a94754a2ba898ccc4af0b1180",
"assets/assets/images/zones/z7_map.png": "7b76eed7161904235bb7663ba461ffda",
"assets/assets/images/zones/z17_map.png": "b45e284a2916ae70f92e9b747fc6ec4f",
"assets/assets/images/zones/z15_map.png": "d5091546d915e57fdc95136c83bd876a",
"assets/assets/images/zones/z19_map.png": "d5451eda2014965f38393bc5d5a66e45",
"assets/assets/images/zones/z4_map.png": "a7f2833e6095102d570bb370324d4c8a",
"assets/assets/images/zones/z93_map.png": "82c6e82fa690f786c65abb8608671dc1",
"assets/assets/images/zones/z24_map.png": "0fcf0a5817aa50be65f1160461605385",
"assets/assets/images/zones/z6_map.png": "e362f851d771dcde509c95172197aa26",
"assets/assets/images/zones/z9_map.png": "04dd5b0dfcb15d81c76cafd787a62d0b",
"assets/assets/images/zones/z5_map.png": "bd97afea87fbdc42fbde36746ee0e74e",
"assets/assets/images/zones/z2_map.png": "044bf41bbc68cc6a2e4aae616a4b49d6",
"assets/assets/images/zones/z16_map.png": "1590bc23791e99253574e2b0d223fd0b",
"assets/assets/images/zones/z20_map.png": "7cddd20c29fd4b9b89ac364111905730",
"assets/assets/images/zones/z13_map.png": "c1ec5fa28b47c53343719cd70a36fc6a",
"assets/AssetManifest.json": "4476c8a53bd546ed7fb9f3eb3f1aa757",
"assets/NOTICES": "67d41995cf7c57c3e40a3cb331bfaa37",
"assets/AssetManifest.bin": "f1cd11621c0b552262f304e6ed169dbf",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/fonts/MaterialIcons-Regular.otf": "cfbd6c3b4a556e0519d328cfca500e84",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"version.json": "331d036955213f22e09494bc6e187a04",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"index.html": "892790fd2b07e5e174781b1e73deabb7",
"/": "892790fd2b07e5e174781b1e73deabb7",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "daae5e927af856610fb5f0d28ac2d856",
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
