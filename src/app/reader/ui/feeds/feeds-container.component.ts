import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import {ReaderState} from '../../../redux/state';

@Component({
	selector: 'app-feeds-container',
	styleUrls: ['./feeds-container.component.css'],
	template: `
		<ul>
			<li routerLink="/feeds/home">Home</li>
		</ul>
		<app-feeds [feeds]="feeds | async" [filter]="filter | async"></app-feeds>
	`,
})
export class FeedsContainerComponent implements OnInit {
	feeds: Observable<any>;
	filter: Observable<string>;

	constructor(private store: Store<ReaderState>) {
		const urls$: Observable<string[]> = this.store.select('app_state', 'display_feeds').distinctUntilChanged();
		const feeds$: Observable<any> = this.store.select('domain_state', 'feeds').distinctUntilChanged();
		this.feeds = Observable.combineLatest(urls$, feeds$,
			(urls, feeds) => (<string[]>urls).map(url => feeds[url])
		).do(console.log);
		this.filter = this.store.select('ui_state', 'filter');
	}

	ngOnInit() {
		this.store.dispatch({type: 'INIT'});
	}
}
