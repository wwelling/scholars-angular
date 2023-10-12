import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BannerComponent } from './banner/banner.component';
import { HeaderComponent } from './header.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [HeaderComponent, NavbarComponent, BannerComponent],
  imports: [CommonModule, SharedModule],
  exports: [HeaderComponent],
})
export class HeaderModule { }
