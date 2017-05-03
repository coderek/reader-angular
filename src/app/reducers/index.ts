import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {Action, combineReducers} from "@ngrx/store";
import {reducer as feedsReducer} from "../actions/feeds";
import {reducer as entriesReducer} from "../actions/entries";

export const SELECT_FEED = '[Feeds] select';

export class SelectFeedAction implements Action {
    readonly type = SELECT_FEED;

    constructor(public payload: string) {
    }
}

export const SUCCESS_MESSAGE = '[Message] success';
export class ShowSuccessMessage implements Action {
    readonly type = SUCCESS_MESSAGE;

    constructor(public payload: string) {
    }
}

export interface State {
    feeds: Feed[];
    entries: Entry[];
    success_message: string;
}


export function valueReducer(state, action) {
    switch (action.type) {
        case SELECT_FEED:
            return action.payload;
        case SUCCESS_MESSAGE:
            return action.payload;
        default:
            return state;
    }
}

export const reducer = combineReducers({
    feeds: feedsReducer,
    entries: entriesReducer,
    success_message: valueReducer,
});
