import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    public isDarkMode = false;

    /**
     * Reads the saved preference from localStorage (or falls back to the OS
     * colour-scheme preference) and applies the matching theme on startup.
     * Call this once from AppComponent.ngOnInit().
     */
    initTheme(): void {
        const saved = localStorage.getItem('theme');

        if (saved) {
            this.isDarkMode = saved === 'dark';
        } else {
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        this._applyTheme();
    }

    /**
     * Flips the current theme, updates the DOM, and persists the choice so it
     * survives a page refresh.
     */
    toggleTheme(): void {
        this.isDarkMode = !this.isDarkMode;
        this._applyTheme();
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    private _applyTheme(): void {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}
