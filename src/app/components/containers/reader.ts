import {Component, OnInit} from "@angular/core";
import {State, selectors} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

@Component({
    selector: 'reader-main',
    template: `
        <header>{{title | async}}</header>
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
    title: Observable<string>;
    newItemsCount = 0;

    feeds = [];

    constructor(private store: Store<State>) {
        this.title = store.select(selectors.pageTitle);
    }
}
