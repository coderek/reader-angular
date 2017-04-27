import {Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-reading-pane',
    template: `
    <header>{{feed == null ? "All feeds" : feed.title}}</header>

    <feed-toolbar [feed]="feed" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed()" (onReadEntries)="onReadEntries()" (onDeleteFeed)="onDeleteFeed()"></feed-toolbar>

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
        <article *ngIf="entryUrlShown === entry.url" [innerHTML]="getContent(entry)"></article>
      </div>
    </div>
    <div class="empty" *ngIf="entries.length===0">
      No feed is selected
    </div>
  `,
    styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent implements OnChanges, OnInit {

    @Input()
    feed: Feed = null;

    entries: Entry[] = [];

    newItemsCount = 0;

    entryUrlShown: string = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private reader: ReaderService,
        private changeDetector: ChangeDetectorRef) {
        // this.updateNewItemsCount();
    }

    onPullFeed() {
        this.reader.getEntriesForFeed(this.feed).then(entries=> this.entries=entries);
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
    onDeleteFeed() {
        this.router.navigate(['feeds']);
    }

    toggleEntry(entry) {
        if (!entry.read) {
            entry.read = true;
            this.reader.saveEntry(entry).then(()=>this.updateNewItemsCount());
        }

        if (this.entryUrlShown === entry.url) {
            this.router.navigate(['feeds', encodeURIComponent(this.feed.url)]);
        } else {
            this.router.navigate(
                ['feeds', encodeURIComponent(this.feed.url),
                    {
                        eid: encodeURIComponent(entry.url)
                    }
                ]);
        }
    }

    ngOnInit() {
        this.route.params.subscribe(params=> {
            if (!params['id']) return;
            let feedUrl = decodeURIComponent(params['id']);
            console.log('feed url: ' + feedUrl)
            this.reader.getFeed(feedUrl).then(feed=>{
                this.feed=feed;
                this.reader.getEntriesForFeed(feed).then(entries=>this.entries = entries);
            });
            this.entryUrlShown = decodeURIComponent(params['eid']);
            if (!this.entryUrlShown) {
                this.entryUrlShown = null;
            }
        });
    }
}
