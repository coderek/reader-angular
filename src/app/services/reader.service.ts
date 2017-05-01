import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {FeedService} from "./feed.service";
import {Feed} from "../models/feed";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {StopLoadingAction, StartLoadingAction} from "../actions/global";


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
        console.log('addAsyncTask');
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
    addFeed(url) {
        return this.feedService.fetch(url).then(feed => {
            return this.storage.saveFeed(feed);
        });
    }

    @async
    pullFeed(feed: Feed) {
        return this.feedService.fetch(feed.url).then(updatedFeed => {
            return this.storage.saveFeed(updatedFeed);
        });
    }

    @async
    getEntriesForFeed(feedUrl) {
        return this.storage.getEntries({feed_url: feedUrl});
    }

    saveEntry(entry) {
        return this.storage.saveEntry(entry);
    }

    deleteFeed(feed) {
        return this.storage.deleteFeed(feed);
    }

    markAllRead(feed) {
        this.storage.markAllRead(feed);
    }

    getFavorites() {
        return this.storage.getEntries({favorite: true});
    }
}
