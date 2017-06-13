import {Component, ViewChild} from '@angular/core';
import {Feed} from '../../../models/feed';
import {ReaderService} from '../../services/reader.service';
import {FeedService} from '../../services/feed.service';
import {StorageService} from '../../services/storage.service';
import {Entry} from '../../../models/entry';
import {FeedsComponent} from '../feeds/feeds.component';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/concat';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.css'],
	providers: [
		ReaderService, FeedService, StorageService
	]
})
export class LayoutComponent {
	@ViewChild(FeedsComponent) feedViews: FeedsComponent;

	feed: Feed = null;
	feeds: Feed[] = [];
	entries: Entry[] = [];
	browseUrl = null;

	pullProgress = Observable.empty();

	constructor(private reader: ReaderService) {
		this.reader.getFeedsObservable().subscribe(feeds => this.feeds = feeds );
		this.reader.entries.subscribe(entries => this.entries = entries );
	}

	setBrowserUrl(url) {
		console.log(url)
		this.browseUrl = url;
	}
	onSelectFeed(feed) {
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
		entry.is_open = !entry.is_open;
		this.entries = [...this.entries];
		entry.read = true;
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
