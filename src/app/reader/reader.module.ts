import {FeedsFilterPipe} from '../feeds-filter.pipe';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './ui/layout/layout.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {FeedsComponent} from './ui/feeds/feeds/feeds.component';
import {AddFeedButtonComponent, NewFeedFormComponent} from './ui/feeds/buttons/buttons';
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
import {readerReducer, StateCache} from '../redux/index';
import {EffectsModule} from '@ngrx/effects';
import {EntryEffects, FeedEffects} from '../redux/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {HttpModule} from '@angular/http';
import {LoggingService} from '../src/app/util/logging.service';
import { CategoryComponent } from './ui/feeds/category/category.component';
import {FeedsContainerComponent} from './ui/feeds/feeds-container.component';
import { FloatingBarComponent } from './ui/entries/floating-bar/floating-bar.component';
import {CounterComponent} from '../common/counter/counter.component';
import {DomainGuard} from '../domain.guard';

const routes = [
	{
		path: '',
		canActivate: [DomainGuard],
		children: [
			{
				path: 'feeds/:id',
				component: ReadingPaneComponent,
			},
			{
				path: '',
				component: ReadingPaneComponent,
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		CommonModule,
		MaterialModule,
		HttpModule,
		FormsModule,
		SlimLoadingBarModule.forRoot(),
		EffectsModule.run(FeedEffects),
		EffectsModule.run(EntryEffects),
		RouterModule.forRoot(routes),
		StoreModule.provideStore(readerReducer),
		StoreDevtoolsModule.instrumentOnlyWithExtension({maxAge: 5}),
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
		CategoryComponent,
		CounterComponent,
		FeedsContainerComponent,
		FloatingBarComponent,
		FeedsFilterPipe,
	],
	providers: [
		ReaderService,
		FeedService,
		StorageService,
		FeedResolverService,
		StateCache,
		LoggingService,
		DomainGuard
	]
})

export class ReaderModule {
}
