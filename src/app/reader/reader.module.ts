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
import {BrowserComponent} from './ui/browser/browser.component';
import {FeedResolverService} from './services/feed-resolver.service';
import {ReaderService} from './services/reader.service';
import {FeedService} from './services/feed.service';
import {StorageService} from './services/storage.service';
import {EncodeUrlPipe} from '../pipes/encode-url';
import {ReadingPaneComponent} from './ui/reading-pane/reading-pane.component';
import {StoreModule} from '@ngrx/store';
import {readerReducer} from '../store/index';
import {EffectsModule} from '@ngrx/effects';
import {LoadFeedEffect} from '../store/effects';


const routes = [
	{
		path: 'feeds/:id',
		component: ReadingPaneComponent,
		resolve: {
			feed: FeedResolverService
		}
	},

];

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		CommonModule,
		MaterialModule,
		FormsModule,
		EffectsModule.run(LoadFeedEffect),
		RouterModule.forRoot(routes),
		StoreModule.provideStore(readerReducer),
		BrowserAnimationsModule,
	],
	entryComponents: [NewFeedFormComponent],
	declarations: [
		LayoutComponent,
		FeedsComponent,
		FeedComponent,
		AddFeedButtonComponent,
		NewFeedFormComponent,
		FeedEntriesComponent,
		EntryComponent,
		PrettyDatePipe,
		ArticleComponent,
		ToolsComponent,
		BrowserComponent,
		EncodeUrlPipe,
		ReadingPaneComponent,
	],
	providers: [
		ReaderService,
		FeedService,
		StorageService,
		FeedResolverService
	]
})

export class ReaderModule {
}
