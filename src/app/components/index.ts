import {NgModule} from "@angular/core";
import {MaterialModule} from "@angular/material";
import {ReadingPaneComponent} from "./reading-pane.component";
import {MenuComponent, FeedItemView} from "./menu.component";
import {PrettyDatePipe} from "../pipes/pretty-date";
import {HashPipe} from "../pipes/hash";
import {ArticleComponent} from "./article.component";
import {ToolsComponent} from "./tools.component";
import {ReaderService} from "../services/reader.service";
import {FeedService} from "../services/feed.service";
import {StorageService} from "../services/storage.service";
import {EntryComponent} from "./entry.component";
import {EncodeUrlPipe} from "../pipes/encode-url";
import {RouterModule} from "@angular/router";
import {EmptyPaneComponent} from "./empty.component";
import {ReaderMainComponent} from "./reader-main";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AddFeedButtonComponent, NewFeedFormComponent} from "./add-button.component";
import {FormsModule} from "@angular/forms";

const COMPONENTS = [
    MenuComponent,
    ReadingPaneComponent,
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
];

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterModule.forChild([
            {
                path: 'feeds',
                component: ReaderMainComponent,
                children: [
                    {
                        path: 'favorites',
                        component: ReadingPaneComponent,
                    },
                    {
                        path: ':feed',
                        component: ReadingPaneComponent,
                    },
                    {
                        path: '',
                        component: EmptyPaneComponent
                    }
                ]
            },

        ]),
    ],
    declarations: COMPONENTS,
    exports: [
        RouterModule,
        MenuComponent
    ],
    entryComponents: [NewFeedFormComponent],
    providers: [ReaderService, FeedService, StorageService]
})
export class ComponentsModule {
}
