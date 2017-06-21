import {Entry} from '../models/entry';
import {Feed} from '../models/feed';
import {Action, combineReducers} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {compose} from '@ngrx/core';
import {
	ADD_FEED,
	CLOSE_ENTRY, DECREMENT_FONT, DELETED_FEED, FEED_UPDATED, FINISH_LOADING, INCREMENT_FONT, OPEN_ENTRY, READ_ENTRY,
	SET_ENTRIES,
	SET_ENTRY,
	SET_FEED, SET_FEEDS,
	START_LOADING
} from './consts';

const _cached_app_state: any = {};

@Injectable()
export class StateCache {
	get current_feeds() {
		return _cached_app_state.current_feeds || [];
	}
	get current_entries() {
		return _cached_app_state.current_entries || [];
	}
	get current_feed() {
		return _cached_app_state.current_feed || null;
	}
}

export interface AppState {
	current_feed: Feed;
	current_entry: Entry;
	current_feeds: Feed[];
	current_entries: Entry[];
}

export interface UIState {
	http_loading: boolean;
	font_size: number;
}

export interface ReaderState {
	app_state: AppState;
	ui_state: UIState;
}

const defaultUIState: UIState = {
	http_loading: false,
	font_size: 12
};

export function uiStateReducer(state: UIState = defaultUIState, action: Action) {
	switch (action.type) {
		case START_LOADING:
			return Object.assign({}, state, {http_loading: true});
		case FINISH_LOADING:
			return Object.assign({}, state, {http_loading: false});
		case INCREMENT_FONT: {
			let fontSize = state.font_size + 1;
			fontSize = Math.max(fontSize, 12);
			fontSize = Math.min(fontSize, 18);
			return Object.assign({}, state, {font_size: fontSize});
		}
		case DECREMENT_FONT: {
			let fontSize = state.font_size - 1;
			fontSize = Math.max(fontSize, 12);
			fontSize = Math.min(fontSize, 18);
			return Object.assign({}, state, {font_size: fontSize});
		}
		default:
			return state;
	}
}

export function currentFeedsReducer(state: Feed[] = [], action: Action) {
	let s;
	switch (action.type) {
		case SET_FEEDS:
			s = action.payload;
			break;
		case DELETED_FEED:
			const idx = state.findIndex(f => f.url === action.payload);
			if (idx === -1) {
				s = state;
			} else {
				state.splice(idx, 1);
				s = state;
			}
			break;
		case ADD_FEED:{
			const feed = action.payload as Feed;
			let i = 0;
			while (i < state.length &&
				(state[i].unreadCount > feed.unreadCount
				|| state[i].unreadCount === feed.unreadCount && state[i].title > feed.title)) {
					i++;
				}
				state.splice(i, 0, feed);
				s = state;
			}
			break;
		default:
			s = state;
	}

	let changed = false;
	const ret = [];
	for (const feed of state) {
		const f = feedReducer(feed, action);
		if (f !== feed) {
			changed = true;
		}
		ret.push(f);
	}

	if (changed) {
		s = ret;
	}
	Object.assign(_cached_app_state, {current_feeds: s});
	return s;
}

export function feedReducer(state, action) {
	if (action.payload && state.url !== action.payload.feed_url && state.url !== action.payload.url) {
		return state;
	}
	switch (action.type) {
		case READ_ENTRY:
			return Object.assign({}, state, {unreadCount: state.unreadCount - 1});
		case FEED_UPDATED:
			return Object.assign({}, action.payload);
		default:
			return state;
	}
}

export function currentFeedReducer(state: Feed = null, action: Action) {
	let s;
	switch (action.type) {
		case SET_FEED:
			s = action.payload;
			break;
		case DELETED_FEED:
			if (state !== null && action.payload === state.url) {
				s = null;
			} else {
				s = state;
			}
			break;
		default:
			s = state;
	}
	Object.assign(_cached_app_state, {current_feed: s});
	return s;
}

export function currentEntriesReducer(state: Entry[] = [], action: Action) {
	let s;
	switch (action.type) {
		case SET_ENTRIES:
			s = action.payload;
			break;
		case OPEN_ENTRY:
		case CLOSE_ENTRY:
			const idx = state.findIndex(e => e.url === action.payload.url);
			if (idx !== -1) {
				const updated = entryReducer(state[idx], action);
				if (updated !== state[idx]) {
					s = [...state.slice(0, idx), updated, ...state.slice(idx + 1)];
				} else {
					s = state;
				}
			} else {
				s = state;
			}
			break;
		default:
			s = state;
	}
	Object.assign(_cached_app_state, {current_entries: s});
	return s;
}

function entryReducer(state: Entry, action: Action) {
	switch (action.type) {
		case OPEN_ENTRY:
		case CLOSE_ENTRY:
			return Object.assign({}, state, action.payload);
		default:
			return state;
	}
}

export function currentEntryReducer(state: Entry = null, action: Action) {
	let s;
	switch (action.type) {
		case SET_ENTRY:
			s = action.payload;
			break;
		default:
			s = state;
	}
	Object.assign(_cached_app_state, {current_entry: s});
	return s;
}

export const appStateReducer = compose(combineReducers)({
	current_feeds: currentFeedsReducer,
	current_feed: currentFeedReducer,
	current_entries: currentEntriesReducer,
	current_entry: currentEntryReducer
});

export const readerReducer = {
		ui_state: uiStateReducer,
		app_state: appStateReducer
};
