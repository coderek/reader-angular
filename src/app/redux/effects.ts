import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {ReaderService} from '../reader/services/reader.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import {
	DISPLAY_HOME,
	CLOSE_ENTRY,
	DELETE_FEED,
	DELETED_FEED,
	INIT,
	MARK_FEED_READ,
	OPEN_ENTRY,
	PULL_ALL_FEEDS,
	PULL_FEED,
	PULL_NEW_FEED,
	SET_DISPLAY_FEED,
	UPDATED_ENTRY,
	ADD_FEED,
} from './consts';
import {StateCache} from './index';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/concatMap';
import * as _ from 'lodash';
import {
	AddFeedAction,
	PullFeedAction,
	SetDisplayEntriesAction,
	SetDisplayFeedsAction,
	SetFeedsAction,
	SetFeedsEntriesAction,
	SetFinishInitAction,
	UpdateFeedAction
} from './actions';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FeedEffects {

	@Effect()
	loadEntries = this.actions.ofType(SET_DISPLAY_FEED)
		.switchMap(action => this.reader.getEntriesForFeed(this.cache.feeds[action.payload]))
		.flatMap(entries => {
			const urls = _.map(entries, 'url');
			const entriesDict = _.zipObject(urls, entries);
			return [new SetFeedsEntriesAction(entriesDict), new SetDisplayEntriesAction(urls)];
		});

	@Effect()
	fetchFeed = this.actions.ofType(PULL_FEED)
		.flatMap(action => this.reader.pullFeed(this.cache.feeds[action.payload]))
		.flatMap(updatedFeed => {
			if (updatedFeed.url === this.cache.display_feed) {
				const promise = this.reader.getEntriesForFeed(updatedFeed).then(entries => {
					const urls = _.map(entries, 'url');
					const entriesDict = _.zipObject(urls, entries);
					return [new SetFeedsEntriesAction(entriesDict), new SetDisplayEntriesAction(urls)];
				});
				return Observable
								.fromPromise(promise)
								.flatMap(a => Observable.from(a))
								.concat(Observable.of(new UpdateFeedAction(updatedFeed)));
			} else {
				return Observable.of(new UpdateFeedAction(updatedFeed));
			}
		});

	@Effect()
	pullNewFeed = this.actions.ofType(PULL_NEW_FEED)
		.flatMap(action => this.reader.addFeed(action.payload).then(feed => new AddFeedAction(feed)))

	@Effect()
	newFeedAdded = this.actions.ofType(ADD_FEED)
		.map(_ => new SetDisplayFeedsAction(this.sortFeeds(this.cache.feeds)));

	@Effect()
	init = this.actions.ofType(INIT)
		.switchMap(() => this.reader.getFeeds())
		.switchMap(feeds => {
			const urls = _.map(feeds, 'url');
			const feedsDict = _.zipObject(urls, feeds);
			return [
				new SetFeedsAction(feedsDict),
				new SetDisplayFeedsAction(this.sortFeeds(feedsDict)),
				new SetFinishInitAction()
			];
		});

	sortFeeds(feeds: any): string[] {
		return _.map(feeds, 'url').sort((u1, u2) => {
			const f1 = feeds[u1];
			const f2 = feeds[u2];
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

	@Effect()
	deleteFeed = this.actions.ofType(DELETE_FEED)
		.flatMap(action => this.reader.deleteFeed(action.payload))
		.map(url => {
			return {type: DELETED_FEED, payload: url};
		});

	@Effect()
	pullAllFeeds = this.actions.ofType(PULL_ALL_FEEDS)
		.flatMap(() => this.cache.display_feeds.map(feedUrl => new PullFeedAction(feedUrl)));

	@Effect()
	markFeedRead = this.actions.ofType(MARK_FEED_READ)
		.flatMap(action => this.reader.markAllRead(this.cache.feeds[action.payload]))
		.map(feed => new UpdateFeedAction(feed));

	constructor(private actions: Actions, private cache: StateCache, private reader: ReaderService) {
	}
}


@Injectable()
export class EntryEffects {
	@Effect()
	changeEntry = this.actions.ofType(OPEN_ENTRY, CLOSE_ENTRY)
		.switchMap(action => this.reader.updateEntry(action.payload.url, action.payload))
		.map(updatedEntry => {
			return {type: UPDATED_ENTRY, payload: updatedEntry};
		});

	@Effect()
	displayHomeEntries = this.actions.ofType(DISPLAY_HOME)
		.flatMap(() => this.reader.getHomeEntries())
		.flatMap(entries => {
			const urls = _.map(entries, 'url')
			const entriesDict = _.zipObject(_.map(entries, 'url'), entries);
			return [
				new SetFeedsEntriesAction(entriesDict),
				new SetDisplayEntriesAction(urls.sort((u1, u2)=> entriesDict[u2].published - entriesDict[u1].published)),
			];
		})
		.do(console.log);

	constructor(private actions: Actions, private reader: ReaderService) {
	}
}
