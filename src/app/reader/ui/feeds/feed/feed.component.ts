import {Component, Input} from '@angular/core';
import {Feed} from '../../../../models/feed';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	styleUrls: ['./feed.component.css']
})
export class FeedComponent {
	@Input() feed: Feed;
}
