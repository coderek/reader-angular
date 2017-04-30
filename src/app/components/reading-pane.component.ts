import {Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {Feed} from "../models/feed";
import {Entry} from "../models/entry";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-reading-pane',
    template: `
    <header>{{title}}</header>

    <feed-toolbar [feed]="feed" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed()" (onReadEntries)="onReadEntries()" (onDeleteFeed)="onDeleteFeed()"></feed-toolbar>

    <div *ngIf="entries.length" class="entries">
      <div *ngFor="let entry of entries" class="entry" [ngClass]="{'read': entry.read}">
        <div class="title">
          <md-icon (click)="toggleStarEntry(entry)">
            {{entry.favorite ? 'favorite' : 'favorite_bordered'}}
          </md-icon>
          <span (click)="toggleEntry(entry)" >
              {{entry.title}} | <time>{{entry.published | prettyDate }}</time>
          </span>
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

    feed: Feed = null;

    entries: Entry[] = [];

    newItemsCount = 0;

    entryUrlShown: string = null;

    isFavorites: boolean = false;

    get title() {
        if (this.isFavorites) {
            return 'Favorites';
        } else {
            return this.feed == null ? "All feeds" : this.feed.title
        }
    }
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
        this.updateNewItemsCount();
    }

    toggleStarEntry(entry) {
        entry.favorite = !entry.favorite;
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
        this.feed = null;
        this.entries = [];
        this.router.navigate(['feeds', {}]);
    }

    toggleEntry(entry) {
        if (!entry.read) {
            entry.read = true;
            this.reader.saveEntry(entry).then(()=>this.updateNewItemsCount());
        }

        let eid = this.entryUrlShown === entry.url? undefined: encodeURIComponent(entry.url);
        if (this.isFavorites) {
            this.router.navigate(['feeds', {favorites: 1, eid: eid}]);
        } else {
            this.router.navigate(['feeds',
                {id: encodeURIComponent(this.feed.url), eid: eid}
            ]);
        }
    }

    ngOnInit() {
        this.route.params.subscribe(params=> {
            if (params['favorites']) {
                this.isFavorites = true;
                this.feed = null;
                this.reader.getFavorites().then(entries=>this.entries=entries);
            } else {
                this.isFavorites = false;
                if (!params['id']) return;
                let feedUrl = decodeURIComponent(params['id']);
                this.reader.getFeed(feedUrl).then(feed=>{
                    this.feed=feed;
                    this.reader.getEntriesForFeed(feed).then(entries=>this.entries = entries);
                });
            }
            if (params['eid']) {
                this.entryUrlShown = decodeURIComponent(params['eid']);
            } else {
                this.entryUrlShown = null;
            }

        });
    }
}
