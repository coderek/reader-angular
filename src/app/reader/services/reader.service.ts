import {Injectable} from '@angular/core';
import {FeedService} from './feed.service';
import {StorageService} from './storage.service';
import {Feed} from '../../models/feed';
import {Subject} from 'rxjs/Subject';
import {Entry} from '../../models/entry';
import {async, AsyncAware} from '../../decorators/async';
import {noop, watch} from '../../util/misc';


@Injectable()
export class ReaderService extends AsyncAware {

	// continuously push feeds and entries
	feeds = new Subject<Feed[]>();
	entries = new Subject<Entry[]>();

	_feeds: Feed[] = [];

	constructor(private feedService: FeedService, private storage: StorageService) {
		super();
	}

	onTasksComplete() {}
	onTasksStart() {}

	@async
	public getFeeds(): Promise<Feed[]> {
		return this.storage.getFeeds().then(feeds => {
			this.feeds.next(feeds);
			this._feeds = feeds;
			return feeds;
		});
	}

	@async
	public getEntriesForFeed(feed: Feed) {
		const that = this;
		return this.storage.getEntries({feed_url: feed.url}).then(entries => {
			for (const entry of entries) {
				if (!entry.read) {
					watch(entry, 'read', () => {
						entry.feed.unreadCount--;
						this.markFeedsChanged();
						Object.defineProperty(entry, 'read', {set: noop});
						this.saveEntry(entry);
					});
				}
				watch(entry, 'favorite', (isFavorite) => {
					console.log('favorite ' + entry.title + ' ' + isFavorite);
					this.saveEntry(entry);
				});
				watch(entry, 'is_open', () => this.saveEntry(entry));
				entry.feed = feed;
			}
			this.entries.next(entries);
			return entries;
		});
	}

	private markFeedsChanged() {
		this.feeds.next([...this._feeds]);
	}

	private markEntriesChanged() {

	}

	getFeed(url): Promise<Feed> {
		if (url == null) {
			return Promise.resolve(null);
		}
		const foundArr = this._feeds.filter(f => f.url === url);
		if (foundArr.length) {
			return Promise.resolve(foundArr[0]);
		} else {
			return Promise.resolve(null);
		}
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
		}).then(feed => {
			this._feeds.push(feed);
			this.markFeedsChanged();
			return feed;
		});
	}

	public pullFeed(feed: Feed): Promise<Feed> {
		const	feedUrl = feed.url;
		feed.loading = true;
		this.markFeedsChanged();
		return this.feedService.fetch(feedUrl).then(async updatedFeed => {
			return this.storage.saveFeed(updatedFeed).then(f => Object.assign(feed, f));
		}).then(f => {
			this.markFeedsChanged();
			feed.loading = false;
			return f;
		}).catch(() => {
			feed.loading = false;
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
	deleteFeed(feedUrl: Feed | string): Promise<void> {
		if (typeof feedUrl === 'object') {
			feedUrl = feedUrl.url;
		}
		console.assert(typeof feedUrl === 'string');
		return this.storage.deleteFeed(feedUrl);
	}

	@async
	markAllRead(feed: Feed): Promise<void> {
		return this.storage.markAllRead(feed.url);
	}

	@async
	getFavorites() {
		return this.storage.getEntries({favorite: true});
	}
}



