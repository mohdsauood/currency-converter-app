import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';
import { CurrencyHistoryComponent } from './currency-history.component';
import { CurrencyService } from '../../services';

const mockCurrencyService = {
  conversionState$: new BehaviorSubject({ amount: 1, fromCurrency: 'EUR' }),
  getCurrencyName: jest.fn().mockReturnValue('Euro'),
  getHistoricalChartData: jest.fn().mockReturnValue(of([])),
};

describe('CurrencyHistoryComponent', () => {
  let component: CurrencyHistoryComponent;
  let fixture: ComponentFixture<CurrencyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyHistoryComponent],
      providers: [
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to EUR as from currency', () => {
    expect(component.fromCode).toBe('EUR');
  });

  it('defaults to USD as to currency', () => {
    expect(component.toCode).toBe('USD');
  });
});
