import { Pipe, PipeTransform } from '@angular/core';
import { Clients } from 'src/models/clientes.interface';

@Pipe({
  name: 'querysPipeFilter',
  pure: false,
})
export class querysFilterPipe implements PipeTransform {
  transform(items: Clients[], filter: any) {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => item.name.includes(filter));
  }
}
