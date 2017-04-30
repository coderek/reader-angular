import {Component, Input, OnChanges, OnInit, ChangeDetectorRef} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-menu',
    template: `    
    <header>
      <h1 routerLink="/">{{title}}</h1>
    </header>
    <button (click)="openDialog()">Add a subscription</button>
    <ul>
      <li (click)="openFavorite()" [ngClass]="{'selected': selectedFeedUrl === 'favorites'}" >Favorites</li>
    </ul>
    <ul>
      <li><b>Subscriptions</b></li>
      <li [ngClass]="{'selected': selectedFeedUrl === feed.url}" *ngFor="let feed of feeds | async" (click)="onOpenFeed(feed)">
        <div>{{feed.title}} ({{feed.unreadCount}})</div>
      </li>
    </ul>
  `,
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnChanges, OnInit {
    @Input()
    title;

    feeds;

    selectedFeedUrl: string;

    constructor(
        private reader: ReaderService,
        private route: ActivatedRoute,
        private router: Router,
        private changeDetector: ChangeDetectorRef
    ) {
        this.feeds = this.reader.feeds;
        this.reader.updateFeeds();
    }

    onOpenFeed(feed) {
        this.router.navigate(['feeds', {id: encodeURIComponent(feed.url)}]);
    }
    openFavorite() {
        this.router.navigate(['feeds', {favorites: '1'}]);
    }

    openDialog() {
        let url = prompt("Feed url: ");
        if (url != null) {
            this.reader.addFeed(url);
        }
    }

    ngOnInit() {
        this.route.params.subscribe(params=> {
            if (params['favorites']) {
                this.selectedFeedUrl = 'favorites';
            }
            else if (params['id']) {
                this.selectedFeedUrl = decodeURIComponent(params['id']);
            }
        });
    }
    ngOnChanges() {
    }
}
