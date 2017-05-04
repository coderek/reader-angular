import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import * as feeds from "../reducers/feeds";
import * as entries from "../reducers/entries";
import * as feed from "../reducers/feed";
import {ReaderService} from "../services/reader.service";

@Injectable()
export class LoadFeedsEffects {

    @Effect()
    loadFeeds: Observable<Action> = this.actions
        .ofType(feeds.LOAD_FEED)
        .switchMap(() =>
            Observable.fromPromise(this.reader.getFeeds())
                .map(data => new feeds.LoadComplete(data))
        );

    @Effect()
    addFeed: Observable<Action> = this.actions
        .ofType(feeds.ADD_FEED)
        .map(toPayload)
        .switchMap(url=>
            Observable.fromPromise(this.reader.addFeed(url)).map(feed=> new feeds.AddFeedCompleteAction(feed))
        );

    @Effect()
    deleteFeed: Observable<Action> = this.actions
        .ofType(feeds.DELETE_FEED)
        .map(toPayload)
        .switchMap(feedUrl=>
            Observable.fromPromise(this.reader.deleteFeed(feedUrl)).map(()=> new feeds.DeleteComplete())
        );

    @Effect()
    pullFeed: Observable<Action> = this.actions
        .ofType(feed.PULL_FEED)
        .map(toPayload)
        .switchMap(feedUrl=>
            Observable.fromPromise(this.reader.pullFeed(feedUrl)).map(entries=> new feed.PullFinished(entries))
        );

    constructor(private actions: Actions, private reader: ReaderService) {}
}
