import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter, Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import {Entry} from '../../../models/entry';
import {Feed} from '../../../models/feed';

@Component({
	selector: 'app-entries',
	templateUrl: './entries.component.html',
	styleUrls: ['./entries.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedEntriesComponent implements OnInit, OnChanges {
	@Input() feed: Feed;
	@Input() entries: Entry[];

	@Output() clickEntry = new EventEmitter<Entry>();
	@Output() browseUrl = new EventEmitter<string>();

	constructor(private ref: ElementRef) {
	}

	ngOnChanges(changes: SimpleChanges) {
		if ('feed' in changes) {
			this.ref.nativeElement.querySelector('.entries').scrollTop = 0;
		}
	}

	ngOnInit() {
	}
}
