import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ThemeService } from './services';
import { CurrencyService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.themeService.initTheme();
    this.currencyService.startPolling();
  }
}

