import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Feed} from '../../../models/feed';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import {ReaderState} from '../../../redux/state';
import {StateCache} from '../../../redux/index';

@Component({
	selector: 'app-feeds-container',
	styleUrls: ['./feeds-container.component.css'],
	template: `
		<!--<app-category [category]="category[0]" [feeds]="category[1]" *ngFor="let category of categories | async"></app-category>-->
		<app-feeds [feeds]="feeds | async"></app-feeds>
	`,
})
export class FeedsContainerComponent {
	// categories: Observable<[string, Feed[]]>;

	feeds: Observable<any>;
	constructor(private store: Store<ReaderState>, private cache: StateCache) {
		const urls$: Observable<string[]> = this.store.select('app_state', 'display_feeds');
		const feeds$: Observable<any> = this.store.select('domain_state', 'feeds');
		this.feeds = Observable.combineLatest(urls$, feeds$,
			(urls, feeds) => (<string[]>urls).map(url => feeds[url])
		);

		// .do(res => console.log(res))
		// this.categories = this.store.select('domain_state', 'feeds')
		// 	.distinctUntilChanged()
		// 	.map((feeds : {string: Feed}) =>
		// 		_.chain(feeds).map(f => _.defaults(f, {category: 'Default'}))
		// 			.groupBy(f => f.category)
		// 			.toPairs()
		// 			.sort((a, b) => a[0] > b[0] ? -1 : 1)
		// 			.value()
		// 	);
	}
}
