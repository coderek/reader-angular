import {Component, OnInit, ViewChild} from '@angular/core';
import {Feed} from '../../../models/feed';
import {ReaderService} from '../../services/reader.service';
import {FeedService} from '../../services/feed.service';
import {StorageService} from '../../services/storage.service';
import {Entry} from '../../../models/entry';
import {FeedsComponent} from '../feeds/feeds.component';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';
import {AppState, ReaderState} from '../../../store/index';
import {Store} from '@ngrx/store';


/**
 * Act as a container component
 */

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
	@ViewChild(FeedsComponent) feedViews: FeedsComponent;

	feed: Feed = null;
	feeds: Feed[] = [];
	entries: Entry[] = [];
	browseUrl = null;

	pullProgress = Observable.empty();

	constructor(private reader: ReaderService, private store: Store<ReaderState>) {
		store.select('app_state').subscribe((state: AppState) => {
			this.feed = state.current_feed;
			this.entries = state.current_entries;
		});
	}

	ngOnInit() {
		this.reader.getFeeds().then(feeds => this.store.dispatch({type: 'SET_FEEDS', payload: feeds}));
	}

	setBrowserUrl(url) {
		this.browseUrl = url;
	}

	onSelectFeed(feed) {
		if (!feed) {
			return;
		}
		console.log(feed)
		this.feed = feed;
		this.reader.getEntriesForFeed(feed);
	}

	onPullAll() {
		this.pullProgress = Observable.of(0);
		let total = 0;
		for (const feed of this.feeds) {
			this.pullProgress = this.pullProgress.concat(
				Observable.fromPromise(this.reader.pullFeed(feed)));
			total++;
		}
		let completed = 0;
		this.pullProgress = this.pullProgress.map(e => {
			completed++;
			return Math.min(100, Math.trunc(completed * 100 / this.feeds.length)) + '%';
		});
	}

	onClickEntry(entry: Entry) {
		entry.read = true;
		entry.is_open = !entry.is_open;
		this.entries = [...this.entries];
	}

	onPullFeed(feed: Feed) {
		const promise = this.reader.pullFeed(feed);
		if (this.feed === feed) {
			promise.then(() => this.reader.getEntriesForFeed(feed));
		}
	}

	onReadEntries(feed: Feed) {
		this.reader.markAllRead(feed);
	}

	onDeleteFeed(feed: Feed) {
		this.reader.deleteFeed(feed);
	}

	onFeedUrl(url) {
		this.reader.addFeed(url);
	}
}
