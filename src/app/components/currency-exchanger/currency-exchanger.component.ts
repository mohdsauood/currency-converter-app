import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Currency, CurrencyCode } from '../../models/currency';
import { CurrencyService } from '../../services';

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyExchangerComponent implements OnInit, OnDestroy {

  exchangeForm!: FormGroup;
  currencies: Currency[] = [];
  convertedAmount: number | null = null;

  isLoading$ = this.currencyService.isLoading$;
  currencies$ = this.currencyService.symbols$;

  private subscriptions: Subscription[] = [];

  get amountControl(): AbstractControl | null {
    return this.exchangeForm.get('amount');
  }

  get fromCurrency(): Currency {
    const code = this.exchangeForm.get('fromCurrency')?.value as string;
    return this.currencies.find(c => c.code === code) ?? { code: code || 'EUR', name: '', countryCode: (code || 'EUR').slice(0, 2).toLowerCase() };
  }

  get toCurrency(): Currency {
    const code = this.exchangeForm.get('toCurrency')?.value as string;
    return this.currencies.find(c => c.code === code) ?? { code: code || 'USD', name: '', countryCode: (code || 'USD').slice(0, 2).toLowerCase() };
  }

  get displayRate(): string {
    const rates = this.currencyService.getRates();
    if (!rates || Object.keys(rates).length === 0) return '';
    const from = this.exchangeForm.get('fromCurrency')?.value as string;
    const to = this.exchangeForm.get('toCurrency')?.value as string;
    const rate = this.currencyService.convert(1, from, to);
    return `1 ${from} = ${rate.toFixed(4)} ${to}`;
  }

  constructor(private fb: FormBuilder, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.exchangeForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['EUR'],
      toCurrency: ['USD'],
    });

    this.subscriptions.push(
      this.currencyService.symbols$.subscribe(currencies => {
        this.currencies = currencies;
      }),
    );

    // Emit initial default state so popular cards populate immediately
    this.currencyService.setConversionState(
      this.exchangeForm.value.amount,
      this.exchangeForm.value.fromCurrency as CurrencyCode,
    );
  }

  onConvert(): void {
    if (this.exchangeForm.invalid) {
      this.exchangeForm.markAllAsTouched();
      return;
    }
    const { amount, fromCurrency, toCurrency } = this.exchangeForm.value;
    this.convertedAmount = this.currencyService.convert(amount, fromCurrency, toCurrency);
    this.currencyService.setConversionState(amount, fromCurrency as CurrencyCode);
  }

  swapCurrencies(): void {
    const from = this.exchangeForm.get('fromCurrency')?.value;
    const to = this.exchangeForm.get('toCurrency')?.value;
    this.exchangeForm.patchValue({ fromCurrency: to, toCurrency: from });
    this.onConvert();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

