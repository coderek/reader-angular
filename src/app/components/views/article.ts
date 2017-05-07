import {Component, Input, HostListener, ElementRef, AfterViewInit} from "@angular/core";
import {State, selectors} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

@Component({
    selector: 'reader-article',
    template: `
        <article [innerHTML]="content" [ngStyle]="{'fontSize.em': (fontSize | async)}"> </article>`,
    styleUrls: ['entry.css'],
})
export class ArticleComponent implements AfterViewInit {
    @Input() entry;
    fontSize: Observable<number>;

    get content() {
        let entry = this.entry;
        if (entry.content.length > entry.summary.length) {
            return entry.content;
        } else {
            return entry.summary;
        }
    }

    constructor(private store: Store<State>, private el: ElementRef) {
        this.fontSize = store.select(selectors.fontSize);
    }

    ngAfterViewInit() {
        let sub = this.store.take(1).subscribe(
            s=> this.checkAndUpdateUrls(s),
        );
    }

    /**
     * Fix those links with relative url
     * @param state
     */
    checkAndUpdateUrls(state) {
        let feed = state.feeds.find(f=>f.url===this.entry.feed_url);
        if (feed) {
            let baseUrl = feed.link;
            if (!baseUrl) return;
            console.log(baseUrl);
            let el = this.el.nativeElement;
            let imgs = el.querySelectorAll('img');
            for (let img of imgs) {
                let url = img.attributes.src.value;

                if (url.startsWith('/')) {
                    img.src = baseUrl + url;
                }
            }
        }
    }
}
