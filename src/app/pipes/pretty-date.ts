import * as moment from 'moment';
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'prettyDate'})
export class PrettyDatePipe implements PipeTransform {
  transform(tuple9: number[]): string {
    let [y,m,d,h,M,s] = tuple9;
    let date = new Date(y,m-1,d,h,M,s);

    return moment(date).fromNow();
  }
}
