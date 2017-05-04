import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Feed} from "../../models/feed";
@Component({
    selector: 'feed-toolbar',
    template: `
      Show : {{newItemsCount}} new items - all items
      <button (click)="onReadAll()">Mark all as read</button>
      <button (click)="onPull()">Pull</button>
      <button (click)="onDelete()">Delete</button>
  `
})
export class ToolsComponent {
    @Input()
    newItemsCount;

    @Input()
    feedUrl: string;

    @Output()
    onPullFeed = new EventEmitter<string>();

    @Output()
    onReadEntries = new EventEmitter<string>();

    @Output()
    onDeleteFeed = new EventEmitter<string>();

    onDelete() {
        if (confirm(`Are you sure to delete`)) {
            this.onDeleteFeed.next(this.feedUrl);
        }
    }

    onPull() {
        this.onPullFeed.next(this.feedUrl);
    }

    onReadAll() {
        this.onReadEntries.next(this.feedUrl);
    }
}
