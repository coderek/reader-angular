import {Component, OnInit} from "@angular/core";
import {Entry} from "../models/entry";
import {Store} from "@ngrx/store";
import {State} from "../reducers/feed-list";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SelectFeedAction} from "../actions/feeds";

@Component({
    selector: 'reader-entries',
    template: `
      <feed-entry [entry]="entry"  *ngFor="let entry of entries | async" class="entry" [ngClass]="{'read': entry.read}"></feed-entry>
  `,
    styleUrls: ['./reading-pane.component.css']
})
export class ReadingPaneComponent implements OnInit {
    entries: Observable<Entry[]>;

    constructor(private store: Store<State>, private route: ActivatedRoute) {
        this.entries = this.store.select(s => s.entries);
    }

    ngOnInit() {
        this.route.params.subscribe(params=> {
            if (params['feed']) {
                let url = decodeURIComponent(params['feed']);
                if (url)
                    this.store.dispatch(new SelectFeedAction(url));
            }
        })
    }

    onPullFeed() {
    }
}
