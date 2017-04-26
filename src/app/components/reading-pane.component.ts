import {Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {Router} from "@angular/router";

@Component({
    selector: 'app-reading-pane',
    template: `
    <header>{{feed == null ? "All feeds" : feed.title}}</header>

    <feed-toolbar [feed]="feed" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed()" (onReadEntries)="onReadEntries()"></feed-toolbar>

    <div *ngIf="entries.length" class="entries">
      <div *ngFor="let entry of entries" class="entry" [ngClass]="{'read': entry.read}">
        <div class="title">
          <md-icon (click)="toggleStarEntry(entry)">
            {{entry.star ? 'favorite' : 'favorite_bordered'}}
          </md-icon>
          <span (click)="toggleEntry(entry)" >{{entry.title}} |</span>
          <time>{{entry.published | prettyDate }}</time>
          <md-icon (click)="open(entry.url)">link</md-icon>
        </div>
        <article *ngIf="entryShown === entry" [innerHTML]="getContent(entry)"></article>
      </div>
    </div>
    <div class="empty" *ngIf="entries.length===0">
      No feed is selected
    </div>
  `,
    styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent implements OnChanges {

    @Input()
    feed: Feed = null;

    @Input()
    entries: Entry[] = [];

    newItemsCount = 0;

    @Input()
    entryShown: Entry = null;

    constructor(
        private router: Router,
        private reader: ReaderService,
        private changeDetector: ChangeDetectorRef) {
        this.updateNewItemsCount();
    }

    onPullFeed() {
        this.changeDetector.detectChanges();
        this.updateNewItemsCount();
    }

    updateNewItemsCount() {
        this.reader.getNewItemsCount(this.feed).then(count => this.newItemsCount = count);
    }

    onReadEntries() {
        let entries = this.entries;
        entries.forEach(e => e.read = true);
        this.reader.markAllRead(entries);
    }

    ngOnChanges(changes: SimpleChanges) {
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

    toggleEntry(entry) {
        if (!entry.read) {
            entry.read = true;
            this.reader.saveEntry(entry).then(()=>this.updateNewItemsCount());
        }

        if (this.entryShown === entry) {
            this.router.navigate(['/feeds', encodeURIComponent(this.feed.url)]);
        } else {
            this.router.navigate(['/feeds', encodeURIComponent(this.feed.url), encodeURIComponent(entry.url)]);
        }
    }
}
