/* serviceWorker.js */
'use strict';

const CACHE_NAME = "bgclock-analog-v2021112";
const ORIGIN = (location.hostname == 'localhost') ? '' : location.protocol + '//' + location.hostname;

const STATIC_FILES = [
  ORIGIN + '/bgclock-analog/',
  ORIGIN + '/bgclock-analog/index.html',
  ORIGIN + '/bgclock-analog/manifest.json',
  ORIGIN + '/bgclock-analog/icon/favicon.ico',
  ORIGIN + '/bgclock-analog/icon/apple-touch-icon.png',
  ORIGIN + '/bgclock-analog/icon/android-chrome-96x96.png',
  ORIGIN + '/bgclock-analog/icon/android-chrome-192x192.png',
  ORIGIN + '/bgclock-analog/icon/android-chrome-512x512.png',
  ORIGIN + '/bgclock-analog/css/bgclock-analog.css',
  ORIGIN + '/bgclock-analog/css/theme_cool.css',
  ORIGIN + '/bgclock-analog/css/theme_mono.css',
  ORIGIN + '/bgclock-analog/css/theme_warm.css',
  ORIGIN + '/bgclock-analog/js/bgclock-analog.js',
  ORIGIN + '/bgclock-analog/js/theme_color.js',
  ORIGIN + '/bgclock-analog/sounds/decision1.mp3',
  ORIGIN + '/bgclock-analog/sounds/decision7.mp3',
  ORIGIN + '/bgclock-analog/sounds/warning2.mp3',
  ORIGIN + '/js/jquery-3.6.0.min.js',
  ORIGIN + '/js/start_serviceWorker.js',
];

const CACHE_KEYS = [
  CACHE_NAME
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        STATIC_FILES.map(url => {
          return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
            return cache.put(url, response);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => {
          return !CACHE_KEYS.includes(key);
        }).map(key => {
          return caches.delete(key);
        })
      );
    })
  );
});

