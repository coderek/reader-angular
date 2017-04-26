import {Component, Input} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {MdSnackBar} from "@angular/material";
import {List} from "immutable";

@Component({
    selector: 'app-root',
    template: `
  <app-menu [feeds]="feeds" [title]="'RSS Reader'"
            [selectedFeed]="selectedFeed"></app-menu>
  <app-reading-pane [feed]="selectedFeed" [entries]="entriesForSelectedFeed"></app-reading-pane>
  `,
    styleUrls: ['./reader.component.css']
})
export class ReaderComponent {

    @Input()
    get selectedFeed() {
        return this.reader.getSelectedFeed();
    };

    @Input()
    get feeds() {
        return this.reader.getFeeds();
    };

    @Input()
    get entriesForSelectedFeed() {
        return this.reader.entriesForSelectedFeed;
    }
    constructor(private reader: ReaderService, private snackBar: MdSnackBar) {
        reader.toastMessage.subscribe(msg => {
            this.snackBar.open(msg, '', {duration: 2000});
        })
    }
}
