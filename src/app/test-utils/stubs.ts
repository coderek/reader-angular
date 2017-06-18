import {Component, Directive, Input} from '@angular/core';

@Directive({
	selector: '[routerLink]',
	host: {
		'(click)': 'onClick()'
	}
})
export class RouterLinkStubDirective {

	@Input('routerLink') linkParams: any;
	navigatedTo: any = null;

	onClick() {
		this.navigatedTo = this.linkParams;
	}
}

@Component({
	selector: 'app-feeds',
	template: ''
})
export class FeedsStubComponent {
}


@Component({
	selector: 'app-add-feed-button',
	template: ''
})
export class AddFeedButtonStubComponent {
	@Input() progress;
}

@Component({
	selector: 'router-outlet',
	template: ''
})
export class RouterOutletStubComponent {

}
