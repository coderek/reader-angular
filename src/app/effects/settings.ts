import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ReaderService} from "../services/reader.service";
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {INCR_FONT_SIZE, DECR_FONT_SIZE} from "../reducers/global";

@Injectable()
export class SettingsEffect {
    constructor(private actions: Actions, private reader: ReaderService) {}
}
