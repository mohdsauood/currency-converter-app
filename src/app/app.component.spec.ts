import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { ThemeService } from './services';
import { CurrencyService } from './services';

const mockThemeService = {
  isDarkMode: false,
  initTheme: jest.fn(),
  toggleTheme: jest.fn(),
};

const mockCurrencyService = {
  symbols$: { subscribe: jest.fn() },
  isLoading$: { subscribe: jest.fn() },
  conversionState$: { subscribe: jest.fn() },
  startPolling: jest.fn(),
  getRates: jest.fn().mockReturnValue({}),
  getRate: jest.fn().mockReturnValue(1),
  getCurrencyName: jest.fn().mockReturnValue(null),
  setConversionState: jest.fn(),
};

describe('AppComponent', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls initTheme on startup', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(mockThemeService.initTheme).toHaveBeenCalled();
  });

  it('starts currency polling on startup', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(mockCurrencyService.startPolling).toHaveBeenCalled();
  });
});
