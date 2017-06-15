import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
	selector: 'app-browser',
	templateUrl: './browser.component.html',
	styleUrls: ['./browser.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowserComponent implements OnChanges {
	@Input() sourceUrl: string;
	safeSourceUrl: SafeUrl = null;

	constructor(private sanitizer: DomSanitizer) {
	}

	ngOnChanges() {
		if (this.sourceUrl) {
			const url = 'http://localhost:8000' + encodeURIComponent(this.sourceUrl);
			this.safeSourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
		}
	}
}
