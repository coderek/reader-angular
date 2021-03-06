import {Feed} from './feed';
export interface Entry {
	title: string;
	content: string;
	summary: string;
	url: string;
	read: boolean;
	favorite: boolean;
	published: Date;
	last_pull: Date;
	is_open?: boolean;
	feed_url: string;
	feed: Feed;
}
