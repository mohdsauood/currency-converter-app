import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChevronIconComponent } from './components/icons/chevron-icon/chevron-icon.component';
import { SwapIconComponent } from './components/icons/swap-icon/swap-icon.component';
import { TrendIconComponent } from './components/icons/trend-icon/trend-icon.component';

@NgModule({
    declarations: [
        ChevronIconComponent,
        SwapIconComponent,
        TrendIconComponent,
    ],
    imports: [CommonModule],
    exports: [
        ChevronIconComponent,
        SwapIconComponent,
        TrendIconComponent,
    ],
})
export class SharedModule { }
