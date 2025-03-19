import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gmtDate'
})
export class GmtDatePipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    // Format: e.g., "Wed, 20 Mar 2025 14:30:00 GMT"
    return date.toUTCString();
  }

}
