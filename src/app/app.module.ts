import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './components/layout';
import { PopularCurrenciesModule } from './pages/popular-currencies';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, LayoutModule, PopularCurrenciesModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
