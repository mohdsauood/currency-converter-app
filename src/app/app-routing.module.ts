import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopularCurrenciesComponent } from './pages/popular-currencies';

const routes: Routes = [
  { path: '', component: PopularCurrenciesComponent },
  {
    path: 'historical-rates',
    loadChildren: () =>
      import('./pages/currency-history').then(m => m.CurrencyHistoryModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
