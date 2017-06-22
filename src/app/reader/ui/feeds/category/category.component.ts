import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Feed} from '../../../../models/feed';

@Component({
	selector: 'app-category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit, OnChanges {
	@Input()
	category: string;
	@Input()
	feeds: Feed[];

	constructor() {
	}

	ngOnInit() {
	}

	ngOnChanges() {
	}

}
