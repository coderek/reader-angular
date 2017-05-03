import {Component, Input} from "@angular/core";
import {Entry} from "../models/entry";
import {State} from "../reducers";
import {Store} from "@ngrx/store";
import {ReaderService} from "../services/reader.service";
import {Router} from "@angular/router";
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
        <article *ngIf="isOpen" [innerHTML]="getContent(entry)"></article>
`,
    selector: 'feed-entry',
    styleUrls: ['./entry.css']
})
export class EntryComponent {
    @Input() entry: Entry;
    @Input() isOpen;

    constructor(private store: Store<State>, private reader: ReaderService, private router: Router) {
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
        if (entry.read === false) {
            entry.read = true;
        }
        this.router.navigate(
            ['feeds',
                encodeURIComponent(entry.feed_url),
                {open: this.isOpen ? null : encodeURIComponent(entry.url)}]);
    }
}
