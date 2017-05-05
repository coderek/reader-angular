import {Action} from "@ngrx/store";
import {Feed} from "../models/feed";
import {UPDATE_UNREAD_COUNT, reducer as feedReducer, FeedActions, DECREMENT_UNREAD_COUNT} from "./feed";
import {entityReducer} from "./index";

export const ADD_FEED = '[Feeds] add';
export const ADD_COMPLETE = '[Feeds] add complete';
export const DELETE_FEED = '[Feed] delete';
export const DELETE_FEED_COMPLETE = '[Feed] delete complete';
export const LOAD_FEED = '[Feeds] load';
export const LOAD_FEED_COMPLETE = '[Feeds] load complete';

export class Load implements Action {
    readonly type = LOAD_FEED;
}

export class LoadComplete implements Action {
    readonly type = LOAD_FEED_COMPLETE;

    constructor(public payload: Feed[]) {
    }
}

export class Delete implements Action {
    readonly type = DELETE_FEED;

    constructor(public payload: string) {}
}


export class DeleteComplete implements Action {
    readonly type = DELETE_FEED_COMPLETE;
}


export class AddFeedAction implements Action {
    readonly type = ADD_FEED;

    constructor(public payload: string) {
    }
}

export class AddFeedCompleteAction implements Action {
    readonly type = ADD_COMPLETE;

    constructor(public payload: Feed) {
    }
}

export type Actions = Load | LoadComplete | DeleteComplete | AddFeedAction | AddFeedCompleteAction | Delete;


const initial = [];

export function reducer(state: Feed[] = initial, action: Actions | FeedActions): Feed[] {

    switch (action.type) {
        case ADD_COMPLETE:
            return [...state, action.payload];
        case LOAD_FEED_COMPLETE:
            return action.payload;
        case DELETE_FEED:
            return state.filter(s => s.url != action.payload);
        case UPDATE_UNREAD_COUNT:
        case DECREMENT_UNREAD_COUNT:
            return entityReducer(feedReducer, action, state);
        default:
            return state;
    }
}
