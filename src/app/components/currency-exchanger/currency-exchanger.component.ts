import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.scss']
})
export class CurrencyExchangerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('CurrencyExchangerComponent initialized');
  }

}
