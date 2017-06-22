import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Feed} from '../../../models/feed';
import {Entry} from '../../../models/entry';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/skip';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import {ReaderState} from '../../../redux/state';
import {StateCache} from '../../../redux/index';
import {SetDisplayFeedAction} from '../../../redux/actions';


/**
 * Container component
 */


@Component({
	selector: 'app-reading-pane',
	templateUrl: './reading-pane.component.html',
	styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent implements OnInit {

	feed: Observable<Feed>;
	entries: Observable<Entry[]>;
	feeds: Observable<Feed[]>;

	constructor(private store: Store<ReaderState>, private route: ActivatedRoute, private cache: StateCache) {
		this.feed = this.store.select('app_state', 'display_feed')
			.map(url => this.cache.feeds[url as string]);
		this.feeds = this.store.select('app_state', 'display_feeds')
			.map((feedUrls: string[]) => feedUrls.map(url => this.cache.feeds[url]));
		this.entries = this.store.select('app_state', 'display_entries')
			.map((entryUrls: string[]) => entryUrls.map(url => this.cache.entries[url]));
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
				this.store.dispatch(new SetDisplayFeedAction(decodeURIComponent(params.id)));
		});
	}
}
