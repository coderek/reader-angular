import {Injectable} from '@angular/core';
import {uiStateReducer} from './ui.reducer';
import {domainStateReducer} from './domain.reducer';
import {appStateReducer} from './app.reducer';
import {combineReducers} from '@ngrx/store';
import {compose} from '@ngrx/core/compose';

export let _cached_state: any = {};

@Injectable()
export class StateCache {
	get finish_init() {
		return _cached_state.ui_state.finish_init
			;
	}
	get display_feeds() {
		return _cached_state.app_state.display_feeds;
	}

	get display_entries() {
		return _cached_state.app_state.display_entries;
	}

	get feeds() {
		return _cached_state.domain_state.feeds;
	}

	get entries() {
		return _cached_state.domain_state.entries;
	}
}

function snapShot(reducer) {
	return function (state, action) {
		const nextState = reducer(state, action);
		_cached_state = nextState;
		return nextState;
	};
}

export const readerReducer = compose(snapShot, combineReducers)({
	ui_state: uiStateReducer,
	app_state: appStateReducer,
	domain_state: domainStateReducer
});
