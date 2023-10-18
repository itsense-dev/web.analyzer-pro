import { HttpClient } from '@angular/common/http';
import { Translation, TRANSLOCO_LOADER, TranslocoLoader } from '@ngneat/transloco';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslocoLoaderService implements TranslocoLoader {
  constructor(private httpClient: HttpClient) {}

  getTranslation(lang: string) {
    return this.httpClient.get<Translation>(`../../assets/i18n/${lang}.json`);
  }
}

export const TranslocoLoaderConst = {
  provide: TRANSLOCO_LOADER,
  useClass: TranslocoLoaderService,
};
