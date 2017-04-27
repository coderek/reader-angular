import {Component, Input, OnInit, ChangeDetectorRef} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {MdSnackBar} from "@angular/material";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'reader',
    template: `
        <app-menu [feeds]="feeds" [title]="'RSS Reader'" [selectedFeed]="selectedFeed"></app-menu>
        <app-reading-pane [feed]="selectedFeed" [entries]="entriesForSelectedFeed" [entryShown]="entryShown"></app-reading-pane>
  `,
    styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {

    @Input()
    selectedFeed;

    @Input()
    entriesForSelectedFeed = [];

    @Input()
    entryShown;

    @Input()
    get feeds() {
        return this.reader.getFeeds();
    };

    constructor(private changeDetector: ChangeDetectorRef,
                private reader: ReaderService,
                private snackBar: MdSnackBar,
                private route: ActivatedRoute,) {
        console.log('init reader component');
        reader.toastMessage.subscribe(msg => {
            this.snackBar.open(msg, '', {duration: 2000});
        })
    }

    ngOnInit() {
        this.route.params.subscribe(async params => {
            let feedUrl = decodeURIComponent(params['id']);
            if (this.selectedFeed == null || this.selectedFeed.url !== feedUrl) {
                this.selectedFeed = await this.reader.getFeed(feedUrl);
            }
            if (this.selectedFeed == null) {
                this.entriesForSelectedFeed = [];
            } else {
                this.entriesForSelectedFeed = await this.reader.getEntriesForFeed(this.selectedFeed)
                this.entryShown = this.entriesForSelectedFeed.find(e => e.url === decodeURIComponent(params['eid']));
                this.changeDetector.detectChanges();
            }
        });
    }
}
