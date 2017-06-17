import {Entry} from '../models/entry';
import {Feed} from '../models/feed';
import {Action, combineReducers} from '@ngrx/store';

export interface AppState {
	current_feed: Feed;
	current_entry: Entry;
	current_feeds: Feed[];
	current_entries: Entry[];
}

export interface ReaderState {
	app_state: AppState;
}
const defaultAppState: AppState = {
	current_feed: null,
	current_feeds: [],
	current_entry: null,
	current_entries: []
};
//
// const defaultReaderState: ReaderState = {
// 	app_state: defaultAppState,
// };

// export function readerReducer(state: ReaderState = defaultReaderState, action: Action) {
//
// };


export function appStateReducer(state: AppState = defaultAppState, action: Action) {
	switch (action.type) {
		case 'SET_FEEDS':
			const feeds = action.payload as Feed[];
			return Object.assign(state, {current_feeds: [...feeds]});
		case 'SET_ENTRIES':
			const entries = action.payload as Feed[];
			return Object.assign(state, {current_entries: [...entries]});
		case 'SET_FEED':
			return Object.assign(state, {current_feed: action.payload});
		case 'SET_ENTRY':
			return Object.assign(state, {current_entry: action.payload});
		default:
			return state;
	}
}

export const readerReducer = combineReducers({app_state: appStateReducer});
