import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

const READER_SERVICE_SERVER = 'http://localhost:8000/reader-service/';

@Injectable()
export class FeedService {

    constructor(private http: Http) {
    }

    fetch(url) {
        console.assert(url);
        let headers = new Headers({
            'Content-type': 'application/x-www-form-urlencoded',
        });
        return this.http.post(READER_SERVICE_SERVER, `url=${encodeURIComponent(url)}`, {headers}).map(res => res.json()).toPromise();
    }
}
