import {Component} from "@angular/core";
import {Store} from "@ngrx/store";
import {LoadEntriesAction} from "../../../reducers/entries";
import {SetPageTitleAction} from "../../../reducers/global";
import {FeedEntriesComponent} from "../entries/entries";
import {Router, ActivatedRoute} from "@angular/router";
import {State} from "app/reducers";

@Component({
    selector: 'reader-entries',
    template: `
        <feed-toolbar [newItemsCount]="newItemsCount" (onReadEntries)="onReadEntries($event)"></feed-toolbar>
        <feed-entry [entry]="entry" *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
    `,
    styleUrls: ['../feed-entries.css']
})
export class FavoriteEntriesComponent extends FeedEntriesComponent{
    constructor(protected store: Store<State>, protected route: ActivatedRoute, protected router: Router) {
        super(store, route, router);
        console.log('favorites');
    }

    ngOnInit() {
        super.ngOnInit.call(this);
        this.store.dispatch(new LoadEntriesAction('favorites'));
        this.store.dispatch(new SetPageTitleAction('Favorites'));
    }
}
