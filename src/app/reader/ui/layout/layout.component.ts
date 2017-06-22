import {Component, OnInit} from '@angular/core';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';
import {Store} from '@ngrx/store';
import {ReaderState} from '../../../redux/state';


/**
 * Act as a container component
 */

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
	constructor(private store: Store<ReaderState>) {}
	ngOnInit() {
		this.store.dispatch({type: 'INIT'});
	}
}
