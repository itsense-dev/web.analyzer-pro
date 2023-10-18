import { Pipe, PipeTransform } from '@angular/core';
import { PanelList } from 'src/enum/panel-list.interface';

@Pipe({
  name: 'filterList',
})
export class FilterListPipe implements PipeTransform {
  transform(items: PanelList[], filter: any) {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => item.name.toUpperCase().includes(filter.toUpperCase()));
  }
}
