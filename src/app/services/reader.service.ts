import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {List} from "immutable";
import {FeedService} from "./feed.service";
import {Observable, Subject} from "rxjs";

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

    getSelectedFeed() {
        return this.selectedFeed;
    }

    getFeeds() {
        return this.feeds;
    }

    addFeed(url) {
        this.feedService.fetch(url).then(feed => {
            this.storage.saveFeed(feed).then(()=> this.updateFeeds())
        });
    }

    pullFeed(feed) {
        return this.feedService.fetch(feed.url).then(async updatedFeed => {
            updatedFeed.last_pull = new Date();
            await this.storage.saveFeed(updatedFeed);
            if (this.selectedFeed == feed) {
                console.log("this is selected");
                this.entriesForSelectedFeed = List(await this.storage.getEntries(updatedFeed));
            }
        });
    }

    getEntriesForFeed() {
        return this.entriesForSelectedFeed;
    }

    saveEntry(entry) {
        this.storage.saveEntry(entry).then(async() => {
            this.entriesForSelectedFeed = List(await this.getEntriesForFeed());
        });
        this.toastMessage.next("Entry updated");
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
