import {Component, Input} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ReaderState} from '../../../../redux/index';
import {PULL_ALL_FEEDS, PULL_NEW_FEED} from '../../../../redux/consts';

@Component({
	selector: 'app-new-feed-form',
	templateUrl: './buttons.html',
	styleUrls: ['./buttons.css']
})
export class NewFeedFormComponent {
	constructor(private dialogRef: MdDialogRef<NewFeedFormComponent>) {}

	onSubmit(form: NgForm) {
		const {feedUrl} = form.value;
		this.dialogRef.close(feedUrl);
	}
}

@Component({
	selector: 'app-buttons',
	template: `
		<button md-raised-button (click)="openDialog()">Add a subscription</button>
		<button md-raised-button (click)="doPullAll()">Pull all 
			<span *ngIf="progress && process !== '100%'">({{progress}})</span></button>
		<button md-raised-button (click)="export">Export (todo)</button>
	`
})
export class AddFeedButtonComponent {

	@Input() progress;

	constructor(private store: Store<ReaderState>, public dialog: MdDialog) {}

	doPullAll() {
		this.store.dispatch({type: PULL_ALL_FEEDS});
	}

	export() {}

	openDialog() {
		const config = {data: 123};
		const ref = this.dialog.open(NewFeedFormComponent, config);
		ref.afterClosed().subscribe(url =>
			this.store.dispatch({type: PULL_NEW_FEED, payload: url})
		);
	}
}


