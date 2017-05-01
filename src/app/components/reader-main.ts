import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'reader-main',
    template: `
        <header>{{title}}</header>
        <feed-toolbar [feed]="feed" [newItemsCount]="newItemsCount" (onPullFeed)="onPullFeed()" (onReadEntries)="onReadEntries()" (onDeleteFeed)="onDeleteFeed()"></feed-toolbar>
        
        <router-outlet></router-outlet>
    `,
    styles: [
        `
        :host {
            display: flex;
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
        feed-toolbar {
            /*height: 40px;*/
            flex: none;
            margin: 10px 10px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #d8d4d4;
        }
        `
    ]
})
export class ReaderMainComponent implements OnInit, OnDestroy {
    title = 'All feeds';

    constructor(private route: ActivatedRoute) {
        console.log('loaded')
    }

    ngOnDestroy() {
        console.log('quit')
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            console.log(params);
            // if (params['feed']) {
            //     let url = decodeURIComponent(params['feed']);
            //     let feed = feeds.find(f=> f.url == url);
            //     if (feed)
            //         this.store.dispatch(new SelectFeedAction(feed));
            // }
        }, console.log, console.error);
    }

}
