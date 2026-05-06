import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-history',
  templateUrl: './currency-history.component.html',
  styleUrls: ['./currency-history.component.scss']
})
export class CurrencyHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('CurrencyHistoryComponent initialized');
  }

}
