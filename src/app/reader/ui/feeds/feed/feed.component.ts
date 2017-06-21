import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';
import {Feed} from '../../../../models/feed';
import * as _ from 'lodash';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	styleUrls: ['./feed.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent {
	@Input() feed: Feed;
}
