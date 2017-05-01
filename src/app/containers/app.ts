import {Component, ChangeDetectionStrategy, OnInit} from "@angular/core";
import * as fromFeeds from "../reducers/feed-list";
import {Store} from "@ngrx/store";
import {FetchAllCompleteAction, LoadEntriesAction} from "../actions/feeds";
import {ReaderService} from "../services/reader.service";
import {ActivatedRoute} from "@angular/router";
import {Feed} from "../models/feed";

@Component({
    selector: 'reader-app',
    template: `
        <app-menu (onNewFeed)="onNewFeed($event)" [title]="'RSS Reader'"></app-menu>
        <div class="app-main-display">
            <router-outlet></router-outlet>
        </div>
    `,
    styleUrls: ['./app.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    constructor(private store: Store<fromFeeds.State>,
                private reader: ReaderService,
                private route: ActivatedRoute) {
        this.store.select(s => s.selected).subscribe(f => {
            this.reader.getEntriesForFeed(f).then(entries => {
                this.store.dispatch(new LoadEntriesAction(entries));
            })
        });
    }

    ngOnInit() {
        this.loadAllFeeds();
    }

    loadAllFeeds(): Promise<Feed[]> {
        return this.reader.getFeeds().then(feeds => {
            this.store.dispatch(new FetchAllCompleteAction(feeds));
            return feeds;
        })
    }

    onNewFeed(url) {
        this.reader.addFeed(url).then(() => {
            this.loadAllFeeds();
        })
    }
}
