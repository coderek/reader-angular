import {Action} from "@ngrx/store";
export const SUCCESS_MESSAGE = '[Message] success';
export const START_LOADING = '[Loading] start';
export const END_LOADING = '[Loading] end';
export const SET_PAGE_TITLE = '[Page Title] set';
export const INCR_FONT_SIZE ='[Font] size +';

export class IncreaseFontSizeAction implements Action {
    readonly type = INCR_FONT_SIZE ;
}

export const DECR_FONT_SIZE ='[Font] size -';
export class DecreaseFontSizeAction implements Action {
    readonly type = DECR_FONT_SIZE ;
}

export const SET_FONT_SIZE ='[Font] size set';

export class SetFontSizeAction implements Action {
    readonly type = SET_FONT_SIZE ;
    constructor(public payload: number) {}
}

export class ShowSuccessAction implements Action {
    readonly type = SUCCESS_MESSAGE;

    constructor(public payload: string) {
    }
}

export class StartLoadingAction implements Action {
    readonly type = START_LOADING;
}

export class StopLoadingAction implements Action {
    readonly type = END_LOADING;
}

export class SetPageTitleAction implements Action {
    readonly type = SET_PAGE_TITLE;
    constructor(public payload: string) {}
}

export const SELECT_FEED = '[Feed] select';
export const SELECT_ENTRY = '[Entry] select';

export class SelectFeedAction implements Action {
    readonly type = SELECT_FEED;
    constructor(public payload: string) {}
}

export class SelectEntryAction implements Action {
    readonly type = SELECT_ENTRY;
    constructor(public payload: string) {
    }
}

export class ShowSuccessMessage implements Action {
    readonly type = SUCCESS_MESSAGE;
    constructor(public payload: string) {}
}

export type GlobalActions = ShowSuccessAction | StartLoadingAction | StopLoadingAction | SetPageTitleAction | SelectFeedAction | SelectEntryAction | IncreaseFontSizeAction | DecreaseFontSizeAction | SetFontSizeAction;

const initial = {
    loading: false,
    selectedFeed: '',
    selectedEntry: '',
    successMessage: '',
    pageTitle: 'All feeds',
    fontSize: 1, // em
};

export function topLevelReducer(state = initial, action) {
    switch(action.type) {
        case INCR_FONT_SIZE: {
            let newSize = state.fontSize + 0.1;
            return Object.assign({}, state, {fontSize: newSize});
        }
        case DECR_FONT_SIZE: {
            let newSize = state.fontSize - 0.1;
            return Object.assign({}, state, {fontSize: newSize});
        }
        case SET_FONT_SIZE:
            console.log(action.payload);
            return Object.assign({}, state, {fontSize: action.payload});
        case SELECT_FEED: {
            return Object.assign({}, state, {selectedFeed: action.payload});
        }
        case SELECT_ENTRY: {
            return Object.assign({}, state, {selectedEntry: action.payload});
        }
        case START_LOADING: {
            return Object.assign({}, state, {loading: true});
        }
        case END_LOADING: {
            return Object.assign({}, state, {loading: false});
        }
        case SUCCESS_MESSAGE: {
            return Object.assign({}, state, {success_message: action.payload});
        }
        case SET_PAGE_TITLE:
            return Object.assign({}, state, {pageTitle: action.payload});
        default:
            return state;
    }
}
