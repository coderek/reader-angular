import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './ui/layout/layout.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {FeedsComponent} from './ui/feeds/feeds.component';
import {AddFeedButtonComponent, NewFeedFormComponent} from './ui/feeds/add-feed-button/add-feed-button';
import {RouterModule} from '@angular/router';
import {FeedComponent} from './ui/feeds/feed/feed.component';
import {FeedEntriesComponent} from './ui/entries/entries.component';
import {EntryComponent} from './ui/entries/entry/entry.component';
import {PrettyDatePipe} from '../pipes/pretty-date';
import {ArticleComponent} from './ui/entries/entry/article/article.component';
import {ToolsComponent} from './ui/toolbar/toolbar.component';


@Component({
	selector: 'app-empty',
	template: '',
})
class EmptyComponent {}

const routes = [
	{
		path: '',
		component: EmptyComponent
	}
];


@NgModule({
	imports: [
		CommonModule,
		BrowserModule,

		CommonModule,
		MaterialModule,
		FormsModule,
		RouterModule.forRoot(routes),
		BrowserAnimationsModule,
	],
	entryComponents: [NewFeedFormComponent],
	declarations: [
		LayoutComponent,
		FeedsComponent,
		FeedComponent,
		AddFeedButtonComponent,
		NewFeedFormComponent,
		EmptyComponent,
		FeedEntriesComponent,
		EntryComponent,
		PrettyDatePipe,
		ArticleComponent,
		ToolsComponent,
	],

})

export class ReaderModule {
}
