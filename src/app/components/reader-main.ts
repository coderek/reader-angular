import {Component} from "@angular/core";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {Feed} from "../models/feed";
import {ReaderService} from "../services/reader.service";
import {Router} from "@angular/router";

@Component({
    selector: 'reader-main',
    template: `
        <header>{{(feed | async)?.title || title}}</header>
        <router-outlet></router-outlet>
    `,
    styles: [
        `
        :host {
            display: flex;
            flex: 1 1;
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
        `
    ]
})
export class ReaderMainComponent {
    title = 'All feeds';
    newItemsCount = 0;

    constructor(private store: Store<State>,
                private reader: ReaderService,
                private router: Router,) {
    }

    onPullFeed(feed: Feed) {
        this.reader.pullFeed(feed).then(() => {
            this.reader.getEntriesForFeed(feed.url).then(entries => {
                // this.store.dispatch(new LoadEntriesAction(entries));
            })
        })
    }

    onReadEntries() {
    }

    onDeleteFeed(feed: Feed) {
        this.reader.deleteFeed(feed).then(async() => {
            // this.store.dispatch(new DeleteFeedAction(feed));
            this.router.navigate(['feeds']);
        })
    }
}
