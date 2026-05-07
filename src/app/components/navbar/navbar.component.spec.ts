import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NavbarComponent } from './navbar.component';
import { CurrencyService, ThemeService } from '../../services';

const mockThemeService = {
  isDarkMode: false,
  initTheme: jest.fn(),
  toggleTheme: jest.fn(),
};

const mockCurrencyService = {
  symbols$: { subscribe: jest.fn() },
  isLoading$: { subscribe: jest.fn() },
  conversionState$: { subscribe: jest.fn() },
  setConversionState: jest.fn(),
  getRates: jest.fn().mockReturnValue({}),
  getRate: jest.fn().mockReturnValue(1),
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes themeService publicly', () => {
    expect(component.themeService).toBeTruthy();
  });
});
