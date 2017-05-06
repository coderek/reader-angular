import {NgModule} from "@angular/core";
import {MaterialModule} from "@angular/material";
import {MenuComponent, FeedItemView} from "./views/menu";
import {PrettyDatePipe} from "../pipes/pretty-date";
import {HashPipe} from "../pipes/hash";
import {ArticleComponent} from "./views/article";
import {ToolsComponent} from "./views/tools-bar";
import {ReaderService} from "../services/reader.service";
import {FeedService} from "../services/feed.service";
import {StorageService} from "../services/storage.service";
import {EntryComponent} from "./views/entry";
import {EncodeUrlPipe} from "../pipes/encode-url";
import {RouterModule} from "@angular/router";
import {EmptyPaneComponent} from "./views/empty-entries";
import {ReaderMainComponent} from "./containers/reader";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AddFeedButtonComponent, NewFeedFormComponent} from "./views/add-feed-button";
import {FormsModule} from "@angular/forms";
import {LoadFeedsEffects} from "../effects/load-feeds";
import {EffectsModule} from "@ngrx/effects";
import {EntryEffects} from "../effects/load-entries";
import {FeedEntriesComponent} from "./views/entries";
import {FavoriteEntriesComponent} from "./views/favorites";
import {routes} from "./routes";
import {UniqueFeedValidatorDirective} from "../validations/add-feed";

const COMPONENTS = [
    MenuComponent,
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
    FeedItemView,
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
        MenuComponent
    ],
    entryComponents: [NewFeedFormComponent],
    providers: [ReaderService, FeedService, StorageService]
})
export class ComponentsModule {
    constructor() {
        console.log(routes)
    }
}
