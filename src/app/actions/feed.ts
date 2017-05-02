import {Action} from "@ngrx/store";
import {Feed} from "../models/feed";
export const READ_FEED = '[Feed] read';
export const FAVORITE_FEED = '[Feed] favorite';
export const DELETE_FEED = '[Feed] delete';

export class ReadFeedAction implements Action {
    readonly type = READ_FEED;
    // feed id
    constructor(public payload: Feed) {
    }
}

export const PULL_FEED = '[Feed] pull';

export class PullFeedAction implements Action {
    readonly type = PULL_FEED;

    constructor(public payload: Feed) {
    }
}

export class FavoriteFeedAction implements Action {
    readonly type = FAVORITE_FEED;
    // feed id
    constructor(public payload: Feed) {
    }
}

export class DeleteFeedAction implements Action {
    readonly type = DELETE_FEED;

    constructor(public payload: Feed) {
    }
}


export type Actions
    = ReadFeedAction
    | FavoriteFeedAction
    | DeleteFeedAction
    | PullFeedAction
