import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CurrencyHistoryRoutingModule } from './currency-history-routing.module';
import { CurrencyHistoryComponent } from './currency-history.component';
import { HistoricalChartComponent } from '../../components/historical-chart/historical-chart.component';


@NgModule({
  declarations: [
    CurrencyHistoryComponent,
    HistoricalChartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CurrencyHistoryRoutingModule,
  ]
})
export class CurrencyHistoryModule { }
