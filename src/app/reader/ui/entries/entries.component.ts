import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter, Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges, ViewChildren
} from '@angular/core';
import {Entry} from '../../../models/entry';
import {Feed} from '../../../models/feed';
import {StateCache} from '../../../redux/index';
import {EntryComponent} from './entry/entry.component';

@Component({
	selector: 'app-entries',
	templateUrl: './entries.component.html',
	styleUrls: ['./entries.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedEntriesComponent implements OnInit, OnChanges {
	@Input() feed: Feed;
	@Input() entries: Entry[];

	@Output() clickEntry = new EventEmitter<Entry>();
	@Output() browseUrl = new EventEmitter<string>();
	@ViewChildren(EntryComponent) entryViews;

	constructor(private ref: ElementRef, private cache: StateCache) {}

	ngOnChanges(changes: SimpleChanges) {
		if ('feed' in changes) {
			this.ref.nativeElement.querySelector('.entries').scrollTop = 0;
		}
	}

	findShowingEntryView() {
		for (const entryView of this.entryViews) {
			if (entryView.opened) {
				const {top, bottom} = entryView.bound();
				if (top > 0 || bottom > 0) {
					return entryView;
				}
			}
		}
		return null;
	}
	onCloseEntry() {
		const view = this.findShowingEntryView();
		if (view) {
			view.onClickEntry();
		}
	}

	ngOnInit() {
	}
}
