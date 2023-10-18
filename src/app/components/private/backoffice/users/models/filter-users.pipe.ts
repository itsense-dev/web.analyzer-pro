import { Pipe, PipeTransform } from '@angular/core';
import { Person, Users } from 'src/models/clientes.interface';

@Pipe({
  name: 'usersPipeFilter',
  pure: false,
})
export class usersFilterPipe implements PipeTransform {
  transform(items: Users[], filter: any) {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => item.name.includes(filter));
  }
}
