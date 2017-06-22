import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges} from '@angular/core';
import {Store} from '@ngrx/store';
import {Entry} from '../../../../models/entry';
import {CLOSE_ENTRY, OPEN_ENTRY, READ_ENTRY} from '../../../../redux/consts';
import {ReaderState} from '../../../../redux/state';
import {StateCache} from '../../../../redux/index';
import {CloseEntryAction, OpenEntryAction} from '../../../../redux/actions';

@Component({
	templateUrl: './entry.component.html',
	selector: 'app-feed-entry',
	styleUrls: ['entry.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryComponent implements OnChanges {
	@Input() entry: Entry;

	constructor(private ref: ElementRef, private store: Store<ReaderState>) {
	}

	get opened () {
		return this.entry && this.entry.is_open;
	}

	ngOnChanges(changes) {
		// console.log(changes);
	}

	open(url) {
		window.open(url, '_blank');
	}

	bound() {
		return this.ref.nativeElement.getBoundingClientRect();
	}

	onClickEntry() {
		if (!this.entry.is_open) {
			this.store.dispatch(new OpenEntryAction(this.entry));
		} else {
			this.store.dispatch(new CloseEntryAction(this.entry));
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
