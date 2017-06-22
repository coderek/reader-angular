import {Feed} from '../models/feed';
import {Entry} from '../models/entry';
import {Action, combineReducers} from '@ngrx/store';
import {ADD_FEED, CLOSE_ENTRY, DELETE_FEED, MARK_FEED_READ, OPEN_ENTRY, READ_ENTRY, SET_FEEDS} from './consts';
import {merge} from 'lodash';


/**
 * Domain state reducer
 * @param state
 * @param action
 * @returns {any}
 */
function feedsReducer(state: {string: Feed}, action: Action) {
	switch (action.type) {
		case SET_FEEDS: {
			return action.payload as {string: Feed};
		}
		case DELETE_FEED: {
			const url = action.payload as string;
			if (url in state) {
				delete state[url];
				return merge({}, state);
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
			return merge({}, state);
		}
		case READ_ENTRY: {
			const entry = action.payload as Entry;
			const feed = state[entry.feed_url];
			if (!feed) {
				return state;
			}
			feed.unreadCount--;
			// mark feed changed
			state[entry.feed_url] = merge({}, feed);
			// mark feeds changed
			return merge({}, state);
		}
		case MARK_FEED_READ: {
			const url = action.payload as string;
			if (url in state) {
				const feed = state[url];
				state[url] = merge({}, state, {unreadCount: 0});
				return merge({}, state);
			} else {
				return state;
			}
		}
		default:
			return state;
	}
}

function entriesReducer(state: {string: Entry}, action: Action) {
	switch (action.type) {
		case OPEN_ENTRY: {
			const entry = action.payload as Entry;
			state[entry.url] = merge({}, entry, {is_open: true, read: true});
			return merge({}, state);
		}
		case CLOSE_ENTRY: {
			const entry = action.payload as Entry;
			state[entry.url] = merge({}, entry, {is_open: false});
			return merge({}, state);
		}
		case READ_ENTRY: {
			const entry = action.payload as Entry;
			state[entry.url] = merge({}, entry, {read: true});
			return merge({}, state);
		}
		case MARK_FEED_READ: {
			const feedUrl = action.payload as string;
			let changed = false;
			for (const key in state) {
				if (state[key].feed_url === feedUrl) {
					changed = true;
					state[key] = merge({}, state[key], {read: true});
				}
			}
			if (changed) {
				return merge({}, state);
			} else {
				return state;
			}
		}
		default:
			return state;
	}
}

export const domainStateReducer = combineReducers({
	feeds: feedsReducer,
});

