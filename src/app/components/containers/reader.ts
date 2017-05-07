import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from "@angular/core";
import {State, selectors} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {Observable, Subscription} from "rxjs";
import {ReaderService} from "../../services/reader.service";
import {SetFontSizeAction} from "../../reducers/global";

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
        }
        header {
            flex: none;
            color: black;
            padding-left: 10px;
            background-color: #c2cff1;
        }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderMainComponent implements OnDestroy {
    title: Observable<string>;
    newItemsCount = 0;
    sub: Subscription;
    feeds = [];

    constructor(private store: Store<State>, reader: ReaderService) {
        this.title = store.select(selectors.pageTitle);
        this.sub = store.select(selectors.fontSize).skip(1).subscribe(size=> {
            reader.saveSetting('fontSize', size);
        });
        let size = reader.getSetting('fontSize');
        this.store.dispatch(new SetFontSizeAction(parseFloat(size)));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
