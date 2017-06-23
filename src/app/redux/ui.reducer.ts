import {CHANGE_FILTER, DECREMENT_FONT, FINISH_INIT, FINISH_LOADING, INCREMENT_FONT, START_LOADING} from './consts';
import {Action} from '@ngrx/store';
import {UIState} from './state';
import {assign} from 'lodash';

const defaultUIState: UIState = {
	http_loading: false,
	font_size: 16,
	finish_init: false,
	filter: '',
};

const MAX_FONT = 26;
const MIN_FONT = 12;

export function uiStateReducer(state: UIState = defaultUIState, action: Action) {
	switch (action.type) {
		case START_LOADING:
			return Object.assign({}, state, {http_loading: true});
		case FINISH_LOADING:
			return Object.assign({}, state, {http_loading: false});
		case INCREMENT_FONT: {
			let fontSize = state.font_size + 1;
			fontSize = Math.max(fontSize, MIN_FONT);
			fontSize = Math.min(fontSize, MAX_FONT);
			return Object.assign({}, state, {font_size: fontSize});
		}
		case FINISH_INIT:
			return assign({}, state, {finish_init: true});
		case DECREMENT_FONT: {
			let fontSize = state.font_size - 1;
			fontSize = Math.max(fontSize, MIN_FONT);
			fontSize = Math.min(fontSize, MAX_FONT);
			return Object.assign({}, state, {font_size: fontSize});
		}
		case CHANGE_FILTER: {
			let filter = action.payload;
			return Object.assign({}, state, {filter});
		}
		default:
			return state;
	}

}
