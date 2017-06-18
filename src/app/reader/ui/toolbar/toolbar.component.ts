import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Feed} from '../../../models/feed';

@Component({
	selector: 'app-feed-toolbar',
	styleUrls: ['./toolbar.component.css'],
	templateUrl: './toolbar.component.html'
})
export class ToolsComponent {
	@Input()
	feed: Feed;

	@Output() pull = new EventEmitter<Feed>();
	@Output() readAll= new EventEmitter<Feed>();
	@Output() delete = new EventEmitter<Feed>();
}
