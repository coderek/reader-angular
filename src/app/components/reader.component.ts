import { Component } from '@angular/core';
import {ReaderService} from "../services/reader.service";

@Component({
  selector: 'app-root',
  template: `
  
    <header>
      <h1>RSS reader</h1>
    </header>
    <div class="body">
      <app-menu></app-menu>
      <app-reading-pane [feed]="selectedFeed"></app-reading-pane>
    </div>
  
  `,
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent {
  selectedFeed=null;

  constructor(private reader:ReaderService) {
    reader.selectedFeed.subscribe(f=> this.selectedFeed=f);
  }
}
