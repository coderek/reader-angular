import {Action} from "@ngrx/store";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {EntityPayload} from "./index";
export const UPDATE_UNREAD_COUNT = '[Feed] update unread';
export const DECREMENT_UNREAD_COUNT = '[Feed] decrement unread';
export const PULL_FEED = '[Feed] pull';
export const PULL_FEED_COMPLETE = '[Feed] pull complete';

export class UpdateUnreadAction implements Action {
    readonly type = UPDATE_UNREAD_COUNT;

    constructor(public payload: EntityPayload) {
    }
}

export class DecrementUnreadAction implements Action {
    readonly type = DECREMENT_UNREAD_COUNT;

    constructor(public payload: EntityPayload) {
    }
}

export class Pull implements Action {
    readonly type = PULL_FEED;

    constructor(public payload: string) {
    }
}

export class PullFinished implements Action {
    readonly type = PULL_FEED_COMPLETE;
    constructor(public payload: Entry[]) {}
}


export type FeedActions = UpdateUnreadAction  | Pull | PullFinished | DecrementUnreadAction;

const initial = {
    title: '',
    description: '',
    etag: '',
    url: '',
    last_modified: null,
    last_pull: null,
    unreadCount: 0
};

export function reducer(state: Feed = initial, action: FeedActions): Feed {
    switch (action.type) {
        case UPDATE_UNREAD_COUNT: {
            let {value} = action.payload as EntityPayload;
            return Object.assign({}, state, {unreadCount: value});
        }
        case DECREMENT_UNREAD_COUNT:
            return Object.assign({}, state, {unreadCount: Math.max(0, state.unreadCount - 1)});
        case PULL_FEED:
            return Object.assign({}, state, {loading: true});
        case PULL_FEED_COMPLETE:
            return Object.assign({}, state, {loading: false});
        default:
            return state;
    }
}
