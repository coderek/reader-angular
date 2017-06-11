import {TestBed, async} from "@angular/core/testing";
import {ArticleComponent} from "../article/article";
import {Store} from "@ngrx/store";
import {ElementRef} from "@angular/core";
import {Observable} from "rxjs";
import createSpyObj = jasmine.createSpyObj;

describe('<reader-article> component', ()=> {

    let fixture;
    let comp;
    let feed = {
        link: 'http://abc.com',
        url: 'http://dec.com'
    };
    let state = {
        feeds: [feed]
    };

    let fakeStore = createSpyObj('store', ['select', 'subscribe', 'take']);
    let fakeElementRef = {}
    let spy;
    beforeEach(()=> {
        fakeStore.select.and.returnValue(Observable.of(1));
        fakeStore.take.and.returnValue(fakeStore);
        fakeStore.subscribe.and.returnValue(Observable.of(state));

        TestBed.configureTestingModule({
            declarations: [
                ArticleComponent,
            ],
            providers: [
                {provide: Store, useValue: fakeStore},
                {provide: ElementRef, useValue: fakeElementRef}
            ]
        });
        fixture = TestBed.createComponent(ArticleComponent);
        comp = fixture.componentInstance;
    });

    it('should use the content/summary whichever is longer', ()=> {
        comp.entry = {
            content: 'zengqiang',
            summary: ''
        };
        fixture.detectChanges();
        expect(comp.content).toBe('zengqiang');
        comp.entry = {
            summary: 'qiangzeng'
        };
        fixture.detectChanges();
        expect(comp.content).toBe('qiangzeng');
    });

    it('should replace relative url', async(()=> {
        let entry = {
            content: '<img src="/apple.png"/>',
            feed_url: 'http://dec.com'
        };
        comp.entry = entry;
        fixture.detectChanges();

        comp.checkAndUpdateUrls(state);
        expect(comp.content).toBe('<img src="/apple.png"/>')
        let src = fixture.debugElement.nativeElement.querySelector('img').src;
        expect(src).toBe('http://abc.com/apple.png')
    }));
});
