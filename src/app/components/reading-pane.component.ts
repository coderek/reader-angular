import {Component, Input, ChangeDetectorRef, OnChanges} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {List} from "immutable";

@Component({
    selector: 'app-reading-pane',
    template: `
    <header>{{feed == null ? "All feeds" : feed.title}}</header>

    <feed-toolbar [feed]="feed" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed()" (onReadEntries)="onReadEntries()"></feed-toolbar>

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
export class ReadingPaneComponent implements OnChanges {

    @Input() feed: Feed;

    @Input() entries: List<Entry>;

    newItemsCount = 0;
    entriesShown = new Set();

    constructor(private reader: ReaderService, private changeDetector: ChangeDetectorRef) {
    }

    onPullFeed() {
        this.changeDetector.detectChanges();
        this.updateNewItemsCount();
    }

    updateNewItemsCount() {
        this.reader.getNewItemsCount(this.feed).then(count => this.newItemsCount = count);
    }

    onReadEntries() {
        let entries = this.entries.toJS();
        entries.forEach(e => e.read = true);
        this.reader.markAllRead(entries);
    }

    ngOnChanges() {
        setTimeout(()=> {
            this.updateNewItemsCount();
        }, 0)
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
