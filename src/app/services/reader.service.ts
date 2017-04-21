import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

@Injectable()
export class ReaderService {
  selectedFeed = new Subject();

  openFeed(feed) {
    this.selectedFeed.next(feed);
  }
}
