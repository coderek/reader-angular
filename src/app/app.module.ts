import {NgModule} from '@angular/core';
import {AppComponent} from './containers/app';
import {reducer} from './reducers';
import {StoreModule} from '@ngrx/store';
import {ReaderModule} from './reader/reader.module';
import {LayoutComponent} from './reader/ui/layout/layout.component';


// const routes = [
//     {
//         path: '',
//         redirectTo: '/feeds',
//         pathMatch: 'full',
//     }
// ];

@NgModule({
    declarations: [
    ],
    imports: [
        ReaderModule,
        StoreModule.provideStore(reducer),
    ],
    providers: [],
    bootstrap: [LayoutComponent]
})
export class AppModule {
}
