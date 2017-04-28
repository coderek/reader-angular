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
export class ReaderComponent {
    constructor(private reader: ReaderService,
                private snackBar: MdSnackBar) {
        reader.toastMessage.subscribe(msg => {
            this.snackBar.open(msg, '', {duration: 2000});
        })
    }
}
