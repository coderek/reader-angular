import {Component, HostBinding, Input, OnChanges} from "@angular/core";
@Component({
    selector: 'spinner',
    template: `<span class="spinner-text">loading...</span>`,
    styles: [`
        :host {
            position: fixed;
            width: 100%;
            text-align: center;
        }
    `]
})
export class SpinnerComponent implements OnChanges {
    @HostBinding('style.display') display = 'block';
    @Input() spin;

    ngOnChanges() {
        if (this.spin) {
            this.display = 'block';
        } else {
            this.display = 'none';
        }
    }
}
