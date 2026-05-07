import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { PopularCurrenciesComponent } from './popular-currencies.component';
import { CurrencyService } from '../../services';

const mockCurrencyService = {
  isLoading$: new BehaviorSubject(false),
  symbols$: new BehaviorSubject([]),
  conversionState$: new BehaviorSubject({ amount: 1, fromCurrency: 'EUR' }),
  getRate: jest.fn().mockReturnValue(1),
};

describe('PopularCurrenciesComponent', () => {
  let component: PopularCurrenciesComponent;
  let fixture: ComponentFixture<PopularCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopularCurrenciesComponent],
      providers: [
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes 9 popular currency cards', () => {
    expect(component.cards).toHaveLength(9);
  });

  it('isLoading is false initially', () => {
    expect(component.isLoading).toBe(false);
  });
});
