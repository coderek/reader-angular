import {
    Component,
    Input,
    OnChanges,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    OnDestroy
} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Feed} from "../models/feed";
import * as fromFeeds from "../reducers";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {ReaderService} from "../services/reader.service";

@Component({
    selector: 'feed-item',
    template: `
        <div (click)="link(feed)">{{feed.title}} ({{feed.unreadCount}}) <span *ngIf="feed.loading" class="spinner-text">loading...</span></div>
    `
})
export class FeedItemView {
    @Input() feed: Feed;

    constructor(private router: Router) {

    }

    link(feed) {
        this.router.navigate(['feeds', encodeURIComponent(feed.url)]);
    }
}




@Component({
    selector: 'app-menu',
    template: `    
    <header>
      <h1 routerLink="/">{{title}}</h1>
    </header>
    <add-feed-button></add-feed-button>
    <ul>
      <li routerLink="/feeds/favorites" routerLinkActive="selected" >Favorites</li>
    </ul>
    <ul class="feed-list">
      <li><b>Subscriptions</b></li>
      <li [ngClass]="{'selected': (selected | async) === feed.url}" *ngFor="let feed of feeds | async">
        <feed-item [feed]="feed"></feed-item>
      </li>
    </ul>
    <footer>
        <button (click)="pullAll()">Pull all</button>
    </footer>
  `,
    styleUrls: ['./menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnChanges, OnInit, OnDestroy {
    @Input()
    title;

    @Output()
    onNewFeed = new EventEmitter<string>();

    feeds: Observable<Feed[]>;
    selected: Observable<string>;

    currentFeeds: Feed[] = [];
    currentFeedsSubscription: Subscription;

    constructor(private store: Store<fromFeeds.State>, private router: Router, private reader: ReaderService) {
        this.feeds = store.select(s => s.feeds);
        this.selected = store.select(s => s.selected);
        this.currentFeedsSubscription = this.feeds.subscribe(feeds => {
            this.currentFeeds = feeds;
        })
    }


    openDialog() {
        let url = prompt("Feed url: ");
        if (url != null) {
            this.onNewFeed.next(url);
        }
    }

    pullAll() {
        this.currentFeeds.forEach((feed: Feed) => {
        })
    }
    ngOnInit() {
    }
    ngOnChanges() {
    }

    ngOnDestroy() {
        this.currentFeedsSubscription.unsubscribe();
    }
}
