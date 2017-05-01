import {Feed} from "../models/feed";
import {Actions as FeedsActions, SELECT_FEED, ADD_COMPLETE, FETCH_ALL_COMPLETE, LOAD_ENTRIES} from "../actions/feeds";
import {Entry} from "../models/entry";
import {EntryActions, OPEN_ENTRY} from "../actions/entry";

export interface State {
    feeds: Feed[];
    selected: string | void;
    loading: boolean;
    entries: Entry[];
    openedEntry: Entry | void;
}

const initialState = {
    feeds: [],
    selected: null,
    loading: false,
    entries: [],
    openedEntry: null
};

export function reducer(state = initialState, action: FeedsActions | EntryActions): State {
    switch (action.type) {
        case SELECT_FEED:
            return Object.assign({}, state, {selected: action.payload});
        case ADD_COMPLETE:
        case FETCH_ALL_COMPLETE:
            return Object.assign({}, state, {feeds: action.payload});
        case LOAD_ENTRIES:
            return Object.assign({}, state, {entries: action.payload});
        case OPEN_ENTRY:
            let entry = action.payload;
            console.assert(state.entries.indexOf(entry) !== -1);
            entry.read = true;
            if (state.openedEntry === entry) {
                return Object.assign({}, state, {openedEntry: null});
            } else {
                return Object.assign({}, state, {openedEntry: entry});
            }
        default:
            return state;
    }
}
