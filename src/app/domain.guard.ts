import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {StateCache} from './redux/index';
import {ReaderState} from './redux/state';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/skipWhile';

@Injectable()
export class DomainGuard implements CanActivate {
	constructor(private cache: StateCache, private store: Store<ReaderState>) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (this.cache.finish_init) {
			return true;
		} else {
			return this.store
				.select('ui_state', 'finish_init')
				.skipWhile(a => a === false)
				.timeout(10000);
		}
	}
}
