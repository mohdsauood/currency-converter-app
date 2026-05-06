import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NavbarModule } from '../navbar';
import { CurrencyExchangerModule } from '../currency-exchanger';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, NavbarModule, CurrencyExchangerModule],
  exports: [LayoutComponent]
})
export class LayoutModule { }
