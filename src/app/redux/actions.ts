import {Action} from '@ngrx/store';
import {
	ADD_FEED, CLOSE_ENTRY, DELETE_FEED, FINISH_LOADING, MARK_FEED_READ, OPEN_ENTRY, PULL_FEED, READ_ENTRY, SET_FEED,
	SET_FEEDS,
	START_LOADING
} from './consts';
import {Feed} from '../models/feed';
import {Entry} from '../models/entry';

/**
 * Define types of actions the system supports
 */


/**
 * Feed related actions
 */
class SetFeedsAction implements Action {
	type = SET_FEEDS;
	constructor(public payload: any) {}
}

class SetFeedAction implements Action {
	type = SET_FEED;
	constructor(public payload: string) {}
}

class AddFeedAction implements Action {
	type = ADD_FEED;
	constructor(public payload: Feed) {}
}

class DeleteFeedAction implements Action {
	type = DELETE_FEED;
	constructor(public payload: string) {}
}

class ReadFeedAction implements Action {
	type = MARK_FEED_READ;
	constructor(public payload: string) {}
}

class PullFeedAction implements Action {
	type = PULL_FEED;
	constructor(public payload: string) {}
}

/**
 * Entry related
 */
class ReadEntryAction implements Action {
	type = READ_ENTRY;
	constructor(public payload: Entry) {}
}

class OpenEntryAction implements Action {
	type = OPEN_ENTRY;
	constructor(public payload: Entry) {}
}

class CloseEntryAction implements Action {
	type = CLOSE_ENTRY;
	constructor(public payload: Entry) {}
}


/**
 * Domain unrelated
 */
class StartLoadingAction implements Action {
	type = START_LOADING;
}

class FinishLoadingAction implements Action {
	type = FINISH_LOADING;
}
