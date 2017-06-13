import {Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Entry} from '../../../../models/entry';
@Component({
	templateUrl: './entry.component.html',
	selector: 'app-feed-entry',
	styleUrls: ['entry.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryComponent {
	@Input() entry: Entry;
	@Output() browseUrl = new EventEmitter<string>();
	@Output() clickEntry = new EventEmitter<Entry>();
	constructor(private router: Router) {
	}

	get opened () {
		return this.entry && this.entry.is_open;
	}

	/**
	 * Open in new window
	 * @param url
	 */
	open(url) {
		this.browseUrl.emit(url);
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
		// this.store.dispatch(new ToggleFavoriteAction(payload));
	}
}
