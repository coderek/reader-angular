import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Feed} from '../../models/feed';
import {ReaderService} from './reader.service';
import {StateCache} from '../../redux/index';

@Injectable()
export class FeedResolverService implements Resolve<Feed> {

	constructor(private cache: StateCache, private reader: ReaderService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Feed> {
		const id = decodeURIComponent(route.params['id']);
		const feeds = this.cache.current_feeds;
		const idx = feeds.findIndex(f => f.url === id);
		if (idx !== -1) {
			return Promise.resolve(feeds[idx]);
		} else {
			return this.reader.getFeed(id);
		}
	}
}
