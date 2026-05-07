import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyExchangerComponent } from './currency-exchanger.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CurrencyExchangerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  exports: [CurrencyExchangerComponent],
})
export class CurrencyExchangerModule { }

