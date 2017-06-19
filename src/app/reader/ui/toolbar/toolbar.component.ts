import {Component, Input} from '@angular/core';
import {Feed} from '../../../models/feed';
import {Store} from '@ngrx/store';
import {ReaderState} from '../../../redux/index';
import {DECREMENT_FONT, DELETE_FEED, INCREMENT_FONT, MARK_FEED_READ, PULL_FEED} from '../../../redux/consts';

@Component({
	selector: 'app-feed-toolbar',
	styleUrls: ['./toolbar.component.css'],
	templateUrl: './toolbar.component.html'
})
export class ToolsComponent {
	@Input()
	feed: Feed;

	constructor(private store: Store<ReaderState>) {}

	readAll() {
		this.store.dispatch({type: MARK_FEED_READ, payload: this.feed});
	}

	delete() {
		this.store.dispatch({type: DELETE_FEED, payload: this.feed});
	}

	pull() {
		this.store.dispatch({type: PULL_FEED, payload: this.feed});
	}

	increaseFontSize() {
		this.store.dispatch({type: INCREMENT_FONT});
	}
	decreaseFontSize() {
		this.store.dispatch({type: DECREMENT_FONT});
	}
}
