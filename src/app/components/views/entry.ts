import {Component, Input} from "@angular/core";
import {Entry} from "../../models/entry";
import {Store} from "@ngrx/store";
import {Router, ActivatedRoute} from "@angular/router";
import {Favorite} from "../../reducers/entry";
import {State, selectors} from "../../reducers/index";
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
        <article *ngIf="obIsOpen | async" [innerHTML]="getContent(entry)"></article>
    `,
    selector: 'feed-entry',
    styleUrls: ['entry.css']
})
export class EntryComponent {
    @Input() entry: Entry;
    obIsOpen: Observable<boolean>;

    constructor(private store: Store<State>, private route: ActivatedRoute, private router: Router) {
        this.obIsOpen = this.store.select(selectors.selectedEntry).map(entryUrl=> entryUrl===this.entry.url);
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
        this.store.dispatch(new Favorite(entry));
    }

    toggleEntry(entry) {
        let isOpen = decodeURIComponent(this.route.snapshot.params['open']) === this.entry.url;
        let open = isOpen ? null : encodeURIComponent(entry.url);
        this.router.navigate(
            ['feeds', encodeURIComponent(entry.feed_url), {open}]);
    }
}
