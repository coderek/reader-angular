import {Component, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {ReaderService} from "../services/reader.service";
import {Observable} from "rxjs";
import {Load} from "../reducers/feeds";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'reader-app',
    template: `
        <spinner [spin]="spin | async"></spinner>
        <app-menu (onNewFeed)="onNewFeed($event)" [title]="'RSS Reader'"></app-menu>
        <div class="app-main-display">
            <router-outlet></router-outlet>
            <footer></footer>
        </div>
    `,
    styleUrls: ['./app.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    spin: Observable<boolean>;

    constructor(private store: Store<State>,
                private route: ActivatedRoute,
                private reader: ReaderService,) {
        this.spin = this.store.select(s => s.loading);
    }

    ngOnInit() {
        this.loadAllFeeds();
    }

    loadAllFeeds() {
        this.store.dispatch(new Load());
    }
}
