import {NgModule, Injectable} from "@angular/core";
import {AppComponent} from "./containers/app";
import {ComponentsModule} from "./components";
import {RouterModule, PreloadingStrategy, Route, Router} from "@angular/router";
import {reducer} from "./reducers";
import {StoreModule} from "@ngrx/store";
import {BrowserModule} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {SpinnerComponent} from "./containers/spinner";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";


const routes = [
    {
        path: '',
        redirectTo: '/feeds',
        pathMatch: 'full',
    }
];

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent
    ],
    imports: [
        BrowserModule,
        ComponentsModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        RouterModule.forRoot(routes),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
