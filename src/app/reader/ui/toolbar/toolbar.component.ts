import {Component, Input} from '@angular/core';
import {Feed} from '../../../models/feed';
import {Store} from '@ngrx/store';
import {DECREMENT_FONT, INCREMENT_FONT} from '../../../redux/consts';
import {Router} from '@angular/router';
import {ReaderState} from '../../../redux/state';
import {DeleteFeedAction, MarkFeedReadAction, PullFeedAction} from '../../../redux/actions';

@Component({
	selector: 'app-feed-toolbar',
	styleUrls: ['./toolbar.component.css'],
	templateUrl: './toolbar.component.html'
})
export class ToolsComponent {
	@Input()
	feed: Feed;

	constructor(private store: Store<ReaderState>, private router: Router) {}

	readAll() {
		this.store.dispatch(new MarkFeedReadAction(this.feed.url));
	}

	delete() {
		this.store.dispatch(new DeleteFeedAction(this.feed.url));
		this.router.navigate(['']);
	}

	pull() {
		this.store.dispatch(new PullFeedAction(this.feed.url));
	}

	increaseFontSize() {
		this.store.dispatch({type: INCREMENT_FONT});
	}
	decreaseFontSize() {
		this.store.dispatch({type: DECREMENT_FONT});
	}
}
