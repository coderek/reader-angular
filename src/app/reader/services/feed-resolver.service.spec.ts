import {TestBed, inject} from '@angular/core/testing';

import {FeedResolverService} from './feed-resolver.service';
import {StateCache} from '../../redux/index';
import Spy = jasmine.Spy;
import {ReaderService} from './reader.service';

describe('FeedResolverService', () => {
	beforeEach(() => {
		const readerServiceFake = {};
		TestBed.configureTestingModule({
			providers: [
				FeedResolverService,
				{provide: StateCache, useValue: {current_feeds: []}},
				{provide: ReaderService, useValue: readerServiceFake}
			]
		});
	});

	it('should ...', inject([FeedResolverService], (service: FeedResolverService) => {
		expect(service).toBeTruthy();
	}));
});
