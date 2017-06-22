import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import {ReaderState} from '../../../redux/state';
import {StateCache} from '../../../redux/index';

@Component({
	selector: 'app-feeds-container',
	styleUrls: ['./feeds-container.component.css'],
	template: `
		<app-feeds [feeds]="feeds | async"></app-feeds>
	`,
})
export class FeedsContainerComponent implements OnInit {
	feeds: Observable<any>;
	constructor(private store: Store<ReaderState>, private cache: StateCache) {
		const urls$: Observable<string[]> = this.store.select('app_state', 'display_feeds').distinctUntilChanged();
		const feeds$: Observable<any> = this.store.select('domain_state', 'feeds').distinctUntilChanged();
		this.feeds = Observable.combineLatest(urls$, feeds$,
			(urls, feeds) => (<string[]>urls).map(url => feeds[url])
		);
	}

	ngOnInit() {
		this.store.dispatch({type: 'INIT'});
	}
}
