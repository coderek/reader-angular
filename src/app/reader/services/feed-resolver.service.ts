import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Feed} from '../../models/feed';
import {ReaderService} from './reader.service';
import {StateCache} from '../../redux/index';

@Injectable()
export class FeedResolverService implements Resolve<Feed> {

	constructor(private cache: StateCache) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Feed> {
		const id = decodeURIComponent(route.params['id']);
		const feed = this.cache.feeds[id];
		return Promise.resolve(feed);
	}
}
