import {Component, Input, OnChanges, OnInit, ChangeDetectorRef} from '@angular/core';
import {StorageService} from "../services/storage.service";
import {ReaderService} from "../services/reader.service";
import {List} from "immutable";

@Component({
    selector: 'app-reading-pane',
    template: `
    <header>{{feed == null ? "All feeds" : feed.title}}</header>

    <feed-toolbar [feed]="feed" (onPullFeed)="onPullFeed()"></feed-toolbar>

    <div *ngIf="entries.size" class="entries">
      <div *ngFor="let entry of entries" class="entry" [ngClass]="{'read': entry.read}">
        <div class="title">
          <md-icon (click)="toggleStarEntry(entry)">
            {{entry.star ? 'favorite' : 'favorite_bordered'}}
          </md-icon>
          <span (click)="toggleEntry(entry)" >{{entry.title}} |</span>
          <time>{{entry.published | prettyDate }}</time>
          <md-icon (click)="open(entry.url)">link</md-icon>
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

    constructor(private reader: ReaderService, private changeDetector: ChangeDetectorRef) {}

    onPullFeed() {
        this.changeDetector.detectChanges();
    }

    toggleStarEntry(entry) {
        entry.star = !entry.star;
        this.reader.saveEntry(entry);
    }

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
