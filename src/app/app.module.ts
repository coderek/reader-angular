import {NgModule} from '@angular/core';
import {ReaderModule} from './reader/reader.module';
import {LayoutComponent} from './reader/ui/layout/layout.component';
import { CounterComponent } from './common/counter/counter.component';


@NgModule({
	imports: [
		ReaderModule,
	],
	providers: [],
	bootstrap: [LayoutComponent],
})
export class AppModule {
}
