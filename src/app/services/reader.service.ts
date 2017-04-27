import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {FeedService} from "./feed.service";
import {Subject} from "rxjs";
import {Feed} from "../models/feed";

@Injectable()
export class ReaderService {
    feeds = new Subject<Feed[]>();

    public toastMessage = new Subject<string>();

    constructor(private feedService: FeedService,
                private storage: StorageService) {
    }

    updateFeeds() {
        let promise = this.storage.getFeeds();
        promise.then(feeds => {
            console.log('updated feeds', feeds.length)
            this.feeds.next(feeds);
        }).catch(console.error);
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

    addFeed(url) {
        this.feedService.fetch(url).then(feed => {
            this.storage.saveFeed(feed).then(() => this.updateFeeds())
        });
    }

    pullFeed(feed) {
        return this.feedService.fetch(feed.url).then(updatedFeed => {
            return this.storage.saveFeed(updatedFeed);
        });
    }

    getEntriesForFeed(feed) {
        if (feed==null) return Promise.resolve(null);
        return this.storage.getEntries(feed);
    }

    saveEntry(entry) {
        this.toastMessage.next("Entry updated");
        return this.storage.saveEntry(entry).then(()=> this.updateFeeds());
    }

    deleteFeed(feed) {
        this.storage.deleteFeed(feed).then(() => {
            this.updateFeeds();
        });
    }

    markAllRead(feed) {
        this.storage.markAllRead(feed);
    }
}
