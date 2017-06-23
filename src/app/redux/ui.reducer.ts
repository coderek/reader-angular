import {DECREMENT_FONT, FINISH_INIT, FINISH_LOADING, INCREMENT_FONT, START_LOADING} from './consts';
import {Action} from '@ngrx/store';
import {UIState} from './state';
import {assign} from 'lodash';

const defaultUIState: UIState = {
	http_loading: false,
	font_size: 12,
	finish_init: false,
};

export function uiStateReducer(state: UIState = defaultUIState, action: Action) {
	switch (action.type) {
		case START_LOADING:
			return Object.assign({}, state, {http_loading: true});
		case FINISH_LOADING:
			return Object.assign({}, state, {http_loading: false});
		case INCREMENT_FONT: {
			let fontSize = state.font_size + 1;
			fontSize = Math.max(fontSize, 12);
			fontSize = Math.min(fontSize, 18);
			return Object.assign({}, state, {font_size: fontSize});
		}
		case FINISH_INIT:
			return assign({}, state, {finish_init: true});
		case DECREMENT_FONT: {
			let fontSize = state.font_size - 1;
			fontSize = Math.max(fontSize, 12);
			fontSize = Math.min(fontSize, 18);
			return Object.assign({}, state, {font_size: fontSize});
		}
		default:
			return state;
	}

}