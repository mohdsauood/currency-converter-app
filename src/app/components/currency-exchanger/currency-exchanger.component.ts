import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Currency, CurrencyCode } from '../../models/currency.model';
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
  isHistoryPage = false;

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
    const from = this.exchangeForm.get('fromCurrency')?.value as CurrencyCode;
    const to = this.exchangeForm.get('toCurrency')?.value as CurrencyCode;
    const rate = this.currencyService.getRate(from, to);
    return `1 ${from} = ${rate.toFixed(4)} ${to}`;
  }

  constructor(private fb: FormBuilder, private currencyService: CurrencyService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.exchangeForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['EUR'],
      toCurrency: ['USD'],
    });

    // Detect history route (initial + changes)
    this.isHistoryPage = this.router.url.includes('historical-rates');
    this.subscriptions.push(
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
      ).subscribe((e) => {
        this.isHistoryPage = (e as NavigationEnd).url.includes('historical-rates');
        this.cdr.markForCheck();
      }),

      this.currencyService.symbols$.subscribe(currencies => {
        this.currencies = currencies;
      }),

      this.currencyService.conversionState$.subscribe(state => {
        const current = this.exchangeForm.value;
        if (
          current.fromCurrency !== state.fromCurrency ||
          (state.toCurrency && current.toCurrency !== state.toCurrency)
        ) {
          this.exchangeForm.patchValue({
            fromCurrency: state.fromCurrency,
            ...(state.toCurrency ? { toCurrency: state.toCurrency } : {}),
          }, { emitEvent: false });
          this.cdr.markForCheck();
        }
      }),
    );

    // Emit initial default state
    this.currencyService.setConversionState(
      this.exchangeForm.value.amount,
      this.exchangeForm.value.fromCurrency as CurrencyCode,
      this.exchangeForm.value.toCurrency as CurrencyCode,
    );
  }

  onConvert(): void {
    if (this.exchangeForm.invalid) {
      this.exchangeForm.markAllAsTouched();
      return;
    }
    const { amount, fromCurrency, toCurrency } = this.exchangeForm.value;
    this.convertedAmount = this.currencyService.convert(amount, fromCurrency as CurrencyCode, toCurrency as CurrencyCode);
    this.currencyService.setConversionState(amount, fromCurrency as CurrencyCode, toCurrency as CurrencyCode);
  }

  swapCurrencies(): void {
    const from = this.exchangeForm.get('fromCurrency')?.value;
    const to = this.exchangeForm.get('toCurrency')?.value;
    this.exchangeForm.patchValue({ fromCurrency: to, toCurrency: from });
    this.onConvert();
  }

  goToHistory(): void {
    const { amount, fromCurrency, toCurrency } = this.exchangeForm.value;
    this.currencyService.setConversionState(amount, fromCurrency as CurrencyCode, toCurrency as CurrencyCode);
    this.router.navigate(['/historical-rates']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

