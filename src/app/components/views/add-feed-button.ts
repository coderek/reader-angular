import {Component, OnChanges, SimpleChanges} from "@angular/core";
import {MdDialog, MdDialogRef} from "@angular/material";
import {NgForm} from "@angular/forms";
import {ReaderService} from "../../services/reader.service";
import {Store} from "@ngrx/store";
import {State} from "../../reducers/index";
import {AddFeedAction} from "../../reducers/feeds";
import {UniqueFeedValidatorDirective} from "../../validations/add-feed";


@Component({
    selector: 'new-feed-form',
    template: `
        <h3>Add new feed</h3>
        <form #feedForm="ngForm" (ngSubmit)="onSubmit(feedForm)">
            <div>
                <label for="feed_url">Atom/RSS URL</label>
                <div class="control">
                    <input type="text" ngModel #feedUrl="ngModel" uniqueFeed required id="feed_url" name="feedUrl" pattern="^https?:\/\/.*">    
                    <div [hidden]="feedUrl.valid || feedUrl.pristine">
                        <span class="error">{{feedUrl.errors | json}}</span>
                    </div>    
                </div>
                <button [disabled]="feedForm.invalid">Add</button>
            </div>
        </form>
    `,
    styles: [`
        .error {
            color: red;
        }
        .control {
            display: inline-block;
        }
        input + div {
            margin-top: 4px;
            font-size: 80%;
        }
        form {
            background-color: #c2cff1;
            border: 1px solid #767f96;
            padding: 10px;
        }
        label, input, button { 
            vertical-align:  top; 
            line-height: 30px;    
        }
        input, button {
            height: 30px;
        }
        
        input { 
            width: 400px; 
            height: 25px;
            padding-left: 10px;
            padding-right: 10px;
        }
        button { width: 50px; }
        h3 { margin-top: 0; }
        
    `],
})
export class NewFeedFormComponent  {
    constructor(private dialogRef: MdDialogRef<NewFeedFormComponent>, private reader: ReaderService, private store: Store<State>) {}

    onSubmit(form: NgForm) {
        let {feedUrl} = form.value;
        this.store.dispatch(new AddFeedAction(feedUrl));
        this.dialogRef.close();
    }
}

@Component({
    selector: 'add-feed-button',
    template: `
        <button (click)="openDialog()">Add a subscription</button>
    `
})
export class AddFeedButtonComponent {
    // @Input()

    constructor(public dialog: MdDialog) {}
    openDialog() {
        let config = {data: 123};
        this.dialog.open(NewFeedFormComponent, config);
    }
}


