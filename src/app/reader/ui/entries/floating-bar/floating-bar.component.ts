import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-floating-bar',
	templateUrl: './floating-bar.component.html',
	styleUrls: ['./floating-bar.component.css']
})
export class FloatingBarComponent implements OnInit {

	@Output() closeEntry = new EventEmitter<void>();

	constructor() {
	}

	ngOnInit() {
	}

}
