import {
	AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output,
	SimpleChanges
} from '@angular/core';
import {Entry} from '../../../models/entry';
import {Feed} from '../../../models/feed';

@Component({
	selector: 'app-entries',
	templateUrl: './entries.component.html',
	styleUrls: ['./entries.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedEntriesComponent implements OnChanges {

	@Input() feed: Feed;
	@Input() entries: Entry[];

	@Output() clickEntry = new EventEmitter<Entry>();

	constructor(private ref: ElementRef) {
		// this.entries = this.store.select(s => s.entries);
		// this.feed = this.store.select(s => {
		// 	return s.feeds.find(f => f.url === s.globals.selectedFeed);
		// }).distinctUntilChanged().do(f => {
		// 	if (f) {
		// 		this.store.dispatch(new SetPageTitleAction(f.title))
		// 	}
		// });
		// this.opened = this.store.select(selectors.selectedEntry);
		// console.log('feed entries');
		// this.clickEntry.subscribe(()=> {
		// 	console.log('changed')
		// })
	}

	ngOnChanges (changes: SimpleChanges) {
		console.log('fuck')
		// console.log(this.ref.nativeElement.querySelector('.entries'));
		this.ref.nativeElement.querySelector('.entries').scrollTop = 0;
	}
}
