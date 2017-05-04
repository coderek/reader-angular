import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
export const MARK_FAVORITE = '[Entry] favorite';
export const MARK_FAVORITE_COMPLETE = '[Entry] favorite complete';
export const READ_ENTRY = '[Entry] read';
export const OPEN_ENTRY = '[Entry] open';
export const CLOSE_ENTRY = '[Entry] close';

export class Read implements Action {
    readonly type = READ_ENTRY;
    constructor(public payload: string) {}
}

export class Open implements Action {
    readonly type = OPEN_ENTRY;
    constructor(public payload: string) {}
}
export class Close implements Action {
    readonly type = CLOSE_ENTRY;
    constructor(public payload: string) {}
}


export class Favorite implements Action {
    readonly type = MARK_FAVORITE;
    constructor(public payload: string) {}
}

export class FavoriteComplete implements Action {
    readonly type = MARK_FAVORITE_COMPLETE;
}

export type EntryActions = Read | Open | Favorite;


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
        case MARK_FAVORITE:
            return Object.assign(state, {favorite: !state.favorite});
        case OPEN_ENTRY:
            return Object.assign(state, {is_open: true});
        default:
            return state;
    }
}
