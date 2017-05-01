import {Action} from "@ngrx/store";
export const READ = '[Feed] read';
export const FAVORITE = '[Feed] favorite';
export const DELETE = '[Feed] delete';
export const FETCH = '[Feed] fetch';

export class ReadFeedAction implements Action {
    readonly type = READ;
    // feed id
    constructor(public payload: number) {
    }
}

export class FavoriteFeedAction implements Action {
    readonly type = FAVORITE;
    // feed id
    constructor(public payload: number) {
    }
}

export class DeleteFeedAction implements Action {
    readonly type = DELETE;

    constructor(public payload: number) {
    }
}

export class FetchFeedAction implements Action {
    readonly type = FETCH;

    constructor(public payload: number) {
    }
}

export type Actions
    = ReadFeedAction
    | FavoriteFeedAction
    | DeleteFeedAction
    | FetchFeedAction;
