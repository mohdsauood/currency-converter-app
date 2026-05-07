import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ChartDataPoint, CurrencyCode } from '../../models/currency.model';
import { CurrencyService } from '../../services';

@Component({
  selector: 'app-currency-history',
  templateUrl: './currency-history.component.html',
  styleUrls: ['./currency-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyHistoryComponent implements OnInit, OnDestroy {
  fromCode: CurrencyCode = 'EUR';
  toCode: CurrencyCode = 'USD';
  fromCurrencyName = 'Euro';
  chartData: ChartDataPoint[] = [];

  private chartTrigger$ = new Subject<{ from: CurrencyCode; to: CurrencyCode }>();
  private subscriptions: Subscription[] = [];

  constructor(public currencyService: CurrencyService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.chartTrigger$.pipe(
        switchMap(({ from, to }) => this.currencyService.getHistoricalChartData(from, to)),
        tap(data => {
          this.chartData = data;
          this.cdr.markForCheck();
        }),
      ).subscribe(),

      this.currencyService.conversionState$.pipe(
        tap(state => {
          this.fromCode = state.fromCurrency;
          this.toCode = state.toCurrency ?? 'USD';
          this.updateFromCurrencyName();
          this.chartTrigger$.next({ from: this.fromCode, to: this.toCode });
          this.cdr.markForCheck();
        }),
      ).subscribe(),
    );
  }

  private updateFromCurrencyName(): void {
    const currencyName = this.currencyService.getCurrencyName(this.fromCode);
    if (currencyName) {
      this.fromCurrencyName = currencyName;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.chartTrigger$.complete();
  }
}

