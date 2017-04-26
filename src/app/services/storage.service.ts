import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    db: IDBDatabase = null;
    initPromise = null;

    constructor() {
        this.initPromise = this.initDb();
    }

    initDb() {
        return new Promise((res, rej)=> {
            let openrequest = indexedDB.open('__reader__', 1);
            openrequest.onerror = (err)=> {
                rej(err);
            }
            openrequest.onupgradeneeded = (ev)=>{
                let db = openrequest.result;
                db.onerror = console.error;
                let feedsStore = db.createObjectStore('feeds', {keyPath: 'url'})
                let entriesStore = db.createObjectStore('entries', {keyPath: 'url'})
                entriesStore.createIndex('read', 'read');
                entriesStore.createIndex('favorite', 'favorite');
                entriesStore.createIndex('feed_url', 'feed_url');
            };
            openrequest.onsuccess = (ev)=>{
                this.db = openrequest.result;
                console.log("Indexed DB is open now.")
                res();
            }
        });
    }

    async getFeeds() {
        await this.initPromise;
        let feeds = [];
        return new Promise((res, rej)=> {
            let req = this.db.transaction('feeds').objectStore('feeds').openCursor();
            req.onsuccess = function () {
                let cursor = req.result;
                if (cursor) {
                    console.log('pushing', cursor.value)
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
        return new Promise<any[]>((res, rej)=> {
            let req = this.db.transaction('entries').objectStore('entries').openCursor();
            req.onsuccess = (ev)=> {
                let cursor = req.result;
                if (cursor) {
                    if (cursor.value.feed_url === feed.url)
                        entries.push(cursor.value);
                    cursor.continue();
                } else {
                    entries.sort((a,b)=> {
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
        return new Promise((res, rej)=> {
            transaction.oncomplete = res;
            transaction.onerror = rej;
        })
    }

    saveFeed(feed) {
        let transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');

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
                entry.published = new Date(y, m-1, d, h, M, s);
            }
            let req = transaction.objectStore('entries').put(entry);
            req.onsuccess = (ev)=>{
                console.log('Saved entry: ' + req.result);
            }
        });
        delete feed.entries;
        transaction.objectStore('feeds').put(feed);
        return new Promise((res, rej)=> {
            transaction.oncomplete = ()=> {
                res();
                console.log('Saved entries');
            };
            transaction.onerror = rej;
        })
    }

    deleteFeed(feed) {
        let transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');
        let store = transaction.objectStore('entries');
        let idx = store.index('feed_url');
        console.log('feed.url: ' + feed.url)
        let req = idx.openKeyCursor();
        req.onsuccess = (ev) => {
            let cursor = req.result;
            if (cursor) {
                store.delete(cursor.primaryKey);
                cursor.continue();
            } else {

            }
        };
        transaction.objectStore('feeds').delete(feed.url);
        return new Promise((res, rej)=> {
            transaction.oncomplete = ()=> {
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
        return new Promise((res, rej)=> {
            transaction.oncomplete = res;
            transaction.onerror = rej;
        })
    }
}
