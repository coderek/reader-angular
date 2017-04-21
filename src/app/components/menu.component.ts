import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
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
      <li *ngFor="let feed of feeds" (click)="onOpenFeed(feed)" [ngClass]="{'selected': feed==selectedFeed}">
        {{feed.title}}
      </li>
    </ul>
  `,
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

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
