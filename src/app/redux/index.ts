import {Entry} from '../models/entry';
import {Feed} from '../models/feed';
import {Action, combineReducers} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {compose} from "@ngrx/core";

const _cached_app_state: any = {};

@Injectable()
export class StateCache {
	get current_feeds() {
		return _cached_app_state.current_feeds || [];
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
}

export interface ReaderState {
	app_state: AppState;
	ui_state: UIState;
}

const defaultUIState: UIState = {
	http_loading: false,
};

export function uiStateReducer(state: UIState = defaultUIState, action: Action) {
	switch (action.type) {
		case 'START_LOADING':
			return Object.assign({}, state, {http_loading: true});
		case 'FINISH_LOADING':
			return Object.assign({}, state, {http_loading: false});
		default:
			return state;
	}
}

export function currentFeedsReducer(state: Feed[] = [], action: Action) {
	let s;
	switch (action.type) {
		case 'SET_FEEDS':
			s = action.payload;
			break;
		default:
			s = state;
	}
	Object.assign(_cached_app_state, {current_feeds: s});
	return s;
}

export function currentFeedReducer(state: Feed = null, action: Action) {
	let s;
	switch (action.type) {
		case 'SET_FEED':
			s = action.payload;
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
		case 'SET_ENTRIES':
			s = action.payload;
			break;
		case 'OPEN_ENTRY':
		case 'CLOSE_ENTRY':
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
		case 'OPEN_ENTRY':
		case 'CLOSE_ENTRY':
			return Object.assign({}, state, action.payload);
		default:
			return state;
	}
}

export function currentEntryReducer(state: Entry = null, action: Action) {
	let s;
	switch (action.type) {
		case 'SET_ENTRY':
			s = action.payload;
			break;
		default:
			s = state;
	}
	Object.assign(_cached_app_state, {current_entry: s});
	return s;
}

export function appStateReducer () {
	return compose(combineReducers)({
		current_feeds: currentFeedsReducer,
		current_feed: currentFeedReducer,
		current_entries: currentEntriesReducer,
		current_entry: currentEntryReducer
	});
}

export function readerReducer () {
	return compose(combineReducers)({
		ui_state: uiStateReducer,
		app_state: appStateReducer
	});
}
