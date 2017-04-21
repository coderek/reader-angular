import { Component, OnInit } from '@angular/core';
import {FeedService} from "../services/feed.service";
import {ReaderService} from "../services/reader.service";

@Component({
  selector: 'app-menu',
  template: `
    <button (click)="openDialog()">Add a subscription</button>
    <ul>
      <li>Home</li>
      <li>All items</li>
      <li>Shared items</li>
    </ul>
    <ul>
      <li><b>Subscriptions</b></li>
      <li *ngFor="let feed of feeds" (click)="openFeed(feed)">
        {{feed.title}}
      </li>
    </ul>
  `,
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  feeds = []

  constructor(private reader: ReaderService, private feedService: FeedService) { }

  ngOnInit() {
    // remove for production
    this.feedService.fetch("http://codingnow.com/atom.xml").subscribe(feed=> {
      this.feeds.push(feed);
      this.openFeed(feed)
    });
  }

  openFeed(feed) {
    this.reader.openFeed(feed);
  }

  openDialog() {
    let url = prompt("Feed url: ");
    if (url != null) {
      this.feedService.fetch(url).subscribe(feed=> {
        this.feeds.push(feed);
      });
    }
  }
}
