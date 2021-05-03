import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {


  transform(value: any, input: any): any {
    if (input) {
      let arr = [];
      arr = value.filter(val => val.model.toLowerCase().indexOf(input.toLowerCase()) >= 0)
      if(arr.length > 5) arr = arr.slice(0, 5)
      return arr;
    } else {
      return value;
    }
  }
}
