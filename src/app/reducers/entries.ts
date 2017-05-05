import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
import {reducer as entryReducer, EntryActions, READ_ENTRY, TOGGLE_FAVORITE} from "./entry";
import {entityReducer} from "./index";
import {PULL_FEED_COMPLETE, FeedActions} from "./feed";

const LOAD_ENTRIES_COMPLETE = '[Entries] load complete';
export const LOAD_ENTRIES = '[Entries] load';

export class LoadEntriesComplete implements Action {
    readonly type = LOAD_ENTRIES_COMPLETE;

    constructor(public payload: Entry[]) {
    }
}

export class LoadEntries implements Action {
    readonly type = LOAD_ENTRIES;

    constructor(public payload: string) {
    }
}


type EntriesActions = LoadEntriesComplete ;

export function reducer(state: Entry[] = [], action: FeedActions | EntriesActions | EntryActions): Entry[] {
    switch (action.type) {
        // case UPDATE_UNREAD_COUNT:
        //     let feedUrl = action.payload;
        //     return state.map(s => {
        //         console.assert(feedUrl.url === s.feed_url);
        //         return Object.assign(s, {read: true});
        //     });
        case LOAD_ENTRIES_COMPLETE:
            return action.payload;
        case READ_ENTRY:
        case TOGGLE_FAVORITE:
            return entityReducer(entryReducer, action, state);
        case PULL_FEED_COMPLETE:
            return action.payload;
        default:
            return state;
    }
}
