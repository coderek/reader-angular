import {Injectable} from '@angular/core';
import {FeedService} from './feed.service';
import {StorageService} from './storage.service';
import {Feed} from '../../models/feed';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Entry} from '../../models/entry';


function async(target, prop, property) {
	const ctr = target.constructor;
	const fn = ctr.prototype[prop];
	property.value = function () {
		const promise = fn.apply(this, arguments);
		this.addAsyncTask(promise);
		return promise;
	};
}


interface FeedsStore {
	feeds: Feed[];
	entries: Map<Feed, Entry[]>;
}

/**
 * Define setter for Feed and Entry
 * Every change will trigger a save
 */


@Injectable()
export class ReaderService {
	asyncTasks = new Set();

	// push
	feeds = new Subject<Feed[]>();
	store
	entries = new Subject<Entry[]>();

	constructor(private feedService: FeedService, private storage: StorageService) {
		this.getFeeds();
	}

	saveSetting(key, value) {
		localStorage.setItem(key, value);
	}

	getSetting(key) {
		return localStorage.getItem(key);
	}

	addAsyncTask(task: Promise<any>) {
		this.asyncTasks.add(task);
		// task.then(
		// 	() => this.asyncTasks.delete(task),
		// 	() => this.asyncTasks.delete(task)
		// ).then(() => {
		// 	if (this.asyncTasks.size === 0) {
		// 		this.store.dispatch(new StopLoadingAction());
		// 	}
		// });
		// this.store.dispatch(new StartLoadingAction());
	}

	@async
	public getFeeds(): Promise<Feed[]> {
		return this.storage.getFeeds().then(feeds => {
			this._feeds = feeds;
			this.feeds.next(feeds);
			return feeds;
		});
	}

	@async
	public getEntriesForFeed(feed: Feed) {
		const that = this;
		return this.storage.getEntries({feed_url: feed.url}).then(entries => {
			for (const entry of entries) {
				entry.feed = feed;
				(function (e, a, v){
					Object.defineProperty(e, a, {
						enumerable: true,
						configurable: true,
						get: function () {return v; },
						set: function (_) {
							if (v) {
								return;
							}
							v = true;
							e.feed.unreadCount--;
							that.feeds.next([...that._feeds]);
						}
					});
				})(entry, 'read', entry['read']);
			}
			this.entries.next(entries);
			return entries;
		});
	}


	getFeed(url): Promise<Feed> {
		if (url == null) {
			return Promise.resolve(null);
		}
		return this.storage.getFeed(url);
	}

	getNewItemsCount(feed: Feed): Promise<number> {
		/**
		 * new item is defined as unread entry is this less or equal than 10 days old than last pull date
		 */
		if (feed == null || feed.last_pull == null) {
			return Promise.resolve(0);
		}

		const lastPullDate: number = feed.last_pull.valueOf();
		const boundary = lastPullDate - 10 * 3600 * 24 * 10;
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
		const ret = new Subject<Feed>();
		this.getFeeds().then(feeds => {
			for (const feed of feeds) {
				this.pullFeed(feed.url).then(f => ret.next(f));
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
	saveEntry(entry) {
		return this.storage.saveEntry(entry);
	}

	@async
	updateEntry(id, attr, val): Promise<Entry> {
		return this.storage.updateEntry(id, attr, val);
	}

	@async
	deleteFeed(feedUrl): Promise<void> {
		return this.storage.deleteFeed(feedUrl);
	}

	@async
	markAllRead(feedUrl): Promise<void> {
		return this.storage.markAllRead(feedUrl);
	}

	@async
	getFavorites() {
		return this.storage.getEntries({favorite: true});
	}
}



