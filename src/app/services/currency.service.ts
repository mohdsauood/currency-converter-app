import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, from, of, timer } from 'rxjs';
import { catchError, concatMap, finalize, map, switchMap, takeUntil, tap, toArray } from 'rxjs/operators';
import { Currency, CurrencyCode, ConversionState, ChartDataPoint } from '../models/currency.model';
import { SymbolsResponse, RatesResponse } from '../models/fixer-api.model';
import { environment } from '../../environments/environment';
import { mapSymbolsToCurrencies } from '../helpers/currency.helper';
import { getLastTwelveMonthsData } from '../helpers/historical-data.helper';

const API_BASE = 'https://data.fixer.io/api';
const POLL_INTERVAL_MS = 3_600_000; // 1 hour

@Injectable({ providedIn: 'root' })
export class CurrencyService implements OnDestroy {

    // #region State
    private symbolsSubject = new BehaviorSubject<Currency[]>([]);
    private ratesSubject = new BehaviorSubject<Record<CurrencyCode, number>>({} as Record<CurrencyCode, number>);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private historyLoadingSubject = new BehaviorSubject<boolean>(false);
    private conversionStateSubject = new BehaviorSubject<ConversionState>({ amount: 1, fromCurrency: 'EUR' });
    private destroy$ = new Subject<void>();

    symbols$ = this.symbolsSubject.asObservable();
    rates$ = this.ratesSubject.asObservable();
    isLoading$ = this.loadingSubject.asObservable();
    isHistoryLoading$ = this.historyLoadingSubject.asObservable();
    conversionState$ = this.conversionStateSubject.asObservable();
    // #endregion

    constructor(private http: HttpClient) { }

    // #region Polling
    startPolling(): void {
        this.loadingSubject.next(true);

        timer(0, POLL_INTERVAL_MS).pipe(
            switchMap(() => this.fetchData$().pipe(
                tap(({ symbols: symbolsRes, latest }) => {
                    const currencies: Currency[] = mapSymbolsToCurrencies(symbolsRes.symbols);
                    this.symbolsSubject.next(currencies);
                    this.ratesSubject.next(latest.rates);
                }),
                catchError((error) => {
                    console.error('Failed to load currency data', error);
                    this.symbolsSubject.next([]);
                    this.ratesSubject.next({} as Record<CurrencyCode, number>);
                    return of(undefined);
                }),
                finalize(() => this.loadingSubject.next(false)),
            )),
            takeUntil(this.destroy$),
        ).subscribe();
    }
    // #endregion

    // #region State Queries
    setConversionState(amount: number, fromCurrency: CurrencyCode, toCurrency?: CurrencyCode): void {
        this.conversionStateSubject.next({ amount, fromCurrency, toCurrency });
    }

    getRates(): Record<CurrencyCode, number> {
        return this.ratesSubject.getValue();
    }

    getCurrencyName(code: string): string | null {
        const currency = this.symbolsSubject.getValue().find(c => c.code === code);
        return currency?.name ?? null;
    }
    // #endregion

    // #region Conversion
    getRate(from: CurrencyCode, to: CurrencyCode, rates?: Record<CurrencyCode, number>): number {
        if (from === to) return 1;
        const _rates = rates ?? this.ratesSubject.getValue();
        const rateOf = (code: string) => _rates[code as CurrencyCode] ?? 1;
        return rateOf(to) / rateOf(from);
    }

    convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
        if (from === to) return amount;
        return amount * this.getRate(from, to);
    }
    // #endregion

    // #region Historical Chart
    getHistoricalChartData(from: CurrencyCode, to: CurrencyCode): Observable<ChartDataPoint[]> {
        this.historyLoadingSubject.next(true);
        return this.fetchHistoricalData(from, to).pipe(
            finalize(() => this.historyLoadingSubject.next(false)),
        );
    }
    // #endregion

    // #region HTTP
    private fetchData$() {
        const requests = [
            this.http.get<SymbolsResponse>(
                `${API_BASE}/symbols?access_key=${environment.apiKey}`,
            ),
            this.http.get<RatesResponse>(
                `${API_BASE}/latest?access_key=${environment.apiKey}`,
            ),
        ];

        return from(requests).pipe(
            concatMap(request =>
                timer(1000).pipe(
                    switchMap(() => request),
                ),
            ),
            toArray(),
            map(([symbols, latest]) => ({
                symbols: symbols as SymbolsResponse,
                latest: latest as RatesResponse,
            })),
        );
    }

    private fetchHistoricalData(
        _from: CurrencyCode,
        _to: CurrencyCode,
    ): Observable<ChartDataPoint[]> {

        const { months, dates } = getLastTwelveMonthsData();

        const requests = dates.map(date =>
            this.http.get<RatesResponse>(
                `${API_BASE}/${date}?access_key=${environment.apiKey}`,
            ).pipe(
                catchError(() =>
                    of({
                        success: false,
                        timestamp: 0,
                        base: 'EUR' as CurrencyCode,
                        date,
                        rates: {} as Record<CurrencyCode, number>,
                    }),
                ),
            ),
        );

        return from(requests).pipe(
            concatMap(request =>
                timer(1000).pipe(
                    switchMap(() => request),
                ),
            ),
            toArray(),
            map(responses =>
                responses.map((res, i) => {
                    const rates =
                        res.rates ?? {} as Record<CurrencyCode, number>;

                    return {
                        month: months[i],
                        date: dates[i],
                        rate: parseFloat(
                            this.getRate(_from, _to, rates).toFixed(4),
                        ),
                    };
                }),
            ),
        );
    }
    // #endregion

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
