import {SET_ENTRIES, SET_FEED, SET_FEEDS} from './consts';
import {Action, combineReducers} from '@ngrx/store';
import {compose} from '@ngrx/core/compose';


export const appStateReducer = compose(combineReducers)({
	feeds: currentFeedsReducer,
	feed: currentFeedReducer,
	entries: currentEntriesReducer,
});

export function currentEntriesReducer(state, action: Action) {
	if (action.type === SET_ENTRIES) {
		return action.payload;
	} else {
		return state;
	}
};

export function currentFeedReducer(state, action) {
	if (action.type === SET_FEED) {
		return action.payload;
	} else {
		return state;
	}
}

export function currentFeedsReducer(state: string[] = [], action: Action) {
	if (action.type === SET_FEEDS) {
		return action.payload;
	} else {
		return state;
	}
}

