import * as moment from 'moment';
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'prettyDate'})
export class PrettyDatePipe implements PipeTransform {
    transform(date: Date): string {
        return moment(date).fromNow();
    }
}
