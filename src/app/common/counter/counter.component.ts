import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';

@Component({
	selector: 'app-counter',
	templateUrl: './counter.component.html',
	styleUrls: ['./counter.component.css'],
})
export class CounterComponent implements OnInit, OnChanges {
	@Input() from: number;
	@Input() to: number;

	cur = 0;

	lastUpdate = 0;
	stop = false;

	constructor(private ele: ElementRef) {
	}
	ngOnInit() {
	}

	pad(str) {
		return _.padEnd('(' + str + ')', 6, ' ');
	}


	update(t) {
		if (t - this.lastUpdate > 10) {
			this.cur++;
			// this.ele.nativeElement.textContent = this.pad(this.cur);
			this.lastUpdate = t;
		}
		if (this.cur < this.to && !this.stop) {
			this.from = this.to;
			requestAnimationFrame(this.update.bind(this));
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if ('from' in changes && this.cur === null) {
		}

		if ('to' in changes) {
			this.stop = true;
			setTimeout(() => {
				this.stop = false;
				this.update(0);
			}, 0);
		}
	}
}
