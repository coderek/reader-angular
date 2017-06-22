import {Feed} from '../models/feed';
import {Entry} from '../models/entry';
import {Action, combineReducers} from '@ngrx/store';
import {
	ADD_FEED, CLOSE_ENTRY, DELETE_FEED, MARK_FEED_READ, OPEN_ENTRY, READ_ENTRY, SET_ENTRIES, SET_FEEDS, UPDATE_FEED,
	UPDATED_ENTRY
} from './consts';
import {assign} from 'lodash';


/**
 * Domain state reducer
 * @param state
 * @param action
 * @returns {any}
 */
function feedsReducer(state: any = {}, action: Action) {
	switch (action.type) {
		case SET_FEEDS: {
			return action.payload;
		}
		case DELETE_FEED: {
			const url = action.payload as string;
			if (url in state) {
				delete state[url];
				return assign({}, state);
			} else {
				return state;
			}
		}
		case UPDATE_FEED: {
			const feed = action.payload as Feed;
			const url = feed.url;
			if (url in state) {
				return assign({}, state, {[url]: feed});
			} else {
				return state;
			}
		}
		case ADD_FEED: {
			const feed = action.payload as Feed;
			if (feed.url in state) {
				// already exists
				return state;
			}
			state[feed.url] = feed;
			return assign({}, state);
		}
		case READ_ENTRY: {
			const entry = action.payload as Entry;
			const feed = state[entry.feed_url];
			if (!feed) {
				return state;
			}
			feed.unreadCount--;
			// mark feed changed
			state[entry.feed_url] = assign({}, feed);
			return assign({}, state);
		}
		case MARK_FEED_READ: {
			const url = action.payload as string;
			if (url in state) {
				const feed = state[url];
				state[url] = assign({}, state, {unreadCount: 0});
				return assign({}, state);
			} else {
				return state;
			}
		}
		default:
			return state;
	}
}

function entriesReducer(state: any = {}, action: Action) {
	switch (action.type) {
		case SET_ENTRIES: {
			return action.payload;
		}
		case OPEN_ENTRY: {
			const entry = action.payload as Entry;
			state[entry.url] = assign({}, entry, {is_open: true, read: true});
			return assign({}, state);
		}
		case CLOSE_ENTRY: {
			const entry = action.payload as Entry;
			state[entry.url] = assign({}, entry, {is_open: false});
			return assign({}, state);
		}
		case MARK_FEED_READ: {
			const feedUrl = action.payload as string;
			for (const key in state) {
				if (state[key].feed_url === feedUrl) {
					state[key] = assign({}, state[key], {read: true});
				}
			}
			return state;
		}
		default:
			return state;
	}
}

export const domainStateReducer = combineReducers({
	feeds: feedsReducer,
	entries: entriesReducer
});

