import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
import {reducer as entryReducer, EntryActions, READ_ENTRY, TOGGLE_FAVORITE} from "./entry";
import {entityReducer} from "./index";
import {PULL_FEED_COMPLETE, FeedActions} from "./feed";

export const LOAD_ENTRIES_COMPLETE = '[Entries] load complete';
export const LOAD_ENTRIES = '[Entries] load';
export const READ_ALL_ENTRIES = '[Entries] read all';
export const READ_ALL_ENTRIES_COMPLETE = '[Entries] read all complete';

export class LoadEntriesComplete implements Action {
    readonly type = LOAD_ENTRIES_COMPLETE;
    constructor(public payload: Entry[]) {}
}

export class LoadEntries implements Action {
    readonly type = LOAD_ENTRIES;
    constructor(public payload: string) {}
}

export class ReadAllEntriesAction implements Action {
    readonly type = READ_ALL_ENTRIES;
    constructor(public payload: string) {}
}

export class ReadAllEntriesCompleteAction implements Action {
    readonly type = READ_ALL_ENTRIES_COMPLETE;
}

type EntriesActions = ReadAllEntriesAction | LoadEntriesComplete  | LoadEntries;

export function reducer(state: Entry[] = [], action: FeedActions | EntriesActions | EntryActions): Entry[] {
    switch (action.type) {
        case READ_ALL_ENTRIES:
            return state.map(e=>Object.assign({}, e, {read:true}));
        case LOAD_ENTRIES_COMPLETE:
            return action.payload;
        case LOAD_ENTRIES:
            if (state.length>0 && action.payload === state[0].feed_url) {
                return state;
            }return [];
        case READ_ENTRY:
        case TOGGLE_FAVORITE:
            return entityReducer(entryReducer, action, state);
        case PULL_FEED_COMPLETE:
            return action.payload.value;
        default:
            return state;
    }
}
