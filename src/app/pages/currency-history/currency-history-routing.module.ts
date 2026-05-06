import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyHistoryComponent } from './currency-history.component';

const routes: Routes = [
  { path: '', component: CurrencyHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyHistoryRoutingModule { }
