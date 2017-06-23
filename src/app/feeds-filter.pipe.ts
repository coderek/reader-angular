import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'feedsFilter'
})
export class FeedsFilterPipe implements PipeTransform {

	transform(value: any, filter: any): any {
		filter = filter.trim().toLowerCase();
		if (filter === '') return value;
		return value.filter(v => {
			return v.title.toLowerCase().indexOf(filter) !== -1 ||
				v.description && v.description.toLowerCase().indexOf(filter) !== -1;
		});
	}
}
