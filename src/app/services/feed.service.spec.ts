import {FeedService} from './feed.service';
import {TestBed} from '@angular/core/testing';
import {Http, HttpModule} from "@angular/http";

describe("Feed Service", ()=> {
  let service: FeedService;

  beforeEach(()=> {
    TestBed.configureTestingModule({
      imports: [HttpModule]
    });
    service = new FeedService(TestBed.get(Http));
  });

  it('feed service', (done: DoneFn)=> {
    let url = 'http://codingnow.com/atom.xml';
    service.fetch(url).subscribe((response)=> {
      expect(response.title).toBe("云风的 BLOG");
      done();
    });
  });

});
