import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Feed} from "../models/feed";
@Component({
    selector: 'feed-toolbar',
    template: `
      Show : {{newItemsCount}} new items - all items
      <button (click)="onReadAll()">Mark all as read</button>
      <button (click)="onPull()">Refresh</button>
      <button (click)="onDelete()">Delete</button>
  `
})
export class ToolsComponent {
    @Input()
    newItemsCount;

    @Input()
    feed: Feed;

    @Output()
    onPullFeed = new EventEmitter<Feed>();

    @Output()
    onReadEntries = new EventEmitter<Feed>();

    @Output()
    onDeleteFeed = new EventEmitter<Feed>();

    onDelete() {
        if (confirm(`Are you sure to delete ${this.feed.title}`)) {
            this.onDeleteFeed.next(this.feed);
        }
    }

    onPull() {
        this.onPullFeed.next(this.feed);
    }

    onReadAll() {
        this.onReadEntries.next(this.feed);
    }
}
