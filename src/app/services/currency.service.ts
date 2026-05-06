import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, forkJoin, of, timer } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Currency, CurrencyCode, ConversionState, SymbolsResponse, RatesResponse } from '../models/currency';
import { environment } from '../../environments/environment';
import { MOCK_RATES_RESPONSE } from '../mock-data/mock-rates';
import { MOCK_SYMBOLS_RESPONSE } from '../mock-data/mock-symbols';

const API_BASE = 'https://data.fixer.io/api';
const POLL_INTERVAL_MS = 3_600_000; // 1 hour

@Injectable({ providedIn: 'root' })
export class CurrencyService implements OnDestroy {
    private symbolsSubject = new BehaviorSubject<Currency[]>([]);
    private ratesSubject = new BehaviorSubject<Record<CurrencyCode, number>>({} as Record<CurrencyCode, number>);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private conversionStateSubject = new BehaviorSubject<ConversionState>({ amount: 1, fromCurrency: 'EUR' });
    private destroy$ = new Subject<void>();

    symbols$ = this.symbolsSubject.asObservable();
    rates$ = this.ratesSubject.asObservable();
    isLoading$ = this.loadingSubject.asObservable();
    conversionState$ = this.conversionStateSubject.asObservable();

    constructor(private http: HttpClient) { }

    startPolling(): void {
        this.loadingSubject.next(true);

        timer(0, POLL_INTERVAL_MS).pipe(
            switchMap(() => this.fetchData$().pipe(
                tap(({ symbols: symbolsRes, latest }) => {
                    const currencies: Currency[] = Object.entries(symbolsRes.symbols).map(([code, name]) => ({
                        code,
                        name,
                        countryCode: code.slice(0, 2).toLowerCase(),
                    }));
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

    private fetchData$() {
        // added mockdata to avoid reaching fixer api free limit
        return environment.useMockData
            ? of({ symbols: MOCK_SYMBOLS_RESPONSE as SymbolsResponse, latest: MOCK_RATES_RESPONSE as RatesResponse })
            : forkJoin({
                symbols: this.http.get<SymbolsResponse>(
                    `${API_BASE}/symbols?access_key=${environment.apiKey}`
                ),
                latest: this.http.get<RatesResponse>(
                    `${API_BASE}/latest?access_key=${environment.apiKey}`
                ),
            });
    }

    setConversionState(amount: number, fromCurrency: CurrencyCode): void {
        this.conversionStateSubject.next({ amount, fromCurrency });
    }

    convert(amount: number, from: string, to: string): number {
        if (from === to) return amount;
        const rates = this.ratesSubject.getValue();
        const fromRate = rates[from as CurrencyCode] ?? 1;
        const toRate = rates[to as CurrencyCode] ?? 1;
        const amountInEur = amount / fromRate;
        return amountInEur * toRate;
    }

    getRates(): Record<CurrencyCode, number> {
        return this.ratesSubject.getValue();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
