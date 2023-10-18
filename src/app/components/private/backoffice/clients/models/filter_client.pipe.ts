import { Pipe, PipeTransform } from '@angular/core';
import { Clients } from 'src/models/clientes.interface';

@Pipe({
  name: 'clientPipeFilter',
  pure: false,
})
export class clientFilterPipe implements PipeTransform {
  transform(items: readonly Clients[], filter: any) {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => item.name.includes(filter));
  }
}
