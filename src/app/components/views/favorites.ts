import {Component, OnInit} from "@angular/core";
import {Entry} from "../../models/entry";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {ReaderService} from "../../services/reader.service";
import {State} from "../../reducers/index";
import {ActivatedRoute} from "@angular/router";
import {LoadFavorites} from "../../reducers/entries";

@Component({
    selector: 'reader-entries',
    template: `<feed-entry [entry]="entry" *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
    `,
    styleUrls: ['favorites.css']
})
export class FavoriteEntriesComponent implements OnInit {
    entries: Observable<Entry[]>;
    showingFeed = null;
    openEntry = null;

    constructor(private route: ActivatedRoute, private reader: ReaderService, private store: Store<State>) {
        this.entries = this.store.select(s => s.entries);
    }

    ngOnInit() {
        this.store.dispatch(new LoadFavorites());
    }
}
