import {Component, Input} from '@angular/core';
import {Feed} from '../../../../models/feed';
import * as _ from 'lodash';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	styleUrls: ['./feed.component.css']
})
export class FeedComponent {
	@Input() feed: Feed;

	pad(str) {
		return _.padEnd('(' + str + ')', 6, ' ');
	}
}
