import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {State as ReaderState, SelectFeedAction, SelectEntryAction, selectors} from "../../reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {Delete} from "../../reducers/feeds";
import {Pull} from "../../reducers/feed";
import {Entry} from "../../models/entry";
import {Observable} from "rxjs";

@Component({
    selector: 'feed-entries',
    template: `
        <feed-toolbar [feedUrl]="feedUrl | async" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed($event)" (onReadEntries)="onReadEntries($event)" (onDeleteFeed)="onDeleteFeed($event)"></feed-toolbar>
        
        <feed-entry [entry]="entry" *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
    `,
    styleUrls: ['feed-entries.css']
})
export class FeedEntriesComponent implements OnInit{
    feedUrl: Observable<string>;
    entries: Observable<Entry[]>;

    constructor(private store: Store<ReaderState>, private route: ActivatedRoute, private router: Router) {
        this.feedUrl = this.store.select(selectors.selectedFeed);
        this.entries = this.store.select(s => s.entries);
    }

    ngOnInit() {
        this.route.params.map(p => decodeURIComponent(p['feed']))
            .distinctUntilChanged().subscribe(val => {
            this.store.dispatch(new SelectFeedAction(val));
        });
        this.route.params.filter(p => p['open']).map(p => decodeURIComponent(p['open'])).subscribe(val => {
            this.store.dispatch(new SelectEntryAction(val));
        });
    }

    onPullFeed(feedUrl: string) {
        this.store.dispatch(new Pull(feedUrl));
    }

    onReadEntries() {

    }

    onDeleteFeed(feedUrl: string) {
        this.store.dispatch(new Delete(feedUrl));
        this.router.navigate(['feeds']);
    }
}
