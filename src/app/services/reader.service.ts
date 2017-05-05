import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {FeedService} from "./feed.service";
import {Feed} from "../models/feed";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {StopLoadingAction, StartLoadingAction} from "../reducers/global";
import {Entry} from "../models/entry";


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

    @async
    pullFeed(feedUrl): Promise<Entry[]> {
        return this.feedService.fetch(feedUrl).then(async updatedFeed => {
            await this.storage.saveFeed(updatedFeed);
            return this.storage.getEntries({feed_url: feedUrl});
        });
    }

    @async
    getEntriesForFeed(feedUrl) {
        return this.storage.getEntries({feed_url: feedUrl});
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
    markAllRead(feed) {
        this.storage.markAllRead(feed);
    }

    @async
    getFavorites() {
        return this.storage.getEntries({favorite: true});
    }
}
