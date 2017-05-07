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
            };
            openrequest.onupgradeneeded = (ev) => {
                let db = openrequest.result;
                db.onerror = console.error;
                let feedsStore = db.createObjectStore('feeds', {keyPath: 'url'});
                let entriesStore = db.createObjectStore('entries', {keyPath: 'url'});
                entriesStore.createIndex('read', 'read');
                entriesStore.createIndex('favorite', 'favorite');
                entriesStore.createIndex('feed_url', 'feed_url');
            };
            openrequest.onsuccess = (ev) => {
                this.db = openrequest.result;
                console.log("Indexed DB is open now.");
                res();
            }
        });
    }

    async getFeeds(): Promise<Feed[]> {
        await this.initPromise;
        let feeds = [];
        let transaction = this.db.transaction(['feeds', 'entries']);
        return new Promise<Feed[]>((res, rej) => {
            let req = transaction.objectStore('feeds').openCursor();
            req.onsuccess = function () {
                let cursor = req.result;
                if (cursor) {
                    let f = cursor.value;
                    feeds.push(f);
                    let count = 0;
                    let entriesReq = transaction.objectStore('entries').index('feed_url').openCursor(IDBKeyRange.only(f.url));
                    entriesReq.onsuccess=()=>{
                        let c = entriesReq.result;
                        if (c) {
                            if (!c.value.read) count++;
                            c.continue();
                        }
                        else f.unreadCount = count;
                    };
                    cursor.continue();
                }
            };
            req.onerror = rej;
            transaction.oncomplete = ()=> {
                res(feeds);
            };
            transaction.onerror = console.error;
        })
    }

    async getEntries(conditions): Promise<Entry[]> {
        await this.initPromise;
        let entries = [];
        return new Promise<any[]>((res, rej) => {
            let req = this.db.transaction('entries').objectStore('entries').openCursor();
            req.onsuccess = (ev) => {
                let cursor = req.result;
                if (cursor) {
                    if (matchConditions(cursor.value, conditions))
                        entries.push(cursor.value);
                    cursor.continue();
                } else {
                    entries = entries.sort((a, b) => {
                        return b.published - a.published;
                    });
                    res(entries);
                }
            };
        })
    }

    async updateEntry(id, attr, val): Promise<Entry> {
        await this.initPromise;
        let transaction = this.db.transaction('entries', 'readwrite');
        let obj = {[attr]: val, url: id};
        let req = transaction.objectStore('entries').get(id);
        let entry = null;
        req.onsuccess = (ev) => {
            entry = req.result;
            entry[attr] = val;
            transaction.objectStore('entries').put(entry);
        };
        return new Promise<Entry>((res, rej) => {
            transaction.oncomplete = () => res(entry);
            transaction.onerror = rej;
        })
    }

    saveEntry(entry: Entry) :Promise<Entry>{
        let transaction = this.db.transaction('entries', 'readwrite');
        transaction.objectStore('entries').put(entry);
        return new Promise((res, rej) => {
            transaction.oncomplete = ()=> res(entry);
            transaction.onerror = rej;
        })
    }

    /**
     * Save feed and update unread count
     * @param feed
     * @returns {Promise<T>}
     */
    async saveFeed(feed): Promise<Feed> {
        let unreadCount = await this.countUnreadEntries(feed.url);
        console.log(unreadCount);
        let transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');
        let date = new Date();
        let entriesStore = transaction.objectStore('entries');
        let entrySaveProcesses = [];
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

            let req = entriesStore.get(entry.url);
            entrySaveProcesses.push(new Promise((res, rej)=> {
                // add if absent
                req.onsuccess = (ev) => {
                    if (!req.result) {
                        console.log('Saved entry: ' + req.result);
                        entry.last_pull = date;
                        transaction.objectStore('entries').add(entry);
                        unreadCount++;
                    }
                    res();
                };
                req.onerror = res;
            }));
        });

        Promise.all(entrySaveProcesses).then(()=> {
            delete feed.entries;
            feed.last_pull = date;
            feed.unreadCount = unreadCount;

            transaction.objectStore('feeds').put(feed);
        });
        return await new Promise<Feed>((res, rej) => {
            transaction.oncomplete = () => {
                res(feed);
                console.log('Saved entries');
            };
            transaction.onerror = rej;
        })
    }

    countUnreadEntries(feedUrl): Promise<number> {
        let transaction = this.db.transaction('entries');
        let store = transaction.objectStore('entries');
        let idx = store.index('feed_url');
        let req = idx.openCursor(IDBKeyRange.only(feedUrl));
        let count = 0;
        req.onsuccess = () => {
            let cursor = req.result;
            if (cursor) {
                let entry: Entry = cursor.value;
                if (!entry.read) count++;
                cursor.continue();
            }
        };
        return new Promise((res, rej) => {
            transaction.oncomplete = () => {
                res(count);
            }
        });
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
        };
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

    deleteFeed(feedUrl) : Promise<void> {
        let transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');
        let store = transaction.objectStore('entries');
        let idx = store.index('feed_url');
        console.log('feedUrl.url: ' + feedUrl);
        let req = idx.openKeyCursor(IDBKeyRange.only(feedUrl));
        req.onsuccess = (ev) => {
            let cursor = req.result;
            if (cursor) {
                store.delete(cursor.primaryKey);
                cursor.continue();
            } else {

            }
        };
        transaction.objectStore('feeds').delete(feedUrl);
        return new Promise<void>((res, rej) => {
            transaction.oncomplete = () => {
                res();
                console.log('Deleted feedUrl and its entries');
            }
        });
    }

    markAllRead(feedUrl) :Promise<void>{
        let transaction = this.db.transaction('entries', 'readwrite');
        let entriesStore = transaction.objectStore('entries');
        let idx = entriesStore.index('feed_url');
        let req = idx.openCursor(IDBKeyRange.only(feedUrl));
        req.onsuccess = ()=> {
            let cursor = req.result;
            if (cursor) {
                let entry = cursor.value as Entry;
                entry.read = true;
                entriesStore.put(entry);
                cursor.continue();
            }
        }
        return new Promise<void>((res, rej) => {
            transaction.oncomplete = ()=> res();
            transaction.onerror = rej;
        })
    }
}


function matchConditions(target, conditions={}) {
    for (let prop in conditions) {
        if (target[prop] !== conditions[prop]) return false;
    }
    return true;
}
