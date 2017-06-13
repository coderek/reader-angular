import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
	selector: 'app-article',
	styleUrls: ['./article.component.css'],
	template: `
		<article [innerHTML]="content" [ngStyle]="{'fontSize.em': (fontSize)}"></article>`,
})
export class ArticleComponent implements AfterViewInit {
	@Input() entry;
	@Input() fontSize: number;
	@Output() browseUrl = new EventEmitter<string>();

	@HostListener('click', ['$event.target'])
	onClickElement(ele) {
		if (ele.tagName === 'A') {
			console.log(this);
			this.browseUrl.emit(ele.href);
			return false;
		}
	}

	get content() {
		const entry = this.entry;
		entry.content = entry.content || '';
		entry.summary = entry.summary || '';
		if (entry.content.length > entry.summary.length) {
			return entry.content;
		} else {
			return entry.summary;
		}
	}

	constructor(private el: ElementRef) {
	}

	ngAfterViewInit() {
		// let sub = this.store.take(1).subscribe(
		// 	s => this.checkAndUpdateUrls(s),
		// );
	}

	/**
	 * Fix those links with relative url
	 * @param state
	 */
	checkAndUpdateUrls(state) {
		const feed = state.feeds.find(f => f.url === this.entry.feed_url);
		if (feed) {
			const baseUrl = feed.link;
			if (!baseUrl) {
				return;
			}
			const el = this.el.nativeElement;
			const imgs = el.querySelectorAll('img');
			for (const img of imgs) {
				const url = img.attributes.src.value;

				if (url.startsWith('/')) {
					img.src = baseUrl + url;
				}
			}
		}
	}
}
