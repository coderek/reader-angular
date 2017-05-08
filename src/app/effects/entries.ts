import {Injectable} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Actions, Effect, toPayload} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LoadEntriesCompleteAction, LOAD_ENTRIES, READ_ALL_ENTRIES, ReadAllEntriesCompleteAction} from "../reducers/entries";
import {READ_ENTRY, ReadEntryCompleteAction, TOGGLE_FAVORITE, FavoriteComplete} from "../reducers/entry";
import {EntityPayload} from "../reducers/index";
import {DecrementUnreadAction} from "../reducers/feed";
import {SELECT_FEED} from "../reducers/global";


@Injectable()
export class EntryEffects {
    constructor(private reader: ReaderService, private actions: Actions) {}

    @Effect()
    loadEntries: Observable<Action> = this.actions.ofType(SELECT_FEED, LOAD_ENTRIES)
        .map(toPayload)
        .distinctUntilChanged()
        .switchMap(url => {
            if (url==='favorites') {
                return Observable
                    .fromPromise(this.reader.getFavorites())
                    .map(entries => new LoadEntriesCompleteAction(entries))

            } else if (url.startsWith('http')) {
                return Observable
                    .fromPromise(this.reader.getEntriesForFeed(url))
                    .map(entries => new LoadEntriesCompleteAction(entries))
            }
        });

    @Effect()
    favorite: Observable<Action> = this.actions.ofType(TOGGLE_FAVORITE)
        .map(toPayload)
        .switchMap((payload: EntityPayload<boolean>)=> {
                let {id, value} = payload;
                return Observable
                    .fromPromise(this.reader.updateEntry(id, 'favorite', value))
                    .map(() => new FavoriteComplete());
            }
        );

    @Effect()
    markRead: Observable<Action> = this.actions.ofType(READ_ENTRY)
        .map(toPayload)
        .switchMap((payload: EntityPayload<any>)=> {
                let {id} = payload;
                console.log('read '+id)
                return Observable
                    .fromPromise(this.reader.updateEntry(id, 'read', true))
                    .flatMap((entry) => {
                        return [new ReadEntryCompleteAction(), new DecrementUnreadAction({id: entry.feed_url})]
                    });
            }
        );

    @Effect()
    readAll: Observable<Action>  = this.actions.ofType(READ_ALL_ENTRIES)
        .map(toPayload)
        .switchMap(feedUrl=>{
            return Observable
                .fromPromise(this.reader.markAllRead(feedUrl)).map(()=>new ReadAllEntriesCompleteAction());
        })
}
