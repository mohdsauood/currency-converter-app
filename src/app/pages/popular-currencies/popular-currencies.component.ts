import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Currency, CurrencyCode, PopularCurrencyCard } from '../../models/currency.model';
import { CurrencyService, ConversionState } from '../../services';

const POPULAR_CURRENCIES = ['USD', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD'];

@Component({
  selector: 'app-popular-currencies',
  templateUrl: './popular-currencies.component.html',
  styleUrls: ['./popular-currencies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopularCurrenciesComponent implements OnInit, OnDestroy {

  isLoading = false;
  dataLoaded = false;
  cards: PopularCurrencyCard[] = POPULAR_CURRENCIES.map(code => ({
    code,
    name: '',
    countryCode: code.slice(0, 2).toLowerCase(),
    convertedAmount: null,
  }));

  private conversionState: ConversionState = { amount: 1, fromCurrency: 'EUR' };
  private subscriptions: Subscription[] = [];

  constructor(private currencyService: CurrencyService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.currencyService.isLoading$.subscribe(loading => {
        this.isLoading = loading;
        this.cdr.markForCheck();
      }),

      this.currencyService.symbols$.subscribe(currencies => {
        if (currencies.length > 0) {
          this.dataLoaded = true;
          this.updateCardNames(currencies);
          this.updateCardAmounts();
          this.cdr.markForCheck();
        }
      }),

      this.currencyService.conversionState$.subscribe(state => {
        this.conversionState = state;
        if (this.dataLoaded) {
          this.updateCardAmounts();
          this.cdr.markForCheck();
        }
      })
    );
  }

  private updateCardNames(currencies: Currency[]): void {
    this.cards = this.cards.map(card => {
      const currency = currencies.find(c => c.code === card.code);
      return currency
        ? { ...card, name: currency.name, countryCode: currency.countryCode }
        : card;
    });
  }

  private updateCardAmounts(): void {
    const { amount, fromCurrency } = this.conversionState;
    this.cards = this.cards.map(card => ({
      ...card,
      convertedAmount: this.currencyService.convert(amount, fromCurrency, card.code as CurrencyCode),
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
