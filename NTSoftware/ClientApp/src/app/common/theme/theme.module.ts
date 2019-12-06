import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {
  NbActionsModule,
  NbContextMenuModule, NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbUserModule
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import { OneColumnComponent } from './one-column/one-column.component';


@NgModule({
  declarations: [FooterComponent, HeaderComponent, OneColumnComponent],
  exports: [
    OneColumnComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbMenuModule,
    NbContextMenuModule,
    NbSidebarModule,
    NbActionsModule,
    NbUserModule,
    NbIconModule,
    NbEvaIconsModule
  ]
})
export class ThemeModule {
}
