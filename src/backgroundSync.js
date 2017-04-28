self.addEventListener('periodicsync', function (event) {
    if (event.registration.tag == 'get-new-feeds') {
        event.waitUntil(fetchAndCacheLatestNews());
    }
    else {
        // unknown sync, may be old, best to unregister
        event.registration.unregister();
    }
});

function fetchAndCacheLatestNews() {
    console.log('fetching...');
}
