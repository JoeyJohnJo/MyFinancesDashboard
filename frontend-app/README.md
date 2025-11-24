# MyFinances Dashboard - Frontend

Modern financial management dashboard built with Svelte and Vite.

## Features

- 📊 **Dashboard**: Overview of your financial health with stats and summaries
- 💸 **Expenses**: Track and manage your expenses with card associations
- 🎯 **Goals**: Set and monitor financial goals with progress tracking
- 📈 **Investments**: Manage investments and track applications
- 📅 **Planning**: View comprehensive financial planning breakdown
- 💳 **Cards**: Manage credit and debit cards
- 🏦 **Banks**: Manage bank information
- 💰 **Income**: Track income sources

## Tech Stack

- **Svelte 4.2.0**: Lightweight reactive framework
- **Vite 5.0.0**: Fast build tool and dev server
- **svelte-routing**: Client-side routing
- **Modern CSS**: Custom styling with Poppins font

## Prerequisites

- Node.js v20.10.0 or higher
- npm (latest version recommended)
- Backend API running on `http://localhost:8080`

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## API Configuration

The frontend is configured to proxy API requests to the backend:

- **Development**: Vite proxy forwards `/api/*` requests to `http://localhost:8080`
- **Production**: Update the API base URL in `src/lib/services/api.js`

## Project Structure

```
frontend-app/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable components
│   │   │   ├── Header.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   └── Modal.svelte
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   └── utils.js         # Utility functions
│   ├── routes/              # Page components
│   │   ├── Dashboard.svelte
│   │   ├── Expenses.svelte
│   │   ├── Goals.svelte
│   │   ├── Investments.svelte
│   │   ├── Planning.svelte
│   │   ├── Cards.svelte
│   │   ├── Banks.svelte
│   │   └── Receitas.svelte
│   ├── App.svelte           # Main app component
│   ├── main.js              # Entry point
│   └── app.css              # Global styles
├── index.html
├── vite.config.js
├── svelte.config.js
└── package.json
```

## Design System

- **Primary Color**: #4169e1 (Royal Blue)
- **Background**: #f0f5ff (Light Blue)
- **Font**: Poppins
- **Layout**: Fixed header (70px) + Fixed sidebar (100px) + Main content

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Notes

- Make sure the backend API is running before starting the frontend
- The application uses a fixed layout with header and sidebar
- All API calls are centralized in `src/lib/services/api.js`
- Currency formatting uses Brazilian Real (R$)
- Date formatting uses Brazilian format (DD/MM/YYYY)

