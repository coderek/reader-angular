import {Component} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';


@Component({
	selector: 'app-new-feed-form',
	templateUrl: './add-feed-button.html',
	styleUrls: ['./add-feed-button.css']
})
export class NewFeedFormComponent {
	constructor(private dialogRef: MdDialogRef<NewFeedFormComponent>) {
	}

	onSubmit(form: NgForm) {
		const {feedUrl} = form.value;
		// this.store.dispatch(new AddFeedAction(feedUrl));
		this.dialogRef.close();
	}
}

@Component({
	selector: 'app-add-feed-button',
	template: `
		<button md-raised-button (click)="openDialog()">Add a subscription</button>
	`
})
export class AddFeedButtonComponent {
	// @Input()

	constructor(public dialog: MdDialog) {
	}

	openDialog() {
		const config = {data: 123};
		this.dialog.open(NewFeedFormComponent, config);
	}
}


