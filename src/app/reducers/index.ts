import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {Action, combineReducers} from "@ngrx/store";
import {reducer as feedsReducer} from "./feeds";
import {reducer as entriesReducer} from "./entries";
import {START_LOADING, END_LOADING} from "./global";

export const SELECT_FEED = '[Feed] select';
export const SELECT_ENTRY = '[Entry] select';
export const SUCCESS_MESSAGE = '[Message] success';

export class SelectFeedAction implements Action {
    readonly type = SELECT_FEED;
    constructor(public payload: string) {}
}

export class SelectEntryAction implements Action {
    readonly type = SELECT_ENTRY;
    constructor(public payload: string) {
    }
}

export class ShowSuccessMessage implements Action {
    readonly type = SUCCESS_MESSAGE;
    constructor(public payload: string) {}
}

export interface State {
    // NOTE can't use object reference, because that will make this action dependent on the presense of feeds
    feeds: Feed[];
    entries: Entry[];
    globals: {
        selectedFeed: string;
        selectedEntry: string;
        success_message: string;
        loading: boolean;
    }
}

const initial = {
    feeds: [],
    entries: [],
    globals: {
        loading: false,
        selectedFeed: '',
        selectedEntry: '',
        success_message: ''
    }
};

export function topLevelReducer(state, action) {
    switch(action.type) {
        case SELECT_FEED: {
            return Object.assign({}, state, {selectedFeed: action.payload});
        }
        case SELECT_ENTRY: {
            return Object.assign({}, state, {selectedEntry: action.payload});
        }
        case START_LOADING: {
            return Object.assign({}, state, {loading: true});
        }
        case END_LOADING: {
            return Object.assign({}, state, {loading: false});
        }
        case SUCCESS_MESSAGE: {
            return Object.assign({}, state, {success_message: action.payload});
        }
        default:
            return state;
    }
}

export const reducer = combineReducers({
    feeds: feedsReducer,
    entries: entriesReducer,
    globals: topLevelReducer
});

const selectedFeed = s=>s.globals.selectedFeed;
const selectedEntry = s=>s.globals.selectedEntry;
export const selectors = {
    selectedFeed, selectedEntry
};
