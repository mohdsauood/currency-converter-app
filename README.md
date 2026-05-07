# Currency Converter App

A modern Angular application for managing currency conversions with a clean, responsive UI built with reactive state, reusable components, and fast Jest-based testing.

## Quick Start

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run linter
npm run lint

# Run tests
npm test

```

The app will be available at `http://localhost:4200`

## Notes

- If the API fails with a rate-limit error such as `type: rate_limit_reached` and `info: You have exceeded the maximum rate limitation allowed on your subscription plan`, add your own new API key in `src/environments/environment.ts`, or set `useMockData: true` to use mock data and test the application locally.

## Technical Highlights

- Angular 13 with modular architecture
- Reactive state management with RxJS
- HttpClient-based API integration
- SCSS for modular styling
- Jest for unit testing
- ESLint and Stylelint for code quality

## Available Scripts

- `npm start` - Start the Angular dev server
- `npm run lint` - Run Angular ESLint
- `npm test` - Run Jest unit tests

## Project Structure

```text
src/
├── app/
│   ├── components/              # Reusable UI components
│   │   ├── currency-exchanger/  # Main conversion form and results
│   │   ├── historical-chart/    # Conversion history chart view
│   │   ├── layout/              # App shell wrapper
│   │   └── navbar/              # Top navigation and theme toggle
│   ├── pages/                   # Feature pages
│   │   └── currency-history/    # Historical rates page
│   ├── services/                # Business logic and API access
│   │   └── currency.service.ts  # Currency conversion service
│   ├── helpers/                 # Shared helper utilities
│   ├── models/                  # TypeScript interfaces and types
│   ├── mock-data/               # Mock responses for testing and development
│   ├── app.module.ts            # Root Angular module
│   └── app-routing.module.ts    # Application routes
├── assets/                      # Static assets
├── environments/                # Environment-specific configuration
├── styles/                      # Global theme and SCSS partials
├── styles.scss                  # Global stylesheet entry point
└── main.ts                      # Application bootstrap
```

