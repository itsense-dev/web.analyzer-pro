import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranformTextService {
  constructor() {}

  transformJsonToText(text: string = '') {
    const splitText = text.split('');
    let textTransform = '';
    splitText.forEach((item) => {
      !item.search(/[A-Z]/) ? (textTransform += ' ' + item) : (textTransform += item);
    });
    return textTransform.toLowerCase().trim();
  }
}
