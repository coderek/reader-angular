import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {ReaderComponent} from "./components/reader.component";
import {MenuComponent} from "./components/menu.component";
import {ReadingPaneComponent} from "./components/reading-pane.component";
import {FeedService} from "./services/feed.service";
import {StorageService} from "./services/storage.service";
import {ReaderService} from "./services/reader.service";
import {PrettyDatePipe} from "./pipes/pretty-date";
import {MaterialModule} from "@angular/material";
import {ToolsComponent} from "./components/tools.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule, PreloadAllModules} from "@angular/router";
import {AppComponent} from "./components/app.component";
import {HashPipe} from "./pipes/hash";
import {ArticleComponent} from "./components/article.component";


@NgModule({
    declarations: [
        AppComponent,
        ReaderComponent,
        MenuComponent,
        ReadingPaneComponent,
        PrettyDatePipe,
        HashPipe,
        ToolsComponent,
        ArticleComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        RouterModule.forRoot([
            {
                path: 'feeds/:id',
                component: ReaderComponent,
            },
            {
                path: 'feeds',
                component: ReaderComponent,
            },
            {
                path: '',
                redirectTo: '/feeds',
                pathMatch: 'full'
            },
        ],

        { preloadingStrategy: PreloadAllModules }
        )
    ],
    providers: [FeedService, StorageService, ReaderService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
