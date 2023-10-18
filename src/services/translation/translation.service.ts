import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { GlobalVariables } from 'src/enum/global-variables.enum';
import { Languages } from 'src/enum/languages.enum';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translocoService: TranslocoService) {}

  setLanguage(language?: Languages) {
    let currentLanguage = Languages.SPANISH;
    if (!language) {
      currentLanguage = <Languages>localStorage.getItem(GlobalVariables.CURRENT_LANGUAGE);
      if (!currentLanguage) currentLanguage = Languages.SPANISH;
    } else {
      currentLanguage = language;
    }
    localStorage.setItem(GlobalVariables.CURRENT_LANGUAGE, currentLanguage);
    this.translocoService.setActiveLang(currentLanguage);
  }
}
