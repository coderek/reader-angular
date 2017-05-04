import {Action} from "@ngrx/store";
export const SUCCESS_MESSAGE = '[Message] success';
export const START_LOADING = '[Loading] start';
export const END_LOADING = '[Loading] end';
export const ADD_ASYNC = '[Task] add';


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
