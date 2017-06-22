import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Feed} from '../models/feed';
import {ReaderService} from '../reader/services/reader.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/mergeMap';
import {
	CLOSE_ENTRY,
	DELETE_FEED,
	DELETED_FEED,
	INIT,
	MARK_FEED_READ,
	OPEN_ENTRY,
	PULL_ALL_FEEDS,
	PULL_FEED,
	PULL_NEW_FEED, SET_DISPLAY_FEED, SET_DISPLAY_FEEDS,
	SET_ENTRIES,
	SET_FEED,
	UPDATED_ENTRY
} from './consts';
import {StateCache} from './index';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatAll';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {
	PullFeedAction, SetDisplayEntriesAction, SetDisplayFeedsAction, SetFeedAction, SetFeedsAction, SetFeedsEntriesAction,
	UpdateFeedAction
} from './actions';

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
		.switchMap(action => this.reader.pullFeed(this.cache.feeds[action.payload]))
		.switchMap(updatedFeed => {

			const actions = [new UpdateFeedAction(updatedFeed)];
			// if (this.cache.current_feed && updatedFeed.url === this.cache.current_feed.url) {
			// 	actions.push({type: SET_FEED, payload: updatedFeed});
			// }
			return Observable.from(actions);
		});

	@Effect()
	pullNewFeed = this.actions.ofType(PULL_NEW_FEED)
		.switchMap(action => this.reader.addFeed(action.payload))
		.map(feed => {
			return {type: 'ADD_FEED', payload: feed};
		});

	@Effect()
	init = this.actions.ofType(INIT)
		.switchMap(() => this.reader.getFeeds())
		.switchMap(feeds => {
			const urls = _.map(feeds, 'url');
			const feedsDict = _.zipObject(urls, feeds);
			return [
				new SetFeedsAction(feedsDict),
				new SetDisplayFeedsAction(urls)
			];
		});

	@Effect()
	deleteFeed = this.actions.ofType(DELETE_FEED)
		.flatMap(action => this.reader.deleteFeed(action.payload))
		.map(url => {
			return {type: DELETED_FEED, payload: url};
		});

	@Effect()
	pullAllFeeds = this.actions.ofType(PULL_ALL_FEEDS)
		.switchMap(() => {
			return Observable.from(this.cache.display_feeds.map(feedUrl => {
				return new PullFeedAction(feedUrl);
			}));
		});

	@Effect()
	markFeedRead = this.actions.ofType(MARK_FEED_READ)
		.mergeMap(action => this.reader.markAllRead(action.payload))
		.map(feed => {
			feed.unreadCount = 0;
			return {type: SET_FEED, payload: feed};
		})

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

	constructor(private actions: Actions, private reader: ReaderService) {
	}
}
