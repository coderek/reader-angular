import {Injectable} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Actions, Effect, toPayload} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LOAD_ENTRIES, LoadAllForFeedComplete, LOAD_FAVORITES} from "../reducers/entries";
import {MARK_FAVORITE, FavoriteComplete} from "../reducers/entry";
import {Entry} from "../models/entry";
import {SELECT_FEED} from "../reducers/index";


@Injectable()
export class LoadEntriesEffect {
    constructor(private reader: ReaderService, private actions: Actions) {
    }

    @Effect()
    loadEntries: Observable<Action> = this.actions.ofType(SELECT_FEED)
        .map(toPayload)
        .distinctUntilChanged()
        .switchMap(url => {
            return Observable.fromPromise(this.reader.getEntriesForFeed(url)).map(entries => {
                return new LoadAllForFeedComplete(entries);
            })
        });

    @Effect()
    loadFavorites: Observable<Action> = this.actions.ofType(LOAD_FAVORITES)
        .switchMap(() => {
            return Observable.fromPromise(this.reader.getFavorites()).map(entries => new LoadAllForFeedComplete(entries))
        });

    @Effect()
    favorite: Observable<Action> = this.actions.ofType(MARK_FAVORITE)
        .map(toPayload)
        .switchMap((entry: Entry)=> {
                return Observable.fromPromise(this.reader.saveEntry(entry)).map(() => new FavoriteComplete());
            }
        )
}
