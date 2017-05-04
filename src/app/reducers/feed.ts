import {Action} from "@ngrx/store";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
export const READ_ALL_ENTRIES = '[Feed] read all entries';
export const PULL_FEED = '[Feed] pull';
export const PULL_FEED_COMPLETE = '[Feed] pull complete';

export class Read implements Action {
    readonly type = READ_ALL_ENTRIES;
    constructor(public payload: Feed) {
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


export type FeedActions = Read  | Pull | PullFinished;

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
        case READ_ALL_ENTRIES:
            return Object.assign(state, {unreadCount: 0});
        case PULL_FEED:
            return Object.assign(state, {loading: true});
        case PULL_FEED_COMPLETE:
            return Object.assign(state, {loading: false});
        default:
            return state;
    }
}
