import {Component, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {State, selectors} from "../reducers";
import {Observable} from "rxjs";
import {Load} from "../reducers/feeds";

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

    constructor(private store: Store<State>) {
        this.spin = this.store.select(selectors.loading);
    }

    ngOnInit() {
        this.store.dispatch(new Load());
    }
}
