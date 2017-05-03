import {Component, Input} from "@angular/core";
import {Entry} from "../models/entry";
import {State} from "../reducers";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {ReaderService} from "../services/reader.service";
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

    constructor(private store: Store<State>, private reader: ReaderService) {
        // this.isOpen = store.switchMap(s => {
        // console.log(s.openedEntry === this.entry);
        // return Observable.of(s.openedEntry === this.entry);
        // });
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

    toggleStarEntry(entry) {
        entry.favorite = !entry.favorite;
        this.reader.saveEntry(entry);
    }
    toggleEntry(entry) {
        // this.store.dispatch(new ReadEntryAction(entry));
    }
}
