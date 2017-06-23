import {Action} from '@ngrx/store';
import {
	ADD_FEED, CLOSE_ENTRY, DELETE_FEED, FINISH_INIT, FINISH_LOADING, MARK_FEED_READ, OPEN_ENTRY, PULL_FEED, READ_ENTRY,
	SET_DISPLAY_ENTRIES,
	SET_DISPLAY_FEED,
	SET_DISPLAY_FEEDS, SET_ENTRIES,
	SET_FEED,
	SET_FEEDS,
	CHANGE_FILTER,
	START_LOADING, UPDATE_FEED, DISPLAY_HOME
} from './consts';
import {Feed} from '../models/feed';
import {Entry} from '../models/entry';

/**
 * Define types of actions the system supports
 */


/**
 * Feed related actions
 */
export class SetFeedsAction implements Action {
	type = SET_FEEDS;
	constructor(public payload: any) {}
}

export class UpdateFeedAction implements Action {
	type = UPDATE_FEED;
	constructor(public payload: Feed) {}
}

export class SetDisplayFeedsAction implements Action {
	type = SET_DISPLAY_FEEDS;
	constructor(public payload: string[]) {}
}

export class SetDisplayFeedAction implements Action {
	type = SET_DISPLAY_FEED;
	constructor(public payload: string) {}
}

export class SetDisplayEntriesAction implements Action {
	type = SET_DISPLAY_ENTRIES;
	constructor(public payload: string[]) {}
}

export class SetFeedAction implements Action {
	type = SET_FEED;
	constructor(public payload: string) {}
}

export class AddFeedAction implements Action {
	type = ADD_FEED;
	constructor(public payload: Feed) {}
}

export class DeleteFeedAction implements Action {
	type = DELETE_FEED;
	constructor(public payload: string) {}
}

export class MarkFeedReadAction implements Action {
	type = MARK_FEED_READ;
	constructor(public payload: string) {}
}

export class PullFeedAction implements Action {
	type = PULL_FEED;
	constructor(public payload: string) {}
}

/**
 * Entry related
 */
export class SetFeedsEntriesAction implements Action {
	type = SET_ENTRIES;
	constructor(public payload: any) {}
}
export class ReadEntryAction implements Action {
	type = READ_ENTRY;
	constructor(public payload: Entry) {}
}

export class OpenEntryAction implements Action {
	type = OPEN_ENTRY;
	constructor(public payload: Entry) {}
}

export class CloseEntryAction implements Action {
	type = CLOSE_ENTRY;
	constructor(public payload: Entry) {}
}

export class DisplayHomePageAction implements Action {
	type = DISPLAY_HOME;
}


/**
 * Domain unrelated
 */
export class StartLoadingAction implements Action {
	type = START_LOADING;
}

export class FinishLoadingAction implements Action {
	type = FINISH_LOADING;
}
export class SetFinishInitAction implements Action {
	type = FINISH_INIT;
}
export class ChangeFilterAction implements Action {
	type = CHANGE_FILTER;
	constructor(public payload: string) {}
}
