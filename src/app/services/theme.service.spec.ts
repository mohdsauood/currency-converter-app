import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.clear();
    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initTheme sets isDarkMode true when saved theme is "dark"', () => {
    localStorage.setItem('theme', 'dark');
    service.initTheme();
    expect(service.isDarkMode).toBe(true);
  });

  it('initTheme sets isDarkMode false when saved theme is "light"', () => {
    localStorage.setItem('theme', 'light');
    service.initTheme();
    expect(service.isDarkMode).toBe(false);
  });

  it('initTheme adds dark-mode class to body when dark', () => {
    localStorage.setItem('theme', 'dark');
    service.initTheme();
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });

  it('toggleTheme flips isDarkMode', () => {
    service.isDarkMode = false;
    service.toggleTheme();
    expect(service.isDarkMode).toBe(true);
  });

  it('toggleTheme persists the new theme to localStorage', () => {
    service.isDarkMode = false;
    service.toggleTheme();
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
