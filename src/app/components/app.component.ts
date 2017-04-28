import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'reader-app',
    template: `
        <router-outlet></router-outlet>
    `,
    styles: []
})
export class AppComponent implements OnInit {
    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.params.subscribe(param => {
            console.log(param);
        });
    }
}
