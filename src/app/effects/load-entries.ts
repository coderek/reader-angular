import {Injectable} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Actions, Effect, toPayload} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LOAD_ENTRIES, LoadAllForFeedComplete, LOAD_FAVORITES} from "../actions/entries";


@Injectable()
export class LoadEntriesEffect {
    constructor(private reader: ReaderService, private actions: Actions) {
    }

    @Effect()
    loadEntries: Observable<Action> = this.actions.ofType(LOAD_ENTRIES)
        .map(toPayload)
        .distinctUntilChanged()
        .switchMap(url => {
            console.log('load for : ' + url);
            return Observable.fromPromise(this.reader.getEntriesForFeed(url)).map(entries => {
                return new LoadAllForFeedComplete(entries);
            })
        });

    @Effect()
    loadFavorites: Observable<Action> = this.actions.ofType(LOAD_FAVORITES)
        .switchMap(() => {
            return Observable.fromPromise(this.reader.getFavorites()).map(entries => new LoadAllForFeedComplete(entries))
        })
}
