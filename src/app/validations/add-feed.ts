import {Directive, OnDestroy} from "@angular/core";
import {Validator, AbstractControl, NG_VALIDATORS, ValidatorFn, Validators} from "@angular/forms";
import {State} from "../reducers/index";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";


export function uniqueFeedValidator(feeds): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        let url = control.value;
        if (feeds.findIndex(f=>f.url === url) === -1) return null;
        return {feedUrl: 'Already exists'};

    }
}


@Directive({
    selector: '[uniqueFeed]',
    providers: [{provide: NG_VALIDATORS, useExisting: UniqueFeedValidatorDirective, multi: true}]
})
export class UniqueFeedValidatorDirective implements Validator, OnDestroy {
    private state: State;
    sub: Subscription;
    constructor(private store: Store<State>) {
        this.sub = store.subscribe(s=>this.state =s);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    validate(control: AbstractControl): {[key: string]: any} {
        console.log(this);
        if (this.state) {
            return uniqueFeedValidator(this.state.feeds)(control);
        } else {
            return Validators.nullValidator(control);
        }
    }
}
