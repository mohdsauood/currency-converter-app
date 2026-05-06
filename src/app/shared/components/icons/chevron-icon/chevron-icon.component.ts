import { Component } from '@angular/core';

@Component({
    selector: 'app-icon-chevron',
    template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
    </svg>
  `,
    styles: [`:host { display: inline-flex; } :host svg { width: 100%; height: 100%; }`]
})
export class ChevronIconComponent { }
