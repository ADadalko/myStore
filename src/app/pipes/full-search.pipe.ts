import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullSearch'
})
export class FullSearchPipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      let arr = [];
      arr = value.filter(val => val.model.toLowerCase().indexOf(input.toLowerCase()) >= 0)
      if(arr.length > 9) arr = arr.slice(0, 9)
      return arr;
    } else {
      return value;
    }
  }

}
