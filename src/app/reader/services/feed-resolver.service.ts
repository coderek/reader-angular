import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Feed} from '../../models/feed';
import {ReaderService} from './reader.service';
import {StateCache} from '../../redux/index';

@Injectable()
export class FeedResolverService implements Resolve<Feed> {

	constructor(private cache: StateCache, private router: Router) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Feed> {
		const id = decodeURIComponent(route.params['id']);
		const feed = this.cache.feeds[id];
		console.log(feed);
		if (!feed) {
			this.router.navigate(['/']);
			return Promise.resolve(null);
		}
		return Promise.resolve(feed);
	}
}
