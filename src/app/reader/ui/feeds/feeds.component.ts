import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Feed} from '../../../models/feed';

@Component({
	selector: 'app-feeds',
	templateUrl: './feeds.component.html',
	styleUrls: ['./feeds.component.css']
})
export class FeedsComponent {
	@Output() selectFeed = new EventEmitter<Feed>();

	@Input()
	feeds: Feed[];

	constructor() {
	}
}
