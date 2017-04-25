import {Injectable} from '@angular/core';
import Dexie from 'dexie';

@Injectable()
export class StorageService {

    private db = new Dexie('__reader__');

    constructor() {
        this.db.version(3).stores({
            feeds: '++id, &url, last_modified',
            entries: '++id, &url, published, feed_url, star'
        })
    }

    getFeeds() {
        return this.db.table("feeds").toArray();
    }

    getEntries(feed) {
        return this.db.table('entries').where({'feed_url': feed.url}).toArray();
    }

    saveEntry(entry) {
        return this.db.table('entries').put(entry);
    }

    saveFeed(feed) {
        feed.entries.forEach(entry => {
            entry.feed_url = feed.url;
            if (!entry.read) {
                entry.read = false;
            }
        });
        return this.db.table('entries').bulkPut(feed.entries).then(() => {
            delete feed.entries;
            this.db.table('feeds').put(feed);
        });
    }

    deleteFeed(feed) {
        return this.db.transaction('rw', [this.db.table('feeds'), this.db.table('entries')], async() => {
            await this.db.table("feeds").delete(feed.id);
            await this.db.table("entries").where({feed_url: feed.url}).delete();
        })
    }

    markAllRead(feed) {
        return this.db.table('entries').where({feed_url: feed.url}).modify({read: true}).then(() => {
            return this.getEntries(feed);
        })
    }
}
