import {SET_DISPLAY_ENTRIES, SET_DISPLAY_FEED, SET_DISPLAY_FEEDS} from './consts';
import {Action, combineReducers} from '@ngrx/store';
import {compose} from '@ngrx/core/compose';


export const appStateReducer = compose(combineReducers)({
	display_feeds: currentFeedsReducer,
	display_feed: currentFeedReducer,
	display_entries: currentEntriesReducer,
});

export function currentEntriesReducer(state=[], action: Action) {
	if (action.type === SET_DISPLAY_ENTRIES) {
		return action.payload;
	} else {
		return state;
	}
};

export function currentFeedReducer(state=null, action) {
	if (action.type === SET_DISPLAY_FEED) {
		return action.payload;
	} else {
		return state;
	}
}

export function currentFeedsReducer(state: string[] = [], action: Action) {
	if (action.type === SET_DISPLAY_FEEDS) {
		return action.payload;
	} else {
		return state;
	}
}

