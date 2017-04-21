import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ReaderService} from "../services/reader.service";
@Component({
  selector: 'feed-toolbar',
  template: `
      Show : 0 new items - all items
      <button (click)="onReadAll(feed)">Mark all as read</button>
      <button (click)="onRefresh(feed)">Refresh</button>
      <button (click)="onDelete(feed)">Delete</button>
  `
})
export class ToolsComponent {

  @Input()
  feed;

  constructor(private reader: ReaderService) {}

  onDelete(feed) {this.reader.deleteFeed(feed);}
  onRefresh(feed) {}
  onReadAll(feed) {this.reader.markAllRead(feed);}
}
