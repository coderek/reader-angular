import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

import 'rxjs/add/operator/map';

const READER_SERVICE_SERVER = 'http://localhost:5000';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FeedService {

  constructor(private http: Http) { }

  fetch(url) {
    return this.http.post(READER_SERVICE_SERVER,  {url}).map(res=> res.json()).toPromise();
  }
}
