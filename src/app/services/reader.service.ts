import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {List} from "immutable";
import {FeedService} from "./feed.service";
import {Subject} from "rxjs";
import {Feed} from "../models/feed";

@Injectable()
export class ReaderService {
    selectedFeed = null;
    entriesForSelectedFeed = List();
    feeds = List();

    public toastMessage = new Subject<string>();


    constructor(private feedService: FeedService,
                private storage: StorageService) {
        this.updateFeeds();
    }

    updateFeeds() {
        console.log('Getting feeds');
        let promise = this.storage.getFeeds();
        promise.then(feeds => {
            this.feeds = List(feeds)
        }).catch(console.error);
    }

    openFeed(feed) {
        this.selectedFeed = feed;
        this.storage.getEntries(feed).then(entries => {
            this.entriesForSelectedFeed = List(entries);
        })
    }

    getFeed(url) : Promise<Feed> {
        if (url == null) return Promise.resolve(null);
        return this.storage.getFeed(url)
    }

    getFeeds() {
        return this.feeds;
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
        return this.feedService.fetch(feed.url).then(async updatedFeed => {
            await this.storage.saveFeed(updatedFeed);
            if (this.selectedFeed == feed) {
                console.log("this is selected");
                this.entriesForSelectedFeed = List(await this.storage.getEntries(updatedFeed));
            }
        });
    }

    getEntriesForFeed(feed) {
        return this.storage.getEntries(feed);
    }

    saveEntry(entry) {
        this.toastMessage.next("Entry updated");
        return this.storage.saveEntry(entry);
    }

    deleteFeed(feed) {
        if (feed === this.selectedFeed) {
            this.selectedFeed = null;
            this.entriesForSelectedFeed = List();
        }
        this.storage.deleteFeed(feed).then(() => {
            this.updateFeeds();
        });
    }

    markAllRead(feed) {
        this.storage.markAllRead(feed);
    }
}
