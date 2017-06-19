import {Injectable} from '@angular/core';

@Injectable()
export class LoggingService {

	constructor() {
	}

	log(...args) {
		console.log.apply(null, args);
	}
}
