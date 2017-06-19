import {Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Entry} from '../../../../models/entry';
import {ReaderState} from '../../../../redux/index';
import {CLOSE_ENTRY, OPEN_ENTRY, READ_ENTRY} from '../../../../redux/consts';
@Component({
	templateUrl: './entry.component.html',
	selector: 'app-feed-entry',
	styleUrls: ['entry.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryComponent {
	@Input() entry: Entry;
	constructor(private store: Store<ReaderState>) {
	}

	get opened () {
		return this.entry && this.entry.is_open;
	}

	onClickEntry() {
		if (!this.entry.is_open) {
			if (!this.entry.read) {
				this.store.dispatch({type: READ_ENTRY, payload: this.entry});
			}
			this.store.dispatch({type: OPEN_ENTRY, payload: {
				url: this.entry.url,
				read: true,
				is_open: true
			}});
		} else {
			this.store.dispatch({type: CLOSE_ENTRY, payload: {
				url: this.entry.url,
				is_open: false
			}});
		}
	}

	/**
	 * Send action
	 * @param entry
	 */
	toggleStarEntry(entry) {
		// let payload: EntityPayload<boolean> = {
		// 	id: entry.url,
		// 	value: !entry.favorite
		// };
		// this.redux.dispatch(new ToggleFavoriteAction(payload));
	}
}
