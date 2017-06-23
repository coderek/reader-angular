import {Injectable} from '@angular/core';
import {FeedService} from './feed.service';
import {StorageService} from './storage.service';
import {Feed} from '../../models/feed';
import {Entry} from '../../models/entry';
import {async, AsyncAware} from '../../decorators/async';
import {Store} from '@ngrx/store';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ReaderState} from '../../redux/state';
import {assign} from 'lodash';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import * as moment from 'moment';


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
		return this.storage.getFeeds(); // .then(feeds => this.sortFeeds(feeds));
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
		return this.storage.markAllRead(feed.url).then(() => assign(feed, {unreadCount: 0}));
	}

	@async
	getFavorites() {
		return this.storage.getEntries({favorite: true});
	}

	/**
	 * Get a mix of all entries from various feed
	 * steps
	 * 1. get latest (age < 30 days) 10 unread entries from each feed source
	 * 2. merge them according to time
	 */
	@async
	getHomeEntries(): Promise<Entry[]> {
		const now = moment();
		const duration = moment.duration(30, 'days');
		return Observable.fromPromise(this.storage.getFeeds(false))
			.flatMap(feeds => Observable.from(feeds))
			.flatMap(feed => {
				return Observable.fromPromise(this.storage.getEntries({
					read: false,
					published: function (p) {
						if (!p) return false;
						const timeLapsed = now.valueOf() - moment(p).valueOf();
						const inRange = timeLapsed < duration.valueOf();
						return inRange;
					},
					feed_url: feed.url
				})).flatMap(arr => Observable.from(arr)).take(10);
			}).take(100).toArray().toPromise();
	}
}



