import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Feed} from '../../../models/feed';

@Component({
	selector: 'app-feeds',
	templateUrl: './feeds.component.html',
	styleUrls: ['./feeds.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedsComponent {
	@Output()
	onNewFeed = new EventEmitter<string>();

	@Output()
	onSelectFeed = new EventEmitter<Feed>();

	@Input()
	feeds: Feed[];

	@Input() title: string;

	constructor() {
	}

	openDialog() {
		const url = prompt('Feed url: ');
		if (url != null) {
			this.onNewFeed.next(url);
		}
	}

	pullAll() {
		// this.store.dispatch(new PullAllAction());
	}
}
