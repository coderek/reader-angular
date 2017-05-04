import {ReaderMainComponent} from "./containers/reader";
import {FavoriteEntriesComponent} from "./views/favorites";
import {FeedEntriesComponent} from "./views/entries";
import {EmptyPaneComponent} from "./views/empty-entries";
import {Routes} from "@angular/router";

export const paramsSelectEntry = params => decodeURIComponent(params['open']);
export const paramsSelectFeed = params => decodeURIComponent(params['feed']);

export const routes: Routes = [
    {
        path: 'feeds',
        component: ReaderMainComponent,
        children: [
            {
                path: 'favorites',
                component: FavoriteEntriesComponent,
            },
            {
                path: ':feed',
                component: FeedEntriesComponent,
            },
            {
                path: '',
                component: EmptyPaneComponent
            }
        ]
    }
];
