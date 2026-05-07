import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { CurrencyExchangerComponent } from './currency-exchanger.component';
import { CurrencyService } from '../../services';

const mockCurrencyService = {
  symbols$: new BehaviorSubject([]),
  isLoading$: new BehaviorSubject(false),
  conversionState$: new BehaviorSubject({ amount: 1, fromCurrency: 'EUR' }),
  getRates: jest.fn().mockReturnValue({}),
  getRate: jest.fn().mockReturnValue(1.2),
  setConversionState: jest.fn(),
};

describe('CurrencyExchangerComponent', () => {
  let component: CurrencyExchangerComponent;
  let fixture: ComponentFixture<CurrencyExchangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [CurrencyExchangerComponent],
      providers: [
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyExchangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form initializes with amount 1, EUR and USD', () => {
    expect(component.exchangeForm.value.amount).toBe(1);
    expect(component.exchangeForm.value.fromCurrency).toBe('EUR');
    expect(component.exchangeForm.value.toCurrency).toBe('USD');
  });

  it('form is valid with default values', () => {
    expect(component.exchangeForm.valid).toBe(true);
  });
});
