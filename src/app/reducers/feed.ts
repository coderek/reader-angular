import {Action} from "@ngrx/store";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {EntityPayload} from "./index";
export const UPDATE_UNREAD_COUNT = '[Feed] update unread';
export const DECREMENT_UNREAD_COUNT = '[Feed] decrement unread';
export const PULL_FEED = '[Feed] pull';
export const PULL_FEED_COMPLETE = '[Feed] pull complete';
export const PULL_ALL_FEED_INTERMEDIATE = '[Feed] pull all intermediate';

export class PullAllIntermediateAction implements Action {
    readonly type = PULL_ALL_FEED_INTERMEDIATE;
    constructor(public payload: EntityPayload<number>) {}
}

export class UpdateUnreadAction implements Action {
    readonly type = UPDATE_UNREAD_COUNT;
    constructor(public payload: EntityPayload<number>) {}
}

export class DecrementUnreadAction implements Action {
    readonly type = DECREMENT_UNREAD_COUNT;
    constructor(public payload: EntityPayload<void>) {}
}

export class PullAction implements Action {
    readonly type = PULL_FEED;
    constructor(public payload: EntityPayload<void>) {}
}

export class PullFinished implements Action {
    readonly type = PULL_FEED_COMPLETE;
    constructor(public payload: EntityPayload<Entry[]>) {}
}

export type FeedActions = UpdateUnreadAction  | PullAction | PullFinished | DecrementUnreadAction | PullAllIntermediateAction;

const initial = {
    title: '',
    description: '',
    etag: '',
    url: '',
    last_modified: null,
    last_pull: null,
    unreadCount: 0,
    loading: false
};

export function reducer(state: Feed = initial, action: FeedActions): Feed {
    switch (action.type) {
        case UPDATE_UNREAD_COUNT: {
            let {value} = action.payload as EntityPayload<number>;
            return Object.assign({}, state, {unreadCount: value});
        }
        case DECREMENT_UNREAD_COUNT:
            return Object.assign({}, state, {unreadCount: Math.max(0, state.unreadCount - 1)});
        case PULL_FEED:
            return Object.assign({}, state, {loading: true});
        case PULL_ALL_FEED_INTERMEDIATE:
            return Object.assign({}, state, {loading: false, unreadCount: action.payload.value});
        case PULL_FEED_COMPLETE:
            return Object.assign({}, state, {loading: false});
        default:
            return state;
    }
}
