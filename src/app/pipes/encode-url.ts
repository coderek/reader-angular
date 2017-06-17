import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'encode_url'})
export class EncodeUrlPipe implements PipeTransform {
	transform(str): string {
		return encodeURIComponent(str);
	}
}
