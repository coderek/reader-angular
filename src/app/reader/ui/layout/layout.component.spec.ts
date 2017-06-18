import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutComponent} from './layout.component';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {
	AddFeedButtonStubComponent,
	FeedsStubComponent,
	RouterLinkStubDirective,
	RouterOutletStubComponent
} from '../../../test-utils/stubs';
import {ReaderService} from '../../services/reader.service';
import {Store} from '@ngrx/store';

describe('LayoutComponent', () => {
	let component: LayoutComponent;
	let fixture: ComponentFixture<LayoutComponent>;

	const feeds = [];
	const readerServiceStub = {
		getFeeds: function () {return Promise.resolve(feeds); }
	};
	const storeStub = {};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				FeedsStubComponent,
				AddFeedButtonStubComponent,
				LayoutComponent,
				RouterLinkStubDirective,
				RouterOutletStubComponent
			],
			imports: [
				SlimLoadingBarModule
			],
			providers: [
				{provide: ReaderService, useValue: readerServiceStub},
				{provide: Store, useValue: storeStub}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
