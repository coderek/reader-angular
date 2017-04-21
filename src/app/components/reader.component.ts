import {Component, Input} from '@angular/core';
import {ReaderService} from "../services/reader.service";

@Component({
  selector: 'app-root',
  template: `    
    <header>
      <h1>RSS reader</h1>
    </header>
    <div class="body">
      <app-menu [feeds]="feeds" 
                [selectedFeed]="selectedFeed"></app-menu>
      <app-reading-pane [feed]="selectedFeed"></app-reading-pane>
    </div>
  `,
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent {

  @Input()
  get selectedFeed() {
    return this.reader.getSelectedFeed();
  };

  @Input()
  get feeds() {
    return this.reader.getFeeds();
  };

  constructor(private reader:ReaderService) {}
}
