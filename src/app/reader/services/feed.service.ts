import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

const READER_SERVICE_SERVER = 'http://localhost:8000/reader-service/';
const TIMEOUT = 120000;

@Injectable()
export class FeedService {

	constructor(private http: Http) {
	}

	fetch(url) {
		console.assert(url);
		const headers = new Headers({
			'Content-type': 'application/x-www-form-urlencoded',
		});
		return this.http.post(
			READER_SERVICE_SERVER,
			`url=${encodeURIComponent(url)}`,
			{headers}).map(res => res.json()).timeout(TIMEOUT).toPromise();
	}
}
