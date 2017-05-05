import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
import {EntityPayload} from "./index";
export const TOGGLE_FAVORITE = '[Entry] favorite';
export const MARK_FAVORITE_COMPLETE = '[Entry] favorite complete';
export const READ_ENTRY = '[Entry] read';
export const READ_ENTRY_COMPLETE = '[Entry] read complete';
export const OPEN_ENTRY = '[Entry] open';
export const CLOSE_ENTRY = '[Entry] close';

export class ReadEntryAction implements Action {
    readonly type = READ_ENTRY;

    constructor(public payload: EntityPayload) {
    }
}

export class ReadEntryCompleteAction implements Action {
    readonly type = READ_ENTRY_COMPLETE;
}

export class Open implements Action {
    readonly type = OPEN_ENTRY;
    constructor(public payload: string) {}
}
export class Close implements Action {
    readonly type = CLOSE_ENTRY;
    constructor(public payload: string) {}
}


export class ToggleFavoriteAction implements Action {
    readonly type = TOGGLE_FAVORITE;

    constructor(public payload: EntityPayload) {
    }
}

export class FavoriteComplete implements Action {
    readonly type = MARK_FAVORITE_COMPLETE;
}

export type EntryActions = ReadEntryAction | Open | ToggleFavoriteAction;


const initial = {
    title: '',
    content: '',
    summary: '',
    url: '',
    read: false,
    favorite: false,
    published: null,
    last_pull: null
};

export function reducer(state: Entry = initial, action): Entry {
    switch (action.type) {
        case TOGGLE_FAVORITE: {
            let {value} = action.payload;
            return Object.assign({}, state, {favorite: value});
        }
        case READ_ENTRY: {
            let {value} = action.payload;
            return Object.assign({}, state, {read: true});
        }
        default:
            return state;
    }
}
