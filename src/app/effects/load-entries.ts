import {Injectable} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Actions, Effect, toPayload} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LoadEntriesComplete, LOAD_ENTRIES} from "../reducers/entries";
import {READ_ENTRY, ReadEntryCompleteAction, TOGGLE_FAVORITE, FavoriteComplete} from "../reducers/entry";
import {SELECT_FEED, EntityPayload} from "../reducers/index";
import {UpdateUnreadAction, DecrementUnreadAction} from "../reducers/feed";


@Injectable()
export class EntryEffects {
    constructor(private reader: ReaderService, private actions: Actions) {}

    @Effect()
    loadEntries: Observable<Action> = this.actions.ofType(SELECT_FEED, LOAD_ENTRIES)
        .map(toPayload)
        .distinctUntilChanged()
        .switchMap(url => {
            console.log(url);
            if (url==='favorites') {
                return Observable
                    .fromPromise(this.reader.getFavorites())
                    .map(entries => new LoadEntriesComplete(entries))

            } else if (url.startsWith('http')) {
                return Observable
                    .fromPromise(this.reader.getEntriesForFeed(url))
                    .map(entries => new LoadEntriesComplete(entries))
            }
        });

    @Effect()
    favorite: Observable<Action> = this.actions.ofType(TOGGLE_FAVORITE)
        .map(toPayload)
        .switchMap((payload: EntityPayload)=> {
                let {id, value} = payload;
                return Observable
                    .fromPromise(this.reader.updateEntry(id, 'favorite', value))
                    .map(() => new FavoriteComplete());
            }
        );

    @Effect()
    markRead: Observable<Action> = this.actions.ofType(READ_ENTRY)
        .map(toPayload)
        .switchMap((payload: EntityPayload)=> {
                let {id} = payload;
                return Observable
                    .fromPromise(this.reader.updateEntry(id, 'read', true))
                    .flatMap((entry) => {
                        return [new ReadEntryCompleteAction(), new DecrementUnreadAction({id: entry.feed_url})]
                    });
            }
        );
}
