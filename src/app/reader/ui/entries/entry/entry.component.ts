import {Component, Input, OnInit, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Entry} from '../../../../models/entry';
@Component({
	templateUrl: './entry.component.html',
	selector: 'app-feed-entry',
	styleUrls: ['entry.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryComponent implements OnInit, OnChanges {
	@Input() entry: Entry;

	constructor(private router: Router) {
	}

	ngOnInit() {
	}

	get opened () {
		return this.entry && this.entry.is_open;
	}

	ngOnChanges() {
		if (this.opened && !this.entry.read) {
			// this.store.dispatch(new ReadEntryAction({id: this.entry.url}));
		}
	}

	/**
	 * Open in new window
	 * @param url
	 */
	open(url) {
		window.open(url, '_blank');
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

	/**
	 * use router to transfer the selected entry to the global state
	 * @param entry
	 */
	toggleEntry(entry) {
		const path = decodeURIComponent(entry.feed_url);
		if (this.opened) {
			this.router.navigate(['feeds', path]);
		} else {
			this.router.navigate(['feeds', path, {open: encodeURIComponent(this.entry.url)}]);
		}
	}
}
