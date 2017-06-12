import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'app-new-feed-form',
	templateUrl: './add-feed-button.html',
	styleUrls: ['./add-feed-button.css']
})
export class NewFeedFormComponent {
	constructor(private dialogRef: MdDialogRef<NewFeedFormComponent>) {}

	onSubmit(form: NgForm) {
		const {feedUrl} = form.value;
		this.dialogRef.close(feedUrl);
	}
}

@Component({
	selector: 'app-add-feed-button',
	template: `
		<button md-raised-button (click)="openDialog()">Add a subscription</button>
		<button md-raised-button (click)="doPullAll()">Pull all 
			<span *ngIf="progress && process !== '100%'">({{progress}})</span></button>
	`
})
export class AddFeedButtonComponent {

	@Output() feedUrl = new EventEmitter<string>();
	@Output() pullAll = new EventEmitter<void>();
	@Input() progress;

	constructor(public dialog: MdDialog) {}

	doPullAll() {
		this.pullAll.emit();
	}

	openDialog() {
		const config = {data: 123};
		const ref = this.dialog.open(NewFeedFormComponent, config);
		ref.afterClosed().subscribe(url => this.feedUrl.emit(url));
	}
}


