import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Feed} from '../models/feed';
import {ReaderService} from '../reader/services/reader.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/concat';
import {
	CLOSE_ENTRY,
	DELETE_FEED,
	DELETED_FEED,
	FEED_UPDATED,
	INIT, MARK_FEED_READ,
	OPEN_ENTRY,
	PULL_ALL_FEEDS,
	PULL_FEED,
	PULL_NEW_FEED,
	SET_ENTRIES,
	SET_FEED,
	SET_FEEDS,
	UPDATED_ENTRY
} from './consts';
import {StateCache} from './index';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FeedEffects {

	@Effect()
	loadEntries = this.actions.ofType(SET_FEED)
		.map(action => action.payload as Feed)
		.switchMap(feed => this.reader.getEntriesForFeed(feed))
		.map(entries => {
			return {type: SET_ENTRIES, payload: entries};
		});

	@Effect()
	fetchFeed = this.actions.ofType(PULL_FEED)
		.map(action => action.payload as Feed)
		.mergeMap(feed => this.reader.pullFeed(feed))
		.mergeMap(updatedFeed => {
			const actions = [{type: FEED_UPDATED, payload: updatedFeed}];
			if (this.cache.current_feed && updatedFeed.url === this.cache.current_feed.url) {
				actions.push({type: SET_FEED, payload: updatedFeed});
			}
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
		.switchMap(()=> this.reader.getFeeds())
		.map(feeds => {
			return {type: SET_FEEDS, payload: feeds};
		});

	@Effect()
	deleteFeed = this.actions.ofType(DELETE_FEED)
		.flatMap(action => this.reader.deleteFeed(action.payload))
		.map(url => {
			return {type: DELETED_FEED, payload: url};
		});

	@Effect()
	pullAllFeeds = this.actions.ofType(PULL_ALL_FEEDS)
		.mergeMap(() => {
			return Observable.from(this.cache.current_feeds.map(feed => {
					return {type: PULL_FEED, payload: feed};
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
