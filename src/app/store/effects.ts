import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Feed} from '../models/feed';
import {ReaderService} from '../reader/services/reader.service';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class LoadFeedEffect {

	@Effect()
	loadEntries = this.actions.ofType('LOAD_FEED')
		.map(action => action.payload as Feed)
		.switchMap(feed => this.reader.getEntriesForFeed(feed))
		.map(entries => {
			console.log(entries)
			return {type: 'SET_ENTRIES', payload: entries};
		});
	constructor(private actions: Actions, private reader: ReaderService) {}
}
