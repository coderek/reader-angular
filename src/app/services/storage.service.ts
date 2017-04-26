import {Injectable} from "@angular/core";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";

@Injectable()
export class StorageService {

    db: IDBDatabase = null;
    initPromise = null;

    constructor() {
        this.initPromise = this.initDb();
    }

    initDb() {
        return new Promise((res, rej) => {
            let openrequest = indexedDB.open('__reader__', 1);
            openrequest.onerror = (err) => {
                rej(err);
            }
            openrequest.onupgradeneeded = (ev) => {
                let db = openrequest.result;
                db.onerror = console.error;
                let feedsStore = db.createObjectStore('feeds', {keyPath: 'url'})
                let entriesStore = db.createObjectStore('entries', {keyPath: 'url'})
                entriesStore.createIndex('read', 'read');
                entriesStore.createIndex('favorite', 'favorite');
                entriesStore.createIndex('feed_url', 'feed_url');
            };
            openrequest.onsuccess = (ev) => {
                this.db = openrequest.result;
                console.log("Indexed DB is open now.")
                res();
            }
        });
    }

    async getFeeds() {
        await this.initPromise;
        let feeds = [];
        return new Promise((res, rej) => {
            let req = this.db.transaction('feeds').objectStore('feeds').openCursor();
            req.onsuccess = function () {
                let cursor = req.result;
                if (cursor) {
                    feeds.push(cursor.value);
                    cursor.continue();
                } else {
                    res(feeds);
                }
            };
            req.onerror = rej;
        })
    }

    async getEntries(feed): Promise<any[]> {
        await this.initPromise;
        let entries = [];
        return new Promise<any[]>((res, rej) => {
            let req = this.db.transaction('entries').objectStore('entries').openCursor();
            req.onsuccess = (ev) => {
                let cursor = req.result;
                if (cursor) {
                    if (cursor.value.feed_url === feed.url)
                        entries.push(cursor.value);
                    cursor.continue();
                } else {
                    entries = entries.sort((a, b) => {
                        return b.published - a.published;
                    })
                    res(entries);
                }
            };
        })
    }

    saveEntry(entry) {
        let transaction = this.db.transaction('entries', 'readwrite');
        transaction.objectStore('entries').put(entry);
        return new Promise((res, rej) => {
            transaction.oncomplete = res;
            transaction.onerror = rej;
        })
    }

    saveFeed(feed) {
        let transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');
        let date = new Date();
        feed.entries.forEach(entry => {
            entry.feed_url = feed.url;
            if (entry.read === undefined) {
                entry.read = false;
            }
            if (entry.favorite === undefined) {
                entry.favorite = false;
            }
            if (Array.isArray(entry.published)) {
                let [y, m, d, h, M, s] = entry.published;
                entry.published = new Date(y, m - 1, d, h, M, s);
            }

            let req = transaction.objectStore('entries').get(entry.url);
            // add if absent
            req.onsuccess = (ev) => {
                if (!req.result) {
                    console.log('Saved entry: ' + req.result);
                    entry.last_pull = date;
                    transaction.objectStore('entries').add(entry);
                }
            }
        });
        delete feed.entries;
        feed.last_pull = date;
        transaction.objectStore('feeds').put(feed);
        return new Promise((res, rej) => {
            transaction.oncomplete = () => {
                res();
                console.log('Saved entries');
            };
            transaction.onerror = rej;
        })
    }

    countNewerEntries(feed: Feed, boundary: Number) {
        let transaction = this.db.transaction('entries');
        let store = transaction.objectStore('entries');
        let idx = store.index('feed_url');
        let req = idx.openCursor(IDBKeyRange.only(feed.url));
        let count = 0;
        req.onsuccess = () => {
            let cursor = req.result;
            if (cursor) {
                let entry: Entry = cursor.value;
                if (entry.last_pull && entry.last_pull.valueOf() > boundary && !entry.read)
                    count++;
                cursor.continue();
            }
        }
        return new Promise((res, rej) => {
            transaction.oncomplete = () => {
                res(count);
            }
        });
    }

    async getFeed(url) {
        await this.initPromise;
        return new Promise((res, rej)=> {
            let req = this.db.transaction('feeds').objectStore('feeds').get(url);
            req.onsuccess = (ev)=> {
                res(req.result);
            }
        });
    }

    deleteFeed(feed) {
        let transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');
        let store = transaction.objectStore('entries');
        let idx = store.index('feed_url');
        console.log('feed.url: ' + feed.url)
        let req = idx.openKeyCursor(IDBKeyRange.only(feed.url));
        req.onsuccess = (ev) => {
            let cursor = req.result;
            if (cursor) {
                store.delete(cursor.primaryKey);
                cursor.continue();
            } else {

            }
        };
        transaction.objectStore('feeds').delete(feed.url);
        return new Promise((res, rej) => {
            transaction.oncomplete = () => {
                res();
                console.log('Deleted feed and its entries');
            }
        });
    }

    markAllRead(entries) {
        let transaction = this.db.transaction('entries', 'readwrite');
        for (let entry of entries) {
            transaction.objectStore('entries').put(entry);
        }
        return new Promise((res, rej) => {
            transaction.oncomplete = res;
            transaction.onerror = rej;
        })
    }
}
