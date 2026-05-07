import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyCode } from '../../models/currency.model';
import { CurrencyService, ThemeService } from '../../services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  constructor(
    public themeService: ThemeService,
    private currencyService: CurrencyService,
    private router: Router,
  ) { }

  goToHistory(from: CurrencyCode, to: CurrencyCode): void {
    this.currencyService.setConversionState(1, from, to);
    this.router.navigate(['/historical-rates']);
  }
}
