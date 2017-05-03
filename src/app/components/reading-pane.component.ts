import {Component, OnInit} from "@angular/core";
import {Entry} from "../models/entry";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {Observable} from "rxjs";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {ReaderService} from "../services/reader.service";
import {LoadEntries, LoadFavorites} from "../actions/entries";

@Component({
    selector: 'reader-entries',
    template: `
        <feed-toolbar *ngIf="showingFeed" [feed]="feed | async" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed($event)" (onReadEntries)="onReadEntries($event)" (onDeleteFeed)="onDeleteFeed($event)"></feed-toolbar>
        
        <feed-entry [isOpen]="entry.url === openEntry" [entry]="entry" *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
    `,
    styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent implements OnInit {
    entries: Observable<Entry[]>;
    showingFeed = null;
    openEntry = null;

    constructor(private reader: ReaderService, private store: Store<State>, private route: ActivatedRoute) {
        this.entries = this.store.select(s => s.entries);
    }

    ngOnInit() {
        this.route.url.subscribe((urls: UrlSegment[]) => {
            if (urls.length > 0 && urls[0].path === 'favorites') {
                this.store.dispatch(new LoadFavorites());
                this.showingFeed = null;
            }
        });
        this.route.params.subscribe(params=> {
            if (params['feed']) {
                let url = decodeURIComponent(params['feed']);
                this.store.dispatch(new LoadEntries(url));
                this.showingFeed = url;
            }
            this.openEntry = decodeURIComponent(params['open']);
        })
    }
}
