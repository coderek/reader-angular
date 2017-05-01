import {Component} from "@angular/core";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {Feed} from "../models/feed";
import {ReaderService} from "../services/reader.service";
import {LoadEntriesAction} from "../actions/feeds";

@Component({
    selector: 'reader-main',
    template: `
        <header>{{(feed | async)?.title || title}}</header>
        
        <feed-toolbar *ngIf="feed | async" [feed]="feed | async" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed($event)" (onReadEntries)="onReadEntries($event)" (onDeleteFeed)="onDeleteFeed($event)"></feed-toolbar>
        
        <router-outlet></router-outlet>
    `,
    styles: [
        `
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        header {
            /*height: 30px;*/
            flex: none;
            color: black;
            padding-left: 10px;
            line-height: 30px;
            background-color: #c2cff1;
        }
        feed-toolbar {
            /*height: 40px;*/
            flex: none;
            margin: 10px 10px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #d8d4d4;
        }
        `
    ]
})
export class ReaderMainComponent {
    title = 'All feeds';
    newItemsCount = 0;
    feed: Observable<Feed>;

    constructor(private store: Store<State>,
                private reader: ReaderService) {
        this.feed = this.store.switchMap(s => Observable.of(s.feeds.find(f => f.url === s.selected)));
    }

    onPullFeed(feed: Feed) {
        this.reader.pullFeed(feed).then(() => {
            this.reader.getEntriesForFeed(feed.url).then(entries => {
                this.store.dispatch(new LoadEntriesAction(entries));
            })
        })
    }

    onReadEntries() {
    }

    onDeleteFeed() {
    }
}
