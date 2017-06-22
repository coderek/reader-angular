import {Component, Input} from '@angular/core';
import {StateCache} from '../../../../redux/index';
import {Feed} from '../../../../models/feed';

@Component({
	selector: 'app-feeds',
	templateUrl: './feeds.component.html',
	styleUrls: ['./feeds.component.css']
})
export class FeedsComponent {
	@Input() feeds: Feed[];

	constructor(private cache: StateCache) {
	}

	getFeedUrl(feed) {
		return `/feeds/${encodeURIComponent(feed.url)}`;
	}
}
