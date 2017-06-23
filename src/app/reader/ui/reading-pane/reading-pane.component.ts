import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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
import {SetDisplayEntriesAction, SetDisplayFeedAction} from '../../../redux/actions';

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
	fontSize: Observable<number>;

	constructor(private store: Store<ReaderState>, private router: Router, private route: ActivatedRoute, private cache: StateCache) {
		this.feed = this.store.select('app_state', 'display_feed')
			.map(url => this.cache.feeds[url as string]);
		this.feeds = this.store.select('app_state', 'display_feeds')
			.map((feedUrls: string[]) => feedUrls.map(url => this.cache.feeds[url]));
		const entriesUrl = this.store.select('app_state', 'display_entries').distinctUntilChanged();
		const entriesDict = this.store.select('domain_state', 'entries').distinctUntilChanged();
		this.entries = Observable.combineLatest(entriesDict, entriesUrl,
			(entries, urls) =>
				(<string[]>urls).map(url => entries[url]).sort((a: Entry, b: Entry) => a.published < b.published ? 1 : -1)
		);
		this.fontSize = this.store.select('ui_state', 'font_size');
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			const url = decodeURIComponent(params.id);
			if (!this.cache.feeds[url]) {
				this.router.navigate(['']);
			}
			this.store.dispatch(new SetDisplayEntriesAction([]));
			this.store.dispatch(new SetDisplayFeedAction(url));
		});
	}
}
