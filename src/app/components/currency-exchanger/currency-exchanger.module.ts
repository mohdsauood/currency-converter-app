import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyExchangerComponent } from './currency-exchanger.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CurrencyExchangerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [CurrencyExchangerComponent],
})
export class CurrencyExchangerModule { }

