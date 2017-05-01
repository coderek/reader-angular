import {Component, Input} from "@angular/core";
import {Entry} from "../models/entry";
import {State} from "../reducers/feed-list";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {OpenEntryAction} from "../actions/entry";
@Component({
    template: `
        <div>
          <md-icon (click)="toggleStarEntry(entry)">
            {{entry.favorite ? 'favorite' : 'favorite_bordered'}}
          </md-icon>
          <span class="title" (click)="toggleEntry(entry)" >
              {{entry.title}} | <time>{{entry.published | prettyDate }}</time>
          </span>
          <md-icon (click)="open(entry.url)">link</md-icon>
        </div>
        <article *ngIf="isOpen | async" [innerHTML]="getContent(entry)"></article>
`,
    selector: 'feed-entry',
    styleUrls: ['./entry.css']
})
export class EntryComponent {
    @Input() entry: Entry;
    isOpen: Observable<boolean>;

    constructor(private store: Store<State>) {
        this.isOpen = store.switchMap(s => {
            console.log(s.openedEntry === this.entry);
            return Observable.of(s.openedEntry === this.entry);
        });
    }

    getContent(entry) {
        if (entry.content.length > entry.summary.length) {
            return entry.content;
        } else {
            return entry.summary;
        }
    }

    open(url) {
        window.open(url, '_blank');
    }

    toggleEntry(entry) {
        this.store.dispatch(new OpenEntryAction(entry));
    }
}
