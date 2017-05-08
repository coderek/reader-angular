import {EntryEffects} from "./entries";
import {ReaderService} from "../services/reader.service";
import {Subject} from "rxjs";
import {Actions} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {LOAD_ENTRIES_COMPLETE, LoadEntriesAction} from "../reducers/entries";
import {SelectFeedAction} from "../reducers/global";
describe('Entries effects', ()=> {

    let entryEffects: EntryEffects;
    let subject = new Subject<Action>();
    let fakeActions = new Actions(subject);
    let fakeReaderService = {
        getFavorites : ()=> Promise.resolve([]),
        getEntriesForFeed: (url)=> Promise.resolve([])
    } as ReaderService;
    let sub = null;
    beforeEach(()=> {
        entryEffects = new EntryEffects(fakeReaderService, fakeActions);
    });

    afterEach(()=> {
        if (sub) {
            sub.unsubscribe();
            sub = null;
        }
    });

    it('should trigger load entries action when selected a feed', (done)=> {
        sub = entryEffects.loadEntries.take(1).subscribe(a=> {
            expect(a.type).toEqual(LOAD_ENTRIES_COMPLETE);
        }, null, done);
        subject.next(new SelectFeedAction('favorites'));
    });

    it('should trigger load entries action when load entries action is triggered', (done)=> {
        sub = entryEffects.loadEntries.take(1).subscribe(a=> {
            expect(a.type).toEqual(LOAD_ENTRIES_COMPLETE);
        }, null, done);
        subject.next(new LoadEntriesAction('http'));
    });
});
