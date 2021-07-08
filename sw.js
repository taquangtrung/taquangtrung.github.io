const version = '20210708083948';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/llvm/2021/05/04/caution-when-getting-other-analyses-in-an-llvm-pass/","/ocaml/2021/03/18/writing-safely-extensible-OCaml-code/","/script/2020/11/18/auto-close-web-browsers/","/emacs/2020/10/08/emacs-out-of-the-box/","/llvm/ocaml/2020/05/26/ocaml-programs-byte-code-might-crash/","/llvm/2019/11/06/llvm-handle-dynamic-and-static-struct-similarly/","/linux/xfce/2019/10/28/linux-mint-xfce/","/pdf/google%20chrome/2019/10/09/printing-pdf-with-preview-in-linux-by-google-chrome/","/c++/2019/09/05/beautify-backtrace-for-cpp/","/ocaml/llvm/2019/08/21/llvm-opam-cmt-files/","/archive/","/categories/","/pages/emacs-hacks/","/blog/","/","/pages/latex-hacks/","/manifest.json","/offline/","/research/","/assets/search.json","/search/","/assets/styles.css","/redirects.json","/sitemap.xml","/robots.txt","/feed.xml","/assets/styles.css.map","", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
