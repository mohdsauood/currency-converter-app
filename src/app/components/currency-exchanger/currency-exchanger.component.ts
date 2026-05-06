import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Currency } from '../../models/currency';
import { CurrencyService } from '../../services';

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.scss']
})
export class CurrencyExchangerComponent implements OnInit, OnDestroy {

  exchangeForm!: FormGroup;

  currencies: Currency[] = [];

  private subscriptions: Subscription[] = [];

  get amountControl(): AbstractControl | null {
    return this.exchangeForm.get('amount');
  }

  get fromCurrency(): Currency {
    const code = this.exchangeForm.get('fromCurrency')?.value as string;
    return this.currencies.find(c => c.code === code) ?? this.currencies[0];
  }

  get toCurrency(): Currency {
    const code = this.exchangeForm.get('toCurrency')?.value as string;
    return this.currencies.find(c => c.code === code) ?? this.currencies[1];
  }

  constructor(private fb: FormBuilder, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.exchangeForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['EUR'],
      toCurrency: ['USD'],
    });

    this.subscriptions.push(
      this.currencyService.getSymbols().pipe(take(1)).subscribe(currencies => {
        this.currencies = currencies;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

