import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {List} from "immutable";
import {FeedService} from "./feed.service";

@Injectable()
export class ReaderService {
  selectedFeed = null;
  entriesForSelectedFeed = List();
  feeds = List();

  constructor(
    private feedService: FeedService,
    private storage: StorageService) {
    this.updateFeeds();
  }

  updateFeeds() {
    this.storage.getFeeds().then(feeds=> this.feeds = List(feeds));
  }

  openFeed(feed) {
    this.selectedFeed = feed;
    this.storage.getEntries(feed).then(entries=> {
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
    this.feedService.fetch(url).subscribe((feed)=> {
      this.storage.saveFeed(feed).then(()=> {
        this.updateFeeds();
      });
    });
  }

  getEntriesForFeed(feed) {
    return this.entriesForSelectedFeed;
  }

  saveEntry(entry) {
    this.storage.saveEntry(entry);
  }

  deleteFeed(feed) {
    if (feed === this.selectedFeed) {
      this.selectedFeed = null;
    }
    this.storage.deleteFeed(feed).then(()=> {
      this.updateFeeds();
    });
  }
  markAllRead(feed) {
    this.storage.markAllRead(feed).then(entries=>{
      this.entriesForSelectedFeed = List(entries);
    })
  }
}
