import {Component} from "@angular/core";
import {Store} from "@ngrx/store";
import {State} from "../reducers";

@Component({
    template: `
        Nothing
    `,
    selector: 'empty-pane'
})
export class EmptyPaneComponent {

    constructor(private store: Store<State>) {
        // store.dispatch(new SelectFeedAction(null));
    }
}
