import {Component} from "@angular/core";
import {Store} from "@ngrx/store";
import {State} from "../../reducers/index";
import {SetPageTitleAction} from "../../reducers/global";

@Component({
    template: `
        Nothing here yet
    `,
    selector: 'empty-pane',
    styles: [
        `
        :host{
            border: 4px solid snow;
            margin: 10px;
            border-radius: 4px;
            background: aliceblue;
            height: 100px;
            text-align: center;
            padding-top: 30px;
            }
        `
    ]
})
export class EmptyPaneComponent {
    constructor(store: Store<State>) {
        store.dispatch(new SetPageTitleAction('All feeds'));
    }
}
