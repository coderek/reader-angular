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
      <li>Home</li>
      <li>All items</li>
      <li>Starred items</li>
    </ul>
    <ul>
      <li><b>Subscriptions</b></li>
      <li *ngFor="let feed of feeds | async" (click)="onOpenFeed(feed)">
        <div routerLink="/feeds/{{feed.url | hash}}" routerLinkActive="selected">{{feed.title}} ({{feed.unreadCount}})</div>
      </li>
    </ul>
  `,
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnChanges {
    @Input()
    title;

    feeds;

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
        this.router.navigate(['feeds', encodeURIComponent(feed.url)]);
    }

    openDialog() {
        let url = prompt("Feed url: ");
        if (url != null) {
            this.reader.addFeed(url);
        }
    }
    ngOnChanges() {
    }
}
