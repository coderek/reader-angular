import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Delete} from "../../../reducers/feeds";
import {PullAction, UpdateUnreadAction} from "../../../reducers/feed";
import {Entry} from "../../../models/entry";
import {Observable} from "rxjs";
import {SelectFeedAction, SelectEntryAction, SetPageTitleAction} from "../../../reducers/global";
import {Feed} from "../../../models/feed";
import {LoadEntriesAction, ReadAllEntriesAction} from "../../../reducers/entries";
import {selectors, State} from "../../../reducers/index";

@Component({
    selector: 'feed-entries',
    template: `
        <feed-toolbar [feed]="feed | async" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed($event)" (onReadEntries)="onReadEntries($event)" (onDeleteFeed)="onDeleteFeed($event)"></feed-toolbar>
        <div class="entries">
            <feed-entry [opened]="entry.url === (opened | async)" [entry]="entry" *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
        </div>
    `,
    styleUrls: ['../feed-entries.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedEntriesComponent implements OnInit{
    feed: Observable<Feed>;
    entries: Observable<Entry[]>;
    opened: Observable<string>;

    constructor(protected store: Store<State>, protected route: ActivatedRoute, protected router: Router) {
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
                this.store.dispatch(new LoadEntriesAction(url));
        });
        this.route.params.map(p => p['open'])
            .subscribe(val => {
                let url = decodeURIComponent(val);
                this.store.dispatch(new SelectEntryAction(url));
        });
    }

    onPullFeed(feedUrl: string) {
        this.store.dispatch(new PullAction({id: feedUrl}));
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
