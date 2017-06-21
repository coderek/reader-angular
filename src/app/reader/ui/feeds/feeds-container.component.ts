import {Component} from '@angular/core';
import {ReaderState} from '../../../redux/index';
import {Store} from '@ngrx/store';
import {Feed} from '../../../models/feed';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';



@Component({
	selector: 'app-feeds-container',
	styleUrls: ['./feeds-container.component.css'],
	template: `
		<app-category [category]="category[0]" [feeds]="category[1]" *ngFor="let category of categories | async"></app-category>
	`
})
export class FeedsContainerComponent {
	categories: Observable<[string, Feed[]]>;

	constructor(private store: Store<ReaderState>) {
		this.categories = this.store.select('app_state', 'current_feeds')
			.map(feeds =>
				_.chain(feeds).map(f => _.defaults(f, {category: 'Default'}))
					.groupBy(f => f.category)
					.toPairs()
					.sort((a, b) => a[0] > b[0]? -1: 1)
					.value()
			);
	}
}
