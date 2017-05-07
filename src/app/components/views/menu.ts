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
import {Feed} from "../../models/feed";
import * as fromFeeds from "../../reducers";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {ReaderService} from "../../services/reader.service";

@Component({
    selector: 'feed-item',
    template: `
        {{feed.title}} (<span class="count">{{feed.unreadCount}}</span>) <img *ngIf='feed.loading' src="/assets/loading-spinning-bubbles.svg" width='10' height='10'>
    `,
    styles: [`
        .count {color: red;}    
    `]
})
export class FeedItemView {
    @Input() feed: Feed;
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
      <li routerLinkActive="selected" *ngFor="let feed of feeds | async" [routerLink]="['feeds', feed.url]">
        <feed-item [feed]="feed"></feed-item>
      </li>
    </ul>
    <footer>
        <button (click)="pullAll()">Pull all</button>
    </footer>
  `,
    styleUrls: ['menu.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    @Input()
    title;

    @Output()
    onNewFeed = new EventEmitter<string>();
    feeds: Observable<Feed[]>;

    constructor(private store: Store<fromFeeds.State>) {
        this.feeds = store.select(s => s.feeds).map(feeds=> feeds.sort((a,b)=> a.title<b.title?-1:1));
    }

    openDialog() {
        let url = prompt("Feed url: ");
        if (url != null) {
            this.onNewFeed.next(url);
        }
    }
    pullAll() {}
}
