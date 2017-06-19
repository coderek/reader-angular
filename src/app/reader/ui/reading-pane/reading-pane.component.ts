import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Feed} from '../../../models/feed';
import {Entry} from '../../../models/entry';
import {Store} from '@ngrx/store';
import {ReaderState} from '../../../redux/index';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/skip';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import {SET_ENTRIES, SET_FEED} from '../../../redux/consts';


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

	constructor(private store: Store<ReaderState>, private route: ActivatedRoute) {
		this.feed = this.store.select('app_state', 'current_feed');
		this.feeds = this.store.select('app_state', 'current_feeds');
		this.entries = this.store.select('app_state', 'current_entries');
	}

	ngOnInit() {
		this.route.data.subscribe(data => {
				this.store.dispatch({type: SET_FEED, payload: data.feed});
				this.store.dispatch({type: SET_ENTRIES, payload: []});
		});
	}
}
