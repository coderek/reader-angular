import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {Feed} from '../../../../models/feed';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnChanges {
	@Input() feed: Feed;

	ngOnChanges() {
	}
}
