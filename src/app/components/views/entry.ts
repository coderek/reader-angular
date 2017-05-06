import {Component, Input, OnInit, OnChanges} from "@angular/core";
import {Entry} from "../../models/entry";
import {Store} from "@ngrx/store";
import {Router, ActivatedRoute} from "@angular/router";
import {ToggleFavoriteAction, ReadEntryAction} from "../../reducers/entry";
import {State, EntityPayload} from "../../reducers/index";
import {Observable} from "rxjs";
@Component({
    template: `
        <div>
          <md-icon (click)="toggleStarEntry(entry)">
            {{entry.favorite ? 'favorite' : 'favorite_bordered'}}
          </md-icon>
          <span class="title" (click)="toggleEntry(entry)" [ngClass]="{'read': entry.read}">
              {{entry.title}} | <time>{{entry.published | prettyDate }}</time>
          </span>
          <md-icon (click)="open(entry.url)">link</md-icon>
        </div>
        <article [hidden]="!opened" [innerHTML]="content"></article>
    `,
    selector: 'feed-entry',
    styleUrls: ['entry.css']
})
export class EntryComponent implements OnInit, OnChanges {
    @Input() entry: Entry;
    @Input() opened: boolean;

    constructor(private store: Store<State>, private router: Router) {}

    get content() {
        let entry = this.entry;
        if (entry.content.length > entry.summary.length) {
            return entry.content;
        } else {
            return entry.summary;
        }
    }

    ngOnInit() {}

    ngOnChanges() {
        if (this.opened && !this.entry.read) {
            this.store.dispatch(new ReadEntryAction({id: this.entry.url}));
        }
    }

    /**
     * Open in new window
     * @param url
     */
    open(url) {
        window.open(url, '_blank');
    }

    /**
     * Send action
     * @param entry
     */
    toggleStarEntry(entry) {
        let payload: EntityPayload = {
            id: entry.url,
            value: !entry.favorite
        };
        this.store.dispatch(new ToggleFavoriteAction(payload));
    }

    /**
     * use router to transfer the selected entry to the global state
     * @param entry
     */
    toggleEntry(entry) {
        let path = decodeURIComponent(entry.feed_url);
        if (this.opened) {
            this.router.navigate(['feeds', path]);
        } else {
            this.router.navigate(['feeds', path, {open: encodeURIComponent(this.entry.url)}]);
        }
    }
}
