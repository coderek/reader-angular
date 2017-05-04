import {Component} from "@angular/core";

@Component({
    selector: 'reader-main',
    template: `
        <header>{{(feedUrl | async)?.title || title}}</header>
        <router-outlet></router-outlet>
    `,
    styles: [
        `
        :host {
            display: flex;
            flex: 1 1;
            flex-direction: column;
            height: 100%;
        }
        header {
            /*height: 30px;*/
            flex: none;
            color: black;
            padding-left: 10px;
            line-height: 30px;
            background-color: #c2cff1;
        }
        `
    ]
})
export class ReaderMainComponent {
    title = 'All feeds';
    newItemsCount = 0;
}
