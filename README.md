# Finora

A modern personal finance dashboard for tracking income, expenses, budgets, savings goals, and bills — built as a professional frontend portfolio project.

![Finora](public/favicon.svg)

## Overview

Finora helps someone understand their financial picture at a glance: where money comes from, where it goes, how their budgets are holding up, and how close they are to their savings goals. It's built entirely on the frontend with realistic demo data and `localStorage` persistence, so it runs anywhere with no backend, sign-up, or configuration required.

This project is a portfolio piece demonstrating production-grade React architecture, form handling, data visualization, and UI/UX craft — not a real banking product. See **Portfolio Notes** below.

## Features

- **Dashboard** — balance, income, expenses, and savings at a glance, plus income/expense trends, category breakdowns, budget progress, goal progress, recent activity, and upcoming bills.
- **Transactions** — full CRUD with search, filtering (type, category, account), column sorting, and pagination.
- **Budgets** — monthly category budgets with automatic spend tracking, progress bars, and healthy / warning / over-budget states.
- **Savings goals** — target-based goals with deadlines, progress tracking, and one-click contributions.
- **Calendar** — a real monthly calendar built from your own data: bills, transactions, and goal deadlines all appear on the days they fall on.
- **Bills** — recurring and one-off bills with due dates, paid status, and automatic monthly rollover for recurring bills.
- **Analytics** — deeper reporting with date-range, category, and type filters that drive every chart and summary stat live.
- **Financial health score** — a simple, transparent, non-judgmental score derived only from your own data (clearly labeled as an in-app metric, not financial advice).
- **Global search** — `⌘K` / `Ctrl+K` to search across transactions, budgets, goals, and bills.
- **Notifications** — toast feedback for actions, plus a notification center for budget, bill, and goal alerts.
- **Light & dark themes** — two distinct, purpose-built themes (not simple inverses), persisted across sessions.
- **Configurable currency** — USD, EUR, GBP, EGP display formatting.
- **Fully responsive** — desktop, tablet, and mobile layouts down to 375px, with a mobile drawer navigation.
- **Accessible by default** — semantic markup, keyboard navigation, focus states, and `prefers-reduced-motion` support.

## Tech Stack

- **React 19** + **Vite** — fast dev server and build tooling
- **React Router DOM** — client-side routing
- **Recharts** — all data visualization
- **React Hook Form** + **Zod** + **@hookform/resolvers** — every form, validated
- **date-fns** — date math for the calendar, goals, and analytics
- **Sonner** — toast notifications
- **Lucide React** — icon set
- Plain CSS with a custom design system (CSS variables) — no UI framework

## Libraries

| Library | Purpose |
|---|---|
| `react-router-dom` | Routing between Dashboard, Transactions, Budgets, Goals, Calendar, Analytics, and Settings |
| `recharts` | Area, bar, line, and pie/donut charts across the dashboard and analytics |
| `react-hook-form` | Performant, uncontrolled form state for every modal |
| `zod` + `@hookform/resolvers` | Schema validation for every form field |
| `date-fns` | Calendar grid generation, deadlines, date ranges |
| `sonner` | Toast notifications for CRUD actions and alerts |
| `lucide-react` | Icons throughout the UI |

## Project Structure

```
src/
├── components/
│   ├── layout/        # Sidebar, Header, MobileSidebar, PageContainer
│   ├── ui/             # Button, Input, Select, Modal, Badge, Dropdown, Avatar, EmptyState, Loading, ConfirmDialog
│   ├── dashboard/      # Stat cards, charts, and widgets used on the Dashboard
│   ├── transactions/   # Transaction table, filters, modal
│   ├── budgets/        # Budget cards and modal
│   ├── goals/          # Goal cards, modal, add-funds modal
│   ├── bills/          # Bill cards and modal
│   ├── calendar/       # Calendar grid and day-details panel
│   ├── analytics/      # Analytics filters, summary stats, charts
│   ├── settings/       # Profile, preferences, appearance, data sections
│   ├── search/         # Global command-style search (⌘K)
├── pages/              # One top-level page component per route
├── context/            # FinanceContext — all global state and CRUD logic
├── hooks/              # useLocalStorage, useTheme, useDebounce
├── data/               # Seed/demo data generation
├── utils/              # storage, formatters, dateUtils, calculations, validation schemas
├── App.jsx             # Routing + layout shell
├── main.jsx            # Entry point
└── index.css           # Design system + all styles
```

## How to Run

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Data Persistence

Finora stores everything in the browser's `localStorage` under a handful of namespaced keys (`finora_transactions`, `finora_budgets`, `finora_goals`, `finora_bills`, `finora_settings`, `finora_theme`). On first launch, realistic demo data is generated automatically. From then on, your own edits persist across reloads. Corrupted or missing data is handled gracefully and falls back to sane defaults instead of crashing. You can restore the original demo data or wipe everything at any time from **Settings → Data**.

## Responsive Design

Layouts are tuned for 1440px, 1200px, 1024px, 768px, 480px, and 375px breakpoints — from a fixed sidebar and multi-column dashboard on desktop down to a single-column, drawer-navigation mobile experience, with no horizontal scrolling at any size.

## Portfolio Notes

Finora is a **frontend-only portfolio project**. Data is stored locally using `localStorage` and there is no real banking or payment integration, no server, and no account system. It should not be used to manage real financial accounts, and it never asks for real banking credentials or card numbers. The "Financial Health" score is an informational, in-app metric derived only from the data you enter — it is not professional financial advice.

## Future Improvements

- Multi-currency conversion with live exchange rates (currently currency only changes display formatting)
- CSV import/export of transactions
- Shared/household budgets with multiple accounts
- Recurring transaction rules beyond bills
- Optional cloud sync backend
