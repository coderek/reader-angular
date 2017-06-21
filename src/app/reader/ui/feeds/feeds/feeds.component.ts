import {Component, Input} from '@angular/core';
import {Feed} from '../../../../models/feed';
import {ReaderService} from '../../../services/reader.service';
import {Store} from '@ngrx/store';
import {ReaderState} from '../../../../redux/index';

@Component({
	selector: 'app-feeds',
	templateUrl: './feeds.component.html',
	styleUrls: ['./feeds.component.css']
})
export class FeedsComponent {
	@Input() feeds: Feed[];

	constructor(private reader: ReaderService, private store: Store<ReaderState>) {
		// this.feeds = store.select('app_state', 'current_feeds');
	}

	getFeedUrl(feed) {
		return `/feeds/${encodeURIComponent(feed.url)}`;
	}
}
