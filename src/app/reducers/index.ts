import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {Actions as FeedsActions, SELECT_FEED, ADD_COMPLETE, FETCH_ALL_COMPLETE, LOAD_ENTRIES} from "../actions/feeds";
import {Actions as EntryActions, OPEN_ENTRY} from "../actions/entry";
import {Actions as GlobalActions, SUCCESS_MESSAGE, START_LOADING, END_LOADING} from "../actions/global";


export interface State {
    feeds: Feed[];
    selected: string | void;
    loading: boolean;
    entries: Entry[];
    openedEntry: Entry | void;
    success_message: string;
}

const initialState = {
    feeds: [],
    selected: null,
    loading: false,
    entries: [],
    openedEntry: null,
    success_message: '',
};

type AllActions = FeedsActions | EntryActions | GlobalActions;

export function reducer(state = initialState, action: AllActions): State {
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
        case SUCCESS_MESSAGE:
            return Object.assign({}, state, {success_message: action.payload});
        case START_LOADING:
            return Object.assign({}, state, {loading: true});
        case END_LOADING:
            return Object.assign({}, state, {loading: false});
        default:
            return state;
    }
}
