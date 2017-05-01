import {Component, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {FetchAllCompleteAction, LoadEntriesAction} from "../actions/feeds";
import {ReaderService} from "../services/reader.service";
import {ActivatedRoute} from "@angular/router";
import {Feed} from "../models/feed";
import {MdSnackBar} from "@angular/material";
import {Observable} from "rxjs";

@Component({
    selector: 'reader-app',
    template: `
        <spinner [spin]="spin | async"></spinner>
        <app-menu (onNewFeed)="onNewFeed($event)" [title]="'RSS Reader'"></app-menu>
        <div class="app-main-display">
            <router-outlet></router-outlet>
        </div>
    `,
    styleUrls: ['./app.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    spin: Observable<boolean>;

    constructor(private store: Store<State>,
                private reader: ReaderService,
                private snackbar: MdSnackBar,
                private route: ActivatedRoute) {
        this.store.select(s => s.selected).subscribe(f => {
            this.reader.getEntriesForFeed(f).then(entries => {
                this.store.dispatch(new LoadEntriesAction(entries));
            })
        });

        this.spin = this.store.select(s => s.loading);
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
