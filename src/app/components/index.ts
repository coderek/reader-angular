import {NgModule} from "@angular/core";
import {MaterialModule} from "@angular/material";
import {FeedsComponent, FeedComponent} from "../reader/ui/feeds/feeds.component";
import {PrettyDatePipe} from "../pipes/pretty-date";
import {HashPipe} from "../pipes/hash";
import {ArticleComponent} from "../reader/ui/entries/entry/article/article.component";
import {ToolsComponent} from "../reader/ui/toolbar/toolbar.component";
import {ReaderService} from "../services/reader.service";
import {FeedService} from "../reader/services/feed.service";
import {StorageService} from "../reader/services/storage.service";
import {EntryComponent} from "../reader/ui/entries/entry/entry.component";
import {EncodeUrlPipe} from "../pipes/encode-url";
import {RouterModule} from "@angular/router";
import {EmptyPaneComponent} from "./views/empty-entries";
import {ReaderMainComponent} from "./containers/reader";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AddFeedButtonComponent, NewFeedFormComponent} from "../reader/ui/feeds/add-feed-button/add-feed-button";
import {FormsModule} from "@angular/forms";
import {LoadFeedsEffects} from "../effects/feeds";
import {EffectsModule} from "@ngrx/effects";
import {EntryEffects} from "../effects/entries";
import {FeedEntriesComponent} from "../reader/ui/entries/entries.component";
import {FavoriteEntriesComponent} from "./views/favorites/favorites";
import {routes} from "./routes";
import {UniqueFeedValidatorDirective} from "../validations/add-feed";

const COMPONENTS = [
    FeedsComponent,
    FavoriteEntriesComponent,
    PrettyDatePipe,
    HashPipe,
    ToolsComponent,
    ArticleComponent,
    EntryComponent,
    EncodeUrlPipe,
    EmptyPaneComponent,
    ReaderMainComponent,
    AddFeedButtonComponent,
    NewFeedFormComponent,
    FeedComponent,
    FeedEntriesComponent,
    UniqueFeedValidatorDirective,
];

@NgModule({
    declarations: COMPONENTS,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        EffectsModule.run(LoadFeedsEffects),
        EffectsModule.run(EntryEffects),
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
        FeedsComponent
    ],
    entryComponents: [NewFeedFormComponent],
    providers: [ReaderService, FeedService, StorageService]
})
export class ComponentsModule {
    constructor() {
        console.log(routes)
    }
}
