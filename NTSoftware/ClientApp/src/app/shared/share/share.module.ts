import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, } from '@angular/common/http';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
  }),
  ],
  exports:[
    CommonModule,
    TranslateModule
  ]
})
export class ShareModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../assets/i18n/', '.json');
}