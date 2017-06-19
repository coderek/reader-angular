import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Feed} from '../models/feed';
import {ReaderService} from '../reader/services/reader.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/concat';

@Injectable()
export class FeedEffects {

	@Effect()
	loadEntries = this.actions.ofType('SET_FEED')
		.map(action => action.payload as Feed)
		.switchMap(feed => this.reader.getEntriesForFeed(feed))
		.map(entries => {
			return {type: 'SET_ENTRIES', payload: entries};
		});

	@Effect()
	fetchFeed = this.actions.ofType('FETCH_FEED')
		.map(action => action.payload as Feed)
		.switchMap(feed => this.reader.pullFeed(feed))
		.map(updatedFeed => {
			return {type: 'SET_FEED', payload: updatedFeed};
		});

	@Effect()
	init = this.actions.ofType('INIT')
		.switchMap(()=> this.reader.getFeeds())
		.map(feeds => {
			return {type: 'SET_FEEDS', payload: feeds};
		});

	constructor(private actions: Actions, private reader: ReaderService) {
	}
}


@Injectable()
export class EntryEffects {
	@Effect()
	changeEntry = this.actions.ofType('OPEN_ENTRY', 'CLOSE_ENTRY')
		.switchMap(action => this.reader.updateEntry(action.payload.url, action.payload))
		.map(updatedEntry => {
			return {type: 'UPDATED_ENTRY', payload: updatedEntry};
		});

	constructor(private actions: Actions, private reader: ReaderService) {
	}
}
