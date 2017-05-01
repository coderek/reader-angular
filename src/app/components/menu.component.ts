import {Component, Input, OnChanges, OnInit, Output, EventEmitter, ChangeDetectionStrategy} from "@angular/core";
import {Observable} from "rxjs";
import {Feed} from "../models/feed";
import * as fromFeeds from "../reducers";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";

@Component({
    selector: 'app-menu',
    template: `    
    <header>
      <h1 routerLink="/">{{title}}</h1>
    </header>
    <button (click)="openDialog()">Add a subscription</button>
    <ul>
      <li (click)="openFavorite()" [ngClass]="{'selected': selected === 'favorites'}" >Favorites</li>
    </ul>
    <ul>
      <li><b>Subscriptions</b></li>
      <li [ngClass]="{'selected': (selected | async) === feed.url}" *ngFor="let feed of feeds | async">
        <div (click)="link(feed)">{{feed.title}} ({{feed.unreadCount}})</div>
      </li>
    </ul>
  `,
    styleUrls: ['./menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnChanges, OnInit {
    @Input()
    title;

    @Output()
    onNewFeed = new EventEmitter<string>();

    feeds: Observable<Feed[]>;
    selected: Observable<string>;

    constructor(private store: Store<fromFeeds.State>, private router: Router) {
        this.feeds = store.select(s => s.feeds);
        this.selected = store.select(s => s.selected);
    }

    link(feed) {
        this.router.navigate(['feeds', encodeURIComponent(feed.url)]);
    }

    openFavorite() {
        // this.router.navigate(['feeds', {favorites: '1'}]);
    }

    openDialog() {
        let url = prompt("Feed url: ");
        if (url != null) {
            this.onNewFeed.next(url);
        }
    }

    ngOnInit() {
    }
    ngOnChanges() {
    }
}
