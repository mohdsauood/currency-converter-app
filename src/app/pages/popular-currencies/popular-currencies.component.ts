import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popular-currencies',
  templateUrl: './popular-currencies.component.html',
  styleUrls: ['./popular-currencies.component.scss']
})
export class PopularCurrenciesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('PopularCurrenciesComponent initialized');
  }

}
