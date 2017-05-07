import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {combineReducers} from "@ngrx/store";
import {reducer as feedsReducer} from "./feeds";
import {reducer as entriesReducer} from "./entries";
import {topLevelReducer} from "./global";

export interface State {
    // NOTE can't use object reference, because that will make this action dependent on the presense of feeds
    feeds: Feed[];
    entries: Entry[];
    globals: {
        selectedFeed: string;
        selectedEntry: string;
        successMessage: string;
        loading: boolean;
        pageTitle: string;
        fontSize: number; // em
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
const pageTitle = s => s.globals.pageTitle;
const fontSize = s => s.globals.fontSize;

export const selectors = {
    selectedFeed, selectedEntry, loading, pageTitle, fontSize
};

export type EntityPayload<T> = {
    id: string,
    value?: T
};

/**
 * Function that applies reducer to the correct item in the list
 * @param reducer - Reducer used for item in the array
 * @param action - Action that has payload of type <EntityPayload>
 * @param arrayState
 * @returns {any}
 */
export function entityReducer(reducer, action, arrayState, idAttr = 'url') {
    let {id} = action.payload as EntityPayload<any>;
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
