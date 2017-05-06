import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {State as ReaderState, selectors} from "../../reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {Delete} from "../../reducers/feeds";
import {Pull, UpdateUnreadAction} from "../../reducers/feed";
import {Entry} from "../../models/entry";
import {Observable} from "rxjs";
import {SelectFeedAction, SelectEntryAction, SetPageTitleAction} from "../../reducers/global";
import {Feed} from "../../models/feed";
import {LoadEntries, ReadAllEntriesAction} from "../../reducers/entries";

@Component({
    selector: 'feed-entries',
    template: `
        <feed-toolbar [feed]="feed | async" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed($event)" (onReadEntries)="onReadEntries($event)" (onDeleteFeed)="onDeleteFeed($event)"></feed-toolbar>
        <feed-entry [opened]="entry.url === (opened | async)" [entry]="entry" *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
    `,
    styleUrls: ['feed-entries.css']
})
export class FeedEntriesComponent implements OnInit{
    feed: Observable<Feed>;
    entries: Observable<Entry[]>;
    opened: Observable<string>;

    constructor(protected store: Store<ReaderState>, protected route: ActivatedRoute, protected router: Router) {
        this.entries = this.store.select(s => s.entries);
        this.feed = this.store.select(s=> {
            return s.feeds.find(f=> f.url === s.globals.selectedFeed);
        }).distinctUntilChanged().do(f=> {
            if (f) this.store.dispatch(new SetPageTitleAction(f.title))
        });
        this.opened = this.store.select(selectors.selectedEntry);
        console.log('feed entries');
    }

    ngOnInit() {
        this.route.params
            .map(p => p['feed'])
            .filter(p=>p)
            .distinctUntilChanged().subscribe(val => {
                let url = decodeURIComponent(val);
                console.log(url);
                this.store.dispatch(new SelectFeedAction(url));
                this.store.dispatch(new LoadEntries(url));
        });
        this.route.params.map(p => p['open'])
            .subscribe(val => {
                let url = decodeURIComponent(val);
                this.store.dispatch(new SelectEntryAction(url));
        });
    }

    onPullFeed(feedUrl: string) {
        this.store.dispatch(new Pull(feedUrl));
    }

    onReadEntries(feedUrl: string) {
        this.store.dispatch(new ReadAllEntriesAction(feedUrl));
        this.store.dispatch(new UpdateUnreadAction({id: feedUrl, value: 0}));
    }

    onDeleteFeed(feedUrl: string) {
        this.store.dispatch(new Delete(feedUrl));
        this.router.navigate(['feeds']);
    }
}
