import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Entry} from '../../../models/entry';
import {Feed} from '../../../models/feed';

@Component({
	selector: 'app-entries',
	templateUrl: './entries.component.html',
	styleUrls: ['./entries.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedEntriesComponent implements OnInit {

	@Input() feed: Feed;
	@Input() entries: Entry[];

	@Output() clickEntry = new EventEmitter<Entry>();

	constructor(protected route: ActivatedRoute, protected router: Router) {
		// this.entries = this.store.select(s => s.entries);
		// this.feed = this.store.select(s => {
		// 	return s.feeds.find(f => f.url === s.globals.selectedFeed);
		// }).distinctUntilChanged().do(f => {
		// 	if (f) {
		// 		this.store.dispatch(new SetPageTitleAction(f.title))
		// 	}
		// });
		// this.opened = this.store.select(selectors.selectedEntry);
		console.log('feed entries');
	}

	ngOnInit() {
	}
}
