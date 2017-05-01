import {Action} from "@ngrx/store";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";

export const ADD = '[Feeds] add';
export const ADD_COMPLETE = '[Feeds] add complete';
export const FETCH_ALL = '[Feeds] fetch all';
export const FETCH_ALL_COMPLETE = '[Feeds] fetch all complete';
export const SELECT_FEED = '[Feeds] select';
export const LOAD_ENTRIES = '[Entries] load';


export class LoadEntriesAction implements Action {
    readonly type = LOAD_ENTRIES;

    constructor(public payload: Entry[]) {
    }
}

export class SelectFeedAction implements Action {
    readonly type = SELECT_FEED;

    constructor(public payload: string) {
    }
}

export class AddFeedAction implements Action {
    readonly type = ADD;

    constructor(public payload: string) {
    }
}

export class AddFeedCompleteAction implements Action {
    readonly type = ADD_COMPLETE;

    constructor(public payload: Feed) {
    }
}

export class FetchAllAction implements Action {
    readonly type = FETCH_ALL;
}

export class FetchAllCompleteAction implements Action {
    readonly type = FETCH_ALL_COMPLETE;

    constructor(public payload: Feed[]) {
    }
}

export type Actions = AddFeedAction | AddFeedCompleteAction | FetchAllAction | FetchAllCompleteAction | SelectFeedAction | LoadEntriesAction;
