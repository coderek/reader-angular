import {Injectable} from '@angular/core';
import {FeedService} from './feed.service';
import {StorageService} from './storage.service';
import {Feed} from '../../models/feed';
import {Entry} from '../../models/entry';
import {async, AsyncAware} from '../../decorators/async';
import {Store} from '@ngrx/store';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ReaderState} from '../../redux/state';


/**
 * Stateless Service
 */
@Injectable()
export class ReaderService extends AsyncAware {

	constructor(
		private feedService: FeedService,
		private storage: StorageService,
		private store: Store<ReaderState>,
		private loader: SlimLoadingBarService) {

		super();
	}

	onTasksComplete() {
		this.loader.complete();
		this.store.dispatch({type: 'FINISH_LOADING'});
	}
	onTasksStart() {
		this.loader.start();
		this.store.dispatch({type: 'START_LOADING'});
	}

	@async
	public getFeeds(): Promise<Feed[]> {
		return this.storage.getFeeds().then(feeds => this.sortFeeds(feeds));
	}

	sortFeeds(feeds: Feed[]) {
		return feeds.sort((f1, f2) => {
			if (f1.unreadCount === 0 && f2.unreadCount === 0) {
				return f1.title < f2.title? -1: 1;
			} else if (f1.unreadCount === 0) {
				return 1;
			} else if (f2.unreadCount === 0) {
				return -1;
			} else {
				return f1.title < f2.title? -1: 1;
			}
		});
	}

	@async
	public getEntriesForFeed(feed: Feed) {
		if (!feed) {
			return Promise.resolve([]);
		}
		return this.storage.getEntries({feed_url: feed.url});
	}

	getFeed(url): Promise<Feed> {
		return this.storage.getFeed(url);
	}

	@async
	addFeed(url) : Promise<Feed> {
		return this.feedService.fetch(url).then(feed => {
			return this.storage.saveFeed(feed);
		});
	}
	@async
	public pullFeed(feed: Feed): Promise<Feed> {
		const	feedUrl = feed.url;
		return this.feedService.fetch(feedUrl).then(async updatedFeed => {
			return this.storage.saveFeed(updatedFeed);
		});
	}

	// @async
	saveEntry(entry) {
		return this.storage.saveEntry(entry);
	}

	// @async
	updateEntry(id, patch: {}): Promise<Entry> {
		return this.storage.updateEntry(id, patch);
	}

	@async
	deleteFeed(feedUrl: Feed | string): Promise<string> {
		if (typeof feedUrl === 'object') {
			feedUrl = feedUrl.url;
		}
		console.assert(typeof feedUrl === 'string');
		return this.storage.deleteFeed(feedUrl);
	}

	@async
	markAllRead(feed: Feed): Promise<Feed> {
		return this.storage.markAllRead(feed.url).then(() => feed);
	}

	@async
	getFavorites() {
		return this.storage.getEntries({favorite: true});
	}
}



