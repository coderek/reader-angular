import {Component, OnInit} from "@angular/core";
import {ReaderService} from "../services/reader.service";
import {MdSnackBar} from "@angular/material";

@Component({
    selector: 'reader',
    template: `
        <app-menu [title]="'RSS Reader'"></app-menu>
        <app-reading-pane></app-reading-pane>
    `,
    styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {

    constructor(private reader: ReaderService,
                private snackBar: MdSnackBar) {
        console.log('init reader component');
        // this.feeds = this.reader.feeds;
        // console.log(this.feeds)
        reader.toastMessage.subscribe(msg => {
            this.snackBar.open(msg, '', {duration: 2000});
        })
    }
    ngOnInit() {
    }
}
