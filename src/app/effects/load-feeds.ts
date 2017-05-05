import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import * as feeds from "../reducers/feeds";
import * as feed from "../reducers/feed";
import {ReaderService} from "../services/reader.service";
import {UpdateUnreadAction} from "../reducers/feed";

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
            Observable
                .fromPromise(this.reader.addFeed(url))
                .map(feed=> new feeds.AddFeedCompleteAction(feed))
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
        .switchMap(feedUrl => {
            // pull entries first, then update count
            let promises = this.reader.pullFeed(feedUrl).then(entries=>{
                return this.reader.countUnreadEntries(feedUrl).then(count=> {
                    return [new feed.PullFinished(entries), new UpdateUnreadAction({id: feedUrl, value: count})];
                })
            });
            return Observable.fromPromise(promises).concatAll();
        });

    constructor(private actions: Actions, private reader: ReaderService) {}
}
