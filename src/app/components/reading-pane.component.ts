import {Component, OnInit} from "@angular/core";
import {Entry} from "../models/entry";
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {Observable} from "rxjs";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {SelectFeedAction, LoadFavoritesAction} from "../actions/feeds";
import {ReaderService} from "../services/reader.service";

@Component({
    selector: 'reader-entries',
    template: `
      <feed-entry [entry]="entry" *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
    `,
    styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent implements OnInit {
    entries: Observable<Entry[]>;

    constructor(private reader: ReaderService, private store: Store<State>, private route: ActivatedRoute) {
        this.entries = this.store.select(s => s.entries);
    }

    ngOnInit() {
        this.route.url.subscribe((urls: UrlSegment[]) => {
            if (urls.length > 0 && urls[0].path === 'favorites') {
                this.reader.getFavorites().then(entries => {
                    this.store.dispatch(new LoadFavoritesAction(entries));
                })
            }
        });
        this.route.params.subscribe(params=> {
            if (params['feed']) {
                let url = decodeURIComponent(params['feed']);
                if (url)
                    this.store.dispatch(new SelectFeedAction(url));
            }
        })
    }
}
