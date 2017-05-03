import {Injectable} from "@angular/core";
import {Effect, Actions} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import * as feeds from "../actions/feeds";
import {ReaderService} from "../services/reader.service";

@Injectable()
export class LoadFeedsEffects {
    @Effect()
    loadFeeds: Observable<Action> = this.actions
        .ofType(feeds.LOAD)
        .switchMap(() =>
            Observable.fromPromise(this.reader.getFeeds())
                .map(data => new feeds.LoadComplete(data))
        );

    constructor(private actions: Actions, private reader: ReaderService) {
    }
}
