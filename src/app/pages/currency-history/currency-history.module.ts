import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyHistoryRoutingModule } from './currency-history-routing.module';
import { CurrencyHistoryComponent } from './currency-history.component';


@NgModule({
  declarations: [
    CurrencyHistoryComponent
  ],
  imports: [
    CommonModule,
    CurrencyHistoryRoutingModule
  ]
})
export class CurrencyHistoryModule { }
