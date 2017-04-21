import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ReaderComponent } from './components/reader.component';
import { MenuComponent } from './components/menu.component';
import { ReadingPaneComponent } from './components/reading-pane.component';
import {FeedService} from "./services/feed.service";
import {StorageService} from "./services/storage.service";
import {ReaderService} from "./services/reader.service";
import {PrettyDatePipe} from "./pipes/pretty-date";
import {MaterialModule} from "@angular/material";
import {ToolsComponent} from "./components/tools.component";


@NgModule({
  declarations: [
    ReaderComponent,
    MenuComponent,
    ReadingPaneComponent,
    PrettyDatePipe,
    ToolsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
  ],
  providers: [FeedService, StorageService, ReaderService],
  bootstrap: [ReaderComponent]
})
export class AppModule { }
