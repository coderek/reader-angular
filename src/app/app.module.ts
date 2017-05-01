import {NgModule, Injectable} from "@angular/core";
import {AppComponent} from "./containers/app";
import {ComponentsModule} from "./components";
import {RouterModule, PreloadingStrategy, Route, Router} from "@angular/router";
import {reducer} from "./reducers";
import {StoreModule} from "@ngrx/store";
import {BrowserModule} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {SpinnerComponent} from "./containers/spinner";


const routes = [
    {
        path: '',
        redirectTo: '/feeds',
        pathMatch: 'full',
    }
];

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
    preloadedModules: string[] = [];

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data['preload']) {
            // add the route path to the preloaded module array
            this.preloadedModules.push(route.path);

            // log the route path to the console
            console.log('Preloaded: ' + route.path);

            return load();
        } else {
            return Observable.of(null);
        }
    }
}


@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent
    ],
    imports: [
        BrowserModule,
        ComponentsModule,
        StoreModule.provideStore(reducer),
        RouterModule.forRoot(routes,
            {preloadingStrategy: SelectivePreloadingStrategy}
        ),
    ],
    providers: [
        SelectivePreloadingStrategy
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(router: Router) {
        console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
    }
}
