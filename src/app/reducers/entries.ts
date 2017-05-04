import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
import {reducer as entryReducer, EntryActions, READ_ENTRY, MARK_FAVORITE, OPEN_ENTRY} from "./entry";
import {FeedActions, READ_ALL_ENTRIES, PULL_FEED_COMPLETE} from "./feed";
import {Feed} from "../models/feed";

const LOAD_ENTRIES_COMPLETE = '[Entries] load complete';
export const LOAD_ENTRIES = '[Entries] load';
export const LOAD_FAVORITES = '[Entries] load favorites';
const LOAD_FAVORITES_COMPLETE = '[Entries] load favorites complete';

export class LoadAllForFeedComplete implements Action {
    readonly type = LOAD_ENTRIES_COMPLETE;

    constructor(public payload: Entry[]) {
    }
}

export class LoadEntries implements Action {
    readonly type = LOAD_ENTRIES;

    constructor(public payload: string) {
    }
}

export class LoadFavorites implements Action {
    readonly type = LOAD_FAVORITES
}

export class LoadFavoritesComplete implements Action {
    readonly type = LOAD_FAVORITES_COMPLETE;

    constructor(public payload: Entry[]) {
    }
}

type EntriesActions = LoadAllForFeedComplete | LoadFavorites | LoadFavoritesComplete;


const initial = [];

function arrayReducer(reducer, action, arrayState) {
    let url = action.payload;
    let entry = arrayState.find(s=>s.url === url);
    if (entry === null) return arrayState;

    let newEntry = reducer(entry, action);
    if (entry === newEntry) {
        return arrayState;
    } else {
        let idx = arrayState.indexOf(entry);
        console.assert(idx !== -1);
        return arrayState.slice(0, idx).concat(arrayState.slice(idx + 1));
    }
}

export function reducer(state: Entry[] = initial, action: EntriesActions | EntryActions): Entry[] {
    switch (action.type) {
        // case READ_ALL_ENTRIES:
        //     let feedUrl = action.payload;
        //     return state.map(s => {
        //         console.assert(feedUrl.url === s.feed_url);
        //         return Object.assign(s, {read: true});
        //     });
        case LOAD_FAVORITES_COMPLETE:
        case LOAD_ENTRIES_COMPLETE:
            return action.payload;
        // case READ_ENTRY:
        // case MARK_FAVORITE:
        case OPEN_ENTRY:
            state.forEach(s=>s.is_open=false);
            return arrayReducer(entryReducer, action, state);
        default:
            return state;
    }
}
