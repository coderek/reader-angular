import {Action} from "@ngrx/store";
import {Feed} from "../models/feed";

export const ADD = '[Feeds] add';
export const ADD_COMPLETE = '[Feeds] add complete';
export const DELETE_FEED = '[Feed] delete';
export const LOAD = '[Feeds] load';
export const LOAD_COMPLETE = '[Feeds] load complete';

export class Load implements Action {
    readonly type = LOAD;
}

export class LoadComplete implements Action {
    readonly type = LOAD_COMPLETE;

    constructor(public payload: Feed[]) {
    }
}

export class Delete implements Action {
    readonly type = DELETE_FEED;

    constructor(public payload: Feed) {
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

export type Actions = Load | LoadComplete | AddFeedAction | AddFeedCompleteAction | Delete;


const initial = [];

export function reducer(state: Feed[] = initial, action: Actions): Feed[] {

    switch (action.type) {
        case ADD_COMPLETE:
            return [...state, action.payload];
        case LOAD_COMPLETE:
            return action.payload;
        case DELETE_FEED:
            return state.filter(s => s.url != action.payload.url);
        default:
            return state;
    }
}

