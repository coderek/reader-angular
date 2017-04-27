import {Component, Input, OnChanges} from "@angular/core";
import {ReaderService} from "../services/reader.service";

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
      <li *ngFor="let feed of feeds" (click)="onOpenFeed(feed)">
        <div routerLink="/feeds/{{feed.url | hash}}" routerLinkActive="selected">{{feed.title}} ({{feed.unreadCount}})</div>
      </li>
    </ul>
  `,
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {
    @Input()
    title;

    @Input()
    feeds;

    @Input()
    selectedFeed;

    constructor(private reader: ReaderService) {}
    onOpenFeed(feed) {
        this.reader.openFeed(feed);
    }

    openDialog() {
        let url = prompt("Feed url: ");
        if (url != null) {
            this.reader.addFeed(url);
        }
    }
}
