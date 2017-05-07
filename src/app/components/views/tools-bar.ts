import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Feed} from "../../models/feed";
import {IncreaseFontSizeAction, DecreaseFontSizeAction} from "../../reducers/global";
import {Store} from "@ngrx/store";
import {State} from "../../reducers/index";
@Component({
    selector: 'feed-toolbar',
    template: `
        Show : {{newItemsCount}} new items - all items
        <button (click)="onReadAll()">Mark all as read</button>
         <button *ngIf="feed" (click)="onPull()">Pull</button>
        <button *ngIf="feed" (click)="onDelete()">Delete</button>
        <button (click)="increaseFontSize()">+</button>
        <button (click)="decreaseFontSize()">-</button>
    `
})
export class ToolsComponent {
    @Input()
    newItemsCount;

    @Input()
    feed: Feed;

    @Output()
    onPullFeed = new EventEmitter<string>();

    @Output()
    onReadEntries = new EventEmitter<string>();

    @Output()
    onDeleteFeed = new EventEmitter<string>();

    constructor(private store: Store<State>) {

    }

    increaseFontSize() {
        this.store.dispatch(new IncreaseFontSizeAction());
    }
    decreaseFontSize() {
        this.store.dispatch(new DecreaseFontSizeAction());

    }

    onDelete() {
        if (confirm(`Are you sure to delete`)) {
            this.onDeleteFeed.next(this.feed.url);
        }
    }

    onPull() {
        this.onPullFeed.next(this.feed.url);
    }

    onReadAll() {
        this.onReadEntries.next(this.feed.url);
    }
}
