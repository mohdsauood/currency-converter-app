import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularCurrenciesComponent } from './popular-currencies.component';

describe('PopularCurrenciesComponent', () => {
  let component: PopularCurrenciesComponent;
  let fixture: ComponentFixture<PopularCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularCurrenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
