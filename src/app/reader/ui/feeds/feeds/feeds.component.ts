import {Component, Input} from '@angular/core';
import {Feed} from '../../../../models/feed';

@Component({
	selector: 'app-feeds',
	templateUrl: './feeds.component.html',
	styleUrls: ['./feeds.component.css']
})
export class FeedsComponent {
	@Input() feeds: Feed[];
	@Input() filter: string;

	getFeedUrl(feed) {
		return `/feeds/${encodeURIComponent(feed.url)}`;
	}
}
