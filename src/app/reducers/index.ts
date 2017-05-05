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
const loading = s => s.globals.loading;

export const selectors = {
    selectedFeed, selectedEntry, loading
};


export type EntityPayload = {
    id: string,
    value?: any
};

/**
 * Function that applies reducer to the correct item in the list
 * @param reducer - Reducer used for item in the array
 * @param action - Action that has payload of type <EntityPayload>
 * @param arrayState
 * @returns {any}
 */
export function entityReducer(reducer, action, arrayState, idAttr = 'url') {
    let {id} = action.payload as EntityPayload;
    let idx = arrayState.findIndex(e => e[idAttr] === id);
    // not found
    if (idx === -1) return arrayState;

    let newEntry = reducer(arrayState[idx], action);
    if (arrayState[idx] === newEntry) {
        // no change
        return arrayState;
    } else {
        // changed, return new array
        return arrayState.map(e => {
            if (e.url !== id) return e;
            return newEntry;
        });
    }
}
