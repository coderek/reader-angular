import {HostListener, OnDestroy, AfterViewInit, ElementRef, OnChanges, Component, Input} from '@angular/core';
import {MdInputContainer, MdDialog, MdDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ChangeFilterAction} from '../../../../redux/actions';
import {PULL_ALL_FEEDS, PULL_NEW_FEED} from '../../../../redux/consts';
import {ReaderState} from '../../../../redux/state';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/distinctUntilChanged';

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
		<div [hidden]="hide">
			<md-input-container style="background-color: #eee;width: 100%;">
				<input mdInput id="filter">
			</md-input-container>
		</div>
		<div>
			<button md-raised-button (click)="openDialog()">Add a subscription</button>
			<button md-raised-button (click)="doPullAll()">Pull all</button>
			<button md-raised-button (click)="export">Export (todo)</button>
		</div>
	`
})
export class AddFeedButtonComponent implements OnChanges, AfterViewInit {

	@Input() progress;
	filter$;
	hide = true;

	constructor(private store: Store<ReaderState>, public dialog: MdDialog, private ref: ElementRef) {
	}

	@HostListener('mouseenter') mouseenter() {
		this.hide = false;
	}
	@HostListener('mouseleave') mouseleave() {
		this.hide = true;
	}

	doPullAll() {
		this.store.dispatch({type: PULL_ALL_FEEDS});
	}

	ngOnChanges(changes) {
	}

	ngAfterViewInit() {
		const filterInput = this.ref.nativeElement.querySelector('#filter');
		this.filter$ = Observable.fromEvent(filterInput, 'keyup')
			.debounce(_ => Observable.interval(500))
			.distinctUntilChanged()
			.subscribe(this.onFilterChanged.bind(this));
	}

	onFilterChanged(ev) {
		const el = ev.target;
		this.store.dispatch(new ChangeFilterAction(el.value as string));
	}

	ngOnDestroy() {
		this.filter$.unsubscribe();
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


