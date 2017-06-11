import {Injectable} from "@angular/core";
import {StorageService} from "../reader/services/storage.service";
import {FeedService} from "../reader/services/feed.service";
import {Feed} from "../models/feed";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {StopLoadingAction, StartLoadingAction} from "../reducers/global";
import {Entry} from "../models/entry";
import {Observable, Subject} from "rxjs";


function async(target, prop, property) {
    const contr = target.constructor;
    const fn = contr.prototype[prop];
    property.value = function () {
        let promise = fn.apply(this, arguments);
        this.addAsyncTask(promise);
        return promise;
    };
}


@Injectable()
export class ReaderService {
    asyncTasks = new Set();

    constructor(private feedService: FeedService,
                private storage: StorageService,
                private store: Store<State>) {
    }

    saveSetting(key, value) {
        localStorage.setItem(key, value);
    }

    getSetting(key) {
        return localStorage.getItem(key);
    }

    addAsyncTask(task: Promise<any>) {
        this.asyncTasks.add(task);
        task.then(
            () => this.asyncTasks.delete(task),
            () => this.asyncTasks.delete(task)
        ).then(() => {
            if (this.asyncTasks.size === 0) {
                this.store.dispatch(new StopLoadingAction());
            }
        });
        this.store.dispatch(new StartLoadingAction());
    }

    @async
    getFeeds(): Promise<Feed[]> {
        return this.storage.getFeeds();
    }

    getFeed(url) : Promise<Feed> {
        if (url == null) return Promise.resolve(null);
        return this.storage.getFeed(url)
    }

    getNewItemsCount(feed: Feed): Promise<number> {
        /**
         * new item is defined as unread entry is this less or equal than 10 days old than last pull date
         */
        if (feed == null || feed.last_pull == null) return Promise.resolve(0);

        let lastPullDate: number = feed.last_pull.valueOf();
        let boundary = lastPullDate - 10 * 3600 * 24 * 10;
        return this.storage.countNewerEntries(feed, boundary);
    }

    @async
    countUnreadEntries(feedUrl) {
        return this.storage.countUnreadEntries(feedUrl);
    }

    @async
    addFeed(url) {
        return this.feedService.fetch(url).then(feed => {
            return this.storage.saveFeed(feed);
        });
    }

    pullAllFeeds(): Observable<Feed> {
        let ret = new Subject<Feed>();
        this.getFeeds().then(feeds=> {
            for (let feed of feeds) {
                this.pullFeed(feed.url).then(feed=> ret.next(feed));
            }
        });
        return ret;
    }

    pullFeed(feedUrl): Promise<Feed> {
        return this.feedService.fetch(feedUrl).then(async updatedFeed => {
            return this.storage.saveFeed(updatedFeed);
        });
    }

    @async
    pullFeedWithEnties(feedUrl): Promise<Entry[]> {
        return this.feedService.fetch(feedUrl).then(async updatedFeed => {
            await this.storage.saveFeed(updatedFeed);
            return this.storage.getEntries({feed_url: feedUrl});
        });
    }

    @async
    getEntriesForFeed(feedUrl) {
        // console.log(feedUrl)
        // if (this.cache.has(feedUrl)) {
        //     return Promise.resolve(this.cache.get(feedUrl));
        // }
        return this.storage.getEntries({feed_url: feedUrl}).then(entries=>{
            // this.cache.set(feedUrl, entries);
            return entries;
        });
    }

    @async
    saveEntry(entry) {
        return this.storage.saveEntry(entry);
    }

    @async
    updateEntry(id, attr, val): Promise<Entry> {
        return this.storage.updateEntry(id, attr, val);
    }

    @async
    deleteFeed(feedUrl) : Promise<void>{
        return this.storage.deleteFeed(feedUrl);
    }

    @async
    markAllRead(feedUrl): Promise<void>{
        return this.storage.markAllRead(feedUrl);
    }

    @async
    getFavorites() {
        return this.storage.getEntries({favorite: true});
    }
}
