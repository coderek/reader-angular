import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
import {reducer as entryReducer, EntryActions, READ_ENTRY, MARK_FAVORITE} from "./entry";
import {FeedActions, READ_ALL_ENTRIES, PULL_FEED_FINISHED} from "./feed";

const LOAD_ENTRIES_COMPLETE = '[Entries] load complete';
export const LOAD_ENTRIES = '[Entries] load';
const LOAD_FAVORITES = '[Entries] load favorites';

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
    readonly type = LOAD_FAVORITES;

    constructor(public payload: Entry[]) {
    }
}

type EntriesActions = LoadAllForFeedComplete | LoadFavorites;


const initial = [];

export function reducer(state = initial, action: EntriesActions | EntryActions | FeedActions): Entry[] {
    switch (action.type) {
        case READ_ALL_ENTRIES:
            let feed = action.payload;
            return state.map(s => {
                console.assert(feed.url === s.feed_url);
                return Object.assign(s, {read: true});
            });
        case LOAD_FAVORITES:
        case LOAD_ENTRIES_COMPLETE:
        case PULL_FEED_FINISHED:
            return action.payload;
        case READ_ENTRY:
        case MARK_FAVORITE:
            let entry = action.payload;
            let newEntry = entryReducer(entry, action);
            if (entry === newEntry) {
                return state;
            } else {
                let idx = state.indexOf(entry);
                console.assert(idx !== -1);
                return state.slice(0, idx).concat(state.slice(idx + 1));
            }
        default:
            return state;
    }
}
