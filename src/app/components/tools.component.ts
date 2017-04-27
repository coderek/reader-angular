import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ReaderService} from "../services/reader.service";
@Component({
    selector: 'feed-toolbar',
    template: `
      Show : {{newItemsCount}} new items - all items
      <button (click)="onReadAll(feed)">Mark all as read</button>
      <button (click)="onPull(feed)">Refresh</button>
      <button (click)="onDelete(feed)">Delete</button>
  `
})
export class ToolsComponent {

    @Input()
    feed;

    @Input()
    newItemsCount;

    @Output()
    onPullFeed = new EventEmitter<void>();

    @Output()
    onReadEntries = new EventEmitter<void>();

    @Output()
    onDeleteFeed = new EventEmitter<void>();

    constructor(private reader: ReaderService) {
    }

    onDelete(feed) {
        if (confirm(`Are you sure to delete ${feed.title}`)) {
            this.reader.deleteFeed(feed);
        }
        this.onDeleteFeed.next();
    }

    onPull(feed) {
        this.reader.pullFeed(feed).then(() => this.onPullFeed.next())
    }

    onReadAll() {
        this.onReadEntries.next();
    }
}
