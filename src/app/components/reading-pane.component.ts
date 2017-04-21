import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {StorageService} from "../services/storage.service";
import {ReaderService} from "../services/reader.service";
import {List} from "immutable";

@Component({
  selector: 'app-reading-pane',
  template: `
    <header>{{feed == null ? "All feeds" : feed.title}}</header>
    
    <feed-toolbar 
      [feed]="feed"></feed-toolbar>
    
    <div *ngIf="entries.size" class="entries">
      <div *ngFor="let entry of entries" (click)="toggleEntry(entry)" class="entry" [ngClass]="{'read': entry.read}">
        <div class="title">
          <md-icon style="font-size: 12px">favorite</md-icon>
          <span (click)="open(entry.url)">{{entry.title}}</span>
          <time>{{entry.published | prettyDate }}</time>
        </div>
        <article *ngIf="shouldShowEntry(entry)" [innerHTML]="getContent(entry)"></article>
      </div>
    </div>
    <div class="empty" *ngIf="entries.size===0">
      No feed is selected
    </div>
  `,
  styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent {

  @Input() feed;

  @Input()
  get entries() {
    if (this.feed == null) {
      this.entriesShown.clear();
      return List();
    } else {
      return this.reader.getEntriesForFeed(this.feed);
    }
  }
  entriesShown = new Set();

  constructor(private reader: ReaderService) {}

  open(url) {
    window.open(url, '_blank');
  }

  getContent(entry) {
    if (entry.content.length > entry.summary.length) {
      return entry.content;
    } else {
      return entry.summary;
    }
  }

  shouldShowEntry(entry) {
    return this.entriesShown.has(entry);
  }

  toggleEntry(entry) {
    if (!entry.read) {
      entry.read = true;
      this.reader.saveEntry(entry);
    }

    if (this.entriesShown.has(entry)) {
      this.entriesShown.delete(entry);
    } else {
      this.entriesShown.add(entry);
    }
  }

}
