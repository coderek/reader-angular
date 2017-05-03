import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
export const MARK_FAVORITE = '[Entry] favorite';
export const READ_ENTRY = '[Entry] read';

export class Read implements Action {
    readonly type = READ_ENTRY;

    constructor(public payload: Entry) {
    }
}

export class Favorite implements Action {
    readonly type = MARK_FAVORITE;

    constructor(public payload: Entry) {
    }
}

export type EntryActions = Read | Favorite;


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

export function reducer(state = initial, action): Entry {
    switch (action.type) {
        case MARK_FAVORITE:
            return Object.assign(state, {favorite: true});
        case READ_ENTRY:
            return Object.assign(state, {read: true});
        default:
            return state;
    }
}
