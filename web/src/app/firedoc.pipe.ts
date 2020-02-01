import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from './services';
import { Observable } from 'rxjs';

@Pipe({
  name: 'firedoc'
})
export class FiredocPipe implements PipeTransform {

  constructor(
    private dataService: DataService
  ) {}

  transform(docId: string, collection: string): Observable<any> {
    return this.dataService.getDoc$(collection, docId);
  }

}
