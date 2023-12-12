import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HttpRequestInterceptor } from 'src/services/interceptors/http-request.interceptor';
import { TRANSLOCO_CONFIG, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslocoLoaderConst } from 'src/services/translation/transloco-loader.service';
import { environment } from 'src/environments/environment';
import { TranslationService } from 'src/services/translation/translation.service';
import { Amplify } from 'aws-amplify';

registerLocaleData(es);
Amplify.configure({ Auth: environment.amplify.auth });

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    TranslocoModule,
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: es_ES,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    TranslocoLoaderConst,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        reRenderOnLangChange: true,
        availableLangs: environment.availableLanguages,
        prodMode: environment.production,
        defaultLang: environment.defaultLanguage,
      },
    },
    TranslocoService,
    {
      provide: APP_INITIALIZER,
      useFactory: (tservice: TranslationService) => () => tservice.setLanguage(),
      deps: [TranslationService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
