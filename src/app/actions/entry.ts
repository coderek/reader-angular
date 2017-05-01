import {Action} from "@ngrx/store";
import {Entry} from "../models/entry";
export const OPEN_ENTRY = '[Entry] open';

export class OpenEntryAction implements Action {
    readonly type = OPEN_ENTRY;

    constructor(public payload: Entry) {
    }
}

export type Actions = OpenEntryAction
