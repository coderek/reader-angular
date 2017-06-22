import {Feed} from '../models/feed';
import {Entry} from '../models/entry';

export interface ReaderState {
	domain_state: DomainState;
	app_state: AppState;
	ui_state: UIState;
}

export interface DomainState {
	// equal to all feeds in the system
	feeds: {string: Feed};

	// equal to entries we are displaying in the reading pane
	// this can all belong to one feed
	// or a mix of entries
	entries: {string: Entry};
}


export interface UIState {
	http_loading: boolean;
	font_size: number;
	finish_init: boolean;
}

export interface AppState {
	// currently displaying feed
	display_feed: string;
	display_feeds: string[];
	display_entries: string[];
}
