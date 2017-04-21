import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {SafeHtml} from '@angular/platform-browser'
import {Feed} from "../models/feed";

@Component({
  selector: 'app-reading-pane',
  template: `
    <header>{{feed==null? "": feed.title}}</header>
    <div class="reading-area">
      <div class="tools">
        Show : 0 new items - all items
        <button>Mark all as read</button>
        <button>Refresh</button>
      </div>
      <ul class="entries" *ngIf="feed!=null">
        <li *ngFor="let entry of feed.entries" (click)="toggleEntry(entry)">
          <a href="{{entry.url}}" target="_blank">{{entry.title}}</a>
          <article *ngIf="showEntry(entry)" [innerHTML]="getContent(entry)"></article>
        </li>
      </ul>
      <div class="empty" *ngIf="feed==null">
        No feed is selected
      </div>
    </div>
  `,
  styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent implements OnInit {

  @Input() feed: Feed;

  entriesShown = new Set();


  constructor() { }

  ngOnInit() {
  }

  getContent(entry) {
    if (entry.content.length > entry.summary.length) {
      return entry.content;
    } else {
      return entry.summary;
    }
  }

  showEntry(entry) {
    return this.entriesShown.has(entry);
  }

  toggleEntry(entry) {
    if (this.entriesShown.has(entry)) {
      this.entriesShown.delete(entry);
    } else {
      this.entriesShown.add(entry);
    }
  }

}
