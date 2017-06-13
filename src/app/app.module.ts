import {NgModule} from '@angular/core';
import {ReaderModule} from './reader/reader.module';
import {LayoutComponent} from './reader/ui/layout/layout.component';


@NgModule({
	declarations: [],
	imports: [
		ReaderModule,
	],
	providers: [],
	bootstrap: [LayoutComponent]
})
export class AppModule {
}
