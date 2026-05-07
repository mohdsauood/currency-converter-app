import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { take } from 'rxjs/operators';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CurrencyService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRate returns 1 when from and to are the same currency', () => {
    expect(service.getRate('USD', 'USD')).toBe(1);
  });

  it('getRate calculates cross rate from provided rates', () => {
    const rates = { USD: 1.2, GBP: 0.8 } as any;
    expect(service.getRate('USD', 'GBP', rates)).toBeCloseTo(0.8 / 1.2);
  });

  it('getCurrencyName returns null when no symbols are loaded', () => {
    expect(service.getCurrencyName('USD')).toBeNull();
  });

  it('getRates returns empty object initially', () => {
    expect(service.getRates()).toEqual({});
  });

  it('setConversionState emits the updated state', (done) => {
    service.setConversionState(50, 'USD');
    service.conversionState$.pipe(take(1)).subscribe(state => {
      expect(state.amount).toBe(50);
      expect(state.fromCurrency).toBe('USD');
      done();
    });
  });
});
