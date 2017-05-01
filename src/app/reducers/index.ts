import * as fromFeeds from "./feed-list";


export interface State {
    feeds: fromFeeds.State,
}

const reducers = {
    feeds: fromFeeds.reducer,
};

